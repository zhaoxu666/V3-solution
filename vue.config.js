'use strict'
const path = require('path')
// 引入项目自定义配置
const defaultSettings = require('./src/settings.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'Oscar V3'

const port = process.env.port || process.env.npm_config_port || 9528

module.exports = {
  // 基础路径
  publicPath: '/',
  // 构建输出目录（打包目录）
  outputDir: 'dist',
  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  assetsDir: 'static',
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    // 端口号
    port: port,
    // 配置自动启动浏览器
    open: true,
    // 让浏览器 overlay 同时显示警告和错误
    overlay: {
      warnings: false,
      errors: true
    },
    // 提供在服务器内部先于所有其他中间件执行自定义中间件的功能。这可以用于定义自定义处理程序
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 设置浏览器tag title
    name: name,
    resolve: {
      // 设置别名 @ 就代表 src
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack (config) {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        includes: 'initial'
      }
    ])

    config.plugins.delete('prefetch')

    // set svg-sprite-loader  设置 svg loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 设置 保留空白
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtemlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cachheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10
                },
                elementUI: {
                  name: 'chunk-elementUI',
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
