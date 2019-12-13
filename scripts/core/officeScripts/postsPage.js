export function init() {
    // делать активным и неактивным пост с помощью switch
    document.querySelectorAll('.operations input').forEach(el => {
        el.onclick = () => {
            fetch('/office/posts/update', {
                method: 'POST',
                body: JSON.stringify({
                    id: el.dataset.uid,
                    active: el.checked ? 1 : 0,
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{"Content-Type": "application/json"}
            })
        }
    })

    // показывать неактивные посты с помощью switch
    const switchShow = document.querySelector('#showInactive input')
    const tr = document.querySelectorAll('tbody tr')
    switchShow.onclick = () => {
        if (switchShow.checked) {
            tr.forEach(el => { 
                if (el.classList.contains('d-hide')) el.classList.remove('d-hide')
            })
        } else {
            tr.forEach(el => {
                if (!el.querySelector('td:nth-child(4) input').checked) el.classList.add('d-hide')
            })
        }
    }

    // функционал удаления пользователя из поста
    document.querySelectorAll('.users .form-autocomplete').forEach(autoComplete => {
        if (!autoComplete.dataset.data) return
        const post = JSON.parse(autoComplete.dataset.data)
        const initClear = () => {
            autoComplete.querySelectorAll('.chip').forEach(chip => chip.querySelector('a').onclick = () => {
                chip.remove()
                const index = post.users.split(',').indexOf(chip.dataset.id)
                post.users = post.users.split(',')
                post.users.splice(index, 1)
                post.users = post.users.join(',')
                fetch('/office/posts/update', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: post.id,
                        users: post.users,
                        _csrf: document.getElementById('csrfToken').value
                    }), 
                    headers:{"Content-Type": "application/json"}
                })
            })
        }
        initClear()
        const sugetion = autoComplete.querySelector('ul') 

        //функционал поиска и добавления
        autoComplete.querySelector('input').oninput = async (event) => {
            if (!event.target.value.trim().length) return sugetion.innerHTML = ''
            const users = await fetch('/office/users', {
                method: 'POST',
                body: JSON.stringify({
                    find: 'search',
                    fio: event.target.value.trim(),
                    _csrf: document.getElementById('csrfToken').value
                }),
                headers:{"Content-Type": "application/json"}
            }).then(data => data.json())
            if (!users.length) return sugetion.innerHTML = ''
            sugetion.innerHTML = ''
            users.forEach(user => {
                if (post.users.split(',').find(uid => uid == user.id)) return
                const li = document.createElement('li')
                li.classList.add('menu-item')
                li.innerHTML = `
                <a>
                    <div class="tile tile-centered">
                        <div class="tile-content">${user.fio}</div>
                    </div>
                </a>`
                li.querySelector('a').onclick = () => {
                    sugetion.innerHTML = ''
                    event.target.value = ''
                    const chip = document.createElement('span')
                    chip.classList.add('chip')
                    chip.dataset.id = user.id
                    chip.innerHTML = `${user.fio}<a class="btn btn-clear"></a>`
                    autoComplete.querySelector('.chips').insertAdjacentElement('beforeend', chip)
                    initClear()
                    post.users = post.users.length ? post.users.split(',') : []
                    post.users.push(user.id)
                    post.users = post.users.join(',')
                    fetch('/office/posts/update', {
                        method: 'POST',
                        body: JSON.stringify({
                            id: post.id,
                            users: post.users,
                            _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{"Content-Type": "application/json"}
                    })
                }
                sugetion.insertAdjacentElement('beforeend', li)
            })
        }
        autoComplete.removeAttribute('data-data')
    })

    // функционал удаления статистики из поста
    document.querySelectorAll('.stats .form-autocomplete').forEach(autoComplete => {
        if (!autoComplete.dataset.data) return
        const post = JSON.parse(autoComplete.dataset.data)
        const initClear = () => {
            autoComplete.querySelectorAll('.chip').forEach(chip => chip.querySelector('a').onclick = () => {
                chip.remove()
                const index = post.stat_id.split(',').indexOf(chip.dataset.id)
                post.stat_id = post.stat_id.split(',')
                post.stat_id.splice(index, 1)
                post.stat_id = post.stat_id.join(',')
                fetch('/office/posts/update', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: post.id,
                        stat_id: post.stat_id,
                        _csrf: document.getElementById('csrfToken').value
                    }), 
                    headers:{"Content-Type": "application/json"}
                })
            })
        }
        initClear()
        const sugetion = autoComplete.querySelector('ul') 

        //функционал поиска и добавления
        autoComplete.querySelector('input').oninput = async (event) => {
            if (!event.target.value.trim().length) return sugetion.innerHTML = ''
            const stats = await fetch('/office/stats', {
                method: 'POST',
                body: JSON.stringify({
                    find: 'search',
                    title: event.target.value.trim(),
                    _csrf: document.getElementById('csrfToken').value
                }),
                headers:{"Content-Type": "application/json"}
            }).then(data => data.json())
            if (!stats.length) return sugetion.innerHTML = ''
            sugetion.innerHTML = ''
            stats.forEach(stat => {
                if (post.stat_id.split(',').find(sid => sid == stat.id)) return
                const li = document.createElement('li')
                li.classList.add('menu-item')
                li.innerHTML = `
                <a>
                    <div class="tile tile-centered">
                        <div class="tile-content">${stat.title}</div>
                    </div>
                </a>`
                li.querySelector('a').onclick = () => {
                    sugetion.innerHTML = ''
                    event.target.value = ''
                    const chip = document.createElement('span')
                    chip.classList.add('chip')
                    chip.dataset.id = stat.id
                    chip.innerHTML = `${stat.title}<a class="btn btn-clear"></a>`
                    autoComplete.querySelector('.chips').insertAdjacentElement('beforeend', chip)
                    initClear()
                    post.stat_id = post.stat_id.length ? post.stat_id.split(',') : []
                    post.stat_id.push(stat.id)
                    post.stat_id = post.stat_id.join(',')
                    fetch('/office/posts/update', {
                        method: 'POST',
                        body: JSON.stringify({
                            id: post.id,
                            stat_id: post.stat_id,
                            _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{"Content-Type": "application/json"}
                    })
                }
                sugetion.insertAdjacentElement('beforeend', li)
            })
        }
        autoComplete.removeAttribute('data-data')
    })

    //функционал изменения названия поста
    document.querySelectorAll('table tbody tr td:first-child').forEach(td => {
        if (!td.dataset.data) return
        const post = JSON.parse(td.dataset.data)
        td.onkeydown = (event) => {
            if (event.code == 'Enter') {
                event.preventDefault()
                td.blur()
            }
        }
        td.onblur = () => {
            fetch('/office/posts/update', {
                method: 'POST',
                body: JSON.stringify({
                    id: post.id,
                    title: td.innerText.trim(),
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{"Content-Type": "application/json"}
            })
        }
        td.removeAttribute('data-data')
    })

    // функционал добавления поста
    document.getElementById('addPost').onclick = async () => {
        const pId = await fetch('/office/posts/update', {
            method: 'POST',
            body: JSON.stringify({
                _csrf: document.getElementById('csrfToken').value
            }),
            headers:{"Content-Type": "application/json"}
        }).then(data => data.json()).then(data => data.insertId)
        const postData = JSON.stringify({
            id: pId,
            parent: null,
            active: 1,
            title: '',
            users: '',
            stat_id: ''
        })
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td contenteditable="true"></td><td class="users"><div class="form-autocomplete"><div class="form-autocomplete-input"><div class="chips"></div><input class="form-input" type="text" placeholder="Поиск"></div><ul class="menu"></ul></div></td><td class="stats"><div class="form-autocomplete"><div class="form-autocomplete-input"><div class="chips"></div><input class="form-input" type="text" placeholder="Поиск"></div><ul class="menu"></ul></div></td><td><div class="form-group"><label class="operations form-switch"><input type="checkbox" checked="checked"<i class="form-icon"></i></label></div></td>`
        tr.querySelectorAll('td:first-child,.form-autocomplete').forEach(td => td.setAttribute('data-data', postData))
        document.querySelector('table tbody').insertAdjacentElement('beforeend', tr)
        init()
    }
}