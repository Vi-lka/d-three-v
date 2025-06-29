import { FlatCompat } from "@eslint/eslintrc";
// @ts-ignore -- no types for this plugin
import drizzle from "eslint-plugin-drizzle";
// import { importX } from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: [".next", "build", "dist", "node_modules"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      drizzle,
      // "import-x": importX,
    },
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      // importX.flatConfigs.recommended,
      // importX.flatConfigs.typescript,
    ],
    rules: {
      // Common
      "no-console": ["warn", { allow: ["error"] }],
      eqeqeq: ["error", "always"],

      // Typescript
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      // Drizzle
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],

      // FSD Architecture Rules
      // "no-restricted-imports": "off",
      // "@typescript-eslint/no-restricted-imports": [
      //   "error",
      //   {
      //     patterns: [
      //       {
      //         group: ["@/widgets/*/*/**", "!@/widgets/**/index"],
      //         message:
      //           "Import from widgets layer should use public API: '@/widgets/[slice]' instead of '@/widgets/[slice]/[segment]/...'",
      //       },
      //       {
      //         group: ["@/features/*/*/**", "!@/features/**/index"],
      //         message:
      //           "Import from features layer should use public API: '@/features/[slice]' instead of '@/features/[slice]/[segment]/...'",
      //       },
      //       {
      //         group: ["@/entities/*/*/**", "!@/entities/**/index"],
      //         message:
      //           "Import from entities layer should use public API: '@/entities/[slice]' instead of '@/entities/[slice]/[segment]/...'",
      //       },
      //     ],
      //   },
      // ],
      // "import-x/no-named-as-default": "off",
      // "import-x/no-restricted-paths": [
      //   "error",
      //   {
      //     zones: [
      //       {
      //         target: "**/entities/**",
      //         from: ["**/app/**", "**/widgets/**", "**/features/**"],
      //         message:
      //           "Cannot import from higher layers (app, widgets, features) into entities.",
      //       },
      //       {
      //         target: "**/features/**",
      //         from: ["**/app/**", "**/widgets/**"],
      //         message:
      //           "Cannot import from higher layers (app, widgets) into features.",
      //       },
      //       {
      //         target: "**/widgets/**",
      //         from: "**/app/**",
      //         message: "Cannot import from higher layer (app) into widgets.",
      //       },
      //     ],
      //   },
      // ],
      // "import-x/order": [
      //   "error",
      //   {
      //     groups: [
      //       "builtin",
      //       "external",
      //       "internal",
      //       "parent",
      //       "sibling",
      //       "index",
      //     ],
      //     pathGroups: [
      //       {
      //         pattern: "@/**",
      //         group: "internal",
      //         position: "after",
      //       },
      //     ],
      //     "newlines-between": "always",
      //     alphabetize: { order: "asc", caseInsensitive: true },
      //   },
      // ],
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);
