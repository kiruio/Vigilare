import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    plugins: [
      react(),
      // PWA
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: /(.*?)\.(woff2|woff|ttf)/,
              handler: "CacheFirst",
              options: {
                cacheName: "file-cache",
              },
            },
            {
              urlPattern:
                /(.*?)\.(webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
              },
            },
          ],
        },
        manifest: {
          name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          short_name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          description: "Vigilare 站点监测",
          display: "standalone",
          start_url: "/",
          theme_color: "#fff",
          background_color: "#efefef",
          icons: [
            {
              src: "/images/favicon.png",
              sizes: "144x144",
              type: "image/png",
            },
          ],
        },
      }),
      // viteCompression
      viteCompression(),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
          passes: 3 // 增加压缩次数
        },
      },
      sourcemap: false,
      manualChunks(id) {
        if (id.includes('node_modules')) {
          // 精确分割大依赖
          if (id.includes('/antd/')) return 'antd';
          if (id.includes('/recharts/')) return 'recharts';
          if (id.includes('/@icon-park/')) return 'icons';
          if (id.includes('/dayjs/')) return 'dayjs';
          return 'vendor';
        }
      }
    }
  });
