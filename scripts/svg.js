import inView from './in-view.min'
export function svgjs() {
    let speedBg = 240000
    let speedBgF = 120000

    // Задний фон города
    const fsBG = SVG('fs-bg-svg').size('100%', '100%').viewbox(0, 0, 1388, 262)
    fsBG.node.classList.add('fs-bg-svg')
    const fsBGBack = fsBG.use('fs-bg')
    const fsBGBackClone = fsBGBack.clone()
    fsBGBack.y('31%')
    fsBGBackClone.y('31%')
    fsBGBackClone.x('99%')
    fsBGBack.node.classList.add('fsBGBack')
    fsBGBackClone.node.classList.add('fsBGBackClone')
    fsBGBack.animate(speedBg, '-').x('-99%').loop(null, false)
    fsBGBackClone.animate(speedBg, '-').x('-0%').loop(null, false)

    const fsBGFront = fsBG.use('fs-bg-front')
    const fsBGFrontClone = fsBGFront.clone()
    fsBGFront.y('-10%')
    fsBGFrontClone.y('-10%')
    fsBGFrontClone.x('120%')
    fsBGFront.node.classList.add('fsBGFront')
    fsBGFrontClone.node.classList.add('fsBGFrontClone')
    fsBGFront.node.parentElement.classList.add('fs-bg-front')
    fsBGFront.animate(speedBgF, '-').x('-120%').loop(null, false)
    fsBGFrontClone.animate(speedBgF, '-').x('-0%').loop(null, false)

    //Подвижность лого
    const logoBig = SVG('logo-big').size('100%', '100%').viewbox(0, 0, 600, 600).group()
    logoBig.animate(25000, '-').rotate(360, 300, 300).loop()

    // Создание "инь" и "янь"
    const follows = logoBig.group()
    const Yang = follows.use('Yang')
    const Ying = follows.use('Ying')

    // Шестерни и их анимация
    const whiteCog = logoBig.use('WhiteCog')
    const blackCog = logoBig.use('BlackCog')
    whiteCog.node.dataset.id = 1
    blackCog.node.dataset.id = 2
    whiteCog.animate(10000, '-').rotate(360).loop()
    blackCog.animate(10000, '-').rotate(-360).loop()

    // const homeHolder = SVG('homeHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const homeIsoHolder = SVG('flatHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const officeIsoHolder = SVG('officeHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)

    // homeHolder.use('home')
    // homeIsoHolder.use('flat')
    // officeIsoHolder.use('office')
    // // const storageHolder = SVG('storageHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const livingBuildingHolder = SVG('livingBuildingHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const mallsHolder = SVG('mallsHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const adminBuildinHolder = SVG('adminBuildinHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const hotelHolder = SVG('hotelHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const comercalBuildingHolder = SVG('comercalBuildingHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)

    // // storageHolder.use('storage')
    // livingBuildingHolder.use('livingBuilding')
    // mallsHolder.use('malls')
    // adminBuildinHolder.use('adminBuildin')
    // hotelHolder.use('hotel')
    // comercalBuildingHolder.use('comercalBuilding')

    // const securetyHolder = SVG('securetyHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const lowVoltageWorksHolder = SVG('lowVoltageWorksHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)

    // securetyHolder.use('securety')
    // lowVoltageWorksHolder.use('lowVoltageWorks')

    // const coolingHolder = SVG('coolingHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const ventHolder = SVG('ventHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const warmingHolder = SVG('warmingHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const waterProvidingHolder = SVG('waterProvidingHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const gasProvidingHolder = SVG('gasProvidingHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const suegeHolder = SVG('suegeHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const itpHolder = SVG('itpHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const ctpHolder = SVG('ctpHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)

    // coolingHolder.use('cooling')
    // ventHolder.use('vent')
    // warmingHolder.use('warming')
    // waterProvidingHolder.use('waterProviding')
    // gasProvidingHolder.use('gasProviding')
    // suegeHolder.use('suege')
    // itpHolder.use('itp')
    // ctpHolder.use('ctp')

    // const plantsHolder = SVG('plantsHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const structureHolder = SVG('structureHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const floorWorksHolder = SVG('floorWorksHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const roofWorksHolder = SVG('roofWorksHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const facadeWorksHolder = SVG('facadeWorksHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const roomWorksHolder = SVG('roomWorksHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const parkHolder = SVG('parkHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const waterResistHolder = SVG('waterResistHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)
    // const floorsHolder = SVG('floorsHolder').size('100%', '100%').viewbox(0, 0, 283.5, 283.5)

    // plantsHolder.use('plants')
    // structureHolder.use('structure')
    // floorWorksHolder.use('floorWorks')
    // roofWorksHolder.use('roofWorks')
    // facadeWorksHolder.use('facadeWorks')
    // roomWorksHolder.use('roomWorks')
    // parkHolder.use('park')
    // waterResistHolder.use('waterResist')
    // floorsHolder.use('floors')

    if (!inView.is(document.querySelector('.first-screen'))) {
        fsBGBack.pause()
        fsBGBackClone.pause()
        fsBGFront.pause()
        fsBGFrontClone.pause()
        logoBig.pause()
        whiteCog.pause()
        blackCog.pause()
    }
    inView('.first-screen').on('enter', el => {
        fsBGBack.play()
        fsBGBackClone.play()
        fsBGFront.play()
        fsBGFrontClone.play()
        logoBig.play()
        whiteCog.play()
        blackCog.play()
      })
    inView('.first-screen').on('exit', el => {
        fsBGBack.pause()
        fsBGBackClone.pause()
        fsBGFront.pause()
        fsBGFrontClone.pause()
        logoBig.pause()
        whiteCog.pause()
        blackCog.pause()
      })
}