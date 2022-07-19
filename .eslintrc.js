const { defineConfig } = require("eslint-define-config");
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
  },
  // 集成规则
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser", // 指定解析器
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": "off", // 关闭禁止使用any
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off", // 关闭禁止使用@ts-指令
    "@typescript-eslint/no-empty-function": "off", // 关闭禁止非空函数
    "@typescript-eslint/explicit-function-return-type": "off", // 关闭函数和类方法的显式返回类型。
    "vue/multi-word-component-names": "off", // 关闭组件名称必须为多个单词组成
    "@typescript-eslint/explicit-module-boundary-types": "off", // 关闭导出函数必须含有类型说明
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "vue/require-default-prop": "off",
  },
  // 配置全局变量，否则会警告
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
});
