import Sortable from 'sortablejs'
import Cleave from 'cleave.js'
import { setTimeout } from 'timers'
import { async } from 'q';
const accounting = require('../../accounting.min.js')

const access = document.getElementById('access').value

export class KanbanScript {
	constructor() {
		this.init()
	}

	init (id) {
		fetch('/office/getPipes', {
			method: 'POST',
			body: JSON.stringify({id: +location.pathname.split('/')[3], _csrf: document.getElementById('csrfToken').value}), 
			headers:{
				"Content-Type": "application/json"
			}
		}).then(result => {
			return result.json()
		})
		.then(result => {
			const allStepsHolder = document.getElementById('kanbanStepsHolder')
			const kanbanChangeHolder = document.getElementById('kanbanList')
			kanbanChangeHolder.querySelectorAll('*').forEach(el => el.remove())

      this.data = result

			const format = data => {
				data += ''
				return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
			}

			for (let key in result.pipe.kanban) {
				const btn = document.createElement('button')
				btn.classList.add('btn')
				btn.classList.add('btn-sm')
				if (id === key) btn.classList.add('btn-primary')
				if (result.pipe.kanban[key].title.trim()) btn.innerText = result.pipe.kanban[key].title
				else btn.innerText = 'Без названия'
				btn.dataset.kanbanId = key

				const kanbanBtns = document.createElement('div')
				kanbanBtns.classList.add('input-group', 'm-1')
				kanbanBtns.insertAdjacentElement('beforeend', btn)

				const editBtn = document.createElement('button')
				editBtn.innerHTML = `<img src="images/edit.svg" alt="Редактировать воронку">`
				editBtn.classList.add('btn')
				editBtn.classList.add('btn-sm')
				editBtn.classList.add('d-hide')
				editBtn.classList.add('js-editKanban')
				kanbanBtns.insertAdjacentElement('beforeend', editBtn)

				btn.onclick = event => {
					kanbanChangeHolder.querySelectorAll('button').forEach(btn => {
						btn.disabled = false
					})
					btn.disabled = true
					document.getElementById('kanbanStepsList').classList.remove('d-hide')
					document.querySelectorAll('#kanbanList button').forEach(button => button.classList.remove('btn-primary'))
					btn.classList.add('btn-primary')
					const kanbanId = event.target.dataset.kanbanId
					document.getElementById('kanbanTitleHolder').innerText = result.pipe.kanban[key].title

					document.querySelectorAll('#kanbanStepsHolder > *').forEach(el => el.remove())
					document.getElementById('stepsHolder').innerHTML = ''

					allStepsHolder.onmousedown = () => {
						if (allStepsHolder.classList.contains('dragscroll'))
						allStepsHolder.classList.add('grabbing')
						else 
						allStepsHolder.classList.add('c-not-allowed')
					}
					allStepsHolder.onmousemove = event => {
						if (event.buttons > 0 && allStepsHolder.classList.contains('dragscroll')) {
							allStepsHolder.classList.add('grabbing')
						} else {
							allStepsHolder.classList.remove('grabbing')
							allStepsHolder.classList.remove('c-not-allowed')
						}
					}

					const stpesPromises = []

					const saveStepsInKanban = () => {
						const steps = []
						if (access == 'full') document.querySelectorAll('#stepsHolder input').forEach(input => {
							fetch('/office/steps/edit', {
								method: 'POST',
								body: JSON.stringify({
									id: input.name,
									title: input.value,
									_csrf: document.getElementById('csrfToken').value
								}), 
								headers:{
									"Content-Type": "application/json"
								}
							}).catch(error => console.error(error))
							steps.push(input.name)
						})
						
						if (access == 'full') fetch('/office/pipes/' + location.pathname.split('/')[3], {
							method: 'POST',
							body: JSON.stringify({
								id: +location.pathname.split('/')[3],
								title: document.getElementById('pipeTitle').value,
								kanban: {
									title: document.getElementById('kanbanTitle').innerText,
									description: '',
									steps: steps
								},
								key: key,
								_csrf: document.getElementById('csrfToken').value
							}), 
							headers:{
								"Content-Type": "application/json"
							}
						}).then(res => {
							return res.json()
						}).then(res => {
							this.init(key)
						})
						.catch(error => console.error(error))
					}

					result.pipe.kanban[kanbanId].steps.forEach(id => {
						let stepData
						for (let key in result.steps) {
							if (+result.steps[key].id === +id) stepData = result.steps[key]
						}

						if (!stepData) return

						document.querySelectorAll('.js-editKanban').forEach(el => el.classList.add('d-hide'))
						editBtn.classList.remove('d-hide')

						if (access == 'full') editBtn.onclick = event => {
							if (result.pipe.kanban[key].title.trim()) modalTitle().innerText = document.getElementById('kanbanTitleChangeInput').value = result.pipe.kanban[key].title
							else modalTitle().innerText = document.getElementById('kanbanTitleChangeInput').value = 'Без названия'
							document.getElementById('kanbanStepsList').classList.add('active')
						}

						stpesPromises.push(fetch('/office/lids/getListByStep', {
							method: 'POST',
							body: JSON.stringify({id: stepData.id, _csrf: document.getElementById('csrfToken').value}),
							headers:{
								"Content-Type": "application/json"
							}
						}).then(result => result.json()).then(result => {
							const ret = {}
							ret['stepData'] = stepData
							ret['lids'] = result
							return ret
						}))
						
						document.getElementById('saveStepsBtn').onclick = saveStepsInKanban
					})

					Promise.all(stpesPromises).then(result => {
						result.forEach(step => {
              const els = {}
		
							els.step = document.createElement('div')
							els.step.classList.add('card', 'step')
							els.step.dataset.id = step.stepData.id
							els.step.dataset.title = step.stepData.title
							els.stepTitle = document.createElement('div')
							els.stepTitle.classList.add('h5', 'text-center', 'bg-dark', 'step-title')
							els.stepTitle.innerText = step.stepData.title
							els.stepTitle.title = step.stepData.title
							els.step.insertAdjacentElement('afterbegin', els.stepTitle)
							els.content = document.createElement('div')
							els.content.dataset.id = step.stepData.id
							els.content.classList.add('step-content')

							const drawLid = lid => {
                console.log(lid)

								// Весь лид
								const lidCard = document.createElement('div')
								lidCard.classList.add('card', 'm-2', 'bg-secondary', 'lid', 'animated')
								lidCard.dataset.data = JSON.stringify(lid)

								// Его голова
								const lidHeader = document.createElement('div')
								fetch('/office/contacts/', {
									method: 'POST',
									body: JSON.stringify({
										id: lid.holder,
										find: 'byid',
										_csrf: document.getElementById('csrfToken').value,
									}), 
									headers:{
										"Content-Type": "application/json"
									}
								}).then(res => res.json()).then(data => {
									lidHeader.querySelector('small').innerText = data.length && data[0].title ? data[0].title : 'Неизвестный'
								})
								lidHeader.innerHTML = '<small>?</small><h6 class="text-bold">'+lid.title+'</h6>'
								lidHeader.classList.add('lid-header')

								// Кнопка перетаскивания лида
								const dragLid = document.createElement('i')
								dragLid.classList.add('float-right', 'icon', 'icon-menu', 'lid-drag')
								lidCard.insertAdjacentElement('afterbegin', dragLid)
								lidCard.insertAdjacentElement('afterbegin', lidHeader)

								// Его тело
								const lidBody = document.createElement('div')
								lidBody.classList.add('lid-body', 'd-flex')

								// Номер телефона в теле
								const phone = document.createElement('div')
								phone.innerHTML = '<div class="loading"></div>'
								fetch('/office/phones/', {
									method: 'POST',
									body: JSON.stringify({
										parent: lid.holder,
										find: 'byparent',
										_csrf: document.getElementById('csrfToken').value,
									}), 
									headers:{
										"Content-Type": "application/json"
									}
								}).then(res => res.json()).then(data => {
									phone.innerHTML = data.length && data[0].phone ? '+7' + data[0].phone : 'Номера телефона нет'
								})
								lidBody.insertAdjacentElement('beforeend', phone)
								lidCard.insertAdjacentElement('beforeend', lidBody)
								els.content.insertAdjacentElement('beforeend', lidCard)

								// Футер лида
								const lidFooter = document.createElement('div')
								lidFooter.classList.add('lid-footer')
								lidFooter.innerHTML = '<span class="label label-primary">'+accounting.formatMoney(lid.gi, '', 0, " ", ",")+' р.</span><div class="float-right">'+format(new Date(lid.created).getMonth())+'.'+format(new Date(lid.created).getDate())+'.'+new Date(lid.created).getFullYear()+' '+format(new Date(lid.created).getHours())+':'+format(new Date(lid.created).getMinutes())+'</div>'

								// Открытие меню лида
								const expandLidBtn = document.createElement('button')
								expandLidBtn.classList.add('btn','btn-link','btn-sm','btn-action','s-circle', 'expand', 'icon', 'icon-arrow-down', 'd-hide')
								lidBody.insertAdjacentElement('beforeend', expandLidBtn)

								// Меню лида
								const lidMenu = document.createElement('div')
								lidMenu.classList.add('lid-menu', 'd-hide', 'animated')

								// Табы лида
								const lidMenuTabs = document.createElement('ul')
								lidMenuTabs.classList.add('tab', 'tab-block')
								const lidMenuTabsArr = ['Карточка', 'Задачи', 'История']
								lidMenuTabsArr.forEach((tab, id) => lidMenuTabs.insertAdjacentHTML('beforeend','<li class="tab-item"><a name="'+(++id)+'">'+tab+'</a></li>'))

								lidMenuTabs.querySelectorAll('a').forEach(a => a.onclick = () => {
									lidMenuTabs.querySelectorAll('li').forEach(li => li.classList.remove('active'))
									a.parentElement.classList.add('active')

									lidCard.querySelectorAll('.menu-tab').forEach(tab => tab.name != a.name ? tab.classList.add('d-hide') : tab.classList.remove('d-hide'))
								})

								lidMenuTabs.querySelector('li:nth-child(2)').classList.add('active')
								lidMenu.insertAdjacentElement('beforeend', lidMenuTabs)

								// Функция обновления внешней информации лида
								const rewriteLid = () => {
									Promise.all([
										fetch('/office/contacts/', {
											method: 'POST',
											body: JSON.stringify({
												id: lid.holder,
												find: 'byid',
												_csrf: document.getElementById('csrfToken').value,
											}), 
											headers:{
												"Content-Type": "application/json"
											}
										}).then(res => res.json()),
										fetch('/office/phones/', {
											method: 'POST',
											body: JSON.stringify({
												parent: lid.holder,
												find: 'byparent',
												_csrf: document.getElementById('csrfToken').value,
											}), 
											headers:{
												"Content-Type": "application/json"
											}
										}).then(res => res.json()),
									])
									.then(data => {
										const contact = data[0][0]
										const phone = data[1][0]

										const cont = contact.title ? contact.title : 'Неизвестный' 
										lidHeader.innerHTML = '<small>'+cont+'</small><h6 class="text-bold">'+lid.title+'</h6>'
										phone.innerText = '+7' + phone.phone
										lidFooter.innerHTML = '<span class="label label-primary">'+accounting.formatMoney(lid.gi, '', 0, " ", ",")+' р.</span><div class="float-right">'+format(new Date(lid.created).getMonth())+'.'+format(new Date(lid.created).getDate())+'.'+new Date(lid.created).getFullYear()+' '+format(new Date(lid.created).getHours())+':'+format(new Date(lid.created).getMinutes())+'</div>'
									})
								}

								const sendData = history => {
									!lid.lid_data ? lid.lid_data = {tasks:[]} : lid.lid_data.tasks = []
									list.querySelectorAll('dd').forEach(dd => {
										lid.lid_data.tasks.push({
											title: dd.querySelector('[name="title"]').innerText,
											done: dd.querySelector('input').checked,
											date: dd.querySelector('[name="calendar"]').dataset.date,
											time: dd.querySelector('[name="time"]').dataset.time,
											author: dd.querySelector('figure.avatar').dataset.userId,
										})
									})
									lid._csrf = document.getElementById('csrfToken').value

									if (history) lid.lid_data.history.push(history)
									drawHistory()
									rewriteLid()

									if (access == 'full') return fetch('/office/lids/update', {
										method: 'POST',
										body: JSON.stringify(lid), 
										headers:{
											"Content-Type": "application/json"
										}
									})
								}

								const editTaskBtnEvent = dd => {
									const button = dd.querySelector('[name="title"]')
									const oldTitle = button.innerText
									button.onclick = event => {
										const input = dd.parentElement.parentElement.querySelector('.card-footer input')
										input.value = button.innerText

										input.focus()
										input.classList.remove('is-error')

										const send = (event, input) => {
											const data = {
												when: new Date().toISOString(),
												author: null,
												oldTitle: oldTitle,
												newTitle: input.value
											}
											if ((input.value.trim()+'').length > 0){
												button.innerText = input.value
												data.type = 'editTitleTask'
											} else {
												dd.remove()
												data.type = 'removeTask'
											}
											event.target.disabled = true

											sendData(data).then(() => {
												defaultNewTaskFnc(input)
												event.target.disabled = false
												event.target.focus()
											})
											input.value = ''
										}

										input.onkeydown = event => {
											if (event.key === 'Escape' || (event.key === 'Enter' && oldTitle == input.value)) {
												input.value = ''
												input.onblur = null
												defaultNewTaskFnc(input)
											} else 
											if (event.key === 'Enter') {
												input.onblur = null
												send(event, input)
											}
										}

										input.onblur = () => {
											send(event, input)
											input.classList.remove('is-error')
											input.onblur = null
										}
									}
								}

								const initCalendar = (dateDiv, timeDiv, lidId) => {
									if (access == 'full') dateDiv.onclick = event => {
										const calendar = new dhx.Calendar(null, { weekStart: "monday", thisMonthOnly: true, timePicker: true })

										const dateBefore = new Date(new Date(20+event.target.dataset.date.split('/')[2], event.target.dataset.date.split('/')[1]-1, event.target.dataset.date.split('/')[0], timeDiv.dataset.time.split(':')[0], timeDiv.dataset.time.split(':')[1]))
										calendar.setValue(dateBefore)

										const popup = new dhx.Popup()
										popup.attach(calendar)
											
										popup.hide()
										if (!document.querySelector('.dhx_widget')) {
											event.preventDefault()

											calendar.events.on('change', date => {
												console.log(calendar.getValue())
												const oldDate = event.target.innerText

												// dhx fix - потеря в 1 день ¯\_(ツ)_/¯
												date.setDate(date.getDate() + 1)

												const iso = date.toISOString()

												event.target.innerText = `${iso.slice(8,10)}.${iso.slice(5,7)}`
												timeDiv.innerText = `${iso.slice(11,13)}:${iso.slice(14,16)}`

												event.target.dataset.date = iso.slice(8,10) + '/' + iso.slice(5,7) + '/' + iso.slice(2,4)
												timeDiv.dataset.time = iso.slice(11,13) + ':' + iso.slice(14,16)
												
												sendData({
													type: 'editDateTask',
													when: new Date().toISOString(),
													author: null,
													title: event.target.parentElement.querySelector('[name="title"]').innerText,
													oldDate: oldDate,
													newDate: event.target.innerText
												})
												popup.hide()
											})
											
											popup.show(event.target) 
										}
									}
								}

								const initTimepicker = (timeDiv, lidId) => {
									if (access == 'full') timeDiv.onclick = event => {
										const timepicker = new dhx.Timepicker(null, {actions: true})
										timepicker.setValue(new Date(null, null, null, new Date().getHours()+1))
										const popup = new dhx.Popup()
										popup.attach(timepicker)

										popup.hide()
										if (!document.querySelector('.dhx_widget')) {
											timepicker.events.on('save', () => {
												const oldTime = event.target.innerText
												event.target.innerText = event.target.dataset.time = timepicker.getValue()
												sendData({
													type: 'editTimeTask',
													when: new Date().toISOString(),
													author: null,
													title: event.target.parentElement.querySelector('[name="title"]').innerText,
													oldTime: oldTime,
													newTime: event.target.innerText
												})
												popup.hide()
											})
											
											popup.show(event.target)
											popup.events.on('aftershow', () => {
												document.querySelectorAll('.dhx_timepicker__button-close').forEach(button => button.addEventListener('click', () =>popup.hide()))
											})
										}
									}
								}

								// Функции для получения форматов даты и времени
								const getTodayDateFormat = () => `${format(new Date().getDate())}/${format(new Date().getMonth())}/${(new Date().getFullYear()+'').substring(2)}`

								const getTodayTimeFormat = () => `${format(new Date().getMinutes())}:${format(new Date().getMinutes())}`

								// Задачи
								const tasks = document.createElement('div')
								tasks.classList.add('tasks', 'menu-tab')
								tasks.name = 2
								const list = document.createElement('dl')
								list.dataset.lid = lid.id
								
								if (access == 'full') new Sortable(list, {
									animation: 150,
									handle: '.taskDragger',
									onEnd: () => {
										sendData()
                  }
								})

								const addTaskAuthorSelect = dd => {
									if (access == 'full') dd.querySelector('figure.avatar').onclick = event => {
										document.getElementById('usersListModal').classList.add('active')

										const body = document.getElementById('usersList')
										const conf = document.getElementById('confirmUserSelect')
										const rej = document.getElementById('rejectUserSelect')

										conf.disabled = true

										body.innerHTML = ''
										body.insertAdjacentHTML('beforeend', `<div class="loading"></div>`)
										fetch('/office/users', {
											method: 'POST',
											body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value}), 
											headers:{
												"Content-Type": "application/json"
											}
										}).then(result => result.json()).then(result => {
											body.innerHTML = ''

											result.forEach(user => {
												body.insertAdjacentHTML('beforeend', `
													<div class="tile p-2 c-hand user" data-user-id="${user.id}" data-fio="${user.fio}">
														<div class="tile-icon">
															<figure class="avatar avatar-sm" data-initial="${user.fio.trim() ? user.fio.slice(0,1) : '?' }"></figure>
														</div>
														<div class="tile-content">
															<div class="tile-title">${user.fio ? user.fio : user.login}</div>
														</div>
													</div>
												`)

												body.querySelectorAll('.user').forEach(el => {
													el.onclick = event => {
														body.querySelectorAll('.user').forEach(el => el.classList.remove('active'))
														el.classList.add('active')
														conf.disabled = false
													}
												})
											})

											conf.onclick = event => {
												const outerAvatar = dd.querySelector('figure.avatar')
												const userEl = body.querySelector('.user.active')
												outerAvatar.dataset.userId = userEl.dataset.userId
												outerAvatar.dataset.initial = userEl.dataset.fio.trim() ? userEl.dataset.fio.split(' ')[1] ? userEl.dataset.fio.split(' ')[0].slice(0,1) + userEl.dataset.fio.split(' ')[1].slice(0,1) :
												userEl.dataset.fio.slice(0,1) : '?'
												outerAvatar.title = userEl.dataset.fio
												sendData()
												document.getElementById('usersListModal').classList.remove('active')
												body.innerHTML = ''
												conf.disabled = true
											}

											rej.onclick = event => {
												document.getElementById('usersListModal').classList.remove('active')
												body.innerHTML = ''
												conf.disabled = true
											}
										})
									}
								}

								if (!!lid.lid_data && !!lid.lid_data.tasks) {
									lid.lid_data.tasks.forEach(task => {
										const dd = document.createElement('dd')
										task.date ? task.date = task.date : task.date = getTodayDateFormat()
										task.time ? task.time = task.time : task.time = getTodayTimeFormat()
										const dateToShow = `${format(task.date.slice(0,2))}.${format(task.date.slice(3,5))}`
										dd.innerHTML = 
											`<div class="taskDraggerHolder"><i class="icon icon-menu taskDragger"></i></div>
											<div class="form-checkbox">
												<input type="checkbox" ${task.done ? 'checked' : ''}>
												<i class="form-icon"></i>
												<div name="titleHolder">
													<div name="calendar" data-date="${task.date}" data-lid="${lid.id}" title="Изменить дату">${dateToShow}</div>
													<div name="time" data-time="${task.time}" title="Изменить время">${task.time}</div>
													<div name="title" title="Изменить название">${task.title}</div>
												</div>
												<figure class="avatar avatar-sm" data-initial="?"></figure>
											</div>`

										if (task.author)
										fetch('/office/users', {
											method: 'POST',
											body: JSON.stringify({ id: task.author, find: 'byid', _csrf: document.getElementById('csrfToken').value }), 
											headers:{ "Content-Type": "application/json" }
										}).then(result => result.json()).then(result => {
											if (!result[0]) return
											dd.querySelector('figure.avatar').dataset.initial = result[0].fio.slice(0,1) 
											if (result[0].fio.split(' ')[1]) dd.querySelector('figure.avatar').dataset.initial += result[0].fio.split(' ')[1].slice(0,1)
											if (!dd.querySelector('figure.avatar').dataset.initial.trim()) dd.querySelector('figure.avatar').dataset.initial = '?'
											dd.querySelector('figure.avatar').title = result[0].fio ? result[0].fio : result[0].login
										})

										editTaskBtnEvent(dd)
										initCalendar(dd.querySelector('[name="calendar"]'), dd.querySelector('[name="time"]'), lid.id)
										initTimepicker(dd.querySelector('[name="time"]'), lid.id)
										addTaskAuthorSelect(dd)

										if (access == 'full') dd.querySelector('i.form-icon').onclick = event => {
											const input = dd.querySelector('input')
											if (input.checked) {
												input.checked = false
												sendData({
													type: 'declineTask',
													when: new Date().toISOString(),
													author: null,
													title: task.title
												})
											} else {
												input.checked = true
												sendData({
													type: 'compleateTask',
													when: new Date().toISOString(),
													author: null,
													title: task.title
												})
											}
										}

										list.insertAdjacentElement('beforeend', dd)
									})
								}

								tasks.insertAdjacentElement('beforeend', list)

								const newTask = document.createElement('input')
								newTask.type = 'text'
								newTask.classList.add('form-input', 'input-sm')

								const defaultNewTaskFnc = input => {
									input.onkeydown = event => {
										if ((input.value.trim()+'').length <= 0) input.classList.add('is-error')
										else input.classList.remove('is-error')

										if (event.code === 'Enter' && (input.value.trim()+'').length > 0) {
											event.target.disabled = true
	
											const dateToShow = `${getTodayDateFormat().substring(2,-9)}.${getTodayDateFormat().substring(5,3)}`
											const dd = document.createElement('dd')
											dd.innerHTML = 
												`<div class="taskDraggerHolder"><i class="icon icon-menu taskDragger"></i></div>
												<div class="form-checkbox">
													<input type="checkbox">
													<i class="form-icon"></i>
													<div name="titleHolder">
														<div name="calendar" data-date="${getTodayDateFormat()}" data-lid="${lid.id}" title="Изменить дату">${dateToShow}</div>
														<div name="time" data-time="${getTodayTimeFormat()}" title="Изменить время">${getTodayTimeFormat()}</div>
														<div name="title" title="Изменить название">${input.value}</div>
													</div>
													<figure class="avatar avatar-sm" data-initial="?"></figure>
												</div>`
	
											list.insertAdjacentElement('beforeend', dd)
											lid._csrf = document.getElementById('csrfToken').value
	
											editTaskBtnEvent(dd)
											initCalendar(dd.querySelector('[name="calendar"]'), dd.querySelector('[name="time"]'), lid.id)
											initTimepicker(dd.querySelector('[name="time"]'), lid.id)
											addTaskAuthorSelect(dd)

											if (access == 'full') dd.querySelector('i.form-icon').onclick = event => {
												const input = dd.querySelector('input')
												if (input.checked) {
													input.checked = false
													sendData({
														type: 'declineTask',
														when: new Date(),
														author: null,
														title: event.target.parentElement.querySelector('[name="titleHolder"] [name="title"]').innerText
													})
												} else {
													input.checked = true
													sendData({
														type: 'compleateTask',
														when: new Date(),
														author: null,
														title: event.target.parentElement.querySelector('[name="titleHolder"] [name="title"]').innerText
													})
												}
											}
	
											sendData({
												type: 'newTask',
												when: new Date().toISOString(),
												author: null,
												title: input.value
											}).then(() => {
												event.target.value = ''
												event.target.disabled = false
												event.target.focus()
											})
										}
									}
								}
								defaultNewTaskFnc(newTask)

								list.querySelectorAll('.taskDragger').forEach(el => {
									el.onmousedown = event => {
										allStepsHolder.classList.remove('dragscroll')
										require('../../dragscroll').reset()
									}
								})

								list.querySelectorAll('.taskDragger').forEach(el => {
									el.onmouseup = event => {
										if (!allStepsHolder.classList.contains('dragscroll')) {
											allStepsHolder.classList.add('dragscroll')
											require('../../dragscroll').reset()
										}
									}
								})

								const newTaskHolder = document.createElement('div')
								newTaskHolder.classList.add('card-footer', 'input-group')
								newTaskHolder.insertAdjacentElement('beforeend', newTask)
								tasks.insertAdjacentElement('beforeend', newTaskHolder)

								// История
								const lidStory = document.createElement('div')
								lidStory.classList.add('story', 'menu-tab', 'd-hide')
								lidStory.name = 3

								const fullStorySwitch = document.createElement('div')
								fullStorySwitch.classList.add('form-group', 'm-0', 'pl-2')
								fullStorySwitch.innerHTML = `
									<label class="form-switch">
										<input type="checkbox">
										<i class="form-icon"></i> Полная история
									</label>
								`
								fullStorySwitch.querySelector('input').oninput = event => {
									console.log(timeline.querySelectorAll('.timeline-left'))
									timeline.querySelectorAll('.timeline-item').forEach(el => el.classList.contains('unnecessary') && !event.target.checked ? el.classList.add('d-hide') : el.classList.remove('d-hide'))
								}

								const timeline = document.createElement('div')
								timeline.classList.add('timeline')

								// Проверяем на наличие данных
								if (!lid.lid_data) lid.lid_data = {}
								if (!lid.lid_data.history) lid.lid_data.history = []
								
								const drawHistory = () => {
									timeline.innerHTML = ''
									const lidHistory = Array.from(lid.lid_data.history.reverse())
									lidHistory.forEach(hm => {
										const history = document.createElement('div')
										history.classList.add('timeline-item')
	
										const historyIcon = document.createElement('div')
										historyIcon.classList.add('timeline-left')
										historyIcon.innerHTML = `<a class="timeline-icon"></a>`
										history.insertAdjacentElement('afterbegin', historyIcon)

										const insertIcon = (icon, subClasses = []) => {
											history.classList.add('icon-lg')
											const a = historyIcon.querySelector('a')
											a.classList.add('icon-lg')
											subClasses.forEach(c => a.classList.add(c))
											a.insertAdjacentElement('beforeend', icon)
										}
	
										const historyContent = document.createElement('div')
										historyContent.classList.add('timeline-content')
	
										// Обрабатываем дату истории
										const when = !hm.when ? '...' :
										format(new Date(hm.when).getDate()) + '.' + format(new Date(hm.when).getMonth()) + ' ' + format(new Date(hm.when).getHours()) + ':' + format(new Date(hm.when).getMinutes())
	
										// Обрабатываем время звонка
										const hours = Math.floor(hm.duration / 60 / 60 % 60) ? Math.floor(hm.duration / 60 / 60 % 60) : null
										const minutes = Math.floor(hm.duration / 60 % 60)
										const seconds = Math.floor(hm.duration % 60)

										const duration = !hm.duration ? '<неизвестно>' :
										hours ? format(hours) + ':' + format(minutes) + ':' + format(seconds) : format(minutes) + ':' + format(seconds)
										
										const icon = document.createElement('i')

										const togglePlayer = html => {
											const tagA = html.querySelector('a')
											const audioPlayer = html.querySelector('audio')
											tagA.onclick = () => {
												if (audioPlayer.classList.contains('d-hide')) {
													audioPlayer.pause()
													audioPlayer.currentTime = 0
												} else audioPlayer.focus()
												audioPlayer.classList.toggle('d-hide')
											}
											audioPlayer.onblur = () => {
												audioPlayer.pause()
												audioPlayer.currentTime = 0
												audioPlayer.classList.add('d-hide')
											}
										}
											
										switch (hm.type) {
											// Лид создан
											case 'create' :
												icon.classList.add('icon', 'icon-plus')
												insertIcon(icon)
												const getBy = 
												hm.from == 'phonecall' ?
												'звонок по телефону ' + hm.diversion :
												hm.from == 'website' ? 
												'сайт' :
												'неизвестный источник'
												historyContent.innerHTML = `<span name="time">${when}</span> Заявка принта через ${getBy} ${hm.author ? 'пользователем <b>' + hm.author + '</b>' : ''}`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Лид передвинут по шагам
											case 'progress' :
												icon.classList.add('icon', 'icon-share')
												insertIcon(icon)
												historyContent.innerHTML = `<span name="time">${when}</span> Лид был перемещён с шага «${hm.oldStep}» на «${hm.newStep}»`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Входящий звонок, связанный с лидом
											case 'callIn' :
												icon.classList.add('icon', 'icon-download')
												insertIcon(icon, ['bg-success'])
												historyContent.innerHTML = `<span name="time">${when}</span> <a>Входящий вызов <i class="icon icon-arrow-up"></i></a> ${hm.status != 'Success' ? 'был пропущен' : 'был принят'} пользователем <b>${hm.author}</b> ${duration ? 'продолжительностью <b>' + duration + '</b>' : ''} ${hm.link ? `<audio src="${hm.link}" controls class="d-hide"></audio>` : ''}`
												togglePlayer(historyContent)
											break

											// Исходящий звонок, связанный с лидом
											case 'callOut' :
												icon.classList.add('icon', 'icon-upload')
												insertIcon(icon)
												historyContent.innerHTML = `<span name="time">${when}</span> <a>Исходящий вызов <i class="icon icon-arrow-up"></i></a> ${hm.status != 'Success' ? 'был пропущен' : 'был принят'} пользователем <b>${hm.author}</b> ${duration ? 'продолжительностью <b>' + duration + '</b>' : ''} ${hm.link ? `<audio src="${hm.link}" controls class="d-hide"></audio>` : ''}`
												togglePlayer(historyContent)
											break

											// Пропущенный звонок, связанный с лидом
											case 'callMissed' :
												icon.classList.add('icon', 'icon-more-horiz')
												insertIcon(icon, ['bg-error'])
												historyContent.innerHTML = `<span name="time">${when}</span> <a>Вызов <i class="icon icon-arrow-up"></i></a> ${hm.status != 'Success' ? 'был пропущен' : 'был принят'} пользователем <b>${hm.author}</b> ${duration ? 'продолжительностью <b>' + duration + '</b>': ''} ${hm.link ? `<audio src="${hm.link}" controls class="d-hide"></audio>` : ''}`
												togglePlayer(historyContent)
											break

											// Создание новой задачи
											case 'newTask' :
												historyContent.innerHTML = `<span name="time">${when}</span> Создана новая задача «${hm.title}»`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Редактирование названия задачи
											case 'editTitleTask' :
												icon.classList.add('icon', 'icon-edit')
												insertIcon(icon, ['bg-warning'])
												historyContent.innerHTML = `<span name="time">${when}</span> Задача «${hm.oldTitle}» теперь называется «${hm.newTitle}»`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Редактирование даты задачи
											case 'editDateTask' :
												historyContent.innerHTML = `<span name="time">${when}</span> Дата выполнения задачи «${hm.title}» перенесена с ${hm.oldDate} на ${hm.newDate}`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Редактирование время задачи
											case 'editTimeTask' :
												historyContent.innerHTML = `<span name="time">${when}</span> Время выполнения «${hm.title}» задачи перенесено с ${hm.oldTime} на ${hm.newTime}`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Выполнение задачи
											case 'compleateTask' : 
												icon.classList.add('icon', 'icon-check')
												insertIcon(icon, ['bg-success'])
												historyContent.innerHTML = `<span name="time">${when}</span> Задача «${hm.title}» выполнена`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Отмена выполнения задачи
											case 'declineTask' : 
												icon.classList.add('icon', 'icon-cross')
												insertIcon(icon, ['bg-error'])
												historyContent.innerHTML = `<span name="time">${when}</span> Выполнение задачи «${hm.title}» было отменено`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Удаление задачи
											case 'removeTask' : 
												icon.classList.add('icon', 'icon-delete')
												insertIcon(icon)
												historyContent.innerHTML = `<span name="time">${when}</span> Задача «${hm.oldTitle}» удалена`
												history.classList.add('unnecessary', 'd-hide')
											break 

											// Запись новых данных
											case 'newData' :
												icon.classList.add('icon', 'icon-edit')
												insertIcon(icon, ['bg-success'])
												historyContent.innerHTML = `<span name="time">${when}</span>Добавлено значение «${hm.title}»: ${hm.value}`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Редактирование данных
											case 'editData' :
												icon.classList.add('icon', 'icon-edit')
												insertIcon(icon, ['bg-warning'])
												historyContent.innerHTML = `<span name="time">${when}</span> Значение «${hm.title}» изменено на ${hm.newValue}, было ${hm.oldValue}`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Удаление / отчищение данных
											case 'removeData' :
												icon.classList.add('icon', 'icon-edit')
												insertIcon(icon, ['bg-error'])
												historyContent.innerHTML = `<span name="time">${when}</span> Значение «${hm.title}» было отчищено`
												history.classList.add('unnecessary', 'd-hide')
											break

											// Редактирование коментария
											case 'editComment' :
												icon.classList.add('icon', 'icon-edit')
												insertIcon(icon, ['bg-warning'])
												historyContent.innerHTML = `<span name="time">${when}</span> Внесенны изменения в коментарий`
												history.classList.add('unnecessary', 'd-hide')
											break
										}
										history.insertAdjacentElement('beforeend', historyContent)
										timeline.insertAdjacentElement('beforeend', history)
									})
									lid.lid_data.history.reverse()
								}
								drawHistory()
								lidCard.ondragend = () => drawHistory()
								lidStory.insertAdjacentElement('beforeend', fullStorySwitch)
								lidStory.insertAdjacentElement('beforeend', timeline)

								// Карточка
								const aboutLid = document.createElement('dl')
								aboutLid.classList.add('about', 'menu-tab', 'd-hide')
								aboutLid.name = 1

								const createDivider = text => {
									const divider =  document.createElement('div')
									divider.classList.add('divider', 'text-center')
									divider.dataset.content = text+''
									aboutLid.insertAdjacentElement('beforeend', divider)
								}

								const aboutParams = [
									{ title: 'Название', value: lid.title, key: 'title', type: 'text', max: 120 },
									{ title: 'Вал', value: lid.gi, key: 'gi', type: 'money' },
									{ title: 'Маржа', value: lid.cgi, key: 'cgi', type: 'money' },
									{ title: 'Предоплата', value: lid.prepayment, key: 'prepayment', type: 'money' },
									{ title: 'Доплата', value: lid.restpayment, key: 'restpayment', type: 'money' },
									// { title: 'Телефон', value: lid.phone, key: 'phone', type: 'phone' },
								]

								aboutParams.forEach(param => {
									const dd = document.createElement('dd')
									dd.classList.add('d-flex')

									const title = document.createElement('div')
									title.innerText = param.title
									title.classList.add('title')
									dd.insertAdjacentElement('beforeend', title)

									const input = document.createElement('input')
									input.value = param.value
									input.dataset.old = param.value
									input.dataset.key = param.key

									const cleave = param.type == 'money' ?
										new Cleave(input, {
											numeral: true,
											delimiter: ' ',
										}) : null

									if (param.type != 'money') input.value = param.value

									const save = () => {
										input.disabled = true
										const value = cleave ? cleave.getRawValue() : input.value
										
										lid[input.dataset.key] = value+''

										const newHistory = {
											type: 'newData',
											when: new Date().toISOString(),
											author: null,
											title: input.parentElement.querySelector('.title').innerText,
											value: value
										}

										const editHistory = {
											type: 'editData',
											when: new Date().toISOString(),
											author: null,
											title: input.parentElement.querySelector('.title').innerText,
											oldValue: input.dataset.old,
											newValue: value
										}

										const removeHistory = {
											type: 'removeData',
											when: new Date().toISOString(),
											author: null,
											title: input.parentElement.querySelector('.title').innerText
										}

										if (input.dataset.old != value){
											if (input.dataset.old.length == 0)
											sendData(newHistory)
											.then(() => input.dataset.old = value)

											else if (value.trim().length != 0)
											sendData(editHistory)
											.then(() => input.dataset.old = value)

											else sendData(removeHistory)
											.then(() => input.dataset.old = value)
										}
										input.dataset.old = value

										aboutLid.querySelectorAll('dd input').forEach(input => input.disabled = false)
									}

									input.onkeyup = event => {
										if (event.code == 'Enter') save()
									}
									input.onblur = save

									input.placeholder = '...'
									dd.insertAdjacentElement('beforeend', input)

									aboutLid.insertAdjacentElement('beforeend', dd)
								})
								
								createDivider('Коментарий')

								const comment = document.createElement('textarea')
								comment.value = comment.dataset.old = lid.lid_data.commnet ? lid.lid_data.commnet : ''
								const sendComment = document.createElement('button')
								sendComment.classList.add('btn', 'btn-sm')
								sendComment.disabled = true
								sendComment.innerText = 'Сохранить'
								if (access == 'full') sendComment.onclick = event => { 
									if (comment.value != comment.dataset.old) {
										sendComment.disabled = true
										lid.lid_data.commnet = comment.value
										sendData({
											type: 'editComment',
											when: new Date().toISOString(),
											author: null,
										})
										comment.dataset.old = comment.value
									}
								}
								comment.oninput = event => {
									if (event.target.value == event.target.dataset.old) sendComment.disabled = true
									else sendComment.disabled = false
								}

								aboutLid.insertAdjacentElement('beforeend', comment)
								aboutLid.insertAdjacentElement('beforeend', sendComment)

								createDivider('Ответственный')

								const responsibleUserHolder = document.createElement('div')
								aboutLid.insertAdjacentElement('beforeend', responsibleUserHolder)

								fetch('/office/users/', {
									method: 'POST',
									body: JSON.stringify({
										id: lid.responsible,
										find: 'byid',
										_csrf: document.getElementById('csrfToken').value
									}), 
									headers:{ "Content-Type": "application/json" }
								}).then(r => r.json()).then(data => {
									const user = data[0]

									responsibleUserHolder.insertAdjacentHTML('beforeend', `
									<div class="d-flex responsibleUser mt-2 p-relative">
										<figure class="avatar contact" data-initial="${lid.responsible ? user.fio ? user.fio.slice(0,1) : user.login.slice(0,1) : '?'}"></figure>
										<div>	
											<div name="rtitle">${lid.responsible ? user.fio ? user.fio : user.login : 'Назначить ответственного'}</div>
										</div>
									</div>`)

									responsibleUserHolder.querySelector('.responsibleUser').onclick = event => {
										const responsibleListModal = document.getElementById('responsibleListModal')
										responsibleListModal.classList.add('active')

										const responsibleList = document.getElementById('responsibleList')

										fetch('/office/users/', {
											method: 'POST',
											body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }), 
											headers:{ "Content-Type": "application/json" }
										}).then(r => r.json()).then(data => {
											responsibleList.innerHTML = ''

											data.forEach(user => {
												responsibleList.insertAdjacentHTML('beforeend', `
												<div class="tile p-2 c-hand user" data-id="${user.id}" data-fio="${user.fio}">
													<div class="tile-icon">
														<figure class="avatar avatar-sm" data-initial="${user.fio.slice(0,1)}"></figure>
													</div>
													<div class="tile-content">
														<div class="tile-title">${user.fio}</div>
													</div>
												</div>`)
											})

											responsibleList.querySelectorAll('.tile').forEach(tile => tile.onclick = event => {
												responsibleListModal.classList.remove('active')
												lid.responsible = tile.dataset.id

												responsibleUserHolder.querySelector('.responsibleUser [name="rtitle"]').innerText = tile.dataset.fio
												responsibleUserHolder.querySelector('.responsibleUser figure').dataset.initial = tile.dataset.fio.slice(0,1)

												sendData()
											})
										})
									}
								})

                createDivider('Контакты')
                
                const contactsHolder = document.createElement('div')

                if (access == 'full') 
                new Sortable(contactsHolder, {
                  animation: 150,
									handle: 'figure',
									onEnd: () => {
                    const newArrayOfSubs = []

                    contactsHolder.querySelectorAll('div.contact').forEach(el => {
                      newArrayOfSubs.push(el.dataset.id)
                    })
                    companiesHolder.querySelectorAll('div.contact').forEach(el => {
                      newArrayOfSubs.push(el.dataset.id)
                    })

                    lid.sub_holders = newArrayOfSubs.join(',')

										sendData()
									}
                })

                const companiesHolder = document.createElement('div')

                if (access == 'full') 
                new Sortable(companiesHolder, {
                  animation: 150,
									handle: 'figure',
									onEnd: () => {
                    const newArrayOfSubs = []

                    contactsHolder.querySelectorAll('div.contact').forEach(el => {
                      newArrayOfSubs.push(el.dataset.id)
                    })
                    companiesHolder.querySelectorAll('div.contact').forEach(el => {
                      newArrayOfSubs.push(el.dataset.id)
                    })

                    lid.sub_holders = newArrayOfSubs.join(',')

										sendData()
									}
                })

								const lidContact = document.createElement('div')
								lidContact.classList.add('d-flex', 'contact', 'main')

								const contactAvatar = document.createElement('figure')
								contactAvatar.classList.add('avatar', 'contact')
								contactAvatar.dataset.initial = '?'
								lidContact.insertAdjacentElement('beforeend', contactAvatar)

								const aboutContact = document.createElement('div')
								
								Promise.all([
									fetch('/office/phones/', {
										method: 'POST',
										body: JSON.stringify({
											parent: lid.holder,
											find: 'byparent',
											_csrf: document.getElementById('csrfToken').value
										}), 
										headers:{ "Content-Type": "application/json" }
									}).then(r => r.json()),
									fetch('/office/email/', {
										method: 'POST',
										body: JSON.stringify({
											parent: lid.holder,
											find: 'byparent',
											_csrf: document.getElementById('csrfToken').value
										}), 
										headers:{ "Content-Type": "application/json" }
									}).then(r => r.json()),
									fetch('/office/contacts/', {
										method: 'POST',
										body: JSON.stringify({
											id: lid.holder,
											find: 'byid',
											_csrf: document.getElementById('csrfToken').value
										}), 
										headers:{ "Content-Type": "application/json" }
									}).then(r => r.json()),
								])
								.then(info => {
									const phones = info[0]
									const email = info[1][0]
                  const contact = info[2][0]

									fetch('/office/contacts/', {
										method: 'POST',
										body: JSON.stringify({
											id: contact.parent ? contact.parent : 0,
											find: 'byid',
											_csrf: document.getElementById('csrfToken').value
										}), 
										headers:{ "Content-Type": "application/json" }
									}).then(r => r.json()).then(parentData => {
										const parent = parentData[0]

										if (contact && contact.title) contactAvatar.dataset.initial = contact.title.slice(0,1)

										const phoneDivs = []

										phones.forEach(phone => {
											phoneDivs.push('<div class="seven-prefix"><input data-id="'+phone.id+'" data-old="'+phone.phone+'" type="text" pattern="/\d [0-9]/g" placeholder="..." value="'+phone.phone+'" maxlength="10"></div>')
										})
										phoneDivs.push('<div class="seven-prefix"><input class="new-phone" type="text" pattern="/\d [0-9]/g" placeholder="..." maxlength="10"></div>')

										aboutContact.innerHTML = `
											<input class="title w100" data-old="${contact && contact.title ? contact.title : ''}" type="text" pattern="/\d [0-9]/g" maxlength="50" placeholder="Без названия" value="${contact && contact.title ? contact.title : ''}">
											<div class="form-group m-0" name="contactType">
												<!-- <label class="form-radio form-inline m-0">
													<input type="radio" name="type${contact.id}" ${contact.type == 'person' ? 'checked' : ''} value="person"><i class="form-icon"></i> Контакт
												</label>
												<label class="form-radio form-inline m-0">
													<input type="radio" name="type${contact.id}" ${contact.type == 'company' ? 'checked' : ''} value="company"><i class="form-icon"></i> Компания
												</label>
											</div>
											<div class="form-autocomplete ${contact.type == 'person' ? '' : 'd-hide'}">
												<input type="text" name="searchCompany" placeholder="Поиск..." value="${parent ? parent.title : ''}">
												<ul class="menu d-hide" name="suggestion"></ul>
											</div> -->
											${phoneDivs.join('')}
											<input class="w100 mail" data-id="${email && email.id ? email.id : 'new'}" data-old="${email && email.email ? email.email : ''}" type="text" placeholder="pochta@email.ru" value="${email && email.email ? email.email : ''}">
										`

										aboutContact.querySelector('.mail').onkeyup = event => {
											if (event.code == 'Enter' && event.target.dataset.old != event.target.value) {
												event.target.disabled = true
												fetch('/office/email/update', {
													method: 'POST',
													body: JSON.stringify({
														id: event.target.dataset.id == 'new' ? null : event.target.dataset.id,
														email: event.target.value,
														parent: event.target.dataset.id == 'new' ? contact.id : null,
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(r => r.json()).then(data => {
													if (event.target.dataset.id == 'new')	event.target.dataset.id = data.insertId
													event.target.disabled = false
												})
											}
										}

										// Сохранение имени контакта
										aboutContact.querySelector('.title').onkeyup = event => {
											if (event.code == 'Enter' && event.target.dataset.old != event.target.value) {
												event.target.dataset.old = event.target.value
												aboutContact.querySelectorAll('input').forEach(input => input.disabled = true)
												fetch('/office/contacts/update', {
													method: 'POST',
													body: JSON.stringify({
														id: contact.id,
														title: event.target.value,
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(() => {
													rewriteLid()
													contactAvatar.dataset.initial = event.target.value.slice(0,1)
													aboutContact.querySelectorAll('input').forEach(input => input.disabled = false)
												})
											}
										}

										// Отмена изменений имени контакта
										aboutContact.querySelector('.title').onblur = event => {
											if (event.target.value != event.target.dataset.old)
											event.target.value = event.target.dataset.old
										}

										// Функция редактирования номера телефона
										const editPhoneFunc = event => {
											const valueLength = (event.target.value+'').trim().length
											if (valueLength != 10 || valueLength != 0) event.target.parentElement.classList.add('error')
											else event.target.parentElement.classList.remove('error')

											if (event.code == 'Enter' && valueLength == 10 && event.target.dataset.old != event.target.value && !new RegExp(/\D/).test(event.target.value)){
												event.target.dataset.old = event.target.value   
												aboutContact.querySelectorAll('input').forEach(input => input.disabled = true)
												fetch('/office/phones/update', {
													method: 'POST',
													body: JSON.stringify({
														id: event.target.dataset.id,
														phone: event.target.value,
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(() => {
													rewriteLid()
													aboutContact.querySelectorAll('input').forEach(input => input.disabled = false)
												})
											} else if (event.code == 'Enter' && valueLength == 0) {
												aboutContact.querySelectorAll('input').forEach(input => input.disabled = true)
												fetch('/office/phones/update', {
													method: 'POST',
													body: JSON.stringify({
														id: event.target.dataset.id,
														phone: event.target.value,
														cmd: 'delete',
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(() => {
													rewriteLid()
													event.target.parentElement.remove()
													aboutContact.querySelectorAll('input').forEach(input => input.disabled = false)
												})
											}
										}

										// Функция отмены редактирования телефона
										const editPhoneBlurFunc = event => {
											event.target.parentElement.classList.remove('error')
											if (event.target.value != event.target.dataset.old) 
											event.target.value = event.target.dataset.old
										}

										// Задаём функцию редактирования телефона и отмены редактирования всем input, которые не создают новый телефон
										aboutContact.querySelectorAll('.seven-prefix input:not(.new-phone)').forEach(input => {
											input.onkeyup = editPhoneFunc
											input.onblur = editPhoneBlurFunc
										})

										const newPhoneFunc = event => {
											if (event.code == 'Enter' && (event.target.value.trim().length+'') == 10 && !new RegExp(/\D/).test(event.target.value)){
												aboutContact.querySelectorAll('input').forEach(input => input.disabled = true)
												fetch('/office/phones/update', {
													method: 'POST',
													body: JSON.stringify({
														phone: event.target.value,
														parent: contact.id,
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{
														"Content-Type": "application/json"
													}
												}).then(result => result.json()).then(newPhone => {
													rewriteLid()
													event.target.classList.remove('new-phone')
													event.target.onkeyup = editPhoneFunc
													event.target.dataset.id = newPhone.insertId
													aboutContact.querySelectorAll('input').forEach(input => input.disabled = false)
													aboutContact.insertAdjacentHTML('beforeend', '<div class="seven-prefix"><input class="new-phone" type="text" pattern="/\d [0-9]/g" placeholder="..." maxlength="10"></div>')
													aboutContact.querySelector('.new-phone').onkeyup = newPhoneFunc
												})
											}
										}

										aboutContact.querySelector('.new-phone').onkeyup = newPhoneFunc

										// const contactType = aboutContact.querySelector('[name="contactType"]')

										// contactType.querySelectorAll('input').forEach(input => {
										// 	input.oninput = event => {
										// 		fetch('/office/contacts/update', {
										// 			method: 'POST',
										// 			body: JSON.stringify({
										// 				id: contact.id,
										// 				type: input.value,
										// 				parent: input.value == 'person' ? contact.parent : 0,
										// 				_csrf: document.getElementById('csrfToken').value
										// 			}), 
										// 			headers:{ "Content-Type": "application/json" }
										// 		})

										// 		if (input.value == 'person') aboutContact.querySelector('.form-autocomplete').classList.remove('d-hide')
										// 		else aboutContact.querySelector('.form-autocomplete').classList.add('d-hide')
										// 	}
										// })

										// const searchCompany = aboutContact.querySelector('[name="searchCompany"]')
										// const suggestion = aboutContact.querySelector('[name="suggestion"]')

										// const searchCompanyFunc = input => {
										// 	if (input.trim().length == 0) return
										// 	suggestion.insertAdjacentHTML('beforeend',`<div class="loading"></div>`)
										// 	fetch('/office/contacts/', {
										// 		method: 'POST',
										// 		body: JSON.stringify({
										// 			title: input,
										// 			find: 'liketitle',
										// 			only: 'company',
										// 			_csrf: document.getElementById('csrfToken').value
										// 		}), 
										// 		headers:{ "Content-Type": "application/json" }
										// 	}).then(r => r.json()).then(data => {
										// 		suggestion.innerHTML = ''
										// 		data.forEach(contact => {
										// 			suggestion.insertAdjacentHTML('beforeend', `
										// 			<div class="tile tile-centered py-1 c-hand" data-i="${contact.id}" data-title="${contact.title}">
										// 				<div class="tile-icon">
										// 					<figure class="avatar avatar-sm" data-initial="${contact.title.slice(0,1)}">
										// 				</div>
										// 				<div class="tile-content">${contact.title}</div>
										// 			</div>
										// 			`)
										// 		})
										// 		suggestion.querySelectorAll('.tile').forEach(tile => {
										// 			tile.onclick = event => {
										// 				searchCompany.disabled = true
										// 				searchCompany.value = tile.dataset.title

										// 				fetch('/office/contacts/update', {
										// 					method: 'POST',
										// 					body: JSON.stringify({
										// 						id: contact.id,
										// 						parent: tile.dataset.i,
										// 						_csrf: document.getElementById('csrfToken').value
										// 					}), 
										// 					headers:{ "Content-Type": "application/json" }
										// 				}).then(() => {
										// 					searchCompany.disabled = false
										// 				})
										// 			}
										// 		})
										// 	})
										// }

										// searchCompany.oninput = event => searchCompanyFunc(searchCompany.value)

										// searchCompany.onfocus = event => {
										// 	searchCompanyFunc(searchCompany.value)
										// 	suggestion.classList.remove('d-hide')
										// }
										
										// searchCompany.onblur = event => setTimeout(() => suggestion.classList.add('d-hide'), 300)
									})
								})

                lidContact.insertAdjacentElement('beforeend', aboutContact)

                const redrawMainHolder = () => {
                  const mainHolder = aboutLid.querySelector('.main')

                  fetch('/office/contacts/', {
                    method: 'POST',
                    body: JSON.stringify({
                      find: 'byid',
                      id: lid.holder,
                      _csrf: document.getElementById('csrfToken').value
                    }), 
                    headers:{ "Content-Type": "application/json" }
                  }).then(r => r.json()).then(data => {
                    const contact = data[0]
                    Promise.all([
                      fetch('/office/contacts/', {
                        method: 'POST',
                        body: JSON.stringify({
                          find: 'byid',
                          id: contact.parent,
                          _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{ "Content-Type": "application/json" }
                      }).then(r => r.json()),
                      fetch('/office/phones/', {
                        method: 'POST',
                        body: JSON.stringify({
                          find: 'byparent',
                          parent: contact.id,
                          _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{ "Content-Type": "application/json" }
                      }).then(r => r.json()),
                      fetch('/office/email/', {
                        method: 'POST',
                        body: JSON.stringify({
                          find: 'byparent',
                          parent: contact.id,
                          _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{ "Content-Type": "application/json" }
                      }).then(r => r.json())
                    ])
                    .then(data => {
                      const company = data[0][0]
                      const phones = data[1]
                      const email = data[2][0]

                      mainHolder.querySelector('.title').value = mainHolder.querySelector('.title').dataset.old = contact.title
                      mainHolder.querySelector('figure').dataset.initial = contact.title.slice(0,1)

                      // mainHolder.querySelector('.form-radio input[value="'+ contact.type +'"]').checked = true
                      mainHolder.querySelectorAll('.form-radio input').forEach(el => el.name = 'type' + lid.holder)
  
                      if (contact.type == 'person') mainHolder.querySelector('.form-autocomplete').classList.remove('d-hide')
                      else mainHolder.querySelector('.form-autocomplete').classList.add('d-hide')
  
                      if (company)
                      mainHolder.querySelectorAll('[name="searchCompany"]').value = company.title

                      mainHolder.querySelectorAll('.seven-prefix').forEach(pref => {
                        if (!pref.querySelector('.new-phone')) pref.remove()
                      })

                      const last = mainHolder.querySelector('.seven-prefix')

                      phones.forEach(phone => {
                        last.insertAdjacentHTML('beforebegin', '<div class="seven-prefix"><input type="text" data-i="'+phone.id+'" pattern="/\d [0-9]/g" maxlength="10" placeholder="..." value="'+phone.phone+'"></div>')
                      })

                      mainHolder.querySelector('.mail').value = mainHolder.querySelector('.mail').dataset.old = email ? email.email : ''
                    })
                  })
                }

								aboutLid.insertAdjacentElement('beforeend', lidContact)
                aboutLid.insertAdjacentElement('beforeend', contactsHolder)

                createDivider('Компании')

                aboutLid.insertAdjacentElement('beforeend', companiesHolder)

                const initSubHoldersTitleEditing = (el, contactId) => {
                  el.onkeyup = event => {
                    if (event.code == 'Enter' && el.value.trim().length > 0) {
                      el.disabled = false
                      el.dataset.old = el.value.trim()

                      fetch('/office/contacts/update', {
                        method: 'POST',
                        body: JSON.stringify({
                          id: contactId,
                          title: el.value.trim(),
                          _csrf: document.getElementById('csrfToken').value
                        }), 
                        headers:{ "Content-Type": "application/json" }
                      }).then(() => el.disabled = false)
                    }
                  }

                  el.onblur = () => el.value = el.dataset.old
                }

								const initSubHoldersPhonesEditing = (els, parent) => {
									els.forEach(el => {
										el.onkeyup = event => {
											if (event.code == 'Enter' && el.value.trim().length == 10 && !new RegExp(/\D/).test(el.value)) {
												el.disabled = true
												if (el.dataset.i != 'new')
												fetch('/office/phones/update', {
													method: 'POST',
													body: JSON.stringify({
														id: el.dataset.i,
														phone: el.value,
														parent: parent,
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(r => r.json()).then(() => {
													el.disabled = false
												})
												else
												fetch('/office/phones/update', {
													method: 'POST',
													body: JSON.stringify({
														phone: el.value,
														parent: parent,
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(r => r.json()).then(data => {
													const newPhone = document.createElement('div')
													newPhone.insertAdjacentHTML('beforeend', `
														<input type="text" data-i="${data.insertId}" pattern="/\d [0-9]/g" maxlength="10" placeholder="..." value="${el.value}">
													`)

													el.parentElement.insertAdjacentHTML('beforebegin', newPhone)

													initSubHoldersPhonesEditing([newPhone.querySelector('input')], parent)
													el.value = ''
													el.disabled = false
												})
											} else if (event.code == 'Enter' && el.value.trim().length == 0 && el.dataset.i != 'new') {
												el.disabled = true
												fetch('/office/phones/update', {
													method: 'POST',
													body: JSON.stringify({
														id: el.dataset.i,
														cmd: 'delete',
														_csrf: document.getElementById('csrfToken').value
													}), 
													headers:{ "Content-Type": "application/json" }
												}).then(() => {
													el.parentElement.remove()
												})
											}
										}
									})
								}

								const initSubHoldersEmailEditing = (input, parent) => {
									input.onkeyup = event => {
										if (event.code == 'Enter' && input.value.trim().length > 0) {
											input.disabled = true
											fetch('/office/email/update', {
												method: 'POST',
												body: JSON.stringify({
													id: input.dataset.i == 'new' ? null : input.dataset.i,
													email: input.value,
													parent: parent,
													_csrf: document.getElementById('csrfToken').value
												}), 
												headers:{ "Content-Type": "application/json" }
											}).then(r => r.json()).then(data => {
												if (input.dataset.i == 'new') input.dataset.i = data.insertId

												input.disabled = false
											})
										} 
									}
                }
                
                const redrawSubHolders = () => {
                  Promise.all([
                    fetch('/office/contacts', {
                      method: 'POST',
                      body: JSON.stringify({
                        _csrf: document.getElementById('csrfToken').value
                      }), 
                      headers:{ "Content-Type": "application/json" }
                    }).then(r => r.json()),
                    fetch('/office/phones/', {
                      method: 'POST',
                      body: JSON.stringify({
                        _csrf: document.getElementById('csrfToken').value
                      }), 
                      headers:{ "Content-Type": "application/json" }
                    }).then(r => r.json()),
                    fetch('/office/email/', {
                      method: 'POST',
                      body: JSON.stringify({
                        _csrf: document.getElementById('csrfToken').value
                      }), 
                      headers:{ "Content-Type": "application/json" }
                    }).then(r => r.json())
                  ])
                  .then(data => {
                    contactsHolder.innerHTML = '' 
                    companiesHolder.innerHTML = '' 
                    
                    lid.sub_holders.split(',').forEach(sub => {
                      const contact = data[0].find(dt => dt.id == sub)
                      const phones = data[1].filter(dt => dt.parent == sub)
                      const email = data[2].find(dt => dt.parent == sub)

                      const holder = contact.type == 'person' ? contactsHolder : companiesHolder
                      
                      const phonesDivs = []
                      phones.forEach(dt => {
                        phonesDivs.push('<div class="seven-prefix"><input type="text" data-i="'+dt.id+'" pattern="/\d [0-9]/g" maxlength="10" placeholder="..." value="'+dt.phone+'"></div>')
                      })

                      holder.insertAdjacentHTML('beforeend', `
                        <div data-id="${contact.id}" class="d-flex contact mt-2 p-relative subholder">
                          <figure class="avatar contact" data-initial="${contact.title.slice(0,1)}"></figure>
                          <div>
                            <div>
                              <input class="title w100" data-old="${contact && contact.title ? contact.title : ''}" type="text" pattern="/\d [0-9]/g" maxlength="50" placeholder="Без названия" value="${contact && contact.title ? contact.title : ''}">
                            </div>
                            ${phonesDivs.join('')}
                            <input class="w100 mail" data-id="${email && email.id ? email.id : 'new'}" data-old="${email && email.email ? email.email : ''}" type="text" placeholder="pochta@email.ru" value="${email && email.email ? email.email : ''}">
                            <div class="pos-rt mt-2 pt-2 c-hand promoteBtn">
                              <i class="icon icon-people"></i>
                              <i class="icon icon-upward"></i>
                            </div>
                          </div>
                          <div class="btn btn-clear pos-rt"></div>
                        </div>
                      `)

                      initSubHoldersTitleEditing(holder.querySelectorAll('.subholder[data-id="'+ contact.id +'"] input.title'), contact.id)
                      initSubHoldersPhonesEditing(holder.querySelectorAll('.subholder[data-id="'+ contact.id +'"] .seven-prefix input'), contact.id)
                      initSubHoldersEmailEditing(holder.querySelector('.subholder[data-id="'+ contact.id +'"] .mail'), contact.id)

                      holder.querySelector('.subholder[data-id="'+contact.id+'"] .btn-clear').onclick = event => {
                        if (!confirm('Вы точно хотите убрать контакт?')) return
                        event.target.onclick = null

                        const newSubHolders = (lid.sub_holders+'').split(',').filter(sub => sub != contact.id ? true : false)
                        
                        lid.sub_holders = newSubHolders.join(',') ? newSubHolders.join(',') : 'none'
                        sendData().then(() => holder.querySelector('[data-id="'+contact.id+'"]').remove())
                      }
                      
                      holder.querySelector('.subholder[data-id="'+contact.id+'"] .promoteBtn').onclick = event => {
                        const newSubs = []

                        lid.sub_holders.split(',').forEach(sub => {
                          if (sub != contact.id) newSubs.push(sub)
                        })

                        newSubs.push(lid.holder)

                        lid.holder = contact.id

                        lid.sub_holders = newSubs.join(',')
    
                        sendData().then(() => {
                          redrawSubHolders()
                          redrawMainHolder()
                        })
                      }
                    })
                  })
                }
								
								const addNewSubBtn = type => {
									const newSubContact = document.createElement('div')
                  newSubContact.classList.add('d-flex', 'contact', 'mt-2', 'c-hand')

									newSubContact.innerHTML = `
										<div class="d-flex contact mt-2 p-relative c-hand">
											<figure class="avatar contact" data-initial="+"></figure>
											<div>
												<div>${type == 'person' ? 'Добавить контакт' : 'Добавить компанию'}</div>
											</div>
										</div>
                  ` 

                  const holder = type == 'person' ? contactsHolder : companiesHolder
                  
									newSubContact.onclick = () => {
										const modal = document.getElementById('contactsSearcher')
										modal.classList.add('active')

										const searchNewSubContact = document.getElementById('searchNewSubContact')
                    const newSubContactSuggestion = document.getElementById('newSubContactSuggestion')
                    
                    searchNewSubContact.value = ''

                    const searchContact = () => {
											if (searchNewSubContact.value.trim().length > 0)
											fetch('/office/contacts', {
												method: 'POST',
												body: JSON.stringify({
													title: (searchNewSubContact.value+'').trim(),
                          find: 'liketitle',
                          only: type == 'person' ? 'person' : 'company',
													_csrf: document.getElementById('csrfToken').value
												}), 
												headers:{ "Content-Type": "application/json" }
											}).then(r => r.json()).then(data => {
                        lid.sub_holders.split(',').forEach(sub => data = data.filter(d => d.id != sub))
                        
												newSubContactSuggestion.innerHTML = ''

												data.forEach(data => {
													newSubContactSuggestion.insertAdjacentHTML('beforeend', `
														<dd class="menu-item c-hand py-2" data-i="${data.id}" data-title="${data.title}">
															<div class="tile tile-centered">
																<div class="tile-icon">
																	<figure class="avatar avatar-sm" data-initial="${data.title.slice(0,1)}"></figure>
																</div>
																<div class="tile-content">${data.title}</div>
															</div>
														</dd>
													`)
												})

												newSubContactSuggestion.insertAdjacentHTML('beforeend', `
													<dd class="menu-item c-hand py-2" data-i="new" data-title="${searchNewSubContact.value}" title="Создать новый контакт">
														<div class="tile tile-centered">
															<div class="tile-icon">
																<figure class="avatar avatar-sm" data-initial="${searchNewSubContact.value.slice(0,1)}"></figure>
															</div>
															<div class="tile-content">${searchNewSubContact.value}</div>
														</div>
													</dd>
												`)

												const newContact = newSubContactSuggestion.querySelector('[data-i=new]')

												newContact.onclick = event => {
													const newSubHolders = (lid.sub_holders+'').split(',').filter(d => d != 'null' ? true : false)
												
													fetch('/office/contacts/update', {
														method: 'POST',
														body: JSON.stringify({
															title: searchNewSubContact.value.trim(),
															type: type == 'person' ? 'person' : 'company',
															_csrf: document.getElementById('csrfToken').value
														}), 
														headers:{ "Content-Type": "application/json" }
													}).then(r => r.json()).then(data => {
														newSubHolders.push(data.insertId)
														lid.sub_holders = newSubHolders.join(',')

														modal.classList.remove('active')
														sendData().then(() => {
															holder.insertAdjacentHTML('beforebegin', `
																<div data-id="${data.insertId}" class="d-flex contact mt-2 p-relative">
																	<figure class="avatar contact" data-initial="${newContact.dataset.title.slice(0,1)}"></figure>
																	<div>
																		<div>${newContact.dataset.title}</div>
																		<div class="seven-prefix"><input type="text" data-i="new" pattern="/\d [0-9]/g" maxlength="10" placeholder="..."></div>
																	</div>
																	<div class="btn btn-clear pos-rt"></div>
																</div>
															`)
															initSubHoldersPhonesEditing(newSubContact.querySelectorAll('input'), data.insertId)
															initSubHoldersEmailEditing(newSubContact.querySelector('.mail'), data.insertId)
														})
													})
												}

												newSubContactSuggestion.querySelectorAll('dd:not([data-i=new])').forEach(el => {
													el.onclick = event => {
														const newSubHolders = (lid.sub_holders+'').split(',').filter(d => d != 'null' ? true : false)

														newSubHolders.push(el.dataset.i)
														lid.sub_holders = newSubHolders.join(',')

														modal.classList.remove('active')
														sendData().then(() => {
															Promise.all([
																fetch('/office/phones/', {
																	method: 'POST',
																	body: JSON.stringify({
																		parent: el.dataset.i,
                                    find: 'byparent',
																		_csrf: document.getElementById('csrfToken').value
																	}), 
																	headers:{ "Content-Type": "application/json" }
																}).then(r => r.json()),
																fetch('/office/email/', {
																	method: 'POST',
																	body: JSON.stringify({
																		parent: el.dataset.i,
																		find: 'byparent',
																		_csrf: document.getElementById('csrfToken').value
																	}), 
																	headers:{ "Content-Type": "application/json" }
																}).then(r => r.json())
															])
															.then(data => {
																const phonesDivs = []
																data[0].forEach(dt => {
																	phonesDivs.push('<div class="seven-prefix"><input type="text" data-i="'+dt.id+'" pattern="/\d [0-9]/g" maxlength="10" placeholder="..." value="'+dt.phone+'"></div>')
																})

																const email = data[1][0]

																holder.insertAdjacentHTML('beforeend', `
																	<div data-id="${el.dataset.i}" class="d-flex contact mt-2 p-relative subholder">
																		<figure class="avatar contact" data-initial="${el.dataset.title.slice(0,1)}"></figure>
																		<div>
																			<div>${el.dataset.title}</div>
																			${phonesDivs.join('')}
                                      <input class="w100 mail" data-id="${email && email.id ? email.id : 'new'}" data-old="${email && email.email ? email.email : ''}" type="text" placeholder="pochta@email.ru" value="${email && email.email ? email.email : ''}">
                                      <div class="pos-rt mt-2 pt-2 c-hand promoteBtn">
                                        <i class="icon icon-people"></i>
                                        <i class="icon icon-upward"></i>
                                      </div>
																		</div>
																		<div class="btn btn-clear pos-rt"></div>
																	</div>
                                `)

																initSubHoldersPhonesEditing(holder.querySelectorAll('input'), el.dataset.i)
																initSubHoldersEmailEditing(holder.querySelector('.subholder[data-id="'+ el.dataset.i +'"] .mail'), el.dataset.i)

																holder.querySelector('.subholder[data-id="'+el.dataset.i+'"] .btn-clear').onclick = event => {
																	if (!confirm('Вы точно хотите убрать контакт?')) return
																	event.target.onclick = null
				
																	const newSubHolders = (lid.sub_holders+'').split(',').filter(sub => sub != el.dataset.i ? true : false)
																	
																	lid.sub_holders = newSubHolders.join(',') ? newSubHolders.join(',') : 'none'
																	sendData().then(() => holder.querySelector('[data-id="'+el.dataset.i+'"]').remove())
                                }
                                
                                holder.querySelector('.subholder[data-id="'+el.dataset.i+'"] .promoteBtn').onclick = event => {
                                  const newSubs = []
        
                                  lid.sub_holders.split(',').forEach(sub => {
                                    if (sub != el.dataset.i) newSubs.push(sub)
                                  })
        
                                  newSubs.push(lid.holder)
        
                                  lid.holder = el.dataset.i
        
                                  lid.sub_holders = newSubs.join(',')
              
                                  sendData().then(() => {
                                    redrawMainHolder()
                                    redrawSubHolders()
                                  })
                                }
															})
														})
													}
												})
											})
											else 
											newSubContactSuggestion.innerHTML = ''
                    } 
                    searchContact()

										searchNewSubContact.oninput = () => searchContact()
									}
									
                  holder.insertAdjacentElement('afterend', newSubContact)
								}

								if (lid.sub_holders) 
								Promise.all([
									fetch('/office/phones/', {
										method: 'POST',
										body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }), 
										headers:{ "Content-Type": "application/json" }
									}).then(r => r.json()),
									fetch('/office/email/', {
										method: 'POST',
										body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }), 
										headers:{ "Content-Type": "application/json" }
									}).then(r => r.json())
								]).then(data => {
									const allContacts = [];

									(lid.sub_holders+'').split(',').forEach(sub => {
										allContacts.push(
											fetch('/office/contacts/', {
												method: 'POST',
												body: JSON.stringify({
													id: sub,
													find: 'byid',
													_csrf: document.getElementById('csrfToken').value
												}), 
												headers:{ "Content-Type": "application/json" }
											}).then(r => r.json()).then(contactData => {
												const contact = contactData[0]
												const currentPhones = data[0].filter(dt => dt.parent == contact.id ? true : false)
												const currentEmail = data[1].filter(dt => dt.parent == contact.id ? true : false)[0]

												const contactDiv = document.createElement('div')
												contactDiv.dataset.id = contact.id
												contactDiv.classList.add('d-flex', 'contact', 'mt-2', 'p-relative')
		
												const subAvatar = document.createElement('figure')
												subAvatar.classList.add('avatar', 'contact')
												subAvatar.dataset.initial = contact ? contact.title.slice(0,1) : '?'
												contactDiv.insertAdjacentElement('beforeend', subAvatar)
		
												const about = document.createElement('div')

												const phoneDivs = []

												currentPhones.forEach(dt => {
													phoneDivs.push('<div class="seven-prefix"><input type="text" data-i="'+dt.id+'" pattern="/\d [0-9]/g" maxlength="10" placeholder="..." value="'+dt.phone+'"></div>')
												})

                        phoneDivs.push('<div class="seven-prefix"><input type="text" data-i="new" pattern="/\d [0-9]/g" maxlength="10" placeholder="..."></div>')

                        const promoteBtn = document.createElement('div')
                        promoteBtn.classList.add('pos-rt', 'mt-2', 'pt-2', 'c-hand')
                        promoteBtn.innerHTML = `<i class="icon icon-people"></i><i class="icon icon-upward"></i>`

                        promoteBtn.onclick = event => {
                          const newSubs = []

                          lid.sub_holders.split(',').forEach(sub => {
                            if (sub != contact.id) newSubs.push(sub)
                          })

                          newSubs.push(lid.holder)

                          lid.holder = contact.id

                          lid.sub_holders = newSubs.join(',')
                          
                          sendData().then(() => {
                            redrawSubHolders()
                            redrawMainHolder()
                          })
                        }

												about.innerHTML = `
                          <div>
                            <input class="title w100" data-old="${contact && contact.title ? contact.title : ''}" type="text" pattern="/\d [0-9]/g" maxlength="50" placeholder="Без названия" value="${contact && contact.title ? contact.title : ''}">
                          </div>
													${phoneDivs.join('')}
													<input class="w100 mail" data-id="${currentEmail && currentEmail.id ? currentEmail.id : 'new'}" data-old="${currentEmail && currentEmail.email ? currentEmail.email : ''}" type="text" placeholder="pochta@email.ru" value="${currentEmail && currentEmail.email ? currentEmail.email : ''}">
                        `
                        about.insertAdjacentElement('beforeend', promoteBtn)

                        initSubHoldersTitleEditing(about.querySelector('input.title'), sub)
												initSubHoldersPhonesEditing(about.querySelectorAll('.seven-prefix input'), sub)
												initSubHoldersEmailEditing(about.querySelector('.mail'), sub)

												contactDiv.insertAdjacentElement('beforeend', about)

												const deleteBtn = document.createElement('div')
												deleteBtn.classList.add('btn', 'btn-clear', 'pos-rt')

												deleteBtn.onclick = event => {
													if (!confirm('Вы точно хотите убрать контакт?')) return
													deleteBtn.onclick = null

													const newSubHolders = (lid.sub_holders+'').split(',').filter(sub => sub != contact.id ? true : false)
													
													lid.sub_holders = newSubHolders.join(',') ? newSubHolders.join(',') : 'none'
													sendData().then(() => {
														if (lid.sub_holders == 'none') lid.sub_holders = null
														contactDiv.remove()
													})
												}
												contactDiv.insertAdjacentElement('beforeend', deleteBtn)

                        if (contact.type == 'person')
                        contactsHolder.insertAdjacentElement('beforeend', contactDiv)   
                        else
                        companiesHolder.insertAdjacentElement('beforeend', contactDiv)
											})
										)
									})

									Promise.all(allContacts).then(() => {
                    addNewSubBtn('person')
                    addNewSubBtn('company')
                  })
								})
								else {
                  addNewSubBtn('person')
                  addNewSubBtn('company')
                }
                
                createDivider('Взаимодействия')

                const hideLidBtn = document.createElement('button')
                hideLidBtn.classList.add('btn', 'btn-sm', 'btn-error','p-centered')
                hideLidBtn.innerText = 'Удалить лид'

                hideLidBtn.onclick = event => {
                  if (confirm('Вы уверены что хотите удалить лид?') && confirm('И дважды подумали?'))  {
                    lid.active = 0
                    
                    allStepsHolder.classList.add('dragscroll')
                    require('../../dragscroll').reset()

                    sendData().then(() => lidCard.remove())
                  }
                }

                aboutLid.insertAdjacentElement('beforeend', hideLidBtn)

								lidMenu.insertAdjacentElement('beforeend', tasks)
								lidMenu.insertAdjacentElement('beforeend', lidStory)
								lidMenu.insertAdjacentElement('beforeend', aboutLid)
								lidCard.insertAdjacentElement('beforeend', lidMenu)
								lidCard.insertAdjacentElement('beforeend', lidFooter)

								const defbtnfnc = () => {
									lidMenu.classList.add('fadeIn')
									lidMenu.classList.remove('d-hide')
									lidCard.classList.add('active')
									expandLidBtn.classList.remove('flip-back')
									expandLidBtn.classList.add('flip')
									newTask.focus()
									
									allStepsHolder.classList.remove('dragscroll')
									require('../../dragscroll').reset()
									expandLidBtn.onclick = () => {
										lidMenu.classList.add('d-hide')
										lidMenu.classList.remove('fadeIn')
										lidCard.classList.remove('active')
										expandLidBtn.classList.add('flip-back')
										expandLidBtn.classList.remove('flip')
										expandLidBtn.onclick = defbtnfnc
										lidCard.querySelectorAll('input').forEach(input => input.blur())
									
										allStepsHolder.classList.add('dragscroll')
										require('../../dragscroll').reset()
									}
								}
								
								expandLidBtn.onclick = defbtnfnc

								dragLid.onmousedown = event => {
									allStepsHolder.classList.remove('dragscroll')
									require('../../dragscroll').reset()
								}

								dragLid.onmouseup = event => {
									if (!allStepsHolder.classList.contains('dragscroll')) {
										allStepsHolder.classList.add('dragscroll')
										require('../../dragscroll').reset()
									}
								}
							}

							step.lids.forEach(lid => drawLid(lid))

							if (access == 'full') new Sortable(els.content, {
								group: 'steps',
								animation: 150,
								handle: '.lid-drag',
								ghostClass: 'grabbingLid',
								onStart: ev => {
									ev.item.querySelector('.lid-menu').classList.add('d-hide')
									ev.item.querySelector('.lid-menu').classList.remove('active')
									ev.item.querySelector('.expand').classList.add('flip-back')
									ev.item.querySelector('.expand').classList.remove('flip')
								},
								onEnd: ev => {
									const lidData = JSON.parse(ev.item.dataset.data)
									lidData.step_id = ev.to.dataset.id
									if (ev.from.parentElement.dataset.id != ev.to.parentElement.dataset.id){
										lidData.lid_data.history.push({
											type: 'progress',
											when: new Date().toISOString(),
											author: null,
											oldStep: ev.from.parentElement.dataset.title,
											newStep: ev.to.parentElement.dataset.title,
										})
										lidData._csrf = document.getElementById('csrfToken').value
										fetch('/office/lids/update/', {
											method: 'POST',
											body: JSON.stringify(lidData), 
											headers:{
												"Content-Type": "application/json"
											}
										}).then(() => {
											const moveTimelineItem = document.createElement('div')
											moveTimelineItem.classList.add('timeline-item', 'icon-lg')
											moveTimelineItem.innerHTML = `
												<div class="timeline-left">
													<a class="timeline-icon icon-lg">
														<i class="icon icon-share"></i>
													</a>
												</div>
												<div class="timeline-content">
													<span name="time">${format(new Date().getDate()) + '.' + format(new Date().getMonth()) + ' ' + format(new Date().getHours()) + ':' + format(new Date().getMinutes())} </span> Лид был перемещён с шага «${ev.from.parentElement.querySelector('.step-title').innerText}» на «${ev.to.parentElement.querySelector('.step-title').innerText}»
												</div>
											`
											ev.item.querySelector('.timeline').insertAdjacentElement('afterbegin', moveTimelineItem)
										})
									}
									allStepsHolder.classList.add('dragscroll')
									require('../../dragscroll').reset()
								},
                onMove: event => {
                  setTimeout(() => {
                    const dir = event.dragged.offsetLeft - allStepsHolder.scrollLeft > window.innerWidth * 0.6 ? 'right' : event.dragged.offsetLeft - allStepsHolder.scrollLeft < window.innerWidth * 0.025 ? 'left' : 'none'

                    if (dir == 'right') {
                      allStepsHolder.scroll({
                        left: allStepsHolder.scrollLeft + event.dragged.toRect.width,
                        behavior: 'smooth'
                      })
                    } else if (dir == 'left') {
                      allStepsHolder.scroll({
                        left: allStepsHolder.scrollLeft - event.dragged.toRect.width,
                        behavior: 'smooth'
                      })
                    }
                  
                  }, 150)
                }
							})
					
							els.content.style.height = '100%'
							els.step.insertAdjacentElement('beforeend', els.content)
							
							allStepsHolder.insertAdjacentElement('beforeend', els.step)
					
							els.step = document.createElement('div')
							els.step.classList.add('input-group', 'col-12')
							els.span = document.createElement('span')
							els.span.classList.add('input-group-addon')
							els.icon = document.createElement('span')
							els.icon.classList.add('icon', 'icon-resize-vert')
							els.span.insertAdjacentElement('beforeend', els.icon)
							els.step.insertAdjacentElement('beforeend', els.span)
							els.input = document.createElement('input')
							els.input.classList.add('form-input')
							els.input.type = 'text'
							els.input.dataset.last = els.input.value = step.stepData.title
							els.input.name = step.stepData.id
							els.step.insertAdjacentElement('beforeend', els.input)
							els.button = document.createElement('button')
							els.button.classList.add('btn')
							els.button.dataset.id = step.stepData.id
							els.button.innerText = 'X'
							els.step.insertAdjacentElement('beforeend', els.button)
					
							document.getElementById('stepsHolder').insertAdjacentElement('beforeend', els.step)
						})

						document.querySelectorAll('#stepsHolder button[data-id]').forEach(delBtn => { 
							const listener = event => {
								const url = '/office/steps/delete'
								const csrf = document.getElementById('csrfToken').value
								const data = {id: delBtn.dataset.id, _csrf: csrf}
					
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
					
								if (access == 'full') confirmBtn.onclick = () => {
									delBtn.parentElement.remove()
									saveStepsInKanban()
								}
					
								cancelBtn.addEventListener('click', () => {
									event.target.classList.remove('d-hide')
									buttonsHolder.remove()
								})
							}
							if (access == 'full') delBtn.onclick = listener
						})
					})
					
					// Получаем через функцию чтобы получать элемент такой, какой он есть в данный момент 
					const kanbanInput = () => document.getElementById('kanbanTitleChangeInput')
					const modalTitle = () => document.getElementById('kanbanTitle')
					const editTitleBtn = () => document.getElementById('kanbanTitleChangeBtn')

					const saveKanbanTitle = () => {
						const steps = []
						document.querySelectorAll('#stepsHolder input').forEach(input => steps.push(input.name))
						fetch('/office/pipes/' + location.pathname.split('/')[3], {
							method: 'POST',
							body: JSON.stringify({
								id: +location.pathname.split('/')[3],
								title: document.getElementById('pipeTitle').value,
								kanban: {
									title: kanbanInput().value,
									description: '',
									steps: steps
								},
								key: key,
								_csrf: document.getElementById('csrfToken').value
							}), 
							headers:{
								"Content-Type": "application/json"
							}
						}).then(res => {
							return res.json()
						}).then(res => {
							modalTitle().innerText = kanbanInput().value
							modalTitle().classList.remove('d-hide')
							editTitleBtn().classList.remove('d-hide')
							kanbanInput().classList.add('d-hide')
						})
						.catch(error => console.error(error))
					}

					if (access == 'full') editTitleBtn().onclick = event => {
						editTitleBtn().classList.add('d-hide')
						modalTitle().classList.add('d-hide')
						kanbanInput().classList.remove('d-hide')
						kanbanInput().focus()
						kanbanInput().innerText = result.pipe.kanban[key].title
					}

					kanbanInput().onblur = event => {
						saveKanbanTitle()
					}

					// При нажатии на input кнопки Enter
					document.getElementById('kanbanTitleChangeInput').onkeydown = event => {
						if (event.code === 'Enter') {
							saveKanbanTitle()
						}
					}

					if (access == 'full') document.getElementById('deleteKanban').onclick = event => {
						if (!confirm('Вы точно хотите удалить kanban?')) return
						fetch('/office/pipes/' + location.pathname.split('/')[3], {
							method: 'POST',
							body: JSON.stringify({
								id: +location.pathname.split('/')[3],
								title: document.getElementById('pipeTitle').value,
								key: key,
								delete: true,
								_csrf: document.getElementById('csrfToken').value
							}), 
							headers:{
								"Content-Type": "application/json"
							}
						}).then(res => {
							return res.json()
						}).then(res => {
							document.getElementById('kanbanStepsList').classList.remove('active')
							allStepsHolder.childNodes.forEach(child => child.remove())
							this.init(key)
						})
						.catch(error => console.error(error))
					}
				}

				if (id === key) btn.click()
				kanbanChangeHolder.insertAdjacentElement('beforeend', kanbanBtns)
			}
		})
	}
}
