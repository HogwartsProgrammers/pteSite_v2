import Sortable from 'sortablejs'

const access = document.getElementById('access').value

export function stepsScript() {
    if (access == 'full') new Sortable(document.getElementById('stepsHolder'), {
        animation: 200,
        handle: 'span'
    })

    // const saveStepsBtn = document.getElementById('saveStepsBtn')

    // saveStepsBtn.addEventListener('click', event => {
    //     const inputs = document.querySelectorAll('#stepsHolder input')
    //     const data = {title: null, id: null, sec: [], pipe_id: +location.pathname.split('/')[3], _csrf: document.getElementById('csrfToken').value, parents_id: []}

    //     inputs.forEach(input => {
    //         data.sec.push(input.name)
    //     })

    //     inputs.forEach(input => {
    //         if (input.value === input.dataset.last) return
    //         input.dataset.last = input.value.trim()
    //         data.title = input.value
    //         data.id = input.name
    //         fetch('/office/steps/edit', {
    //             method: 'POST',
    //             body: JSON.stringify(data), 
    //             headers:{
    //                 "Content-Type": "application/json"
    //             }
    //         }).then(res => {
    //             return res.json()
    //         })
    //         .catch(error => console.error(error))
    //     })  
    // })
}

export function setEventDeleteBtn() {
    document.querySelectorAll('#stepsHolder button[data-id]').forEach(delBtn => { 
        const listener = event => {
            const url = '/office/steps/delete'
            const csrf = document.getElementById('csrfToken').value
            const data = {id: delBtn.dataset.id, _csrf: csrf, active: 0}

            const buttonsHolder = document.createElement('div')
            const confirmBtn = document.createElement('button')
            confirmBtn.classList.add('btn')
            confirmBtn.classList.add('btn-error')
            confirmBtn.innerText = 'Удалить'
            const cancelBtn = document.createElement('button')
            cancelBtn.classList.add('btn')
            cancelBtn.innerText = 'Отмена'
            buttonsHolder.insertAdjacentElement('beforeend', confirmBtn)
            buttonsHolder.insertAdjacentElement('beforeend', cancelBtn)

            event.target.classList.add('d-hide')
            event.path[1].insertAdjacentElement('beforeend', buttonsHolder)

            confirmBtn.addEventListener('click', () => {
                fetch(url, {
                    method: 'DELETE',
                    body: JSON.stringify(data), 
                    headers:{
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    return res.json()
                })
                .catch(error => console.error(error))
                event.path[1].remove()
            })

            cancelBtn.addEventListener('click', () => {
                event.target.classList.remove('d-hide')
                buttonsHolder.remove()
            })
        }
        if (access == 'full' && !+delBtn.dataset.listener) {
            delBtn.addEventListener('click', listener)
            delBtn.dataset.listener = 1
        }
    })
}