import axios from "axios";
import { URL_KIDECHANNELS } from "../secrets";
import { refreshAndGetTokens } from "./authentication";
import { fetchGroups, fetchCommunications, getSync } from "../src/utils";
import { renderGroupListInSidebar } from "./menuSidebar";

const { tokens, userSub } = await refreshAndGetTokens();

let clientId = userSub;
(async function($) {
    try {
        const allCommunications = await fetchCommunications({ clientId });

        const alreadySync = await getSync({ tokens });
        const gmailForm = document.getElementById("gmail-auth");
        const gmailButton = document.getElementById("gmailButton");
        if (alreadySync) {
            gmailButton.classList.remove("au-btn--red");
            gmailButton.classList.add("btn-disabled");
            gmailButton.textContent = "UNLINK GOOGLE";
            gmailForm.addEventListener("submit", unlinkGoogle);
        } else {
            gmailForm.addEventListener("submit", handleFormSubmit);
        }

        const allGroups = await fetchGroups({ clientId });
        renderGroupListInSidebar({ allGroups });
        window.setCommunicationsCount({ allCommunications });

        async function unlinkGoogle(event) {
            event.preventDefault();
            try {
                const { data } = await axios.post(
                    `${URL_KIDECHANNELS}/google/user-delete`,
                    {
                        email: tokens.idToken.payload.email,
                    },
                    {
                        headers: {
                            Authorization: tokens.idToken,
                        },
                    }
                );
                console.log(data);
                if (data) {
                    location.reload();
                }
            } catch (error) {
                console.error("Error to handle form:", error);
            }
        }

        async function handleFormSubmit(event) {
            event.preventDefault();
            try {
                const { data } = await axios.get(
                    `${URL_KIDECHANNELS}/google-auth-webhook`,
                    {
                        headers: {
                            Authorization: tokens.idToken,
                        },
                    }
                );
                if (data.message) {
                    openAuthorizationWindow(data.message);
                } else {
                    console.error(
                        "URL de Gmail no encontrada en la respuesta",
                        data
                    );
                }
            } catch (error) {
                console.error("Error to handle form:", error);
            }
        }

        function openAuthorizationWindow(url) {
            console.log(url);
            const nuevaVentana = window.open(
                url,
                "Authorizacion",
                "width=800,height=600,_blank"
            );

            const chequeoVentana = setInterval(async () => {
                if (nuevaVentana.closed) {
                    clearInterval(chequeoVentana);
                    location.reload();
                }
            }, 1000);
        }
    } catch (error) {
        console.log(error);
    }
})();
