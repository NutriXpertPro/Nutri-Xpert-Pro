/** @type {import('next').NextConfig} */
const nextConfig = {
  // Segurança e DX
  reactStrictMode: true,
  swcMinify: true,

  // Experimentos que você já usa no projeto
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Permitir imagens remotas comuns (ajuste se precisar)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.replit.dev' },
      { protocol: 'https', hostname: '**.replit.app' },
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**.aws.neon.tech' },
    ],
  },

  // Evita que o build quebre por lint/TS em dev (opcional — ligue conforme sua necessidade)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Ajustes finos de webpack sem depender de plugins externos
  webpack(config, { isServer }) {
    // ---------- 1) Tratar SVG sem precisar do @svgr/webpack ----------
    // Primeiro, remova SVG da regra padrão de imagens (que costuma ser um único regex).
    const isRegExp = (v) =>
      Object.prototype.toString.call(v) === '[object RegExp]';

    for (const rule of config.module.rules) {
      // Regras do Next podem ter "oneOf" com várias sub-regras.
      const candidates = Array.isArray(rule.oneOf) ? rule.oneOf : [rule];

      for (const r of candidates) {
        if (r && isRegExp(r.test) && r.test.test('file.png')) {
          // É a regra de imagens; excluímos SVG dela
          r.exclude = Array.isArray(r.exclude)
            ? [...r.exclude, /\.svg$/i]
            : /\.svg$/i;
        }
      }
    }

    // Agora adicionamos nossa própria regra para SVG.
    // Usamos 'asset/resource' para servir os arquivos;
    // se mais tarde você quiser SVG como React component, podemos trocar por @svgr/webpack.
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[contenthash][ext]',
      },
    });

    // ---------- 2) Evitar polyfills desnecessários do Node no browser ----------
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;