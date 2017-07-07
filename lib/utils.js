exports.isPromise = (item) => Promise.resolve(item) === item;

var NO_ITERABLE_ERROR = 'first argument must be an iterable item or a generator';

exports.getIterator = function getIterator(iterable) {

	if(!iterable){
		throw new TypeError(NO_ITERABLE_ERROR);
	}

	if(iterable[Symbol.iterator]) {
		//It comes from Symbol.iterator, is safe to assume that is a function that returns the iteraror
		//Funny fact, we can't store the result of iterable[Symbol.iterator] in a variable and execute later because it throws an error. Not sure why.
		return iterable[Symbol.iterator]();
	}

	//if iterable[Symbol.iterator] doesn't exit, assume a generator and try to execute to get the iterator.
	//But if is not a function, return an error
	if(typeof iterable !== 'function') {
		throw new TypeError(NO_ITERABLE_ERROR);
	}

	//Get the iterator from the generator
	var iterator = iterable();

	//If not iterator, error
	if(!iterator || typeof iterator.next !== 'function'){
		throw new TypeError(NO_ITERABLE_ERROR);
	}

	return iterator;
};

exports.NO_ITERABLE_ERROR = NO_ITERABLE_ERROR;

exports.wrapIteratorForAddIndex = function wrapIteratorForAddIndex(iterator) {
	var index = 0;

	return {
		next: () => {
			var item = iterator.next();
			item.index = index;
			index++;
			return item;
		}
	};
};
