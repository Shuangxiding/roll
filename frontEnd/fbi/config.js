module.exports = {
  template: 'webpack2',
  templateDescription: 'Project template with Webpack 2, Koa 2, Postcss and Babel 6.',
  server: {
    root: 'dst/',
    host: 'localhost',
    port: 8888
  },
  npm: {
    alias: 'tnpm',
    options: ''
    // options: '--registry=https://registry.npm.taobao.org'
  },
  alias: {
    b: 'build',
    w: 'watch',
    s: 'serve',
    c: 'clean'
  }
}