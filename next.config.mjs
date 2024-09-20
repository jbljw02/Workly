import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false, // SVG 최적화를 비활성화 (선택 사항)
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;