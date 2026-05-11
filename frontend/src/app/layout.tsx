import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AyudaDiagnostica - Deteccion de Metastasis",
  description:
    "Herramienta de apoyo diagnostico para deteccion de metastasis en imagenes histopatologicas usando deep learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
            <a href="/" className="flex items-center gap-2">
              <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <span className="text-lg font-bold text-gray-900">
                AyudaDiagnostica
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Inicio
              </a>
              <a
                href="/dossier"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dossier
              </a>
              <a
                href="/diagnostico"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Diagnostico
              </a>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-8 mt-16">
          <div className="mx-auto max-w-5xl px-6 text-center text-sm text-gray-500">
            <p>
              AyudaDiagnostica &mdash; Herramienta de apoyo diagnostico.
              No sustituye el criterio medico profesional.
            </p>
            <p className="mt-1">
              Modelo: EfficientNet-B3 &middot; Dataset: PatchCamelyon (PCam)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
