const Cleave = require('cleave.js')
const inView = require('../in-view.min')

//функционал верхних стадий
if (location.pathname.toLocaleLowerCase() == '/') require ('../svg.js').svgjsMain()

const headerIcons = () => {
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
            el.querySelector('.h5').innerHTML = cta
            el.querySelector('button').innerText = buttonT
        })
}

if (location.pathname.toLocaleLowerCase() === '/' || location.pathname.toLocaleLowerCase() === '/login' || location.pathname.toLocaleLowerCase() === '/signup' || location.pathname.toLocaleLowerCase() === '/recovery') {
    headerIcons()
    // document.querySelector('.first-screen').classList.add('ptFPage')
    // Добавляем на location "/" , кнопке в баре класс bt_callback
    // document.querySelectorAll('.header-plate button').forEach(el => el.classList.add('bt_callback'))

    inView('.svgHolder').on('enter', el => {
        if (!el.childElementCount) {
            el.classList.add('animated', 'fadeIn')
            el.innerHTML = `<img class="svgObjHolder p-centered" src="${el.dataset.src}">`
        }
    })
}

// заголовок навбара

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

if (location.pathname.toLocaleLowerCase() === '/sklady') {
    require ('../svg.js').svgjsSklady()
    headerIcons()
    // document.getElementById('navTitle').innerText = ''
    // require('../historyScroll').slider()
    
    document.querySelectorAll('.header-plate button').forEach(el => el.onclick = () => {
        document.getElementById('scladSquare').classList.remove('d-hide')
        document.getElementById('scladSquare').addEventListener('animationend', () => document.querySelector('.header-plate').scrollIntoView({behavior: 'smooth'}))
    })
}

// функция слайдера

const photoSlider = () => {
    const photos = [
        {image: './images/timeline/turbomyfta.jpg', title: 'Топпинг полы', url: 'https://proftechpol.ru/portfolio/topping-pol-v-ramenskom'},
        {image: './images/timeline/turboholod-polimerny-pol.jpg', title: 'Полимерный пол', url: 'https://proftechpol.ru/portfolio/polimerniy-pol-moskva'},
        {image: './images/timeline/arsenal-sklad.jpg', title: 'Склад в Щёлково', url: 'https://proftechpol.ru/portfolio/shelkovo-sklad-betonniy-pol'},
        {image: 'https://proftechpol.ru/assets/images/timeline/sklad-bug.jpg', title: 'СКЛАД В БАЛАШИХЕ', url: 'https://proftechpol.ru/portfolio/sklad-balashiha-2'},
        {image: 'https://proftechpol.ru/assets/images/timeline/fotostudiya.jpg', title: 'ФОТОСТУДИЯ', url: 'https://proftechpol.ru/portfolio/msk-hovrino-laboratoriya'},
        {image: 'https://proftechpol.ru/assets/images/timeline/iron-sklad.jpg', title: 'СКЛАД В ХОРОШЕВСКОМ РАЙОНЕ', url: 'https://proftechpol.ru/portfolio/sheremetievo-pozharnaya-chast'},
        {image: 'https://proftechpol.ru/assets/images/timeline/laboratoriya.jpg', title: 'ЛАБОРАТОРИЯ', url: 'https://proftechpol.ru/portfolio/msk-hovrino-laboratoriya'},
        {image: 'https://proftechpol.ru/assets/images/timeline/sheremetyevo-fire.jpg', title: 'АЭРОПОРТ ШЕРЕМЕТЬЕВО ПОЖАРНАЯ ЧАСТЬ', url: 'https://proftechpol.ru/portfolio/sheremetievo-pozharnaya-chast'},
        {image: 'https://proftechpol.ru/assets/images/timeline/aprelevka.jpg', title: 'ЦЕХ ПО РЕМОНТУ АВТОМОБИЛЕЙ В АПРЕЛЕВКЕ', url: 'https://proftechpol.ru/portfolio/aprelevka-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/serp.jpg', title: 'СКЛАДСКОЕ ПОМЕЩЕНИЕ', url: 'https://proftechpol.ru/portfolio/serpuhov-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/ximky.jpg', title: 'ПОДЗЕМНЫЙ ПАРКИНГ В ХИМКАХ', url: 'https://proftechpol.ru/portfolio/himki-parking'},
        {image: 'https://proftechpol.ru/assets/images/timeline/bask-front-1.jpg', title: 'СКЛАД КОМПАНИИ АО «БАСК»', url: 'https://proftechpol.ru/portfolio/msk-lefortovo-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/water-1-min.jpg', title: 'СКЛАДСКОЕ ПОМЕЩЕНИЕ ООО «ЗДОРОВАЯ ВОДА»', url: 'https://proftechpol.ru/portfolio/msk-filevskiy-park-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/avtek-1-min.jpg', title: 'ЦЕХ АО «АВТЭК»', url: 'https://proftechpol.ru/portfolio/pushino-avtoservis'},
        {image: 'https://proftechpol.ru/assets/images/timeline/q-works-1-min.jpg', title: 'ПРОМЫШЛЕННЫЙ ПОЛ ООО «КЬЮ-ВОРКС»', url: 'https://proftechpol.ru/portfolio/msk-presnenskiy-office'},
        {image: 'https://proftechpol.ru/assets/images/timeline/promproject-front-1.jpg', title: 'СКЛАД ООО «ПРОЕКТПРОМ 72»', url: 'https://proftechpol.ru/portfolio/schelkovo-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/lobnya.jpg', title: 'СКЛАДСКОЕ ПОМЕЩЕНИЕ В ЛОБНЕ', url: 'https://proftechpol.ru/portfolio/lobnya-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/nikolina-gora-1-min.jpg', title: 'ФОНД «ФОНД ВАЛЕРИЯ ГЕРГИЕВА»', url: 'https://proftechpol.ru/portfolio/nikolina-gora-odintsovo'},
        {image: 'https://proftechpol.ru/assets/images/timeline/tula-1-min.jpg', title: 'ООО «АРМАДА СТРОЙ»', url: 'https://proftechpol.ru/portfolio/tula-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/poltevo-1-min.jpg', title: 'ЦЕХ КОМПАНИИ ООО «ОЛАНДА-20»', url: 'https://proftechpol.ru/portfolio/poltevo-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/alpla.jpg', title: 'СКЛАД В ДЗЕРЖИНСКОМ', url: 'https://proftechpol.ru/portfolio/dzerzhinsky-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/agrotrans-front-1.jpg', title: 'МОЙКА КОМПАНИИ ООО «АГРОТРАНС»', url: 'https://proftechpol.ru/portfolio/bronnitsy-avtomoyka'},
        {image: 'https://proftechpol.ru/assets/images/timeline/red-mayak-1-min.jpg', title: 'ООО «КОМПАНИЯ ПМП ЭЛЕКТРО»', url: 'https://proftechpol.ru/portfolio/msk-chertanovo-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/olimp-city-sklad-front-1.jpg', title: 'СКЛАД ООО «ОЛИМП-СИТИ»', url: 'https://proftechpol.ru/portfolio/sklad-dzerzhinsky'},
        {image: 'https://proftechpol.ru/assets/images/timeline/zory-1-min.jpg', title: 'СКЛАД', url: 'https://proftechpol.ru/portfolio/stupino-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/zaraysk-1-min.jpg', title: 'АО «ЗАРАЙСКАГРОПРОМСНАБ»', url: 'https://proftechpol.ru/portfolio/mytishi-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/forttreid-1-min.jpg', title: 'ООО «ФОРТТРЕЙД»', url: 'https://proftechpol.ru/portfolio/zaraysk-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/usam-front-1.jpg', title: 'СКЛАД КОМПАНИИ ООО «УСАМ»', url: 'https://proftechpol.ru/portfolio/balashiha-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/podolsk-1-min.jpg', title: 'СКЛАД КОМПАНИИ ООО «АНАТОЛИЯ»', url: 'https://proftechpol.ru/portfolio/podolsk-sklad'},
        {image: 'https://proftechpol.ru/assets/images/timeline/podval.jpg', title: 'ПОДВАЛЬНОЕ ПОМЕЩЕНИЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/prof-21-front-1.jpg', title: 'ОФИС ООО «ПРОФ 21»', url: 'https://proftechpol.ru/portfolio/msk-timiryazevo-office'},
        {image: 'https://proftechpol.ru/assets/images/timeline/sport-dem.jpg', title: 'ЧАСТНЫЙ СПОРТЗАЛ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/demg.jpg', title: 'ГАРАЖ ЧАСТНИКА', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/dachanr-1-min.jpg', title: 'ДВУХЭТАЖНЫЙ КОТТЕДЖ «МИЛЛЕНИУМ ПАРК»', url: 'https://proftechpol.ru/portfolio/millenium-park-kottedj'},
        {image: 'https://proftechpol.ru/assets/images/timeline/santechkomplekt-1-min.jpg', title: 'СКЛАД КОМПАНИИ ООО «САНТЕХКОМПЛЕКТ»', url: 'https://proftechpol.ru/portfolio/vidnoe-polimer-tseh'},
        {image: 'https://proftechpol.ru/assets/images/timeline/golyevo.jpg', title: 'СКЛАД КОМПАНИИ В ГОЛЬЕВО', url: 'https://proftechpol.ru/portfolio/golyevo-sklad-polimer'},
        {image: 'https://proftechpol.ru/assets/images/timeline/shelk.jpg', title: 'РЕСТОРАН', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/piv-zavod-1-min.jpg', title: 'ЗАО «МОСКОВСКАЯ ПИВОВАРЕННАЯ КОМПАНИЯ»', url: 'https://proftechpol.ru/portfolio/zavod-mytishi'},
        {image: 'https://proftechpol.ru/assets/images/timeline/moskvoretsky-rynok-front-1.jpg', title: 'ООО «МОСКВОРЕЦКИЙ РЫНОК»', url: 'https://proftechpol.ru/portfolio/msk-moskvoretskiy-rinok'},
        {image: 'https://proftechpol.ru/assets/images/timeline/parkovka-krk-1-min.jpg', title: 'ПАРКОВКА', url: 'https://proftechpol.ru/portfolio/krasnogorsk-parking'},
        {image: 'https://proftechpol.ru/assets/images/timeline/perekrestok-1-min.jpg', title: 'КОРИДОР МАГАЗИНА «ПЕРЕКРЕСТОК»', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/kamen.jpg', title: 'ПРОИЗВОДСТВЕННОЕ ПОМЕЩЕНИЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/pervomayskaya-1-min.jpg', title: 'ПРОИЗВОДСТВЕННЫЙ ЦЕХ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/sport.jpg', title: 'СПОРТИВНАЯ ПЛОЩАДКА', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/arma.jpg', title: 'РЕСТОРАН', url: 'https://proftechpol.ru/portfolio/msk-kurskaya-bar-arma'},
        {image: 'https://proftechpol.ru/assets/images/timeline/magaz.jpg', title: 'МАГАЗИН', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/moyka-1-min.jpg', title: 'МОЙКА', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/dachaup.jpg', title: 'КОТТЕДЖ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/ggsklad.jpg', title: 'ООО «ГОРЫНЫЧ-ГРУПП»', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/beldji.jpg', title: 'ПРОИЗВОДСТВЕННОЕ ПОМЕЩЕНИЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/lazery.jpg', title: 'ПРОИЗВОДСТВЕННОЕ ПОМЕЩЕНИЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/dana-moll.jpg', title: 'ПОДЗЕМНЫЙ ПАРКИНГ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/momo.jpg', title: 'ПОДЗЕМНЫЙ ПАРКИНГ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/rock-cafe.jpg', title: 'РОК КАФЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/gromin.jpg', title: 'ООО «ГРОМИН» Г.МИНСК', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/mzbn.jpg', title: 'СКЛАД', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/prostor.jpg', title: 'ПАРКИНГ «ПРОСТОР»', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/prilesye.jpg', title: 'ТРАНСПОРТНО-ЛОГИСТИЧЕСКИЙ ЦЕНТР', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/peleng.jpg', title: 'ПРОИЗВОДСТВЕННОЕ ПОМЕЩЕНИЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/mogilev-std.jpg', title: 'СТАДИОН МОГИЛЕВ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/ganna.jpg', title: 'ПРОИЗВОДСТВЕННОЕ ПОМЕЩЕНИЕ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/sanatoriy.jpg', title: 'ДЕТСКИЙ САНАТОРИЙ РУЖАНСКИЙ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/bate.jpg', title: 'ОАО «БАТЭ»', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/frebor.jpg', title: 'ООО «ФРЕБОР» Г.БОРИСОВ', url: ''},
        {image: 'https://proftechpol.ru/assets/images/timeline/logoysk.jpg', title: 'ПРОИЗВОДСТВО УПАКОВКИ ЛОГОЙСК', url: ''},{image: 'https://proftechpol.ru/assets/images/timeline/minsk-obsh.jpg', title: 'ОБЩЕСТВЕННОЕ ЗДАНИЕ Г.МИНСКА', url: ''}
    ]
    
    let i = 0
    let stop = false

    const img = document.querySelector('.sidebar-slider img')
    const title = document.querySelector('.sidebar-slider .slider-description')
    const url = document.querySelector('.sidebar-slider a')
    const backArrow = document.querySelector('.back-arrow')
    const forwardArrow = document.querySelector('.forward-arrow')

    const autoscroll = () => {
        if (stop) return
        if (i == photos.length || !photos[i].image) i = 0
        img.setAttribute('src', photos[i].image)
        title.innerHTML = photos[i].title
        if (!photos[i].url) url.classList.add('d-hide')
        else {
            url.classList.remove('d-hide')
            url.setAttribute('href', photos[i].url )
        }
        i++
    }
    autoscroll()
    setInterval(autoscroll, 3000)

    backArrow.onclick = () => {
        i--
        if (i < 0 ) i = photos.length - 1
        img.setAttribute('src', photos[i].image)
        title.innerHTML = photos[i].title
        if (!photos[i].url) url.classList.add('d-hide')
        else {
            url.classList.remove('d-hide')
            url.setAttribute('href', photos[i].url )
        }
        if (!stop) {
            stop = true
            setTimeout(() => {
                stop = false
            }, 1000)
        }
    }

    forwardArrow.onclick = () => {
        i++
        if (i == photos.length || !photos[i].image) i = 0
        img.setAttribute('src', photos[i].image)
        title.innerHTML = photos[i].title
        if (!photos[i].url) url.classList.add('d-hide')
        else {
            url.classList.remove('d-hide')
            url.setAttribute('href', photos[i].url )
        }
        if (!stop) {
            stop = true
            setTimeout(() => {
                stop = false
            }, 1000)
        }
    }
}

if (location.pathname.toLocaleLowerCase() === '/poly') {
    headerIcons()
    photoSlider()

    const 

    fetch('/lids', {
        method: 'POST',
        body: JSON.stringify({
            phoneRaw: inpHiddenRaw.value,
            lid_data: lid_data,
            _csrf: callbackModal.querySelector('input[name="_csrf"]').value
        }), 
        headers:{
            "Content-Type": "application/json"
        }
    }).then(res => {
        phoneCleave.destroy()
        // return res
    })
    .catch(error => console.error(error))

//     document.getElementById('logo_txt').style.width = '60%'
//     // document.getElementById('navTitle').innerText = 'ПРОМЫШЛЕННЫЕ ПОЛЫ'
//     require('../circlesScript').circlesScript()
//     require('../historyScroll').slider()
    const floorBtns = document.querySelector('.survey_points').querySelectorAll('button')

//     //отправка параметров пола лида
    floorBtns.forEach(el => {
        el.onclick = () => {
            if (!el.classList.contains('active')) {
                el.classList.add('active')
            } else {
                el.classList.remove('active')
            }
        }
    })
}
 
//функционал svg sidebar'a
if (document.body.clientWidth > 425) {
    document.querySelectorAll('.accordion').forEach(el => {
        el.classList.remove('accordion')
        el.querySelector('.accordion-body')
    })
}


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
const use = document.querySelectorAll('.header-plate use')

function gearChange() {
    document.body.clientWidth <= 425 ?
        use.forEach(el => {
            el.setAttribute('x', '6')
            el.setAttribute('y', '6')
        })
        : use.forEach(el => {
            el.setAttribute('x', '11')
            el.setAttribute('y', '11')
        })
}
gearChange()

// //скролл сайдбара
require('../scrollSidebar').scrollSidebar()

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
    
    if(!inView.is(document.querySelector('.offer'))) sidebar.classList.add('sidebar-relative')
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

const phoneCleave = new Cleave('#callback_modal .form-input', {
    numericOnly: true,
    prefix: '+7',
    blocks: [2, 3, 3, 2, 2],
    delimiters: ['(', ')', '-', '-']
})

// // Отключаем кнопку отправки формы изначально
if (document.querySelector('form[data-name="mailFieldCheck"]')) {
    document.querySelectorAll('form button[type="submit"]').forEach(button => button.disabled = 'disabled')
    // Список всех проверок
    const checkList = { email: false, password: false, passwordCheck: false }

//     // Элементы паролей
    const passwordEl = document.querySelector('input[name="password"]')
    const passwordCheckEl = document.querySelector('input[name="password-check"]')

//     // Переключение кнопки в соответсвии со списком
    const buttonToggle = () => {
        const button = document.querySelector('form button[type="submit"]')
        if (checkList.email && checkList.password && (checkList.passwordCheck || !passwordCheckEl)) {
            button.disabled = null
        } else {
            button.disabled = 'disabled'
        }
    }

//     // Проверить изначальные данные полей
    buttonToggle()

//     // Проверка email
    document.querySelector('input[name="login"]').addEventListener('input', event => {
        const mailReg = /^[-0-9a-z_\.]+@[-0-9a-z_^\.]+\.[a-z]{2,6}$/i
        if (mailReg.test(event.target.value)) {
            checkList.email = true
            event.target.classList.remove('is-error')
            event.target.classList.add('is-success')
            buttonToggle()
        } else {
            checkList.email = false
            event.target.classList.remove('is-success')
            event.target.classList.add('is-error')
            buttonToggle()
        }
    })

//     // Проверка паролей
    passwordEl.addEventListener('input', event => {
        if (event.target.value.length >= 8) {
            checkList.password = true
            event.target.classList.remove('is-error')
            event.target.classList.add('is-success')
            buttonToggle()
        } else {
            checkList.password = false
            event.target.classList.remove('is-success')
            event.target.classList.add('is-error')
            buttonToggle()
        }
    })

    if (!!passwordCheckEl) passwordCheckEl.addEventListener('input', event => {
        if (event.target.value === passwordEl.value && !!event.target.value) {
            checkList.passwordCheck = true
            event.target.classList.remove('is-error')
            event.target.classList.add('is-success')
            buttonToggle()
        } else {
            checkList.passwordCheck = false
            event.target.classList.remove('is-success')
            event.target.classList.add('is-error')
            buttonToggle()
        }
    })
}

// //Модальное окно обратного звонка
const buttonCall = document.querySelector('.callback_phone_button')

export function initCallbackBtns() {document.querySelectorAll('.bt_callback').forEach(btn => {
        if (!btn.classList.contains('callback_phone_button')) {
            btn.addEventListener('click', () => {
                new Cleave('#callback_modal .form-input', {
                    numericOnly: true,
                    prefix: '+7',
                    blocks: [2, 3, 3, 2, 2],
                    delimiters: ['(', ')', '-', '-']
                })
                callbackModal.classList.add('active')
                callbackInput.focus()
                if (!!buttonCall) buttonCall.classList.add('d-hide')
            })
        }
    })
}
initCallbackBtns()

// // Закрытие окна авторизации
document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        callbackModal.classList.remove('active')
        if (!!buttonCall) {
            buttonCall.classList.remove('d-hide')
            buttonCall.classList.remove('bounceOut')
        }
    })
})

// // Анимация кнопки телефона
const callbackModal = document.getElementById('callback_modal')
if (!!buttonCall) buttonCall.addEventListener('click', event => {
    setTimeout(() => {
        new Cleave('#callback_modal .form-input', {
            numericOnly: true,
            prefix: '+7',
            blocks: [2, 3, 3, 2, 2],
            delimiters: ['(', ')', '-', '-']
        })
        callbackModal.classList.add('active')
        callbackInput.focus()
        if (!!buttonCall) buttonCall.classList.add('d-hide')
    }, 1000);
    buttonCall.classList.add('bounceOut')
})

const checkboxHolder = document.getElementById('checkboxCallback')
const inputCheck = document.getElementById('inpLegalCallback')
const callbackInput = document.getElementById('inpCallback')
const callbackBtn = document.getElementById('callbackBtn')
const inpHiddenRaw = callbackModal.querySelector('input[name="phoneRaw"]')

checkboxHolder.style.cursor = 'pointer'
// Отправка формы доступна если checkbox нажат и введен номер телефона
checkboxHolder.addEventListener('click', callbackFormReady)
callbackInput.addEventListener('input', callbackFormReady)
function callbackFormReady() {
    console.log(callbackInput.value)
    if (callbackInput.value.length === 16 && inputCheck.checked) {
        callbackBtn.disabled = false
        inpHiddenRaw.value = phoneCleave.getRawValue().substring(2)
        return true    
    } else {
        callbackBtn.disabled = true
        return false
    }
}

callbackBtn.addEventListener('click', event => {
    callbackInput.value = ''
    if (document.getElementById('inpCallback').value.length === 0) callbackBtn.disabled = true
    const lid_data = {}
    const decoded = decodeURI(location.search.substring(1))
    if (decoded) decoded.split('&').forEach(utm => {
        const vals = utm.split('=')
        if (vals[0].substring(0, 3) === 'utm') lid_data[vals[0].substring(4)] = vals[1]
    })
    
    const floorParams = []
    if (location.pathname.toLocaleLowerCase() === '/poly') {
        floorParams.push(document.querySelector('.survey-value').value + ' -площадь пола')
        const floorBtns = document.querySelector('.survey_points').querySelectorAll('button')
        floorBtns.forEach(el => {
            if(el.classList.contains('active')) floorParams.push(el.parentElement.parentElement.querySelector('.tile-title').innerText)
        })
    }
    lid_data.comment = floorParams.join(', ')

    fetch('/lids', {
        method: 'POST',
        body: JSON.stringify({
            phoneRaw: inpHiddenRaw.value,
            lid_data: lid_data,
            _csrf: callbackModal.querySelector('input[name="_csrf"]').value
        }), 
        headers:{
            "Content-Type": "application/json"
        }
    }).then(res => {
        phoneCleave.destroy()
        // return res
    })
    .catch(error => console.error(error))

    // console.log(callbackInput.value)
    // phoneCleave.setRawValue('')
    // document.getElementById('inpCallback').value = ''
})

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