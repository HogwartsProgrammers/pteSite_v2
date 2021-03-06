import Cleave from 'cleave.js';
const inView = require('in-view')

//функционал верхних стадий
if (location.pathname.toLocaleLowerCase() == '/') require ('../svg.js').svgjsMain()

const decode = s => decodeURIComponent(escape(s))

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
    // require ('../svg.js').svgjsSklady()
    headerIcons()
    // document.getElementById('navTitle').innerText = ''
    // require('../historyScroll').slider()

    // const eggsCirclesSvg = document.querySelectorAll('#eggs_slider svg')
    // const eggsCircles = document.querySelectorAll('#eggs_slider circle')
    // //Смена Eggs txt
    // let eggsScore = 1
    // let eggsCircleScore = 1
    // let stop = false
    // const eggsTxt = ['#egg_txt_time', '#egg_txt_money', '#egg_txt_volume', '#egg_txt_roi']

    // //Eggs слайдер
    // const eggsCirclesArr = ['egg_circle_time', 'egg_circle_money', 'egg_circle_volume', 'egg_circle_roi']

    // eggsCirclesSvg.forEach(el => el.onclick = () => {
    //     stop = true
    //     eggsCircleScore = Number(el.querySelector('circle').getAttribute('name'))
    //     eggsScore = eggsCircleScore
    //     eggsTxtFunc()
    //     setInterval(() => stop = false, 4000)
    // })


    // const eggsTxtFunc = () => {
    //     eggsCircles.forEach(el => el.style.fill = '#fff')
    //     const eggFadeIn = () => document.getElementById('eggs_txt').classList.add('fadeIn')
    //     document.getElementById('eggs_txt').classList.remove('fadeIn')
    //     setTimeout(eggFadeIn, 16)
    //     const egg = document.getElementById('egg_time_holder')
    //     egg.classList.add('egg_animated')
    //     const removeAnimation = () => egg.classList.remove('egg_animated')
    //     setTimeout(removeAnimation, 400)

    //     document.getElementById('eggs_txt').setAttribute('href', `${eggsTxt[eggsScore]}`)
    //     document.getElementById(`${eggsCirclesArr[eggsCircleScore]}`).style.fill = '#000'
    //     eggsCircleScore++
    //     eggsScore++
    //     if (eggsScore === 4) eggsScore = 0
    //     if (eggsCircleScore === 4) eggsCircleScore = 0
    // }
     
    // setInterval(() => {
    //     if (stop) return
    //     eggsTxtFunc()
    // }, 4000)

    const storageBtns = document.querySelector('.survey_points').querySelectorAll('button')

//     //отправка параметров пола лида
storageBtns.forEach(el => {
        el.onclick = () => {
            if (!el.classList.contains('active')) el.classList.add('active') 
            else el.classList.remove('active')
        }
    })
    // document.querySelectorAll('.header-plate button').forEach(el => el.onclick = () => {
    //     document.getElementById('scladSquare').classList.remove('d-hide')
    //     document.getElementById('scladSquare').addEventListener('animationend', () => document.querySelector('.header-plate').scrollIntoView({behavior: 'smooth'}))
    // })
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
// проверка email
const inputTest = new RegExp(/^(?!.*@.*@.*$)(?!.*@.*\-\-.*\..*$)(?!.*@.*\-\..*$)(?!.*@.*\-$)(.*@.+(\..{1,11})?)$/)


// Функционал заголовков в сайдбаре 
const sidebarTitleBtn = document.querySelectorAll('.docs-nav > .nav .sidebar-not')

sidebarTitleBtn.forEach(el => {
    el.querySelector('button').onclick = () => {
        el.querySelector('button').classList.add('d-hide')
        el.querySelector('ul').classList.remove('d-hide')
    }
    el.querySelector('.li-side-header').onclick = () => {
        if (el.querySelector('ul').classList.contains('d-hide')) {
            el.querySelector('button').classList.add('d-hide')
            el.querySelector('ul').classList.remove('d-hide')
        } else {
            el.querySelector('ul').classList.add('d-hide')
            el.querySelector('button').classList.remove('d-hide')
        }
    }
})

if (location.pathname.toLocaleLowerCase() === '/poly') {
    headerIcons()
    photoSlider()

    //header-plate button появление калькулятора
    const headerPlateButton = document.querySelector('.header-plate .header-plate-text button')
    headerPlateButton.addEventListener('animationend', () => {
        headerPlateButton.onclick = () => {
            headerPlateButton.classList.add('fadeOutDown')
            headerPlateButton.addEventListener('animationend', () => {
                headerPlateButton.classList.add('d-hide')
                document.querySelector('#offer_text').scrollIntoView({behavior: 'smooth'})
                document.getElementById('economy-block').classList.remove('d-hide')

                // Делем размер header-plate такой, чтобы влез калькулятор
                document.querySelector('.header-plate').style.height = 'auto'
            })
        }
    })

    // калькулятор полов
    // require ('../svg.js').svgjsSklady()

    const inputVolume = document.getElementById('inp-volume') 
    const nextButton = document.querySelector('#economy-block .bt_next')
    const stepsLi = document.querySelectorAll('#econony-steps > li')
    const steps = document.querySelectorAll('#economy-block .form_step')
    const stepTwoBtns = document.querySelectorAll('#form_step_2 button')
    const stepThreeBtns = document.querySelectorAll('#form_step_3 button')
    const inpMail = document.getElementById('inp-mail')
    const inpPhone = document.getElementById('inp-phone')
    const inpLegal = document.getElementById('inp_legal')

    let inputVolumeFetch = ''
    let stepTwoBtnsFetch = ''
    let stepThreeBtnsFetch
    let inpMailFetch = ''
    let inpPhoneFetch = ''
    let lid_data = {}

    
    inputVolume.addEventListener('animationend', () => inputVolume.classList.remove('bounce')) 
    nextButton.addEventListener('animationend', () => nextButton.classList.remove('shake'))
    inpMail.addEventListener('animationend', () => inpMail.classList.remove('bounce'))
    inpPhone.addEventListener('animationend', () => inpPhone.classList.remove('bounce'))

    const stepFourPhoneCleave = new Cleave('#inp-phone', {
        numericOnly: true,
        prefix: '+7',
        blocks: [2, 3, 3, 2, 2],
        delimiters: ['(', ')', '-', '-']
    })

    const stepTwoBtnsContains = () => {
        let find = false
        stepTwoBtns.forEach(el => {
            if (el.classList.contains('active')) find = true
        })
        return find
    }
    const stepThreeBtnsContains = () => {
        let find = false
        stepThreeBtns.forEach(el => {
            if (el.classList.contains('active')) find = true
        })
        return find
    }
    const saveParams = () => {
        inputVolumeFetch = inputVolume.value
        stepTwoBtns.forEach(el => {
            if (el.classList.contains('active')) stepTwoBtnsFetch = el.innerText
        })
        stepThreeBtns.forEach(el => {
            if (el.classList.contains('active')) stepThreeBtnsFetch = el.innerText
        })
        inpMailFetch = inpMail.value
        inpPhoneFetch = inpPhone.value
    }
    
    const stepOne = (event) => {
        saveParams()
        event.preventDefault()
        nextButton.innerText = 'ДАЛЕЕ'
        inputVolume.focus()
        steps.forEach(el => el.classList.add('d-hide'))
        steps[0].classList.remove('d-hide')
        stepsLi.forEach(el => el.classList.remove('active'))
        stepsLi[0].classList.add('active')
        nextButton.onclick = (event) => {
            saveParams()
            stepTwo(event)
        }
    }

    const stepTwo = (event) => {
        event.preventDefault()
        if (inputVolume.value === '' || inputVolume.value == 0 || inputVolume.value < 0) {
            inputVolume.focus()
            inputVolume.classList.add('bounce')
            nextButton.classList.add('shake')
        } else {
            saveParams()
            nextButton.innerText = 'ДАЛЕЕ'
            steps.forEach(el => el.classList.add('d-hide'))
            steps[1].classList.remove('d-hide')
            stepsLi.forEach(el => el.classList.remove('active'))
            stepsLi[1].classList.add('active')
            nextButton.onclick = stepThree

            stepTwoBtns.forEach(el => el.onclick = event => {
                stepTwoBtns.forEach(el => el.classList.remove('active'))
                event.target.classList.add('active')
                stepThree(event)
            })
        }
    }
    
    const stepThree = (event) => {
        event.preventDefault()
        if (!stepTwoBtnsContains()) {
            inputVolume.focus()
            nextButton.classList.add('shake')          
        } else {
            saveParams()
            nextButton.innerText = 'ДАЛЕЕ'
            steps.forEach(el => el.classList.add('d-hide'))
            steps[2].classList.remove('d-hide')
            stepsLi.forEach(el => el.classList.remove('active'))
            stepsLi[2].classList.add('active')
            nextButton.onclick = stepFour

            stepThreeBtns.forEach(el => el.onclick = event => {
                stepThreeBtns.forEach(el => el.classList.remove('active'))
                event.target.classList.add('active')
                stepFour(event)
            })
        }
    }
    
    const stepFour = (event) => {
        const browser = navigator.userAgent   

        event.preventDefault()
        if (!stepThreeBtnsContains()) {
            inputVolume.focus()
            nextButton.classList.add('shake')                      
        } else {
            if (inputTest.test(inpMail.value)) saveParams()
            nextButton.innerText = 'ОТПРАВИТЬ'
            steps.forEach(el => el.classList.add('d-hide'))
            steps[3].classList.remove('d-hide')
            stepsLi.forEach(el => el.classList.remove('active'))
            stepsLi[3].classList.add('active')
            nextButton.onclick = (event) => {
                if (inpMail.value == '' || inputTest.test(inpMail.value) == false) inpMail.classList.add('animated', 'bounce')
                else if (stepFourPhoneCleave.getRawValue().substring(2).length != 10) inpPhone.classList.add('animated', 'bounce')
                else if (!inpLegal.checked) nextButton.classList.add('shake')
                else {
                    saveParams()
                    lid_data.comment = `${inputVolumeFetch}, ${stepTwoBtnsFetch}, ${stepThreeBtnsFetch}, ${inpMailFetch}`

                    fetch('/lids', {
                        method: 'POST',
                        body: JSON.stringify({
                            phoneRaw: stepFourPhoneCleave.getRawValue().substring(2),
                            lid_data: lid_data,
                            _csrf: callbackModal.querySelector('input[name="_csrf"]').value
                        }), 
                        headers:{
                            "Content-Type": "application/json"
                        }
                    }).catch(error => console.error(error))

                    const url = encodeURI(`https://alarmerbot.ru/?key=94f657-6a1d61-7a5381&message=${decode('\xF0\x9F\x92\xB0')} Лид с калькулятора:\n\n ${decode('\xF0\x9F\x93\xA7')} ${inpMailFetch}\n ${decode('\xE2\x98\x8E')} ${stepFourPhoneCleave.getFormattedValue()}\n ${decode('\xE2\x9C\x8D\xEF\xB8\x8F')} Площадь помещения (м2): ${inputVolumeFetch}\n ${decode('\xE2\x9C\x8D\xEF\xB8\x8F')} Основание: ${stepTwoBtnsFetch}\n ${decode('\xE2\x9C\x8D\xEF\xB8\x8F')} Нагрузка на пол: ${stepThreeBtnsFetch}\n ${decode('\xF0\x9F\x86\x94')} ${yaID}\n ${decode('\xF0\x9F\x96\xA5')} ${browser}\n ${decode('\xF0\x9F\x93\x84')} ${window.location.href}`)

                    fetch(url, {
                        method: 'GET',
                        headers:{ "Content-Type": "application/json" }
                    })
                    
                    phoneCleave.setRawValue('')
                    document.getElementById('inpCallback').value = ''

                    stepFive(event)
                }
            }
        }
    }
    
    const stepFive = (event) => {
        event.preventDefault()
        steps.forEach(el => el.classList.add('d-hide'))
        steps[4].classList.remove('d-hide')
        document.getElementById('econony-steps').classList.add('d-hide')
        nextButton.classList.add('d-hide')
        document.querySelector('#economy-block .bt_callback').classList.add('d-hide')
        document.querySelector('#economy-block .empty-title').classList.add('d-hide')
        document.querySelector('#economy-block .empty-icon').classList.remove('d-hide')
    }
    
    nextButton.onclick = stepTwo
    stepsLi[0].onclick = stepOne
    stepsLi[1].onclick = stepTwo
    stepsLi[2].onclick = stepThree
    stepsLi[3].onclick = stepFour

//     document.getElementById('logo_txt').style.width = '60%'
//     // document.getElementById('navTitle').innerText = 'ПРОМЫШЛЕННЫЕ ПОЛЫ'
//     require('../circlesScript').circlesScript()
//     require('../historyScroll').slider()
    const floorBtns = document.querySelector('.survey_points').querySelectorAll('button')

//     //отправка параметров пола лида
    floorBtns.forEach(el => {
        el.onclick = () => {
            if (!el.classList.contains('active')) el.classList.add('active') 
            else el.classList.remove('active')
        }
    })
}
 
//функционал svg sidebar'a
// if (document.body.clientWidth > 425) {
//     document.querySelectorAll('.accordion').forEach(el => {
//         el.classList.remove('accordion')
//         el.querySelector('.accordion-body')
//     })
// }

// // костыль для шестерней
const use = document.querySelectorAll('.header-plate > svg')
// const storageUse = document.querySelector('#eggs_logo use')

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

    // if (location.pathname.toLocaleLowerCase() === '/sklady') {
    //     if (document.body.clientWidth <= 320) {
    //         storageUse.setAttribute('x', '5')
    //         storageUse.setAttribute('y', '16')
    //     } 
    //     else if (document.body.clientWidth <= 375) {
    //         storageUse.setAttribute('x', '5')
    //         storageUse.setAttribute('y', '15')
    //     } 
    //     else if (document.body.clientWidth <= 425) {
    //         storageUse.setAttribute('x', '5')
    //         storageUse.setAttribute('y', '14')
    //     }
    //     else if (document.body.clientWidth <= 768) {
    //         storageUse.setAttribute('x', '6')
    //         storageUse.setAttribute('y', '12')
    //     } 
    //     else {
    //         document.querySelector('#egg_time_holder svg').setAttribute('viewBox', '0 0 148 148')
    
    //         storageUse.setAttribute('x', '0')
    //         storageUse.setAttribute('y', '4')
    //     }
    // }
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
    
    if(!inView.is(document.querySelector('.offer'))) {
        sidebar.classList.add('sidebar-relative')
        document.querySelector('.header-plate').classList.add('header-plate-sm')
    }
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
    const browser = navigator.userAgent   

    callbackInput.value = ''
    if (document.getElementById('inpCallback').value.length === 0) callbackBtn.disabled = true
    const lid_data = {}
    const decoded = decodeURI(location.search.substring(1))
    if (decoded) decoded.split('&').forEach(utm => {
        const vals = utm.split('=')
        if (vals[0].substring(0, 3) === 'utm') lid_data[vals[0].substring(4)] = vals[1]
    })

    let url = encodeURI(`https://alarmerbot.ru/?key=94f657-6a1d61-7a5381&message=${decode('\xF0\x9F\x92\xB0')} Лид с cta:\n\n ${decode('\xE2\x98\x8E')} ${inpHiddenRaw.value}\n ${decode('\xF0\x9F\x86\x94')} ${yaID}\n ${decode('\xF0\x9F\x96\xA5')} ${browser}\n ${decode('\xF0\x9F\x93\x84')} ${window.location.href}`)
    
    const floorParams = []
    if (location.pathname.toLocaleLowerCase() === '/poly') {
        floorParams.push(document.querySelector('.survey-value').value + ' -площадь пола')
        const floorBtns = document.querySelector('.survey_points').querySelectorAll('button')
        floorBtns.forEach(el => {
            if(el.classList.contains('active')) floorParams.push(el.parentElement.parentElement.querySelector('.tile-title').innerText)
        })

        url = encodeURI(`https://alarmerbot.ru/?key=94f657-6a1d61-7a5381&message=${decode('\xF0\x9F\x92\xB0')} Лид с cta:\n\n ${decode('\xE2\x98\x8E')} ${inpHiddenRaw.value}\n ${decode('\xE2\x9C\x8D\xEF\xB8\x8F')} Площадь помещения (м2): ${document.querySelector('.survey-value').value  || 'Не выбрано*'}\n ${decode('\xE2\x9D\x97\xEF\xB8\x8F')} ${[...floorBtns].filter(el => el.classList.contains('active')).map(el => {
            if(el.classList.contains('active')) return el.parentElement.parentElement.querySelector('.tile-title').innerText
        }).join(', ') || 'Не выбрано*'}\n ${decode('\xF0\x9F\x86\x94')} ${yaID}\n ${decode('\xF0\x9F\x96\xA5')} ${browser}\n ${decode('\xF0\x9F\x93\x84')} ${window.location.href}`)
    }
    lid_data.comment = floorParams.join(', ')

    const storageParams = []
    if (location.pathname.toLocaleLowerCase() === '/sklady') {
        storageParams.push('Требуется площадь склада = ' + document.querySelector('.survey-value').value + ' м²' + ', хотят:')
        const storageBtns = document.querySelector('.survey_points').querySelectorAll('button')
        storageBtns.forEach(el => {
            if(el.classList.contains('active')) storageParams.push(el.parentElement.parentElement.querySelector('.tile-title').innerText)
        })

        url = encodeURI(`https://alarmerbot.ru/?key=94f657-6a1d61-7a5381&message=${decode('\xF0\x9F\x92\xB0')} Лид с cta:\n\n ${decode('\xE2\x98\x8E')} ${inpHiddenRaw.value}\n ${decode('\xE2\x9C\x8D\xEF\xB8\x8F')} Требуется площадь склада (м²): ${document.querySelector('.survey-value').value  || 'Не выбрано*'}\n ${decode('\xE2\x9D\x97\xEF\xB8\x8F')} ${[...storageBtns].filter(el => el.classList.contains('active')).map(el => {
            if(el.classList.contains('active')) return el.parentElement.parentElement.querySelector('.tile-title').innerText
        }).join(', ') || 'Не выбрано*'}\n ${decode('\xF0\x9F\x86\x94')} ${yaID}\n ${decode('\xF0\x9F\x96\xA5')} ${browser}\n ${decode('\xF0\x9F\x93\x84')} ${window.location.href}`)
    }
    lid_data.comment = storageParams.join(', ')

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

    fetch(url, {
        method: 'GET',
        headers:{ "Content-Type": "application/json" }
    })
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

const yaMetricId = 55196683
let yaID = 0

ym(yaMetricId, 'getClientID', clientID => {
  yaID = clientID
})

const notificationBot = () => {
    const browser = navigator.userAgent   

    document.querySelectorAll('.goal_item').forEach(btn => btn.addEventListener('click', () => {
        const goal = btn.dataset.goal

        ym(yaMetricId, 'reachGoal', goal)

        const url = encodeURI(`https://alarmerbot.ru/?key=94f657-6a1d61-7a5381&message=${decode('\xF0\x9F\x8E\xAF')} Клиент достиг цель метрики: \n\n${decode('\xF0\x9F\x86\x94')} ${yaID}\n${decode('\xE2\x9A\xAA\xEF\xB8\x8F')} ${goal}\n${decode('\xF0\x9F\x96\xA5')} ${browser}\n${decode('\xF0\x9F\x93\x84')} ${window.location.href}`)

        fetch(url, {
            method: 'GET',
            headers:{ "Content-Type": "application/json" }
        })
    }))
}
notificationBot()

// $(document).ready(function(){
//     $('.goal_item').on('click',function(){
//         var goal=$(this).attr('data-goal');
//         $.ajax({
//           method: "GET",
//           url: "https://alarmerbot.ru/",
//           data: {
//               key: "94f657-6a1d61-7a5381",
//               message: "Клиент достиг цель метрики: \n\n"+"- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  yaClientID:"+yaID+",\n- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  Цель: "+goal+"\n- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  Браузер: "+browser+",\n- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  Страница: "+window.location.href
//           }
//         });
//     });
//     // Notification of Commertial Offer
//     if(+[1581664640626960170,1579346143130349358,1582389401509112116].indexOf(+yaID)===-1) {
//         let path=window.location.pathname;
//         let url=path.split('/');
//         if(!!url[1] && url[1]=='offers' && !!url[2]) {
//             $.ajax({
//               method: "GET",
//               url: "https://alarmerbot.ru/",
//               data: {
//                   key: "94f657-6a1d61-7a5381",
//                   message: "Клиент зашёл на страницу с КП: \n\n"+"- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  yaClientID:"+yaID+"\n- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  Браузер: "+browser+",\n- ${decode('\xE2\x9A\xAA\xEF\xB8\x8F')}  Страница: "+window.location.href
//               }
//             });
//         }
//     }
// });
    
// //Показываем body после всего script
// document.querySelector('body').classList.add('fadeIn')