#!/usr/bin/env node

var program = require('commander');
var package = require('./package.json');
var makeCss = require('./index');
var fs = require('fs');
var complete = false;
var options;

program
	.version(package.version)
	.description('Write CSS file containing directives for image thumbnails')
	.option('-r, --root [path]', 'root directory to search for images and for output (./)', parsePath, './')
	.option('-p, --pattern [glob-pattern]', 'image file pattern to match (**/*.{jpeg,jpg,png})', '**/*.{jpeg,jpg,png}')
	.option('-q, --quality [0..100]', 'jpeg quality (60)', parseInt, 60)
	.option('-w, --width [pixels]', 'thumbnail width (16)', parseInt, 16)
	.option('-h, --height [pixels]', 'thumbnail height (16)', parseInt, 16)
	.arguments('<output-file>')
	.parse(process.argv);

options = {
	pattern: program.pattern,
	cwd: program.root,
	quality: program.quality,
	width: program.width,
	height: program.height
};

makeCss(options).then(function (result) {
	var filePath = program.args[0];
	fs.writeFile(filePath, result.css);
	console.log('written directives for ' + result.info.length + ' images to ' + filePath);
	complete = true;
}).catch(function (error) {
	console.error(error);
	complete = true;
});

function parsePath(val) {
	var lastChar =- val[val.length - 1];
	if (lastChar !== '/' && lastChar !== '\\') {
		val = val + '/';
	}
	return val;
}

(function waitForCompletion () {
	if (!complete) {
		setTimeout(waitForCompletion, 200);
	}
})();
