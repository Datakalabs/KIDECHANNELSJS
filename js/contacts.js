import { getUserInfo } from "./authentication";
import { openEditModal } from "../src/modals/contacts/editModal";
import { fetchContacts, fetchGroups } from "../src/utils/fetchFunctions";
import { openAddModal } from "../src/modals/contacts/addModal";
import { renderGroupListInSidebar } from "../src/utils/groupsUtils";

(async function($) {
    // USE STRICT
    "use strict";
    try {
        let buttonNewContact = document.getElementById("buttonNewContact");

        let userInfo = await getUserInfo();
        let clientId = userInfo.userData.userId;
        let allGroups, allContacts;

        async function renderContacts() {
            try {
                allContacts = await fetchContacts({ clientId });
                allGroups = await fetchGroups({ clientId });
                renderGroupListInSidebar({ allGroups });

                renderTable(allContacts);
            } catch (error) {
                console.error("Error rendering contacts:", error);
            }
        }

        // Función para renderizar la tabla de comunicaciones
        function renderTable(allContacts) {
            const dataSet = allContacts.map((contact) => {
                const keyArray = [
                    "id",
                    "contactName",
                    "contactEmail",
                    "groupId",
                ];

                const values = keyArray.map((key) => {
                    return key === "groupId"
                        ? allGroups.filter((g) => g.id === contact[key])[0]
                              .groupName
                        : contact[key];
                });
                // values.splice(7, 1);
                return values;
            });
            dataSet.forEach((row) => {
                row.push(createButtonContainer("edit", "pencil-alt", "full"));
                row.push(row[0]);
                row.splice(0, 1);
            });

            if ($.fn.DataTable.isDataTable("#tabla")) {
                updateDataTable($("#tabla").DataTable(), dataSet);
            } else {
                const table = new DataTable("#tabla", {
                    columns: [
                        { title: "Name" },
                        { title: "Email" },
                        { title: "Group" },
                        { title: "" },
                    ],
                    order: [[0, "asc"]],
                    data: dataSet,
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
                await openEditModal({
                    data,
                    allContacts,
                    allGroups,
                    clientId,
                    renderContacts,
                });
            });
        }
        renderContacts();

        buttonNewContact.addEventListener("click", async () => {
            await openAddModal({
                allContacts,
                allGroups,
                clientId,
                renderContacts,
            });
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
