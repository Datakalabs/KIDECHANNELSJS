export {
    fetchGroups,
    fetchCommunications,
    fetchPreQuoteOptions,
    fetchTriggerOptions,
    fetchRetargetingOptions,
    fetchContacts,
    fetchTags,
    getSync,
} from "./fetchFunctions";
export {
    getDefaultCategoriesConfiguration,
    defaultCategories,
} from "./defaultCategories";
export {
    createBadge,
    createButtonContainer,
    createDiv,
    updateDataTable,
} from "./tableFunctions";
export {
    createTag,
    deleteTag,
    executeResponse,
    modifyTag,
} from "./postFunctions";
export { client } from "./amplifyConfig";
export { getColorObj } from "./groupsUtils";
export { awsDateTimeFormat, normalizeDate } from "./normalizeDateTime";

export function showLoader() {
    document
        .querySelectorAll(".loading-blur")
        .forEach((e) => e.classList.add("blur"));
    document
        .querySelectorAll(".loader")
        .forEach((e) => (e.style.display = "block"));
}

export function hideLoader() {
    document
        .querySelectorAll(".loading-blur")
        .forEach((e) => e.classList.remove("blur"));
    document
        .querySelectorAll(".loader")
        .forEach((e) => (e.style.display = "none"));
}
