module.exports =  {
  root: true,

  env: {
    browser: true,
  },

  extends: [
    'airbnb-base',
    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    // 'plugin:vue/essential' // Priority A: Essential (Error Prevention)
    // 'plugin:vue/strongly-recommended' // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    "@typescript-eslint"
  ],
  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },

  // add your custom rules here
  rules: {
    'no-param-reassign': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-mutable-exports': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-use-before-define': 'off',
    'no-return-assign': 'off',
    'vue/multi-word-component-names': 'off',
    'no-promise-executor-return': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'no-throw-literal': 'off',
    'class-methods-use-this': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 0,
    'allow-parens': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
