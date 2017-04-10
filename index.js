var processFile = require('./src/process-file');
var processFiles = require('./src/process-files');

var DEFAULT_OPTIONS = {
	root: './',
	pattern: '**/*.{jpeg,jpg,png}',
	ignore: [ '**/node_modules/**' ],
	quality: 60,
	width: 16,
	height: 16,
	onFilesFound: function () {},
	onFileProcessing: function () {},
	onFileProcessed: function () {},
	onFilesProcessed: function () {}
};

function mergeOptions(options) {
	var mergedOptions = Object.assign({}, DEFAULT_OPTIONS, options);

	if (!mergedOptions.cwd) {
		mergedOptions.cwd = mergedOptions.root;
	}

	return mergedOptions;
}

module.exports = {
	processFile: function (file, options) {
		processFile(file, mergeOptions(options));
	},
	processFiles: function (options) {
		processFiles(mergeOptions(options), processFile);
	}
};

module.exports.default = module.exports.processFiles;
