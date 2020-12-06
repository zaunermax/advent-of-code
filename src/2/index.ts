import { readInput } from '../utils/index';
import { forkJoin, from, of } from 'rxjs';
import { count, filter, map, mergeAll, mergeMap, timeInterval } from 'rxjs/operators';

type NumTuple = [number, number];

type PwPolicyObject = {
	policy: NumTuple;
	char: string;
	pw: string;
};

type EvaluatedPwObject = {
	policy: NumTuple;
	charCnt: number;
};

const prepareInput = (rawInput: string) => rawInput.split(/\n/);

const toStreamOfChars = (input: string) => from(input.split(''));

const parseInput = (input: string) => input.split(': ');

const stringNotEmpty = (str: string) => str.length > 0;

const parseIntDec = (val: string) => Number.parseInt(val, 10);

const parsePasswordPolicy = ([policy, rawPw]: string[]): PwPolicyObject => {
	const [minMax, char] = policy.split(' ');
	const [min, max] = minMax.split('-');

	return {
		policy: [parseIntDec(min), parseIntDec(max)],
		char: char,
		pw: rawPw,
	};
};

const evaluatePwPolicyV1 = ({ policy: [min, max], char, pw }: PwPolicyObject) =>
	forkJoin({
		policy: of<NumTuple>([min, max]),
		charCnt: toStreamOfChars(pw).pipe(
			filter((val) => val === char),
			count(),
		),
	});

const invalidPasswords = ({ policy: [min, max], charCnt }: EvaluatedPwObject) =>
	charCnt <= max && charCnt >= min;

const eitherPositionMatches = (pw: string, char: string, [pos1, pos2]: NumTuple) =>
	pw[pos1] === char || pw[pos2] === char;

const bothPositionsMatch = (pw: string, char: string, [pos1, pos2]: NumTuple) =>
	pw[pos1] === char && pw[pos2] === char;

const add = (a: number) => (b: number) => a + b;

const dec1 = add(-1);

const adjustPositionsToZeroIdx = ({ policy: [pos1, pos2], ...rest }: PwPolicyObject) => ({
	policy: [dec1(pos1), dec1(pos2)] as [number, number],
	...rest,
});

const evaluatePwPolicyV2 = ({ policy, char, pw }: PwPolicyObject) =>
	eitherPositionMatches(pw, char, policy) && !bothPositionsMatch(pw, char, policy);

const input$ = of(readInput()).pipe(
	map(prepareInput),
	mergeAll(),
	filter(stringNotEmpty),
	map(parseInput),
	map(parsePasswordPolicy),
);

const goA = (input: typeof input$) =>
	input.pipe(mergeMap(evaluatePwPolicyV1), filter(invalidPasswords), count());

const goB = (input: typeof input$) =>
	input.pipe(map(adjustPositionsToZeroIdx), filter(evaluatePwPolicyV2), count());

forkJoin({ a: goA(input$), b: goB(input$) })
	.pipe(timeInterval())
	.subscribe(({ interval, value: { a, b } }) => {
		console.log('Solution to part 1:', a);
		console.log('Solution to part 2:', b);
		console.log(`Took ${interval}ms.`);
	});
