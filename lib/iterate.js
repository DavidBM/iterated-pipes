var sequential = require('./sequential');
var parallel = require('./parallel');
var utils = require('./utils');

module.exports = class Iterate {
	constructor(iterable) {
		this.iterator = utils.getIterator(iterable);
	}

	static iterate(iterable){
		return new Iterate(iterable);
	}

	parallel(maxParallel, callback){
		if(arguments.length === 1){
			callback = maxParallel;
			maxParallel = 0;
		}

		if(!Number.isInteger(maxParallel)) {
			throw new TypeError(utils.MAX_ITERATION_NOT_NUMBER);
		}

		return parallel(this.iterator, callback, maxParallel);
	}

	sequential(callback){
		return sequential(this.iterator, callback);
	}
};
