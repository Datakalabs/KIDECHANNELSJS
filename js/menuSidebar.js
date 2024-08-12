import { getUserInfo, logout } from "./authentication";

(async function($) {
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

export const renderTagListInSidebar = ({ allTags }) => {
    const ul2 = document.querySelector(".taglist");
    ul2.innerHTML = "";
    allTags.forEach((t) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const icon = document.createElement("i");
        a.classList.add("showTable");
        icon.classList.add("fas", "fa-tags");
        a.appendChild(icon);
        a.appendChild(document.createTextNode(t.name));
        li.appendChild(a);
        ul2.appendChild(li);
        a.addEventListener("click", async function(event) {
            event.preventDefault();
            const selectedGroupName = t.name;
            a.href = `tables.html?Tags?${selectedGroupName}`;
        });
    });
};

export const renderGroupListInSidebar = ({ allGroups }) => {
    const ul2 = document.querySelector(".grouplist");
    ul2.innerHTML = "";
    allGroups.forEach((g) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const icon = document.createElement("i");
        a.classList.add("showTable");
        icon.classList.add("fas", "fa-tags");
        a.appendChild(icon);
        a.appendChild(document.createTextNode(g.groupName));
        li.appendChild(a);
        ul2.appendChild(li);
        a.addEventListener("click", async function(event) {
            event.preventDefault();
            const selectedGroupName = g.groupName;
            a.href = `tables.html?Groups?${selectedGroupName}`;
        });
    });
};
