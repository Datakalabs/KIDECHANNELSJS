const path = require("path");

module.exports = {
    entry: {
        main: "./js/main.js",
        loginLogout: "./js/auth/loginLogout.js",
        verifyMmail: "./js/auth/verifyMail.js",
        forgetPass: "./js/auth/forgetPass.js",
        authentication: "./js/authentication.js",
        authorizations: "./js/authorizations.js",
        groups: "./js/groups.js",
        groupsConfig: "./js/groupsConfig.js",
        menuSidebar: "./js/menuSidebar.js",
        rightMenuSidebar: "./js/rightMenuSidebar.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    mode: "development", // Puedes configurar el modo a 'production' si estás listo para producción
    // Aquí puedes agregar otras configuraciones según sea necesario
};
