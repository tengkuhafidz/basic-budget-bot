export const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-uk', { day: "numeric", month: "short", year: "numeric" })
}