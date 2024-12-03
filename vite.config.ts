// @ts-ignore
import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import Layouts from 'vite-plugin-vue-layouts'
import { VitePWA } from 'vite-plugin-pwa'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer as Visualizer } from 'rollup-plugin-visualizer'
import ViteCompression from 'vite-plugin-compression'
import Markdown from 'vite-plugin-vue-markdown'
import Prism from 'markdown-it-prism'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import SvgLoader from 'vite-svg-loader'
import Unocss from 'unocss/vite'
import generateSitemap from 'vite-ssg-sitemap'
import istanbul from 'vite-plugin-istanbul';

function removeDataTestAttrs(node: any) {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop: any) =>
      prop.type === 6 /* NodeTypes.ATTRIBUTE */
        ? prop.name !== 'data-testid'
        : true
    )
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src'),
      '@/utils': path.resolve(__dirname, './src/utils')
    },
  },
  build: {
    sourcemap: true
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      template: {
        compilerOptions: {
          nodeTransforms: process.env.MODE === 'production' ? [removeDataTestAttrs] : [],
        }
      }
    }),
    Pages({
      extensions: ['vue', 'md'],
    }),
    Components({
      extensions: ['vue', 'md', 'tsx', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),
    Layouts(),
    VitePWA({
      registerType: 'autoUpdate',
      mode: 'development',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Ticket System',
        short_name: 'ticket-system',
        theme_color: '#FFFFFF',
        icons: [
          {
            src: '/hammer-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/hammer-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/hammer-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/hammer-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script',
            // urlPattern: /.*\.js/,
            handler: 'NetworkFirst',
          },
        ],
      },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        'pinia',
        'vue-i18n',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/store',
        'src/utils'
      ],
      vueTemplate: true,
    }),
    VueJsx({ optimize: true }),
    ...(command === 'build'
      ? [Visualizer({ filename: `stats.html` })]
      : []
    ),
    ...(process.env.COMPRESS !== '0'
      ? [ViteCompression({}), ViteCompression({ algorithm: 'brotliCompress', ext: '.br' })]
      : []
    ),
    Markdown({
      wrapperClasses: 'markdown-wrapper',
      headEnabled: true,
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItSetup(md) {
        md.use(Prism)
      },
    }),
    VueI18n({
      include: path.resolve(__dirname, './src/locales/**'),
    }),
    SvgLoader({
      svgo: true,
      svgoConfig: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                inlineStyles: {
                  onlyMatchedOnce: false,
                },
              },
            },
          },
        ],
      }
    }),
    Unocss(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: [ '.js', '.ts', '.vue' , '.tsx'],
      requireEnv: true,
    }),
  ],
  server: {
    port: 3500,
    host: '127.0.0.1'
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished() { generateSitemap() },
  },
  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
  },
  test: {
    // environment: 'jsdom',
    environment: 'happy-dom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
    outputFile: {
      json: './coverage/final.json',
      junit: './coverage/junit.xml',
    },
    reporters: ['verbose', 'junit', 'json'],
    coverage: {
      clean: false,
    },
  },
}))
