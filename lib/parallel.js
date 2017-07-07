var utils = require('./utils');

module.exports = function parallel(iterator, callback, maxParallel) {
	if(typeof callback !== 'function'){
		throw new TypeError(NO_FUNCTION_CALLBACK);
	}

	iterator = utils.wrapIteratorForAddIndex(iterator);

	return new Promise((resolve, reject) => {

		var context = {
			runningIterations: 0,
			result: [],
			resolve,
			reject,
			exceptionHappened: false
		};

		try{
			for (let i = 0; i < maxParallel; i++) {
				executeIteration.call(context, iterator, callback);
			}
		}catch(error) {
			context.exceptionHappened = true;
			reject(error);
		}
	});
};

function executeIteration(iterator, callback) {
	if(this.exceptionHappened){
		return;
	}

	this.runningIterations++;

	var item = iterator.next();
	
	if(item.done){
		this.runningIterations--;

		if(this.runningIterations <= 0) {
			this.resolve(this.result);
		}

		return;
	}

	var result = callback(item.value);

	if(!Utils.isPromise(result)){
		return nextIteration(this, iterator, callback, result);
	}

	return result
	.then(value => nextIteration(this, iterator, callback, value))
	.catch(error => {
		this.reject(error);
		this.exceptionHappened = true;
	});
}

function nextIteration(context, iterator, callback, value) {
	context.result[item.index] = result;
	return executeIteration.call(context, iterator, callback);
}
