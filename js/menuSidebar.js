import { getUserInfo } from "./authentication";

(function($) {
    document.addEventListener("DOMContentLoaded", () => {
        fetch("MenuSidebar.html")
            .then((response) => response.text())
            .then((data) => {
                document.getElementById("sideBar").innerHTML = data;
            })
            .catch((error) => console.error("Error loading content:", error));
    });

    async function getUserName() {
        try {
            // document.addEventListener('DOMContentLoaded', async () => {
            const response = await getUserInfo();
            if (response) {
                const userNameElements = document.querySelectorAll(".name");
                userNameElements?.forEach((element) => {
                    element.innerHTML = `${response.name} ${response.family_name}`;
                });
                return response;
            }
            // })
        } catch (error) {
            console.log(error);
        }
    }
    function setCommunicationsCount({ allCommunications }) {
        try {
            const span = document.querySelector(".inbox-num");
            span.innerHTML = allCommunications.filter(
                (c) => c.status !== "Answered"
            ).length;
        } catch (error) {
            console.log(error);
        }
    }
    window.getUserName = getUserName;
    window.setCommunicationsCount = setCommunicationsCount;
})();
