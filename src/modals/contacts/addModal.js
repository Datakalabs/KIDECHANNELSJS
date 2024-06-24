import { client } from "../../utils/amplifyConfig";
import { createContact, updateCommunication } from "../../graphql/mutations";
import { fetchCommunications } from "../../utils";

export async function openAddModal({
    allContacts,
    allGroups,
    clientId,
    renderContacts,
}) {
    try {
        let form = $("<form>").attr("id", "createForm");
        form.append(
            $("<div>")
                .addClass("form-row")
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "nameDiv")
                        .append($("<label>").text("Name:"))
                        .append(
                            $("<input>")
                                .attr("type", "text")
                                .addClass("form-control")
                                .attr("id", "contactName")
                        )
                )
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "emailDiv")
                        .append($("<label>").text("Email:"))
                        .append(
                            $("<input>")
                                .attr("type", "text")
                                .addClass("form-control")
                                .attr("id", "email")
                        )
                )
        );

        form.append(
            $("<div>")
                .addClass("form-group1 col-md-6")
                .append(
                    $("<label>").text("Group:"),
                    $("<select>")
                        .addClass("form-control")
                        .attr("id", "group")
                        .append(
                            allGroups.map((group) =>
                                $("<option>")
                                    .text(group.groupName)
                                    .val(group.id)
                            )
                        )
                )
        );

        let modal = $("<div>")
            .addClass("modal fade")
            .attr("id", "createModal")
            .attr("tabindex", "-1")
            .attr("role", "dialog")
            .attr("aria-labelledby", "createModalLabel")
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
                    .attr("id", "createModalLabel")
                    .text("Create Contact")
            );
        let modalBody = $("<div>")
            .addClass("modal-body")
            .append(form);
        let modalFooter = $("<div>")
            .addClass("modal-footer")
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

        $("#createModal").remove();
        $("body").append(modal);

        $("#createModal").modal("show");

        $("#saveBtn").on("click", function() {
            $("#createForm").submit();
        });

        $("#createForm").on("submit", async function(event) {
            event.preventDefault();

            let formData = {
                clientId,
                contactName: $("#contactName").val(),
                contactEmail: $("#email").val(),
                groupId: $("#group").val(),
            };
            const nameAlreadyExist = allContacts.filter(
                (c) => c.contactName === formData.contactName
            );
            const emailAlreadyExist = allContacts.filter(
                (c) => c.contactEmail === formData.contactEmail
            );

            if (nameAlreadyExist.length !== 0) {
                alert(
                    "ya existe un contacto con el nombre: " +
                        formData.contactName
                );
                return;
            }
            if (emailAlreadyExist.length !== 0) {
                alert(
                    "ya existe un contacto con el mail: " +
                        formData.contactEmail
                );
                return;
            }
            const allCommsByContactName = await fetchCommunications({
                clientId,
                filters: {
                    fromId: formData.contactEmail,
                },
                condition: "contains",
            });

            await Promise.all(
                allCommsByContactName.map(async (item) => {
                    await client.graphql({
                        query: updateCommunication,
                        variables: {
                            input: {
                                clientId,
                                id: item.id,
                                groupId: formData.groupId,
                                contactName: formData.contactName,
                            },
                        },
                    });
                })
            );

            await client.graphql({
                query: createContact,
                variables: {
                    input: formData,
                },
            });
            $("#createModal").modal("hide");
            renderContacts();
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
