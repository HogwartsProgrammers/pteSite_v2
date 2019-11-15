import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
const inView = require('in-view')

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
    // document.querySelectorAll('table tbody tr td:nth-child(2)').forEach(td => {
    //     if (!td.dataset.data) return
    //     const post = JSON.parse(td.dataset.data)
    //     td.onkeydown = (event) => {
    //         if (event.code == 'Enter') {
    //             event.preventDefault()
    //             td.blur()
    //         }
    //     }
    //     td.onblur = () => {
    //         fetch('/office/stats/update', {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 id: post.id,
    //                 description: td.innerText.trim(),
    //                 _csrf: document.getElementById('csrfToken').value
    //             }), 
    //             headers:{"Content-Type": "application/json"}
    //         })
    //     }
    //     td.removeAttribute('data-data')
    // })

    
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
            } 
        }, 
        autofocus: true,    
        onReady: () => {
            document.querySelectorAll('.ce-inline-toolbar .icon').forEach(el => el.classList.remove('icon')) 
        },
        onChange: () => {
            editor.save().then((outputData) => {
                console.log('Article data: ', outputData)
            }).catch((error) => {
                console.log('Saving failed: ', error)
            })
        },
        data: {"time" : 1573723801588,
        "blocks" : [
            {
                "type" : "header",
                "data" : {
                    "text" : "Editor.js",
                    "level" : 2
                }
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "Hey. Meet the new Editor. On this page you can see it in action — try <i>to&nbsp;edit&nbsp;</i><code class=\"inline-code\">this </code><mark class=\"cdx-marker\">text.</mark>"
                }
            },
            {
                "type" : "header",
                "data" : {
                    "text" : "Key features",
                    "level" : 3
                }
            },
            {
                "type" : "list",
                "data" : {
                    "style" : "unordered",
                    "items" : [
                        "It is a block-styled editor",
                        "It returns clean data output in JSON",
                        "Designed to be extendable and pluggable with a simple API"
                    ]
                }
            },
            {
                "type" : "header",
                "data" : {
                    "text" : "What does it mean «block-styled editor»",
                    "level" : 3
                }
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\"cdx-marker\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core."
                }
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "There are dozens of <a href=\"https://github.com/editor-js\">ready-to-use Blocks</a> and the <a href=\"https://editorjs.io/creating-a-block-tool\">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games."
                }
            },
            {
                "type" : "header",
                "data" : {
                    "text" : "What does it mean clean data output",
                    "level" : 3
                }
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below"
                }
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "Given data can be used as you want: render with HTML for <code class=\"inline-code\">Web clients</code>, render natively for <code class=\"inline-code\">mobile apps</code>, create markup for <code class=\"inline-code\">Facebook Instant Articles</code> or <code class=\"inline-code\">Google AMP</code>, generate an <code class=\"inline-code\">audio version</code> and so on."
                }
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "Clean data is useful to sanitize, validate and process on the backend."
                }
            },
            {
                "type" : "delimiter",
                "data" : {}
            },
            {
                "type" : "paragraph",
                "data" : {
                    "text" : "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏"
                }
            },
            {
                "type" : "image",
                "data" : {
                    "file" : {
                        "url" : "https://capella.pics/6d8f1a84-9544-4afa-b806-5167d45baf7c.jpg"
                    },
                    "caption" : "",
                    "withBorder" : true,
                    "stretched" : false,
                    "withBackground" : false
                }
            }
        ],
        "version" : "2.15.0"}
      })

}