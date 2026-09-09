import { gsap } from 'gsap'
import type { SceneController } from '../three/createScene'

export function createPointerAnimation(host: HTMLElement, scene: SceneController) {
  const media = gsap.matchMedia()
  const pointerQuery = '(hover: hover) and (pointer: fine)'
  // Сохраняем учебный режим, который уже используем для прокрутки.
  const motionQuery = import.meta.env.DEV
    ? pointerQuery
    : `${pointerQuery} and (prefers-reduced-motion: no-preference)`

  media.add(motionQuery, () => {
    const rotation = scene.container.rotation
    const initialX = rotation.x
    const initialZ = rotation.z
    const maxTiltX = 0.12
    const maxTiltZ = 0.1
    const clamp = gsap.utils.clamp(-1, 1)

    // Два переиспользуемых tween: каждый управляет только своей осью.
    // rotation.y по прежнему принадлежит сценарию прокрутки.
    const rotateX = gsap.quickTo(rotation, 'x', {
      duration: 0.6,
      ease: 'power3.out',
      onUpdate: scene.render,
    })
    const rotateZ = gsap.quickTo(rotation, 'z', {
      duration: 0.6,
      ease: 'power3.out',
      onUpdate: scene.render,
    })

    function onPointerMove(event: PointerEvent) {
      // На гибридном устройстве касание экрана не наклоняет модель.
      if (event.pointerType !== 'mouse') return

      const bounds = host.getBoundingClientRect()
      if (bounds.width === 0 || bounds.height === 0) return

      // Переводим положение курсора внутри блока в диапазон от -1 до 1.
      const pointerX = clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
      const pointerY = clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1)

      rotateX(initialX - pointerY * maxTiltX)
      rotateZ(initialZ - pointerX * maxTiltZ)
    }

    function resetTilt() {
      rotateX(initialX)
      rotateZ(initialZ)
    }

    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', resetTilt)
    host.addEventListener('pointercancel', resetTilt)
    window.addEventListener('blur', resetTilt)

    return () => {
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', resetTilt)
      host.removeEventListener('pointercancel', resetTilt)
      window.removeEventListener('blur', resetTilt)
      // matchMedia откатывает tween; завершаем очистку отрисовкой исходного наклона.
      rotation.x = initialX
      rotation.z = initialZ
      scene.render()
    }
  })

  return () => media.revert()
}
