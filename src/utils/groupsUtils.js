export const groupColors = [
    {
        group_line: "rgba(0,181,233,0.9)",
        bg: "rgba(0,181,233,0.2)",
        class: "dot dot--blue",
    },
    {
        group_line: "rgba(0,173,95,0.9)",
        bg: "rgba(0,173,95,0.2)",
        class: "dot dot--green",
    },
    {
        group_line: "rgba(255,99,132,0.9)",
        bg: "rgba(255,99,132,0.2)",
        class: "dot dot--red",
    },
    {
        group_line: "rgba(255,159,64,0.9)",
        bg: "rgba(255,159,64,0.2)",
        class: "dot dot--orange",
    },
    {
        group_line: "rgba(75,192,192,0.9)",
        bg: "rgba(75,192,192,0.2)",
        class: "dot dot--turquoise",
    },
    {
        group_line: "rgba(153,102,255,0.9)",
        bg: "rgba(153,102,255,0.2)",
        class: "dot dot--purple",
    },
    {
        group_line: "rgba(255,205,86,0.9)",
        bg: "rgba(255,205,86,0.2)",
        class: "dot dot--yellow",
    },
];

export const renderGroupListInSidebar = ({ allGroups }) => {
    const ul2 = document.querySelector(".js-sub-list");
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
            a.href = `groups.html?${selectedGroupName}`;
        });
    });
};
