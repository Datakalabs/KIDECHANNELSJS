import { getUserInfo } from "./authentication";

(function($) {
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
    window.getUserName = getUserName;
})();
