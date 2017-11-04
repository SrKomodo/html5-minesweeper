const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const gulpif = require("gulp-if");
const uglify = require("gulp-uglify");

const release = process.argv[3] === "--release";

gulp.task("html", () => {
  return gulp.src("src/**/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("css", () => {
  return gulp.src("src/**/*.css")
    .pipe(gulp.dest("build"))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  return browserify({
    basedir: ".",
    debug: !release,
    entries: ["src/script.ts"],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify, "tsconfig.json")
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(source("script.js"))
    .pipe(gulpif(release, uglify()))
    .pipe(gulp.dest("build"));
});

gulp.task("build", ["html", "css", "js"]);

gulp.task("html-watch", ["html"], done => {
  browserSync.reload();
  done();
});

gulp.task("js-watch", ["js"], done => {
  browserSync.reload();
  done();
});

gulp.task("watch", ["build"], function () {

  browserSync.init({
    server: {
      baseDir: "build"
    },
  });

  gulp.watch("src/**/*.html", ["html-watch"]);
  gulp.watch("src/**/*.css", ["css"]);
  gulp.watch("src/**/*.ts", ["js-watch"]);
});