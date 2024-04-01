module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-config-prettier'
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    // 'max-nesting-depth': 4,
    // 'selector-max-compound-selectors': 4
    // indentation: [2, { baseIndentLevel: 1 }]
  }
};
