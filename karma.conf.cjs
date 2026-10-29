const path = require('path')

// Pruebas unitarias con Jasmine + Karma sobre los componentes TSX.
// Karma usa su propio webpack (no el de Next): Babel quita los tipos de TypeScript
// y transforma JSX; istanbul instrumenta el código para medir la cobertura.
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
    files: [
      'src/tests/**/*.spec.ts',
      'src/tests/**/*.spec.tsx',
      // Las imágenes se sirven (sin incluirse) para que los <img> no den 404 en las pruebas
      { pattern: 'public/img/*', included: false, served: true, watched: false }
    ],
    proxies: { '/img/': '/base/public/img/' },
    preprocessors: {
      'src/tests/**/*.spec.ts': ['webpack'],
      'src/tests/**/*.spec.tsx': ['webpack']
    },
    webpack: {
      mode: 'development',
      devtool: false,
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
          '@': path.resolve(__dirname, 'src'),
          // Mocks: next/navigation y next/link necesitan el router de Next, que no existe en Karma
          'next/navigation': path.resolve(__dirname, 'src/tests/mocks/next-navigation.ts'),
          'next/link': path.resolve(__dirname, 'src/tests/mocks/next-link.tsx')
        }
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                  '@babel/preset-typescript'
                ],
                plugins: [['istanbul', { exclude: ['src/tests/**', 'src/app/layout.tsx'] }]]
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
        { type: 'text', subdir: '.', file: 'resumen.txt' },
        { type: 'text-summary' }
      ],
      // Si la cobertura baja de estos valores, `npm test` falla
      check: {
        global: { statements: 85, branches: 80, functions: 85, lines: 85 }
      }
    },
    browsers: ['ChromeHeadless'],
    // Para ejecutar en Linux/CI como root: npm test -- --browsers ChromeHeadlessSinSandbox
    customLaunchers: {
      ChromeHeadlessSinSandbox: { base: 'ChromeHeadless', flags: ['--no-sandbox'] }
    },
    singleRun: true
  })
}
