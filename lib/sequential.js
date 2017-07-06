var Utils = require('./utils');

var NO_ITERABLE_ERROR = 'first argument must be an iterable item or a generator';
var NO_FUNCTION_CALLBACK = 'second argument must be a function';

module.exports = function sequential(iterable, callback) {
	if(typeof callback !== 'function'){
		throw new TypeError(NO_FUNCTION_CALLBACK);
	}

	var iterator = getIterator(iterable);
	var item = iterator.next();

	if(item.done) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		var executionResult = executeIteration(callback, item, undefined, iterator);
		
		if(!Utils.isPromise(executionResult)){
			return resolve(executionResult);
		}

		return executionResult
		.then(resolve)
		.catch(reject);
	});
};

module.exports.NO_ITERABLE_ERROR = NO_ITERABLE_ERROR;
module.exports.NO_FUNCTION_CALLBACK = NO_FUNCTION_CALLBACK;

function executeIteration (callback, item, lastValue, iterable){
	var returnedValue = callback(item.value, lastValue);

	//In case of not promises
	if(!Utils.isPromise(returnedValue)){
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

function getIterator(iterable) {
	if(!iterable){
		throw new TypeError(NO_ITERABLE_ERROR);
	}

	if(iterable[Symbol.iterator]) {
		//It comes from Symbol.iterator, is safe to assume that is a function that returns the iteraror
		return iterable[Symbol.iterator]();
	}

	//if iterable[Symbol.iterator] doesn't exit, assume a generator and try to execute to get the iterator.
	if(typeof iterable !== 'function') {
		//Ops, not a function, error
		throw new TypeError(NO_ITERABLE_ERROR);
	}
	//Get the iterator from the generator
	iterator = iterable();
	//If not iterator, error
	if(!iterator && typeof iterator.next !== 'function'){
		throw new TypeError(NO_ITERABLE_ERROR);
	}

	return iterator;
}
