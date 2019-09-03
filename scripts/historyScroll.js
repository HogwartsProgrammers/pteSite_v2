export function slider() {
    init()

    function init() {
        const $el = document.getElementById('timeline')
        const images = []
        let current
        let count
        let $imgDots = () => $el.querySelector('.timeline-dots')
        const $imgCont = () => $el.querySelector('.timeline-img')
        const $imgCTA = () => $el.querySelector('.timeline-bottom')
        const $imgHead = () => $el.querySelector('.timeline-header h3')
        // Возьмём параметры
        const baseUrl = $el.dataset.base
        const defaultImg = $el.dataset.default

        // Удалим их из DOM аттрибутов
        $el.removeAttribute('data-base')
        $el.removeAttribute('data-default')

        // Если они прописаны, то создаём компонент
        if (baseUrl.length && defaultImg.length) {

            // Загрузим элементы слайдера из списка DOM
            const arr = $el.querySelectorAll('li')
            let num = $el.querySelectorAll('li.obj').length
            count = num
            current = num + 1
            let dots = ''
            let tl = ''
            arr.forEach(li => {
                if (li.classList.contains('obj')) {
                    let title = li.innerText
                    let name = li.dataset.src
                    let desc = li.dataset.desc
                    let url = li.dataset.url
                    dots += `<li class="label label-rounded dot c-hand mr-1 mb-1" data-url="${url}" data-src="${baseUrl+name}" data-desc="${desc}" data-num="${num}">${title}</li>`
                    num--
                } else {
                    tl += setTimeScope(dots, li.className, li.innerText)
                    dots = ''
                }
            })

            // Создадим html-контейнеры компонента и встроим в туда timeline
            
            // <button class="btn btn-error p-centered bt_see_object">ПОСМОТРЕТЬ ОБЪЕКТ</button>

            $el.innerHTML = `
            <li class="timeline-header"><h3 class="text-uppercase"></h3></li>
            <li class="timeline-img">
                <div class="timeline-bottom d-hide">
                </div>
                <div class="item-prev item-shift btn btn-action btn-lg"><i class="icon icon-arrow-left"></i></div>
                <div class="item-next item-shift btn btn-action btn-lg"><i class="icon icon-arrow-right"></i></div>
            </li>
            <li class="panel hide-xs timeline-cont">
                <div class="panel-body">
                    <ul class="timeline timeline-dots">${tl}</ul>
                </div>
            </li>
            `
                // Запишем в свойства слайдера ссылки на элементы
            // Привяжем событие на клик мышкой по метке
            $imgDots().addEventListener('click', clickHandler)
            

            // Привяжем событие на сдвиг картинки
            $el.querySelectorAll('.item-shift').forEach(sh => {
                sh.addEventListener('click', shiftHandler)
            })

            // Вставим первую картинку с заставкой
            setIntro()

            // Привяжем системные события для динамических изменений слайдера
            window.onload = function() {
                setImgHeight()
            }
            window.onresize = function() {
                setImgHeight()
            }
        }
    

    function setTimeScope(dots, kind, title) {
        let icon = '<div class="timeline-icon icon-lg"><i class="icon icon-check"></i></div>'
        if (kind === 'month') icon = '<div class="timeline-icon"></div>'
        return `
        <div class="timeline-item">
            <div class="timeline-left">${icon}</div>
            <div class="timeline-content">
                <div class="tile">
                    <div class="tile-content">
                        <div class="tile-subtitle text-primary">${title}</div>
                        <div>${dots}</div>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    function setImgHeight() {
        $el.querySelector('.timeline-img').style.height = $imgCont().querySelector('img').height + 'px'
    }

    function setIntro() {
        clearDots()
        $imgCont().querySelectorAll('.slide').forEach(el => el.remove())
        $imgCont().insertAdjacentHTML('afterbegin', `<figure class="slide"><img class="img-responsive" src="${baseUrl+defaultImg}" alt="" /></figure>`);
        $imgCTA().classList.add('d-hide')
        $imgHead().textContent = 'ХРОНИКА ПРОМЫШЛЕННЫХ ПОЛОВ ООО «ПРОФТЕХПОЛ»'
    }

    function setSlide(No) {
        const el = $imgDots().querySelector(`.dot[data-num="${No}"]`)
        if (el) moveSlide(el)
    }

    function moveSlide(el) {
        clearDots()
        insertDesc(el.dataset.url, el.dataset.desc)
        markDot(el)
        el.scrollIntoView({ behavior: 'smooth', block: 'end' })
        shiftSlide(el.dataset.src)
        current = +el.dataset.num
    }

    function clearDots() {
        return $imgDots().querySelectorAll('.dot').forEach(el => {
            el.classList.remove('label-primary')
            el.classList.add('c-hand')
        })
    }

    function markDot(el) {
        el.classList.add('label-primary')
        el.classList.remove('c-hand')
    }

    function insertDesc(url, desc) {
        $imgHead().textContent = desc;
        (url) ? $imgCTA().classList.remove('d-hide'): $imgCTA().classList.add('d-hide')
        // const btn = $imgCTA().querySelector('.bt_see_object');
        // btn.dataset.url = url;
        // btn.addEventListener('click', seeObjectClick)
    }

    function shiftSlide(src) {
        let img = $imgCont().getElementsByTagName('figure')[0]
        setImgHeight()
        img.classList.add('slide-out');
        img.insertAdjacentHTML('afterend', `<figure class="slide slide-in"><img class="img-responsive" src="${src}" alt="" /></figure>`)
        img.addEventListener('animationend', handleAnimationEnd)

        function handleAnimationEnd() {
            img.classList.remove('animated', 'slide-out')
            img.removeEventListener('animationend', handleAnimationEnd)
            img.remove()
            $imgCont().getElementsByTagName('figure')[0].classList.remove('slide-in');
            $imgCont().querySelectorAll('.slide-in').forEach(el => el.remove())
        }
    }

    function showNav(kind) {
        $el.querySelector('.' + kind).classList.remove('d-hide')
    }

    function hideNav(kind) {
        $el.querySelector('.' + kind).classList.add('d-hide')
    }


    function clickHandler(event) {
        if (event.target.dataset.src && !event.target.classList.contains('label-primary')) moveSlide(event.target)
    }

    function shiftHandler(event) {
        let el = null
        event.target.classList.contains('item-shift') ?
            el = event.target :
            el = event.target.parentNode
        let last = current;
        if (el.classList.contains('item-prev')) {
            if (current > 1) {
                showNav('item-next')
                current--
            } else {
                hideNav('item-prev')
            }
        } else {
            if (current < count) {
                showNav('item-next')
                showNav('item-prev')
                current++
            } else {
                hideNav('item-next')
                setIntro()
                current = count + 1
            }
        }
        if (last !== current) setSlide(current)
    }

    function seeObjectClick(e) {
        window.location = e.target.dataset.url;
    }
}
}