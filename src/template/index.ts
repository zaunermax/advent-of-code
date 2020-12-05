import { readInput } from '../utils/index';
import { EMPTY, forkJoin, of } from 'rxjs';
import { map, timeInterval } from 'rxjs/operators';

const prepareInput = (rawInput: string) => rawInput.split(/\n/);

const input$ = of(readInput()).pipe(map(prepareInput));

const goA = async (input: typeof input$) => {
	return EMPTY;
};

const goB = async (input: typeof input$) => {
	return EMPTY;
};

forkJoin({ a: goA(input$), b: goB(input$) })
	.pipe(timeInterval())
	.subscribe(({ interval, value: { a, b } }) => {
		console.log('Solution to part 1:', a);
		console.log('Solution to part 2:', b);
		console.log(`Took ${interval}ms.`);
	});
