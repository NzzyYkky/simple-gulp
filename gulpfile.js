const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const connectSSI = require('connect-ssi'); // SSIをlocalで使用するためのパッケージ
//setting : paths
const paths = {
	root: './',
	html: './*.html',
	cssSrc: './*.scss',
	cssDist: './',
	jsSrc: './*.js',
	jsDist: './dist/js/',
};

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require('gulp');

//Sass
task('sass', function () {
	return src(paths.cssSrc)
		.pipe(
			plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
		)
		.pipe(
			sass({
				outputStyle: 'expanded', // Minifyするなら'compressed'
			})
		)
		.pipe(autoprefixer({}))
		.pipe(dest(paths.cssDist));
});

//JS Compress
task('js', function () {
	return src(paths.jsSrc)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(dest(paths.jsDist));
});

// browser-sync
task('browser-sync', () => {
	return browserSync.init({
		server: {
			baseDir: paths.root,
		},
		middleware: [
			connectSSI({
				baseDir: __dirname + '/htdocs', // SSIをlocalで使用するための記述
				ext: '.html',
			}),
		],
		index: 'index.html',
		port: 8080,
		reloadOnRestart: true,
	});
});

// browser-sync reload
task('reload', (done) => {
	browserSync.reload();
	done();
});

//watch
task('watch', (done) => {
	watch([paths.cssSrc], series('sass', 'reload'));
	watch([paths.jsSrc], series('js', 'reload'));
	done();
});
task('default', parallel('watch', 'browser-sync'));
