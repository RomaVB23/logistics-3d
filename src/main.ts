import './style.css'
import * as THREE from 'three'

console.log(`Three.js revision: ${THREE.REVISION}`)

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
    throw new Error('Элемент #app не найден')
}

app.innerHTML = `
  <main class="grid min-h-screen place-items-center bg-neutral-950 px-6 text-white">
    <div class="text-center">
      <p class="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-blue-400">
        Logistics experience
      </p>

      <h1 class="text-5xl font-semibold tracking-tight md:text-8xl">
        Every journey
        <span class="block text-neutral-500">starts here</span>
      </h1>

      <p class="mx-auto mt-8 max-w-xl text-base leading-7 text-neutral-400">
        Vite, TypeScript, Tailwind CSS и Three.js успешно подключены.
      </p>
    </div>
  </main>
`
