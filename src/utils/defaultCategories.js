export const defaultCategories = [
    {
        categoryName: "CategoryName1",
        color: "blue",
        badgeClass: "badge-primary",
    },
    {
        categoryName: "CategoryName2",
        color: "red",
        badgeClass: "badge-success",
    },
    {
        categoryName: "CategoryName3",
        color: "yellow",
        badgeClass: "badge-warning",
    },
    // Leidos: "badge-danger",
    // Recibidos: "badge-info",
    // default: "badge-secondary",
];

export const getDefaultCategoriesConfiguration = () => {
    const defaultCategoriesConfig = {};
    defaultCategories.forEach((c) => {
        defaultCategoriesConfig[c.categoryName] = {
            autoTrigger: false,
            triggerOption: {},
            redirectTo: [],
            autoResponse: false,
            autoRedirect: false,
            autoRetargeting: false,
            retargetingOption: {},
            retargetingTime: "",
            autoQuote: false,
            quoteOption: {},
        };
    });
    return defaultCategoriesConfig;
};

export const defaultCategiesConfiguration = {
    CategoryName2: {
        autoTrigger: false,
        triggerOption: {},
        redirectTo: [],
        autoResponse: false,
        autoRedirect: false,
        autoRetargeting: false,
        retargetingOption: {},
        retargetingTime: "",
        autoQuote: false,
        quoteOption: {},
    },
    CategoryName1: {
        autoTrigger: false,
        triggerOption: {},
        redirectTo: [],
        autoResponse: false,
        autoRedirect: false,
        autoRetargeting: false,
        retargetingOption: {},
        retargetingTime: "",
        autoQuote: false,
        quoteOption: {},
    },
    CategoryName3: {
        autoTrigger: false,
        triggerOption: {},
        redirectTo: [],
        autoResponse: false,
        autoRedirect: false,
        autoRetargeting: false,
        retargetingOption: {},
        retargetingTime: "",
        autoQuote: false,
        quoteOption: {},
    },
};
