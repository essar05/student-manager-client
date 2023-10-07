module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',

  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  // This plugin's options
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',

  importOrder: [
    '^react$',
    '^react-dom',

    '<THIRD_PARTY_MODULES>',
    '',

    '^../(.*)', // relative includes, usually more general
    '^[./]', // local "." includes
    '',
  ],
  importOrderSeparation: true,
}
