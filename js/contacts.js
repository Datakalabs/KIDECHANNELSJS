import { listCommunications, listGroups } from "../src/graphql/queries";
import axios from "axios";
import { getUserInfo, refreshAndGetTokens } from "./authentication";
import { client } from "../src/utils/amplifyConfig";
import { openEditModal } from "../src/modals/contacts/editModal";
import { URL_MS_GOOGLE } from "../secrets";
import { defaultCategories } from "../src/utils/defaultCategories";
import { fetchContacts, fetchGroups } from "../src/utils/fetchFunctions";
import { openAddModal } from "../src/modals/contacts/addModal";

(async function($) {
    // USE STRICT
    "use strict";
    try {
        let buttonNewContact = document.getElementById("buttonNewContact");

        let userInfo = await getUserInfo();
        const { tokens } = await refreshAndGetTokens();
        let clientId = userInfo.userData.userId;
        let allGroups, allContacts;

        async function renderContacts() {
            try {
                allContacts = await fetchContacts({ clientId });
                allGroups = await fetchGroups({ clientId });
                renderGroupList({ allGroups });
                renderTable(allContacts);
            } catch (error) {
                console.error("Error rendering contacts:", error);
            }
        }

        // Función para renderizar la lista de categorías en sidebar
        function renderGroupList({ allGroups }) {
            const ul2 = document.querySelector(".js-sub-list");
            ul2.innerHTML = "";

            allGroups.forEach((group) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                const icon = document.createElement("i");

                a.classList.add("showTable");
                icon.classList.add("fas", "fa-tags");
                a.appendChild(icon);
                a.appendChild(document.createTextNode(group.groupName));
                li.appendChild(a);
                ul2.appendChild(li);

                a.addEventListener("click", async function(event) {
                    event.preventDefault();
                    document.getElementById("step2").innerHTML =
                        group.groupName;
                    a.href = `groups.html?${group.groupName}`;
                });
            });
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
