// .mocharc.js
module.exports = {
  diff: true,
  require: "ts-node/register",
  extension: ["js", "ts"],
  package: "./package.json",
  reporter: "spec",
  slow: 75,
  timeout: 2000,
  ui: "bdd"
};
