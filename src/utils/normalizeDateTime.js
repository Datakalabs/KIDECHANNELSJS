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
