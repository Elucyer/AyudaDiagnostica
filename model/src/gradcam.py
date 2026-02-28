import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image


class GradCAM:
    """Grad-CAM para visualizar qué regiones activan la predicción.

    Genera un mapa de calor que señala las áreas de la imagen
    que más influyeron en la decisión del modelo.
    """

    def __init__(self, model, target_layer=None):
        self.model = model
        self.model.eval()

        # Por defecto, usar la última capa convolucional del EfficientNet
        if target_layer is None:
            self.target_layer = model.features[-1]
        else:
            self.target_layer = target_layer

        self.gradients = None
        self.activations = None

        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0].detach()

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate(self, input_tensor):
        """Genera el mapa de calor Grad-CAM para una imagen.

        Args:
            input_tensor: Tensor (1, 3, H, W) normalizado.

        Returns:
            heatmap: numpy array (H, W) con valores entre 0 y 1.
            prediction: probabilidad de metástasis.
        """
        self.model.zero_grad()

        output = self.model(input_tensor)
        prediction = torch.sigmoid(output).item()

        output.backward()

        # Pesos globales: promedio de gradientes por canal
        weights = self.gradients.mean(dim=[2, 3], keepdim=True)  # (1, C, 1, 1)

        # Combinación lineal ponderada de activaciones
        cam = (weights * self.activations).sum(dim=1, keepdim=True)  # (1, 1, h, w)
        cam = F.relu(cam)  # Solo activaciones positivas

        # Redimensionar al tamaño de la imagen original
        cam = F.interpolate(
            cam, size=input_tensor.shape[2:], mode="bilinear", align_corners=False
        )

        # Normalizar entre 0 y 1
        cam = cam.squeeze().cpu().numpy()
        if cam.max() > 0:
            cam = (cam - cam.min()) / (cam.max() - cam.min())

        return cam, prediction


class GradCAMPlusPlus:
    """Grad-CAM++ para visualización mejorada con múltiples focos de activación.

    Mejora sobre Grad-CAM usando pesos de segundo orden que dan mayor
    precisión cuando hay varios focos de metástasis en la misma imagen.
    Referencia: Chattopadhyay et al., 2018.
    """

    def __init__(self, model, target_layer=None):
        self.model = model
        self.model.eval()

        if target_layer is None:
            self.target_layer = model.features[-1]
        else:
            self.target_layer = target_layer

        self.gradients = None
        self.activations = None

        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output

        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0]

        self.target_layer.register_forward_hook(forward_hook)
        self.target_layer.register_full_backward_hook(backward_hook)

    def generate(self, input_tensor):
        """Genera el mapa de calor Grad-CAM++ para una imagen.

        Args:
            input_tensor: Tensor (1, 3, H, W) normalizado.

        Returns:
            heatmap: numpy array (H, W) con valores entre 0 y 1.
            prediction: probabilidad de metástasis.
        """
        self.model.zero_grad()

        output = self.model(input_tensor)
        prediction = torch.sigmoid(output).item()

        output.backward()

        grads = self.gradients          # (1, C, h, w)
        acts = self.activations         # (1, C, h, w)

        # Pesos alpha de segundo orden (Grad-CAM++)
        grads_power_2 = grads ** 2
        grads_power_3 = grads ** 3
        sum_acts = acts.sum(dim=[2, 3], keepdim=True)   # (1, C, 1, 1)

        eps = 1e-7
        alpha = grads_power_2 / (
            2 * grads_power_2 + sum_acts * grads_power_3 + eps
        )
        # Solo conservar pesos donde los gradientes son positivos
        alpha = alpha * (grads > 0).float()

        # Peso por canal: suma espacial de (alpha * ReLU(grad))
        weights = (alpha * F.relu(grads)).sum(dim=[2, 3], keepdim=True)  # (1, C, 1, 1)

        # Mapa de activación ponderado
        cam = (weights * acts).sum(dim=1, keepdim=True)  # (1, 1, h, w)
        cam = F.relu(cam)

        cam = F.interpolate(
            cam, size=input_tensor.shape[2:], mode="bilinear", align_corners=False
        )

        cam = cam.squeeze().cpu().detach().numpy()
        if cam.max() > 0:
            cam = (cam - cam.min()) / (cam.max() - cam.min())

        return cam, prediction


def apply_heatmap(image_array, heatmap, alpha=0.4):
    """Superpone el heatmap Grad-CAM sobre la imagen original.

    Args:
        image_array: numpy array (H, W, 3) con valores 0-255.
        heatmap: numpy array (H, W) con valores entre 0 y 1.
        alpha: transparencia del heatmap.

    Returns:
        overlayed: numpy array (H, W, 3) con el heatmap superpuesto.
    """
    import matplotlib.cm as cm

    colormap = cm.jet(heatmap)[:, :, :3]  # (H, W, 3) RGB
    colormap = (colormap * 255).astype(np.uint8)

    image_normalized = image_array.astype(np.float32)
    colormap_float = colormap.astype(np.float32)

    overlayed = (1 - alpha) * image_normalized + alpha * colormap_float
    overlayed = np.clip(overlayed, 0, 255).astype(np.uint8)

    return overlayed


def draw_bounding_box(image_array, heatmap, threshold=0.5, color=(255, 80, 80), thickness=2):
    """Dibuja el bounding box de la región de mayor activación sobre la imagen.

    Umbraliza el heatmap en `threshold`, calcula el rectángulo mínimo que
    engloba la región activa y lo dibuja sobre una copia de la imagen original.

    Args:
        image_array: numpy array (H, W, 3) con valores 0-255.
        heatmap: numpy array (H, W) con valores entre 0 y 1.
        threshold: umbral de activación para definir región sospechosa.
        color: color RGB del rectángulo.
        thickness: grosor en píxeles del borde.

    Returns:
        numpy array (H, W, 3) con el bounding box dibujado, o la imagen
        sin modificar si ningún píxel supera el umbral.
    """
    result = image_array.copy()
    mask = heatmap >= threshold

    if not mask.any():
        return result

    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    y_min, y_max = int(rows[0]), int(rows[-1])
    x_min, x_max = int(cols[0]), int(cols[-1])

    h, w = result.shape[:2]
    y_min = max(0, y_min)
    y_max = min(h - 1, y_max)
    x_min = max(0, x_min)
    x_max = min(w - 1, x_max)

    for t in range(thickness):
        if y_min + t < h:
            result[y_min + t, x_min:x_max + 1] = color
        if y_max - t >= 0:
            result[y_max - t, x_min:x_max + 1] = color
        if x_min + t < w:
            result[y_min:y_max + 1, x_min + t] = color
        if x_max - t >= 0:
            result[y_min:y_max + 1, x_max - t] = color

    return result


def heatmap_to_base64(overlayed_image):
    """Convierte la imagen con heatmap a string base64 (para la API)."""
    import base64
    from io import BytesIO

    img = Image.fromarray(overlayed_image)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")
