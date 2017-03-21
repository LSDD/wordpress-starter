var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var path = require('path');

var config = {
    isProduction: plugins.util.env.production,
    lessSrc: './assets/src/less/starter-theme.less',
    lessDst: './assets/build/css',
    jsSrc: './assets/src/js/**/*.js',
    jsDst: './assets/build/js',
    uikitDir: './assets/src/libs/uikit/js/',
    imgSrc: './assets/src/images/**/*',
    imgDst: './assets/build/images',
    fontSrc: './assets/src/fonts/**/*',
    fontDst: './assets/build/fonts'
};

//add uikit javascript here
const uikit = [
    config.uikitDir + 'core/core.js'
];

//add other libs here
if (plugins.util.env.production) {

} else {

}
const otherLibs = [];


// Browsers for autoprefixing.
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari > 8',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

if (config.isProduction) {
    plugins.util.log(plugins.util.colors.green('PRODUCTION MODE'));
} else {
    plugins.util.log(plugins.util.colors.green('DEVELOPMENT MODE'));
}

//LESS TASKS
gulp.task('less', function() {
    //LTR
    gulp.src(config.lessSrc)
        .pipe(plugins.less({
            paths: [path.join(__dirname, 'less', 'includes')]
        })) //convert less to css
        .pipe(plugins.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        })) //run autoprefixer
        .pipe(config.isProduction ? plugins.cleanCss({
            advanced: true
        }) : plugins.util.noop()) //minify css - prod only
        .pipe(gulp.dest(config.lessDst))
        .pipe(plugins.size({
            title: 'CSS'
        }))
        .pipe(browserSync.stream())
        .on('error', plugins.util.log);
});


//JS TASKS
//JS Libs
gulp.task('js', function() {
    //join uikit and otherlibs
    var libs = otherLibs.concat(uikit);

    gulp.src(libs)
        .pipe(plugins.concat('starter-theme-libs.js'))
        .pipe(config.isProduction ? plugins.util.noop() : plugins.sourcemaps.init()) //create sourcemaps - dev only
        .pipe(config.isProduction ? plugins.uglify() : plugins.util.noop()) //minify js - prod only
        .pipe(config.isProduction ? plugins.util.noop() : plugins.sourcemaps.write('./')) //save sourcemaps - dev only
        .pipe(gulp.dest(config.jsDst))
        .pipe(plugins.size({
            title: 'JS Librarys'
        }))
        .on('error', plugins.util.log);

    gulp.src(config.jsSrc)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(config.isProduction ? plugins.util.noop() : plugins.sourcemaps.init()) //create sourcemaps - dev only
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(plugins.concat('starter-theme.js'))
        .pipe(config.isProduction ? plugins.uglify() : plugins.util.noop()) //minify js - prod only
        .pipe(config.isProduction ? plugins.util.noop() : plugins.sourcemaps.write('./')) //save sourcemaps - dev only
        .pipe(gulp.dest(config.jsDst))
        .pipe(plugins.size({
            title: 'JS Custom'
        }))
        .on('error', plugins.util.log);
});


// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('clean-scripts', function() {
    return gulp.src(config.jsDst + '/*', {
            read: false
        })
        .pipe(plugins.clean());
});
gulp.task('clean-styles', function() {
    return gulp.src(config.lessDst + '/*', {
            read: false
        })
        .pipe(plugins.clean());
});

//IMAGE TASKS
gulp.task('images', function() {
    return gulp.src(config.imgSrc)
        .pipe(plugins.changed(config.imgDst))
        .pipe(plugins.imagemin({
            progressive: true,
            optimizationLevel: 3, // 0-7 low-high
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest(config.imgDst))
});

//FONT TASKS
gulp.task('fonts', function() {
    return gulp.src(config.fontSrc)
        .pipe(plugins.changed(config.fontDst))
        .pipe(gulp.dest(config.fontDst));
});


const taskList = [
    'clean-scripts',
    'clean-styles',
    'less',
    'js',
    'images',
    'fonts'
];

//builds files without browserSync
// use --production to generate production files.
gulp.task('default', taskList, function() {});

// runs browserSync
// use --production to generate production files.
gulp.task('serve', taskList, function() {
    browserSync.init({
        //server: './'
        proxy: '0.0.0.0:8080', // rails server
        port: 8082, // cloud9 proxied port to 80
        ui: false,
        open: false,
        // Inject CSS changes.
        // Commnet it to reload browser for every CSS change.
        injectChanges: true,
        notify: false
    });
    gulp.watch('./src/js/**/*.js', ['js-watch']);
    gulp.watch('./src/less/**/*.less', ['less']);
    gulp.watch('*.html').on('change', browserSync.reload);
});