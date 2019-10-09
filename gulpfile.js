
// required gulp packages
const { src, dest, parallel, watch } = require('gulp');

// Browser packages
const browserSync = require('browser-sync').create();

// multiuse packages
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// sass requied packages
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// js reuired packages
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const babelify = require('babelify');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


// s*css path variables
const stylePath = {
    scss_file: 'src/scss/styles.scss',
    css_dist: './dist/css'
}

// js path variables
const jsPath = {
    js_src: 'src/js/',
    js_dist: 'dist/js'
}

//init array to hold multiples [if any]
const js_files = ['script.js'];

// file extenstions to watch from specific directories 
const fileExt = {
    htmlFile: '*.html',
    scssFile: 'src/scss/**/*.scss',
    jsFile: 'src/js/**/*.js'
}

//function to compile sass and minify css
function css(cb) {
    src(stylePath.scss_file)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('error', sass.logError)
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(stylePath.css_dist))
        .pipe(browserSync.stream());
    cb();
}

//function for js
function js(cb) {
   js_files.map(function (entry) {
        return browserify({
            entries: [ jsPath.js_src + entry]
        })
            .transform(babelify, { presets: ['@babel/preset-env'] })
            .bundle()
            .pipe(source(entry))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(dest(jsPath.js_dist))
            .pipe(browserSync.stream());        
   });
    cb();
}

// function to sync changes to browser
function live_serve() {
    browserSync.init({
        open: false,
        injectChanges: true,
        proxy: 'http://localhost:8888'
    });
    watch(fileExt.scssFile, { ignoreInitial: false }, css);
    watch(fileExt.jsFile, { ignoreInitial: false }, js).on('change', browserSync.reload);
    watch(fileExt.htmlFile).on('change', browserSync.reload);
}
exports.default = parallel(css, js);
exports.live = live_serve;