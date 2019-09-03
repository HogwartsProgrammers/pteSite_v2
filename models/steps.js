const db = require('./database')

module.exports = class Steps {
    constructor(
        id,
        pipe_id = 0,
        title = '',
        active = 1,
        parents = null,
        vis_data = null
        ) {
        this.id = id
        this.pipe_id = pipe_id
        this.title = title
        this.active = active
        this.parents = parents
        this.vis_data = vis_data
    }

    saveStep() {
        return db.execute(
            'INSERT INTO steps (title, pipe_id, vis_data) VALUES (?, ?, ?)', [this.title, this.pipe_id, JSON.stringify(this.vis_data)]
        )
    }

    updateStep() {
        return db.execute(
            'UPDATE steps SET title= ?, parents= ?, vis_data= ? WHERE id= ? LIMIT 1', [this.title, this.parents, JSON.stringify(this.vis_data), this.id]
        )
    }

    deleteStep() {
        return db.execute(
            'UPDATE steps SET active= ? WHERE id= ? LIMIT 1', [this.active, this.id]
        )
    }

    fetchAll() {
        return db.execute('SELECT * FROM steps WHERE active= 1')
    }
    
    static fetchAllById(id) {
        return db.execute('SELECT * FROM steps WHERE pipe_id= ? AND active= 1', [id])
    }

    // findOne(login) {
    //     return db.execute('SELECT * FROM users WHERE login = ? LIMIT 1', [login])
    // }

    findById(id) {
        return db.execute('SELECT * FROM steps WHERE id = ? LIMIT 1', [id])
    }

    findData(id) {
        return {
            pipe: db.execute('SELECT * FROM pipes WHERE id = ? LIMIT 1', [id]),
            steps: db.execute('SELECT * FROM steps WHERE pipe_id = ?', [id])
        }
    }
}