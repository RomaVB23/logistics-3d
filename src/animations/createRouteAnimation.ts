import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function createRouteAnimation(section: HTMLElement) {
  const track = section.querySelector<HTMLElement>('[data-route-track]')
  const svg = section.querySelector<SVGSVGElement>('[data-route-svg]')
  const segments = Array.from(section.querySelectorAll<SVGPathElement>('[data-route-segment]'))
  const bases = Array.from(section.querySelectorAll<SVGPathElement>('[data-route-base]'))
  const markers = Array.from(section.querySelectorAll<HTMLElement>('[data-route-marker]'))
  const copies = Array.from(section.querySelectorAll<HTMLElement>('[data-route-copy]'))

  if (
    !track || !svg || markers.length < 2 ||
    copies.length !== markers.length ||
    segments.length !== markers.length - 1 || bases.length !== segments.length
  ) {
    throw new Error('Не найдены или не совпадают элементы маршрута доставки')
  }

  const updatePaths = () => {
    const bounds = track.getBoundingClientRect()
    if (bounds.height === 0) return

    svg.setAttribute('viewBox', `0 0 40 ${bounds.height}`)

    // Измеряем неподвижные маркеры; текст рядом анимируется отдельно.
    const points = markers.map((marker) => {
      const rect = marker.getBoundingClientRect()
      return rect.top - bounds.top + rect.height / 2
    })

    segments.forEach((segment, index) => {
      const start = points[index]
      const end = points[index + 1]
      const bend = (end - start) * 0.35
      const d = `M 20 ${start} C 36 ${start + bend} 4 ${end - bend} 20 ${end}`

      bases[index].setAttribute('d', d)
      segment.setAttribute('d', d)
    })
  }

  // Полная линия видна и при отключённой анимации.
  updatePaths()

  const media = gsap.matchMedia()
  const motionQuery = import.meta.env.DEV
    ? 'all'
    : '(prefers-reduced-motion: no-preference)'

  media.add(motionQuery, () => {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'delivery-route',
        trigger: track,
        start: 'clamp(top 80%)',
        // Последний этап достижим даже в секции у самого конца страницы.
        end: 'clamp(bottom 75%)',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    // pathLength="1" позволяет рисовать любой по длине участок числами 1 → 0.
    timeline.fromTo(
      segments,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1, stagger: 1 },
      0.2,
    )

    markers.forEach((marker, index) => {
      const position = index === 0 ? 0 : index + 0.2

      timeline
        .fromTo(
          marker,
          { color: '#a3a3a3', borderColor: '#30343c', backgroundColor: '#080b12' },
          {
            color: '#bfdbfe',
            borderColor: '#60a5fa',
            backgroundColor: '#14243e',
            duration: 0.25,
          },
          position,
        )
        .fromTo(
          copies[index],
          { opacity: 0.65, y: 18 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          position,
        )
    })
  })

  ScrollTrigger.addEventListener('refreshInit', updatePaths)
  // Переносы текста меняют расстояния между этапами и границы прокрутки.
  const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh())
  resizeObserver.observe(track)

  return () => {
    resizeObserver.disconnect()
    ScrollTrigger.removeEventListener('refreshInit', updatePaths)
    media.revert()
  }
}
