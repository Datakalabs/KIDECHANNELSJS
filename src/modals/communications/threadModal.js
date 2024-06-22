export async function openThreadModal(data, allCommunications) {
    let communication = allCommunications.filter((c) => c.id === data[0])[0];

    const thread = JSON.parse(communication.thread);

    var section = document.createElement("div");
    section.className = "section__content section__content--p30";

    var container = document.createElement("div");
    container.className = "container-fluid";

    var bootdeyContainer = document.createElement("div");
    bootdeyContainer.className = "container bootdey";

    var row = document.createElement("div");
    row.className = "row gutters";

    var col = document.createElement("div");
    col.className = "col-xl-12 col-lg-12 col-md-12 col-sm-12";

    var card = document.createElement("div");
    card.className = "card";

    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    var timeline = document.createElement("div");
    timeline.className = "timeline";

    thread.forEach(function(item) {
        var timelineRow = document.createElement("div");
        timelineRow.className = "timeline-row";
        if (item.who === "external") {
            timelineRow.classList.add("external");
        } else {
            timelineRow.classList.add("client");
        }
        var timelineTime = document.createElement("div");
        timelineTime.className = "timeline-time";
        timelineTime.innerHTML = item.time + "<small>" + item.date + "</small>";

        var timelineDot = document.createElement("div");
        timelineDot.className = "timeline-dot " + item.dotClass;

        var timelineContent = document.createElement("div");
        timelineContent.className = "timeline-content";

        var fromDiv = document.createElement("div");
        fromDiv.style.display = "flex";
        fromDiv.style.alignItems = "center";

        var fromLabel = document.createElement("p");
        fromLabel.style.paddingRight = "10px";
        fromLabel.style.margin = "0";
        fromLabel.style.color = "black";
        fromLabel.innerHTML = "From:";

        var fromValue = document.createElement("p");
        fromValue.style.paddingRight = "10px";
        fromValue.style.margin = "0";
        fromValue.innerHTML = item.from;

        var toDiv = document.createElement("div");
        toDiv.style.display = "flex";
        toDiv.style.alignItems = "center";

        var toLabel = document.createElement("p");
        toLabel.style.paddingRight = "10px";
        toLabel.style.marginBottom = "10px";
        toLabel.style.color = "black";
        toLabel.innerHTML = "To:";

        var toValue = document.createElement("p");
        toValue.style.paddingRight = "10px";
        toValue.style.marginBottom = "10px";
        toValue.innerHTML = item.to;

        var title = document.createElement("h4");
        title.innerHTML = item.title;

        var content = document.createElement("p");
        content.innerHTML = item.content;

        var badgesDiv = document.createElement("div");

        // item.badges.forEach(function (badge) {
        //     var badgeSpan = document.createElement("span");
        //     badgeSpan.className = "badge badge-light";
        //     badgeSpan.innerHTML = badge;
        //     badgesDiv.appendChild(badgeSpan);
        // });

        fromDiv.appendChild(fromLabel);
        fromDiv.appendChild(fromValue);

        toDiv.appendChild(toLabel);
        toDiv.appendChild(toValue);

        timelineContent.appendChild(fromDiv);
        timelineContent.appendChild(toDiv);
        timelineContent.appendChild(title);
        timelineContent.appendChild(content);
        timelineContent.appendChild(badgesDiv);

        timelineRow.appendChild(timelineTime);
        timelineRow.appendChild(timelineDot);
        timelineRow.appendChild(timelineContent);

        timeline.appendChild(timelineRow);
    });

    // Construir la estructura de la sección
    cardBody.appendChild(timeline);
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
    bootdeyContainer.appendChild(row);
    container.appendChild(bootdeyContainer);
    section.appendChild(container);

    // Crea el modal con el formulario
    let modal = $("<div>")
        .addClass("modal fade")
        .attr("id", "threadModal");
    let modalDialog = $("<div>").addClass("modal-dialog Modal_BIG"); // Cambia "modal-lg" por "modal-sm" si quieres un modal más pequeño
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>")
        .addClass("modal-header headerCenter")
        .append(
            $("<h3>")
                .addClass("modal-title")
                .attr("id", "threadModalLabel")
                .text("Communication Thread")
        );
    let modalBody = $("<div>").addClass("modal-body");
    modalBody.append(section);
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
    $("#threadModal").remove();
    $("body").append(modal);

    $("#threadModal").modal("show");
}
