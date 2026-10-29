module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-coverage'
    ],
    files: ['src/tests/**/*.spec.js', 'src/tests/**/*.spec.jsx'],
    preprocessors: {
      'src/tests/**/*.spec.js': ['webpack'],
      'src/tests/**/*.spec.jsx': ['webpack']
    },
    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            resolve: { fullySpecified: false },
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ],
                plugins: [['istanbul', { exclude: ['src/tests/**'] }]]
              }
            }
          }
        ]
      }
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },
    browsers: ['ChromeHeadless'],
    singleRun: true
  })
}