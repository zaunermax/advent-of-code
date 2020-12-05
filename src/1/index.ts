import { forkJoin, from, of } from 'rxjs';
import {map, tap, timeInterval} from 'rxjs/operators';
import { readInput } from '../utils';

const prepareInput = (rawInput: string) => rawInput.split(/\n/);

const input$ = of(readInput()).pipe(map(prepareInput))

const goA = async (input: typeof input$) => {
	return from(input)
		.pipe(tap((test) => console.log(test)))
		.toPromise();
};

const goB = async (input: typeof input$) => {
	return;
};

forkJoin({ a: goA(input$), b: goB(input$) })
	.pipe(timeInterval())
	.subscribe(({ interval, value: { a, b } }) => {
		console.log('Solution to part 1:', a);
		console.log('Solution to part 2:', b);
		console.log(`Took ${interval}ms.`);
	});
