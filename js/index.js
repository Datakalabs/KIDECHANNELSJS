import axios from "axios";
import { updateCommunication } from "../src/graphql/mutations";
import { refreshAndGetTokens } from "./authentication";
import { openEditModal } from "../src/modals/communications/editModal";
import { openThreadModal } from "../src/modals/communications/threadModal";
import {
    fetchGroups,
    fetchCommunications,
    fetchTags,
    createBadge,
    getSync,
    executeResponse,
    getColorObj,
    defaultCategories,
    client,
    createButtonContainer,
    createDiv,
    updateDataTable,
} from "../src/utils";
import {
    renderTagListInSidebar,
    renderGroupListInSidebar,
} from "./menuSidebar";

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
    function adjustTaskProgressHeight() {
        const taskProgress = document.querySelector(".task-progress");
        const recentReport = document.querySelector(".recent-report2");
        // Solo si recentReport existe
        if (recentReport) {
            const height = window.getComputedStyle(recentReport).height;
            console.log(height);
            taskProgress.style.height = height;
        }
    }
    document.addEventListener("DOMContentLoaded", adjustTaskProgressHeight);
    window.addEventListener("resize", () => {
        setTimeout(() => adjustTaskProgressHeight(), 100);
    });

    // Ejecutar la función al cargar la página y al redimensionar la ventana
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
        async function renderCommunications({ reRender }) {
            try {
                allCommunications = await fetchCommunications({ clientId });
                allGroups = await fetchGroups({ clientId });
                const alreadySync = await getSync({ tokens });

                alreadySync &&
                    (allTags = await fetchTags({
                        tokens,
                    }));

                let allCommsCount = allCommunications.length;
                window.setCommunicationsCount({ allCommunications });
                if (!reRender) {
                    renderGroupList(
                        allGroups,
                        allCommunications,
                        allCommsCount
                    );
                }
                renderGroupListInSidebar({ allGroups });
                alreadySync && renderTagListInSidebar({ allTags });
                renderTable();

                if (
                    window.location.pathname === "/index.html" ||
                    window.location.pathname === "/"
                ) {
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
                option2_1.textContent = "Mes";

                const option2_2 = document.createElement("option");
                option2_2.value = "mes";
                option2_2.textContent = "Todos los meses";

                const option2_3 = document.createElement("option");
                option2_3.value = "dia";
                option2_3.textContent = "Mes actual";

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

                const communicationsCount = new Array(12).fill(0);
                allCommunications.forEach((comm) => {
                    if (comm.groupId === group.id) {
                        const date = new Date(comm.dateTime);
                        const month = date.getMonth();
                        communicationsCount[month]++;
                    }
                });
                let groupColor = group.color;
                if (group.color === "#00000") {
                    groupColor = "#00FFFF";
                }

                const colorObj = getColorObj(groupColor);
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
                    let groupColor = group.color;
                    if (group.color === "#00000") {
                        groupColor = "#00FFFF";
                    }

                    communicationsByDay[group.id] = {
                        name: group.groupName,
                        data: new Array(31).fill(0),
                        color: getColorObj(groupColor),
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
                    let groupColor = group.color;
                    if (group.color === "#00000") {
                        groupColor = "#00FFFF";
                    }
                    const groupCommunications = filteredCommunications.filter(
                        (comm) => comm.groupId === group.id
                    );

                    const colorObj = getColorObj(groupColor);

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
            colorSpan.style = `background: ${colorObj.group_line}`;
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
            setTimeout(() => adjustTaskProgressHeight(), 100);
        }

        // Función para renderizar la tabla de comunicaciones
        function renderTable() {
            const dataSet = allCommunications.map((comm) => {
                const keyArray = [
                    "channel",
                    "category",
                    "tagId",
                    "dateTime",
                    "fromId",
                    // "toId",
                    "status",
                    "groupId",
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
                row[1] = createBadge(row[1], false);
                // row[3] = createDiv(row[3]);
                // row.push(createButtonContainer("view1", "eye"));
                // row.push(createButtonContainer("view2", "eye"));
                row.push(createButtonContainer("view3", "eye"));
                var buttonContainer = createDiv(`
                    <button  class="edit btn btn-primary" style="margin-right: 5px;"><i class="fas fa-pencil-alt"></i></button>
                  ${
                      row[5] !== "Answered"
                          ? '<button id="validate" class="validate btn btn-success" style="background-color: #86dfc4e7;"><i class="fas fa-check"></i></button>'
                          : ""
                  }
                `);
                const rowId = row[8];
                row.splice(5, 1);
                row.splice(7, 1);
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
                        { title: "Tag" },
                        { title: "Datetime" },
                        { title: "From" },
                        // { title: "To" },
                        // { title: "Status" },
                        { title: "Group" },
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
                        // { title: "Response Content" },
                        { title: "Thread" },
                        { title: "Actions" },
                        // { title: "View & Edit" },
                        // { title: "Response" },
                    ],
                    scrollX: true,
                    data: dataSet,
                    order: [[3, "desc"]],
                    autoWidth: true,
                    layout: {
                        bottomStart: {
                            buttons: ["csv", "excel", "pdf", "print"],
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
                                const commId = table.row(row).data()[9];
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

        renderCommunications({ reRender: false });
    } catch (error) {
        console.log(error);
    }
})(jQuery);
