const cjs = process.env.CJS === 'true'

module.exports = {
  files: [`${cjs ? 'cjs' : 'lib'}/**/*.spec.js`],
  require: cjs ? [] : ['esm'],
  verbose: true,
}
