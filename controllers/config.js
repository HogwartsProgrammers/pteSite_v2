module.exports = {
    path: () => {
        if (Number(process.env.ON_SERVER)) {
            return 'http://localhost:3000/'
        } else {
            return 'https://proftechengineering.ru/'
        }
    },
    year: new Date().getFullYear()
}