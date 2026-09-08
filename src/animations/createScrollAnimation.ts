import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SceneController } from '../three/createScene'

gsap.registerPlugin(ScrollTrigger)

export function createScrollAnimation(hero: HTMLElement, scene: SceneController) {
  const progressBar = hero.querySelector<HTMLElement>('[data-scroll-progress]')
  const introCopy = hero.querySelector<HTMLElement>('[data-story-intro]')
  const routeCopy = hero.querySelector<HTMLElement>('[data-story-route]')

  if (!progressBar || !introCopy || !routeCopy) {
    throw new Error('Не найдены текстовые блоки или индикатор первого экрана')
  }

  const routeItems = routeCopy.querySelectorAll<HTMLElement>('[data-story-item]')
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

    // Оба текста занимают одну ячейку сетки: при смене текста сцена не прыгает.
    // matchMedia вернёт второму блоку исходный hidden при отключении анимации.
    gsap.set(routeCopy, { display: 'block' })

    const timeline = gsap.timeline({
      defaults: { duration: 1, ease: 'none' },
      onUpdate: scene.render,
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(hero.offsetHeight * 2.4)}`,
        pin: true,
        // Lenis сглаживает прокрутку; анимация следует за её текущим положением.
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    // Метки задают позиции внутри сценария; его полная длина — 3 единицы.
    timeline
      .addLabel('start', 0)
      .addLabel('change', 0.7)
      .addLabel('route', 1.2)
      .fromTo(
        scene.container.rotation,
        { y: 0 },
        { y: -Math.PI / 2, duration: 3 },
        'start',
      )
      .fromTo(
        scene.view,
        { distance: 1 },
        { distance: 0.93, duration: 2 },
        'change',
      )
      .fromTo(
        progressBar,
        { scaleX: 0 },
        { scaleX: 1, duration: 3 },
        'start',
      )
      .fromTo(
        introCopy,
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -28, duration: 0.45, ease: 'power1.in' },
        'change',
      )
      .fromTo(
        routeCopy,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.01 },
        'route',
      )
      .fromTo(
        routeItems,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
        'route',
      )

    timeline.scrollTrigger?.refresh()

    return () => {
      scene.container.rotation.y = 0
      scene.view.distance = 1
      scene.render()
    }
  })

  return () => media.revert()
}
