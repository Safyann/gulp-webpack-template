const gulp = require("gulp");

const pug = require("gulp-pug");

const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const sassGlob = require("gulp-sass-glob");

const rename = require("gulp-rename");
const del = require("del");

const gulpWebpack = require("gulp-webpack");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const browserSync = require("browser-sync").create();

const paths = {
  root: "./dist",
  templates: {
    pages: "./src/views/pages/*.pug",
    src: "./src/views/**/*.pug",
    dest: "./dist"
  },
  styles: {
    main: "./src/assets/styles/main.scss",
    src: "./src/assets/styles/**/*.scss",
    dest: "./dist/assets/styles"
  },
  scripts: {
    src: "./src/assets/scripts/*.js",
    dest: "./dist/assets/scripts/"
  },
  fonts: {
    src: "./src/assets/fonts/**/*.*",
    dest: "./dist/assets/fonts/"
  },
  img: {
    src: "./src/assets/img/**/*.*",
    dest: "./dist/assets/img/"
  }
};

// слежка
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.scripts.src, scripts);
}

// следим за build и релоадим браузер
function server() {
  browserSync.init({
    server: paths.root
  });
  browserSync.watch(paths.root + "/**/*.*", browserSync.reload);
}

// очистка
function clean() {
  return del(paths.root);
}

// pug
function templates() {
  return gulp
    .src(paths.templates.pages)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
  return gulp
    .src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(postcss(require("./postcss.config")))
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest));
}

// webpack
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest));
}

//копирование шрифтов
function fonts() {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(path.fonts.dest));
}

//оптимизация картинок
function images() {
  return (
    gulp
      .src(paths.img.src)
      // .pipe(
      //   imagemin({
      //     interlaced: true,
      //     progressive: true,
      //     svgoPlugins: [{ removeViewBox: false }],
      //     use: [pngquant()]
      //   })
      // )
      .pipe(gulp.dest(path.img.dest))
  );
}

//создание SVG спрайты
function sprite() {
  return (
    gulp
      .src(path.icons.src)
      // .pipe(
      //   svgmin({
      //     js2svg: {
      //       pretty: true
      //     }
      //   })
      // )
      // .pipe(
      //   cheerio({
      //     run: function($) {
      //       $("[fill]").removeAttr("fill");
      //       $("[stroke]").removeAttr("stroke");
      //       $("[style]").removeAttr("style");
      //     },
      //     parserOptions: { xmlMode: true }
      //   })
      // )
      // .pipe(replace("&gt;", ">"))
      // .pipe(
      //   svgSprite({
      //     mode: {
      //       symbol: {
      //         sprite: "sprite.svg"
      //       }
      //     }
      //   })
      // )
      .pipe(gulp.dest(path.icons.dest))
  );
}

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.sprite = sprite;
exports.clean = clean;

gulp.task(
  "default",
  gulp.series(
    clean,
    gulp.parallel(styles, templates, images, scripts, fonts),
    gulp.parallel(watch, server)
  )
);

gulp.task("build", gulp.parallel(styles, templates, images, scripts, fonts));
