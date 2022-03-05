export const url = (id: number): string => {
    return `http://${process.env.REACT_APP_SERVER_NAME}/document/` + id
}