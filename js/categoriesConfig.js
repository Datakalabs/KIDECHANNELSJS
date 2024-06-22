// import {
//     updateCommunication,
// } from "../src/graphql/mutations.js";
// import {
//     getCategories,
//     getDefaultCategories,
//     listCategories,
//     listCommunications,
//     listDefaultCategories,
//     listPreQuoteOptions,
//     listRetargetingOptions,
//     listTriggerOptions,
// } from "../src/graphql/queries.js";
import { client } from "../src/utils/amplifyConfig.js";
import { getUserInfo } from "./authentication.js";

const userInfo = await getUserInfo();
let clientId = userInfo.sub;

(async function($) {
    // USE STRICT
    "use strict";
    try {
        var select = document.getElementById("selectOptionCategory"),
            divCategory = document.getElementById("divCategory");

        let categories,
            defaultCategories = await client.graphql({
                query: listDefaultCategories,
                variables: { clientId },
            }),
            customCategories = await client.graphql({
                query: listCategories,
                variables: { clientId },
            });

        categories = [
            ...defaultCategories.data.listDefaultCategories.items,
            ...customCategories.data.listCategories.items,
        ];
        categories.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.categoryName;
            option.innerHTML = e.categoryName;
            select.appendChild(option);
        });

        let categorySelectId,
            categorySelectName,
            isDefault = true;
        const quoteSelect = document.getElementById("quoteOption");
        const triggerSelect = document.getElementById("triggerOption");
        const retargetingSelect = document.getElementById("retargetingOption");
        select.addEventListener("change", async (e) => {
            if (e.target.value !== "Selecciona") {
                const categ = categories.find(
                    (c) => c.categoryName === e.target.value
                );

                categorySelectId = categ.id;
                categorySelectName = categ.categoryName;
                let { data } = await client.graphql({
                    query: getDefaultCategories,
                    variables: {
                        clientId,
                        id: categ.id,
                    },
                });
                !data.getDefaultCategories
                    ? ({ data } = await client.graphql({
                          query: getCategories,
                          variables: {
                              clientId,
                              id: categ.id,
                          },
                      })) && (isDefault = false)
                    : (isDefault = true);
                const config = data?.getDefaultCategories
                    ? data?.getDefaultCategories.configuration
                    : data?.getCategories.configuration;

                for (const key in config) {
                    let value = config[key];
                    const element = document.getElementById(key);
                    if (element && key !== "__typename") {
                        let valueParsed;
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
                                valueParsed = JSON.parse(value);
                                element.value = valueParsed?.optionId
                                    ? valueParsed.optionId
                                    : "";
                                break;
                            default:
                                valueParsed = value ? JSON.parse(value) : {};
                                element.value = valueParsed?.value
                                    ? valueParsed.value
                                    : value === "{}"
                                    ? ""
                                    : value;
                                break;
                        }
                    }
                }
            }
        });
        let preQuoteOptions = await client.graphql({
            query: listPreQuoteOptions,
            variables: { clientId },
        });

        let triggerOption = await client.graphql({
            query: listTriggerOptions,
            variables: { clientId },
        });

        let retargetingOption = await client.graphql({
            query: listRetargetingOptions,
            variables: { clientId },
        });

        preQuoteOptions.data.listPreQuoteOptions.items.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.id;
            option.innerHTML = e.optionName;
            quoteSelect.appendChild(option);
        });

        retargetingOption.data.listRetargetingOptions.items.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.id;
            option.innerHTML = e.optionName;
            retargetingSelect.appendChild(option);
        });

        triggerOption.data.listTriggerOptions.items.forEach((e) => {
            const option = document.createElement("option");
            option.value = e.id;
            option.innerHTML = e.optionName;
            triggerSelect.appendChild(option);
        });

        const saveButton = document.getElementById("saveChange");
        const resetButton = document.getElementById("resetDefault");
        let props = [
            "autoRedirect",
            "autoRetargeting",
            "autoTrigger",
            "autoQuote",
            "autoResponse",
            "redirectTo",
            "quoteOption",
            "triggerOption",
            "retargetingOption",
            "retargetingTime",
        ];
        saveButton.addEventListener("click", async (e) => {
            e.preventDefault();
            let params = {};
            props.forEach((p) => {
                let elem = document.getElementById(p);
                switch (elem.type) {
                    case "checkbox":
                        params[p] = elem.checked;
                        break;
                    case "select-one":
                        params[p] = elem.value
                            ? `{\"optionId\":\"${elem.value}\"}`
                            : "{}";
                        break;
                    default:
                        params[p] =
                            p === "redirectTo"
                                ? elem.value === ""
                                    ? `{}`
                                    : `{\"value\":[${elem.value
                                          .split(",")
                                          .map((e) => `\"${e}\"`)}]}`
                                : elem.value;
                }
            });
            isDefault
                ? await client.graphql({
                      query: updateDefaultCategories,
                      variables: {
                          input: {
                              clientId,
                              id: categorySelectId,
                              categoryName: categorySelectName,
                              configuration: params,
                          },
                      },
                  })
                : await client.graphql({
                      query: updateCategories,
                      variables: {
                          input: {
                              clientId,
                              id: categorySelectId,
                              categoryName: categorySelectName,
                              configuration: params,
                          },
                      },
                  });
            window.alert("Se guardo la configuracion");
        });
        resetButton.addEventListener("click", async (e) => {
            const auth = prompt(
                "Estas seguro de volver a los valores por defecto?"
            );
            if (auth === "si") {
                const params = {
                    autoRedirect: false,
                    autoRetargeting: false,
                    autoTrigger: false,
                    autoQuote: false,
                    autoResponse: false,
                    redirectTo: "{}",
                    quoteOption: "{}",
                    triggerOption: "{}",
                    retargetingOption: "{}",
                    retargetingTime: "",
                };
                isDefault
                    ? await client.graphql({
                          query: updateDefaultCategories,
                          variables: {
                              input: {
                                  clientId,
                                  id: categorySelectId,
                                  categoryName: categorySelectName,
                                  configuration: params,
                              },
                          },
                      })
                    : await client.graphql({
                          query: updateCategories,
                          variables: {
                              input: {
                                  clientId,
                                  id: categorySelectId,
                                  categoryName: categorySelectName,
                                  configuration: params,
                              },
                          },
                      });
                for (const param in params) {
                    let elem = document.getElementById(param);
                    console.log(elem);
                    switch (elem.type) {
                        case "checkbox":
                            elem.checked = params[param];
                            break;
                        case "select-one":
                            elem.value = params[param] ? params[param] : "";
                            break;
                        default:
                            elem.value = "";
                    }
                }
            }
        });

        const editCategoriesBtn = document.querySelector(".edit_categories");
        const categoryForm = document.createElement("form");
        let newCategories = [];
        let oldCategories = [],
            deletedCategories = [];
        const addCategoryBtn = document.createElement("button");
        const icon = document.createElement("i");

        addCategoryBtn.id = "addCategory";
        addCategoryBtn.className = "btn btn-success";
        addCategoryBtn.textContent = "Agregar ";
        addCategoryBtn.appendChild(icon);
        icon.classList.add("fas", "fa-plus");

        const saveBtn = document.createElement("button");
        saveBtn.id = "saveBtn";
        saveBtn.className = "btn btn-primary";
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancelCategory";
        cancelBtn.className = "btn btn-secondary";
        cancelBtn.textContent = "Cancel";

        editCategoriesBtn.addEventListener("click", function() {
            $("#myModal").modal("show");
        });

        let count = 1;
        addCategoryBtn.addEventListener("click", function() {
            const newCategory = document.createElement("div");
            newCategory.className = "form-group row";
            newCategory.key = count;
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "col-9";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            input.id = count;
            inputWrapper.appendChild(input);
            const deleteBtnWrapper = document.createElement("div");
            deleteBtnWrapper.className = "col-3";
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn";
            deleteBtn.innerHTML =
                '<i class="fa fa-times" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
            deleteBtn.addEventListener("click", function() {
                categoryForm.removeChild(newCategory);
                newCategories = newCategories.filter(
                    (e) => e.id !== newCategory.key
                );
            });
            deleteBtnWrapper.appendChild(deleteBtn);
            newCategory.appendChild(inputWrapper);
            newCategory.appendChild(deleteBtnWrapper);
            newCategories.push({ id: count });
            categoryForm.appendChild(newCategory);
            count += 1;
        });
        saveBtn.addEventListener("click", async function() {
            let elementRepeted = [];

            for (let i = 0; i < newCategories.length; i++) {
                let parameters = {
                    autoRedirect: false,
                    autoRetargeting: false,
                    autoTrigger: false,
                    autoQuote: false,
                    autoResponse: false,
                    redirectTo: "{}",
                    quoteOption: "{}",
                    triggerOption: "{}",
                    retargetingOption: "{}",
                    retargetingTime: "",
                };
                const c = newCategories[i],
                    element = document.getElementById(c.id);
                oldCategories.forEach((categ) => {
                    let categElement = document.getElementById(categ.id);
                    categElement.value === element.value &&
                        elementRepeted.push(element);
                });

                if (!elementRepeted.includes(element)) {
                    await client.graphql({
                        query: createCategories,
                        variables: {
                            input: {
                                clientId,
                                categoryName: element.value,
                                configuration: parameters,
                            },
                        },
                    });
                } else {
                    window.alert(
                        `Ya existe una categoria con el nombre ${element.value}`
                    );
                }
            }

            for (let i = 0; i < oldCategories.length; i++) {
                const c = oldCategories[i];
                const element = document.getElementById(c.id);
                const allCommunicationsByCategory = await client.graphql({
                    query: listCommunications,
                    variables: {
                        clientId,
                        filter: { category: { eq: c.categoryName } },
                    },
                });
                let Items =
                    allCommunicationsByCategory.data.listCommunications.items;
                if (Items.length > 0) {
                    const agree = prompt(
                        `Hay Comunicaciones que tienen la categoria "${c.categoryName}", todas seran categorizadas a "${element.value}". Desea continuar?`
                    );

                    if (agree != "no" && agree != "No" && agree != "NO") {
                        for (let j = 0; j < Items.length; j++) {
                            try {
                                await client.graphql({
                                    query: updateCommunications,
                                    variables: {
                                        input: {
                                            clientId,
                                            dateTime: Items[j].dateTime,
                                            category: element.value,
                                        },
                                        condition: {
                                            messageId: {
                                                eq: Items[j].messageId,
                                            },
                                        },
                                    },
                                });
                                await client.graphql({
                                    query: updateCategories,
                                    variables: {
                                        input: {
                                            clientId,
                                            id: c.id,
                                            categoryName: element.value,
                                        },
                                    },
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                } else {
                    await client.graphql({
                        query: updateCategories,
                        variables: {
                            input: {
                                clientId,
                                id: c.id,
                                categoryName: element.value,
                            },
                        },
                    });
                }
            }

            for (let i = 0; i < deletedCategories.length; i++) {
                const c = deletedCategories[i];
                const allCommunicationsByCategory = await client.graphql({
                    query: listCommunications,
                    variables: {
                        clientId,
                        filter: { category: { eq: c.categoryName } },
                    },
                });
                let Items =
                    allCommunicationsByCategory.data.listCommunications.items;
                if (Items.length > 0) {
                    const agree = prompt(
                        `Hay Comunicaciones que tienen la categoria "${c.categoryName}", todas seran categorizadas a "UNCATEGORY". Desea continuar?`
                    );

                    if (agree != "no" && agree != "No" && agree != "NO") {
                        for (let j = 0; j < Items.length; j++) {
                            try {
                                await client.graphql({
                                    query: updateCommunications,
                                    variables: {
                                        input: {
                                            clientId,
                                            dateTime: Items[j].dateTime,
                                            category: "UNCATEGORY",
                                        },
                                        condition: {
                                            messageId: {
                                                eq: Items[j].messageId,
                                            },
                                        },
                                    },
                                });
                                await client.graphql({
                                    query: deleteCategories,
                                    variables: {
                                        input: {
                                            clientId,
                                            id: c.id,
                                        },
                                    },
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                } else {
                    await client.graphql({
                        query: deleteCategories,
                        variables: {
                            input: { clientId, id: c.id },
                        },
                    });
                }
            }

            location.reload();
        });
        cancelBtn.addEventListener("click", function() {
            $("#myModal").modal("hide");
        });

        const modalBody = document.createElement("div");
        modalBody.className = "modal-body m-t-20 m-b-10 m-l-40 p-l-40";
        modalBody.appendChild(categoryForm);

        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.className = "row justify-content-center";
        const addBtnWrapper = document.createElement("div");
        addBtnWrapper.className = "col-3";
        addBtnWrapper.appendChild(addCategoryBtn);
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

        customCategories.data.listCategories.items.forEach(function(category) {
            const newCategory = document.createElement("div");
            newCategory.className = "form-group row";
            newCategory.key = category.id;
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "col-9";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            input.id = category.id;
            input.value = category.categoryName;
            inputWrapper.appendChild(input);
            const deleteBtnWrapper = document.createElement("div");
            deleteBtnWrapper.className = "col-3";
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn";
            deleteBtn.innerHTML =
                '<i class="fa fa-times" style="color: red;" data-toggle="tooltip" data-placement="top" title="Borrar categoría"></i>';
            deleteBtn.addEventListener("click", function() {
                categoryForm.removeChild(newCategory);
                deletedCategories.push({
                    categoryName: category.categoryName,
                    id: newCategory.key,
                });
                oldCategories = oldCategories.filter(
                    (e) => e.id !== newCategory.key
                );
            });
            deleteBtnWrapper.appendChild(deleteBtn);
            newCategory.appendChild(inputWrapper);
            newCategory.appendChild(deleteBtnWrapper);
            categoryForm.appendChild(newCategory);
            oldCategories.push({
                id: category.id,
                categoryName: category.categoryName,
            });
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
