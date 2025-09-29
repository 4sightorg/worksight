import globals from 'globals';
import baseConfig from '../../eslint.config';

export default [
  ...baseConfig,
  // your Next.js specific rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        React: 'readonly',
      }
    }
  },
  {
    "extends": [
      "plugin:react-hooks/recommended"
    ]
  }
];