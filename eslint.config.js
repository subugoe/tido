import js from "@eslint/js";
import globals from "globals";
import react from 'eslint-plugin-react';
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    ignores: ['/dist', '/tests'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/jsx-curly-spacing": ["error", {"when": "never"}],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/function-component-definition": ["error", { "namedComponents": "arrow-function" }],
      "@/quotes": [
        "error",
        "single",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      semi: ["error", "never"],
      "object-curly-spacing": ["error", "always"]
    },
  }
);
