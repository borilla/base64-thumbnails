var glob = require('glob');

function processFiles(options, processFile) {
	return findFiles(options)
		.then(function (files) {
			options.onFilesFound(files);

			return Promise.all(files.map(function (file) {
				return processFile(file, options);
			})).then(function (results) {
				options.onFilesProcessed(files, results);

				return results;
			});
		});
}

function findFiles(options) {
	return new Promise(function (resolve, reject) {
		glob(options.pattern, options, function (err, files) {
			if (err) {
				reject(err);
			}
			else {
				resolve(files);
			}
		});
	});
}

module.exports = processFiles;
