import {
    createGroup,
    deleteGroup,
    updateCommunication,
    updateContact,
    updateGroup,
} from "../../graphql/mutations";
import {
    fetchCommunications,
    fetchContacts,
    getDefaultCategoriesConfiguration,
    hideLoader,
    showLoader,
} from "../../utils";

import { client } from "../../utils/amplifyConfig";
export const openEditGroupModal = async ({ allGroups, clientId }) => {
    const editGroupsBtn = document.querySelector(".edit_groups");
    const modalTittle = document.createElement("div");
    modalTittle.className = "div-tittle-modal";
    modalTittle.textContent = "Custom Group List";
    const groupForm = document.createElement("form");
    groupForm.className = "div-form-modal";
    let newGroups = [];
    let oldGroups = [];
    let deletedGroups = [];
    const addGroupBtn = document.createElement("button");
    const icon = document.createElement("i");

    addGroupBtn.id = "addGroup";
    addGroupBtn.className = "btn btn-success btn-block";
    icon.classList.add("fas", "fa-plus");
    addGroupBtn.appendChild(icon);

    const saveBtn = document.createElement("button");
    saveBtn.id = "saveBtn";
    saveBtn.className = "btn btn-primary btn-block";
    saveBtn.textContent = "Save";
    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelCategory";
    cancelBtn.className = "btn btn-secondary btn-block";
    cancelBtn.textContent = "Cancel";
    editGroupsBtn.addEventListener("click", function() {
        $("#myModal").modal("show");
    });

    let count = 1;
    addGroupBtn.addEventListener("click", function() {
        const newGroup = document.createElement("div");
        newGroup.className = "form-group row justify-content-between";
        newGroup.dataset.key = count;

        const colorPickerWrapper = document.createElement("div");
        colorPickerWrapper.className = "col-2 mt-1";
        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.className = "form-control";
        colorPicker.id = `color-${count}`;
        colorPickerWrapper.appendChild(colorPicker);

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "col-8";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control text-center";
        input.id = `group-${count}`;
        inputWrapper.appendChild(input);

        const deleteBtnWrapper = document.createElement("div");
        deleteBtnWrapper.className = "col-1";
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn";
        deleteBtn.innerHTML =
            '<i class="fa fa-trash" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
        deleteBtn.addEventListener("click", function() {
            groupForm.removeChild(newGroup);
            newGroups = newGroups.filter((e) => e.id !== newGroup.dataset.key);
        });
        deleteBtnWrapper.appendChild(deleteBtn);
        newGroup.appendChild(inputWrapper);
        newGroup.appendChild(colorPickerWrapper);
        newGroup.appendChild(deleteBtnWrapper);
        newGroups.push({ id: count });
        groupForm.appendChild(newGroup);
        input.focus();
        count += 1;
    });

    saveBtn.addEventListener("click", async function(event) {
        event.preventDefault();
        try {
            showLoader();
            let elementRepeted = [];
            const allContacts = await fetchContacts({ clientId });

            async function handleNewGroups() {
                for (let i = 0; i < newGroups.length; i++) {
                    const c = newGroups[i];
                    const element = document.getElementById(`group-${c.id}`);
                    const elementColor = document.getElementById(
                        `color-${c.id}`
                    );

                    const isRepeated = oldGroups.some((group) => {
                        const groupElement = document.getElementById(
                            `group-${group.id}`
                        );
                        return groupElement?.value === element.value;
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
                                        getDefaultCategoriesConfiguration()
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

                    if (!element || element.value === group.groupName) continue;

                    const allContactsByGroupId = allContacts.filter(
                        (c) => c.groupId === group.id
                    );

                    if (allContactsByGroupId.length > 0) {
                        const agree = confirm(
                            `Hay Contacts que pertenecen a "${group.groupName}", se cambiarán a "${element.value}". ¿Desea continuar?`
                        );

                        if (agree) {
                            const allCommsByGroupId = await fetchCommunications(
                                {
                                    clientId,
                                    filters: { groupId: group.id },
                                }
                            );

                            await Promise.all(
                                allContactsByGroupId.map(async (item) => {
                                    await client.graphql({
                                        query: updateContact,
                                        variables: {
                                            input: {
                                                clientId,
                                                id: item.id,
                                                groupId: group.id,
                                            },
                                        },
                                    });
                                })
                            );
                            await Promise.all(
                                allCommsByGroupId.map(async (item) => {
                                    await client.graphql({
                                        query: updateCommunication,
                                        variables: {
                                            input: {
                                                clientId,
                                                id: item.id,
                                                groupId: group.id,
                                            },
                                        },
                                    });
                                })
                            );
                        } else {
                            return;
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
                            `Hay Contactos que pertenecen a "${group.groupName}", todas seran reagrupados a "Ungroup". ¿Desea continuar?`
                        );

                        if (agree) {
                            const allCommsByGroupId = await fetchCommunications(
                                {
                                    clientId,
                                    filters: { groupId: group.id },
                                }
                            );
                            console.log(allCommsByGroupId);
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
                            await Promise.all(
                                allCommsByGroupId.map(async (item) => {
                                    await client.graphql({
                                        query: updateCommunication,
                                        variables: {
                                            input: {
                                                clientId,
                                                id: item.id,
                                                groupId: allGroups.find(
                                                    (g) =>
                                                        g.groupName ===
                                                        "Ungroup"
                                                ).id,
                                                status: "Processing",
                                            },
                                        },
                                    });
                                })
                            );
                        } else {
                            return;
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
                    repeatedNames.length > 1
                        ? `Ya existen un grupo con el nombre: ${repeatedNames}`
                        : `Ya existen grupos con los nombres: ${repeatedNames}`
                );
            } else {
                await handleOldGroups();
                await handleDeletedGroups();
            }

            location.reload();
        } catch (error) {
            console.error(error);
            alert(
                "Ocurrió un error durante el guardado. Por favor, intenta nuevamente."
            );
        } finally {
            hideLoader();
        }
    });

    cancelBtn.addEventListener("click", function(event) {
        event.preventDefault();
        $("#myModal").modal("hide");
    });

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body modal-body-height loading-blur";
    modalBody.appendChild(modalTittle);
    modalBody.appendChild(groupForm);

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "div-buttons-modal justify-content-between";
    const addBtnWrapper = document.createElement("div");
    addBtnWrapper.className = "col-md-3";
    addBtnWrapper.appendChild(addGroupBtn);
    const spaceBtnWrapper = document.createElement("div");
    spaceBtnWrapper.className = "col-md-3";
    const saveBtnWrapper = document.createElement("div");
    saveBtnWrapper.className = "col-md-3";
    saveBtnWrapper.appendChild(saveBtn);
    const cancelBtnWrapper = document.createElement("div");
    cancelBtnWrapper.className = "col-md-3";
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
            newGroup.className = "form-group row justify-content-between";
            newGroup.dataset.key = group.id;

            const colorPickerWrapper = document.createElement("div");
            colorPickerWrapper.className = "col-2 mt-1";
            const colorPicker = document.createElement("input");
            colorPicker.type = "color";
            colorPicker.className = "form-control";
            colorPicker.id = `color-${group.id}`;
            colorPicker.value = group.color;
            colorPickerWrapper.appendChild(colorPicker);

            const inputWrapper = document.createElement("div");
            inputWrapper.className = "col-8";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control text-center";
            input.id = `group-${group.id}`;
            input.value = group.groupName;
            inputWrapper.appendChild(input);

            const deleteBtnWrapper = document.createElement("div");
            deleteBtnWrapper.className = "col-1";
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn";
            deleteBtn.innerHTML =
                '<i class="fa fa-trash" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
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
};
