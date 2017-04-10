var jimp = require('jimp');

// read image from file, create a thumbnail and return image info containing base64-endcoded thumbnail
function processFile(file, options) {
	var fullPath = options.cwd + file;

	options.onFileProcessing(file);

	return jimp.read(fullPath).then(function (image) {
		// store these properties here as image object will be altered by call to createThumbnail
		var originalImage = {
			width: image.bitmap.width,
			height: image.bitmap.height
		};

		return createThumbnail(image, options).then(function (thumbnail) {
			var result = {
				file: file,
				originalImage: originalImage,
				thumbnail: thumbnail
			};

			options.onFileProcessed(file, thumbnail);

			return result;
		});
	});
}

function createThumbnail(image, options) {
	return new Promise(function (resolve, reject) {
		image.scaleToFit(options.width, options.height);
		image.quality(options.quality);
		image.getBase64(jimp.MIME_JPEG, function (err, base64) {
			if (err) {
				reject(err);
			}
			else {
				resolve({
					width: image.bitmap.width,
					height: image.bitmap.height,
					base64: base64
				});
			}
		});
	});
}

module.exports = processFile;
