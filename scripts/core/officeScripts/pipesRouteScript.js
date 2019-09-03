export function pipesRouteScript () {
    const addPipeBtn = document.getElementById('addPipeBtn')
    const access = document.getElementById('access').value

    if (access == 'full') addPipeBtn.addEventListener('click', event => {
        addPipeBtn.disabled = 'disabled'
        const url = '/office/pipes'
        const csrf = document.getElementById('csrfToken').value
        // const title = pipesTitleInp.value
        const data = {_csrf: csrf}

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(res => {
            window.location = '/office/pipes/' + res.id
        })
        .catch(error => console.error(error))
    })

    const selectEl = document.getElementById('select')

    selectEl.addEventListener('click', event => {
        const url = '/office/getPipes'
        const csrf = document.getElementById('csrfToken').value
        const pipeId = selectEl.value 
        const data = {_csrf: csrf, id: pipeId}
        
        function pipes (obj) {

            const pipe = document.getElementById('pipe')
            const pipeTitle = document.getElementById('pipeTitle')
            const pipeStepsHolder = document.getElementById('pipeStepsHolder')

            document.getElementById('editPipeBtn').addEventListener('click', () => window.location = '/office/pipes/' + obj.pipe.id)

            if (!!obj.pipe) pipeTitle.querySelector('h2').innerText = obj.pipe.title
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(res => {
            pipes(res)
        })
        .catch(error => console.error(error))
    })
    selectEl.click()

    if (!document.getElementById('select').innerHTML) document.getElementById('editPipeBtn').disabled = true
}