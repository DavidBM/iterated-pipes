var sequential = require('./sequential');

module.exports = class Iterate  {
	constructor(iterable) {
		this.iterable = iterable;
	}

	static iterate(iterable){
		return new Iterate(iterable);
	}

	parallel(){
		
	}

	sequential(callback){
		return sequential(this.iterable, callback);
	}
};
