# Iterated Pipes


Iterator based utilities for handling sync & async tasks like async execution with a maximum for parallel tasks at the same time.

### ]^[　[![Build Status](https://travis-ci.org/DavidBM/iterated-pipes.svg?branch=master)](https://travis-ci.org/DavidBM/iterated-pipes)　[![Coverage Status](https://coveralls.io/repos/DavidBM/iterated-pipes/badge.svg?branch=master)](https://coveralls.io/r/DavidBM/iterated-pipes?branch=master)　]^[ 

### Index

<!-- MarkdownTOC autolink=true autoanchor=true bracket=round depth=0 -->

- [Methods](#methods)
	- [sequencial](#sequencial)
	- [parallel](#parallel)

<!-- /MarkdownTOC -->

<a name="methods"></a>
# Methods

This libreary is based in iterators, that means, it can work over everything that is iterable (arrays, generators, strings, ...). Just use the static method `iterate` and select the method. There is two basic patter, sequencial and parallel (wich admits a maximum of concurrency).

<a name="sequencial"></a>
## sequencial

Execute the promises one after the other, always waiting to the previous one to finish before executing the next Promise.

```javascript
	var piped = require('iterated-pipes');

	piped
	.iterate([...])
	.sequential(url => request(url))
	.then(lastValue => {...});
```

<a name="parallel"></a>
## parallel

Iterate all the items and return an array with the results. Is like a Promise.all but accepts a maximum quantity of maximum executions in parallel.

```javascript
	var piped = require('iterated-pipes');

	piped
	.iterate([...])
	.parallel(10, url => request(url)) //Executes a maximum of 10 calls at a time. When one call ends, call the next one
	.then(results => {...}); //All the results in the same order
```

Is important to make a distinction between this method and the ones that use Promise.all internally. This one executes the next call just after one call is finish meanwhile other methods execute X callbacks with Promise.all, waiting until the last one to continue the execution, making these methods less time efficient.
