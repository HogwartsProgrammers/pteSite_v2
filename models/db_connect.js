const os = require('os')

module.exports = () => {
    if (true) {
        console.log(os.hostname())
        switch(os.hostname()) {
            case 'MB-ASER': return {
                host: 'localhost',
                user: 'root',
                database: 'pte',
                password: '26091940'
            }
            case 'DESKTOP-BU7H8H4': return {
                host: 'localhost',
                user: 'root',
                database: 'pte',
                password: '26091940'
            }
            case 'MBASER': return {
                host: 'localhost',
                user: 'root',
                database: 'pte',
                password: '26091940'
            }
            default: return {
                host: 'fr79263q.beget.tech',
                user: 'fr79263q_node',
                database: 'fr79263q_node',
                password: '*U0QcVQ8'
            }
        }
        
    } else {
        return {
            host: 'localhost',
            user: 'v48534_pte_user',
            database: 'v48534_pte',
            password: 'I3_4fG)Wi]8p'
        }
    }
}