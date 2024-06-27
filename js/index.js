import axios from "axios";
import { updateCommunication } from "../src/graphql/mutations";
import { getUserInfo, refreshAndGetTokens } from "./authentication";
import { defaultCategories } from "../src/utils/defaultCategories";
import {
    groupColors,
    renderGroupListInSidebar,
} from "../src/utils/groupsUtils";
import { URL_MS_GOOGLE } from "../secrets";
import { openEditModal } from "../src/modals/communications/editModal";
import { openThreadModal } from "../src/modals/communications/threadModal";
import { fetchGroups, fetchCommunications, fetchTags } from "../src/utils";

(function($) {
    try {
        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ].splice(0, new Date().getMonth() + 1);
        var ctx = document.getElementById("recent-rep2-chart");
        if (ctx) {
            ctx.height = 230;
            window.myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: monthNames,
                    datasets: [],
                },
                options: {
                    maintainAspectRatio: true,
                    legend: {
                        display: false,
                    },
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                gridLines: {
                                    drawOnChartArea: true,
                                    color: "#f2f2f2",
                                },
                                ticks: {
                                    fontFamily: "Poppins",
                                    fontSize: 12,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    maxTicksLimit: 5,
                                    stepSize: 10,
                                    max: 50,
                                    fontFamily: "Poppins",
                                    fontSize: 12,
                                },
                                gridLines: {
                                    display: true,
                                    color: "#f2f2f2",
                                },
                            },
                        ],
                    },
                    elements: {
                        point: {
                            radius: 0,
                            hitRadius: 10,
                            hoverRadius: 4,
                            hoverBorderWidth: 3,
                        },
                        line: {
                            tension: 0,
                        },
                    },
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(async function($) {
    // USE STRICT
    ("use strict");
    try {
        const { tokens, userSub } = await refreshAndGetTokens();
        let clientId = userSub;
        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ].splice(0, new Date().getMonth() + 1);

        let selectedGroupName;
        const select1 = document.createElement("select");

        // Función para obtener comunicaciones
        let allCommunications, allGroups, allTags;
        async function renderCommunications() {
            try {
                allCommunications = await fetchCommunications({ clientId });
                allGroups = await fetchGroups({ clientId });
                allTags = await fetchTags({ clientId });

                let allCommsCount = allCommunications.length;

                renderGroupList(allGroups, allCommunications, allCommsCount);
                renderGroupListInSidebar({ allGroups });
                renderTable();

                if (window.location.pathname === "/index.html") {
                    setInterval(async () => {
                        allCommunications = await fetchCommunications({
                            clientId,
                        });
                        renderTable();
                    }, 30000);
                }
            } catch (error) {
                console.error("Error rendering communications:", error);
            }
        }

        function renderGroupList(groups, allCommunications, allCommsCount) {
            const chartRightRef = document.getElementById("chart-info__right");

            let select1, select2;

            if (!chartRightRef.querySelector(".rs-select2--dark")) {
                const div1 = document.createElement("div");
                div1.classList.add(
                    "rs-select2--dark",
                    "rs-select2--md",
                    "m-r-10"
                );

                select1 = document.createElement("select");
                select1.classList.add("js-select2");
                select1.setAttribute("name", "property");

                const option1_default = document.createElement("option");
                option1_default.selected = true;
                option1_default.textContent = "Todas";
                select1.appendChild(option1_default);

                const dropDown1 = document.createElement("div");
                dropDown1.classList.add("dropDownSelect2");

                div1.appendChild(select1);
                div1.appendChild(dropDown1);

                const div2 = document.createElement("div");
                div2.classList.add("rs-select2--dark", "rs-select2--sm");

                select2 = document.createElement("select");
                select2.classList.add("js-select2", "au-select-dark");
                select2.setAttribute("name", "time");

                const option2_1 = document.createElement("option");
                option2_1.selected = true;
                option2_1.textContent = "Mes y dia";

                const option2_2 = document.createElement("option");
                option2_2.value = "mes";
                option2_2.textContent = "Por mes";

                const option2_3 = document.createElement("option");
                option2_3.value = "dia";
                option2_3.textContent = "Por día";

                select2.appendChild(option2_1);
                select2.appendChild(option2_2);
                select2.appendChild(option2_3);

                const dropDown2 = document.createElement("div");
                dropDown2.classList.add("dropDownSelect2");

                div2.appendChild(select2);
                div2.appendChild(dropDown2);

                chartRightRef.appendChild(div1);
                chartRightRef.appendChild(div2);

                select1.addEventListener("change", function() {
                    applyFilters(
                        select1.value,
                        select2.value,
                        allCommunications,
                        groups
                    );
                });

                select2.addEventListener("change", function() {
                    applyFilters(
                        select1.value,
                        select2.value,
                        allCommunications,
                        groups
                    );
                });
            } else {
                select1 = chartRightRef.querySelector(
                    'select[name="property"]'
                );
                select1.innerHTML = "";

                const option1_default = document.createElement("option");
                option1_default.selected = true;
                option1_default.textContent = "Todas";
                select1.appendChild(option1_default);

                select2 = chartRightRef.querySelector('select[name="time"]');
            }

            groups.forEach((group, index) => {
                const commsByGroupCount = allCommunications.filter(
                    (comm) => comm.groupId === group.id
                ).length;
                const countPortion = parseFloat(
                    ((commsByGroupCount * 100) / allCommsCount).toFixed(2)
                );

                const colorObj = groupColors[index];

                const communicationsCount = new Array(12).fill(0);
                allCommunications.forEach((comm) => {
                    if (comm.groupId === group.id) {
                        const date = new Date(comm.dateTime);
                        const month = date.getMonth();
                        communicationsCount[month]++;
                    }
                });

                const groupDataset = {
                    label: group.groupName,
                    backgroundColor: colorObj.bg,
                    borderColor: colorObj.group_line,
                    pointHoverBackgroundColor: colorObj.group_line,
                    borderWidth: 0,
                    data: communicationsCount,
                };

                const option = document.createElement("option");
                option.value = group.groupName;
                option.textContent = group.groupName;
                select1.appendChild(option);

                if (!selectedGroupName) {
                    renderProgressBar(group.groupName, countPortion);
                    renderChartInfo2(group, colorObj);
                    window.myChart.data.datasets.push(groupDataset);
                }
            });
        }

        function applyFilters(
            selectedGroup,
            selectedTime,
            allCommunications,
            groups
        ) {
            let filteredCommunications = allCommunications;

            if (selectedGroup && selectedGroup !== "Todas") {
                filteredCommunications = filteredCommunications.filter(
                    (comm) => {
                        const group = groups.find((g) => g.id === comm.groupId);
                        return group && group.groupName === selectedGroup;
                    }
                );
            }

            updateChart(filteredCommunications, selectedTime, groups);
        }

        function updateChart(filteredCommunications, diaMes, groups) {
            window.myChart.data.datasets = [];

            if (diaMes && diaMes === "dia") {
                const days = Array.from({ length: 31 }, (_, i) => i + 1);
                const communicationsByDay = {};

                // Inicializar estructura para almacenar comunicaciones por grupo y día
                groups.forEach((group, index) => {
                    communicationsByDay[group.id] = {
                        name: group.groupName,
                        data: new Array(31).fill(0),
                        color: groupColors[index],
                    };
                });

                // Contar comunicaciones por grupo y día
                filteredCommunications.forEach((comm) => {
                    const date = new Date(comm.dateTime);
                    const day = date.getDate() - 1;
                    const groupId = comm.groupId;

                    if (communicationsByDay[groupId]) {
                        communicationsByDay[groupId].data[day]++;
                    }
                });

                // Crear datasets para el gráfico
                Object.values(communicationsByDay).forEach((groupComm) => {
                    const dataset = {
                        label: groupComm.name,
                        backgroundColor: groupComm.color.bg,
                        borderColor: groupComm.color.group_line,
                        pointHoverBackgroundColor: groupComm.color.group_line,
                        data: groupComm.data,
                        borderWidth: 0,
                    };
                    window.myChart.data.datasets.push(dataset);
                });

                window.myChart.data.labels = days;
            } else {
                const communicationsCount = new Array(12).fill(0);
                filteredCommunications.forEach((comm) => {
                    const date = new Date(comm.dateTime);
                    const month = date.getMonth();
                    communicationsCount[month]++;
                });

                groups.forEach((group, index) => {
                    const groupCommunications = filteredCommunications.filter(
                        (comm) => comm.groupId === group.id
                    );

                    const colorObj = groupColors[index];

                    const dataset = {
                        label: group.groupName,
                        backgroundColor: colorObj.bg,
                        borderColor: colorObj.group_line,
                        pointHoverBackgroundColor: colorObj.group_line,
                        data: new Array(12).fill(0),
                        borderWidth: 0,
                    };

                    groupCommunications.forEach((comm) => {
                        const date = new Date(comm.dateTime);
                        const month = date.getMonth();
                        dataset.data[month]++;
                    });

                    window.myChart.data.datasets.push(dataset);
                });

                window.myChart.data.labels = monthNames;
            }

            window.myChart.update();
        }

        // Función para renderizar la información del gráfico
        function renderChartInfo2(group, colorObj) {
            const chartLeftRef = document.getElementById("chart-info__left");

            const chartNote = document.createElement("div");
            chartNote.className = "chart-note";

            const colorSpan = document.createElement("span");
            colorSpan.className = colorObj.class;

            const labelSpan = document.createElement("span");
            labelSpan.textContent = group.groupName;

            chartNote.appendChild(colorSpan);
            chartNote.appendChild(labelSpan);
            chartLeftRef.appendChild(chartNote);
        }

        // Función para renderizar la barra de progreso
        function renderProgressBar(groupName, countPortion) {
            const skillContainer = document.getElementById("skill-container");
            // Crear los elementos necesarios
            const progressContainer = document.createElement("div");
            progressContainer.className = "progress-cont";

            const progressDiv = document.createElement("div");
            progressDiv.className = "progress";

            const titleSpan = document.createElement("span");
            titleSpan.className = "progress__title";
            titleSpan.textContent = groupName;

            const barDiv = document.createElement("div");
            barDiv.className = "progress-bar";
            barDiv.setAttribute("role", "progressbar");
            barDiv.setAttribute("aria-valuenow", countPortion);
            barDiv.setAttribute("aria-valuemin", "0");
            barDiv.setAttribute("aria-valuemax", "100");
            barDiv.style.width = countPortion + "%";

            const valueSpan = document.createElement("span");
            valueSpan.className = "progress__value js-value";
            valueSpan.textContent = countPortion + "%";

            // Añadir los elementos al DOM en el orden correcto
            barDiv.appendChild(valueSpan);
            progressDiv.appendChild(barDiv);
            progressContainer.appendChild(titleSpan);
            progressContainer.appendChild(progressDiv);
            skillContainer.appendChild(progressContainer);

            // Inicializar la barra de progreso de Bootstrap
            $(barDiv).progressbar();
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
                    "tagId",
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
                        ? allGroups.find((g) => {
                              return g.id === comm[key];
                          }).groupName
                        : key === "tagId"
                        ? tagName
                            ? tagName
                            : "Untagged"
                        : comm[key];
                });

                return values;
            });
            dataSet.forEach((row) => {
                row[2] = createBadge(row[2]);
                row[3] = createDiv(row[3]);
                const notesContainer = document.createElement("div"),
                    rowParsed = JSON.parse(row[11]);
                Object.keys(rowParsed).forEach((note) => {
                    const noteDiv = document.createElement("div");
                    noteDiv.textContent = note; // Aquí asigna el contenido de cada nota
                    console.log(rowParsed[note]);
                    if (rowParsed[note]?.executed) {
                        // Aplica estilos para que se parezca a una nota
                        noteDiv.style.backgroundColor = "#d3d3d3"; // Fondo verde
                        noteDiv.style.padding = "10px"; // Espaciado interno
                        noteDiv.style.marginBottom = "5px"; // Margen inferior
                        noteDiv.style.border = "1px solid #ccc"; // Borde ligero
                        noteDiv.style.borderRadius = "0"; // Elimina el borde redondeado
                        noteDiv.style.boxShadow =
                            "2px 2px 5px rgba(0, 0, 0, 0.1)"; // Sombra ligera para destacar
                    } else {
                        noteDiv.style.backgroundColor = "#00ad5f"; // Fondo verde
                        noteDiv.style.padding = "10px"; // Espaciado interno
                        noteDiv.style.marginBottom = "5px"; // Margen inferior
                        noteDiv.style.border = "1px solid #ccc"; // Borde ligero
                        noteDiv.style.borderRadius = "0"; // Elimina el borde redondeado
                        noteDiv.style.boxShadow =
                            "2px 2px 5px rgba(0, 0, 0, 0.1)"; // Sombra ligera para destacar
                    }

                    notesContainer.appendChild(noteDiv);
                });
                row[11] = notesContainer;
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
                    button.style.backgroundColor = "#d3d3d3";
                    button.style.borderColor = "#d3d3d3";
                    button.disabled = true;
                    button.style.cursor = "not-allowed";
                } else {
                    button.style.backgroundColor = "#00ad5f";
                    button.style.borderColor = "#00ad5f";
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
                        { title: "Tag" },
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
                    scrollX: true,
                    data: dataSet,
                    order: [[4, "desc"]],
                    autoWidth: true,
                    layout: {
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

        // Función para crear el contenedor de acciones
        // function createActionButtonContainer() {
        //     const container = document.createElement("div");
        //     container.className = "headerCenter"
        //     container.innerHTML = `
        // <button class="edit btn btn-primary" style="margin-right: 5px;"><i class="fas fa-pencil-alt"></i></button>
        // <button class="check btn btn-success" style="background-color: #00ad5f;"><i class="fas fa-check"></i></button>`;
        //     return container;
        // }

        // Función para crear una div con contenido
        function createDiv(content) {
            const div = document.createElement("div");
            div.innerHTML = content;
            return div;
        }

        // Función para crear un badge
        function createBadge(category) {
            const categ = defaultCategories.filter(
                (c) => c.categoryName === category
            )[0];

            const div = document.createElement("div");
            div.innerHTML = `<span class="badge ${categ.badgeClass}">${categ.categoryName}</span>`;
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
                });
            });

            // table.on("click", "tbody .check", async function () {
            //     const data = table.row($(this).closest("tr")).data();
            //     await executeFunc(data);
            // });

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
