var glob = require('glob');
var jimp = require('jimp');

var DEFAULT_OPTIONS = {
	pattern: '**/*.{jpeg,jpg,png}',
	cwd: '.',
	width: 32,
	height: 32
};

function main(options) {
	return processFiles(options).then(function (data) {
		return Promise.resolve({
			css: makeCss(data),
			info: data
		});
	});
}

function makeCss(data) {
	var template = 'img[src*="{file}"] { background-image: url({base64}); background-size: cover; }';
	var cssArray = data.map(function (fileData) {
		var file = fileData.file;
		var base64 = fileData.base64;

		return template.replace('{file}', file).replace('{base64}', base64);
	});

//	console.log('cssArray', cssArray);

	return cssArray.join('\n');
}

function processFiles(options) {
	var mergedOptions = Object.assign({}, DEFAULT_OPTIONS, options);
	var files = glob.sync(mergedOptions.pattern, options);
	var promise = Promise.all(files.map(function (file) {
		return processFile(file, mergedOptions);
	}));

	return promise;
}

function processFile(file, options) {
	var fullPath = options.cwd + file;
	var promise = jimp.read(fullPath).then(function (image) {
		return processImage(image, options).then(function (base64) {
			return {
				file: file,
				// fullPath: fullPath,
				// image: image,
				base64: base64
			};
		});
	});

	return promise;
}

function processImage(image, options) {
	return new Promise(function (resolve, reject) {
		image.scaleToFit(options.width, options.height),
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
