import DOMPurify from "dompurify";

// Función para reemplazar enlaces de imágenes por etiquetas <img>
const replaceLinksWithImages = (html) => {
    // Expresión regular para encontrar URLs entre < y >

    const imageRegex = /&lt;https:\/\/[^\s;]+;/gi;
    console.log(html, typeof html);
    // Reemplaza URLs con etiquetas <img>
    const final = html.replace(imageRegex, (url) => {
        // Eliminar los caracteres de ángulo (< y >) de la URL
        const cleanUrl = url.slice(4, -4);
        return `<img src="${cleanUrl}" alt="Image" />`;
    });

    return final;
};

const replaceNewLinesWithBreaks = (text) => {
    // Reemplaza saltos de línea que estén entre contenido con <br>
    return text.replace(/([^\s])\n([^\s])/g, "$1<br>$2");
};

export const renderBody = ({ body, mimeType }) => {
    let content = "";

    if (mimeType === "text/html") {
        const sanitizedHtml = DOMPurify.sanitize(body);
        const formattedHtml = replaceNewLinesWithBreaks(sanitizedHtml);
        content = replaceLinksWithImages(formattedHtml);
    } else if (mimeType === "text/plain") {
        // Convirtiendo texto plano a HTML para aplicar reemplazos
        const html = $("<div>")
            .text(body)
            .html();
        const sanitizedHtml = DOMPurify.sanitize(html);
        const formattedHtml = replaceNewLinesWithBreaks(sanitizedHtml);
        content = replaceLinksWithImages(formattedHtml);
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
