"use strict";


/* Gulp tasks */
var gulp = require('gulp');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');
var htmlCompileScripts = [];
var htmlRenderScripts = [];


/* CONFIGS */
var packageJson = require('./package');
var remoteUrl = '';
try {
	var htmlFiles = packageJson.r5m.htmlFiles;
} catch (err) {
	throw err;
}

htmlFiles.forEach(function (fileName) {
	htmlCompileScripts.push('./node_modules/.bin/ejs-on-command tpl/' + fileName + '.ejs -j \'{"filename": "./tpl/' + fileName + '"}\' > tmp/html/' + fileName + '.html');
	htmlRenderScripts.push('./node_modules/.bin/html-minifier --config-file ./.htmlminirc -o dist/' + fileName + '.html ./tmp/html/' + fileName + '.html');
});


gulp.task('deploy', function () {
	try {
		if (packageJson.repository.type == "git") {
			remoteUrl = packageJson.repository.url;
		}
		if (remoteUrl == '') {
			throw new Error('git repository is not specified');
		}
	} catch (err) {
		throw new Error('Please specify repository field in package.json in order to use deploy command');
	}

	return gulp.src('./dist/**/*')
		.pipe(ghPages({
			remoteUrl: 'git@github.com:r5m-team/julistudio.git'
		}));
});

gulp.task('daemon', function () {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});

	gulp.watch('css/**/*.css', ['css-watch']);
	gulp.watch('bower_components/**/*.css', ['css-watch']);
	gulp.watch('bower_components/**/*.js', ['js-watch']);
	gulp.watch('tpl/**/*.ejs', ['html-watch']);
	gulp.watch('bower_components/r5m-cms/**/*.ejs', ['html-watch']);
	gulp.watch('images/**/*.ejs', ['asserts']);
	gulp.watch('fonts/**/*.ejs', ['fonts']);
});

// Compile r5m-cms SCRIPTS & all dependencies to dist/lp.js
gulp.task('js', function () {
	gulp.src(['bower_components/requirejs/require.js'])
		.pipe(shell([
			'./node_modules/.bin/r.js -o \
        generateSourceMaps=true \
        preserveLicenseComments=false \
        optimize=uglify2 \
        normalizeDirDefines=skip \
        baseUrl=. \
        paths.r5m=bower_components/r5m-cms/js \
        paths.vendor=bower_components \
        name=bower_components/r5m-cms/js/index \
        out=dist/engine/lp.js'
		]))
		.pipe(gulp.dest('./dist/engine'));
});

gulp.task('images', function () {
	gulp.src(['images/**/*']).pipe(gulp.dest('./dist/images'));
});

gulp.task('fonts', function () {
	gulp.src(['fonts/**/*']).pipe(gulp.dest('./dist/fonts'));
});

gulp.task('gh-files', function () {
	gulp.src(['CNAME']).pipe(gulp.dest('./dist/'));
});


// Compile r5m-cms STYLES & all dependencies to dist/lp.css
gulp.task('css', shell.task([
	'./node_modules/.bin/r.js -o cssIn=bower_components/r5m-cms/css/all.css out=tmp/engine.css',
	'./node_modules/.bin/r.js -o cssIn=css/project.css out=dist/engine/lp.css'
]));

// Compile EJS to HTML
gulp.task('html-compile', shell.task(htmlCompileScripts));
// Compile HTML to Production-ready HTML
gulp.task('html-render', ['html-compile'], shell.task(htmlRenderScripts));

gulp.task('css-watch', ['css'], function () {
	browserSync.reload();
});
gulp.task('js-watch', ['js'], function () {
	browserSync.reload();
});
gulp.task('html-watch', ['html-render'], function () {
	browserSync.reload();
});

// Install r5m-cms & it's dependencies
gulp.task('install', shell.task([
	'mkdir -p ./dist/engine',
	'mkdir -p ./tmp/html',
	'./node_modules/.bin/bower install https://github.com/milikhin/r5m-client.git',
	'cd bower_components/r5m-cms; git init; \
	git remote add origin git@github.com:milikhin/r5m-client.git; \
	git add --all; \
	git rm --cached .bower.json; \
	git pull origin master;'
]));

gulp.task('default', ['js', 'css', 'html-render', 'images', 'fonts', 'gh-files', 'daemon']);
