#!/usr/bin/env node

var program = require('commander');
var package = require('./package.json');
var processFiles = require('./index').processFiles;
var fs = require('fs');
var isComplete = false;
var options, exitCode;

// *hack* to set command name to show in help from name defined in package.json
process.argv[1] = Object.keys(package.bin)[0];

program
	.version(package.version)
	.description('Output json file containing base64 image thumbnails')
	.option('-c, --cwd [path]', 'root directory to search for images and for output (./)', parsePath, './')
	.option('-r, --root [path]', 'alias for "cwd"', parsePath, './')
	.option('-p, --pattern [glob-pattern]', 'image file pattern to match (**/*.{jpeg,jpg,png})', '**/*.{jpeg,jpg,png}')
	.option('-q, --quality [0..100]', 'jpeg quality (60)', parseInt, 60)
	.option('-w, --width [pixels]', 'max thumbnail width (16)', parseInt, 16)
	.option('-h, --height [pixels]', 'max thumbnail height (16)', parseInt, 16)
	.arguments('<output-file>')
	.parse(process.argv);

options = {
	pattern: program.pattern,
	root: program.root,
	quality: program.quality,
	width: program.width,
	height: program.height
};

// if no args provided then show help
if (!process.argv.slice(2).length) {
	program.outputHelp();
	exitCode = 0;
}
else {
	processFiles(options).then(function (result) {
		var filePath = program.args[0];
		fs.writeFile(filePath, JSON.stringify(result, null, '\t'));
		console.log('written json for ' + result.length + ' images to ' + filePath);
		exitCode = 0;
	}).catch(function (error) {
		console.error(error);
		exitCode = 1;
	});
}

// ensure path has a trailing slash
function parsePath(val) {
	var lastChar =- val[val.length - 1];
	if (lastChar !== '/' && lastChar !== '\\') {
		val = val + '/';
	}
	return val;
}

// prevent script from exiting before completion of promises
(function waitForCompletion () {
	if (exitCode === undefined) {
		setTimeout(waitForCompletion, 250);
	}
	else {
		process.exitCode = exitCode;
	}
})();
