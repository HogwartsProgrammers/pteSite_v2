const access = document.getElementById('access').value

export function init() {
    const filterContacts = document.getElementById('filterContacts')
    const filterCompanies = document.getElementById('filterCompanies')

    const checkAllUnchecked = pressed => {
        if (!filterContacts.checked && !filterCompanies.checked) {
            if (pressed == filterContacts) filterCompanies.checked = true
            else filterContacts.checked = true
        }
    }

    filterContacts.oninput = event => {
        checkAllUnchecked(event.target)
        search()
    }
    filterCompanies.oninput = event => {
        checkAllUnchecked(event.target)
        search()
    }

    const searchInput = document.getElementById('searchInput')

    const search = () => {
        return Promise.all([
            fetch('/office/contacts', {
                method: 'POST',
                body: JSON.stringify({
                    title: searchInput.value.trim(),
                    find: 'liketitle',
                    _csrf: document.getElementById('csrfToken').value
                }),
                headers: { "Content-Type": "application/json" }
            }).then(result => result.json()),
            fetch('/office/phones', {
                method: 'POST',
                body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }),
                headers: { "Content-Type": "application/json" }
            }).then(result => result.json()),
            fetch('/office/email', {
                method: 'POST',
                body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }),
                headers: { "Content-Type": "application/json" }
            }).then(result => result.json()),
        ]).then(data => {
            drawTable(data)
        })
    }

    const contactsList = document.getElementById('contactsList')

    const intitEditing = () => {
        contactsList.querySelectorAll('tr').forEach(tr => {
            tr.onclick = event => {
                const contact = tr.dataset.info ? JSON.parse(tr.dataset.info) : null
                const parent = tr.dataset.parent ? JSON.parse(tr.dataset.parent) : null
                const phones = tr.dataset.phones ? JSON.parse(tr.dataset.phones) : null
                const email = tr.dataset.email ? JSON.parse(tr.dataset.email) : null

                document.querySelectorAll('.t-editContact').forEach(el => el.remove())

                const phonesHTML = []

                if (phones) phones.forEach(phone => {
                    phonesHTML.push(`
                        <div class="seven-prefix">
                            <input data-id="${phone.id}" data-old="${phone.phone}" type="text" pattern="\d*" placeholder="..." value="${phone.phone}" maxlength="10" name="phoneEdit">
                        </div>
                    `)
                })
                
                const editingTr = `
                    <tr class="t-editContact" data-i="${contact.id}">
                        <td colspan="4">
                            <div class="btn btn-clear float-right close-edit"></div>
                            <div class="d-flex">
                                <div class="col-4">
                                    <label>Название</label>
                                    <input class="form-input" name="contactTitle" type="text" placeholder="Иван" value="${contact.title ? contact.title : ''}">
                                    <div class="form-group mb-0">
                                        <label class="form-label pb-0">Тип</label>
                                        <label class="form-radio d-inline-block">
                                            <input type="radio" name="type" ${contact.type == 'person' ? 'checked' : ''} value="person">
                                            <i class="form-icon"></i> Контакт
                                        </label>
                                        <label class="form-radio d-inline-block">
                                            <input type="radio" name="type" ${contact.type == 'company' ? 'checked' : ''} value="company">
                                            <i class="form-icon"></i> Компания
                                        </label>
                                    </div>
                                    <div class="form-autocomplete ${contact.type == 'company' ? 'd-hide' : ''}">
                                        <label class="form-label">Компания</label>
                                        <div class="form-autocomplete-input form-input">
                                            <input class="form-input" type="text" placeholder="Поиск..." value="${parent ? parent.title : ''}">
                                        </div>
                                        <ul class="menu d-hide"></ul>
                                    </div>
                                    <label class="form-label">Телефоны</label>
                                    ${phonesHTML.join('\n')}
                                    <div class="seven-prefix">
                                        <input type="text" pattern="\d*" placeholder="..." maxlength="10" name="newPhone">
                                    </div>
                                    <label class="form-label">Email</label>
                                    <input class="form-input mail" type="text" placeholder="pochta@email.ru" data-i="${email ? email.id : 'new'}" value="${email ? email.email : ''}">
                                </div>
                            </div>
                            <button class="btn btn-primary btn-sm float-right">Сохранить</button>
                        </td>
                    </tr>
                `

                tr.insertAdjacentHTML('afterend', editingTr)

                document.querySelectorAll('.t-editContact .close-edit').forEach(el => el.onclick = () => document.querySelectorAll('.t-editContact').forEach(el => el.remove()))

                const initPhonesFnc = () => {
                    document.querySelectorAll('.t-editContact [name="phoneEdit"]').forEach(input => {
                        input.onkeyup = event => {
                            if (event.code == 'Enter' && input.value.length == 10 && input.value != input.dataset.old) {
                                input.disabled = true
                                fetch('/office/phones/update', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        id: input.dataset.id,
                                        phone: input.value,
                                        _csrf: document.getElementById('csrfToken').value
                                    }), 
                                    headers: { "Content-Type": "application/json" }
                                }).then(() => input.disabled = false)
                            } else if (event.code == 'Enter' && input.value.length == 0) {
                                fetch('/office/phones/update', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        id: input.dataset.id,
                                        cmd: 'delete',
                                        _csrf: document.getElementById('csrfToken').value
                                    }), 
                                    headers: { "Content-Type": "application/json" }
                                }).then(() => input.parentElement.remove())
                            }
                        }
                    })
                }

                initPhonesFnc()

                document.querySelector('.t-editContact [name="newPhone"]').onkeyup = event => {
                    if (event.code == 'Enter' && event.target.value.length == 10){
                        event.target.disabled = true
                        fetch('/office/phones/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                phone: event.target.value,
                                parent: contact.id,
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers: { "Content-Type": "application/json" }
                        }).then(r => r.json()).then(data => {
                            event.target.parentElement.insertAdjacentHTML('beforebegin', `
                                <div class="seven-prefix">
                                    <input data-id="${data.insertId}" data-old="${event.target.value}" type="text" pattern="\d*" placeholder="..." value="${event.target.value}" maxlength="10" name="phoneEdit">
                                </div>
                            `)
                            
                            initPhonesFnc()

                            event.target.value = ''
                            event.target.disabled = false
                        })
                    }
                }

                document.querySelectorAll('.t-editContact input[type="radio"]').forEach(el => {
                    el.oninput = event => {
                        if (event.target.value =='company')
                        document.querySelector('.t-editContact .form-autocomplete').classList.add('d-hide')
                        else 
                        document.querySelector('.t-editContact .form-autocomplete').classList.remove('d-hide')
                    }
                })

                const searchParent = document.querySelector('.t-editContact .form-autocomplete input')
                const suggestion = document.querySelector('.t-editContact .form-autocomplete .menu')

                const searchParentFunc = () => {
                    suggestion.innerHTML = '<div class="loading"></div>'

                    fetch('/office/contacts', {
                        method: 'POST',
                        body: JSON.stringify({
                            title: searchParent.value.trim(),
                            find: 'liketitle',
                            only: 'company',
                            _csrf: document.getElementById('csrfToken').value
                        }),
                        headers: { "Content-Type": "application/json" }
                    }).then(result => result.json()).then(data => {
                        suggestion.innerHTML = ''
                        data.forEach(contactData => {
                            suggestion.insertAdjacentHTML('beforeend', `
                                <div class="tile tile-centered py-1 c-hand" data-i="${contactData.id}" data-title='${contactData.title}'>
                                    <div class="tile-icon">
                                        <figure class="avatar avatar-sm" data-initial="${contactData.title.slice(0,1)}">
                                    </div>
                                    <div class="tile-content">${contactData.title}</div>
                                </div>
                            `)
                        })

                        suggestion.insertAdjacentHTML('beforeend', `
                            <div class="tile tile-centered py-1 c-hand" data-i="0" data-title="">
                                <div class="tile-icon">
                                    <figure class="avatar avatar-sm" data-initial="?">
                                </div>
                                <div class="tile-content">Нет</div>
                            </div>
                        `)


                        suggestion.querySelectorAll('.tile').forEach(tile => {
                            tile.onclick = event => {
                                document.querySelector('.t-editContact .form-autocomplete').dataset.parent = tile.dataset.i
                                searchParent.value = tile.dataset.title
                                suggestion.classList.add('d-hide')
                            }
                        })
                    })
                }

                searchParent.oninput = searchParentFunc

                searchParent.onfocus = event => {
                    searchParentFunc()
                    suggestion.classList.remove('d-hide')
                }
                searchParent.onblur = event => setTimeout(() => suggestion.classList.add('d-hide'), 300) 

                const saveBtn = document.querySelector('.t-editContact button')
                const contactTitle = document.querySelector('.t-editContact [name="contactTitle"]')

                contactTitle.oninput = event => {
                    if (contactTitle.value.trim().length == 0) contactTitle.classList.add('is-error')
                    else contactTitle.classList.remove('is-error')
                }

                contactTitle.onblur = event => contactTitle.classList.remove('is-error')

                saveBtn.onclick = event => {
                    const type = Array.from(document.querySelectorAll('.t-editContact input[type="radio"]')).find(el => el.checked ? true : false).value
                    saveBtn.disabled = true

                    const contactParent = document.querySelector('.t-editContact .form-autocomplete').dataset.parent

                    if (contactTitle.value.trim().length > 0){
                        fetch('/office/contacts/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: contact.id,
                                title: contactTitle.value,
                                type: type,
                                parent: contactParent,
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{ "Content-Type": "application/json" }
                        }).then(() => {
                            search()
                        })
                        fetch('/office/email/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: document.querySelector('.mail').dataset.i != 'new' ? document.querySelector('.mail').dataset.i : undefined,
                                parent: document.querySelector('.mail').dataset.i != 'new' ? undefined : contact.id,
                                email: document.querySelector('.mail').value,
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{ "Content-Type": "application/json" }
                        })
                    }
                    else contactTitle.classList.add('is-error')
                }
            }
        })
    }
    intitEditing()

    const drawTable = data => {
        contactsList.innerHTML = ''

        if (!data[0].length) {
            contactsList.insertAdjacentHTML('beforeend', `
                <tr>
                    <td class="empty-search" colspan="4"></td>
                </tr>
            `)
        }

        data[0].forEach((contact, i, a) => {
            const email = data[2].find(dt => dt.parent == contact.id ? true : false)
            const parent = a.find(c => c.id == contact.parent ? c : false)
            const phoneData = []

            data[1].forEach(dt => dt.parent == contact.id ? phoneData.push(dt) : null)

            if (!filterContacts.checked && contact.type == 'person') return 
            if (!filterCompanies.checked && contact.type == 'company') return

            contactsList.insertAdjacentHTML('beforeend', `
                <tr class="c-hand" data-info='${JSON.stringify(contact)}' ${parent ? `data-parent='`+JSON.stringify(parent)+`'` : ''} data-phones='${JSON.stringify(phoneData)}' ${email ? `data-email='`+JSON.stringify(email)+`'` : ''}>
                    <td>${contact.id}</td>
                    <td>${contact.title}</td>
                    <td>${phoneData[0] ? '+7'+phoneData[0].phone : ''}</td>
                    <td>${parent ? parent.title : ''}</td>
                </tr>
            `)
        })

        intitEditing()
    }

    searchInput.oninput = event => {
        // if (searchInput.value.trim().length > 0)
        search()
    }
}