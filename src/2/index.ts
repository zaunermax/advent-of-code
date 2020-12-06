import { readInput } from '../utils/index';
import { forkJoin, from, of } from 'rxjs';
import { count, filter, map, mergeAll, mergeMap, timeInterval } from 'rxjs/operators';
import { logValue } from '../utils/rs-util';

type PwPolicyObject = {
	policy: {
		min: number;
		max: number;
	};
	char: string;
	pw: string;
};

type EvaluatedPwObject = {
	min: number;
	max: number;
	charCnt: number;
};

const prepareInput = (rawInput: string) => rawInput.split(/\n/);

const toStreamOfChars = (input: string) => from(input.split(''));

const parseInput = (input: string) => input.split(':');

const stringNotEmpty = (str: string) => str.length > 0;

const parseIntDec = (val: string) => Number.parseInt(val, 10);

const parsePasswordPolicy = ([policy, rawPw]: string[]): PwPolicyObject => {
	const [minMax, char] = policy.split(' ');
	const [min, max] = minMax.split('-');

	return {
		policy: {
			min: parseIntDec(min),
			max: parseIntDec(max),
		},
		char: char.trim(),
		pw: rawPw.trim(),
	};
};

const evaluatePwPolicy = ({ policy: { min, max }, char, pw }: PwPolicyObject) =>
	forkJoin({
		min: of(min),
		max: of(max),
		charCnt: toStreamOfChars(pw).pipe(
			filter((val) => val === char),
			count(),
		),
	});

const invalidPasswords = ({ min, max, charCnt }: EvaluatedPwObject) =>
	charCnt <= max && charCnt >= min;

const input$ = of(readInput()).pipe(
	map(prepareInput),
	mergeAll(),
	filter(stringNotEmpty),
	map(parseInput),
	map(parsePasswordPolicy),
);

const goA = (input: typeof input$) =>
	input.pipe(mergeMap(evaluatePwPolicy), filter(invalidPasswords), count());

const goB = (input: typeof input$) => of(null);

forkJoin({ a: goA(input$), b: goB(input$) })
	.pipe(timeInterval())
	.subscribe(({ interval, value: { a, b } }) => {
		console.log('Solution to part 1:', a);
		console.log('Solution to part 2:', b);
		console.log(`Took ${interval}ms.`);
	});
