import axios from "axios";
import { refreshAndGetTokens } from "./authentication";
import { client } from "../src/utils/amplifyConfig";
import { openThreadModal } from "../src/modals/communications/threadModal";
import { openEditModal } from "../src/modals/communications/editModal";
import { normalizeDate } from "../src/utils/normalizeDateTime";
import { URL_MS_GOOGLE } from "../secrets";
import { defaultCategories } from "../src/utils/defaultCategories";
import { fetchCommunications, fetchGroups } from "../src/utils";
import { renderGroupListInSidebar } from "../src/utils/groupsUtils";

(async function($) {
    // USE STRICT
    "use strict";
    try {
        let selectedGroupName = window.location.search
            .slice(1)
            .replace(/%20/g, " ");
        document.getElementById("step2").innerHTML = selectedGroupName;

        const { tokens, userSub } = await refreshAndGetTokens();
        let clientId = userSub;
        let allCommunications, allGroups;

        async function fetchCommunicationsToRender() {
            allCommunications = await fetchCommunications({
                clientId,
                filters: {
                    groupId: allGroups.find(
                        (g) => g.groupName === selectedGroupName
                    ).id,
                },
            });
        }
        // Función para renderizar las comunicaciones y categorías
        async function renderCommunications() {
            try {
                allGroups = await fetchGroups({ clientId });
                await fetchCommunicationsToRender();
                if (window.location.pathname.includes("/groups.html")) {
                    setInterval(async () => {
                        await fetchCommunicationsToRender();
                        renderTable(allCommunications);
                    }, 30000);
                }

                renderGroupListInSidebar({ allGroups });
                renderTable(allCommunications);
            } catch (error) {
                console.error("Error rendering communications:", error);
            }
        }

        // Función para renderizar la tabla de comunicaciones
        function renderTable(allCommunications) {
            let arrComsById = [];
            const dataSet = allCommunications.map((comm) => {
                arrComsById.push(comm);
                const keyArray = [
                    "id",
                    "channel",
                    "category",
                    "dateTime",
                    "fromId",
                    "toId",
                    "status",
                    "groupId",
                    "responseAi",
                    "responseAttachment",
                    "actions",
                ];

                const values = keyArray.map((key) => {
                    return key === "fromId"
                        ? comm.contactName
                            ? comm.contactName
                            : comm[key]
                        : key === "groupId"
                        ? allGroups.filter((g) => g.id === comm[key])[0]
                              .groupName
                        : comm[key];
                });

                values.splice(7, 1);

                return values;
            });
            dataSet.forEach((row) => {
                row[2] = createBadge(row[2]);
                row[3] = createDiv(row[3]);
                // row.push(createButtonContainer("view1", "eye"));
                // row.push(createButtonContainer("view2", "eye"));
                row.push(createButtonContainer("view3", "eye"));
                row.push(createButtonContainer("edit", "pencil-alt", "full"));

                const currentCom = arrComsById.filter(
                    (c) => c.id === row[0]
                )[0];
                const button = document.createElement("button");
                button.className = `form-control btn-success`;
                button.type = "button";

                if (currentCom.status === "Answered") {
                    button.style.backgroundColor = "#d3d3d3"; // Gris para "Answered"
                    button.style.borderColor = "#d3d3d3"; // Borde gris para "Answered"
                    button.disabled = true; // Deshabilitar botón para "Answered"
                    button.style.cursor = "not-allowed";
                } else {
                    button.style.backgroundColor = "#00ad5f"; // Verde para otros estados
                    button.style.borderColor = "#00ad5f"; // Borde verde para otros estados
                }

                const iTag = document.createElement("i");
                iTag.className = "fas fa-check";
                button.addEventListener("click", async function() {
                    if (row[6] !== "Answered") {
                        const { data } = await axios.post(
                            `${URL_MS_GOOGLE}/communication/send`,
                            {
                                clientId,
                                id: row[0],
                                messageId: currentCom.messageId,
                                threadId: currentCom.threadId,
                                channel: currentCom.channel,
                                fromId: currentCom.fromId,
                                toId: currentCom.toId,
                                responseAi: currentCom.responseAi,
                                responseBody: currentCom.responseBody,
                                responseSubject: currentCom.responseSubject,
                                responseAttachment:
                                    currentCom.responseAttachment,
                                actions: currentCom.actions,
                                groupId: currentCom.groupId,
                            },
                            {
                                headers: {
                                    "X-Cognito-Auth": tokens.idToken,
                                },
                            }
                        );
                        console.log(data);
                        renderCommunications();
                    }
                });

                button.appendChild(iTag);
                row.push(button);
            });

            if ($.fn.DataTable.isDataTable("#tabla")) {
                updateDataTable($("#tabla").DataTable(), dataSet);
            } else {
                const table = new DataTable("#tabla", {
                    columns: [
                        { title: "Com ID" },
                        { title: "Channel" },
                        { title: "Category" },
                        { title: "Datetime" },
                        { title: "From" },
                        { title: "To" },
                        { title: "Status" },
                        ...(selectedGroupName ? [] : [{ title: "Group" }]),
                        { title: "Response AI" },
                        { title: "Response Attachment" },
                        { title: "Actions" },
                        // { title: "Message Content" },
                        // { title: "Response Content" },
                        { title: "Thread" },
                        { title: "View & Edit" },
                        { title: "Response" },
                    ],
                    order: [[3, "desc"]],
                    data: dataSet,
                    scrollX: true,
                    layout: {
                        topStart: {
                            buttons: ["csv", "excel", "pdf", "print"],
                        },
                    },
                });
                initializeTableEvents(table);
            }
        }

        function updateDataTable(dataTable, data) {
            dataTable.clear();
            dataTable.rows.add(data);
            dataTable.draw(false);
        }

        function createBadge(category) {
            const categ = defaultCategories.filter(
                (c) => c.categoryName === category
            )[0];

            const div = document.createElement("div");
            div.innerHTML = `<span class="badge ${categ.badgeClass}">${categ.categoryName}</span>`;
            return div;
        }

        // Función para crear un contenedor de botones
        function createButtonContainer(className, icon, full) {
            const container = document.createElement("div");
            container.className = `${className} d-flex justify-content-center`;
            container.innerHTML = `<button class="btn ${
                full ? "btn-primary" : "btn-outline-primary"
            }" style="margin-right: 5px;"><i class="fas fa-${icon}"></i></button>`;
            return container;
        }

        // Función para crear una div con contenido
        function createDiv(content) {
            const div = document.createElement("div");
            div.innerHTML = content;
            return div;
        }

        // Función para inicializar eventos de la tabla
        function initializeTableEvents(table) {
            table.on("click", "tbody .edit", async function() {
                const data = table.row($(this).closest("tr")).data();
                await openEditModal(
                    data,
                    allCommunications,
                    allGroups,
                    clientId,
                    renderCommunications
                );
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
        }

        async function openMessageModal(data) {
            let message = await client.graphql({
                query: messageDetails,
                variables: {
                    filter: {
                        messageId: { eq: data[0] },
                    },
                },
            });
            message = message.data.listCommunications.items[0];
            const normalizedDate = normalizeDate(message.dateTime);

            let form = $("<form>").attr("id", "messageForm");

            form.append(
                $("<div>")
                    .addClass("form-row")
                    .append(
                        $("<div>")
                            .addClass("form-group2 col-md-6")
                            .append(
                                $("<label>").text("Category:"),
                                $("<select>")
                                    .addClass("form-control")
                                    .prop("disabled", true)
                                    .val(message.category)
                                    .append(
                                        $("<option>")
                                            .text(message.category)
                                            .val(message.category)
                                    )
                            )
                    )
            );
            form.append(
                $("<div>")
                    .addClass("form-row")
                    .append(
                        $("<div>")
                            .addClass("form-group2 col-md-6")
                            .append($("<label>").text("From:"))
                            .append(
                                $("<input>")
                                    .attr("type", "text")
                                    .addClass("form-control")
                                    .prop("disabled", true)
                                    .val(message.fromId)
                            )
                    )
                    .append(
                        $("<div>")
                            .addClass("form-group2 col-md-6")
                            .append($("<label>").text("Datetime:"))
                            .append(
                                $("<input>")
                                    .attr("type", "text")
                                    .addClass("form-control")
                                    .prop("disabled", true)
                                    .val(normalizedDate)
                            )
                    )
            );
            form.append(
                $("<div>")
                    .addClass("form-group2")
                    .append($("<label>").text("Message Summary:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .val(message.messagSummary)
                    )
            );
            form.append(
                $("<div>")
                    .addClass("form-group2")
                    .append($("<label>").text("Message Subjet:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .val(message.messageSubject)
                    )
            );
            form.append(
                $("<div>")
                    .addClass("form-group2")
                    .append($("<label>").text("Message Body:"))
                    .append(
                        $("<textarea>")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .val(message.messageBody)
                    )
            ); // Crea el modal con el formulario
            let modal = $("<div>")
                .addClass("modal fade")
                .attr("id", "messageModal");
            let modalDialog = $("<div>").addClass("modal-dialog modal-med");
            let modalContent = $("<div>").addClass("modal-content");
            let modalHeader = $("<div>")
                .addClass("modal-header headerCenter")
                .append(
                    $("<h3>")
                        .addClass("modal-title")
                        .attr("id", "myModalLabel")
                        .text("Contenido de la comunicación")
                );
            let modalBody = $("<div>")
                .addClass("modal-body")
                .append(form);
            let modalFooter = $("<div>")
                .addClass("modal-footer")
                .append(
                    $("<button>")
                        .addClass("btn btn-secondary")
                        .text("Cerrar")
                        .attr("data-dismiss", "modal")
                );
            modalContent.append(modalHeader, modalBody, modalFooter);
            modalDialog.append(modalContent);
            modal.append(modalDialog);

            $("#messageModal").remove();
            $("body").append(modal);

            $("#messageModal").modal("show");
        }

        async function openResponseModal(data) {
            let response = await client.graphql({
                query: responseDetails,
                variables: {
                    filter: {
                        messageId: { eq: data[0] },
                    },
                },
            });
            response = response.data.listCommunications.items[0];

            let form = $("<form>").attr("id", "responseForm");

            form.append(
                $("<div>")
                    .addClass("form-row")
                    .append(
                        $("<div>")
                            .addClass("form-group3 col-md-6")
                            .append(
                                $("<label>").text("Response attachment"),
                                $("<input>")
                                    .attr("type", "text")
                                    .addClass("form-control")
                                    .prop("disabled", true)
                                    .val(response.responseAttachment)
                            )
                    )
            );
            form.append(
                $("<div>")
                    .addClass("form-group3")
                    .append($("<label>").text("Response AI:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .val(response.responseAi)
                    )
            );

            form.append(
                $("<div>")
                    .addClass("form-group3")
                    .append($("<label>").text("Response Subjet:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .val(response.responseSubject)
                    )
            );
            form.append(
                $("<div>")
                    .addClass("form-group3")
                    .append($("<label>").text("Response Body:"))
                    .append(
                        $("<textarea>")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .val(response.responseBody)
                    )
            );
            // Crea el modal con el formulario
            let modal = $("<div>")
                .addClass("modal fade")
                .attr("id", "responseModal");
            let modalDialog = $("<div>").addClass("modal-dialog modal-med");
            let modalContent = $("<div>").addClass("modal-content");
            let modalHeader = $("<div>")
                .addClass("modal-header headerCenter")
                .append(
                    $("<h3>")
                        .addClass("modal-title")
                        .attr("id", "myModalLabel")
                        .text("Contenido de la respuesta")
                );
            let modalBody = $("<div>")
                .addClass("modal-body")
                .append(form);
            let modalFooter = $("<div>")
                .addClass("modal-footer")
                .append(
                    $("<button>")
                        .addClass("btn btn-secondary")
                        .text("Cerrar")
                        .attr("data-dismiss", "modal")
                );
            modalContent.append(modalHeader, modalBody, modalFooter);
            modalDialog.append(modalContent);
            modal.append(modalDialog);

            $("#responseModal").remove();
            $("body").append(modal);

            $("#responseModal").modal("show");
        }

        renderCommunications();
    } catch (error) {
        console.log(error);
    }
})(jQuery);
