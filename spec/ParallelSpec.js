var utils = require('../lib/utils');

describe('Parallel', function() {
	var piped;

	beforeEach(function() {
		piped = require('../lib/lib');
	});

	it('should have the parallel function', function() {
		expect(typeof piped.iterate([]).parallel).toBe('function');
	});

	it('should throw if the second argument is not a function', function() {
		expect(() => piped.iterate([]).parallel(NaN)).toThrow(new TypeError(utils.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).parallel([])).toThrow(new TypeError(utils.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).parallel({})).toThrow(new TypeError(utils.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).parallel(1)).toThrow(new TypeError(utils.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).parallel('')).toThrow(new TypeError(utils.NO_FUNCTION_CALLBACK));
		expect(() => piped.iterate([]).parallel('asd')).toThrow(new TypeError(utils.NO_FUNCTION_CALLBACK));
	});

	it('should throw an error if the input is not an iterable or a generator', function() {
		let nonIterables = [
			{}, NaN, 1, /a/, //undefined
		];

		nonIterables.forEach(nonIterable => 
			expect( () => piped.iterate(nonIterable).parallel(() => {}) ).toThrow(new TypeError(utils.NO_ITERABLE_ERROR))
		);
	});

	it('should accept to only pass a callback', function() {
		expect(() => piped.iterate([]).parallel(() => {})).not.toThrow();
	});

	it('should return a promise with correct input (iterable, function)', function() {
		var value = piped.iterate([]).parallel(10, () => {});

		expect(utils.isPromise(value)).toBe(true);
	});

	it('should assume a infinite parallel iterations if 0 is passed as maxIterations', function(done) {
		var initialValues = new Array(10000).fill(0).map(() => Math.random() * 50);

		var date = Date.now();

		piped
		.iterate(initialValues)
		.parallel(0, value => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, value);
			});
		})
		.then(() => {
			expect(date - Date.now()).toBeLessThan(100);
			done();
		});
	});

	it('should assume a infinite parallel iterations if maxIterations is not passed', function(done) {
		var initialValues = new Array(10000).fill(0).map(() => Math.random() * 50);

		var date = Date.now();

		piped
		.iterate(initialValues)
		.parallel(value => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, value);
			});
		})
		.then(() => {
			expect(date - Date.now()).toBeLessThan(100);
			done();
		});
	});

	it('should return an array with all the results of the executions of the callbacks in the same order (promises)', function(done) {
		var initialValues = new Array(1000).fill(0).map(() => Math.random() * 50);

		piped
		.iterate(initialValues)
		.parallel(73, value => {
			return new Promise((resolve) => {
				resolve(value);
			});
		})
		.then((values) => {
			expect(initialValues).toEqual(values);
			done();
		});
	});

	it('should return an array with all the results of the executions of the callbacks (sync)', function (done) {
		var initialValues = new Array(1000).fill(0).map(() => Math.random() * 50);

		piped
		.iterate(initialValues)
		.parallel(73, value => value)
		.then((values) => {
			expect(initialValues).toEqual(values);
			done();
		});
	});

	it('should work properly if maxIterations is greater than the iterable length', function(done) {
		var initialValues = new Array(1000).fill(0).map(() => Math.random() * 50);

		piped
		.iterate(initialValues)
		.parallel(2000, value => value)
		.then((values) => {
			expect(initialValues).toEqual(values);
			done();
		});
	});


	it('should work properly if maxIterations is less than the iterable length', function(done) {
		var initialValues = new Array(1000).fill(0).map(() => Math.random() * 50);

		piped
		.iterate(initialValues)
		.parallel(10, value => value)
		.then((values) => {
			expect(initialValues).toEqual(values);
			done();
		});
	});

	it('should throw error if the maxIterations is not a number and integer', function() {
		expect(() => piped.iterate([]).parallel(NaN, value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
		expect(() => piped.iterate([]).parallel('', value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
		expect(() => piped.iterate([]).parallel('hola', value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
		expect(() => piped.iterate([]).parallel(12.23, value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
		expect(() => piped.iterate([]).parallel(() => {}, value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
		expect(() => piped.iterate([]).parallel(/a/, value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
		expect(() => piped.iterate([]).parallel(undefined, value => value)).toThrow(new TypeError(utils.MAX_ITERATION_NOT_NUMBER));
	});

	it('should call the callbacks inmediatelly, not one after the other (promises)', function(done) {
		var initialValues = [60, 70, 50, 10, 20];

		var date = Date.now();

		piped
		.iterate(initialValues)
		.parallel(value => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, value);
			});
		})
		.then(() => {
			expect(date - Date.now()).toBeLessThan(80);
			done();
		});
	});

	it('should execute a maximum of operations in parallel as the maxIterations', function(done) {
		var initialValues = [100, 110, 50, 10, 101, 20];

		var finalValues = [];

		piped
		.iterate(initialValues)
		.parallel(3, value => {
			return new Promise((resolve) => {
				setTimeout(() => {
					finalValues.push(value);
					resolve();
				}, value);
			});
		})
		.then(() => {
			expect(finalValues).toEqual([50, 10, 100, 110, 20, 101]);
			done();
		});
	});

	it('should stop executing callbacks if there is an exception (in promise)', function(done) {
		var initialValues = [60, 50, 70, 10, 20, 80, 90];

		var finalValues = [];

		piped
		.iterate(initialValues)
		.parallel(3, value => {
			return new Promise((resolve, reject) => {
				finalValues.push(value);
				
				setTimeout(() => {
					if(value === 60){
						return reject('error');
					}
					resolve();
				}, value);
			});
		})
		.catch(error => {
			expect(error).toBe('error');

			setTimeout(() => {
				expect(finalValues).toEqual([60, 50, 70, 10]);
				done();
			}, 100);
		});
	});

	it('should stop executing callbacks if there is an exception (in sync code)', function(done) {
		var initialValues = [60, 50, 70, 10, 20, 80, 90];

		var finalValues = [];

		piped
		.iterate(initialValues)
		.parallel(3, value => {
			finalValues.push(value);
			
			if(value === 50){
				throw 'error';
			}
		})
		.catch(error => {
			expect(error).toBe('error');
			expect(finalValues).toEqual([60, 50]);
			done();
		});
	});
});
