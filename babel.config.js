module.exports = {
  presets: ["module:@react-native/babel-preset"],
  ignore: ["**/react-native.config.js"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        envName: "REACT_APP_API_KEY",
        moduleName: "@env",
        path: ".env"
      }
    ]
  ]
};
