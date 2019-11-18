import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
const Marker = require('@editorjs/marker');
const Paragraph = require('@editorjs/paragraph');
const Checklist = require('@editorjs/checklist');
const Delimiter = require('@editorjs/delimiter');

export function init() {
    // делать активным и неактивным пользователя с помощью switch
    document.querySelectorAll('.operations input').forEach(el => {
        el.onclick = () => {
            fetch('/office/stats/update', {
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
            fetch('/office/stats/update', {
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

    document.querySelectorAll('table tbody tr td:nth-child(2)').forEach(td => {
        td.querySelector('button').onclick = () => {
            document.getElementById('codex-editor').innerHTML = ''
            const statData = JSON.parse(td.dataset.data)
            const modal = document.getElementById('modalDescription')
            modal.classList.add('active')
            const editor = new EditorJS({ 
                holderId: 'codex-editor', 
                tools: { 
                    header: {
                        class: Header, 
                        inlineToolbar: ['link'] 
                    }, 
                    list: { 
                        class: List, 
                        inlineToolbar: true 
                    } ,
                    Marker: {
                        class: Marker,
                        shortcut: 'CMD+SHIFT+M',
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    checklist: {
                        class: Checklist,
                        inlineToolbar: true,
                    },
                    delimiter: Delimiter,
                }, 
                autofocus: false,    
                onReady: () => {
                    document.querySelectorAll('.ce-inline-toolbar .icon').forEach(el => el.classList.remove('icon')) 
                },
                onChange: () => {},
                data: JSON.parse(statData.description)
            })
            modal.querySelector('.modal-footer button').onclick = async () => {
                const data = await editor.save()
                fetch('/office/stats/update', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: statData.id,
                        description: JSON.stringify(data),
                        _csrf: document.getElementById('csrfToken').value
                    }), 
                    headers:{"Content-Type": "application/json"}
                })
                const dataNew = statData
                dataNew.description = JSON.stringify(data)
                td.dataset.data = JSON.stringify(dataNew)
            }   
        }
    })

}