const gulp     = require('gulp');
const sass     = require('gulp-sass');
const svgSprite  =  require('gulp-svg-sprite');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const touch = require('gulp-touch-fd');

gulp.task('scss',function(){
    return gulp.src('./assets/scss/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/css'))
        .pipe(touch());
});

gulp.task('sprite', function(){
    return gulp.src('_includes/icons/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "./sprite.svg"
                }
            }
        }))
        .pipe(rename(function () {
            return {
                dirname: '',
                basename: 'sprite',
                extname: '.svg'
            };
        }))
        .pipe(gulp.dest('assets/sprite'));
});


gulp.task('watch', function(){
    gulp.watch(['assets/scss/**/*.scss'], gulp.series(['scss']));
});


gulp.task('default', gulp.series(['scss','sprite']));