const Cleave = require('cleave.js')
const inView = require('../in-view.min')
if (location.pathname.toLocaleLowerCase() == '/') require ('../svg.js').svgjs()

if (location.pathname.toLocaleLowerCase() === '/' || location.pathname.toLocaleLowerCase() === '/login' || location.pathname.toLocaleLowerCase() === '/signup' || location.pathname.toLocaleLowerCase() === '/recovery') {

    //функционал верхних стадий
    let Istages = 1
    let stop = false
    const headerStages = document.querySelectorAll('.header-stages li')

    const stagesMove = () => {
        headerStages.forEach((el, i, arr) => {
            el.classList.remove('icon85')
            el.querySelector('g').classList.remove('active')
        })
        headerStages[Istages].classList.add('icon85')
        headerStages[Istages].querySelector('g').classList.add('active')
        const stagesTitle = headerStages[Istages].dataset.title
        document.getElementById('offer_text').innerHTML = `${stagesTitle}`
    }

    setInterval(() => {
        if (stop) return 
        stagesMove()
        Istages++
        if (Istages == headerStages.length) Istages = 0
    },3000)

    headerStages.forEach((el, i, arr) => {
        el.onclick = () => {
            stop = true
            arr.forEach(el => {
                el.querySelector('g').classList.remove('active')
                el.classList.remove('icon85')
            })
            el.querySelector('g').classList.add('active')
            el.classList.add('icon85')
            const stagesTitle = el.dataset.title
            document.getElementById('offer_text').innerHTML = `${stagesTitle}`
            Istages = i
            setTimeout(stop = false, 3000)
        }
    })
    document.querySelectorAll('.cta-panel').forEach(el => {
        let buttonT = el.dataset.btn
        let cta = el.dataset.cta
        console.log(buttonT,cta)
        el.querySelector('.h5').innerHTML = cta
        el.querySelector('button').innerText = buttonT
    })
    // document.querySelector('.first-screen').classList.add('ptFPage')
    // подключаем svgjs код
    // Добавляем на location "/" , кнопке в баре класс bt_callback
    // document.querySelectorAll('.header-plate button').forEach(el => el.classList.add('bt_callback'))

    inView('.svgHolder').on('enter', el => {
        if (!el.childElementCount) {
            el.classList.add('animated', 'fadeIn')
            el.innerHTML = `<img class="svgObjHolder p-centered" src="${el.dataset.src}">`
        }
    })
}
//     const tags = document.querySelectorAll('a[name]')

//     const check = () => {
//         try {
//             const title = document.querySelector('.pageTitle')
//             if (window.innerWidth <= 1024 && (title.offsetWidth > 550 || title.offsetWidth == 0)) {
//                 title.classList.add('d-hide')
//             } else {
//                 title.classList.remove('d-hide')
//             }
//         } catch {}
//     }

//     check()

//     window.addEventListener('scroll', event => {
//         if (!document.querySelector('.pageTitle')) return
//         let last
//         tags.forEach(el => {
//             if (el.getBoundingClientRect().y < 0) {
//                 last = el
//             }
//         })
//         document.querySelector('.pageTitle').classList.remove('d-hide')
//         if (last) document.getElementById('navTitle').innerText = last.parentElement.querySelector('h4').childNodes[0].wholeText
//         else document.getElementById('navTitle').innerText = ''

//         check()
//     })
    
//     //костыль для лого лендинга
//     const paddingFix = () => {
//         document.body.clientWidth <= 1024 ?
//         document.querySelector('.first-screen').style.paddingTop = '3.2' + 'rem'
//         : document.querySelector('.first-screen').style.paddingTop = 'unset'
//     }
//     paddingFix()
//     window.addEventListener('resize', () => {
//         paddingFix()
//     })
// }

// if (location.pathname.toLocaleLowerCase() === '/sclady') {
//     document.getElementById('navTitle').innerText = ''
//     require('../historyScroll').slider()
    
//     document.querySelectorAll('.header-plate button').forEach(el => el.onclick = () => {
//         document.getElementById('scladSquare').classList.remove('d-hide')
//     })
// }

// const polyStyleFix = () => {
//     if (location.pathname.toLocaleLowerCase() != '/poly') return
//     document.querySelector('.first-screen').style.height = document.querySelector('.first-screen img').getBoundingClientRect().height + (document.body.clientWidth >= 1024 ? -3 : document.body.clientWidth > 425 ? -7 : 7) + 'px'
// } 

// if (location.pathname.toLocaleLowerCase() === '/poly') {

//     document.getElementById('logo_txt').style.width = '60%'
//     // document.getElementById('navTitle').innerText = 'ПРОМЫШЛЕННЫЕ ПОЛЫ'
//     require('../circlesScript').circlesScript()
//     require('../historyScroll').slider()
//     const floorBtns = document.querySelector('.survey_points').querySelectorAll('button')

//     //показывать параметры пола
//     document.querySelector('.header-plate').classList.add('barPoly')
//     document.querySelectorAll('.header-plate button').forEach(el => el.onclick = () => {
//         document.querySelector('.header-plate').scrollIntoView({behavior: 'smooth'})
//     })

//     //отправка параметров пола лида
//     floorBtns.forEach(el => {
//         el.onclick = () => {
//             if (!el.classList.contains('active')) {
//                 el.classList.add('active')
//             } else {
//                 el.classList.remove('active')
//             }
//         }
//     })
//     console.log(a.length)
// }
 
// //функционал svg sidebar'a
// document.querySelectorAll('#SideBar > g').forEach((el,i,a) => {
//     el.onclick = event => {
//         a.forEach(el => {
//             el.querySelector('#sideRect').setAttribute('fill', '#E6E7E8') 
//             el.querySelector('text').setAttribute('fill', '#000')
//         })
//         el.querySelector('#sideRect').setAttribute('fill', '#000') 
//         el.querySelector('text').setAttribute('fill', '#fff')
//     }
// })

// // костыль для шестерней
// function gearChange() {
//     document.body.clientWidth <= 1024 ?
//         use.forEach(el => {
//             el.setAttribute('x', '11')
//             el.setAttribute('y', '11')
//         })
//         : use.forEach(el => {
//             el.setAttribute('x', '13')
//             el.setAttribute('y', '13')
//         })
// }
// const use = document.querySelectorAll('.header-plate use')
// gearChange()

// //скролл сайдбара
// require('../scrollSidebar').scrollSidebar()

// // меняем тайтлы и кнопоки плашек рассчетов
// document.querySelectorAll('.bt_callback').forEach(el => {
//     el.onclick = () => {
//         if ((el.dataset.title || el.dataset.cta) && (!el.dataset.title == '' || !el.dataset.cta == '')) {
//             document.getElementById('callback_modal').querySelector('.h4').textContent = el.dataset.title
//             document.getElementById('callbackBtn').textContent = el.dataset.cta
//         } else {
//             document.getElementById('callback_modal').querySelector('.h4').textContent = "ОБРАТНЫЙ ЗВОНОК"
//             document.getElementById('callbackBtn').textContent = "Жду звонка"
//             return
//         }
//     }
// })

// // Рассчет элемента по оси y для смены фона навбара  
const nav = document.querySelector('.docs-navbar')

function getCoords(elem) {
    if (!elem) return
    let box = elem.getBoundingClientRect()
    return {
      top: box.top + pageYOffset
    }
  }

const visableNav = () => {
    if (!nav) return
    let coords = getCoords(nav)
    if (coords.top === 0) nav.classList.add('visable-nav')
    else nav.classList.remove('visable-nav')
}

window.onload = () => visableNav()

window.onscroll = () => visableNav()

// // Сайдбар
const sidebar = document.getElementById('sidebar')

if (document.body.clientWidth > 960) {

    inView('.offer').on('enter', () => {
        sidebar.classList.remove('sidebar-relative')
        sidebar.querySelector('.docs-nav').classList.remove('fadeIn')
        document.querySelector('.header-plate').classList.remove('header-plate-sm')
    })
    .on('exit', () => {
        sidebar.classList.add('sidebar-relative')
        sidebar.classList.remove('sidebar-active')
        sidebar.querySelector('.docs-nav').classList.add('fadeIn')
        document.querySelector('.header-plate').classList.add('header-plate-sm')
    })
}

document.querySelector('.js-closeSidebar').onclick = () => {
    if (document.body.clientWidth > 960) {
        sidebar.classList.remove('sidebar-active')
    } else {
        document.getElementById('sidebar').classList.remove('sidebar-active')
        document.getElementById('sidebar-bg').classList.remove('sidebar-bg-active')
    }
}

document.querySelector('.js-openSidebar').onclick = () => {
    if (document.body.clientWidth > 960) {
        sidebar.classList.remove('d-hide')
        sidebar.classList.add('sidebar-active')

    } else {
        event.preventDefault()
        sidebar.classList.add('sidebar-active')
        document.getElementById('sidebar-bg').classList.add('sidebar-bg-active')
    }
}

// const phoneCleave = new Cleave('#callback_modal .form-input', {
//     numericOnly: true,
//     prefix: '+7',
//     blocks: [2, 3, 3, 2, 2],
//     delimiters: ['(', ')', '-', '-']
// })

// // Отключаем кнопку отправки формы изначально
// if (document.querySelector('form[data-name="mailFieldCheck"]')) {
//     document.querySelectorAll('form button[type="submit"]').forEach(button => button.disabled = 'disabled')
//     // Список всех проверок
//     const checkList = { email: false, password: false, passwordCheck: false }

//     // Элементы паролей
//     const passwordEl = document.querySelector('input[name="password"]')
//     const passwordCheckEl = document.querySelector('input[name="password-check"]')

//     // Переключение кнопки в соответсвии со списком
//     const buttonToggle = () => {
//         const button = document.querySelector('form button[type="submit"]')
//         if (checkList.email && checkList.password && (checkList.passwordCheck || !passwordCheckEl)) {
//             button.disabled = null
//         } else {
//             button.disabled = 'disabled'
//         }
//     }


//     // Проверить изначальные данные полей
//     buttonToggle()

//     // Проверка email
//     document.querySelector('input[name="login"]').addEventListener('input', event => {
//         const mailReg = /^[-0-9a-z_\.]+@[-0-9a-z_^\.]+\.[a-z]{2,6}$/i
//         if (mailReg.test(event.target.value)) {
//             checkList.email = true
//             event.target.classList.remove('is-error')
//             event.target.classList.add('is-success')
//             buttonToggle()
//         } else {
//             checkList.email = false
//             event.target.classList.remove('is-success')
//             event.target.classList.add('is-error')
//             buttonToggle()
//         }
//     })

//     // Проверка паролей
//     passwordEl.addEventListener('input', event => {
//         if (event.target.value.length >= 8) {
//             checkList.password = true
//             event.target.classList.remove('is-error')
//             event.target.classList.add('is-success')
//             buttonToggle()
//         } else {
//             checkList.password = false
//             event.target.classList.remove('is-success')
//             event.target.classList.add('is-error')
//             buttonToggle()
//         }
//     })

//     if (!!passwordCheckEl) passwordCheckEl.addEventListener('input', event => {
//         if (event.target.value === passwordEl.value && !!event.target.value) {
//             checkList.passwordCheck = true
//             event.target.classList.remove('is-error')
//             event.target.classList.add('is-success')
//             buttonToggle()
//         } else {
//             checkList.passwordCheck = false
//             event.target.classList.remove('is-success')
//             event.target.classList.add('is-error')
//             buttonToggle()
//         }
//     })
// }

// //Модальное окно обратного звонка
// const buttonCall = document.querySelector('.callback_phone_button')

// export function initCallbackBtns() {document.querySelectorAll('.bt_callback').forEach(btn => {
//         if (!btn.classList.contains('callback_phone_button')) {
//             btn.addEventListener('click', () => {
//                 new Cleave('#callback_modal .form-input', {
//                     numericOnly: true,
//                     prefix: '+7',
//                     blocks: [2, 3, 3, 2, 2],
//                     delimiters: ['(', ')', '-', '-']
//                 })
//                 callbackModal.classList.add('active')
//                 callbackInput.focus()
//                 if (!!buttonCall) buttonCall.classList.add('d-hide')
//             })
//         }
//     })
// }
// initCallbackBtns()

// // Закрытие окна авторизации
// document.querySelectorAll('.btn-close-modal').forEach(btn => {
//     btn.addEventListener('click', () => {
//         callbackModal.classList.remove('active')
//         if (!!buttonCall) {
//             buttonCall.classList.remove('d-hide')
//             buttonCall.classList.remove('bounceOut')
//         }
//     })
// })

// // Анимация кнопки телефона
// const callbackModal = document.getElementById('callback_modal')
// if (!!buttonCall) buttonCall.addEventListener('click', event => {
//     setTimeout(() => {
//         new Cleave('#callback_modal .form-input', {
//             numericOnly: true,
//             prefix: '+7',
//             blocks: [2, 3, 3, 2, 2],
//             delimiters: ['(', ')', '-', '-']
//         })
//         callbackModal.classList.add('active')
//         callbackInput.focus()
//         if (!!buttonCall) buttonCall.classList.add('d-hide')
//     }, 1000);
//     buttonCall.classList.add('bounceOut')
// })

// const checkboxHolder = document.getElementById('checkboxCallback')
// const inputCheck = document.getElementById('inpLegalCallback')
// const callbackInput = document.getElementById('inpCallback')
// const callbackBtn = document.getElementById('callbackBtn')
// const inpHiddenRaw = callbackModal.querySelector('input[name="phoneRaw"]')

// checkboxHolder.style.cursor = 'pointer'
// Отправка формы доступна если checkbox нажат и введен номер телефона
// checkboxHolder.addEventListener('click', callbackFormReady)
// callbackInput.addEventListener('input', callbackFormReady)
// function callbackFormReady() {
//     console.log(callbackInput.value)
//     if (callbackInput.value.length === 16 && inputCheck.checked) {
//         callbackBtn.disabled = false
//         inpHiddenRaw.value = phoneCleave.getRawValue().substring(2)
//         return true    
//     } else {
//         callbackBtn.disabled = true
//         return false
//     }
// }

// callbackBtn.addEventListener('click', event => {
//     callbackInput.value = ''
//     if (document.getElementById('inpCallback').value.length === 0) callbackBtn.disabled = true
//     const lid_data = {}
//     const decoded = decodeURI(location.search.substring(1))
//     if (decoded) decoded.split('&').forEach(utm => {
//         const vals = utm.split('=')
//         if (vals[0].substring(0, 3) === 'utm') lid_data[vals[0].substring(4)] = vals[1]
//     })
    
//     const floorParams = []
//     if (location.pathname.toLocaleLowerCase() === '/poly') {
//         floorParams.push(document.querySelector('.survey-value').value + ' -площадь пола')
//         const floorBtns = document.querySelector('.survey_points').querySelectorAll('button')
//         floorBtns.forEach(el => {
//             if(el.classList.contains('active')) floorParams.push(el.parentElement.parentElement.querySelector('.tile-title').innerText)
//         })
//     }
//     lid_data.comment = floorParams.join(', ')

//     fetch('/lids', {
//         method: 'POST',
//         body: JSON.stringify({
//             phoneRaw: inpHiddenRaw.value,
//             lid_data: lid_data,
//             _csrf: callbackModal.querySelector('input[name="_csrf"]').value
//         }), 
//         headers:{
//             "Content-Type": "application/json"
//         }
//     }).then(res => {
//         phoneCleave.destroy()
//         // return res
//     })
//     .catch(error => console.error(error))

//     // console.log(callbackInput.value)
//     // phoneCleave.setRawValue('')
//     // document.getElementById('inpCallback').value = ''
// })

window.addEventListener('resize', event => {
    sidebar.classList.remove('sidebar-active')
    document.getElementById('sidebar-bg').classList.remove('sidebar-bg-active')
    if (document.body.clientWidth < 960) {sidebar.classList.remove('d-hide'); document.querySelector('.js-openSidebar').style.display = 'unset'}
    else {
        sidebar.classList.add('d-hide')
    }
    if (!inView.is(document.querySelector('.offer'))) {
        sidebar.classList.remove('d-hide')
    }
})
    
// //Показываем body после всего script
// document.querySelector('body').classList.add('fadeIn')