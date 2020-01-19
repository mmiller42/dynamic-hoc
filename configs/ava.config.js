const rootPattern = process.env.WITH_CJS === 'true' ? '{cjs,lib}' : 'lib'

export default {
  files: [`${rootPattern}/**/*.spec.js`],
  require: ['esm'],
  sources: [`${rootPattern}/**/*.js`],
  verbose: true,
}
