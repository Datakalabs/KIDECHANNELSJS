const { login, getUserInfo } = require("../authentication");

(async () => {
    document.addEventListener("DOMContentLoaded", async () => {
        const loginForm = document.getElementById("login-form");
        try {
            const userData = await getUserInfo();
            if (window.location.pathname === "/login.html" && userData) {
                window.location.href = "/index.html";
            }
        } catch (error) {
            if (loginForm) {
                loginForm.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    const username = document.getElementById("username").value;
                    const password = document.getElementById("password").value;
                    try {
                        const data = await login({ username, password });
                        if (data === "Successfully logged in") {
                            window.location.href = "/index.html";
                        }
                    } catch (error) {
                        console.log(error);
                        window.alert(error.message);
                    }
                });
            }
        }
    });
})();
