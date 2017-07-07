var utils = require('./utils');

var MAX_PARALLEL_EXECUTION = 100000;

module.exports = function parallel(iterator, callback, maxParallel) {
	if(typeof callback !== 'function'){
		throw new TypeError(utils.NO_FUNCTION_CALLBACK);
	}

	iterator = utils.wrapIteratorForAddIndex(iterator);

	return new Promise((resolve, reject) => {

		var context = {
			runningIterations: 0,
			result: [],
			resolve,
			reject,
			exceptionHappened: false,
			finishIterator: false
		};

		if(maxParallel <= 0 || maxParallel >= MAX_PARALLEL_EXECUTION){
			maxParallel = MAX_PARALLEL_EXECUTION;
		}

		try{
			for (let i = 0; i < maxParallel && !context.finishIterator; i++) {
				executeIteration.call(context, iterator, callback, true);
			}
		}catch(error) {
			context.exceptionHappened = true;
			reject(error);
		}
	});
};

function executeIteration(iterator, callback, isInitial) {
	if(this.exceptionHappened){
		return;
	}

	if(isInitial){
		this.runningIterations++;
	}

	var item = iterator.next();

	if(item.done){
		//Only substract iterations running if we finished the iterator, if not we are going to launch another one
		this.runningIterations--;
		this.finishIterator = true;

		if(this.runningIterations <= 0) {
			this.resolve(this.result);
		}

		return;
	}

	var result = callback(item.value);

	if(!utils.isPromise(result)){
		return nextIteration(this, iterator, callback, item.index, result);
	}

	return result
	.then(value => nextIteration(this, iterator, callback, item.index, value))
	.catch(error => {
		this.reject(error);
		this.exceptionHappened = true;
	});
}

function nextIteration(context, iterator, callback, index, value) {
	context.result[index] = value;
	return executeIteration.call(context, iterator, callback, false);
}
