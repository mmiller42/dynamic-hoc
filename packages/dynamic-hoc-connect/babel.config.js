const config = require('../../configs/babel.config.json')

module.exports = {
  ...config,
  plugins: [...config.plugins, '@babel/plugin-transform-react-jsx'],
}
