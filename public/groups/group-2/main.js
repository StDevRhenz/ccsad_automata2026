import { usePalindrome } from "./hooks/usePalindrome.js";
import { useDivision } from "./hooks/useDivision.js";
import { useEuclidean } from "./hooks/useEuclidean.js";
import { useCollats } from "./hooks/useCollats.js";
import { useRecursive } from "./hooks/useRecursive.js";
import {
    groupTwoCreateListItem,
    groupTwoGetElements,
    groupTwoInitSolver,
    groupTwoSetText,
    groupTwoShowMessage,
    groupTwoToggleCurrentPage,
} from "./utils/domUtils.js";

const groupTwoPageTransition = (() => {
    const groupTwoStorageKey = "groupTwoPageTransition";
    const groupTwoMotionDuration = 360;

    const groupTwoUseStorage = (groupTwoAction) => {
        try {
            return groupTwoAction(sessionStorage);
        } catch (groupTwoError) {
            return null;
        }
    };

    const groupTwoReadEntry = () => groupTwoUseStorage((groupTwoStorage) => groupTwoStorage.getItem(groupTwoStorageKey));
    const groupTwoSaveEntry = () => groupTwoUseStorage((groupTwoStorage) => groupTwoStorage.setItem(groupTwoStorageKey, "active"));
    const groupTwoClearEntry = () => groupTwoUseStorage((groupTwoStorage) => groupTwoStorage.removeItem(groupTwoStorageKey));

    if (groupTwoReadEntry() === "active") {
        document.body.classList.add("groupTwo-is-entering");
        groupTwoClearEntry();
    }

    const groupTwoNavigate = (groupTwoUrl, groupTwoDirection = 1) => {
        if (!groupTwoUrl || document.body.classList.contains("groupTwo-is-leaving")) {
            return;
        }

        const groupTwoTarget = new URL(groupTwoUrl, window.location.href);

        if (groupTwoTarget.href === window.location.href) {
            return;
        }

        groupTwoSaveEntry();
        document.body.dataset.groupTwoDirection = groupTwoDirection < 0 ? "previous" : "next";
        document.body.classList.add("groupTwo-is-leaving");

        window.setTimeout(() => {
            window.location.href = groupTwoTarget.href;
        }, groupTwoMotionDuration);
    };

    return {
        navigate: groupTwoNavigate,
    };
})();

const groupTwoRoutes = {
    landing: "index.html",
    palindrome: "pages/palindromeCase.html",
    division: "pages/divisionCase.html",
    euclidean: "pages/euclideanCase.html",
    collatz: "pages/collatsCase.html",
    recursive: "pages/RecursiveCase.html",
};

const groupTwoGetRootPrefix = () => (document.body.dataset.groupTwoPage === "landing" ? "" : "../");

const groupTwoResolveRootPath = (groupTwoPath) => `${groupTwoGetRootPrefix()}${groupTwoPath}`;

const groupTwoLoadNavbar = async () => {
    const groupTwoNavbarMount = document.querySelector("[data-group-two-navbar]");

    if (!groupTwoNavbarMount) {
        return;
    }

    try {
        const groupTwoResponse = await fetch(groupTwoResolveRootPath("components/navbar.html"));

        if (!groupTwoResponse.ok) {
            throw new Error(`Navbar request failed: ${groupTwoResponse.status}`);
        }

        groupTwoNavbarMount.outerHTML = await groupTwoResponse.text();
    } catch (groupTwoError) {
        groupTwoNavbarMount.remove();
        return;
    }

    const groupTwoCurrentPage = document.body.dataset.groupTwoPage || "landing";
    document.querySelector("[data-group-two-nav-asset='aurora']")?.setAttribute("src", groupTwoResolveRootPath("assets/aurora.webp"));

    document.querySelectorAll("[data-group-two-nav-route]").forEach((groupTwoLink) => {
        const groupTwoRoute = groupTwoLink.dataset.groupTwoNavRoute;
        const groupTwoRoutePath = groupTwoRoutes[groupTwoRoute];

        groupTwoLink.href = groupTwoRoutePath ? groupTwoResolveRootPath(groupTwoRoutePath) : groupTwoLink.href;

        if (!groupTwoLink.classList.contains("groupTwo-navLink")) {
            return;
        }

        const groupTwoIsActive = groupTwoRoute === groupTwoCurrentPage;

        groupTwoLink.classList.toggle("groupTwo-navActive", groupTwoIsActive);
        groupTwoToggleCurrentPage(groupTwoLink, groupTwoIsActive);
    });
};

const groupTwoInitTheme = () => {
    const groupTwoThemeControl = document.querySelector(".groupTwo-themeControl");
    const groupTwoStorageKey = "prefView";
    const groupTwoThemeValues = new Set(["system", "light", "dark"]);
    const groupTwoThemeOptions = [
        { value: "system", label: "System Theme" },
        { value: "light", label: "Light Theme" },
        { value: "dark", label: "Dark Theme" },
    ];
    const groupTwoThemeKeyDelta = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1,
    };

    const groupTwoGetSavedTheme = () => {
        try {
            const groupTwoSavedTheme = localStorage.getItem(groupTwoStorageKey);
            return groupTwoThemeValues.has(groupTwoSavedTheme) ? groupTwoSavedTheme : "system";
        } catch (groupTwoError) {
            return "system";
        }
    };

    const groupTwoApplyTheme = (groupTwoTheme) => {
        document.documentElement.dataset.groupTwoTheme = groupTwoTheme;
    };

    const groupTwoSaveTheme = (groupTwoTheme) => {
        try {
            localStorage.setItem(groupTwoStorageKey, groupTwoTheme);
        } catch (groupTwoError) {
            return null;
        }
    };

    const groupTwoCurrentTheme = groupTwoGetSavedTheme();
    groupTwoApplyTheme(groupTwoCurrentTheme);

    if (!groupTwoThemeControl) {
        return;
    }

    const groupTwoRenderOption = ({ value, label }) => `
        <button class="groupTwo-themeOption" type="button" role="radio" data-group-two-theme-option="${value}" aria-checked="${value === groupTwoCurrentTheme}">
            ${label}
        </button>
    `;

    groupTwoThemeControl.innerHTML = `
        <div class="groupTwo-themeGroup">
            <span class="groupTwo-themeLegend" id="groupTwo-theme-label">Theme</span>
            <div class="groupTwo-themeOptions" role="radiogroup" aria-labelledby="groupTwo-theme-label">
                ${groupTwoThemeOptions.map(groupTwoRenderOption).join("")}
            </div>
        </div>
    `;

    const groupTwoThemeButtons = groupTwoThemeControl.querySelectorAll("[data-group-two-theme-option]");

    const groupTwoUpdateActiveOption = (groupTwoTheme) => {
        groupTwoThemeButtons.forEach((groupTwoButton) => {
            groupTwoButton.setAttribute("aria-checked", String(groupTwoButton.dataset.groupTwoThemeOption === groupTwoTheme));
        });
    };

    const groupTwoSetTheme = (groupTwoTheme) => {
        const groupTwoSafeTheme = groupTwoThemeValues.has(groupTwoTheme) ? groupTwoTheme : "system";

        groupTwoApplyTheme(groupTwoSafeTheme);
        groupTwoSaveTheme(groupTwoSafeTheme);
        groupTwoUpdateActiveOption(groupTwoSafeTheme);
    };

    groupTwoThemeButtons.forEach((groupTwoButton) => {
        groupTwoButton.addEventListener("click", () => {
            groupTwoSetTheme(groupTwoButton.dataset.groupTwoThemeOption);
        });
    });

    groupTwoThemeControl.addEventListener("keydown", (event) => {
        const { key, target } = event;
        const groupTwoOptions = [...groupTwoThemeButtons];
        const groupTwoIndex = groupTwoOptions.indexOf(target);
        const groupTwoDelta = groupTwoThemeKeyDelta[key];

        if (groupTwoIndex === -1 || !groupTwoDelta) {
            return;
        }

        event.preventDefault();
        groupTwoOptions[(groupTwoIndex + groupTwoDelta + groupTwoOptions.length) % groupTwoOptions.length]?.focus();
    });

    groupTwoUpdateActiveOption(groupTwoCurrentTheme);

};

const groupTwoWireNavigation = () => {
    document.querySelectorAll("[data-group-two-page-link], [data-group-two-next], [data-group-two-home]").forEach((groupTwoLink) => {
        groupTwoLink.addEventListener("click", (event) => {
            event.preventDefault();
            const groupTwoDirection = groupTwoLink.dataset.groupTwoFlowDirection === "previous" ? -1 : 1;
            groupTwoPageTransition.navigate(groupTwoLink.getAttribute("href"), groupTwoDirection);
        });
    });
};

const groupTwoInitPalindrome = () => {
    const {
        form,
        input,
        string,
        result,
        length,
        message,
    } = groupTwoGetElements("palindrome", ["form", "input", "string", "result", "length", "message"]);

    if (!form) {
        return;
    }

    const groupTwoPalindrome = usePalindrome();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const groupTwoResult = groupTwoPalindrome.check(input.value);
        const groupTwoHasValue = groupTwoResult.length > 0;

        groupTwoSetText([
            [string, groupTwoHasValue ? groupTwoResult.string : "No text"],
            [result, groupTwoHasValue ? (groupTwoResult.palindrome ? "YES" : "NO") : "--"],
            [length, groupTwoResult.length],
        ]);
        groupTwoShowMessage(message, groupTwoHasValue ? "Result updated." : "Enter letters or numbers to check.");
    });
};

const groupTwoInitDivision = () => groupTwoInitSolver({
    groupTwoPrefix: "division",
    groupTwoFields: ["first-number", "second-number", "solution", "dividend", "divisor", "quotient", "remainder"],
    groupTwoUseSolver: useDivision,
    groupTwoSolve: (groupTwoDivision, { firstNumber, secondNumber }) =>
        groupTwoDivision.solve(firstNumber.value, secondNumber.value),
    groupTwoSuccessMessage: "Solution updated.",
    groupTwoErrorText: { solution: "Check the entered values.", dividend: "--", divisor: "--", quotient: "--", remainder: "--" },
    groupTwoSuccessText: { solution: "solution", dividend: "m", divisor: "n", quotient: "quotient", remainder: "remainder" },
});

const groupTwoInitEuclidean = () => groupTwoInitSolver({
    groupTwoPrefix: "euclidean",
    groupTwoFields: ["first-number", "second-number", "steps", "first-result", "second-result", "gcd", "lcm"],
    groupTwoUseSolver: useEuclidean,
    groupTwoSolve: (groupTwoEuclidean, { firstNumber, secondNumber }) =>
        groupTwoEuclidean.solve(firstNumber.value, secondNumber.value),
    groupTwoSuccessMessage: "Solution updated.",
    groupTwoBeforeError: ({ steps }) => {
        steps.replaceChildren(groupTwoCreateListItem("Check the entered values."));
    },
    groupTwoBeforeSuccess: ({ steps }, groupTwoResult) => {
        steps.replaceChildren(...groupTwoResult.steps.map(groupTwoCreateListItem));
    },
    groupTwoErrorText: { firstResult: "--", secondResult: "--", gcd: "--", lcm: "--" },
    groupTwoSuccessText: { firstResult: "m", secondResult: "n", gcd: "gcd", lcm: "lcm" },
});

const groupTwoInitCollatz = () => groupTwoInitSolver({
    groupTwoPrefix: "collatz",
    groupTwoFields: ["number", "sequence", "length", "start", "end"],
    groupTwoUseSolver: useCollats,
    groupTwoSolve: (groupTwoCollatz, { number }) => groupTwoCollatz.generate(number.value),
    groupTwoSuccessMessage: "Sequence generated.",
    groupTwoErrorText: { sequence: "Check the entered value.", length: "--", start: "--", end: "--" },
    groupTwoSuccessText: {
        sequence: "output",
        length: (groupTwoResult) => groupTwoResult.sequence.length,
        start: (groupTwoResult) => groupTwoResult.sequence[0],
        end: (groupTwoResult) => groupTwoResult.sequence.at(-1),
    },
});

const groupTwoInitRecursive = () => {
    const groupTwoRecursiveApp = document.querySelector("#groupTwo-recursive-app");

    if (!groupTwoRecursiveApp) {
        return;
    }

    const groupTwoRecursive = useRecursive();
    const groupTwoTabs = groupTwoRecursiveApp.querySelectorAll("[data-group-two-recursive-tab]");
    const groupTwoPanels = groupTwoRecursiveApp.querySelectorAll("[data-group-two-recursive-panel]");
    const groupTwoResetButtons = groupTwoRecursiveApp.querySelectorAll("[data-group-two-recursive-reset]");
    const groupTwoForms = groupTwoRecursiveApp.querySelectorAll("[data-group-two-recursive-form]");
    const groupTwoTabKeyOffset = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1,
    };

    const groupTwoShowPanel = (groupTwoSequenceId) => {
        groupTwoTabs.forEach((groupTwoTab) => {
            const groupTwoIsActive = groupTwoTab.dataset.groupTwoRecursiveTab === groupTwoSequenceId;
            groupTwoTab.classList.toggle("groupTwo-tabActive", groupTwoIsActive);
            groupTwoTab.setAttribute("aria-selected", String(groupTwoIsActive));
            groupTwoTab.tabIndex = groupTwoIsActive ? 0 : -1;
        });

        groupTwoPanels.forEach((groupTwoPanel) => {
            groupTwoPanel.hidden = groupTwoPanel.dataset.groupTwoRecursivePanel !== groupTwoSequenceId;
        });
    };

    const groupTwoGetSequenceElements = (groupTwoSequenceId) =>
        groupTwoGetElements(groupTwoSequenceId, ["input", "output"], groupTwoRecursiveApp);

    const groupTwoGetNextTabIndex = (groupTwoKey, groupTwoIndex, groupTwoLength) =>
        groupTwoKey === "Home"
            ? 0
            : groupTwoKey === "End"
                ? groupTwoLength - 1
                : groupTwoKey in groupTwoTabKeyOffset
                    ? (groupTwoIndex + groupTwoTabKeyOffset[groupTwoKey] + groupTwoLength) % groupTwoLength
                    : -1;

    const groupTwoResetPanel = (groupTwoSequenceId) => {
        const { input, output } = groupTwoGetSequenceElements(groupTwoSequenceId);

        input.value = "";
        output.textContent = "The result will appear here.";
        output.classList.remove("groupTwo-outputError");
        input.focus();
    };

    groupTwoTabs.forEach((groupTwoTab) => {
        groupTwoTab.addEventListener("click", () => {
            groupTwoShowPanel(groupTwoTab.dataset.groupTwoRecursiveTab);
        });

        groupTwoTab.addEventListener("keydown", (event) => {
            const groupTwoTabList = [...groupTwoTabs];
            const groupTwoIndex = groupTwoTabList.indexOf(event.currentTarget);
            const groupTwoNextIndex = groupTwoGetNextTabIndex(event.key, groupTwoIndex, groupTwoTabList.length);

            if (groupTwoNextIndex < 0) {
                return;
            }

            event.preventDefault();
            const groupTwoNextTab = groupTwoTabList[groupTwoNextIndex];
            groupTwoNextTab.focus();
            groupTwoShowPanel(groupTwoNextTab.dataset.groupTwoRecursiveTab);
        });
    });

    groupTwoResetButtons.forEach((groupTwoButton) => {
        groupTwoButton.addEventListener("click", () => {
            groupTwoResetPanel(groupTwoButton.dataset.groupTwoRecursiveReset);
        });
    });

    groupTwoForms.forEach((groupTwoForm) => {
        groupTwoForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const groupTwoSequenceId = groupTwoForm.dataset.groupTwoRecursiveForm;
            const { input, output } = groupTwoGetSequenceElements(groupTwoSequenceId);
            const groupTwoResult = groupTwoRecursive.compute(groupTwoSequenceId, input.value);
            const groupTwoHasError = Boolean(groupTwoResult.error);

            output.textContent = groupTwoHasError ? groupTwoResult.error : groupTwoResult.output;
            output.classList.toggle("groupTwo-outputError", groupTwoHasError);
        });
    });

    groupTwoShowPanel("fib");
};

const groupTwoInitApp = async () => {
    await groupTwoLoadNavbar();
    groupTwoInitTheme();
    groupTwoWireNavigation();
    groupTwoInitPalindrome();
    groupTwoInitDivision();
    groupTwoInitEuclidean();
    groupTwoInitCollatz();
    groupTwoInitRecursive();
};

groupTwoInitApp();
