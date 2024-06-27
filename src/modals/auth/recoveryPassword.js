export async function openRecoveryPasswordModal({
    confirmResetPassword,
    username,
}) {
    try {
        let form = $("<form>").attr("id", "createForm");
        form.append(
            $("<div>")
                .addClass("form-row")
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "codeDiv")
                        .append($("<label>").text("Verification code:"))
                        .append(
                            $("<input>")
                                .attr("type", "text")
                                .addClass("form-control")
                                .attr("id", "code")
                        )
                )
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-6")
                        .attr("id", "newDiv")
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
                        .attr("id", "repeatDiv")
                        .append($("<label>").text("Repeat Password"))
                        .append(
                            $("<input>")
                                .attr("type", "password")
                                .addClass("form-control")
                                .attr("id", "repeatPass")
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
                    .text("Recovery Password")
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
            $("#createForm").submit();
        });

        $("#createForm").on("submit", async function(event) {
            event.preventDefault();
            const confirmationCode = $("#code").val(),
                newPassword = $("#newPass").val(),
                repeatPassword = $("#repeatPass").val();
            try {
                if (newPassword !== repeatPassword) {
                    alert("Passwords do not match. Please re-enter.");
                    return;
                }
                if (!confirmationCode) {
                    alert("Please enter code.");
                    return;
                }

                await confirmResetPassword({
                    username,
                    confirmationCode,
                    newPassword,
                });
                alert("Password changed successfully");
                $("#createModal").modal("hide");
                window.location.href = "/login.html";
            } catch (error) {
                alert(error.message);
                throw error;
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
