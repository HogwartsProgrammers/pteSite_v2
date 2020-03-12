module.exports = {
    path: () => {
        if (!Number(process.env.ON_SERVER)) {
            return 'http://localhost:3000/'
        } else {
            return 'http://v48534.hostde18.fornex.host/'
        }
    },
    year: new Date().getFullYear()
}