import { client } from "../../utils/amplifyConfig";
import {
    deleteContact,
    updateCommunication,
    updateContact,
} from "../../graphql/mutations";
import { fetchCommunications } from "../../utils";

export async function openEditModal({
    data,
    allContacts,
    allGroups,
    clientId,
    renderContacts,
}) {
    try {
        const actions = allContacts.find((c) => c.id === data[4]);

        let form = $("<form>").attr("id", "actionForm");
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
                                .val(actions.contactName)
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
                                .val(actions.contactEmail)
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
                        .val(allGroups.find((g) => g.id === actions.groupId).id)
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
                    .addClass("btn btn-danger")
                    .text("Delete")
                    .attr("type", "button")
                    .attr("id", "deleteBtn")
            )
            .append($("<div>").addClass("mr-auto"))
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

        $("#actionModal").remove();
        $("body").append(modal);

        $("#actionModal").modal("show");

        $("#deleteBtn").on("click", async function() {
            try {
                const agree = confirm(
                    "Estas seguro de eliminar a " + data[0] + "?"
                );
                if (agree) {
                    const allCommsByContactName = await fetchCommunications({
                        clientId,
                        filters: {
                            contactName: data[0],
                        },
                    });

                    await Promise.all(
                        allCommsByContactName.map(async (item) => {
                            await client.graphql({
                                query: updateCommunication,
                                variables: {
                                    input: {
                                        clientId,
                                        id: item.id,
                                        contactName: "",
                                    },
                                },
                            });
                        })
                    );
                    await client.graphql({
                        query: deleteContact,
                        variables: {
                            input: { clientId, id: data[4] },
                        },
                    });

                    $("#actionModal").modal("hide");
                    renderContacts();
                }
            } catch (error) {
                console.log("Error deleting conttact", error);
                throw error;
            }
        });
        $("#saveBtn").on("click", function() {
            $("#actionForm").submit();
        });

        $("body").on("submit", "#actionForm", async function(event) {
            event.preventDefault();

            let formData = {};

            formData = {
                ...formData,
                clientId,
                id: data[4],
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

            if (
                formData.contactName !== data[0] &&
                nameAlreadyExist.length !== 0
            ) {
                alert(
                    "ya existe un contacto con el nombre: " +
                        formData.contactName
                );
                return;
            }
            if (
                formData.contactEmail !== data[1] &&
                emailAlreadyExist.length !== 0
            ) {
                alert(
                    "ya existe un contacto con el mail: " +
                        formData.contactEmail
                );
                return;
            }

            let allComms,
                existsCommWithOldMail = false;

            if (formData.contactEmail !== data[1]) {
                allComms = await fetchCommunications({
                    clientId,
                    filters: {
                        fromId: formData.contactEmail,
                    },
                    condition: "contains",
                });

                allComms.length === 0
                    ? (allComms = await fetchCommunications(
                          {
                              clientId,
                              filters: {
                                  fromId: data[1],
                              },
                              condition: "contains",
                          },
                          (existsCommWithOldMail = true)
                      ))
                    : null;
            } else {
                allComms = await fetchCommunications({
                    clientId,
                    filters: {
                        contactName: data[0],
                    },
                });
            }

            await Promise.all(
                allComms.map(async (item) => {
                    await client.graphql({
                        query: updateCommunication,
                        variables: {
                            input: {
                                clientId,
                                id: item.id,
                                groupId: formData.groupId,
                                contactName: existsCommWithOldMail
                                    ? ""
                                    : formData.contactName,
                            },
                        },
                    });
                })
            );

            await client.graphql({
                query: updateContact,
                variables: {
                    input: formData,
                },
            });
            $("#actionModal").modal("hide");
            renderContacts();
        });
    } catch (error) {
        throw error;
    }
}
