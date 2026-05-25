export const usePalindrome = () => {
    const groupTwoCleanString = (value = "") =>
        [...String(value).toLowerCase()]
            .filter((groupTwoCharacter) => /[a-z0-9]/.test(groupTwoCharacter))
            .join("");

    const groupTwoIsPalindrome = (value = "") =>
        [...value].every((groupTwoCharacter, groupTwoIndex, groupTwoCharacters) =>
            groupTwoCharacter === groupTwoCharacters[groupTwoCharacters.length - 1 - groupTwoIndex]
        );

    const groupTwoCheck = (value = "") => {
        const groupTwoString = groupTwoCleanString(value);

        return {
            string: groupTwoString,
            palindrome: groupTwoString.length > 0 && groupTwoIsPalindrome(groupTwoString),
            length: groupTwoString.length,
        };
    };

    return {
        check: groupTwoCheck,
    };
};
