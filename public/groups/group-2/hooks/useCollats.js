export const useCollats = () => {
    const getPositiveOddInteger = (value) => {
        const raw = String(value ?? "").trim();

        if (!/^\d+$/.test(raw)) {
            return null;
        }

        const number = Number(raw);

        return Number.isSafeInteger(number) && number > 0 && number % 2 === 1 ? number : null;
    };

    const getCollatzSequence = (startNumber) => {
        const sequence = [startNumber];
        let currentNumber = startNumber;

        while (currentNumber !== 1) {
            currentNumber = currentNumber % 2 === 1 ? currentNumber * 3 + 1 : currentNumber / 2;
            sequence.push(currentNumber);
        }

        return sequence;
    };

    const generate = (value) => {
        const startingNumber = getPositiveOddInteger(value);

        if (startingNumber === null) {
            return {
                error: "Enter a positive odd integer greater than 0.",
            };
        }

        const sequence = getCollatzSequence(startingNumber);

        return {
            sequence,
            output: `The Collatz sequence is: ${sequence.join(", ")}`,
        };
    };

    return {
        generate,
        getCollatzSequence,
        isValidInput: (value) => getPositiveOddInteger(value) !== null,
    };
};
