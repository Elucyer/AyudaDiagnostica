"""Descarga el dataset PatchCamelyon (PCam) desde Zenodo."""
import os
import sys
import gzip
import shutil
import urllib.request

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# URLs de Zenodo (fuente oficial)
# https://zenodo.org/record/2546921
ZENODO_BASE = "https://zenodo.org/record/2546921/files"

FILES = [
    "camelyonpatch_level_2_split_train_x.h5.gz",
    "camelyonpatch_level_2_split_train_y.h5.gz",
    "camelyonpatch_level_2_split_valid_x.h5.gz",
    "camelyonpatch_level_2_split_valid_y.h5.gz",
    "camelyonpatch_level_2_split_test_x.h5.gz",
    "camelyonpatch_level_2_split_test_y.h5.gz",
]


def download_with_progress(url, filepath):
    """Descarga un archivo mostrando progreso."""
    class ProgressReporter:
        def __init__(self):
            self.last_percent = -1

        def __call__(self, block_num, block_size, total_size):
            if total_size > 0:
                percent = int(block_num * block_size * 100 / total_size)
                percent = min(percent, 100)
                if percent != self.last_percent and percent % 5 == 0:
                    mb_done = block_num * block_size / (1024 * 1024)
                    mb_total = total_size / (1024 * 1024)
                    print(f"\r  Progreso: {percent}% ({mb_done:.0f}/{mb_total:.0f} MB)", end="", flush=True)
                    self.last_percent = percent

    urllib.request.urlretrieve(url, filepath, reporthook=ProgressReporter())
    print()


def decompress_gz(gz_path, out_path):
    """Descomprime un archivo .gz."""
    size_gz = os.path.getsize(gz_path) / (1024 * 1024)
    print(f"  Descomprimiendo ({size_gz:.0f} MB comprimido)...")
    with gzip.open(gz_path, "rb") as f_in:
        with open(out_path, "wb") as f_out:
            shutil.copyfileobj(f_in, f_out)
    size_h5 = os.path.getsize(out_path) / (1024 * 1024)
    print(f"  Descomprimido: {size_h5:.0f} MB")
    os.remove(gz_path)


def main():
    total = len(FILES)
    for i, gz_filename in enumerate(FILES, 1):
        h5_filename = gz_filename.replace(".gz", "")
        h5_path = os.path.join(DATA_DIR, h5_filename)
        gz_path = os.path.join(DATA_DIR, gz_filename)

        if os.path.exists(h5_path):
            size_mb = os.path.getsize(h5_path) / (1024 * 1024)
            print(f"[{i}/{total}] {h5_filename} ya existe ({size_mb:.0f} MB), saltando...")
            continue

        url = f"{ZENODO_BASE}/{gz_filename}"
        print(f"\n[{i}/{total}] Descargando {gz_filename}...")

        try:
            download_with_progress(url, gz_path)
            decompress_gz(gz_path, h5_path)
        except Exception as e:
            print(f"\n  ERROR: {e}")
            for f in [gz_path, h5_path]:
                if os.path.exists(f):
                    os.remove(f)
            sys.exit(1)

    print("\nDescarga completada. Archivos en:", DATA_DIR)
    for f in sorted(os.listdir(DATA_DIR)):
        if f.endswith(".h5"):
            size = os.path.getsize(os.path.join(DATA_DIR, f)) / (1024 * 1024)
            print(f"  {f}: {size:.0f} MB")


if __name__ == "__main__":
    main()
