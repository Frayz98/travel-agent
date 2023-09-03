const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const sassGlob = require("gulp-sass-glob");

gulp.task("clean:dev", (done) => {
    if (fs.existsSync("./build/")) {
        return gulp.src("./build/", { read: false }).pipe(
            clean({
                force: true
            })
        );
    }
    done();
});

gulp.task("html:dev", () => {
    return gulp
        .src(["./src/html/**/*.html", "!./src/html/components/*.html"])
        .pipe(changed("./build/", { hasChanged: changed.compareContents }))
        .pipe(
            plumber({
                errorHandler: notify.onError({
                    title: "HTML",
                    message: "Error: <%= error.message %>",
                    sound: false
                })
            })
        )
        .pipe(
            fileInclude({
                prefix: "@@",
                basepath: "@file"
            })
        )
        .pipe(gulp.dest("./build/"));
});

gulp.task("sass:dev", () => {
    return gulp
        .src("./src/scss/*.scss")
        .pipe(changed("./build/css/"))
        .pipe(
            plumber({
                errorHandler: notify.onError({
                    title: "Styles",
                    message: "Error <%= error.messsage %>",
                    sound: false
                })
            })
        )
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("./build/css/"));
});

gulp.task("images:dev", () => {
    return (
        gulp
            .src("./src/img/**/*")
            .pipe(changed("./build/img/"))
            // .pipe(imagemin({ verbose: true }))
            .pipe(gulp.dest("./build/img/"))
    );
});

gulp.task("fonts:dev", () => {
    return gulp
        .src("./src/fonts/**/*")
        .pipe(changed("./build/fonts/"))
        .pipe(gulp.dest("./build/fonts/"));
});

gulp.task("files:dev", () => {
    return gulp
        .src("./src/files/**/*")
        .pipe(changed("./build/files/"))
        .pipe(gulp.dest("./build/files/"));
});

gulp.task("js:dev", () => {
    return (
        gulp
            .src("./src/js/**/*")
            .pipe(changed("./build/js/"))
            // .pipe(babel())
            .pipe(webpack(require("./../webpack.config")))
            .pipe(gulp.dest("./build/js/"))
    );
});

gulp.task("server:dev", () => {
    return gulp.src("./build/").pipe(
        server({
            livereload: true,
            open: true
        })
    );
});

gulp.task("watch:dev", () => {
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
    gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
    gulp.watch("./src/img/**/*", gulp.parallel("images:dev"));
    gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
    gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
    gulp.watch("./src/js/**/*", gulp.parallel("js:dev"));
});
