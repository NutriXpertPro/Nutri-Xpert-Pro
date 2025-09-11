import "./styles/globals.css";  // Importando os estilos globais
import React from "react";  // Importando React
import Providers from "./providers"; // Provider que inclui Theme e NextAuth

// Exportação do metadata para SEO e informações globais
export const metadata = {
  title: "Nutri Xpert Pro",  // Título do site
  description: "Sistema profissional de gestão nutricional",  // Descrição para SEO
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nxp-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved ? (saved === 'dark') : prefersDark;
                  document.documentElement.classList.toggle('dark', isDark);
                  document.body.classList.toggle('dark', isDark);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00bcd4" />
      </head>
      <body className="h-full overflow-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}