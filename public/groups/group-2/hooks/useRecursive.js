export const useRecursive = () => {
    const createMemoizedSequence = (initialTerms, nextValue) => {
        const memo = new Map(initialTerms);
        const sequence = (n) => {
            if (memo.has(n)) {
                return memo.get(n);
            }

            const value = nextValue(n, sequence);
            memo.set(n, value);
            return value;
        };

        return sequence;
    };

    const fib = createMemoizedSequence([[0, 0n], [1, 1n]], (n, sequence) => sequence(n - 1) + sequence(n - 2));
    const luc = createMemoizedSequence([[0, 2n], [1, 1n]], (n, sequence) => sequence(n - 1) + sequence(n - 2));
    const tri = createMemoizedSequence([[0, 0n], [1, 0n], [2, 1n]], (n, sequence) => sequence(n - 1) + sequence(n - 2) + sequence(n - 3));

    const config = {
        fib: {
            fn: fib,
            minTerms: 3,
            label: "Fibonacci",
            intro: "This program will find all the terms of the Fibonacci numbers.",
        },
        luc: {
            fn: luc,
            minTerms: 3,
            label: "Lucas",
            intro: "This program will find all the terms of the Lucas numbers.",
        },
        tri: {
            fn: tri,
            minTerms: 4,
            label: "Tribonacci",
            intro: "This program will find all the terms of the Tribonacci numbers.",
        },
    };

    const getValidInteger = (value) => {
        const raw = String(value ?? "").trim();

        if (raw === "" || !/^-?\d+$/.test(raw)) {
            return null;
        }

        const number = Number(raw);

        return Number.isSafeInteger(number) ? number : null;
    };

    const getTerms = (sequenceId, count) => {
        const sequence = config[sequenceId];

        return Array.from({ length: count }, (_, index) => sequence.fn(index).toString());
    };

    const compute = (sequenceId, value) => {
        const sequence = config[sequenceId];

        if (!sequence) {
            return {
                error: "Invalid sequence.",
            };
        }

        const count = getValidInteger(value);

        if (count === null) {
            return {
                error: "Please enter a valid integer.",
            };
        }

        if (count < sequence.minTerms) {
            return {
                error: `The number of terms must be greater than ${sequence.minTerms - 1}.`,
            };
        }

        const terms = getTerms(sequenceId, count);

        return {
            count,
            terms,
            output:
                `${sequence.intro}\n` +
                `Input the number of terms: ${count}\n` +
                `The ${sequence.label} numbers are: ${terms.join(", ")}`,
        };
    };

    return {
        compute,
        fib,
        luc,
        tri,
    };
};
