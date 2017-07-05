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

	return Promise((resolve) => {
		var executionResult = executeIteration(callback, item, undefined, iterable);
		
		if(!Utils.isPromise(executionResult)){
			return resolve(executionResult);
		}

		return executionResult.then(resolve);
	});
};

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

	if(iterable.done) {
		return lastValue;
	}

	return executeIteration(callback, nextItem, lastValue, iterable);
}

function getIterator(iterable) {
	var iterator = iterable[Symbol.iterator];

	if(iterator) {
		return iterator;
	}

	//if iterable[Symbol.iterator] doesn't exit, assume a generator and try to execute to get the iterator.
	if(typeof iterable !== 'function') {
		//Ops, not a function, error
		throw new TypeError(NO_ITERABLE_ERROR);
	}
	//Get the iterator from the generator
	iterator = iterable()[Symbol.iterator];
	//If not iterator, error
	if(!iterator){
		throw new TypeError(NO_ITERABLE_ERROR);
	}

	return iterator;
}
