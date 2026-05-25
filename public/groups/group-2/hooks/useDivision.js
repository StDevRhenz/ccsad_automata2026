import { formatDivisionEquation, parsePositiveInteger, sortDescendingPair } from "../utils/numberUtils.js";

export const useDivision = () => {
    const solve = (firstValue, secondValue) => {
        const firstNumber = parsePositiveInteger(firstValue);
        const secondNumber = parsePositiveInteger(secondValue);

        if (firstNumber === null || secondNumber === null) {
            return {
                error: "Please enter two valid positive integers (greater than 0).",
            };
        }

        const { m, n } = sortDescendingPair(firstNumber, secondNumber);
        const quotient = Math.floor(m / n);
        const remainder = m % n;

        return {
            m,
            n,
            quotient,
            remainder,
            solution: formatDivisionEquation(m, n, quotient, remainder, true),
        };
    };

    return {
        solve,
    };
};
