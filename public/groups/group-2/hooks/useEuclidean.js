import { formatDivisionEquation, parsePositiveInteger, sortDescendingPair } from "../utils/numberUtils.js";

export const useEuclidean = () => {
    const solve = (firstValue, secondValue) => {
        const firstNumber = parsePositiveInteger(firstValue);
        const secondNumber = parsePositiveInteger(secondValue);

        if (firstNumber === null || secondNumber === null) {
            return {
                error: "Please enter two valid positive integers (greater than 0).",
            };
        }

        const numbers = sortDescendingPair(firstNumber, secondNumber);
        const steps = [];
        let a = numbers.m;
        let b = numbers.n;

        while (b > 0) {
            const quotient = Math.floor(a / b);
            const remainder = a % b;

            steps.push(formatDivisionEquation(a, b, quotient, remainder));

            a = b;
            b = remainder;
        }

        const gcd = a;
        const lcm = (numbers.m * numbers.n) / gcd;

        return {
            m: numbers.m,
            n: numbers.n,
            steps,
            gcd,
            lcm,
        };
    };

    return {
        solve,
    };
};
