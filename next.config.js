const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withTranspileModules = require("next-transpile-modules")([
  "@kleros/components",
  "@kleros/icons",
]);

module.exports = withBundleAnalyzer(
  withTranspileModules({
    target: "serverless",
  })
);
