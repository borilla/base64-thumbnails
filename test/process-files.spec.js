var processFiles= require('../src/process-files');

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;

var FIXTURES_DIR = __dirname + '/fixtures/';

chai.use(sinonChai);

describe('process-files', function () {
	var sandbox, options, processFile, result, error;

	before(function () {
		sandbox = sinon.sandbox.create();
		options = {
			cwd: FIXTURES_DIR,
			pattern: '',
			height: 16,
			width: 16,
			quality: 60,
			onFilesFound: sandbox.stub(),
			onFilesProcessed: sandbox.stub()
		};
		processFile = sandbox.spy(function (file) {
			if (file.indexOf('.txt') !== -1) {
				return Promise.reject('not an image!');
			}
			return Promise.resolve({
				file: file
			});
		});
	});

	beforeEach(function (done) {
		result = error = undefined;
		processFiles(options, processFile).then(function (_result) {
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
		expect(processFiles).to.be.a('function');
	});

	it('should return a promise', function () {
		expect(processFiles(options, processFile)).to.be.a('promise');
	});

	describe('when it finds all valid image files', function () {
		before(function () {
			options.pattern = '**/*.{jpg,png}';
		});

		it('should call onFilesFound callback (with array of filenames)', function () {
			expect(options.onFilesFound).to.be.calledOnce;
			expect(options.onFilesFound).to.be.calledWith([
				'images/acquisition-tile-00-300.jpg',
				'images/battleship-wild-targets-tile-15-300.jpg',
				'images/secrets-of-the-phoenix-tile-10-300.png'
			]);
		});

		it('should call processFile with each image found', function () {
			expect(processFile.callCount).to.equal(3);
		});

		it('should call processFile with filename for each image', function () {
			expect(processFile).calledWith('images/acquisition-tile-00-300.jpg');
			expect(processFile).calledWith('images/battleship-wild-targets-tile-15-300.jpg');
			expect(processFile).calledWith('images/secrets-of-the-phoenix-tile-10-300.png');
		});

		it('should not reject the promise', function () {
			expect(error).to.not.exist;
		});

		it('should resolve promise with array of values returned by processFile', function () {
			expect(result).to.deep.equal([
				{ file: 'images/acquisition-tile-00-300.jpg' },
				{ file: 'images/battleship-wild-targets-tile-15-300.jpg' },
				{ file: 'images/secrets-of-the-phoenix-tile-10-300.png' }
			]);
		});

		it('should call onFilesProcessed callback', function () {
			expect(options.onFilesProcessed).to.be.calledOnce;
			// TODO: check called with array of filenames, array of results
		});
	});

	describe('when it finds no image files', function () {
		before(function () {
			options.pattern = '**/xxx.{jpg,png}';
		});

		it('should call onFilesFound callback (with empty array)', function () {
			expect(options.onFilesFound).to.be.calledOnce;
			expect(options.onFilesFound).to.be.calledWith([]);
		});

		it('should not call processFile', function () {
			expect(processFile).to.not.be.called;
		});

		it('should not reject the promise', function () {
			expect(error).to.not.exist;
		});

		it('should resolve the promise with an empty array', function () {
			expect(result).to.deep.equal([]);
		});

		it('should call onFilesProcessed callback (with empty arrays)', function () {
			expect(options.onFilesProcessed).to.be.calledOnce;
			expect(options.onFilesProcessed).to.be.calledWith([], []);
		});
	});

	describe('when processFile fails for some file', function () {
		before(function () {
			options.pattern = '**/*.{jpg,png,txt}';
		});

		it('should call onFilesFound callback (with array of filenames)', function () {
			expect(options.onFilesFound).to.be.calledOnce;
			expect(options.onFilesFound).to.be.calledWith([
				'data.txt',
				'images/acquisition-tile-00-300.jpg',
				'images/battleship-wild-targets-tile-15-300.jpg',
				'images/secrets-of-the-phoenix-tile-10-300.png'
			]);
		});

		it('should reject the promise', function () {
			expect(error).to.exist;
		});

		it('should not resolve the promise', function () {
			expect(result).to.not.exist;
		});

		it('should not call onFilesProcessed callback', function () {
			expect(options.onFilesProcessed).to.not.be.called;
		});
	});
});
