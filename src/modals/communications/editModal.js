import { client } from "../../utils/amplifyConfig";
import { defaultCategories } from "../../utils/defaultCategories";
import { updateCommunication } from "../../graphql/mutations";
import { awsDateTimeFormat } from "../../../src/utils/normalizeDateTime";
import { openEditTagModal } from "../tags/editModal";
import axios from "axios";
import { URL_KIDECHANNELS } from "../../../secrets";

export async function openEditModal({
    data,
    allCommunications,
    allGroups,
    allTags,
    clientId,
    renderCommunications,
    tokens,
}) {
    $("#actionModal")
        .off()
        .remove();

    const communication = allCommunications.filter((c) => c.id === data[0])[0];
    let selectedCategory = defaultCategories.filter(
        (category) => category.categoryName === communication.category
    );
    selectedCategory = selectedCategory[0];

    let form = $("<form>").attr("id", "actionForm");
    form.append(
        $("<div>")
            .addClass("form-row")
            .append(
                $("<div>")
                    .addClass("form-group1 col-md-6")
                    .attr("id", "fromId")
                    .append($("<label>").text("From:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .attr("name", "fromId")
                            .val(communication.fromId)
                    )
            )
            .append(
                $("<div>")
                    .addClass("form-group1 col-md-6")
                    .attr("id", "toId")
                    .append($("<label>").text("To:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .attr("name", "toId")
                            .val(communication.toId)
                    )
            )
            .append(
                $("<div>")
                    .addClass("form-group1 col-md-6")
                    .attr("id", "dateTime")
                    .append($("<label>").text("Datetime:"))
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .attr("name", "dateTime")
                            .val(awsDateTimeFormat(communication.dateTime))
                    )
            )
            .append(
                $("<div>")
                    .addClass("form-group1 col-md-6")
                    .append($("<label>").text("Tag:"))
                    .append(
                        $("<select>")
                            .attr("id", "tagId")
                            .attr("name", "tagId")
                            .addClass("form-control")
                            .append(
                                allTags.map((tag) =>
                                    $("<option>")
                                        .text(tag?.name)
                                        .val(tag?.name)
                                )
                            )
                            .val(
                                allTags.find(
                                    (t) => t.id === communication.tagId
                                )?.name
                            )
                    )
            )
    );

    form.append(
        $("<div>")
            .addClass("form-row")
            .append(
                $("<div>")
                    .addClass("form-group1 col-md-6")
                    .append(
                        $("<label>").text("Category:"),
                        $("<select>")
                            .addClass("form-control")
                            .attr("id", "category")
                            .append(
                                defaultCategories.map((category) =>
                                    $("<option>")
                                        .text(category.categoryName)
                                        .val(category.categoryName)
                                )
                            )
                            .val(selectedCategory.categoryName)
                    ),
                $("<div>")
                    .addClass("form-group1 col-md-6")
                    .append(
                        $("<label>").text("Group:"),
                        $("<input>")
                            .addClass("form-control")
                            .attr("id", "groupId")
                            .attr("type", "text")
                            .addClass("form-control")
                            .prop("disabled", true)
                            .attr("name", "groupId")

                            .val(
                                allGroups.find(
                                    (g) => g.id === communication.groupId
                                ).groupName
                            )
                    )
            )
    );

    form.append(
        $("<div>")
            .addClass("form-group1")
            .attr("id", "responseAi")
            .append($("<label>").text("Response AI:"))
            .append(
                $("<input>")
                    .attr("type", "text")
                    .attr(
                        "disabled",
                        communication.status === "Answered" ? true : false
                    )
                    .addClass("form-control")
                    .val(communication.responseAi)
            )
    );

    form.append(
        $("<div>")
            .addClass("form-group1 ")
            .attr("id", "responseAttachment")
            .append(
                $("<label>").text("Response attachment"),
                $("<div>")
                    .addClass("input-group")
                    .append(
                        $("<input>")
                            .attr("type", "text")
                            .addClass("form-control")
                            .val(communication.responseAttachment)
                            .prop("readonly", true),
                        $("<div>")
                            .addClass("input-group-append")
                            .append(
                                $("<button>")
                                    .addClass("btn")
                                    .attr("type", "button")
                                    .append(
                                        $("<i>")
                                            .addClass("fa fa-times")
                                            .css({
                                                color: "red",
                                            })
                                    )
                                    .on("click", function() {
                                        $(this)
                                            .closest(".input-group")
                                            .find("input")
                                            .val("");
                                    })
                            )
                    )
            )
    );

    form.append(
        $("<div>")
            .addClass("form-group1")
            .attr("id", "messageSubject")
            .append($("<label>").text("Message subjet:"))
            .append(
                $("<input>")
                    .attr("type", "text")
                    .addClass("form-control")
                    .prop("disabled", true)
                    .attr("name", "messageSubject")
                    .val(communication.messageSubject)
            )
    );
    form.append(
        $("<div>")
            .addClass("form-group1")
            .attr("id", "messageBody")
            .append($("<label>").text("Message Body:"))
            .append(
                $("<textarea>")
                    .addClass("form-control")
                    .prop("disabled", true)
                    .attr("name", "messageBody")
                    .val(communication.messageBody)
            )
    ); // Crea el modal con el formulario
    form.append(
        $("<div>")
            .addClass("form-group1")
            .attr("id", "responseSubject")
            .append($("<label>").text("Response Subjet:"))
            .append(
                $("<input>")
                    .attr("type", "text")
                    .attr(
                        "disabled",
                        communication.status === "Answered" ? true : false
                    )
                    .addClass("form-control")
                    .val(communication.responseSubject)
            )
    );
    form.append(
        $("<div>")
            .addClass("form-group1")
            .attr("id", "responseBody")
            .append($("<label>").text("Response Body:"))
            .append(
                $("<textarea>")
                    .attr(
                        "disabled",
                        communication.status === "Answered" ? true : false
                    )
                    .addClass("form-control")
                    .val(communication.responseBody)
            )
    );

    let modal = $("<div>")
        .addClass("modal fade")
        .attr("id", "actionModal")
        .attr("tabindex", "-1")
        .attr("role", "dialog")
        .attr("aria-labelledby", "actionModalLabel")
        .attr("aria-hidden", "true");
    let modalDialog = $("<div>")
        .addClass("modal-dialog modal-med")
        .attr("role", "document");
    let modalContent = $("<div>").addClass("modal-content");
    let modalHeader = $("<div>")
        .addClass("modal-header headerCenter")
        .append(
            $("<h3>")
                .addClass("modal-title")
                .attr("id", "actionModalLabel")
                .text("Edit")
        );
    let modalBody = $("<div>")
        .addClass("modal-body")
        .append(form);
    let modalFooter = $("<div>")
        .addClass("modal-footer")
        .append(
            $("<button>")
                .addClass("btn btn-primary")
                .text("Edit at GMAIL")
                .attr("type", "button")
                .attr("id", "gmailEditBtn")
        )
        .append(
            $("<button>")
                .addClass("btn btn-primary")
                .text("Save")
                .attr("type", "button")
                .attr("id", "saveBtn")
        )
        .append(
            $("<button>")
                .addClass("btn btn-secondary")
                .text("Cancel")
                .attr("data-dismiss", "modal")
                .attr("id", "cancelBtn")
        );
    modalContent.append(modalHeader, modalBody, modalFooter);
    modalDialog.append(modalContent);
    modal.append(modalDialog);

    $("body").append(modal);

    $("#actionModal").modal("show");

    $("#gmailEditBtn").on("click", async function() {
        const { data } = await axios.post(
            `${URL_KIDECHANNELS}/communication/send-mail-url`,
            communication,
            {
                headers: {
                    "X-Cognito-Auth": tokens.idToken,
                },
            }
        );
        window.open(data.message, "EditAtGmail");
    });
    $("#saveBtn").on("click", function(event) {
        event.preventDefault();
        $("#actionForm").submit();
    });

    $("body").one("submit", "#actionForm", async function(event) {
        event.preventDefault();

        let formData = {};

        $("#actionForm")
            .find(":input:disabled")
            .each(function() {
                let name = $(this).attr("name");
                if (name && name !== "groupId") {
                    formData[name] = $(this).val();
                }
            });
        formData = {
            ...formData,
            clientId,
            id: data[0],
            category: $("#category").val(),
            responseAttachment: $("#responseAttachment input").val(),
            responseAi: $("#responseAi input").val(),
            responseSubject: $("#responseSubject input").val(),
            responseBody: $("#responseBody textarea").val(),
            tagId: allTags.find((t) => t.name === $("#tagId").val())?.id,
            execute: communication.execute,
            status:
                $("#category").val() == communication.category
                    ? communication.status
                    : "Processing",
        };
        try {
            await client.graphql({
                query: updateCommunication,
                variables: {
                    input: formData,
                },
            });
            $("#actionModal").modal("hide");
            renderCommunications();
        } catch (error) {
            console.error("Error updating communication:", error);
        }
    });
}
