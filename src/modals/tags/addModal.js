import { createTag } from "../../utils/postFunctions";

export async function openAddTagModal({ allTags, tokens, renderTags }) {
    try {
        let form = $("<form>").attr("id", "createForm");
        form.append(
            $("<div>")
                .addClass("form-row")
                .append(
                    $("<div>")
                        .addClass("form-group1 col-md-12")
                        .attr("id", "nameDiv")
                        .append($("<label>").text("Name:"))
                        .append(
                            $("<input>")
                                .attr("type", "text")
                                .addClass("form-control")
                                .attr("id", "tagName")
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
                    .text("Create Tag")
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

            const tagName = $("#tagName").val();

            const nameAlreadyExist = allTags.filter((c) => c.name === tagName);

            if (nameAlreadyExist.length !== 0) {
                alert("ya existe un tag con el nombre: " + tagName);
                return;
            }

            await createTag({ tokens, labelName: tagName });
            $("#createModal").modal("hide");
            renderTags();
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
