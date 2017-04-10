/*
var base64Thumbnails = require('../index');

var chai = require('chai');
var chaiSubset = require('chai-subset');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;

var FIXTURES_DIR = __dirname + '/fixtures/';

chai.use(chaiSubset);
chai.use(sinonChai);

describe('base64Thumbnails', function () {
	var sandbox, onFilesFound, onFileProcessing, onFileProcessed;
	// eslint-disable-next-line no-unused-vars
	var options, results, error;

	beforeEach(function (done) {
		sandbox = sinon.sandbox.create();
		onFilesFound = sandbox.stub();
		onFileProcessing = sandbox.stub();
		onFileProcessed = sandbox.stub();

		options = {
			pattern: '**\/*.{jpeg,jpg,png}',
			cwd: FIXTURES_DIR,
			quality: 60,
			width: 16,
			height: 16,
			onFilesFound: onFilesFound,
			onFileProcessing: onFileProcessing,
			onFileProcessed: onFileProcessed
		};
		results = undefined;
		error = undefined;

		makeCss(options)
			.then(function (r) {
				results = r;
				done();
			})
			.catch(function (e) {
				error = e;
				done();
			});
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be a function', function () {
		expect(makeCss).to.be.a('function');
		console.log(results)
	});

	it('should return an array', function () {
		expect(results).to.be.an('array');
	});

	it('should return the expected number of results', function () {
		expect(results.length).to.equal(3);
	});

	it('should return file paths relative to root (cwd) directory', function () {
		expect(results).to.containSubset([
			{ file: 'images/acquisition-tile-00-300.jpg' },
			{ file: 'images/battleship-wild-targets-tile-15-300.jpg' },
			{ file: 'images/secrets-of-the-phoenix-tile-10-300.png' }
		]);
	});

	it('should return base64 code for image thumbnails', function () {
		expect(results).to.containSubset([
			{ base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAAoAEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOaeSW/dbdGbGQzAeg/+vita0rInC05Sk7Dpbg2szRfvBuO8hxjk9ce1KhLRjxVNxkubczbAn+0oeT1/oaiv8JNPQjvGJ1CXJJ5oo/CObvY//9k=' },
			{ base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAA4AEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AMjw/DpTaXa/aLYPMFO8fZ0fcdzEHLc9CBj2rWMG0Yuav/wP+CJ4gt9Ni0m6MdqVlIUJ/o8abDkHOV56cfjQ4txvYpSV7X/D/gnP6frb2MCIsQcrxzSU7KwOGtx+pa/LqFt5LwqnGMgk0e0drAqdj//Z' },
			{ base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAAcAEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AFs5S0jrEGEKKCqk9Ae3X1B/Os5Yjloq2gSw6lJQW5YM75lRh8gid2H94DHGOlRKs5RumZ0qHvryP//Z' }
		]);
	});

	it.skip('should return expected css', function () {
		expect(results.css).to.equal(
			'img[src*="images/acquisition-tile-00-300.jpg"] { background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAAoAEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOaeSW/dbdGbGQzAeg/+vita0rInC05Sk7Dpbg2szRfvBuO8hxjk9ce1KhLRjxVNxkubczbAn+0oeT1/oaiv8JNPQjvGJ1CXJJ5oo/CObvY//9k=); background-size: 100% 100%; }\n' +
			'img[src*="images/battleship-wild-targets-tile-15-300.jpg"] { background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAA4AEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AMjw/DpTaXa/aLYPMFO8fZ0fcdzEHLc9CBj2rWMG0Yuav/wP+CJ4gt9Ni0m6MdqVlIUJ/o8abDkHOV56cfjQ4txvYpSV7X/D/gnP6frb2MCIsQcrxzSU7KwOGtx+pa/LqFt5LwqnGMgk0e0drAqdj//Z); background-size: 100% 100%; }\n' +
			'img[src*="images/secrets-of-the-phoenix-tile-10-300.png"] { background-image: url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAAcAEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AFs5S0jrEGEKKCqk9Ae3X1B/Os5Yjloq2gSw6lJQW5YM75lRh8gid2H94DHGOlRKs5RumZ0qHvryP//Z); background-size: 100% 100%; }'
		);
	});

	it('should trigger onFilesFound once', function () {
		expect(onFilesFound).to.be.calledOnce;
		expect(onFilesFound).to.be.calledWith([
			'images/acquisition-tile-00-300.jpg',
			'images/battleship-wild-targets-tile-15-300.jpg',
			'images/secrets-of-the-phoenix-tile-10-300.png'
		]);
	});

	it('should trigger onFileProcessing for each image file', function () {
		expect(onFileProcessing).to.be.calledThrice;
		expect(onFileProcessing).to.be.calledWith('images/acquisition-tile-00-300.jpg');
		expect(onFileProcessing).to.be.calledWith('images/battleship-wild-targets-tile-15-300.jpg');
		expect(onFileProcessing).to.be.calledWith('images/secrets-of-the-phoenix-tile-10-300.png');
	});

	it('should trigger onFileProcessed for each image file', function () {
		expect(onFileProcessed).to.be.calledThrice;
		expect(onFileProcessed).to.be.calledWith('images/acquisition-tile-00-300.jpg');
		expect(onFileProcessed).to.be.calledWith('images/battleship-wild-targets-tile-15-300.jpg');
		expect(onFileProcessed).to.be.calledWith('images/secrets-of-the-phoenix-tile-10-300.png');
	});
});
*/