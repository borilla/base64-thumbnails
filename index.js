var glob = require('glob');
var jimp = require('jimp');

var DEFAULT_OPTIONS = {
	cwd: './',
	pattern: '**/*.{jpeg,jpg,png}',
	ignore: [ '**/node_modules/**' ],
	quality: 60,
	width: 16,
	height: 16,
	onFilesFound: function () {},
	onFileProcessing: function () {},
	onFileProcessed: function () {}
};

function main(options) {
	var mergedOptions = Object.assign({}, DEFAULT_OPTIONS, options);

	return processFiles(mergedOptions).then(function (info) {
		return Promise.resolve({
			css: makeCss(info),
			info: info
		});
	});
}

function makeCss(info) {
	var template = 'img[src*="{file}"] { background-image: url({base64}); background-size: 100% 100%; }';
	var cssArray = info.map(function (fileInfo) {
		return template.replace('{file}', fileInfo.file).replace('{base64}', fileInfo.base64);
	});

	return cssArray.join('\n');
}

function processFiles(options) {
	var files = glob.sync(options.pattern, options);

	options.onFilesFound(files);

	return Promise.all(files.map(function (file) {
		return processFile(file, options);
	}));
}

function processFile(file, options) {
	var fullPath = options.cwd + file;

	options.onFileProcessing(file);

	return jimp.read(fullPath).then(function (image) {
		return processImage(image, options).then(function (base64) {
			options.onFileProcessed(file);

			return {
				file: file,
				// fullPath: fullPath,
				// image: image,
				base64: base64
			};
		});
	});
}

function processImage(image, options) {
	return new Promise(function (resolve, reject) {
		image.scaleToFit(options.width, options.height);
		image.quality(options.quality);
		image.getBase64(jimp.MIME_JPEG, function (err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	})
}

module.exports = main;
