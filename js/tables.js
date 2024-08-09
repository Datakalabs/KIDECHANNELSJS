import axios from "axios";
import { refreshAndGetTokens } from "./authentication";
import { client } from "../src/utils/amplifyConfig";
import { openThreadModal } from "../src/modals/communications/threadModal";
import { openEditModal } from "../src/modals/communications/editModal";
import { normalizeDate } from "../src/utils/normalizeDateTime";
import { defaultCategories } from "../src/utils/defaultCategories";
import { fetchCommunications, fetchGroups, fetchTags } from "../src/utils";
import {
    renderTagListInSidebar,
    renderGroupListInSidebar,
} from "./menuSidebar";

(async function($) {
    // USE STRICT
    "use strict";
    try {
        let selectedName = window.location.search
            .split("?")[2]
            .replace(/%20/g, " ");
        let page = window.location.search.split("?")[1];
        document.getElementById("step1").innerHTML = page;
        document.getElementById("step2").innerHTML = selectedName;

        const { tokens, userSub } = await refreshAndGetTokens();
        let clientId = userSub;
        let allCommunications, allGroups, allTags;

        async function fetchCommunicationsToRender() {
            let filters =
                page == "Groups"
                    ? {
                          groupId: allGroups.find(
                              (g) => g.groupName === selectedName
                          ).id,
                      }
                    : {
                          tagId: allTags.find((t) => t.tagName === selectedName)
                              .id,
                      };
            allCommunications = await fetchCommunications({
                clientId,
                filters,
            });
        }
        // Función para renderizar las comunicaciones y categorías
        async function renderCommunications() {
            try {
                allGroups = await fetchGroups({ clientId });
                allTags = await fetchTags({ clientId });
                await fetchCommunicationsToRender();
                if (window.location.pathname.includes("/tables.html")) {
                    setInterval(async () => {
                        await fetchCommunicationsToRender();
                        renderTable();
                    }, 30000);
                }
                window.setCommunicationsCount({ allCommunications });

                renderGroupListInSidebar({ allGroups });
                renderTagListInSidebar({ allTags });
                renderTable();
            } catch (error) {
                console.error("Error rendering communications:", error);
            }
        }

        // Función para renderizar la tabla de comunicaciones
        function renderTable() {
            let arrComsById = [];
            const dataSet = allCommunications.map((comm) => {
                arrComsById.push(comm);
                const keyArray = [
                    "id",
                    "channel",
                    "category",
                    page == "Groups" ? "tagId" : "groupId",
                    "dateTime",
                    "fromId",
                    // "toId",
                    // "status",
                    // "responseAi",
                    // "responseAttachment",
                    "messageBody",
                ];

                const values = keyArray.map((key) => {
                    let tagName;
                    if (key === "tagId") {
                        tagName = allTags.find((t) => t.id === comm[key])
                            ?.tagName;
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
                row[2] = createBadge(row[2]);
                // row[3] = createDiv(row[3]);

                // row.push(createButtonContainer("view1", "eye"));
                // row.push(createButtonContainer("view2", "eye"));
                row.push(createButtonContainer("view3", "eye"));
                var buttonContainer = createDiv(`
                    <button  class="edit btn btn-primary" style="margin-right: 5px;"><i class="fas fa-pencil-alt"></i></button>
                  <button id="validate" class="validate btn btn-success" style="background-color: #86dfc4e7;"><i class="fas fa-check"></i></button>
                `);

                row.push(buttonContainer);
            });

            if ($.fn.DataTable.isDataTable("#tabla")) {
                updateDataTable($("#tabla").DataTable(), dataSet);
            } else {
                const table = new DataTable("#tabla", {
                    columns: [
                        { title: "Com ID" },
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
                    order: [[4, "desc"]],
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
