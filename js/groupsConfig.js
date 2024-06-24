// import {
//     updateCommunication,
// } from "../src/graphql/mutations.js";
// import {

//     listCommunications,
//     listPreQuoteOptions,
//     listRetargetingOptions,
//     listTriggerOptions,
// } from "../src/graphql/queries.js";
import {
    createGroup,
    deleteGroup,
    updateContact,
    updateGroup,
} from "../src/graphql/mutations.js";
import { listPreQuoteOptions } from "../src/graphql/queries.js";
import { client } from "../src/utils/amplifyConfig.js";
import {
    defaultCategories,
    defaultCategiesConfiguration,
} from "../src/utils/defaultCategories.js";
import {
    fetchContact,
    fetchGroups,
    fetchPreQuoteOptions,
    fetchRetargetingOptions,
    fetchTriggerOptions,
} from "../src/utils/fetchFunctions.js";
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

        allGroups = await fetchGroups(clientId);
        allGroups.forEach((g) => {
            const option = document.createElement("option");
            option.value = g.groupName;
            option.innerHTML = g.groupName;
            selectGruop.appendChild(option);
        });

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
        const editGroupsBtn = document.querySelector(".edit_groups");
        const groupForm = document.createElement("form");
        let newGroups = [];
        let oldGroups = [];
        let deletedGroups = [];
        const addGroupBtn = document.createElement("button");
        const icon = document.createElement("i");

        addGroupBtn.id = "addGroup";
        addGroupBtn.className = "btn btn-success";
        addGroupBtn.textContent = "Agregar ";
        addGroupBtn.appendChild(icon);
        icon.classList.add("fas", "fa-plus");

        const saveBtn = document.createElement("button");
        saveBtn.id = "saveBtn";
        saveBtn.className = "btn btn-primary";
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancelCategory";
        cancelBtn.className = "btn btn-secondary";
        cancelBtn.textContent = "Cancel";

        editGroupsBtn.addEventListener("click", function() {
            $("#myModal").modal("show");
        });

        let count = 1;
        addGroupBtn.addEventListener("click", function() {
            const newGroup = document.createElement("div");
            newGroup.className = "form-group row";
            newGroup.dataset.key = count; // Use data attribute for the key

            // Color Picker Wrapper
            const colorPickerWrapper = document.createElement("div");
            colorPickerWrapper.className = "col-2";
            const colorPicker = document.createElement("input");
            colorPicker.type = "color";
            colorPicker.className = "form-control";
            colorPicker.id = `color-${count}`;
            colorPickerWrapper.appendChild(colorPicker);

            const inputWrapper = document.createElement("div");
            inputWrapper.className = "col-7";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            input.id = `group-${count}`; // Adjust the ID to include 'group-'
            inputWrapper.appendChild(input);

            const deleteBtnWrapper = document.createElement("div");
            deleteBtnWrapper.className = "col-2";
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn";
            deleteBtn.innerHTML =
                '<i class="fa fa-times" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
            deleteBtn.addEventListener("click", function() {
                groupForm.removeChild(newGroup);
                newGroups = newGroups.filter(
                    (e) => e.id !== newGroup.dataset.key
                );
            });
            deleteBtnWrapper.appendChild(deleteBtn);
            newGroup.appendChild(inputWrapper);
            newGroup.appendChild(colorPickerWrapper);
            newGroup.appendChild(deleteBtnWrapper);
            newGroups.push({ id: count });
            groupForm.appendChild(newGroup);
            count += 1;
        });

        saveBtn.addEventListener("click", async function() {
            try {
                let elementRepeted = [];
                const allContacts = await fetchContact({ clientId });

                async function handleNewGroups() {
                    for (let i = 0; i < newGroups.length; i++) {
                        const c = newGroups[i];
                        const element = document.getElementById(
                            `group-${c.id}`
                        );
                        const elementColor = document.getElementById(
                            `color-${c.id}`
                        );

                        const isRepeated = oldGroups.some((group) => {
                            const groupElement = document.getElementById(
                                `group-${group.id}`
                            );
                            return groupElement.value === element.value;
                        });

                        if (isRepeated) {
                            elementRepeted.push(element);
                        } else {
                            await client.graphql({
                                query: createGroup,
                                variables: {
                                    input: {
                                        clientId,
                                        groupName: element.value,
                                        categoriesConfig: JSON.stringify(
                                            defaultCategiesConfiguration
                                        ),
                                        color: elementColor.value,
                                    },
                                },
                            });
                        }
                    }
                }

                async function handleOldGroups() {
                    for (let i = 0; i < oldGroups.length; i++) {
                        const group = oldGroups[i];
                        const element = document.getElementById(
                            `group-${group.id}`
                        );
                        const elementColor = document.getElementById(
                            `color-${group.id}`
                        );

                        const allContactsByGroupId = allContacts.filter(
                            (c) => c.groupId === group.id
                        );

                        if (allContactsByGroupId.length > 0) {
                            const agree = confirm(
                                `Hay Contacts que pertenecen a "${group.groupName}", todas seran reagrupados a "${element.value}". Desea continuar?`
                            );

                            if (agree) {
                                await Promise.all(
                                    allContactsByGroupId.map(async (item) => {
                                        await client.graphql({
                                            query: updateContact,
                                            variables: {
                                                input: {
                                                    clientId,
                                                    id: item.id,
                                                    groupId: element.value,
                                                },
                                            },
                                        });
                                    })
                                );
                            }
                        }

                        await client.graphql({
                            query: updateGroup,
                            variables: {
                                input: {
                                    clientId,
                                    id: group.id,
                                    groupName: element.value,
                                    color: elementColor.value,
                                },
                            },
                        });
                    }
                }

                async function handleDeletedGroups() {
                    for (let i = 0; i < deletedGroups.length; i++) {
                        const group = deletedGroups[i];

                        const allContactsByGroupId = allContacts.filter(
                            (c) => c.groupId === group.id
                        );

                        if (allContactsByGroupId.length > 0) {
                            const agree = confirm(
                                `Hay Contactos que pertenecen a "${group.groupName}", todas seran reagrupados a "Ungroup". Desea continuar?`
                            );

                            if (agree) {
                                await Promise.all(
                                    allContactsByGroupId.map(async (item) => {
                                        await client.graphql({
                                            query: updateContact,
                                            variables: {
                                                input: {
                                                    clientId,
                                                    id: item.id,
                                                    groupId: allGroups.find(
                                                        (g) =>
                                                            g.groupName ===
                                                            "Ungroup"
                                                    ).id,
                                                },
                                            },
                                        });
                                    })
                                );
                            }
                        }

                        await client.graphql({
                            query: deleteGroup,
                            variables: {
                                input: { clientId, id: group.id },
                            },
                        });
                    }
                }

                await handleNewGroups();

                if (elementRepeted.length > 0) {
                    const repeatedNames = elementRepeted
                        .map((el) => el.value)
                        .join(", ");
                    alert(
                        `Ya existen categorias con los nombres: ${repeatedNames}`
                    );
                }

                await handleOldGroups();
                await handleDeletedGroups();

                location.reload();
            } catch (error) {
                console.error(error);
                alert(
                    "Ocurrió un error durante el guardado. Por favor, intenta nuevamente."
                );
            }
        });

        cancelBtn.addEventListener("click", function() {
            $("#myModal").modal("hide");
        });

        const modalBody = document.createElement("div");
        modalBody.className = "modal-body m-t-20 m-b-10 m-l-40 p-l-40";
        modalBody.appendChild(groupForm);

        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.className = "row justify-content-center";
        const addBtnWrapper = document.createElement("div");
        addBtnWrapper.className = "col-3";
        addBtnWrapper.appendChild(addGroupBtn);
        const saveBtnWrapper = document.createElement("div");
        saveBtnWrapper.className = "col-3";
        saveBtnWrapper.appendChild(saveBtn);
        const cancelBtnWrapper = document.createElement("div");
        cancelBtnWrapper.className = "col-3";
        cancelBtnWrapper.appendChild(cancelBtn);
        buttonsWrapper.appendChild(cancelBtnWrapper);
        buttonsWrapper.appendChild(addBtnWrapper);
        buttonsWrapper.appendChild(saveBtnWrapper);
        modalBody.appendChild(buttonsWrapper);

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.appendChild(modalBody);

        const modalDialog = document.createElement("div");
        modalDialog.className = "modal-dialog";
        modalDialog.role = "document";
        modalDialog.appendChild(modalContent);
        modalDialog.style = "max-width: 800px;";

        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "myModal";
        modal.tabIndex = -1;
        modal.role = "dialog";
        modal.setAttribute("aria-labelledby", "myModalLabel");
        modal.setAttribute("aria-hidden", "true");
        modal.appendChild(modalDialog);

        document.body.appendChild(modal);

        allGroups.forEach(function(group) {
            if (group.groupName !== "Ungroup") {
                const newGroup = document.createElement("div");
                newGroup.className = "form-group row";
                newGroup.dataset.key = group.id; // Use data attribute for the key

                const colorPickerWrapper = document.createElement("div");
                colorPickerWrapper.className = "col-2";
                const colorPicker = document.createElement("input");
                colorPicker.type = "color";
                colorPicker.className = "form-control";
                colorPicker.id = `color-${group.id}`;
                colorPicker.value = group.color;
                colorPickerWrapper.appendChild(colorPicker);

                const inputWrapper = document.createElement("div");
                inputWrapper.className = "col-7";
                const input = document.createElement("input");
                input.type = "text";
                input.className = "form-control";
                input.id = `group-${group.id}`; // Adjust the ID to include 'group-'
                input.value = group.groupName;
                inputWrapper.appendChild(input);

                const deleteBtnWrapper = document.createElement("div");
                deleteBtnWrapper.className = "col-2";
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn";
                deleteBtn.innerHTML =
                    '<i class="fa fa-times" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
                deleteBtn.addEventListener("click", function() {
                    groupForm.removeChild(newGroup);
                    deletedGroups.push({
                        groupName: group.groupName,
                        id: newGroup.dataset.key,
                    });
                    oldGroups = oldGroups.filter(
                        (e) => e.id !== newGroup.dataset.key
                    );
                });
                deleteBtnWrapper.appendChild(deleteBtn);
                newGroup.appendChild(inputWrapper);
                newGroup.appendChild(colorPickerWrapper);
                newGroup.appendChild(deleteBtnWrapper);
                groupForm.appendChild(newGroup);
                oldGroups.push({
                    id: group.id,
                    groupName: group.groupName,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
