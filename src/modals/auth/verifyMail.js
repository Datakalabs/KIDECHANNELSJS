import { verifyEmail } from "../../../js/authentication";

export async function openVerifyMailModal({ confirmUserAttribute }) {
    try {
        let form = $("<form>")
            .attr("id", "createForm")
            .addClass("w-100");
        form.append(
            $("<div>")
                .addClass(
                    "form-row w-100 d-flex align-items-center justify-content-between"
                )
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-8")
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
                        .addClass("ml-3 d-flex mt-4 justify-content-end")
                        .append(
                            $("<button>")
                                .addClass("btn btn-primary mr-2")
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
                    .text("Verify Email")
            );
        let modalBody = $("<div>")
            .addClass(
                "modal-body d-flex align-items-center justify-content-between"
            )
            .append(form);
        let modalFooter = $("<div>").addClass("modal-footer");

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
            try {
                if ($("#code").val()) {
                    await confirmUserAttribute({
                        userAttributeKey: "email",
                        confirmationCode: $("#code").val(),
                    });
                }
                $("#createModal").modal("hide");

                alert("Email has been verified");
                location.reload();
            } catch (error) {
                throw error;
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
