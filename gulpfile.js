const gulp     = require('gulp');
const sass     = require('gulp-sass');
const svgSprite  =  require('gulp-svg-sprite');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const touch = require('gulp-touch-fd');

const favicons = require("favicons").stream;
const through = require('through2');
const replace = require('gulp-string-replace');
const fs = require('fs');

gulp.task('favicon', function(){
    const color = '#D63384';
    const filename = 'favicon.liquid';
    const iconFile = 'assets/favicon.svg';
    const iconPath = 'assets/favicon';
    const filePath = '_includes/carcass';
    const filterFile = () => {
        return through.obj( (file,enc, cb) => {
            if( file.relative === filename ){
                fs.unlinkSync( file.path );
                cb(null, file);
            } else {
                cb(null);
            }
        })
    };
    return gulp.src(iconFile)
        .pipe(replace('currentColor',color))
        .pipe(favicons({
            appName: "Alla Romasheva CV & Profile",
            appShortName: "Romasheva CV",
            appDescription: "",
            background: color ,
            path: "/assets/favicon/",
            url: "https://romasheva.design/",
            display: "standalone",
            orientation: "portrait",
            scope: "/",
            start_url: "/?homescreen=1",
            version: 1.0,
            html: filename ,
            pipeHTML: true,
            replace: true,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: true,
                windows: true,
                yandex: true
            }
        }))
        .pipe(gulp.dest(iconPath))
        .pipe(filterFile())
        .pipe(gulp.dest(filePath));
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
