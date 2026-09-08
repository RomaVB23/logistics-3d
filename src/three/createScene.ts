import * as THREE from 'three'
import { createContainer } from './createContainer'

export type SceneController = {
  container: THREE.Group
  view: { distance: number }
  render: () => void
  dispose: () => void
}

export function createScene(host: HTMLElement): SceneController {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)

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

  const ambientLight = new THREE.HemisphereLight('#dbeafe', '#18243d', 2)
  const keyLight = new THREE.DirectionalLight('#ffffff', 4)
  keyLight.position.set(3, 6, 5)

  const rimLight = new THREE.DirectionalLight('#6da9ff', 3)
  rimLight.position.set(-4, 2, -4)
  scene.add(ambientLight, keyLight, rimLight)

  const bounds = new THREE.Box3().setFromObject(container.group)
  const sphere = bounds.getBoundingSphere(new THREE.Sphere())
  const viewDirection = new THREE.Vector3(7, 4, 9).normalize()

  // GSAP меняет этот коэффициент. 1 — исходное расстояние, меньше 1 — ближе.
  const view = { distance: 1 }
  let fitDistance = 12
  let disposed = false

  function render() {
    if (disposed) return

    camera.position
      .copy(viewDirection)
      .multiplyScalar(fitDistance * view.distance)
      .add(sphere.center)
    camera.lookAt(sphere.center)
    renderer.render(scene, camera)
  }

  function resize() {
    if (disposed) return

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
    fitDistance = (sphere.radius / Math.sin(limitingFov / 2)) * 1.12

    camera.updateProjectionMatrix()
    // view.distance сохраняется: resize не сбрасывает состояние прокрутки.
    render()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  window.addEventListener('resize', resize)
  resize()

  return {
    container: container.group,
    view,
    render,
    dispose() {
      if (disposed) return
      disposed = true
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      container.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }
}
