import { combineLatest, forkJoin, from, of } from 'rxjs';
import { map, timeInterval, find, filter, mergeMap, tap } from 'rxjs/operators';
import { readInput } from '../utils';

const prepareInput = (rawInput: string) => rawInput.split(/\n/);

const parseIntDec = (num: string) => Number.parseInt(num, 10);

const mapToNumberArray = (nums: string[]) => nums.map(parseIntDec);

const input$ = of(readInput()).pipe(map(prepareInput), map(mapToNumberArray));

const goA = (input: typeof input$) =>
	input.pipe(
		mergeMap((input) =>
			from(input).pipe(
				mergeMap((val) => combineLatest([of(val), from(input)])),
				find(([a, b]) => a + b === 2020),
				filter((val): val is [number, number] => !!val && !!val[0] && !!val[1]),
				map(([a, b]) => a * b),
			),
		),
	);

const goB = (input: typeof input$) =>
	input.pipe(
		mergeMap((input) =>
			from(input).pipe(
				mergeMap((val) => combineLatest([of(val), from(input)])),
				mergeMap(([a, b]) => combineLatest([of(a), of(b), from(input)])),
				find(([a, b, c]) => a + b + c === 2020),
				filter(
					(val): val is [number, number, number] =>
						!!val && !!val[0] && !!val[1] && !!val[2],
				),
				map(([a, b, c]) => a * b * c),
			),
		),
	);

forkJoin({ a: goA(input$), b: goB(input$) })
	.pipe(timeInterval())
	.subscribe(({ interval, value: { a, b } }) => {
		console.log('Solution to part 1:', a);
		console.log('Solution to part 2:', b);
		console.log(`Took ${interval}ms.`);
	});
