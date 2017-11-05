const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const watchify = require("watchify");
const gulpif = require("gulp-if");

const release = process.argv[3] === "--release";

const bundleBuild = browserify({
  basedir: ".",
  debug: !release,
  entries: ["src/script.ts"]
}).plugin(tsify);

const watched = watchify(browserify({
  basedir: ".",
  debug: !release,
  entries: ["src/script.ts"]
}).plugin(tsify));

gulp.task("html", () => {
  return gulp.src("src/**/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("css", () => {
  return gulp.src("src/**/*.css")
    .pipe(gulp.dest("build"))
    .pipe(gulpif(!release, browserSync.stream()));
});

gulp.task("js", () => {
  return watched
    .bundle()
    .on("error", function (error) { console.error(error.toString()); })
    .pipe(source("script.js"))
    .pipe(gulp.dest("build"));
});

gulp.task("buildjs", () => {
  return bundleBuild
    .bundle()
    .pipe(source("script.js"))
    .pipe(gulp.dest("build"));
});

gulp.task("assets", () => {
  return gulp.src("src/**/*.png")
    .pipe(gulp.dest("build"));
});

gulp.task("build", ["html", "css", "buildjs", "assets"]);

gulp.task("html-watch", ["html"], done => {
  browserSync.reload();
  done();
});

gulp.task("js-watch", ["js"], done => {
  browserSync.reload();
  done();
});

gulp.task("asset-watch", ["assets"], done => {
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
  gulp.watch("src/**/*.png", ["asset-watch"]);

  watched.on("log", console.log);
});

