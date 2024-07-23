import { getDefaultCategoriesConfiguration } from "../../utils/defaultCategories";
import { client } from "../../utils/amplifyConfig";
import { createGroup } from "../../graphql/mutations";
export async function openFirstLoginModal({ confirmSignIn, getCurrentUser }) {
    try {
        let form = $("<form>").attr("id", "loginForm");
        form.append(
            $("<div>")
                .addClass("form-row")
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "newPassDiv")
                        .append($("<label>").text("New Password:"))
                        .append(
                            $("<input>")
                                .attr("type", "password")
                                .addClass("form-control")
                                .attr("id", "newPass")
                        )
                )
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "repeatPassDiv")
                        .append($("<label>").text("Repeat Password:"))
                        .append(
                            $("<input>")
                                .attr("type", "password")
                                .addClass("form-control")
                                .attr("id", "repeatPass")
                        )
                ),
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
                                .attr("id", "nameInput")
                        )
                )
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "surnameDiv")
                        .append($("<label>").text("Surname:"))
                        .append(
                            $("<input>")
                                .attr("type", "text")
                                .addClass("form-control")
                                .attr("id", "surnameInput")
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
                    .text("First Login")
            );
        let modalBody = $("<div>")
            .addClass("modal-body")
            .append(form);
        let modalFooter = $("<div>")
            .addClass("modal-footer")
            .append(
                $("<button>")
                    .addClass("btn btn-primary")
                    .text("Send")
                    .attr("type", "button")
                    .attr("id", "sendBtn")
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

        $("#sendBtn").on("click", function() {
            $("#loginForm").submit();
        });

        $("#loginForm").on("submit", async function(event) {
            event.preventDefault();

            const newPassword = $("#newPass").val();
            const repeatPassword = $("#repeatPass").val();
            const name = $("#nameInput").val();
            const surname = $("#surnameInput").val();

            if (newPassword !== repeatPassword) {
                alert("Passwords do not match. Please re-enter.");
                return;
            }
            if (!name || !surname) {
                !name && alert("Please enter your name.");
                !surname && alert("Please enter your surname.");

                return;
            }

            try {
                const data = await confirmSignIn({
                    challengeResponse: newPassword,
                    options: {
                        userAttributes: {
                            name,
                            family_name: surname,
                        },
                        friendlyDeviceName: "kideChannel",
                    },
                });
                const userData = await getCurrentUser();
                if (data) {
                    await client.graphql({
                        query: createGroup,
                        variables: {
                            input: {
                                clientId: userData.userId,
                                groupName: "Ungroup",
                                categoriesConfig: JSON.stringify(
                                    getDefaultCategoriesConfiguration()
                                ),
                                color: "#00000",
                            },
                        },
                    });
                    window.location.href = "/index.html";
                }
            } catch (error) {
                console.error("Error:", error);
                throw new Error(`Error setting new password: ${error}`);
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
