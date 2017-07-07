var utils = require('./utils');

module.exports = function parallel(iterable, callback, maxParallel) {
	if(typeof callback !== 'function'){
		throw new TypeError(NO_FUNCTION_CALLBACK);
	}

	var iterator = Utils.getIterator(iterable);
	iterator = Utils.wrapIteratorForAddIndex(iterator);

	return new Promise((resolve, reject) => {

		var global = {
			runningIterations: 0,
			result: [],
			resolve,
			reject
		};

		for (let i = 0; i < maxParallel; i++) {
			executeIteration.call(global, iterator, callback);
		}
	});
};

function executeIteration(iterator, callback) {
	var item = iterator.next();

	if(item.done){
		this.runningIterations--;

		if(this.runningIterations === 0) {
			this.resolve(this.result);
		}

		return;
	}

	this.runningIterations++;

	var result = callback(item.value);

	if(!Utils.isPromise(result)){
		return nextIteration(this, iterator, callback, result);
	}

	return result
	.then(value => nextIteration(this, iterator, callback, value))
	.catch(error => this.reject);
}

function nextIteration(global, iterator, callback, value) {
	global.result[item.index] = result;
	return executeIteration.call(global, iterator, callback);
}
