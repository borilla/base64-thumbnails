var index = require('../index');

var chai = require('chai');
var expect = chai.expect;

describe('index', function () {
	it('should export a processFile function', function () {
		expect(index.processFile).to.be.a('function');
	});

	it('should export a processFiles function', function () {
		expect(index.processFiles).to.be.a('function');
	});

	it('should export processFiles function as default', function () {
		expect(index.default).to.equal(index.processFiles);
	});
});
