import axios from "axios";
import { refreshAndGetTokens } from "./authentication";
import { openThreadModal } from "../src/modals/communications/threadModal";
import { openEditModal } from "../src/modals/communications/editModal";
import {
    client,
    createBadge,
    fetchCommunications,
    fetchGroups,
    fetchTags,
    defaultCategories,
    normalizeDate,
    executeResponse,
    createButtonContainer,
    createDiv,
    updateDataTable,
    showLoader,
    hideLoader,
} from "../src/utils";
import {
    renderTagListInSidebar,
    renderGroupListInSidebar,
} from "./menuSidebar";

(async function($) {
    showLoader();
    // USE STRICT
    ("use strict");
    try {
        let selectedName = window.location.search
            .split("?")[2]
            .replace(/%20/g, " ");
        let page = window.location.search.split("?")[1];
        document.getElementById("step1").innerHTML = page;
        document.getElementById("step2").innerHTML = selectedName;

        const { tokens, userSub } = await refreshAndGetTokens();
        let clientId = userSub;
        let allCommunications, allCommunicationsCount, allGroups, allTags;

        async function fetchCommunicationsToRender() {
            allCommunicationsCount = await fetchCommunications({
                clientId,
            });
            allCommunications = allCommunicationsCount.filter((c) => {
                return page === "Groups"
                    ? c.groupId ===
                          allGroups.find((g) => g.groupName === selectedName).id
                    : c.tagId ===
                          allTags.find((t) => t.name === selectedName).id;
            });
        }
        // Función para renderizar las comunicaciones y categorías
        async function renderCommunications({ reRender }) {
            try {
                allGroups = await fetchGroups({ clientId });
                allTags = await fetchTags({ tokens });
                await fetchCommunicationsToRender();
                window.setCommunicationsCount({
                    allCommunications: allCommunicationsCount,
                });
                if (!reRender) {
                    if (window.location.pathname.includes("/tables.html")) {
                        setInterval(async () => {
                            await fetchCommunicationsToRender();
                            window.setCommunicationsCount({
                                allCommunications: allCommunicationsCount,
                            });
                            renderTable();
                        }, 30000);
                    }
                }

                renderGroupListInSidebar({ allGroups });
                renderTagListInSidebar({ allTags });
                renderTable();
            } catch (error) {
                console.error("Error rendering communications:", error);
            } finally {
                hideLoader();
            }
        }

        // Función para renderizar la tabla de comunicaciones
        function renderTable() {
            const dataSet = allCommunications.map((comm) => {
                const keyArray = [
                    "channel",
                    "category",
                    page == "Groups" ? "tagId" : "groupId",
                    "dateTime",
                    "fromId",
                    // "toId",
                    "status",
                    // "responseAi",
                    // "responseAttachment",
                    "messageBody",
                    "id",
                ];

                const values = keyArray.map((key) => {
                    let tagName;
                    if (key === "tagId") {
                        tagName = allTags.find((t) => t.id === comm[key])?.name;
                    }

                    return key === "fromId"
                        ? comm.contactName
                            ? comm.contactName
                            : comm[key]
                        : key === "groupId"
                        ? allGroups.filter((g) => g.id === comm[key])[0]
                              .groupName
                        : key === "tagId"
                        ? tagName
                            ? tagName
                            : "Untagged"
                        : comm[key];
                });
                values.splice(8, 1);

                return values;
            });
            dataSet.forEach((row) => {
                row[1] = createBadge(row[1], false);
                // row[3] = createDiv(row[3]);

                // row.push(createButtonContainer("view1", "eye"));
                // row.push(createButtonContainer("view2", "eye"));
                const rowId = row[7];

                row.push(createButtonContainer("view3", "eye"));
                var buttonContainer = createDiv(`
                    <button  class="edit btn btn-primary" style="margin-right: 5px;"><i class="fas fa-pencil-alt"></i></button>
                    ${
                        row[5] !== "Answered"
                            ? '<button id="validate" class="validate btn btn-success" style="background-color: #86dfc4e7;"><i class="fas fa-check"></i></button>'
                            : ""
                    }
                    `);
                row.splice(5, 1);
                row.splice(6, 1);
                buttonContainer.style.display = "flex";
                buttonContainer.style.justifyContent = "center";
                buttonContainer.style.alignItems = "center";
                row.push(buttonContainer);
                row.push(rowId);
            });

            if ($.fn.DataTable.isDataTable("#tabla")) {
                updateDataTable($("#tabla").DataTable(), dataSet);
            } else {
                const table = new DataTable("#tabla", {
                    columns: [
                        { title: "Channel" },
                        { title: "Category" },
                        page == "Groups"
                            ? { title: "Tag" }
                            : { title: "Group" },
                        { title: "Datetime" },
                        { title: "From" },
                        // { title: "To" },
                        // { title: "Status" },
                        // { title: "Response AI" },
                        // { title: "Response Attachment" },
                        {
                            title: "Message Content",
                            render: function(data, type, row) {
                                if (type === "display" && data.length > 50) {
                                    return data.substr(0, 50) + "…";
                                }
                                return data;
                            },
                        },
                        { title: "Thread" },
                        { title: "Actions" },
                        // { title: "View & Edit" },
                        // { title: "Response" },
                    ],
                    order: [[3, "desc"]],
                    data: dataSet,
                    scrollX: true,
                    layout: {
                        bottomStart: {
                            buttons: ["csv", "excel", "pdf", "print"],
                        },
                        topStart: {
                            buttons: [
                                "csv",
                                "excel",
                                "pdf",
                                "print",
                                {
                                    text: "⟲",
                                    action: async function(
                                        e,
                                        dt,
                                        node,
                                        config
                                    ) {
                                        allCommunications = await fetchCommunications(
                                            {
                                                clientId,
                                            }
                                        );
                                        renderTable();
                                    },
                                },
                            ],
                        },
                        topStart: {
                            buttons: [
                                {
                                    text: "⟲",
                                    action: async function(
                                        e,
                                        dt,
                                        node,
                                        config
                                    ) {
                                        allCommunications = await fetchCommunications(
                                            {
                                                clientId,
                                            }
                                        );
                                        renderTable();
                                    },
                                },
                                {
                                    text: "Send Message",
                                    action: async function(
                                        e,
                                        dt,
                                        node,
                                        config
                                    ) {
                                        try {
                                            const nuevaVentana = window.open(
                                                "https://mail.google.com/mail/?view=cm&fs=1",
                                                "Send Message",
                                                "width=800,height=600,_blank"
                                            );
                                        } catch (error) {
                                            throw error;
                                        }
                                    },
                                },
                            ],
                        },
                    },
                    drawCallback: function() {
                        const tableBody = document.querySelector(
                            "#tabla tbody"
                        );
                        tableBody.addEventListener("click", function(event) {
                            const target = event.target;
                            if (
                                target.tagName === "TD" &&
                                target.cellIndex === 1
                            ) {
                                const currentValue = target.textContent;
                                const row = target.parentElement;
                                const dataRow = table.row(row).data();
                                const commId = dataRow[dataRow.length - 1];
                                const select = document.createElement("select");
                                select.className = "badge";
                                defaultCategories.forEach((c) => {
                                    const option = document.createElement(
                                        "option"
                                    );
                                    option.value = c.categoryName;
                                    option.textContent = c.categoryName;
                                    if (c.categoryName === currentValue) {
                                        option.selected = true;
                                    }
                                    select.appendChild(option);
                                });

                                target.innerHTML = "";
                                target.appendChild(select);
                                select.focus();
                                select.addEventListener(
                                    "blur",
                                    async function() {
                                        const newValue = select.value;

                                        target.innerHTML = createBadge(
                                            newValue,
                                            true
                                        );
                                        await client.graphql({
                                            query: updateCommunication,
                                            variables: {
                                                input: {
                                                    clientId,
                                                    id: commId,
                                                    category: newValue,
                                                    status: "Processing",
                                                },
                                            },
                                        });
                                    }
                                );

                                select.addEventListener("keydown", function(e) {
                                    if (e.key === "Enter") {
                                        select.blur();
                                    }
                                });
                            }
                        });
                    },
                });
                initializeTableEvents(table);
            }
        }

        function initializeTableEvents(table) {
            table.on("click", "tbody .edit", async function() {
                const data = table.row($(this).closest("tr")).data();
                await openEditModal({
                    data,
                    allCommunications,
                    allGroups,
                    allTags,
                    clientId,
                    renderCommunications,
                    tokens,
                });
            });

            table.on("click", "tbody .view1", async function() {
                const data = table.row($(this).closest("tr")).data();
                await openMessageModal(data);
            });

            table.on("click", "tbody .view2", async function() {
                const data = table.row($(this).closest("tr")).data();
                await openResponseModal(data);
            });

            table.on("click", "tbody .view3", async function() {
                const data = table.row($(this).closest("tr")).data();
                await openThreadModal(data, allCommunications);
            });

            table.on("click", "tbody .validate", async function() {
                const dataTable = table.row($(this).closest("tr")).data();
                let {
                    status,
                    ...communicationToResponse
                } = allCommunications.filter(
                    (c) => c.id === dataTable[dataTable.length - 1]
                )[0];

                if (status !== "Answered") {
                    const response = await executeResponse({
                        tokens,
                        communicationToResponse,
                        clientId,
                    });
                    response &&
                        response.message === "Answered" &&
                        alert("Respuesta enviada");
                    allCommunications = await fetchCommunications({
                        clientId,
                    });
                    renderTable();
                }
            });
        }

        // async function openMessageModal(data) {
        //     let message = await client.graphql({
        //         query: messageDetails,
        //         variables: {
        //             filter: {
        //                 messageId: { eq: data[0] },
        //             },
        //         },
        //     });
        //     message = message.data.listCommunications.items[0];
        //     const normalizedDate = normalizeDate(message.dateTime);

        //     let form = $("<form>").attr("id", "messageForm");

        //     form.append(
        //         $("<div>")
        //             .addClass("form-row")
        //             .append(
        //                 $("<div>")
        //                     .addClass("form-group2 col-md-6")
        //                     .append(
        //                         $("<label>").text("Category:"),
        //                         $("<select>")
        //                             .addClass("form-control")
        //                             .prop("disabled", true)
        //                             .val(message.category)
        //                             .append(
        //                                 $("<option>")
        //                                     .text(message.category)
        //                                     .val(message.category)
        //                             )
        //                     )
        //             )
        //     );
        //     form.append(
        //         $("<div>")
        //             .addClass("form-row")
        //             .append(
        //                 $("<div>")
        //                     .addClass("form-group2 col-md-6")
        //                     .append($("<label>").text("From:"))
        //                     .append(
        //                         $("<input>")
        //                             .attr("type", "text")
        //                             .addClass("form-control")
        //                             .prop("disabled", true)
        //                             .val(message.fromId)
        //                     )
        //             )
        //             .append(
        //                 $("<div>")
        //                     .addClass("form-group2 col-md-6")
        //                     .append($("<label>").text("Datetime:"))
        //                     .append(
        //                         $("<input>")
        //                             .attr("type", "text")
        //                             .addClass("form-control")
        //                             .prop("disabled", true)
        //                             .val(normalizedDate)
        //                     )
        //             )
        //     );
        //     form.append(
        //         $("<div>")
        //             .addClass("form-group2")
        //             .append($("<label>").text("Message Summary:"))
        //             .append(
        //                 $("<input>")
        //                     .attr("type", "text")
        //                     .addClass("form-control")
        //                     .prop("disabled", true)
        //                     .val(message.messagSummary)
        //             )
        //     );
        //     form.append(
        //         $("<div>")
        //             .addClass("form-group2")
        //             .append($("<label>").text("Message Subjet:"))
        //             .append(
        //                 $("<input>")
        //                     .attr("type", "text")
        //                     .addClass("form-control")
        //                     .prop("disabled", true)
        //                     .val(message.messageSubject)
        //             )
        //     );
        //     form.append(
        //         $("<div>")
        //             .addClass("form-group2")
        //             .append($("<label>").text("Message Body:"))
        //             .append(
        //                 $("<textarea>")
        //                     .addClass("form-control")
        //                     .prop("disabled", true)
        //                     .val(message.messageBody)
        //             )
        //     ); // Crea el modal con el formulario
        //     let modal = $("<div>")
        //         .addClass("modal fade")
        //         .attr("id", "messageModal");
        //     let modalDialog = $("<div>").addClass("modal-dialog modal-med");
        //     let modalContent = $("<div>").addClass("modal-content");
        //     let modalHeader = $("<div>")
        //         .addClass("modal-header headerCenter")
        //         .append(
        //             $("<h3>")
        //                 .addClass("modal-title")
        //                 .attr("id", "myModalLabel")
        //                 .text("Contenido de la comunicación")
        //         );
        //     let modalBody = $("<div>")
        //         .addClass("modal-body")
        //         .append(form);
        //     let modalFooter = $("<div>")
        //         .addClass("modal-footer")
        //         .append(
        //             $("<button>")
        //                 .addClass("btn btn-secondary")
        //                 .text("Cerrar")
        //                 .attr("data-dismiss", "modal")
        //         );
        //     modalContent.append(modalHeader, modalBody, modalFooter);
        //     modalDialog.append(modalContent);
        //     modal.append(modalDialog);

        //     $("#messageModal").remove();
        //     $("body").append(modal);

        //     $("#messageModal").modal("show");
        // }

        // async function openResponseModal(data) {
        //     let response = await client.graphql({
        //         query: responseDetails,
        //         variables: {
        //             filter: {
        //                 messageId: { eq: data[0] },
        //             },
        //         },
        //     });
        //     response = response.data.listCommunications.items[0];

        //     let form = $("<form>").attr("id", "responseForm");

        //     form.append(
        //         $("<div>")
        //             .addClass("form-row")
        //             .append(
        //                 $("<div>")
        //                     .addClass("form-group3 col-md-6")
        //                     .append(
        //                         $("<label>").text("Response attachment"),
        //                         $("<input>")
        //                             .attr("type", "text")
        //                             .addClass("form-control")
        //                             .prop("disabled", true)
        //                             .val(response.responseAttachment)
        //                     )
        //             )
        //     );
        //     form.append(
        //         $("<div>")
        //             .addClass("form-group3")
        //             .append($("<label>").text("Response AI:"))
        //             .append(
        //                 $("<input>")
        //                     .attr("type", "text")
        //                     .addClass("form-control")
        //                     .prop("disabled", true)
        //                     .val(response.responseAi)
        //             )
        //     );

        //     form.append(
        //         $("<div>")
        //             .addClass("form-group3")
        //             .append($("<label>").text("Response Subjet:"))
        //             .append(
        //                 $("<input>")
        //                     .attr("type", "text")
        //                     .addClass("form-control")
        //                     .prop("disabled", true)
        //                     .val(response.responseSubject)
        //             )
        //     );
        //     form.append(
        //         $("<div>")
        //             .addClass("form-group3")
        //             .append($("<label>").text("Response Body:"))
        //             .append(
        //                 $("<textarea>")
        //                     .addClass("form-control")
        //                     .prop("disabled", true)
        //                     .val(response.responseBody)
        //             )
        //     );
        //     // Crea el modal con el formulario
        //     let modal = $("<div>")
        //         .addClass("modal fade")
        //         .attr("id", "responseModal");
        //     let modalDialog = $("<div>").addClass("modal-dialog modal-med");
        //     let modalContent = $("<div>").addClass("modal-content");
        //     let modalHeader = $("<div>")
        //         .addClass("modal-header headerCenter")
        //         .append(
        //             $("<h3>")
        //                 .addClass("modal-title")
        //                 .attr("id", "myModalLabel")
        //                 .text("Contenido de la respuesta")
        //         );
        //     let modalBody = $("<div>")
        //         .addClass("modal-body")
        //         .append(form);
        //     let modalFooter = $("<div>")
        //         .addClass("modal-footer")
        //         .append(
        //             $("<button>")
        //                 .addClass("btn btn-secondary")
        //                 .text("Cerrar")
        //                 .attr("data-dismiss", "modal")
        //         );
        //     modalContent.append(modalHeader, modalBody, modalFooter);
        //     modalDialog.append(modalContent);
        //     modal.append(modalDialog);

        //     $("#responseModal").remove();
        //     $("body").append(modal);

        //     $("#responseModal").modal("show");
        // }

        renderCommunications();
    } catch (error) {
        console.log(error);
    }
})(jQuery);
