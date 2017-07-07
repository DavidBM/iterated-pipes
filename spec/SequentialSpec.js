var Utils = require('../lib/utils');
var sequential = require('../lib/sequential');

describe('Sequential', function() {
	var piped;

	beforeEach(function() {
		piped = require('../lib/lib');
	});

	it('should be a function', function() {
		expect(typeof piped.iterate([]).sequential).toBe('function');
	});

	it('should throw if the second argument is not a function', function() {
		expect(() => {
			piped.iterate([]).sequential(NaN);
		}).toThrow(new TypeError(sequential.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).sequential([])).toThrow(new TypeError(sequential.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).sequential({})).toThrow(new TypeError(sequential.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).sequential(1)).toThrow(new TypeError(sequential.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).sequential('')).toThrow(new TypeError(sequential.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).sequential('asd')).toThrow(new TypeError(sequential.NO_FUNCTION_CALLBACK));
	});

	it('should throw an error if the input is not an iterable or a generator', function() {
		let nonIterables = [
			{}, NaN, 1, /a/, //undefined
		];

		nonIterables.forEach(nonIterable => 
			expect( () => piped.iterate(nonIterable).sequential(() => {}) ).toThrow(new TypeError(Utils.NO_ITERABLE_ERROR))
		);
	});

	it('should return a promise with correct input (iterable, function)', function() {
		var value = piped.iterate([]).sequential(() => {});

		var isPromise = Promise.resolve(value) === value;

		expect(isPromise).toBe(true);
	});


	it('should give the last value to the next call', function(done) {
		var iteratedValues = [];
		var initialValues = [123, '', [], {}, 0, -1, '2'];

		piped.iterate(initialValues).sequential((value) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					iteratedValues.push(value);
					resolve();
				}, 4);
			});
		})
		.then((value) => {
			expect(iteratedValues).toEqual(initialValues);
			done();
		});
	});

	it('should iterate in order', function(done) {
		var iteratedValues = [];
		var initialValues = [123, '', [], {}, 0, -1, '2'];

		piped.iterate(initialValues).sequential((value) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					iteratedValues.push(value);
					resolve();
				}, 4);
			});
		})
		.then(() => {
			expect(iteratedValues).toEqual(initialValues);
			done();
		});
	});

	it('should end with the last value of the iteration', function(done) {
		var initialValues = [123, '', [], {}, 0, -1, '2'];

		piped.iterate(initialValues).sequential((value) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(value);
				}, 4);
			});
		})
		.then(lastValue => {
			expect(lastValue).toBe(initialValues.pop());
			done();
		});
	});

	it('should end with the last value of the generator', function(done) {
		var generator = function* () {
			var index = 0;
			while (index < 3)
				yield index++;
		};

		piped.iterate(generator).sequential((value) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(value);
				}, 4);
			});
		})
		.then(lastValue => {
			expect(lastValue).toBe(2);
			done();
		});
	});

	it('should end with undefined if an empty array is past', function(done) {
		/* istanbul ignore next - This function will never be executed */
		piped.iterate([]).sequential((value) => value)
		.then(lastValue => {
			expect(typeof lastValue).toBe('undefined');
			done();
		});
	});

	it('should end with undefined if the generator ends on the first execution', function(done) {
		piped.iterate(function* () {
			yield undefined;
		}).sequential((value) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(value);
				}, 4);
			});
		})
		.then(lastValue => {
			expect(typeof lastValue).toBe('undefined');
			done();
		});
	});

	it('should accept non promises as the callback return (check last value)', function(done) {
		var initialValues = [1, 2, 5];

		var fn = (value) => value * 2;

		piped.iterate(initialValues).sequential(fn)
		.then(lastValue => {
			expect(lastValue).toBe(fn(initialValues.pop()));
			done();
		});
	});

	it('should accept non promises as the callback return (check order)', function(done) {
		var initialValues = [1, 2, 5];
		var iteratedValues = [];

		piped.iterate(initialValues).sequential(value => {
			iteratedValues.push(value);
		})
		.then(() => {
			expect(iteratedValues).toEqual(initialValues);
			done();
		});
	});

	it('should accept promises and wait for them in the callback return', function(done) {
		var iteratedValues = [];
		var initialValues = [10, 200, 1, 30, 45, 4];

		piped.iterate(initialValues).sequential((value) => {
			return new Promise((resolve) => {
				setTimeout(() => {
					iteratedValues.push(value);
					resolve();
				}, value);
			});
		})
		.then(() => {
			expect(iteratedValues).toEqual(initialValues);
			done();
		});
	});
});
