import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Completely disable unused-vars warning
      "@typescript-eslint/no-unused-expressions": "off",
      
      "@typescript-eslint/no-unused-vars": "off",

      // Disable any other rules you don't want
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
