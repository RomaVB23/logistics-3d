import './style.css'
import { createScene } from './three/createScene'
import { createScrollAnimation } from './animations/createScrollAnimation'
import { createPointerAnimation } from './animations/createPointerAnimation'
import { createRouteAnimation } from './animations/createRouteAnimation'
import { createSmoothScroll } from './scroll/createSmoothScroll'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Элемент #app не найден')
}

app.innerHTML = `
  <main class="bg-neutral-950 text-white">
    <section id="hero" class="relative h-svh min-h-[560px] bg-neutral-950">
      <div class="mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-3 px-6 pt-9 pb-16 lg:grid-cols-2 lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-10 lg:py-12">
        <div class="relative grid text-center lg:text-left">
          <div data-story-intro class="col-start-1 row-start-1 self-center">
            <p class="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-blue-400">
              Доставка грузов
            </p>

            <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              Логистика
              <span class="block text-neutral-500">без границ.</span>
            </h1>

            <p class="mx-auto mt-7 max-w-sm text-base leading-7 text-neutral-400 lg:mx-0">
              Соединяем города и страны. Бережно доставляем то, что важно для вас.
            </p>
          </div>

          <div data-story-route class="col-start-1 row-start-1 hidden self-center">
            <p data-story-item class="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-blue-400">
              На всём маршруте
            </p>

            <h2 data-story-item class="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
              Ваш груз
              <span class="block text-neutral-500">под контролем.</span>
            </h2>

            <p data-story-item class="mx-auto mt-7 max-w-sm text-base leading-7 text-neutral-400 lg:mx-0">
              Планируем маршрут и сопровождаем доставку от отправки до получения.
            </p>
          </div>
        </div>

        <div
          id="scene"
          class="relative h-full min-h-0 min-w-0 lg:max-h-[580px]"
          role="img"
          aria-label="Синий грузовой контейнер, показанный в трёх измерениях"
        ></div>
      </div>

      <div class="pointer-events-none absolute inset-x-6 bottom-5 mx-auto max-w-5xl" aria-hidden="true">
        <p class="mb-3 text-center text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          Листайте вниз ↓
        </p>
        <div class="h-px overflow-hidden bg-white/10 motion-reduce:hidden [@media(max-height:599px)]:hidden">
          <div data-scroll-progress class="h-full origin-left bg-blue-400"></div>
        </div>
      </div>
    </section>

    <section
      id="route"
      class="grid min-h-svh items-center overflow-hidden border-t border-white/10 bg-[#080b12] px-6 py-24 sm:py-32 lg:px-10"
      aria-labelledby="route-title"
    >
      <div class="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-2 lg:gap-20">
        <div class="mb-16 max-w-lg lg:mb-0">
          <p class="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-blue-400">
            На всём пути
          </p>
          <h2 id="route-title" class="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Доставка,<br />
            <span class="text-blue-400">шаг за шагом.</span>
          </h2>
          <p class="mt-7 max-w-sm text-base leading-7 text-neutral-400">
            За каждой доставкой — продуманный маршрут. От первого звонка
            до передачи груза получателю.
          </p>
        </div>

        <div data-route-track class="relative pl-14 sm:pl-20">
          <svg
            data-route-svg
            class="pointer-events-none absolute inset-y-0 left-0 h-full w-10 overflow-visible fill-none"
            viewBox="0 0 40 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g stroke="#30343c" stroke-width="2">
              <path data-route-base />
              <path data-route-base />
            </g>
            <g stroke="#60a5fa" stroke-width="2" stroke-linecap="round">
              <path data-route-segment pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="0" />
              <path data-route-segment pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="0" />
            </g>
          </svg>

          <ol class="space-y-20" role="list">
            <li class="relative">
              <span data-route-marker class="absolute top-0 -left-14 z-10 grid size-10 place-items-center rounded-full border border-[#30343c] bg-[#080b12] text-xs font-medium text-neutral-400 sm:-left-20" aria-hidden="true">01</span>
              <div data-route-copy>
                <p class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-blue-300">Отправка</p>
                <h3 class="text-2xl font-semibold tracking-tight sm:text-3xl">Готовим груз к пути</h3>
                <p class="mt-4 max-w-sm text-base leading-7 text-neutral-300">
                  Уточняем детали перевозки, подбираем транспорт и согласовываем
                  удобное время отправки.
                </p>
              </div>
            </li>

            <li class="relative">
              <span data-route-marker class="absolute top-0 -left-14 z-10 grid size-10 place-items-center rounded-full border border-[#30343c] bg-[#080b12] text-xs font-medium text-neutral-400 sm:-left-20" aria-hidden="true">02</span>
              <div data-route-copy>
                <p class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-blue-300">Перевозка</p>
                <h3 class="text-2xl font-semibold tracking-tight sm:text-3xl">Сопровождаем груз</h3>
                <p class="mt-4 max-w-sm text-base leading-7 text-neutral-300">
                  Следим за движением по маршруту и сообщаем о ходе доставки.
                  Остаёмся на связи на каждом этапе.
                </p>
              </div>
            </li>

            <li class="relative">
              <span data-route-marker class="absolute top-0 -left-14 z-10 grid size-10 place-items-center rounded-full border border-[#30343c] bg-[#080b12] text-xs font-medium text-neutral-400 sm:-left-20" aria-hidden="true">03</span>
              <div data-route-copy>
                <p class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-blue-300">Получение</p>
                <h3 class="text-2xl font-semibold tracking-tight sm:text-3xl">Передаём получателю</h3>
                <p class="mt-4 max-w-sm text-base leading-7 text-neutral-300">
                  Согласовываем прибытие, передаём груз и документы.
                  Завершаем доставку, когда всё на месте.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  </main>
`

const hero = document.querySelector<HTMLElement>('#hero')
const sceneElement = document.querySelector<HTMLDivElement>('#scene')
const routeSection = document.querySelector<HTMLElement>('#route')

if (!hero || !sceneElement || !routeSection) {
  throw new Error('Не найдены элементы #hero, #scene или #route')
}

const scene = createScene(sceneElement)
const disposeScrollAnimation = createScrollAnimation(hero, scene)
const disposePointerAnimation = createPointerAnimation(sceneElement, scene)
const disposeRouteAnimation = createRouteAnimation(routeSection)

// Сначала ScrollTrigger создаёт место для закрепления, затем Lenis измеряет страницу.
const disposeSmoothScroll = createSmoothScroll()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Останавливаем прокрутку и анимацию до освобождения ресурсов Three.js.
    disposeSmoothScroll()
    disposePointerAnimation()
    disposeRouteAnimation()
    disposeScrollAnimation()
    scene.dispose()
  })
}
