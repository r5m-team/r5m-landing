var gulp = require('gulp');
var shell = require('gulp-shell');

module.exports = function (options) {
	var version = 'master';
	var tagString = version;
	var self = this;
	if (options.packageJson.r5m.clientVersion) {
		version = options.packageJson.r5m.clientVersion;
		tagString = 'tags/' + version;
	}
	console.log('cd bower_components/r5m-cms; git checkout ' + self.version + ' -b working');

	return shell.task([
		'mkdir -p ./dist/engine',
		'mkdir -p ./tmp/html',
		'mkdir -p ./bower_components',
		'git clone https://github.com/milikhin/r5m-client.git bower_components/r5m-cms',
		'cd bower_components/r5m-cms; dir; git checkout ' + self.version + ' -b working; \
			./node_modules/.bin/bower install'
	]);
};
