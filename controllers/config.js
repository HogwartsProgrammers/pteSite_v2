module.exports = {
    path: () => {
        if (false) {
            return 'http://localhost:3000/'
        } else {
            return 'https://proftechengineering.ru/'
        }
    },
    year: new Date().getFullYear()
}