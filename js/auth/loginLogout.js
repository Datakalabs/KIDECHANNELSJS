const { logout, login, getUserInfo } = require("../authentication");

(async () => {
    document.addEventListener("DOMContentLoaded", async () => {
        const logoutButton = document.getElementById("logout-button");
        const loginForm = document.getElementById("login-form");
        // try {
        //     const userData = await getUserInfo();
        //     console.log(window.location);
        //     // window.location.href = "/index.html";
        // } catch (error) {
        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;

                const data = await login({ username, password });
                if (data === "Successfully logged in") {
                    window.location.href = "/index.html";
                }
            });
        }
        // }

        if (logoutButton) {
            logoutButton.addEventListener("click", async (e) => {
                e.preventDefault();
                console.log(e);

                try {
                    await logout();
                    window.location.href = "/login.html";
                } catch (error) {
                    console.error("Error during logout:", error);
                }
            });
        }
    });
})();
