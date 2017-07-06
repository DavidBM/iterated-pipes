exports.isPromise = (item) => {
	if(!item){
		return false;
	}

	return Promise.resolve(item) === item;
};
