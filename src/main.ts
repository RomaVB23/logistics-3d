import './style.css'
import { createScene } from './three/createScene'
import { createScrollAnimation } from './animations/createScrollAnimation'
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

    <section class="grid min-h-svh place-items-center border-t border-white/10 px-6 py-24">
      <div class="max-w-2xl text-center">
        <p class="mb-5 text-xs uppercase tracking-[0.3em] text-blue-400">На каждом этапе</p>
        <h2 class="text-4xl font-semibold tracking-tight sm:text-6xl">
          Мы рядом.<br />На всём пути.
        </h2>
        <p class="mx-auto mt-7 max-w-md leading-7 text-neutral-400">
          Отправка, маршрут и доставка — сопровождаем ваш груз на каждом этапе.
        </p>
      </div>
    </section>
  </main>
`

const hero = document.querySelector<HTMLElement>('#hero')
const sceneElement = document.querySelector<HTMLDivElement>('#scene')

if (!hero || !sceneElement) {
  throw new Error('Не найдены элементы #hero или #scene')
}

const scene = createScene(sceneElement)
const disposeScrollAnimation = createScrollAnimation(hero, scene)

// Сначала ScrollTrigger создаёт место для закрепления, затем Lenis измеряет страницу.
const disposeSmoothScroll = createSmoothScroll()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Останавливаем прокрутку и анимацию до освобождения ресурсов Three.js.
    disposeSmoothScroll()
    disposeScrollAnimation()
    scene.dispose()
  })
}
