describe('Iterate', function() {
	var iterate;
	var IterateClass = require('../lib/iterate');

	beforeEach(function() {
		iterate = IterateClass.iterate([]);
	});

	it('should have the static method "iterate"', function() {
		expect(typeof IterateClass.iterate).toBe('function');
	});

	it('should return a instance of Iterate when "iterate" is call', function() {
		expect(IterateClass.iterate([]) instanceof IterateClass).toBe(true);
	});
});
