import inView from './in-view.min'
export function svgjs() {
  let speedBg = 240000
  let speedBgF = 120000

  // Задний фон города
  const fsBG = SVG('background_logo').size('100%', '100%').viewbox(0, 0, 1388, 262)
  const fsBGBack = fsBG.use('fs-bg')
  const fsBGBackClone = fsBGBack.clone()
  fsBGBack.y('40%')
  fsBGBackClone.y('40%')
  fsBGBackClone.x('99%')
  fsBGBack.animate(speedBg, '-').x('-99%').loop(null, false)
  fsBGBackClone.animate(speedBg, '-').x('-0%').loop(null, false)

  const fsBGFront = fsBG.use('fs-bg-front')
  const fsBGFrontClone = fsBGFront.clone()
  fsBGFront.y('0%')
  fsBGFrontClone.y('0%')
  fsBGFrontClone.x('120%')
  fsBGFront.animate(speedBgF, '-').x('-120%').loop(null, false)
  fsBGFrontClone.animate(speedBgF, '-').x('-0%').loop(null, false)

  //Подвижность лого
  const logoBig = SVG('big_logo').size('100%', '100%').viewbox(0, 0, 600, 600).group()
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

    if (!inView.is(document.querySelector('#logo'))) {
        fsBGBack.pause()
        fsBGBackClone.pause()
        fsBGFront.pause()
        fsBGFrontClone.pause()
        logoBig.pause()
        whiteCog.pause()
        blackCog.pause()
    }
    inView('#logo').on('enter', el => {
        fsBGBack.play()
        fsBGBackClone.play()
        fsBGFront.play()
        fsBGFrontClone.play()
        logoBig.play()
        whiteCog.play()
        blackCog.play()
      })
    inView('#logo').on('exit', el => {
        fsBGBack.pause()
        fsBGBackClone.pause()
        fsBGFront.pause()
        fsBGFrontClone.pause()
        logoBig.pause()
        whiteCog.pause()
        blackCog.pause()
      })
}