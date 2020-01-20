const rootPattern = process.env.CJS === 'true' ? 'cjs' : 'lib'

module.exports = {
  files: [`${rootPattern}/**/*.spec.js`],
  require: ['esm'],
  verbose: true,
}
