var processFile = require('../src/process-file');

var chai = require('chai');
var chaiSubset = require('chai-subset');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;

var FIXTURES_DIR = __dirname + '/fixtures/';

chai.use(chaiSubset);
chai.use(sinonChai);

describe('process-file', function () {
	var sandbox, file, options, result, error;

	before(function () {
		sandbox = sinon.sandbox.create();
		file = '';
		options = {
			cwd: FIXTURES_DIR,
			height: 16,
			width: 16,
			quality: 60,
			onFileProcessing: sandbox.stub(),
			onFileProcessed: sandbox.stub()
		};
	});

	beforeEach(function (done) {
		result = error = undefined;
		processFile(file, options).then(function (_result) {
			result = _result;
			done();
		}).catch(function (_error) {
			error = _error;
			done();
		});
	});

	afterEach(function () {
		sandbox.reset();
	});

	it('should export a function', function () {
		expect(processFile).to.be.a('function');
	});

	it('should return a promise', function () {
		expect(processFile(file, options)).to.be.a('promise');
	});

	describe('when processing a valid image file', function () {
		before(function () {
			file = 'images/acquisition-tile-00-300.jpg';
		});

		it('should call onFileProcessing callback', function () {
			expect(options.onFileProcessing).to.be.calledOnce;
			expect(options.onFileProcessing).to.be.calledWith(file);
		});

		it('should not reject the promise', function () {
			expect(error).to.not.exist;
		});

		it('should resolve the promise with a result object', function () {
			expect(result).to.exist;
		});

		it('should return dimensions of original image', function () {
			expect(result.originalImage).to.containSubset({
				height: 552,
				width: 888
			});
		});

		it('should return dimensions of scaled image', function () {
			expect(result.thumbnail).to.containSubset({
				height: 10,
				width: 16
			});
		});

		it('should return base64 encoding of scaled image (as jpeg)', function () {
			expect(result.thumbnail).to.containSubset({
				base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk8BDg4OExETJhUVJk81LTVPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT//AABEIAAoAEAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOaeSW/dbdGbGQzAeg/+vita0rInC05Sk7Dpbg2szRfvBuO8hxjk9ce1KhLRjxVNxkubczbAn+0oeT1/oaiv8JNPQjvGJ1CXJJ5oo/CObvY//9k='
			});
		});

		it('should call onFileProcessed callback', function () {
			expect(options.onFileProcessed).to.be.calledOnce;
			expect(options.onFileProcessed).to.be.calledWith(file, sinon.match({ height: 10, width: 16 }));
		});
	});

	describe('when processing a nonexistent file', function () {
		before(function () {
			file = 'images/xxx.jpg';
		});

		it('should call onFileProcessing callback', function () {
			expect(options.onFileProcessing).to.be.calledOnce;
			expect(options.onFileProcessing).to.be.calledWith(file);
		});

		it('should reject the promise', function () {
			expect(error).to.exist;
		});

		it('should not resolve the promise', function () {
			expect(result).to.not.exist;
		});

		it('should not call onFileProcessed callback', function () {
			expect(options.onFileProcessed).to.not.be.called;
		});
	});

	describe('when processing a non-image file', function () {
		before(function () {
			file = 'data.txt';
		});

		it('should call onFileProcessing callback', function () {
			expect(options.onFileProcessing).to.be.calledOnce;
			expect(options.onFileProcessing).to.be.calledWith(file);
		});

		it('should reject the promise', function () {
			expect(error).to.exist;
		});

		it('should not resolve the promise', function () {
			expect(result).to.not.exist;
		});

		it('should not call onFileProcessed callback', function () {
			expect(options.onFileProcessed).to.not.be.called;
		});
	});
});
