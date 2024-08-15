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
import { modifyTag } from "../src/utils/postFunctions";

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
                console.error("Error rendering tags:", error);
            }
        }

        // Función para renderizar la tabla de tags
        function renderTable(allTags) {
            const dataSet = allTags.map((tag) => {
                const keyArray = ["id", "name"];

                const values = keyArray.map((key) => {
                    return tag[key];
                });
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
                                    action: async function() {
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
                    drawCallback: function() {
                        // Hacer la columna "Name" editable
                        const tableBody = document.querySelector(
                            "#tabla tbody"
                        );
                        tableBody.addEventListener("click", function(event) {
                            const target = event.target;
                            if (
                                target.tagName === "TD" &&
                                target.cellIndex === 1 //col name
                            ) {
                                const currentValue = target.textContent;
                                target.innerHTML = `<input type="text" value="${currentValue}" />`;
                                const input = target.querySelector("input");
                                input.focus();
                                const row = target.parentElement; // La fila en la que se encuentra la celda
                                const previousCell = table.row(row).data()[0];

                                // En blur guardo el valor
                                input.addEventListener(
                                    "blur",
                                    async function() {
                                        const newValue = input.value;
                                        target.innerHTML = newValue; // Actualizo el contenido de la celda
                                        await modifyTag({
                                            tokens,
                                            labelId: previousCell.textContent,
                                            newLabelName: newValue,
                                        });
                                    }
                                );

                                // Con esto guardo el valor cuando se presione Enter
                                input.addEventListener("keydown", function(e) {
                                    if (e.key === "Enter") {
                                        input.blur();
                                    }
                                });
                            }
                        });
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
