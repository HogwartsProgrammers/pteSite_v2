export function init() {
    // делать активным и неактивным пользователя с помощью switch
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

    // показывать неактивных пользователей с помощью switch
    const switchShow = document.querySelector('#showInactive input')
    const tr = document.querySelectorAll('tbody tr')
    switchShow.onclick = () => {
        if (switchShow.checked) {
            tr.forEach(el => { 
                if (el.classList.contains('d-hide')) el.classList.remove('d-hide')
            })
        } else {
            tr.forEach(el => {
                if (!el.querySelector('input').checked) el.classList.add('d-hide')
            })
        }
    }

    // функционал аутокомплита spectre
    document.querySelectorAll('table .form-autocomplete').forEach(autoComplete => {
        const post = JSON.parse(autoComplete.dataset.data)
        autoComplete.querySelectorAll('.chip').forEach(chip => chip.querySelector('a').onclick = () => {
            chip.remove()
            const index = post.users.split(',').indexOf(chip.dataset.id)
            fetch('/office/posts/update', {
                method: 'POST',
                body: JSON.stringify({
                    id: post.id,
                    users: users,
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{"Content-Type": "application/json"}
            })
        })
    })
}