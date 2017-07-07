var utils = require('./utils');

module.exports = function sequential(iterator, callback) {
	if(typeof callback !== 'function'){
		throw new TypeError(utils.NO_FUNCTION_CALLBACK);
	}

	var item = iterator.next();

	if(item.done) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		var executionResult = executeIteration(callback, item, undefined, iterator);
		
		if(!utils.isPromise(executionResult)){
			return resolve(executionResult);
		}

		return executionResult
		.then(resolve)
		.catch(reject);
	});
};

function executeIteration (callback, item, lastValue, iterable){
	var returnedValue = callback(item.value, lastValue);

	//In case of not promises
	if(!utils.isPromise(returnedValue)){
		return nextIteration(callback, returnedValue, iterable);
	}

	//If we have a promise
	return returnedValue
	.then(lastValue => nextIteration(callback, lastValue, iterable));
}

function nextIteration(callback, lastValue, iterable){
	var nextItem = iterable.next();

	if(nextItem.done) {
		return lastValue;
	}

	return executeIteration(callback, nextItem, nextItem.value, iterable);
}
