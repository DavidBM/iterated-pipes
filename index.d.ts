declare module 'iterated-pipes' {
	export function iterate<T>(iterable: Iterable<T>): IterableContext<T>

	interface IterableContext<T> {
		sequential: (callback: Callback<T>) => Promise<any>
		parallel: (parallel: number, callback: Callback<T>) => Promise<any>
	}

	type Callback<T> = (item: T) => Promise<any> | any;
}
