var gulp = require('gulp');
var shell = require('gulp-shell');

module.exports = function () {
	return shell.task([
		'mkdir -p ./dist/engine',
		'mkdir -p ./tmp/html',
		'./node_modules/.bin/bower install https://github.com/milikhin/r5m-client.git',
		'cd bower_components/r5m-cms; git init; \
	git remote add origin git@github.com:milikhin/r5m-client.git; \
	git add --all; \
	git rm --cached .bower.json; \
	git pull origin master;'
	]);
};
