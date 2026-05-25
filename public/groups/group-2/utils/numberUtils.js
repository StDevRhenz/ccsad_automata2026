const positiveIntegerPattern = /^\d+$/;

export const parsePositiveInteger = (value) => {
    const raw = String(value ?? "").trim();

    if (!positiveIntegerPattern.test(raw)) {
        return null;
    }

    const number = Number(raw);

    return Number.isSafeInteger(number) && number > 0 ? number : null;
};

export const sortDescendingPair = (firstNumber, secondNumber) => {
    const [m, n] = firstNumber >= secondNumber
        ? [firstNumber, secondNumber]
        : [secondNumber, firstNumber];

    return { m, n };
};

export const formatDivisionEquation = (dividend, divisor, quotient, remainder, includeZeroRemainder = false) => {
    const remainderText = remainder > 0 || includeZeroRemainder ? ` + ${remainder}` : "";

    return `${dividend} = ${divisor}(${quotient})${remainderText}`;
};
