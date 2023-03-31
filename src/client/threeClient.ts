import { newBoxMesh } from './threeUtility'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    Color,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three';
// @ts-ignore
import Stats from 'three/examples/jsm/libs/stats.module' 
import { GUI } from 'dat.gui'

export const helloCube = (canvas: any) => {
    const renderer = new WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio);

    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 4;
    camera.position.z = 0;
    const controls = new OrbitControls(camera, renderer.domElement)

    const scene = new Scene();
    scene.background = new Color(0xffffff);

    const gridHelper = new GridHelper(10, 10);
    scene.add(gridHelper);
    const axesHelper = new AxesHelper(2);
    scene.add(axesHelper);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 3, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    const lightTransformControl = new TransformControls(camera, renderer.domElement);
    lightTransformControl.addEventListener( 'dragging-changed', (event: any) => {
        controls.enabled = !event.value;
    });
    lightTransformControl.attach(directionalLight);
    lightTransformControl.visible = false;
    scene.add(lightTransformControl);

    const objectGroup = newBoxMesh(0x000000, 0xe02020, 0.2);
    objectGroup.position.y = 0.5
    scene.add(objectGroup);

    const meshTransformControl = new TransformControls(camera, renderer.domElement);
    meshTransformControl.addEventListener( 'dragging-changed', (event: any) => {
        controls.enabled = !event.value;
    });
    meshTransformControl.attach(objectGroup);
    meshTransformControl.visible = false;
    scene.add(meshTransformControl);

    // @ts-ignore
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    const gui = new GUI();
    const uiProperties = {
        'mesh transform control': meshTransformControl.visible,
        'light transform control': lightTransformControl.visible
    }
    gui.add(uiProperties, 'mesh transform control').onChange((value) => meshTransformControl.visible = value);
    gui.add(uiProperties, 'light transform control').onChange((value) => lightTransformControl.visible = value);

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }, false);

    let previousTimeStamp: number | undefined;
    const animate = (timestamp: number) => {
        const deltaTimeMs = timestamp - (previousTimeStamp ?? timestamp);
        previousTimeStamp = timestamp;
        requestAnimationFrame(animate);
        objectGroup.rotation.y += 45 * Math.PI / 180 * deltaTimeMs / 1000;
        controls.update();
        render();
        stats.update()
    }

    const render = () => {
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

// @ts-ignore
helloCube(three_canvas);
