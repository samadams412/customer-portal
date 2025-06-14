// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
// Ensure these imports are correct based on your installed packages
// You might need to install 'eslint-plugin-react' if not already present
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint"; // This should be installed as 'typescript-eslint'
import pluginJs from "@eslint/js"; // If you need basic JS recommended rules

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // If you were extending from 'plugin:@typescript-eslint/recommended',
  // you might need to specify the plugin entry point like this:
  // plugins: ["@typescript-eslint"]
});

const eslintConfig = [
  {
    ignores: [
      ".next/",
      "node_modules/",
      "public/",
      "out/",
      "dist/",
      "src/generated/",
      "prisma/generated/",
      "**/*.min.js",
      "**/*.d.ts",
    ],
  },
  pluginJs.configs.recommended, // Basic JS rules
  ...tseslint.configs.recommended, // Recommended TypeScript rules
  // Add React rules explicitly if not covered by next/core-web-vitals extend
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs["jsx-runtime"].rules,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"), // Your existing Next.js extends
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // Consider explicitly disabling rules that are commonly problematic in generated/minified code if ignores don't catch everything
      "no-unused-expressions": "off",
      "no-this-alias": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
