import "./styles/globals.css";
import React from "react";
import Providers from "./providers";

export const metadata = {
  title: "Nutri Xpert Pro",
  description: "Sistema profissional de gestão nutricional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
