module.exports = {
  syntax: "postcss-scss",
  plugins: [
    require("postcss-easy-import")({
      extensions: ".scss"
    }),
    require("autoprefixer")({
      browsers: ["last 4 versions"],
      cascade: false
    }),
    require("postcss-nested"),
    require("cssnano")()
  ]
};
