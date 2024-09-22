import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true, // WebAssembly 활성화
    };
    
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false, // SVG 최적화를 비활성화
          },
        },
      ],
    });
    
    return config;
  },
};

export default nextConfig;