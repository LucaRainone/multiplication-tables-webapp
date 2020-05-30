const less       = require('gulp-less');
const path       = require('path');
const gulp       = require('gulp');
const concat     = require('gulp-concat');
const clean      = require('gulp-clean');
const cssnano    = require('gulp-cssnano');
const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const uglify     = require('gulp-uglify');
const replace    = require('gulp-replace');
const {watch}    = require('gulp');


const staticFiles = ['src/**/*',
                     '!src/index.html',
                     '!src/sw.js',
                     '!src/js',
                     '!src/less',
                     '!src/js/**/*',
                     '!src/less/**/*'];

function javascriptTask() {
	const b = browserify({
		                   entries : 'src/js/main.js',
		                   debug   : false
	                   })
	.transform("babelify", {presets : ["@babel/preset-env"], plugins : ["@babel/plugin-proposal-class-properties"]})
	return b.bundle()
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(uglify())
	.on('error', function (e) {
		console.error(e)
	})
	.pipe(gulp.dest('./dist/js/'));
}

function serviceWorkerTask() {
	const b = browserify({
		                   entries : 'src/sw.js',
		                   debug   : false
	                   })
	.transform("babelify", {
		sourceMaps : false,
		global : true,
		presets    : [
			[
				'@babel/preset-env',
				{
					targets : {
						esmodules : false
					},
				},
			],
		],

		plugins : ["@babel/plugin-proposal-class-properties","@babel/transform-runtime"]
	})
	return b.bundle()
	.pipe(source('sw.js'))
	.pipe(buffer())
	.pipe(uglify())
	.on('error', function (e) {
		console.error(e)
	})
	.pipe(gulp.dest('./dist/'));
}

function lessTask() {
	return gulp.src('./src/less/**/style.less')
	.pipe(less({
		           paths : [path.join(__dirname, 'less')]
	           }))
	.pipe(concat('style.css'))
	.pipe(cssnano())
	.pipe(gulp.dest('./dist/css'));
}

function cleanTask() {
	return gulp.src('dist', {read : false, allowEmpty : true})
	.pipe(clean({}));
}

function copyStatic() {
	return gulp.src(staticFiles)
	.pipe(gulp.dest('dist'));
}

function buildIndex() {
	return gulp.src(['src/index.html'])
	.pipe(replace(/<!--\s*don't include from here\s*-->[.\s\S]*?<!--\s*to here\s*-->/mg, ''))
	.pipe(replace('<!-- bundle.js -->', '<script type="text/javascript" src="js/app.js"></script>'))
	.pipe(replace('<!-- bundle.css -->', '<link rel="stylesheet" type="text/css" href="css/style.css" />'))
	.pipe(gulp.dest('dist/'));
}

gulp.task('watch', function () {
	gulp.series(cleanTask, lessTask, javascriptTask, copyStatic, buildIndex, serviceWorkerTask)();
	watch(['src/**/*.js', '!src/sw.js'], javascriptTask);
	watch(['src/sw.js'], serviceWorkerTask);
	watch(['src/**/*.less'], lessTask);
	watch(['src/index.html'], buildIndex);
	watch(staticFiles,copyStatic);
})

gulp.task('sw', serviceWorkerTask);

exports.default = gulp.series(cleanTask, lessTask, javascriptTask, copyStatic, buildIndex, serviceWorkerTask);