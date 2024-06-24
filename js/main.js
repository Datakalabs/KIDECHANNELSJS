import axios from "axios";
import { updateCommunication } from "../src/graphql/mutations";
import { getUserInfo, refreshAndGetTokens } from "./authentication";
import { defaultCategories } from "../src/utils/defaultCategories";
import { groupColors } from "../src/utils/groupColors";
import { URL_MS_GOOGLE } from "../secrets";
import { openEditModal } from "../src/modals/communications/editModal";
import { openThreadModal } from "../src/modals/communications/threadModal";
import { fetchGroups, fetchCommunications } from "../src/utils";

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
    "use strict";
    try {
        // Config de Amplify con la config del backend como prop
        const { tokens } = await refreshAndGetTokens();
        // Se genera el cliente para las llamadas
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

        let userInfo = await getUserInfo();
        let clientId = userInfo.userData.userId;
        let selectedGroupName;
        const select1 = document.createElement("select");

        // Función para obtener comunicaciones
        let allCommunications, allGroups;

        async function renderCommunications() {
            try {
                allCommunications = await fetchCommunications({ clientId });
                allGroups = await fetchGroups({ clientId });

                let allCommsCount = allCommunications.length;

                renderGroupList(allGroups, allCommunications, allCommsCount);
                renderTable();

                if (window.location.pathname === "/index.html") {
                    setInterval(renderTable, 30000);
                }
            } catch (error) {
                console.error("Error rendering communications:", error);
            }
        }

        function renderGroupList(groups, allCommunications, allCommsCount) {
            const ul2 = document.querySelector(".js-sub-list");
            ul2.innerHTML = "";
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
                const li = document.createElement("li");
                const a = document.createElement("a");
                const icon = document.createElement("i");
                const commsByGroupCount = allCommunications.filter(
                    (comm) => comm.groupId === group.id
                ).length;
                const countPortion = parseFloat(
                    ((commsByGroupCount * 100) / allCommsCount).toFixed(2)
                );

                const colorObj = groupColors[index];

                const communicationsCount = new Array(12).fill(0);
                allCommunications.forEach((comm) => {
                    const date = new Date(comm.dateTime);
                    const month = date.getMonth();
                    communicationsCount[month]++;
                });

                const groupDataset = {
                    label: group.groupName,
                    backgroundColor: colorObj.bg,
                    borderColor: colorObj.group_line,
                    pointHoverBackgroundColor: colorObj.group_line,
                    borderWidth: 0,
                    data: communicationsCount,
                };

                a.classList.add("showTable");
                icon.classList.add("fas", "fa-tags");
                a.appendChild(icon);
                a.appendChild(document.createTextNode(group.groupName));
                li.appendChild(a);
                ul2.appendChild(li);

                const option = document.createElement("option");
                option.value = group.groupName;
                option.textContent = group.groupName;
                select1.appendChild(option);

                if (!selectedGroupName) {
                    renderProgressBar(group.groupName, countPortion);
                    renderChartInfo2(group, colorObj);
                    window.myChart.data.datasets.push(groupDataset);
                }

                a.addEventListener("click", async function(event) {
                    event.preventDefault();
                    selectedGroupName = group.groupName;
                    a.href = `groups.html?${selectedGroupName}`;

                    await renderCommunications();
                });
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
                        borderWidth: 1,
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
                        borderWidth: 1,
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
                await openEditModal(
                    data,
                    allCommunications,
                    allGroups,
                    clientId,
                    renderCommunications
                );
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
(function($) {
    // USE STRICT
    "use strict";
    var navbars = ["header", "aside"];
    var hrefSelector =
        'a:not([target="_blank"]):not([href^="#"]):not([class^="chosen-single"])';
    var linkElement = navbars
        .map((element) => element + " " + hrefSelector)
        .join(", ");
    $(".animsition").animsition({
        inClass: "fade-in",
        outClass: "fade-out",
        inDuration: 900,
        outDuration: 900,
        linkElement: linkElement,
        loading: true,
        loadingParentElement: "html",
        loadingClass: "page-loader",
        loadingInner: '<div class="page-loader__spin"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ["animation-duration", "-webkit-animation-duration"],
        overlay: false,
        overlayClass: "animsition-overlay-slide",
        overlayParentElement: "html",
        transition: function(url) {
            window.location.href = url;
        },
    });
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    // Scroll Bar
    try {
        var jscr1 = $(".js-scrollbar1");
        if (jscr1[0]) {
            const ps1 = new PerfectScrollbar(".js-scrollbar1");
        }

        var jscr2 = $(".js-scrollbar2");
        if (jscr2[0]) {
            const ps2 = new PerfectScrollbar(".js-scrollbar2");
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    // Select 2
    try {
        $(".js-select2").each(function() {
            $(this).select2({
                minimumResultsForSearch: 20,
                dropdownParent: $(this).next(".dropDownSelect2"),
            });
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    try {
        var showTablebutton = document.getElementsByClassName("showTable")[0];
        var showstatisticbutton = document.getElementsByClassName(
            "showstatistic"
        );
        var statistic = document.getElementById("statistics");
        var table = document.getElementById("table");

        showTablebutton.addEventListener("click", function() {
            statistic.style.display = "none";
            table.style.display = "block";
        });
        for (var i = 0; i < showstatisticbutton.length; i++) {
            showstatisticbutton[i].addEventListener("click", function(event) {
                statistic.style.display = "block";
                table.style.display = "none";
            });
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    // Load more
    try {
        var list_load = $(".js-list-load");
        if (list_load[0]) {
            list_load.each(function() {
                var that = $(this);
                that.find(".js-load-item").hide();
                var load_btn = that.find(".js-load-btn");
                load_btn.on("click", function(e) {
                    $(this)
                        .text("Loading...")
                        .delay(1500)
                        .queue(function(next) {
                            $(this).hide();
                            that.find(".js-load-item").fadeToggle(
                                "slow",
                                "swing"
                            );
                        });
                    e.preventDefault();
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
})(jQuery);
(function($) {
    // USE STRICT
    "use strict";

    try {
        $('[data-toggle="tooltip"]').tooltip();
    } catch (error) {
        console.log(error);
    }

    // Chatbox
    try {
        var inbox_wrap = $(".js-inbox");
        var message = $(".au-message__item");
        message.each(function() {
            var that = $(this);

            that.on("click", function() {
                $(this)
                    .parent()
                    .parent()
                    .parent()
                    .toggleClass("show-chat-box");
            });
        });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
