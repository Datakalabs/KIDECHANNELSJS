import axios from "axios";
import { URL_KIDECHANNELS } from "../secrets";
import { refreshAndGetTokens } from "./authentication";
import { renderGroupListInSidebar } from "../src/utils/groupsUtils";
import { fetchGroups } from "../src/utils";

const { tokens, userSub } = await refreshAndGetTokens();

let clientId = userSub;
(async function($) {
    async function handleFormSubmit(event) {
        event.preventDefault();
        try {
            const { data } = await axios.get(
                `${URL_KIDECHANNELS}/google-auth-webhook`,
                {
                    headers: {
                        "X-Cognito-Auth": tokens.idToken,
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

    document
        .getElementById("gmail-auth")
        .addEventListener("submit", handleFormSubmit);
    const allGroups = await fetchGroups({ clientId });
    renderGroupListInSidebar({ allGroups });
})();
