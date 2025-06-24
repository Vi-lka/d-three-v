/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "server-only", // exact match for "server-only" import
    "^(node:.*)$", // builtin
    "<THIRD_PARTY_MODULES>", // external
    "^@/(.*)$", // internal
    "^[.][.]/", // parent
    "^[./]", // sibling
    "^[./].*index$", // index
  ],
  importOrderSeparation: true,
  importOrderCaseInsensitive: true,
};
