import { defaultCategories } from "./defaultCategories";

// Función para crear un badge
export function createBadge(category, text) {
    const categ = defaultCategories.filter(
        (c) => c.categoryName === category
    )[0];

    const div = document.createElement("div");

    div.innerHTML = `<span class="badge ${categ.badgeClass}">${categ.categoryName}</span>`;
    return text
        ? `<span class="badge ${categ.badgeClass}">${categ.categoryName}</span>`
        : div;
}
// Función para crear un contenedor de botones
export function createButtonContainer(className, icon, full) {
    const container = document.createElement("div");
    container.className = `${className} d-flex justify-content-center`;
    container.innerHTML = `<button class="btn ${
        full ? "btn-primary" : "btn-outline-primary"
    }" style="margin-right: 5px;"><i class="fas fa-${icon}"></i></button>`;
    return container;
}
// Función para crear una div con contenido
export function createDiv(content) {
    const div = document.createElement("div");
    div.innerHTML = content;
    return div;
}

export function updateDataTable(dataTable, data) {
    dataTable.clear();
    dataTable.rows.add(data);
    dataTable.draw(false);
}
