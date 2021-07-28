const gulp     = require('gulp');
const sass     = require('gulp-sass');
const svgSprite  =  require('gulp-svg-sprite');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const touch = require('gulp-touch-fd');

const favicons = require("favicons").stream;
const replace = require('gulp-string-replace');

gulp.task('favicon:html', function(){
    return gulp.src('assets/favicon/index.html').pipe(
        rename(function () {
            return {
                dirname: '',
                basename: 'favicon',
                extname: '.liquid'
            };
        })
    ).pipe(gulp.dest('_includes/carcass'))
});

gulp.task('favicon', function(){
    const color = '#D63384';
    return gulp.src('assets/favicon.svg')
        .pipe(replace('currentColor',color))
        .pipe(favicons({
            appName: "My App",
            appShortName: "App",
            appDescription: "This is my application",
            background: color ,
            path: "/assets/favicon/",
            url: "https://romasheva.design/",
            display: "standalone",
            orientation: "portrait",
            scope: "/",
            start_url: "/?homescreen=1",
            version: 1.0,
            logging: false,
            html: "index.html",
            pipeHTML: true,
            replace: true
        })).pipe(gulp.dest('assets/favicon'))
});


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
    return gulp.src('assets/icons/**/*.svg')
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
        .pipe(gulp.dest('assets'));
});


gulp.task('watch', function(){
    gulp.watch(['assets/scss/**/*.scss'], gulp.series(['scss']));
});


gulp.task('default', gulp.series(['scss','sprite']));
