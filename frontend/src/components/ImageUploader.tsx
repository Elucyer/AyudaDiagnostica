"use client";

import { useCallback, useState } from "react";

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onFileSelected, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/^image\/(png|jpeg|tiff)$/)) {
        alert("Solo se aceptan imagenes PNG, JPEG o TIFF.");
        return;
      }
      setPreview(URL.createObjectURL(file));
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}
        ${disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
      `}
      onClick={() => {
        if (!disabled) document.getElementById("file-input")?.click();
      }}
    >
      <input
        id="file-input"
        type="file"
        accept="image/png,image/jpeg,image/tiff"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {preview ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={preview}
            alt="Vista previa"
            className="h-48 w-48 rounded-lg border border-gray-200 object-cover"
          />
          <p className="text-sm text-gray-500">
            Haz clic o arrastra otra imagen para reemplazar
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>
            <p className="text-base font-medium text-gray-700">
              Arrastra una imagen histopatologica aqui
            </p>
            <p className="mt-1 text-sm text-gray-500">
              o haz clic para seleccionar (PNG, JPEG, TIFF)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
