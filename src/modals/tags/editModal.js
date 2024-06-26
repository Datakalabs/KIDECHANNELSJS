import {
    createTag,
    deleteTag,
    updateCommunication,
    updateTag,
} from "../../graphql/mutations";
import { fetchCommunications } from "../../utils";
import { client } from "../../utils/amplifyConfig";

export const openEditTagModal = async ({ allTags, clientId }) => {
    const tagForm = document.createElement("form");
    let newTags = [];
    let oldTags = [];
    let deletedTags = [];
    const addTagBtn = document.createElement("button");
    const icon = document.createElement("i");

    addTagBtn.id = "addTag";
    addTagBtn.className = "btn btn-success";
    addTagBtn.textContent = "Agregar ";
    addTagBtn.appendChild(icon);
    icon.classList.add("fas", "fa-plus");

    const saveBtn = document.createElement("button");
    saveBtn.id = "saveBtn";
    saveBtn.className = "btn btn-primary";
    saveBtn.textContent = "Guardar";

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelCategory";
    cancelBtn.className = "btn btn-secondary";
    cancelBtn.textContent = "Cancelar";
    $("#myModal").modal("show");

    let count = 1;
    addTagBtn.addEventListener("click", function(event) {
        event.preventDefault();
        const newTag = document.createElement("div");
        newTag.className = "form-tag row";
        newTag.dataset.key = count;

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "col-10";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.id = `tag-${count}`;
        inputWrapper.appendChild(input);

        const deleteBtnWrapper = document.createElement("div");
        deleteBtnWrapper.className = "col-2";
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn";
        deleteBtn.innerHTML =
            '<i class="fa fa-times" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
        deleteBtn.addEventListener("click", function() {
            tagForm.removeChild(newTag);
            newTags = newTags.filter((e) => e.id !== newTag.dataset.key);
        });
        deleteBtnWrapper.appendChild(deleteBtn);
        newTag.appendChild(inputWrapper);
        newTag.appendChild(deleteBtnWrapper);
        newTags.push({ id: count });
        tagForm.appendChild(newTag);
        input.focus();
        count += 1;
    });

    saveBtn.addEventListener("click", async function(event) {
        event.preventDefault();
        try {
            let elementRepeted = [];

            async function handleNewTags() {
                for (let i = 0; i < newTags.length; i++) {
                    const t = newTags[i];
                    const element = document.getElementById(`tag-${t.id}`);

                    const isRepeated = oldTags.some((tag) => {
                        const tagElement = document.getElementById(
                            `tag-${tag.id}`
                        );
                        return tagElement?.value === element.value;
                    });

                    if (isRepeated) {
                        elementRepeted.push(element);
                    } else {
                        await client.graphql({
                            query: createTag,
                            variables: {
                                input: {
                                    clientId,
                                    tagName: element.value,
                                },
                            },
                        });
                    }
                }
            }

            async function handleOldTags() {
                for (let i = 0; i < oldTags.length; i++) {
                    const tag = oldTags[i];
                    const element = document.getElementById(`tag-${tag.id}`);

                    if (!element || element.value === tag.tagName) continue;

                    const allCommsByTagId = await fetchCommunications({
                        clientId,
                        filters: { tagId: tag.id },
                    });

                    if (allCommsByTagId.length > 0) {
                        const agree = confirm(
                            `Hay Comunicaciones que pertenecen a "${tag.tagName}", se cambiarán a "${element.value}". ¿Desea continuar?`
                        );

                        if (agree) {
                            await Promise.all(
                                allCommsByTagId.map(async (item) => {
                                    await client.graphql({
                                        query: updateCommunication,
                                        variables: {
                                            input: {
                                                clientId,
                                                id: item.id,
                                                tagId: tag.id,
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
                        query: updateTag,
                        variables: {
                            input: {
                                clientId,
                                id: tag.id,
                                tagName: element.value,
                            },
                        },
                    });
                }
            }

            async function handleDeletedTags() {
                for (let i = 0; i < deletedTags.length; i++) {
                    const tag = deletedTags[i];
                    const allCommsByTagId = await fetchCommunications({
                        clientId,
                        filters: { tagId: tag.id },
                    });

                    if (allCommsByTagId.length > 0) {
                        const agree = confirm(
                            `Hay Comunicaciones que pertenecen a "${tag.tagName}". Se eliminarán las etiquetas de esas comunicaciones. ¿Desea continuar?`
                        );

                        if (agree) {
                            await Promise.all(
                                allCommsByTagId.map(async (item) => {
                                    await client.graphql({
                                        query: updateCommunication,
                                        variables: {
                                            input: {
                                                clientId,
                                                id: item.id,
                                                tagId: "",
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
                        query: deleteTag,
                        variables: {
                            input: { clientId, id: tag.id },
                        },
                    });
                }
            }

            await handleNewTags();

            if (elementRepeted.length > 0) {
                const repeatedNames = elementRepeted
                    .map((el) => el.value)
                    .join(", ");
                alert(
                    repeatedNames.length > 1
                        ? `Ya existen un Tag con el nombre: ${repeatedNames}`
                        : `Ya existen Tags con los nombres: ${repeatedNames}`
                );
            } else {
                await handleOldTags();
                await handleDeletedTags();
            }

            location.reload();
        } catch (error) {
            console.error(error);
            alert(
                "Ocurrió un error durante el guardado. Por favor, intenta nuevamente."
            );
        }
    });

    cancelBtn.addEventListener("click", function(event) {
        event.preventDefault();
        $("#myModal").modal("hide");
    });

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body m-t-20 m-b-10 m-l-40 p-l-40";
    modalBody.appendChild(tagForm);

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "row justify-content-center";
    const addBtnWrapper = document.createElement("div");
    addBtnWrapper.className = "col-3";
    addBtnWrapper.appendChild(addTagBtn);
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
    modalContent.style.zIndex = "1051";
    modalContent.appendChild(modalBody);

    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog modal-lg";
    modalDialog.appendChild(modalContent);
    modalDialog.style = "max-width: 800px;";

    const modalWrapper = document.createElement("div");
    modalWrapper.className = "modal fade mx-auto";
    modalWrapper.id = "myModal";
    modalWrapper.tabIndex = "-1";
    modalWrapper.role = "dialog";
    modalWrapper.ariaHidden = "true";
    modalWrapper.style.zIndex = "1050";
    modalWrapper.appendChild(modalDialog);

    document.body.appendChild(modalWrapper);
    $(modalWrapper).modal("show");

    allTags.forEach((tag) => {
        const tagDiv = document.createElement("div");
        tagDiv.className = "form-tag row";
        tagDiv.dataset.key = tag.id;

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "col-10";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.value = tag.tagName;
        input.id = `tag-${tag.id}`;
        inputWrapper.appendChild(input);

        const deleteBtnWrapper = document.createElement("div");
        deleteBtnWrapper.className = "col-2";
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn";
        deleteBtn.innerHTML =
            '<i class="fa fa-times" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
        deleteBtn.addEventListener("click", function() {
            tagForm.removeChild(tagDiv);
            deletedTags.push(tag);
        });
        deleteBtnWrapper.appendChild(deleteBtn);

        tagDiv.appendChild(inputWrapper);
        tagDiv.appendChild(deleteBtnWrapper);
        oldTags.push({ id: tag.id, tagName: tag.tagName });
        tagForm.appendChild(tagDiv);
    });

    $(modalWrapper).on("hidden.bs.modal", function() {
        modalWrapper.remove();
    });
};
