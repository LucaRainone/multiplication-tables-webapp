const less       = require('gulp-less');
const path       = require('path');
const gulp       = require('gulp');
const concat     = require('gulp-concat');
const clean      = require('gulp-clean');
const cssnano    = require('cssnano');
const postcss    = require('gulp-postcss');
const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const uglify     = require('gulp-uglify');
const replace    = require('gulp-replace');
const {watch}    = require('gulp');

let locale = {};

function _updateLang() {
	let code = require("@babel/core").transformFileSync('./src/js/locale/it.js', {presets : ["@babel/preset-env"]});
	eval('locale = (function() {' + code.code + '; return exports["default"]})();');
}

const args = process.argv.slice(2);
let BUILD4PRODUCTION = false;
let absoluteBasePath = "";
for(let i = 0; i <args.length; i++) {
	if(args[i] === '--env') {
		BUILD4PRODUCTION = 'production' === args[++i];
	}else if(args[i] === '--basepath') {
		absoluteBasePath = args[++i];
	}
}

if(absoluteBasePath && !absoluteBasePath.match(/\/$/))
	absoluteBasePath += "/";


const suffix = BUILD4PRODUCTION? (+new Date()/1000)|0 : "";
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
	.pipe(source(`app${suffix}.js`))
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
	.pipe(concat(`style${suffix}.css`))
	.pipe(postcss([cssnano()]))
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
	_updateLang();
	return gulp.src(['src/index.html'])
	.pipe(replace(/<!--\s*cut from here\s*-->[.\s\S]*?<!--\s*to here\s*-->/mg, ''))
	.pipe(replace('<!-- bundle.js -->', `<script type="text/javascript" src="js/app${suffix}.js"></script>`))
	.pipe(replace('<!-- bundle.css -->', `<link rel="stylesheet" type="text/css" href="css/style${suffix}.css" />`))
	.pipe(replace(/<meta .*?property="og:image".*?content="(.+?)">/, `<meta property="og:image" content="${absoluteBasePath}$1">`))
	.pipe(replace(/<title>.*?<\/title>/,`<title>${locale.pageTitle}</title>`))
	.pipe(replace(/(<meta .*?name="description".*?content=)"(.*?)"(.*?>)/,`$1${JSON.stringify(locale.metaDescription)}$3`))
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