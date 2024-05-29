module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    indent: [
      'warn',
      2,
      {
        SwitchCase: 1,
        MemberExpression: 1,
        ArrayExpression: 1,
        ImportDeclaration: 1,
        FunctionExpression: { body: 1, parameters: 1 },
        FunctionDeclaration: { body: 1, parameters: 1 }
      }],

    'object-curly-spacing': ['error', 'always'],
    // "object-curly-newline": ["error", { multiline: true, consistent: true }],
    /**
      https://eslint.org/docs/latest/rules/no-unused-vars#ignorerestsiblings

      No dar error cuando no utilizamos variables que desestructuramos. De esta
      manera, podemos obtener un nuevo objeto sin ciertas propiedades que
      extraemos al desestructurar.
    */
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'no-multiple-empty-lines': [2, { max: 1, maxEOF: 1 }],
    'no-unreachable': 'error',
    'no-var': 'error',
    camelcase: ['error', { ignoreGlobals: false }]
  }
}
