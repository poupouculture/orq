export const numberFormat = (number: Number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}