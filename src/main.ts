import './style.css'
import { createScene } from './three/createScene'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
    throw new Error('Элемент #app не найден')
}

app.innerHTML = `
  <main class="min-h-svh overflow-hidden bg-neutral-950 text-white">
    <section class="mx-auto grid min-h-svh max-w-7xl items-center gap-6 px-6 py-12 lg:grid-cols-2 lg:gap-8 lg:px-10">
      <div class="text-center lg:text-left">
        <p class="mb-5 text-xs font-medium uppercase tracking-[0.4em] text-blue-400">
          Logistics experience
        </p>

        <h1 class="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
          Every journey
          <span class="block text-neutral-500">starts here</span>
        </h1>

        <p class="mx-auto mt-7 max-w-sm text-base leading-7 text-neutral-400 lg:mx-0">
          From the first mile to the last. We keep your world moving.
        </p>
      </div>

      <div
        id="scene"
        class="relative h-[340px] min-w-0 sm:h-[440px] lg:h-[580px]"
        role="img"
        aria-label="Синий грузовой контейнер, показанный в трёх измерениях"
      ></div>
    </section>
  </main>
`

const sceneElement = document.querySelector<HTMLDivElement>('#scene')

if (!sceneElement) {
    throw new Error('Элемент #scene не найден')
}

const disposeScene = createScene(sceneElement)

// Освобождаем старую сцену, когда Vite заменяет этот модуль при разработке.
if (import.meta.hot) {
    import.meta.hot.dispose(disposeScene)
}
