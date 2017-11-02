const gulp = require("gulp");
const ts = require("gulp-typescript");

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
    .pipe(gulp.dest("build"));
});

gulp.task("js", () => {
  return gulp.src("src/**/*.ts")
    .pipe(tsProject())
    .pipe(gulp.dest("build"));
});

gulp.task("build", ["html", "css", "js"]);

gulp.task("watch", ["build"], function () {
  gulp.watch("src/**/*.html", "html");
  gulp.watch("src/**/*.css", "css");
  gulp.watch("src/**/*.ts", "js");
});