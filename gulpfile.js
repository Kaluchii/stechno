//============================================================================================
// -- Переменные для настройки
//============================================================================================
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const less = require('gulp-less');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const changeCase = require('change-case');
const changed = require('gulp-changed');
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');


//============================================================================================
// -- ФОРМАТЫ ИЗОБРАЖЕНИЙ
//============================================================================================
const image_ext = '{svg,Svg,SVG,png,Png,PNG,jpg,Jpg,JPG,jpeg,Jpeg,JPEG,gif,Gif,GIF,bmp,BMP,Bmp,ico}';

//============================================================================================
// -- ПУТИ ДО ФАЙЛОВ
//============================================================================================
const components = './src/assets/components/',
    scripts = './src/assets/js/',
    base = './src/assets/base/',
    images = './src/assets/img/',
    sprites = './src/assets/svg-for-sprite/',
    fonts = './src/assets/fonts/',
    pluginsOverlay = './src/assets/base/plugins_overlay/',
    textBlock = './src/assets/base/text-block/',
    vendor = './src/assets/vendor/',
    // myPlugins        = './src/assets/js/my_plugins/',
    commonCss = './src/assets/base/common/',
    overlapping = './src/assets/overlapping-styles/',
    templates = './src/templates/',
    devImages = './src/dev_images/',

    productionCss = './dist/css/',
    productionImg = './dist/img/',
    productionJs = './dist/js/',
    productionFonts = './dist/fonts/',
    productionDevImages = './dist/dev_images/',
    productionHtml = './dist/',

    devImg = [
        images + '**/*.' + image_ext,
        components + '**/*.' + image_ext
    ],
    styleComponents = [
        commonCss + '*.less',
        base + '*.less',
        vendor + '**/*.css',
        vendor + '**/*.less',
        // myPlugins        + '**!/!*.less',
        pluginsOverlay + '**/*.less',
        textBlock + '**/*.less',
        components + '**/*.less',
        overlapping + '**/*.less',
        '!' + components + '**/*.adaptive.less',
        '!' + base + '**/*.adaptive.less',
        '!' + base + '**/*.adaptive.less',
        '!/**/d_*/*.*',
        '!/**/d_*.*'
    ],
    adaptiveStyleComponents = [
        commonCss + '*.less',
        // myPlugins  + '**/*.adaptive.less',
        textBlock + '**/*.adaptive.less',
        components + '**/*.adaptive.less',
        base + '**/*.adaptive.less',
        '!/**/d_*/*.*',
        '!/**/d_*.*'
    ],
    scriptComponents = [
        vendor + '**/*.js',
        // myPlugins  + '**/*.js',
        pluginsOverlay + '**/*.js',
        components + '**/*.js',
        scripts + '**/*.js',
        '!/**/d_*/*.*',
        '!/**/d_*.*'
    ],
    imageDirs = [];

//============================================================================================
// -- Ватчеры файлов
//============================================================================================
function watch () {
    browserSync.init({
        browser: ['google-chrome'/*, "firefox"*/],
        // proxy: 'http://127.0.0.1:8000',
        // tunnel: 'copa-project',
        notify: false,
        reloadDelay: 100,
        server: {
            baseDir: "./dist"
        },
        serveStatic: [productionCss]
    });

    gulp.watch(styleComponents, styles);
    gulp.watch(adaptiveStyleComponents, stylesAdaptive);
    gulp.watch(scriptComponents, js);
    gulp.watch(devImg, image);
    gulp.watch(sprites, generateSvgSprites);
    gulp.watch(fonts, copyFonts);
    gulp.watch(devImages, copyDevImages);
    // gulp.watch(html).on('change', browserSync.reload);
    gulp.watch([templates + '**/*.njk'], viewsRender)/*.on('change', browserSync.reload)*/;
}


// gulp.task('default', ['watch']);
gulp.task('watch', watch);

//============================================================================================
// -- Компиляция и обработка LESS
//============================================================================================
function styles () {
    return gulp.src(styleComponents)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('style.less'))
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 3 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(rename('style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(productionCss))
        .pipe(browserSync.stream());
}


function stylesAdaptive () {
    return gulp.src(adaptiveStyleComponents)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('adaptive.less'))
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 3 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(rename('adaptive.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(productionCss))
        .pipe(browserSync.stream());
}


gulp.task('stylesAll', gulp.parallel(styles, stylesAdaptive));

//============================================================================================
// -- JS and PHP
//============================================================================================
function js () {
    return gulp.src(scriptComponents)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(productionJs))
        .pipe(browserSync.stream());
}


gulp.task('js', js);


function viewsRender () {
    return gulp.src(templates + 'pages/*.njk')
        .pipe(
            nunjucksRender({
                path: [templates]
            }))
        .pipe(
            gulp.dest(productionHtml))
        .pipe(browserSync.stream());
}


gulp.task('views:render', viewsRender);


//============================================================================================
// -- Файлы без обработки
//============================================================================================
gulp.task('copy', copy);


function copy () {
    copyFonts();
    return copyDevImages();
}


function copyFonts () {
    return gulp.src(fonts + '**')
        .pipe(gulp.dest(productionFonts));
}


function copyDevImages () {
    return gulp.src(devImages + '**')
        .pipe(gulp.dest(productionDevImages));
}


//============================================================================================
// -- Оптимизация изображений
//============================================================================================
function image () {
    return gulp.src(devImg)
        .pipe(changed(productionImg))
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 7}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true}, // Точно ли нужно это использовать???
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(rename(function (path) {
            path.basename = changeCase.lowerCase(path.basename);
            path.extname = changeCase.lowerCase(path.extname);
        }))
        .pipe(gulp.dest(productionImg))
        .pipe(browserSync.reload({
            stream: true
        }));
}


gulp.task('imageAll', gulp.parallel(image));


function generateSvgSprites () {
    return gulp.src(sprites + '*.svg')
        .pipe(plumber())
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                // $('[fill="none"]').removeAttr('fill');
                $('svg:first-child').removeAttr('viewBox');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(replace('&gt;', '>'))
        .pipe(gulp.dest(productionImg));
}


gulp.task('generate-svg-sprites', gulp.parallel(generateSvgSprites));


//============================================================================================
// -- PRODUCTION
//============================================================================================

let cleanOptions = {
    level: {
        2: {
            mergeSemantically: true,
            restructureRules: true,
            skipProperties: ['transition']
        }
    }
};

function productionStyles () {
    return gulp.src(styleComponents)
        .pipe(plumber())
        .pipe(concat('style.less'))
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 3 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(cleanCSS(cleanOptions))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(productionCss));
}


function productionStylesAdaptive () {
    return gulp.src(adaptiveStyleComponents)
        .pipe(plumber())
        .pipe(concat('adaptive.less'))
        .pipe(less())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(rename('adaptive.css'))
        .pipe(cleanCSS(cleanOptions))
        .pipe(gulp.dest(productionCss));
}


function productionScript () {
    return gulp.src(scriptComponents)
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest(productionJs));
}


gulp.task('clean', clean);
function clean () {
	return del(['./dist/**', '!./dist'], {force: true});
}


gulp.task('production', gulp.series(clean, gulp.parallel(viewsRender, productionStylesAdaptive, productionStyles, productionScript, copy, image, generateSvgSprites)));

//============================================================================================

