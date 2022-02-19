module.exports = {
  env: {
    commonjs: true,
    es2021  : true,
    node    : true,
  },
  extends      : ['airbnb-base'],
  parserOptions: { ecmaVersion: 12 },
  rules        : {
    'no-console'          : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger'         : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style'     : ['warn', 'windows'],
    'object-curly-newline': ['error', {
      ObjectExpression : { minProperties: 6, multiline: true, consistent: true },
      ObjectPattern    : { minProperties: 6, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 6, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 6, multiline: true, consistent: true },
    }],
    'nonblock-statement-body-position': ['error', 'any'],
    curly                             : [
      'error',
      'multi-or-nest',
      'consistent',
    ],
    'max-len'    : ['error', 130],
    'key-spacing': ['error', {
      singleLine: {
        beforeColon: false,
        afterColon : true,
      },
      multiLine: { align: 'colon' },
    }],
  },
};
