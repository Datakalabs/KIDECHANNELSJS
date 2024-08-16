import DOMPurify from "dompurify"; // Asegúrate de instalar y importar DOMPurify

const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

const replaceLinksWithImages = (html) => {
    // Asegúrate de decodificar entidades HTML
    html = decodeHtml(html);

    // Reemplaza los enlaces por imágenes si la URL apunta a una imagen
    return html.replace(/<a\s+href="([^"]+)">([^<]*)<\/a>/gi, (match, url) => {
        const isImage = /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(url);
        if (isImage) {
            return `<img src="${url}" alt="Image" />`;
        }
        return match;
    });
};

export const renderBody = ({ body, mimeType }) => {
    let content = "";

    if (mimeType === "text/html") {
        content = replaceLinksWithImages(body);
    } else if (mimeType === "text/plain") {
        // Convierte texto plano a HTML y luego reemplaza enlaces con imágenes
        const html = $("<div>")
            .text(body)
            .html();
        content = replaceLinksWithImages(html);
    } else {
        console.warn("Unsupported mimeType:", mimeType);
    }

    return content;
};
export const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date
        .getDate()
        .toString()
        .padStart(2, "0");
    const hour = date
        .getHours()
        .toString()
        .padStart(2, "0");
    const minutes = date
        .getMinutes()
        .toString()
        .padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day} ${hour}:${minutes}`;
    return formattedDateTime;
};

export const awsDateTimeFormat = (dateTimeString) => {
    const parts = dateTimeString.split(" ");
    const datePart = parts[0];
    const timePart = parts[1];

    const [year, month, day] = datePart.split("-");
    const [hour, minutes] = timePart.split(":");

    const awsDateTime = `${year}-${month}-${day}T${hour}:${minutes}:00.000Z`;
    return awsDateTime;
};
