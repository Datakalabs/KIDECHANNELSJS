import { refreshAndGetTokens } from "./authentication";
import { openEditTagModal } from "../src/modals/tags/editModal";
import {
    fetchGroups,
    fetchCommunications,
    fetchTags,
} from "../src/utils/fetchFunctions";
import { openAddTagModal } from "../src/modals/tags/addModal";
import {
    renderGroupListInSidebar,
    renderTagListInSidebar,
} from "./menuSidebar";

(async function($) {
    // USE STRICT
    "use strict";
    try {
        let { tokens, userSub } = await refreshAndGetTokens();
        let clientId = userSub;
        let allGroups, allTags;
        const allCommunications = await fetchCommunications({ clientId });
        window.setCommunicationsCount({ allCommunications });
        async function renderTags() {
            try {
                allTags = await fetchTags({ tokens });
                allGroups = await fetchGroups({ clientId });
                renderGroupListInSidebar({ allGroups });
                renderTagListInSidebar({ allTags });
                renderTable(allTags.filter((t) => t.type === "user"));
            } catch (error) {
                console.error("Error rendering contacts:", error);
            }
        }

        // Función para renderizar la tabla de comunicaciones
        function renderTable(allTags) {
            const dataSet = allTags.map((contact) => {
                const keyArray = ["id", "name"];

                const values = keyArray.map((key) => {
                    return contact[key];
                });
                // values.splice(7, 1);
                return values;
            });
            dataSet.forEach((row) => {
                row.push(createButtonContainer("edit", "pencil-alt", "full"));
            });

            if ($.fn.DataTable.isDataTable("#tabla")) {
                updateDataTable($("#tabla").DataTable(), dataSet);
            } else {
                const table = new DataTable("#tabla", {
                    columns: [
                        { title: "ID" },
                        { title: "Name" },
                        { title: "" },
                    ],
                    order: [[1, "asc"]],
                    data: dataSet,
                    layout: {
                        bottomStart: {
                            buttons: ["csv", "excel", "pdf", "print"],
                        },
                        topStart: {
                            buttons: [
                                {
                                    text: "New Tag",
                                    action: async function(
                                        e,
                                        dt,
                                        node,
                                        config
                                    ) {
                                        await openAddTagModal({
                                            allTags,
                                            tokens,
                                            renderTags,
                                        });
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

        // Función para crear un contenedor de botones
        function createButtonContainer(className, icon, full) {
            const container = document.createElement("div");
            container.className = `${className} d-flex justify-content-center`;
            container.innerHTML = `<button class="btn ${
                full ? "btn-primary" : "btn-outline-primary"
            }" style="margin-right: 5px;"><i class="fas fa-${icon}"></i></button>`;
            return container;
        }

        // Función para inicializar eventos de la tabla
        function initializeTableEvents(table) {
            table.on("click", "tbody .edit", async function() {
                const data = table.row($(this).closest("tr")).data();
                await openEditTagModal({
                    data,
                    allTags,
                    tokens,
                    renderTags,
                });
            });
        }
        renderTags();
    } catch (error) {
        console.log(error);
    }
})(jQuery);
