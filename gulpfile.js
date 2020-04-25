'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const gls = require('gulp-live-server');
const livereload = require('gulp-livereload');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const less = require('gulp-less');
const cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});
sass.compiler = require('node-sass');

function compileLess(){
    return gulp.src('assets/src/less/**/*.less')
        .pipe(concat('styleLess.min.css'))     
        .pipe(less())
        .pipe(gulp.dest('assets/css'))
        .pipe(livereload());
};

gulp.task('lint', lint);
function lint(){
    return gulp.src('assets/src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
};

function compilaSass(){
    return gulp
        .src("assets/src/sass/**/*.scss")
        .pipe(concat('style.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest("assets/css"))
        .pipe(livereload());
};

gulp.task("compilaJs", compilaJs);
function compilaJs(){
    return gulp
        .src("assets/src/js/**/*.js")
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("assets/js"))
        .pipe(livereload());
};

function compilaImage(){
    return gulp.src("assets/src/img/**/*")
            .pipe(imagemin())
            .pipe(gulp.dest("assets/img"))
            .pipe(livereload())
};

function compilaHtml(){
    return gulp.src("_html/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("."))
        .pipe(livereload());
};

function watch(){
    livereload.listen();
    gulp.watch("assets/src/sass/**/*.scss", compilaSass)
    gulp.watch("assets/src/less/**/*.less", compileLess)
    gulp.watch("assets/src/js/**/*.js", compilaJs)
    gulp.watch("assets/src/img/**/*", compilaImage)
    gulp.watch("_html/*.html", compilaHtml)
};

function server(){
    const server = gls.static('./', 8000);
    server.start();
};

gulp.task('server', server);

gulp.task('default-series', 
gulp.series(compilaSass, 
    compilaJs, 
    compilaImage,
    compilaHtml,
    compileLess
));

gulp.task('default', gulp.parallel('default-series', watch, server ));
