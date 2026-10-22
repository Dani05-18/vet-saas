import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VetSaaS - Plataforma Multitenant para Veterinarias",
  description: "Sistema SaaS de gestión clínica para consultorios y hospitales veterinarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}

