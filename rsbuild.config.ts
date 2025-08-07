import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
export default defineConfig({
  plugins: [pluginLess(),pluginReact()],
  output:{
    legalComments: 'none',
  },
  server:{
    proxy: {
      // 在开发环境中，可以通过代理解决跨域问题
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }, // 如果需要重写路径
      }
    }
  }
});
