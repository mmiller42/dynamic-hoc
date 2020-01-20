const config = {
  ...require('../../configs/ava.config.js'),
}

if (process.env.CJS !== 'true') {
  config.babel = {
    compileAsTests: ['lib/**/*.spec.app.js'],
    testOptions: {
      presets: [
        ['module:@ava/babel/stage-4', false],
      ],
    },
  }
}

module.exports = config
