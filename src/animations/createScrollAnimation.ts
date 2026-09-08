import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SceneController } from '../three/createScene'

gsap.registerPlugin(ScrollTrigger)

export function createScrollAnimation(hero: HTMLElement, scene: SceneController) {
  const progressBar = hero.querySelector<HTMLElement>('[data-scroll-progress]')

  if (!progressBar) {
    throw new Error('Не найден индикатор прокрутки')
  }

  const progressTrack = progressBar.parentElement
  const media = gsap.matchMedia()

  // Учебный просмотр: npm run dev показывает анимацию даже при reduced motion.
  // Сборка для публикации учитывает предпочтение пользователя.
  const previewMotion = import.meta.env.DEV
  const motionQuery = previewMotion
    ? '(min-height: 600px)'
    : '(min-height: 600px) and (prefers-reduced-motion: no-preference)'

  media.add(motionQuery, () => {
    // Этот стиль автоматически откатится вместе с контекстом matchMedia.
    if (previewMotion && progressTrack) {
      gsap.set(progressTrack, { display: 'block' })
    }

    const timeline = gsap.timeline({
      defaults: { duration: 1, ease: 'none' },
      onUpdate: scene.render,
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(hero.offsetHeight * 1.6)}`,
        pin: true,
        // Lenis сглаживает прокрутку; анимация следует за её текущим положением.
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    timeline
      .fromTo(scene.container.rotation, { y: 0 }, { y: -Math.PI / 2 }, 0)
      .fromTo(scene.view, { distance: 1 }, { distance: 0.93 }, 0)
      .fromTo(progressBar, { scaleX: 0 }, { scaleX: 1 }, 0)

    timeline.scrollTrigger?.refresh()

    return () => {
      scene.container.rotation.y = 0
      scene.view.distance = 1
      scene.render()
    }
  })

  return () => media.revert()
}
