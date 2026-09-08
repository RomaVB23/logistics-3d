import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function createSmoothScroll() {
  const media = gsap.matchMedia()
  const previewMotion = import.meta.env.DEV
  const motionQuery = previewMotion
    ? 'all'
    : '(prefers-reduced-motion: no-preference)'

  media.add(motionQuery, () => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.1,
      syncTouch: false,
      // У Lenis есть собственная проверка reduced motion: сохраняем учебный режим.
      respectReducedMotion: !previewMotion,
    })

    const unsubscribe = lenis.on('scroll', () => ScrollTrigger.update())

    // GSAP передаёт секунды, а Lenis ожидает миллисекунды.
    const update = (time: number) => lenis.raf(time * 1000)
    const resize = () => lenis.resize()

    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add(update)

    // После перерасчёта закрепления обновляем доступную длину прокрутки.
    ScrollTrigger.addEventListener('refresh', resize)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(update)
      ScrollTrigger.removeEventListener('refresh', resize)
      unsubscribe()
      lenis.destroy()

      // Возвращаем стандартные настройки GSAP, изменённые выше для Lenis.
      gsap.ticker.lagSmoothing(500, 33)
    }
  })

  return () => media.revert()
}
