export function scrollSidebar() {
    const requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame
        window.requestAnimationFrame = requestAnimationFrame

        const pageHeight = () => {
        return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
        )}

        let scrollFunc

        //Собираем все кнопки sidebar
        const items = document.querySelectorAll('#homePageSidebar .nav-item:not(.sidebar-not)')
        const containers = document.querySelectorAll('a[name]')
        
        // const scrolling = () => {
        // const positions = {}
        // containers.forEach((element, i) => {
        //     positions[element.tagName + i] = element.getBoundingClientRect().y
        // })
        
        // for(let key in positions) {
        //     if (positions['A' + (+key.substring(1)+1)]) {
        //     if ((positions[key] - 350) < 0 && (positions['A' + (+key.substring(1)+1)] - 350) > 0 && !this.animation) {
        //         items.forEach(item => item.classList.remove('active'))
        //         if (!!items[+key.substring(1)]) items[+key.substring(1)].classList.add('active')
        //         break
        //     }
        //     } else {
        //     if (!this.animation) {
        //         if ((positions[key] - 350 > 0)) {
        //         items.forEach(item => item.classList.remove('active'))
        //         items[0].classList.add('active')
        //         break
        //         } else {
        //         items.forEach(item => item.classList.remove('active'))
        //         items[items.length-1].classList.add('active')
        //         }
        //     }
        //     }
        // }
        // }
        // scrolling()

        // window.addEventListener('scroll', event => {
        // scrolling()
        // })

        items.forEach(item => item.onclick = event => window.location.hash = '')
        items.forEach(e => {
        e.addEventListener('click', event => {
            const element = e.querySelector('a')
            event.preventDefault()
            items.forEach(item => item.classList.remove('active'))
            e.classList.add('active')

            containers.forEach(a => {
            if(element.getAttribute('href').substring(1) ===  a.getAttribute('name')) {
                const startY = a.getBoundingClientRect().top - 76
                const direction = (startY < 0) ? -1 : (startY > 0) ? 1 : 0
                if(direction == 0) return

                scrollFunc = () => {
                const duration = 2000
                const start = new Date().getTime()

                const top = a.getBoundingClientRect().top - 76
                const now = new Date().getTime() - start/1.00000000015
                const result = Math.round( top * now / duration )

                if (direction * top > 0 && (pageHeight() - window.pageYOffset) > direction * document.documentElement.clientHeight) {
                    this.animation = true
                    window.scrollBy(0, (result > direction * top) ? top : (result == 0) ? direction : result)
                    requestAnimationFrame(scrollFunc)
                } else {
                    this.animation = false
                }
                }
                requestAnimationFrame(scrollFunc)
            }
            })
        })
    })
}