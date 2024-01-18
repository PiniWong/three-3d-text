import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//help
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)
/**
 * Textures
 */
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load('/textures/matcaps/4.png')

/**
 * Fonts 
 */
const group = new THREE.Group();



/**
 * Fonts 
 */
const fontLoader = new FontLoader()
const material = new THREE.MeshMatcapMaterial({
    matcap:matcapTexture
})
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        const testGeometry = new TextGeometry(
            'Holle threeoh.js',
            {
                font:font,
                size:0.5,
                height:0.2,
                curveSegments:5,
                bevelEnabled:true,
                bevelThickness :0.02,
                bevelSize:0.02,
                bevelOffset:0,
                bevelSegments :3
            }
        )
        testGeometry.center()
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(testGeometry,material)
        group.add(text)
    }
)

//甜甜圈
const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,40)
for (let i = 0; i < 200; i++) {
    
    const donut = new THREE.Mesh(donutGeometry,material)
    donut.position.x = (Math.random() - 0.5)  *10
    donut.position.y = (Math.random() - 0.5)  *10
    donut.position.z = (Math.random() - 0.5)  *10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    group.add(donut)
}
scene.add(group)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const parameters = {
    transfrom:()=>{
        gsap.to(camera.position,{
            duration:1,
            x:2,
            y:4,
            z:5,
        })
    },
    restore:()=>{
        gsap.to(camera.position,{
            duration:1,
            x:1,
            y:1,
            z:2,
        })

    },
    rotation:()=>{
        gsap.to(group.rotation,{
            duration:3,
            y:group.rotation.y+6
        })
    }
}
gui.add(parameters,'transfrom')
gui.add(parameters,'restore')
gui.add(parameters,'rotation')

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()