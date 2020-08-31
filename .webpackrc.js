const path = require('path');

export default {
    define: {
        'process.env': {},
        'process.env.APP_ENV': process.env.APP_ENV || 'development', // 自定义环境变量
    },
  entry: 'src/index.js',
  outputPath: process.env.APP_ENV == 'production' ? './call-analytics-prod/' : './call-analytics/',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      publicPath:'/'
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: './',
  hash: true,
  proxy: {
        "/api": {
            "target": "https://rtc-turn4-hsb.easemob.com/",
            "changeOrigin": true,
            "pathRewrite": { "^/api" : "" }
        }
  },
  devtool: 'nosources-source-map'
};
