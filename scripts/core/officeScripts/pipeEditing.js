export function pipeEditing () {
    const renamePipeBtn = document.getElementById('renamePipeBtn')
    const pipeTitleInp = document.getElementById('pipeTitle')
    const pageTitle = document.getElementById('pageTitle')
    const pipeEditOpenBtn = document.getElementById('pipeEditBtn')
    const access = document.getElementById('access').value

    if (access == 'full') pipeEditOpenBtn.onclick = event => {
        document.getElementById('pipeEditingModal').classList.add('active')
    }

    // валлидация поля смены названия воронки
    pipeTitleInp.addEventListener('input', () => {
        if (pipeTitleInp.value.trim() === '') {
            renamePipeBtn.disabled = true
            pipeTitleInp.classList.add('is-error')
        } else {
            renamePipeBtn.disabled = false
            pipeTitleInp.classList.remove('is-error')
        }
        
    })
    
   
    if (access == 'full') renamePipeBtn.addEventListener('click', event => {
        const url = '/office/pipes/' + location.pathname.split('/')[3]
        const csrf = document.getElementById('csrfToken').value
        const newTitle = pipeTitleInp.value.trim()
        const currentId = +location.pathname.split('/')[3]
        const data = {title: newTitle, id: currentId, _csrf: csrf}
        if (pipeTitleInp.value !== '') {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(res => {
                pageTitle.innerText = newTitle
                document.getElementById('pipeEditingModal').classList.remove('active')
                return res.json()
            })
            .catch(error => console.error(error))
        }
    })
   

    const pipeDeleteBtn = document.getElementById('pipeDeleteBtn')

    if (access == 'full') pipeDeleteBtn.addEventListener('click', event => {
        if(confirm('Вы точно хотите удалить воронку?') && confirm('В уверены?')) {
            const url = '/office/pipes/delete'
            const csrf = document.getElementById('csrfToken').value
            const currentId = +location.pathname.split('/')[3]
            const data = {id: currentId, _csrf: csrf, active: 0}

            fetch(url, {
                method: 'DELETE',
                body: JSON.stringify(data), 
                headers:{
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                window.location.pathname = 'office/pipes'
                return res.json()
            })
            .catch(error => console.error(error))
        }
    })
}