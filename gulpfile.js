const {gulp,svgBundler,scssBundler} = require('gulp2go');

const favicons = require("favicons");
const stream  = favicons.stream;
const config  = favicons.config;
const through = require('through2');
const replace = require('gulp-string-replace');
const fs = require('fs');

config.icons.favicons['favicon-96x96.png'] = {
    width: 96,
    height: 96,
    transparent: true,
    rotate: false,
    mask: false
};


gulp.task('favicon', function(){
    const color = '#D63384';
    const filename = 'favicon.liquid';
    const iconFile = 'assets/favicon.svg';
    const iconPath = 'assets/favicon';
    const appName  = 'Alla Romasheva CV & Profile';
    const appShortName = 'Romasheva CV'
    const url = 'https://romasheva.cv/';
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
        .pipe(favicons.stream({
            appName: appName,
            appShortName: appShortName,
            appDescription: "",
            background: color ,
            path: "/assets/favicon/",
            theme_color: color,
            appleStatusBarStyle: 'default',
            url: url,
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
                appleStartup: false,
                coast: true,
                favicons: true,
                firefox: true,
                windows: true,
                yandex: false
            }
        },(html)=>{
            console.log(html.join('\n'));
        }))
        .pipe(gulp.dest(iconPath));
});


gulp.task('scss',function(){
    return scssBundler('./assets/scss/*.scss','assets/css');
});

gulp.task('sprite', function(){
    return svgBundler('assets/icons/**/*.svg','sprite.svg','assets');
});


gulp.task('watch', function(){
    gulp.watch(['assets/scss/**/*.scss'], gulp.series(['scss']));
});


gulp.task('default', gulp.series(['scss','sprite']));
