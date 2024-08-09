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

export const getColorObj = (hex) => {
    // Convierte el color de 5 dígitos a 6 dígitos
    console.log("HEX", hex);
    if (hex.length === 6) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    let percent = 0.77; // Porcentaje para aclarar el color
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));

    return {
        group_line: hex,
        bg: `rgba(${r}, ${g}, ${b}, 1)`,
        class: "dot",
    };
};
