/**
 * Hero scene — procedural engineering composition (Three.js).
 *
 * An architectural tower under construction rises from a contour-lined
 * terrain; a surveying station shoots dashed reference lines to prism
 * points; golden measurement pulses travel along the lines; a crane
 * slowly slews. Rendered in ink/steel/gold on transparent background
 * so the paper grid beneath shows through.
 *
 * Respects prefers-reduced-motion (renders a single static frame),
 * pauses when off-screen or tab hidden, caps device pixel ratio,
 * and falls back to a static SVG when WebGL is unavailable.
 */
import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { prefersReducedMotion } from '../utils/motion.js'
import { heroFallback } from '../components/service-visuals.js'

const INK = 0x1e2229
const GOLD = 0xd4af37
const STEEL = 0x9aa0ab
const PAPER2 = 0xf1ece2

/* Terrain height — flat pad in the centre, hills toward the edges. */
function terrainHeight(x, z) {
  const r = Math.hypot(x, z)
  const mask = THREE.MathUtils.smoothstep(r, 5.0, 12.0)
  return mask * (0.9 * Math.sin(x * 0.55) + 0.65 * Math.cos(z * 0.45) + 0.4 * Math.sin((x + z) * 0.3))
}

export function mountHeroScene(holder) {
  if (!holder) return { dispose: () => {} }

  // --- WebGL availability probe -------------------------------------------
  try {
    const probe = document.createElement('canvas')
    if (!probe.getContext('webgl') && !probe.getContext('experimental-webgl')) throw new Error('no webgl')
  } catch {
    holder.innerHTML = `<div class="h-full w-full">${heroFallback()}</div>`
    return { dispose: () => {} }
  }

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    holder.innerHTML = `<div class="h-full w-full">${heroFallback()}</div>`
    return { dispose: () => {} }
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.setClearColor(0x000000, 0)
  holder.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200)


  const disposables = []
  const track = (obj) => (disposables.push(obj), obj)
  // Fat gold reference lines (pixel-width) — crisp on all screens.
  const goldLineMat = track(
    new LineMaterial({ color: GOLD, linewidth: 2, dashed: true, dashSize: 0.45, gapSize: 0.28, transparent: true, opacity: 0.95 })
  )
  goldLineMat.resolution.set(holder.clientWidth || 1, holder.clientHeight || 1)

  /* ------------------------------------------------------------------ */
  /* Terrain: subtle surface + real contour lines + faint grid          */
  /* ------------------------------------------------------------------ */
  const TERRAIN_SIZE = 26
  const TERRAIN_DIV = 44

  const terrainGeo = track(new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_DIV, TERRAIN_DIV))
  terrainGeo.rotateX(-Math.PI / 2)
  {
    const pos = terrainGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)))
    }
    pos.needsUpdate = true
    terrainGeo.computeVertexNormals()
  }
  scene.add(
    track(
      new THREE.Mesh(terrainGeo, new THREE.MeshBasicMaterial({ color: PAPER2, transparent: true, opacity: 0.62 }))
    )
  )

  // Contours: marching-squares-lite over the heightfield.
  {
    const seg = []
    const step = TERRAIN_SIZE / TERRAIN_DIV
    const h = (i, j) => terrainHeight(-TERRAIN_SIZE / 2 + i * step, -TERRAIN_SIZE / 2 + j * step)
    for (let L = 0.25; L <= 2.05; L += 0.25) {
      for (let j = 0; j < TERRAIN_DIV; j++) {
        for (let i = 0; i < TERRAIN_DIV; i++) {
          const c = [h(i, j), h(i + 1, j), h(i + 1, j + 1), h(i, j + 1)] // N,E,S,W heights
          const x0 = -TERRAIN_SIZE / 2 + i * step
          const z0 = -TERRAIN_SIZE / 2 + j * step
          const edges = [
            [c[0], c[1], x0, z0, x0 + step, z0], // north
            [c[1], c[2], x0 + step, z0, x0 + step, z0 + step], // east
            [c[3], c[2], x0, z0 + step, x0 + step, z0 + step], // south
            [c[0], c[3], x0, z0, x0, z0 + step], // west
          ]
          const crossings = []
          for (const [a, b, ax, az, bx, bz] of edges) {
            if ((a < L && b >= L) || (b < L && a >= L)) {
              const t = (L - a) / (b - a || 1e-9)
              crossings.push([ax + (bx - ax) * t, az + (bz - az) * t])
            }
          }
          if (crossings.length === 2) {
            seg.push(crossings[0][0], L, crossings[0][1], crossings[1][0], L, crossings[1][1])
          } else if (crossings.length === 4) {
            // ambiguous cell: N-E / S-W pairing
            seg.push(crossings[0][0], L, crossings[0][1], crossings[1][0], L, crossings[1][1])
            seg.push(crossings[2][0], L, crossings[2][1], crossings[3][0], L, crossings[3][1])
          }
        }
      }
    }
    const geo = track(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3))
    const mat = track(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.38 }))
    scene.add(track(new THREE.LineSegments(geo, mat)))
  }

  const grid = track(new THREE.GridHelper(TERRAIN_SIZE, 26, 0x1e2229, 0x1e2229))
  grid.material.transparent = true
  grid.material.opacity = 0.14
  scene.add(grid)

  /* ------------------------------------------------------------------ */
  /* The tower — slabs, columns, core, setbacks                          */
  /* ------------------------------------------------------------------ */
  const tower = new THREE.Group()
  const FLOORS = 11
  const slabMats = {
    fill: new THREE.MeshBasicMaterial({ color: 0xece6d8, transparent: true, opacity: 0.88 }),
    edge: new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 1 }),
  }
  const columnMat = new THREE.MeshBasicMaterial({ color: 0xdcd5c5 })
  const colEdgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.95 })

  function addBoxPart(w, h, d, x, y, z, fillMat, edgeMat, group) {
    const geo = track(new THREE.BoxGeometry(w, h, d))
    const mesh = new THREE.Mesh(geo, fillMat)
    mesh.position.set(x, y, z)
    const edges = track(new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), edgeMat))
    edges.position.set(x, y, z)
    group.add(mesh, edges)
  }

  const topEdgeMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.95 })
  const floorW = (i) => (i < 6 ? 4.4 : i < 9 ? 3.8 : 3.2)
  for (let i = 0; i < FLOORS; i++) {
    const w = floorW(i)
    const y = 0.4 + i * 0.62
    addBoxPart(w, 0.12, w, 0, y, 0, slabMats.fill, i === FLOORS - 1 ? topEdgeMat : slabMats.edge, tower)
    // corner columns
    const half = w / 2 - 0.08
    for (const [cx, cz] of [
      [half, half],
      [-half, half],
      [half, -half],
      [-half, -half],
    ]) {
      const colH = 0.5
      addBoxPart(0.1, colH, 0.1, cx, y - 0.31, cz, columnMat, colEdgeMat, tower)
    }
  }
  // core
  const coreH = 0.4 + (FLOORS - 1) * 0.62 + 0.3
  addBoxPart(0.9, coreH, 0.9, 0, coreH / 2 + 0.1, 0, new THREE.MeshBasicMaterial({ color: 0xd9d3c5, transparent: true, opacity: 0.5 }), new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.35 }), tower)
  tower.position.set(0, 0, 0)
  scene.add(tower)

  // top beam + plumb line
  const plumbGeo = track(new LineGeometry())
  plumbGeo.setPositions([0, coreH + 0.35, 0, 0, terrainHeight(0, 0) + 0.02, 0])
  const plumbMat = goldLineMat
  const plumb = new Line2(plumbGeo, plumbMat)
  plumb.computeLineDistances()
  scene.add(plumb)
  {
    const d = track(new THREE.Mesh(track(new THREE.OctahedronGeometry(0.17)), new THREE.MeshBasicMaterial({ color: GOLD })))
    d.position.set(0, terrainHeight(0, 0) + 0.12, 0)
    scene.add(d)
  }

  /* ------------------------------------------------------------------ */
  /* Tower crane                                                          */
  /* ------------------------------------------------------------------ */
  const crane = new THREE.Group()
  const steelFill = new THREE.MeshBasicMaterial({ color: 0xb0b0c0, transparent: true, opacity: 0.85 })
  const steelEdge = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.8 })
  // mast
  addBoxPart(0.14, 7.4, 0.14, 0, 3.7, 0, steelFill, steelEdge, crane)
  // slew group: jib + counter-jib
  const slew = new THREE.Group()
  slew.position.y = 7.4
  addBoxPart(4.6, 0.1, 0.1, -2.3, 0.05, 0, steelFill, steelEdge, slew)
  addBoxPart(1.4, 0.1, 0.1, 0.75, 0.05, 0, steelFill, steelEdge, slew)
  addBoxPart(0.1, 0.7, 0.1, -2.2, 0.35, 0, steelFill, steelEdge, slew)
  addBoxPart(0.1, 0.7, 0.1, 0.7, 0.35, 0, steelFill, steelEdge, slew)
  addBoxPart(0.08, 0.5, 0.08, -4.3, 0.25, 0, steelFill, steelEdge, slew)
  // hoist cable + hook
  const cableGeo = track(new THREE.BufferGeometry())
  cableGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, -2.2, 0], 3))
  const cable = new THREE.Line(cableGeo, track(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.7 })))
  cable.position.set(-4.3, 0.2, 0)
  slew.add(cable)
  const hook = track(new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 0.18, 0.12)), new THREE.MeshBasicMaterial({ color: GOLD })))
  hook.position.set(-4.3, -2.15, 0)
  slew.add(hook)
  crane.add(slew)
  crane.position.set(4.6, 0, -3.4)
  scene.add(crane)

  /* ------------------------------------------------------------------ */
  /* Surveying station + reference lines + pulses                         */
  /* ------------------------------------------------------------------ */
  const station = new THREE.Group()
  const legMat = new THREE.MeshBasicMaterial({ color: INK })
  for (const [dx, dz] of [
    [0.28, 0.28],
    [-0.28, 0.28],
    [0, -0.4],
  ]) {
    const leg = track(new THREE.Mesh(track(new THREE.CylinderGeometry(0.02, 0.03, 1.1)), legMat))
    leg.position.set(dx * 0.7, 0.55, dz * 0.7)
    leg.rotation.set(dz * 0.35, 0, -dx * 0.35)
    station.add(leg)
  }
  addBoxPart(0.26, 0.18, 0.26, 0, 1.16, 0, steelFill, steelEdge, station)
  const scope = track(new THREE.Mesh(track(new THREE.CylinderGeometry(0.055, 0.055, 0.34)), new THREE.MeshBasicMaterial({ color: INK })))
  scope.rotation.z = Math.PI / 2.6
  scope.rotation.y = Math.PI / 4
  scope.position.set(0, 1.3, 0)
  station.add(scope)
  const STATION = new THREE.Vector3(-6.4, 1.32, 4.6)
  station.position.copy(STATION).sub(new THREE.Vector3(0, 1.32, 0))
  scene.add(station)

  // targets on the tower + prism on crane
  const targets = [
    new THREE.Vector3(2.2, 0.4 + 3 * 0.62, 2.2),
    new THREE.Vector3(-2.2, 0.4 + 6 * 0.62, -2.2),
    new THREE.Vector3(4.6 + 0.7, 7.4, -3.4),
    new THREE.Vector3(-2.0, 0.4 + 1.5 * 0.62, 2.2),
  ]
  const pulses = []
  targets.forEach((t, i) => {
    const from = STATION.clone()
    const geo = track(new LineGeometry())
    geo.setPositions([from.x, from.y, from.z, t.x, t.y, t.z])
    const line = new Line2(geo, goldLineMat)
    line.computeLineDistances()
    scene.add(line)
    // prism
    const prism = track(new THREE.Mesh(track(new THREE.OctahedronGeometry(0.2)), new THREE.MeshBasicMaterial({ color: GOLD })))
    prism.position.copy(t)
    scene.add(prism)
    // pulse
    const pulse = track(new THREE.Mesh(track(new THREE.SphereGeometry(0.1, 12, 12)), new THREE.MeshBasicMaterial({ color: GOLD })))
    pulse.userData = { from, to: t.clone(), phase: i * 0.27, speed: 0.22 + i * 0.04 }
    pulses.push(pulse)
    scene.add(pulse)
  })

  /* ------------------------------------------------------------------ */
  /* Crosshair markers + drifting points                                 */
  /* ------------------------------------------------------------------ */
  {
    const crossPts = []
    for (const [x, z] of [
      [-3.2, -3.4],
      [3.1, 3.4],
      [4.0, 1.8],
      [-4.4, 0.6],
      [1.2, -4.6],
      [-1.4, 4.6],
      [5.6, -1.2],
      [-5.8, -2.2],
    ]) {
      const y = terrainHeight(x, z) + 0.02
      crossPts.push(x - 0.18, y, z, x + 0.18, y, z, x, y, z - 0.18, x, y, z + 0.18)
    }
    const geo = track(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.Float32BufferAttribute(crossPts, 3))
    scene.add(track(new THREE.LineSegments(geo, track(new THREE.LineBasicMaterial({ color: STEEL, transparent: true, opacity: 0.6 })))))
  }
  {
    const N = 70
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24
      arr[i * 3 + 1] = Math.random() * 8 + 0.3
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24
    }
    const geo = track(new THREE.BufferGeometry())
    geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
    const pts = track(new THREE.Points(geo, track(new THREE.PointsMaterial({ color: STEEL, size: 0.045, transparent: true, opacity: 0.5 }))))
    pts.userData.float = arr
    scene.add(pts)
    // expose for animation via name
    scene.userData.dust = pts
  }

  /* ------------------------------------------------------------------ */
  /* Camera, pointer parallax, loop                                      */
  /* ------------------------------------------------------------------ */
  const clock = new THREE.Clock()
  let active = true
  let disposed = false
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

  function resize() {
    const w = holder.clientWidth || 1
    const h = holder.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    goldLineMat.resolution.set(w, h)
  }
  resize()
  window.addEventListener('resize', resize)

  const io = new IntersectionObserver((entries) => {
    active = entries.some((e) => e.isIntersecting)
  })
  io.observe(holder)

  const onPointer = (e) => {
    const r = holder.getBoundingClientRect()
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 1.6
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 0.8
  }
  const heroEl = holder.closest('[data-hero]') || holder
  heroEl.addEventListener('pointermove', onPointer)

  function frame() {
    if (disposed) return
    const t = clock.getElapsedTime()
    // camera: slow orbit + bob + pointer parallax
    const az = t * 0.075 + pointer.x * 0.35
    const r = 13.4 - pointer.x * 0.6
    const y = 5.8 + Math.sin(t * 0.1) * 0.5 + pointer.y * 0.5
    camera.position.set(Math.sin(az) * r, y, Math.cos(az) * r)
    camera.lookAt(2.0, 3.6, 0)

    // pulses travel
    pulses.forEach((p) => {
      const k = (t * p.userData.speed + p.userData.phase) % 1
      p.position.lerpVectors(p.userData.from, p.userData.to, k)
      p.scale.setScalar(0.7 + Math.sin(k * Math.PI) * 0.7)
    })

    // crane slew + hoist
    slew.rotation.y = Math.sin(t * 0.13) * 0.9
    const hoist = 1.2 + Math.sin(t * 0.35) * 0.9
    cable.geometry.attributes.position.setY(1, -hoist)
    cable.geometry.attributes.position.needsUpdate = true
    hook.position.y = 0.2 - hoist + 0.08

    // dust drift
    const dust = scene.userData.dust
    if (dust) {
      const a = dust.geometry.attributes.position
      for (let i = 0; i < a.count; i++) {
        let yy = a.getY(i) + 0.0022
        if (yy > 9) yy = 0.2
        a.setY(i, yy)
      }
      a.needsUpdate = true
    }

    // gold breathing on plumb & prisms
    plumbMat.opacity = 0.6 + Math.sin(t * 1.4) * 0.25

    renderer.render(scene, camera)
  }

  if (prefersReducedMotion) {
    pointer.x = 0.2
    frame()
    return { dispose: () => cleanup() }
  }

  const loop = () => {
    if (disposed) return
    if (active && !document.hidden) {
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      frame()
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  function cleanup() {
    disposed = true
    io.disconnect()
    window.removeEventListener('resize', resize)
    heroEl.removeEventListener('pointermove', onPointer)
    disposables.forEach((d) => d.dispose && d.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }

  return { dispose: cleanup }
}
