import * as THREE from 'three'
import { createContainer } from './createContainer.ts'

export function createScene(host: HTMLElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)

  // Размер на странице задают классы Tailwind, разрешение — renderer.
  const canvas = document.createElement('canvas')
  canvas.className = 'block h-full w-full'
  canvas.setAttribute('aria-hidden', 'true')

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  host.append(canvas)

  const container = createContainer()
  scene.add(container.group)

  // Мягкий общий свет и два направленных источника для объёма.
  const ambientLight = new THREE.HemisphereLight('#dbeafe', '#18243d', 2)
  const keyLight = new THREE.DirectionalLight('#ffffff', 4)
  keyLight.position.set(3, 6, 5)

  const rimLight = new THREE.DirectionalLight('#6da9ff', 3)
  rimLight.position.set(-4, 2, -4)
  scene.add(ambientLight, keyLight, rimLight)

  // Сфера вокруг модели помогает целиком уместить её в узком canvas.
  const bounds = new THREE.Box3().setFromObject(container.group)
  const sphere = bounds.getBoundingSphere(new THREE.Sphere())
  const viewDirection = new THREE.Vector3(7, 4, 9).normalize()

  function resize() {
    const width = host.clientWidth
    const height = host.clientHeight

    if (width === 0 || height === 0) return

    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setSize(
      Math.round(width * pixelRatio),
      Math.round(height * pixelRatio),
      false,
    )

    camera.aspect = width / height

    const verticalFov = THREE.MathUtils.degToRad(camera.fov)
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
    const limitingFov = Math.min(verticalFov, horizontalFov)
    const distance = (sphere.radius / Math.sin(limitingFov / 2)) * 1.12

    camera.position.copy(viewDirection).multiplyScalar(distance).add(sphere.center)
    camera.lookAt(sphere.center)
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  // Нужен и при переносе окна на монитор с другой плотностью пикселей.
  window.addEventListener('resize', resize)
  resize()

  let elapsed = 0
  let lastTime: number | null = null

  function animate(timestamp: number) {
    if (lastTime !== null) {
      elapsed += Math.min((timestamp - lastTime) / 1000, 0.05)
    }
    lastTime = timestamp

    // Скорость зависит от времени, а не от количества кадров монитора.
    container.group.rotation.y = Math.sin(elapsed * 0.45) * 0.12
    renderer.render(scene, camera)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function updateAnimation() {
    lastTime = null
    const shouldAnimate = !reducedMotion.matches && !document.hidden
    renderer.setAnimationLoop(shouldAnimate ? animate : null)
    renderer.render(scene, camera)
  }

  reducedMotion.addEventListener('change', updateAnimation)
  document.addEventListener('visibilitychange', updateAnimation)
  updateAnimation()

  return function dispose() {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    window.removeEventListener('resize', resize)
    reducedMotion.removeEventListener('change', updateAnimation)
    document.removeEventListener('visibilitychange', updateAnimation)
    container.dispose()
    renderer.dispose()
    canvas.remove()
  }
}
