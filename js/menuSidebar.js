import { getUserInfo, logout } from "./authentication";

(async function ($) {
    fetch("menuSidebar.html")
        .then((response) => response.text())
        .then(async (data) => {
            document.getElementById("sideBar").innerHTML = data;
            const logoutButton = document.getElementById("logout-button");
            if (logoutButton) {
                logoutButton.addEventListener("click", async (e) => {
                    e.preventDefault();

                    try {
                        await logout();
                        window.location.href = "/login.html";
                    } catch (error) {
                        console.error("Error during logout:", error);
                    }
                });
            }
            const response = await getUserInfo();
            if (response) {
                const userNameElements = document.querySelectorAll(".name");
                userNameElements?.forEach((element) => {
                    element.innerHTML = `${response.name} ${response.family_name}`;
                });
            }

            function getInitials() {
                const initials = `${response.name} ${response.family_name}`
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("");
                return initials.toUpperCase();
            }
            const dynamicIcon = document.getElementById("dynamic-icon");
            dynamicIcon.textContent = getInitials();
        })
        .catch((error) => {
            window.location.href = "/login.html";
            console.error("Error loading content:", error);
        });

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
    window.setCommunicationsCount = setCommunicationsCount;
})();
