module.exports = {
    path: () => {
        if (true) {
            return 'http://localhost:3000/'
        } else {
            return 'https://proftechengineering.ru/'
        }
    },
    year: new Date().getFullYear()
}