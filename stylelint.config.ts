import type { Config } from 'stylelint';

const config: Config = {
  'extends': ['stylelint-config-standard'],
  'ignoreFiles': ['coverage/**/*', '.next/**/*', 'dist/**/*', 'node_modules/**/*', 'build/**/*'],
  'rules': {
    'selector-class-pattern': null,
    'at-rule-no-unknown': [
      true,
      {
        'ignoreAtRules': ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'custom-variant', 'theme', 'layer']
      }
    ],
    'import-notation': null,
    'function-no-unknown': [
      true,
      {
        'ignoreFunctions': ['theme']
      }
    ]
  }
}

export default config;