module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier' ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {

  // disable 
 

  
    "class-methods-use-this": "off",
    "no-param-reassingn": "off",
    "prettier/prettier": "error",
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next"}]
    
          


  },
};
