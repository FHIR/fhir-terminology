module.exports = {
  context: __dirname + "/src/coffee",
  entry: "./app",
  output: {
    path: __dirname + "/tmp",
    filename: "app.js",
    library: "fhirface",
    libraryTarget: "umd"
  },
  module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]},
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
  }
};
