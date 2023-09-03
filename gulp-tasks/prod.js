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
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const htmlclean = require("gulp-htmlclean");
const webp = require("gulp-webp");
const webpHTML = require("gulp-webp-html");
const webpCss = require("gulp-webp-css");

gulp.task("clean:prod", (done) => {
    if (fs.existsSync("./prod/")) {
        return gulp.src("./prod/", { read: false }).pipe(
            clean({
                force: true
            })
        );
    }
    done();
});

gulp.task("html:prod", () => {
    return gulp
        .src(["./src/html/**/*.html", "!./src/html/components/*.html"])
        .pipe(changed("./prod/"))
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
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest("./prod/"));
});

gulp.task("sass:prod", () => {
    return gulp
        .src("./src/scss/*.scss")
        .pipe(changed("./prod/css/"))
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
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("./prod/css/"));
});

gulp.task("images:prod", () => {
    return gulp
        .src("./src/img/**/*")
        .pipe(changed("./prod/img/"))
        .pipe(webp())
        .pipe(gulp.dest("./prod/img/"))

        .pipe(gulp.src("./src/img/**/*"))
        .pipe(changed("./prod/img/"))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest("./prod/img/"));
});

gulp.task("fonts:prod", () => {
    return gulp
        .src("./src/fonts/**/*")
        .pipe(changed("./prod/fonts/"))
        .pipe(gulp.dest("./prod/fonts/"));
});

gulp.task("files:prod", () => {
    return gulp
        .src("./src/files/**/*")
        .pipe(changed("./prod/files/"))
        .pipe(gulp.dest("./prod/files/"));
});

gulp.task("js:prod", () => {
    return gulp
        .src("./src/js/**/*")
        .pipe(changed("./prod/js/"))
        .pipe(babel())
        .pipe(webpack(require("./../webpack.config")))
        .pipe(gulp.dest("./prod/js/"));
});

gulp.task("server:prod", () => {
    return gulp.src("./prod/").pipe(
        server({
            livereload: true,
            open: true
        })
    );
});
