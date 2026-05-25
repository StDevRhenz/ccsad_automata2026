const groupTwoToCamelCase = (groupTwoValue) =>
    groupTwoValue.replace(/-([a-z])/g, (_, groupTwoLetter) => groupTwoLetter.toUpperCase());

export const groupTwoGetElements = (groupTwoPrefix, groupTwoIds, groupTwoRoot = document) =>
    Object.fromEntries(groupTwoIds.map((groupTwoId) => [
        groupTwoToCamelCase(groupTwoId),
        groupTwoRoot.querySelector(`#groupTwo-${groupTwoPrefix}-${groupTwoId}`),
    ]));

export const groupTwoSetText = (groupTwoEntries) => {
    groupTwoEntries.forEach(([groupTwoElement, groupTwoValue]) => {
        groupTwoElement.textContent = groupTwoValue;
    });
};

export const groupTwoShowMessage = (groupTwoElement, groupTwoText) => {
    groupTwoElement.textContent = groupTwoText;
    groupTwoElement.hidden = false;
};

const groupTwoShowResults = (groupTwoElement, groupTwoState = "") => {
    groupTwoElement.hidden = false;

    groupTwoState
        ? groupTwoElement.dataset.groupTwoState = groupTwoState
        : delete groupTwoElement.dataset.groupTwoState;
};

export const groupTwoCreateListItem = (groupTwoText) => Object.assign(document.createElement("li"), {
    textContent: groupTwoText,
});

export const groupTwoToggleCurrentPage = (groupTwoElement, groupTwoIsCurrent) =>
    groupTwoIsCurrent
        ? groupTwoElement.setAttribute("aria-current", "page")
        : groupTwoElement.removeAttribute("aria-current");

const groupTwoNoop = () => {};

const groupTwoResolveTextValue = (groupTwoValue, groupTwoResult) =>
    typeof groupTwoValue === "function"
        ? groupTwoValue(groupTwoResult)
        : groupTwoValue in groupTwoResult
            ? groupTwoResult[groupTwoValue]
            : groupTwoValue;

const groupTwoSetMappedText = (groupTwoElements, groupTwoTextMap, groupTwoResult = {}) =>
    groupTwoSetText(Object.entries(groupTwoTextMap).map(([groupTwoKey, groupTwoValue]) => [
        groupTwoElements[groupTwoKey],
        groupTwoResolveTextValue(groupTwoValue, groupTwoResult),
    ]));

export const groupTwoInitSolver = ({
    groupTwoPrefix,
    groupTwoFields,
    groupTwoUseSolver,
    groupTwoSolve,
    groupTwoSuccessMessage,
    groupTwoErrorText,
    groupTwoSuccessText,
    groupTwoBeforeError = groupTwoNoop,
    groupTwoBeforeSuccess = groupTwoNoop,
}) => {
    const groupTwoElements = groupTwoGetElements(groupTwoPrefix, ["form", "message", "results", ...groupTwoFields]);

    if (!groupTwoElements.form) {
        return;
    }

    const groupTwoSolver = groupTwoUseSolver();

    groupTwoElements.form.addEventListener("submit", (event) => {
        event.preventDefault();

        const groupTwoResult = groupTwoSolve(groupTwoSolver, groupTwoElements);
        const groupTwoHasError = Boolean(groupTwoResult.error);

        groupTwoShowMessage(groupTwoElements.message, groupTwoHasError ? groupTwoResult.error : groupTwoSuccessMessage);
        groupTwoShowResults(groupTwoElements.results, groupTwoHasError ? "error" : "");
        (groupTwoHasError ? groupTwoBeforeError : groupTwoBeforeSuccess)(groupTwoElements, groupTwoResult);
        groupTwoSetMappedText(groupTwoElements, groupTwoHasError ? groupTwoErrorText : groupTwoSuccessText, groupTwoResult);
    });
};
