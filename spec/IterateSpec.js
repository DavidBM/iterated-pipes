describe('Iterate', function() {
	var iterate;
	var IterateClass = require('../lib/iterate');

	beforeEach(function() {
		IterateClass = require('../lib/iterate');
		iterate = IterateClass.iterate([]);
	});

	it('should have the static method "iterate"', function() {
		expect(typeof IterateClass.iterate).toBe('function');
	});

	it('should return a instance of Iterate when "iterate" is call', function() {
		expect(IterateClass.iterate() instanceof IterateClass).toBe(true);
	});

	it('should have the method parallel', function() {
		expect(typeof iterate.parallel).toBe('function');
	});

	it('should have the method sequential', function() {
		expect(typeof iterate.sequential).toBe('function');
	});

	it('should execute the sequential code succefully', function(done) {
		var originalValues = [1, 2, 3, 4, 3, 2];
		var iterate = IterateClass.iterate(originalValues);

		var iteratedValues = [];

		iterate
		.sequential((lastValue) => iteratedValues.push(lastValue))
		.then(() => {
			var equalArrays = originalValues.every((value, index) => iteratedValues[index] = value);

			expect(equalArrays).toBe(true);
			done();
		});
	});
});
