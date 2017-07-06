describe('Utils', function() {
	var Utils = require('../lib/utils');

	describe('getIterator', function() {
		var getIterator = Utils.getIterator;

		it('should should throw an error when is a function that is not a generator', function() {
			expect(() => getIterator(function() { return function(){}; } )).toThrow(new TypeError(Utils.NO_ITERABLE_ERROR));
		});
	});
});
