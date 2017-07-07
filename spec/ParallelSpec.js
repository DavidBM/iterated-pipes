var Utils = require('../lib/utils');
var sequential = require('../lib/sequential');

describe('Parallel', function() {
	var piped;

	beforeEach(function() {
		piped = require('../lib/lib');
	});

	it('should have the parallel function', function() {
		expect(typeof piped.iterate([]).parallel).toBe('function');
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

	it('should accept to only pass a callback', function() {
		expect(() => piped.iterate([]).parallel(() => {})).not.toThrow();
	});

	it('should assume a infinite parallel iterations if 0 is passed as maxIterations', function(done) {
		var initialValues = new Array(10).fill(0).map(() => Math.random() * 50);
		var results = [];

		piped
		.iterate(initialValues)
		.parallel(value => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					results.push(value);
					resolve();
				}, value);
			});
		})
		.then(values => {
			expect(values).toEqual(initialValues);
			done();
		})
		.catch(error => console.log(error));
	});

	it('should assume a infinite parallel iterations if maxIterations is not passed', function() {
		
	});

	it('should return a promise with correct input (iterable, function)', function() {
		var value = piped.iterate([]).sequential(() => {});

		var isPromise = Promise.resolve(value) === value;

		expect(isPromise).toBe(true);
	});

	it('should return an array with all the results of the executions of the callbacks (promises)', function() {
		
	});

	it('should return an array with all the results of the executions of the callbacks (sync)', function () {
		
	});

	it('should work properly of maxIterations id greather than the iterable length', function() {
		
	});

	it('should throw error if the maxIterations is not a number', function() {
		
	});

	it('should execute a maximum of operations in parallel as the maxIterations', function() {
		
	});

	it('should call the callbacks inmediatelly, not one after the other (promises)', function() {
		
	});

	it('should stop executing callbacks if there is an exception (in promise)', function() {
		
	});

	it('should stop executing callbacks if there is an exception (in sync code)', function() {
		
	});

	it('should return the results in the same order as the iterable', function() {
		
	});
});
