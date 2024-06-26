import { updateGroup } from "../src/graphql/mutations.js";
import { openEditGroupModal } from "../src/modals/groups/editModal.js";
import { client } from "../src/utils/amplifyConfig.js";
import {
    defaultCategories,
    defaultCategiesConfiguration,
} from "../src/utils/defaultCategories.js";
import {
    fetchGroups,
    fetchPreQuoteOptions,
    fetchRetargetingOptions,
    fetchTriggerOptions,
} from "../src/utils/fetchFunctions.js";
import { renderGroupListInSidebar } from "../src/utils/groupsUtils.js";
import { getUserInfo } from "./authentication.js";

const userInfo = await getUserInfo();
let clientId = userInfo.userData.userId;

(async function($) {
    // USE STRICT
    "use strict";
    try {
        const quoteSelect = document.getElementById("quoteOption");
        const triggerSelect = document.getElementById("triggerOption");
        const retargetingSelect = document.getElementById("retargetingOption");
        var selectCategory = document.getElementById("selectOptionCategory"),
            selectGruop = document.getElementById("selectOptionGroup");
        let categorySelected, groupSelected, categorySelectedConfig;
        let allGroups;

        defaultCategories.forEach((c) => {
            const option = document.createElement("option");
            option.value = c.categoryName;
            option.innerHTML = c.categoryName;
            selectCategory.appendChild(option);
        });

        allGroups = await fetchGroups({ clientId });

        allGroups.forEach((g) => {
            const option = document.createElement("option");
            option.value = g.groupName;
            option.innerHTML = g.groupName;
            selectGruop.appendChild(option);
        });
        //Funcion para renderizar groups en sidebar
        renderGroupListInSidebar({ allGroups });

        selectGruop.addEventListener("change", async (e) => {
            if (e.target.value !== "Selecciona") {
                groupSelected = allGroups.find(
                    (g) => g.groupName === e.target.value
                );
                selectCategory.disabled = false;

                if (categorySelected) {
                    updateCategoryConfig(e);
                }
            }
        });
        selectCategory.addEventListener("change", async (e) => {
            if (e.target.value !== "Selecciona") {
                categorySelected = defaultCategories.find(
                    (c) => c.categoryName === e.target.value
                );
                updateCategoryConfig(e);
            }
        });
        function updateCategoryConfig(e) {
            categorySelectedConfig = JSON.parse(groupSelected.categoriesConfig)[
                categorySelected.categoryName
            ];
            for (const key in categorySelectedConfig) {
                let value = categorySelectedConfig[key];
                const element = document.getElementById(key);
                if (element && key !== "__typename") {
                    switch (element.type) {
                        case "checkbox":
                            element.checked = value;
                            var $checkbox = $(this).find(`id = ${key}`);
                            $checkbox.bootstrapToggle("toggle");
                            e.preventDefault();
                            // $(key).bootstrapToggle();
                            // $(key).bootstrapToggle("on");
                            break;
                        case "select-one":
                            element.value = value?.optionId
                                ? value.optionId
                                : "";
                            break;
                        default:
                            element.value = value?.value ? value.value : value;
                            break;
                    }
                }
            }
        }
        let preQuoteOptions = await fetchPreQuoteOptions({ clientId });

        let triggerOption = await fetchTriggerOptions({ clientId });

        let retargetingOption = await fetchRetargetingOptions({ clientId });

        preQuoteOptions.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.id;
            option.innerHTML = e.optionName;
            quoteSelect.appendChild(option);
        });

        retargetingOption.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.id;
            option.innerHTML = e.optionName;
            retargetingSelect.appendChild(option);
        });

        triggerOption.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.id;
            option.innerHTML = e.optionName;
            triggerSelect.appendChild(option);
        });

        const saveButton = document.getElementById("saveChange");
        const resetButton = document.getElementById("resetDefault");
        const updateAllGroups = () => {
            const indexOfGroupSelected = allGroups.findIndex(
                (g) => g === groupSelected
            );
            allGroups = [
                ...allGroups.slice(0, indexOfGroupSelected),
                groupSelected,
                ...allGroups.slice(indexOfGroupSelected + 1),
            ];
        };
        saveButton.addEventListener("click", async (e) => {
            if (categorySelected) {
                e.preventDefault();
                let params = {};
                for (const key in categorySelectedConfig) {
                    let elem = document.getElementById(key);
                    switch (elem.type) {
                        case "checkbox":
                            params[key] = elem.checked;
                            break;
                        case "select-one":
                            params[key] = elem.value
                                ? { optionId: elem.value }
                                : {};
                            break;
                        default:
                            params[key] =
                                key === "redirectTo"
                                    ? elem.value === ""
                                        ? []
                                        : elem.value.split(",").map((e) => e)
                                    : elem.value;
                    }
                }
                groupSelected.categoriesConfig = JSON.stringify({
                    ...JSON.parse(groupSelected.categoriesConfig),
                    [categorySelected.categoryName]: params,
                });
                console.log(groupSelected);
                await client.graphql({
                    query: updateGroup,
                    variables: {
                        input: groupSelected,
                    },
                });
                window.alert("Se guardo la configuracion");
                updateAllGroups();
                return;
            } else {
                window.alert("Selecciona una categoria");
            }
        });
        resetButton.addEventListener("click", async (e) => {
            if (categorySelected) {
                const auth = prompt(
                    "Estas seguro de volver a los valores por defecto?"
                );

                if (auth === "si") {
                    groupSelected.categoriesConfig = JSON.stringify({
                        ...JSON.parse(groupSelected.categoriesConfig),
                        [categorySelected.categoryName]:
                            defaultCategiesConfiguration[
                                categorySelected.categoryName
                            ],
                    });
                    await client.graphql({
                        query: updateGroup,
                        variables: {
                            input: groupSelected,
                        },
                    });
                    const params =
                        defaultCategiesConfiguration[
                            categorySelected.categoryName
                        ];
                    for (const key in params) {
                        let elem = document.getElementById(key);
                        switch (elem.type) {
                            case "checkbox":
                                elem.checked = params[key];
                                break;
                            case "select-one":
                                elem.value = params[key]?.optionId
                                    ? params[key].optionId
                                    : "";
                                break;
                            default:
                                elem.value = "";
                        }
                    }
                    updateAllGroups();
                    return;
                }
            } else {
                window.alert("Selecciona una categoria");
            }
        });
        openEditGroupModal({ allGroups, clientId });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
