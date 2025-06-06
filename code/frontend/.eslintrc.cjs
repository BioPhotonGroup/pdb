module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', 'jsx-a11y'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    //rules: {
    //   'react/prop-types': 'off', // Disable prop-types as we use TypeScript or modern React
    //},
};