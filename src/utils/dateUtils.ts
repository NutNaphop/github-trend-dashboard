export const formatToLocalISO = (dateObj: Date): string => {
    const tzOffsetInMs = dateObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dateObj.getTime() - tzOffsetInMs);

    return localDate.toISOString().split('T')[0];
};