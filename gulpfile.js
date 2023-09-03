const gulp = require("gulp");

require("./gulp-tasks/dev.js");
require("./gulp-tasks/prod");

gulp.task(
    "default",
    gulp.series(
        "clean:dev",
        gulp.parallel(
            "html:dev",
            "sass:dev",
            "images:dev",
            "fonts:dev",
            "files:dev",
            "js:dev"
        ),
        gulp.parallel("watch:dev", "server:dev")
    )
);

gulp.task(
    "prod",
    gulp.series(
        "clean:prod",
        gulp.parallel(
            "html:prod",
            "sass:prod",
            "images:prod",
            "fonts:prod",
            "files:prod",
            "js:prod"
        ),
        "server:prod"
    )
);
