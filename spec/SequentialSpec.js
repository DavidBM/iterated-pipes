describe('Sequential', function() {
	var sequential;

	beforeEach(function() {
		sequential = require('../lib/sequential');
	});

	it('should be a function', function() {
		expect(typeof sequential).toBe('function');
	});

	it('should throw if the second argument is not a function', function() {
		
	});

	it('should throw an error if the input is not an iterable or a generator', function() {
		let nonIterables = [
			{}, [], NaN, 1, '', 'asd', /a/,
			class Classname {},
			{[Symbol.iterable]: {}} //missing the next function
		];

		nonIterables.forEach(nonIterable => 
			expect(() => 
				sequential(nonIterable, () => {})
			).toThrow()
		);
	});

	it('should return a promise with correct input (iterable, function)', function() {
		
	});

	it('should iterate in order', function() {
		
	});

	it('should end with the last value of the iteration', function() {
		
	});

	it('should end with undefined if an empty array is past', function() {
		
	});

	it('should end with undefined if the generator ends on the first execution', function() {
		
	});

	it('should accept non promises as the callback return', function() {
		
	});

	it('should accept promises and wait for them in the callback return', function() {
		
	});

	it('should give the last value to the next call', function() {
		
	});
});
