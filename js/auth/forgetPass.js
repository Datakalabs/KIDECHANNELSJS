const { recoveryPassword } = require("../authentication");

(async () => {
    document.addEventListener("DOMContentLoaded", () => {
        const forgetPass = document.getElementById("forget-pass");
        if (forgetPass) {
            forgetPass.addEventListener("submit", async (e) => {
                e.preventDefault();
                const username = document.getElementById("recoverPasswordEmail")
                    .value;
                if (username) {
                    await recoveryPassword({ username });
                }
            });
        }
    });
})();
