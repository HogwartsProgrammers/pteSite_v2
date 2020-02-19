const vis = require('vis-network')

const access = document.getElementById('access').value

export function visScript () {
    fetch('/office/getPipes', {
        method: 'POST',
        body: JSON.stringify({id: +location.pathname.split('/')[3], _csrf: document.getElementById('csrfToken').value}), 
        headers:{
            "Content-Type": "application/json"
        }
    }).then(res => {
        return res.json()
    }).then(res => {

        const data = () => {
            const nodes = []
            const edges = []

            return fetch('/office/getPipes', {
                method: 'POST',
                body: JSON.stringify({id: +location.pathname.split('/')[3], _csrf: document.getElementById('csrfToken').value}), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(res => {
                return res.json()
            }).then(res => {
                res.steps.forEach( step => {
                    nodes.push({
                        id: step.id,
                        label: step.title,
                        color: {
                            border: step.vis_data ? step.vis_data.color : '#000'
                        },
                        shape: step.vis_data ? step.vis_data.shape : 'box'
                    })
                    if (step.parents) step.parents.split(',').forEach(parent => {
                        edges.push({ to: step.id, from: parent })
                    })
                })
                console.log(nodes)
                return {
                    nodes: nodes,
                    edges: edges
                }
            })
        }
        
        let network

        const options = () => {return {
            height: document.getElementById('vis').getBoundingClientRect().height + 'px',
            width: '100%',
            layout: {
                randomSeed: 2,
                hierarchical: {
                    enabled: document.getElementById('strictBtn').checked,
                    sortMethod: 'directed',
                    direction: 'LR',
                }
            },
            physics: {
                enabled: false,
            },
            edges: {
                smooth: {
                    enabled: false
                },
                arrows: {
                    to: true  
                },
                chosen: {
                    edge: function(values, id, selected, hovering) {
                        if (selected) values.width = 3
                        else values.width = 1
                    }
                }
            },
            nodes: {
                shape: "box",
                borderWidth: 1,
                borderWidthSelected: 2,
                color: {
                    border: 'medgray',
                    background: '#fff',
                    highlight: {
                        border: '#lightslategray',
                        background: 'gainsboro'
                    }
                },
                chosen:{
                    node: function(values, id, selected, hovering) {
                        if (selected) {
                            values.color = '#ccffcc'
                            values.borderColor = '#004d00'
                        } else {
                            values.color = '#fff'
                            values.borderColor = 'medgray'
                        }
                    }
                }
            },
            locale: 'ru',
            interaction: {
                multiselect: true,
            },
            manipulation: {
                enabled: access == 'full' ? true : false,
                addNode: function (data, callback) {
                    const modal = document.getElementById('nodeCreateModal')
                    const send = document.getElementById('confirmNodeCreate')
                    const reject = document.getElementById('rejectNodeCreate')
                    const color = document.getElementById('nodeCreateColor')
                    const shape = document.getElementById('nodeCreateShape')
                    modal.classList.add('active')

                    modal.querySelector('.modal-close').onclick = event => {
                        send.onclick = null
                        reject.onclick = null
                        callback(null)
                    }

                    const nodeTitle = document.getElementById('nodeCrateTitle')
                    nodeTitle.oninput = event => {
                        if (nodeTitle.value.trim().length > 0) {   
                            nodeTitle.classList.remove('is-error')
                            send.disabled = false
                        } else {
                            nodeTitle.classList.add('is-error')
                            send.disabled = true
                        }
                    }
                    
                    send.onclick = event => {
                        event.target.onclick = null
                        modal.classList.add('active')

                        fetch('/office/steps', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: +location.pathname.split('/')[3],
                                title: nodeTitle.value,
                                vis_data: { color: color.value, shape: shape.value },
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{
                                "Content-Type": "application/json"
                            }
                        })
                        .then(res => {
                            return res.json()
                        }).then(res => {
                            data.id = res.id
                            data.label = nodeTitle.value
                            callback(data)
                            modal.classList.remove('active')
                        })
                        .catch(error => console.error(error))
                    }

                    reject.onclick = event => {
                        modal.classList.remove('active')
                        callback(null)
                    }
                },

                editNode: function (data, callback) {
                    const modal = document.getElementById('nodeEditingModal')
                    const send = document.getElementById('confirmNodeEdit')
                    const reject = document.getElementById('rejectNodeEdit')
                    const color = document.getElementById('nodeEditColor')
                    const shape = document.getElementById('nodeEditShape')
                    modal.classList.add('active')

                    color.value = network.body.data.nodes._data[data.id].color.border
                    shape.value = network.body.data.nodes._data[data.id].shape

                    let parents = []
                    for (let key in network.body.data.edges._data) {
                        if (network.body.data.edges._data[key].to === data.id) parents.push(network.body.data.edges._data[key].from)
                    }
                    parents.forEach((id, i) => parents[i] = +id)

                    parents = parents.join(',')

                    modal.querySelector('.modal-close').onclick = event => {
                        send.onclick = null
                        reject.onclick = null
                        callback(null)
                    }

                    const nodeTitle = document.getElementById('nodeEditTitle')
                    nodeTitle.value = data.label
                    nodeTitle.oninput = event => {
                        if (nodeTitle.value.trim().length > 0) {   
                            nodeTitle.classList.remove('is-error')
                            send.disabled = false
                        } else {
                            nodeTitle.classList.add('is-error')
                            send.disabled = true
                        }
                    }
                    
                    send.onclick = event => {
                        event.target.onclick = null
                        modal.classList.add('active')

                        fetch('/office/steps/edit', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: data.id,
                                title: nodeTitle.value,
                                parents: parents,
                                vis_data: { color: color.value, shape: shape.value },
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{
                                "Content-Type": "application/json"
                            }
                        })
                        .then(res => {
                            return res.json()
                        }).then(res => {
                            data.label = nodeTitle.value
                            modal.classList.remove('active')
                            callback(data)
                        })
                        .catch(error => console.error(error))
                    }

                    reject.onclick = event => {
                        modal.classList.remove('active')
                        callback(null)
                    }
                },

                addEdge: function (data, callback) {
                    const nodeTitle = network.body.data.nodes._data[data.to].label
                    let nodeParents = [data.from]
                    for (let key in network.body.data.edges._data) {
                        if (network.body.data.edges._data[key].to === data.to) nodeParents.push(network.body.data.edges._data[key].from)
                    }

                    // Приводим всё в числовое значение
                    nodeParents.forEach((id, i) => nodeParents[i] = +id)

                    nodeParents = nodeParents.filter((item, pos) => {
                        return nodeParents.indexOf(+item) == pos
                    })
                    nodeParents = nodeParents.join(',')

                    if (data.from === data.to) alert('Невозможно замкнуть путь на самом себе')
                    else {
                        fetch('/office/steps/edit', {
                            method: 'POST',
                            body: JSON.stringify({id: data.to, title: nodeTitle, parents: nodeParents, _csrf: document.getElementById('csrfToken').value}), 
                            headers:{
                                "Content-Type": "application/json"
                            }
                        })
                        .then(res => {
                            return res.json()
                        })
                        .then(res => {
                            callback(data)
                        })
                        .catch(error => console.error(error))
                    }
                },
                
                editEdge: function (data, callback) {
                    const oldData = network.body.data.edges._data[data.id]

                    let oldNodeParents = []
                    for (let key in network.body.data.edges._data) {
                        if (network.body.data.edges._data[key].to === data.to && network.body.data.edges._data[key].to !== oldData.to) oldNodeParents.push(network.body.data.edges._data[key].from)
                    }
                    oldNodeParents = oldNodeParents.join(',')

                    const deleteOldEdge = fetch('/office/steps/edit', {
                        method: 'POST',
                        body: JSON.stringify({
                            id: oldData.to,
                            title: network.body.data.nodes._data[oldData.to].labels,
                            parents: oldNodeParents,
                            _csrf: document.getElementById('csrfToken').value}), 
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })
                    .catch(error => console.error(error))

                    const nodeTitle = network.body.data.nodes._data[data.to].label
                    let nodeParents = [data.from]
                    for (let key in network.body.data.edges._data) {
                        if (network.body.data.edges._data[key].to === data.to) nodeParents.push(network.body.data.edges._data[key].from)
                    }
                    nodeParents = nodeParents.join(',')
                    
                    if (data.from === data.from || typeof data.from !== 'number' || typeof data.to !== 'number') callback(null)
                    else {
                        Promise.all([deleteOldEdge, 
                            fetch('/office/steps/edit', {
                                method: 'POST',
                                body: JSON.stringify({
                                    id: data.to,
                                    title: nodeTitle,
                                    parents: nodeParents,
                                    _csrf: document.getElementById('csrfToken').value}), 
                                headers:{
                                    "Content-Type": "application/json"
                                }
                            })
                            .then(res => {
                                const kanbanScriptClass = require('./kanbanScript').KanbanScript
                                new kanbanScriptClass().init()
                                return res.json()
                            })
                            .catch(error => console.error(error))
                        ])
                        .then(result => {
                            callback(data)
                        })  
                    }
                },

                deleteNode: function (data, callback) {
                    if (confirm('Вы точно хотит удалить шаг?')) {
                        data.nodes.forEach(node => {
                            fetch('/office/steps/delete', {
                                method: 'DELETE',
                                body: JSON.stringify({id: node, _csrf: document.getElementById('csrfToken').value, active: 0}), 
                                headers:{
                                    "Content-Type": "application/json"
                                }
                            })
                            .then(res => {
                                return res.json()
                            })
                            .catch(error => console.error(error))
    
                            callback(data)
                        })
                    }
                    else callback(null)
                },

                deleteEdge: function (data, callback) {
                    if (confirm('Вы точно хотит удалить путь?')) {
                        data.edges.forEach(edge => {
                            const edgeData = network.body.data.edges._data[edge]
                            let nodeParents = []
                            for (let key in network.body.data.edges._data) {
                                if (network.body.data.edges._data[key].to === edgeData.to && edgeData.from !== network.body.data.edges._data[key].from) nodeParents.push(network.body.data.edges._data[key].from)
                            }
                            nodeParents = nodeParents.join(',')
                            console.log(edgeData,nodeParents)
                            callback(null)
                            
                            fetch('/office/steps/edit', {
                                method: 'POST',
                                body: JSON.stringify({
                                    id: edgeData.to,
                                    title: network.body.data.nodes._data[edgeData.to].label,
                                    parents: nodeParents,
                                    _csrf: document.getElementById('csrfToken').value}), 
                                headers:{
                                    "Content-Type": "application/json"
                                }
                            })
                            .then(res => {
                                const kanbanScriptClass = require('./kanbanScript').KanbanScript
                                new kanbanScriptClass().init()
                                return res.json()
                            })
                            .then(res => {
                                callback(data)
                            })
                            .catch(error => console.error(error))
                        })
                        callback(data)
                    }
                    else callback(null)
                }
            }
        }}
        const container = document.getElementById('vis')

        const selectedNodes = []

        const draw = () => {
            data().then(visData => {
                container.innerHTML = ''
                document.getElementById('reloadVisBtn').disabled = false
                document.getElementById('strictBtn').disabled = false
                network = new vis.Network(container, visData, options())

                network.on('selectNode', params => {
                    const node = network.getNodeAt({x: params.pointer.DOM.x, y: params.pointer.DOM.y})
        
                    if (node && !selectedNodes.find(el => el === node ? true : false)) selectedNodes.push(node)
        
                    selectedNodes.forEach((el, i) => {
                        if (!network.body.nodes[el].selected) selectedNodes.splice(i, i+1)
                    })
                    
                    if (selectedNodes.length > 1) {
                        saveBtn.disabled = false
                        saveBtn.classList.remove('tooltip')
                    }
                    else {
                        saveBtn.disabled = true
                        saveBtn.classList.add('tooltip')
                    }
                })

                const check = () => {
                    selectedNodes.forEach((el, i) => {
                        if (!network.body.nodes[el].selected) selectedNodes.splice(i, i+1)
                    })
                    
                    if (selectedNodes.length > 1) {
                        saveBtn.disabled = false
                        saveBtn.classList.remove('tooltip')
                    }
                    else {
                        saveBtn.disabled = true
                        saveBtn.classList.add('tooltip')
                    }
                }
        
                network.on('dragEnd', params => {
                    network.unselectAll()
                    check()
                })
        
                network.on('deselectNode', params => check())
            })
        }
        draw()

        document.getElementById('reloadVisBtn').addEventListener('click', event => {
            draw()
        })

        document.getElementById('strictBtn').addEventListener('click', event => {
            network.setOptions({
                layout: {
                    hierarchical: {
                        enabled: event.target.checked
                    }
                },
                physics: {
                    enabled: false
                }
            })
        })
        const saveBtn = document.getElementById('saveStepsVis')

        const saveData = () => {
            const elements = {}
            selectedNodes.forEach(el => {
                elements[el] = network.body.data.nodes._data[el]
            })

            fetch('/office/pipes/' + location.pathname.split('/')[3], {
                method: 'POST',
                body: JSON.stringify({
                    id: +location.pathname.split('/')[3],
                    title: document.getElementById('pipeTitle').value,
                    kanban: {
                        title: '',
                        description: '',
                        steps: selectedNodes
                    },
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(res => {
                return res.json()
            }).then(res => {
                pageTitle.innerText = document.getElementById('pipeTitle').value
                const kanbanScriptClass = require('./kanbanScript').KanbanScript
                new kanbanScriptClass().init()
            })
            .catch(error => console.error(error))
        }

        document.getElementById('saveStepsVis').addEventListener('click', () => saveData())

        // По нажатию на кнопку показывать vis
        showVis.addEventListener('click', () => {
            network.stabilize()
            visHolder.classList.remove('d-hide')
            showVis.classList.add('d-hide')
            draw()
        })
        hideVis.addEventListener('click', () => {
            showVis.classList.remove('d-hide')
            visHolder.classList.add('d-hide')
        })

        // Удаление всех шагов и структуры vis
        if (access == 'full') document.getElementById('deleteStepsVis').addEventListener('click', () => {
            if (confirm('Это действие удалит все шаги и структуру, вы уверены?')) {
                
                // Удаляем все шаги
                for (let key in network.body.data.nodes._data) {
                    fetch('/office/steps/delete', {
                        method: 'DELETE',
                        body: JSON.stringify({id: key, _csrf: document.getElementById('csrfToken').value, active: 0}), 
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })
                    .then(res => {
                        return res.json()
                    })
                    .catch(error => console.error(error))
                }

                // Отчищаем все kanban`ы
                fetch('/office/pipes/clearKanbans', {
                    method: 'POST',
                    body: JSON.stringify({id: +location.pathname.split('/')[3], _csrf: document.getElementById('csrfToken').value}), 
                    headers:{
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    console.log('clear done')
                    document.getElementById('kanbanList').innerHTML = ''
                    draw()
                })
            }
        })

        document.getElementById('visFullScreen').onclick = event => {
            container.classList.add('full-screen')
            draw()
            document.getElementById('exitFullScreen').classList.remove('d-hide')
            document.getElementById('reloadVisBtn').classList.add('full-screen')
            document.getElementById('strictBtnHolder').classList.add('full-screen')
            document.getElementById('saveStepsVis').classList.add('full-screen')
        }

        document.getElementById('exitFullScreen').onclick = event => {
            container.classList.remove('full-screen')
            draw()
            event.target.classList.add('d-hide')
            document.getElementById('reloadVisBtn').classList.remove('full-screen')
            document.getElementById('strictBtnHolder').classList.remove('full-screen')
            document.getElementById('saveStepsVis').classList.remove('full-screen')
        }
    })
    .catch(error => console.error(error))
}