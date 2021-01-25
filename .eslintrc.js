module.exports = {
  // Don't merge into parent configs.
  root: true,

  // Enable modern browser globals.
  env: {
    es2020: true,
    browser: true,
  },

  // Enable ES Module mode.
  parserOptions: {
    sourceType: "module",
  },

  extends: [
    // Core
    "eslint:recommended",

    // Import Plugin
    "plugin:import/errors",

    // Unicorn Plugin
    "plugin:unicorn/recommended",

    // React Plugin
    "plugin:react/recommended",

    // React Hooks Plugin
    "plugin:react-hooks/recommended",

    // React A11Y Plugin
    "plugin:jsx-a11y/strict",

    // Prettier Plugin
    "plugin:prettier/recommended",
    "prettier/react",
  ],
  plugins: ["regex", "graphql"],

  rules: {
    // Core
    "arrow-body-style": "error", // Don't use unnecessary curly braces for arrow functions.
    "capitalized-comments": "error",
    "new-cap": "error", // Require constructor names to begin with a capital letter.
    "new-parens": "error",
    "no-array-constructor": "error",
    "no-console": "error",
    "no-duplicate-imports": ["error", { includeExports: true }],
    "no-else-return": ["error", { allowElseIf: false }],
    "no-extra-bind": "error",
    "no-iterator": "error",
    "no-lonely-if": "error", // In else blocks.
    "no-new-wrappers": "error",
    "no-proto": "error",
    "no-return-await": "error",
    "no-shadow": "error",
    "no-unneeded-ternary": ["error", { defaultAssignment: false }],
    "no-unused-expressions": "error",
    "no-use-before-define": "error",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "operator-assignment": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-exponentiation-operator": "error",
    "prefer-numeric-literals": "error",
    "prefer-object-spread": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "require-await": "error",
    "spaced-comment": "error",
    curly: ["error", "multi"], // Don't use unnecessary curly braces.
    eqeqeq: "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          "..", // No relative parent imports.
          "theme-ui", // This should be internal to the design system.
          "next/link", // Use the custom version that maintains query parameters instead.
        ],
      },
    ],
    // Sort named import members alphabetically.
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
      },
    ],

    // Import Plugin
    "import/no-unused-modules": [
      "error",
      {
        missingExports: true,
        unusedExports: true,
        ignoreExports: ["pages", "./*.js", "subgraph"],
      },
    ],
    // Don't allow reaching into modules, except for Next.js imports, and assets.
    "import/no-internal-modules": [
      "error",
      {
        allow: ["next/*", "_pages/**", "subgraph/**"],
      },
    ],
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
    "import/extensions": "error", // Don't use unnecessary file extensions.
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "import/newline-after-import": "error",
    "import/no-anonymous-default-export": [
      "error",
      { allowCallExpression: false },
    ],

    // Unicorn Plugin
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          acc: false,
          args: false,
          arr: false,
          err: false,
          prop: false,
          props: false,
          ref: false,
          res: false,
        },
      },
    ],
    "unicorn/no-nested-ternary": "off",
    "unicorn/no-null": "off",
    "unicorn/no-reduce": "off",
    "unicorn/catch-error-name": [
      "error",
      {
        name: "err",
      },
    ],
    "unicorn/custom-error-definition": "error",
    "unicorn/no-keyword-prefix": "error",
    "unicorn/no-unsafe-regex": "error",
    "unicorn/no-unused-properties": "error",
    "unicorn/prefer-flat-map": "error",
    "unicorn/prefer-replace-all": "error",
    "unicorn/string-content": "error",

    // React Plugin
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/prefer-stateless-function": "error",
    "react/function-component-definition": "error",
    "react/self-closing-comp": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-fragments": "error",
    "react/jsx-boolean-value": "error",
    "react/jsx-curly-brace-presence": "error",
    // Force platform agnostic use of the design system.
    "react/forbid-elements": [
      "error",
      {
        forbid: [
          "!--...--",
          "!DOCTYPE",
          "a",
          "abbr",
          "acronym",
          "address",
          "applet",
          "area",
          "article",
          "aside",
          "audio",
          "b",
          "base",
          "basefont",
          "bdi",
          "bdo",
          "big",
          "blockquote",
          "body",
          "br",
          "button",
          "canvas",
          "caption",
          "center",
          "cite",
          "code",
          "col",
          "colgroup",
          "data",
          "datalist",
          "dd",
          "del",
          "details",
          "dfn",
          "dialog",
          "dir",
          "div",
          "dl",
          "dt",
          "em",
          "embed",
          "fieldset",
          "figcaption",
          "figure",
          "font",
          "footer",
          "form",
          "frame",
          "frameset",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "head",
          "header",
          "hr",
          "html",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "label",
          "legend",
          "li",
          "link",
          "main",
          "map",
          "mark",
          "meta",
          "meter",
          "nav",
          "noframes",
          "noscript",
          "object",
          "ol",
          "optgroup",
          "option",
          "output",
          "p",
          "param",
          "picture",
          "pre",
          "progress",
          "q",
          "rp",
          "rt",
          "ruby",
          "s",
          "samp",
          "script",
          "section",
          "select",
          "small",
          "source",
          "span",
          "strike",
          "strong",
          "style",
          "sub",
          "summary",
          "sup",
          "svg",
          "table",
          "tbody",
          "td",
          "template",
          "textarea",
          "tfoot",
          "th",
          "thead",
          "time",
          "title",
          "tr",
          "track",
          "tt",
          "u",
          "ul",
          "var",
          "video",
          "wbr",
        ],
      },
    ],

    // React Hooks Plugin
    "react-hooks/exhaustive-deps": ["error"],

    // Regex Plugin
    "regex/invalid": [
      "error",
      [
        'import.*(/|\\.)";', // Don't use trailing slashes or cyclic index imports.
        '"\\d+"', // Don't use numerical strings.
        "[^\\d]0p[x]", // Don't use pixels unit for zero values.
        "(?=.*[A-F])#[0-9a-fA-F]{1,6}", // Don't use upper case letters in hex colors.
        "@js[x]", // Don't use a custom JSX pragma.
        "Style[d]", // Don't use "styled" components.
        ",\\s+&", // Don't use spaces between comma separated selectors.
        "eslint-disabl[e]", // Don't disable rules.
      ],
    ],

    // GraphQL Plugin
    "graphql/template-strings": [
      "error",
      {
        env: "relay",
        schemaJsonFilepath: "subgraph/build/full-schema.json",
        tagName: "graphql",
      },
    ],
  },

  settings: {
    "import/resolver": {
      alias: [
        ["icons", "./icons"],
        ["_pages", "./_pages"],
        ["subgraph", "./subgraph"],
      ],
    },
    react: { version: "detect" },
  },

  // Node config files and scripts.
  overrides: [
    {
      files: ["./*.js", "subgraph/**.js"],
      env: { node: true },
    },
  ],
};
