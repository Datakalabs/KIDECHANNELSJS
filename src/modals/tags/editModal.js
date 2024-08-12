import { client } from "../../utils/amplifyConfig";
import { updateCommunication, updateTag } from "../../graphql/mutations";
import { deleteTag, modifyTag } from "../../utils/postFunctions";
import { fetchCommunications } from "../../utils";

export async function openEditTagModal({ data, allTags, tokens, renderTags }) {
    try {
        const tagSelected = allTags.find((t) => t.id === data[0]),
            { sub: clientId } = tokens;
        console.log(tagSelected);
        console.log(data);
        let form = $("<form>").attr("id", "actionForm");
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
                                .val(tagSelected.name)
                        )
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
                    .text("Edit Label Name")
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
                    "Estas seguro de eliminar la etiqueta " + data[1] + "?"
                );
                if (agree) {
                    const allCommsByTagName = await fetchCommunications({
                        clientId,
                        filters: {
                            tagId: data[0],
                        },
                    });

                    await Promise.all(
                        allCommsByTagName.map(async (item) => {
                            await client.graphql({
                                query: updateCommunication,
                                variables: {
                                    input: {
                                        clientId,
                                        id: item.id,
                                        tagId: "",
                                    },
                                },
                            });
                        })
                    );
                    await deleteTag({ tokens, labelId: data[0] });

                    $("#actionModal").modal("hide");
                    renderTags();
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

            const tagName = $("#tagName").val();

            const nameAlreadyExist = allTags.filter((t) => t.name === tagName);

            if (tagName !== data[1] && nameAlreadyExist.length !== 0) {
                alert("ya existe un tag con el nombre: " + tagName);
                return;
            }

            await modifyTag({
                tokens,
                labelId: data[0],
                newLabelName: $("#tagName").val(),
            });

            $("#actionModal").modal("hide");
            renderTags();
        });
    } catch (error) {
        throw error;
    }
}
