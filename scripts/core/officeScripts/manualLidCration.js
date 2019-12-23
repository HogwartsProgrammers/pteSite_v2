const access = document.getElementById('access').value

export function init () {
    const modal = document.getElementById('createLidModal')
    const addLidBtn = document.getElementById('addLidBtn')

    addLidBtn.onclick = event => {
        modal.classList.add('active')
    }

    const lidTitle = document.getElementById('lidTitle')
    const lidStep = document.getElementById('lidStep')
    const lidGi = document.getElementById('lidGi')
    const lidCgi = document.getElementById('lidCgi')
    const lidPrepayment = document.getElementById('lidPrepayment')
    const lidRestpayment = document.getElementById('lidRestpayment')
    const lidComment = document.getElementById('lidComment')
    const lidContactTitle = document.getElementById('lidContactTitle')
    const lidHolderUser = document.getElementById('lidHolderUser')
    const newPhone = document.getElementById('newPhone')
    const found = document.getElementById('found')
    const creatingContactHolder = document.getElementById('creatingContactHolder')
    const lidContactType = document.getElementById('lidContactType')

    const rejectCrateingLid = document.getElementById('rejectCrateingLid')
    const confirmCreatingLid = document.getElementById('confirmCreatingLid')
    
    const lenghtValid = (el, length) => {
        const check = event => {
            if (el.value.toString().trim().length > length) el.classList.remove('is-error')
            else el.classList.add('is-error')
        }

        el.addEventListener('input', check)
        el.addEventListener('focus', check)

        el.addEventListener('blur', event => {
            el.classList.remove('is-error')
        })
    }

    lenghtValid(lidTitle, 0)
    lenghtValid(lidContactTitle, 0)

    const newContactFnc = () => {
        found.querySelector('a').onclick = event => {
            lidHolderUser.value = 'Новый контакт'
            lidHolderUser.dataset.id = 'new'
            found.classList.add('d-hide')
            creatingContactHolder.classList.remove('d-hide')
        }
    }

    lidHolderUser.oninput = event => {
        delete lidHolderUser.dataset.id
        if ((event.target.value+'').trim().length > 0) {
            found.innerHTML = ''
            found.classList.remove('d-hide')
            fetch('/office/contacts', {
                method: 'POST',
                body: JSON.stringify({ title: (event.target.value+'').trim(), find: 'liketitle' ,_csrf: document.getElementById('csrfToken').value }), 
                headers:{ "Content-Type": "application/json" }
            }).then(result => result.json()).then(data => {
                data.forEach(contact => {
                    found.insertAdjacentHTML('beforeend', `
                        <li class="menu-item"><a class="c-hand" data-id="${contact.id}" data-title="${contact.title}">
                            <div class="tile tile-centered">
                                <div class="tile-icon"><figure class="avatar avatar-sm" data-initial="${contact.title.slice(0,1)}"></figure></div>
                                <div class="tile-content">${contact.title}</div>
                            </div>
                        </a></li>
                    `)
                })

                if (!found.childElementCount) {
                    found.insertAdjacentHTML('beforeend', `
                        <li class="menu-item"><a class="c-hand new">
                            <div class="tile tile-centered">
                                <div class="tile-icon"><figure class="avatar avatar-sm" data-initial="?"></figure></div>
                                <div class="tile-content">Новый контакт</div>
                            </div>
                        </a></li>
                    `)
                    newContactFnc()
                }

                found.querySelectorAll('a').forEach(contactEl => {
                    contactEl.onclick = event => {
                        creatingContactHolder.classList.add('d-hide')
                        lidHolderUser.value = contactEl.dataset.title
                        found.classList.add('d-hide')
                        lidHolderUser.dataset.id = contactEl.dataset.id

                        fetch('/office/contacts', {
                            method: 'POST',
                            body: JSON.stringify({ id: contactEl.dataset.id, find: 'byid' ,_csrf: document.getElementById('csrfToken').value }), 
                            headers:{ "Content-Type": "application/json" }
                        }).then(result => result.json()).then(cd => {
                            lidContactTitle.value = cd[0].title
                        })
                    }
                })
            })
        }   
        else {
            found.classList.add('d-hide')
        }
    }

    lidHolderUser.onfocus = event => {
        found.classList.remove('d-hide')
        if (!lidHolderUser.value) {
            found.innerHTML = ''
            found.insertAdjacentHTML('beforeend', `
                <li class="menu-item"><a class="c-hand new">
                    <div class="tile tile-centered">
                        <div class="tile-icon"><figure class="avatar avatar-sm" data-initial="?"></figure></div>
                        <div class="tile-content">Новый контакт</div>
                    </div>
                </a></li>
            `)
            newContactFnc()
        }
    }

    lidHolderUser.onblur = event => {
        setTimeout(() => { if (event.target != document.activeElement) found.classList.add('d-hide') }, 1000) 
    }

    confirmCreatingLid.onclick = event => {
        if ((lidTitle.value+'').trim().length > 0 && !!lidHolderUser.dataset.id || (lidHolderUser.dataset.id == 'new' && newPhone.value.trim().length == 10 && lidContactTitle.value.trim().length > 0)) {
            const clearAll = () => {
                lidTitle.value = ''
                lidStep.value = 1
                lidGi.value = 0
                lidCgi.value = 0
                lidPrepayment.value = 0
                lidRestpayment.value = 0
                lidComment.value = ''
                newPhone.value = ''
                lidContactTitle.value = ''
                creatingContactHolder.classList.add('d-hide')
            }

            confirmCreatingLid.classList.add('loading')
            lidTitle.disabled = true
            lidStep.disabled = true
            lidGi.disabled = true
            lidCgi.disabled = true
            lidPrepayment.disabled = true
            lidRestpayment.disabled = true
            lidComment.disabled = true
            rejectCrateingLid.disabled = true
            lidHolderUser.disabled = true

            const createLid = holder => {
                return fetch('/office/lids/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: lidTitle.value,
                        lid_data: {
                            comment: lidComment.value
                        },
                        step_id: lidStep.value,
                        tunnel_id: lidStep.querySelector('[value="' + lidStep.value + '"]').dataset.pipe,
                        gi: lidGi.value,
                        cgi: lidCgi.value,
                        prepayment: lidPrepayment.value,
                        restpayment: lidRestpayment.value,
                        holder: holder,
                        _csrf: document.getElementById('csrfToken').value
                    }), 
                    headers:{ "Content-Type": "application/json" }
                }).then(result => result.json()).then(data => {
                    addLidBtn.insertAdjacentHTML('beforebegin', `
                        <tr>
                            <td class="id pl-2">${data.insertId}</td>
                            <td class="title">${lidTitle.value}</td>
                            <td class="date">${new Date().toISOString().split('T')[0].split('-')[1] }.${ new Date().toISOString().split('T')[0].split('-')[2] } ${ new Date().toISOString().split('T')[1].slice(0,8)}</td>
                            <td class="gi">${lidGi.value} р.</td>
                            <td class="contact"><span class="name">${lidContactTitle.value}</span></td>
                        </tr>
                    `)
                })
            }
        
            if (lidHolderUser.dataset.id == 'new') {
                const type = Array.from(lidContactType.querySelectorAll('input')).find(el => el.checked ? true : false).value

                fetch('/office/contacts/update', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: lidContactTitle.value,
                        type: type,
                        _csrf: document.getElementById('csrfToken').value
                    }), 
                    headers:{ "Content-Type": "application/json" }
                }).then(result => result.json()).then(data => {
                    fetch('/office/phones/update', {
                        method: 'POST',
                        body: JSON.stringify({
                            phone: newPhone.value,
                            parent: data.insertId,
                            _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{ "Content-Type": "application/json" }
                    }).then(() => {
                        createLid(data.insertId).then(() => {
                            confirmCreatingLid.classList.remove('loading')
                            lidTitle.disabled = false
                            lidStep.disabled = false
                            lidGi.disabled = false
                            lidCgi.disabled = false
                            lidPrepayment.disabled = false
                            lidRestpayment.disabled = false
                            lidComment.disabled = false
                            rejectCrateingLid.disabled = false
                            lidHolderUser.disabled = false
                            modal.classList.remove('active')
                            clearAll()
                        }) 
                    })
                })
            } else {
                createLid(lidHolderUser.dataset.id).then(() => {
                    confirmCreatingLid.classList.remove('loading')
                    lidTitle.disabled = false
                    lidStep.disabled = false
                    lidGi.disabled = false
                    lidCgi.disabled = false
                    lidPrepayment.disabled = false
                    lidRestpayment.disabled = false
                    lidComment.disabled = false
                    rejectCrateingLid.disabled = false
                    lidHolderUser.disabled = false
                    modal.classList.remove('active')
                    clearAll()
                })
            }
        }
    }
}