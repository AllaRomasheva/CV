const {gulp,svgBundler,scssBundler} = require('gulp2go');

const favicons = require("favicons");
const replace = require('gulp-string-replace');

favicons.config.icons.favicons['favicon-96x96.png'] = {
    width: 96,
    height: 96,
    transparent: true,
    rotate: false,
    mask: false
};

gulp.task('favicon', () =>{
    const color = '#D63384';
    const iconFile = 'assets/favicon.svg';
    const iconPath = 'assets/favicon';
    const appName  = 'Alla Romasheva CV & Profile';
    const appShortName = 'Romasheva CV'
    const url = 'https://romasheva.cv/';
    const filePath = url.concat(iconPath);
    return gulp.src(iconFile)
        .pipe(replace('currentColor',color))
        .pipe(favicons.stream({
            appName: appName,
            appShortName: appShortName,
            appDescription: "",
            background: color ,
            path: filePath,
            theme_color: color,
            appleStatusBarStyle: 'default',
            url: url,
            display: "standalone",
            orientation: "portrait",
            scope: "/",
            start_url: "/?homescreen=1",
            version: 1.0,
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


gulp.task('scss',() =>{
    return scssBundler('./assets/scss/*.scss','assets/css');
});

gulp.task('sprite', () =>{
    return svgBundler('assets/icons/**/*.svg','sprite.svg','assets');
});


gulp.task('watch', () =>{
    gulp.watch(['assets/scss/**/*.scss'], gulp.series(['scss']));
});

gulp.task('default', gulp.series(['scss','sprite']));
