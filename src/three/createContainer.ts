import * as THREE from 'three'

export function createContainer() {
  // Group позволяет двигать и поворачивать все детали как единый объект.
  const group = new THREE.Group()

  const paint = new THREE.MeshStandardMaterial({
    color: '#1875e8',
    metalness: 0.25,
    roughness: 0.5,
  })

  const frame = new THREE.MeshStandardMaterial({
    color: '#1251a2',
    metalness: 0.35,
    roughness: 0.6,
  })

  const metal = new THREE.MeshStandardMaterial({
    color: '#a9bed7',
    metalness: 0.65,
    roughness: 0.4,
  })

  // Все детали используют один куб. Размер каждой задаём через scale.
  const geometry = new THREE.BoxGeometry(1, 1, 1)

  function addBox(
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
    material = paint,
  ) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(width, height, depth)
    mesh.position.set(x, y, z)
    group.add(mesh)
  }

  // Корпус: X — длина, Y — высота, Z — ширина.
  addBox(6, 2.4, 2.4, 0, 0, 0)

  // Рёбра на обеих длинных стенках и на крыше.
  const ribCount = 26

  for (let i = 0; i < ribCount; i++) {
    const x = -2.78 + (i / (ribCount - 1)) * 5.56

    for (const z of [-1.22, 1.22]) {
      addBox(0.07, 2.16, 0.08, x, 0, z)
    }

    addBox(0.07, 0.05, 2.16, x, 1.22, 0)
  }

  // Рама сверху и снизу.
  for (const y of [-1.17, 1.17]) {
    for (const z of [-1.2, 1.2]) {
      addBox(6.12, 0.14, 0.14, 0, y, z, frame)
    }

    for (const x of [-3, 3]) {
      addBox(0.14, 0.14, 2.4, x, y, 0, frame)
    }
  }

  // Четыре угловые стойки.
  for (const x of [-3, 3]) {
    for (const z of [-1.2, 1.2]) {
      addBox(0.16, 2.4, 0.16, x, 0, z, frame)
    }
  }

  // Две створки на торце и вертикальные запорные штанги.
  for (const z of [-0.55, 0.55]) {
    addBox(0.06, 2.08, 1.04, 3.04, 0, z, frame)
  }

  for (const z of [-0.82, -0.3, 0.3, 0.82]) {
    addBox(0.045, 1.96, 0.045, 3.095, 0, z, metal)
    addBox(0.09, 0.06, 0.18, 3.115, -0.32, z, metal)
  }

  return {
    group,
    dispose() {
      // Общую геометрию освобождаем один раз, а не для каждой детали.
      geometry.dispose()
      paint.dispose()
      frame.dispose()
      metal.dispose()
    },
  }
}
