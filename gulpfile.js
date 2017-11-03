const gulp = require("gulp");
const ts = require("gulp-typescript");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");

const tsProject = ts.createProject({
  noImplicitAny: true,
  outFile: "script.js"
})

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
  return gulp.src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
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