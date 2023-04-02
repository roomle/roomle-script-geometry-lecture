import { Controls } from './threeControls';
import { ScaleCubeScene } from './scaleCubeScene';
import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    Color,
    GridHelper,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// @ts-ignore
import Stats from 'three/examples/jsm/libs/stats.module' 
import { GUI } from 'dat.gui'

export const helloCube = (canvas: any) => {
    const renderer = new WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio);
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-2, 2, 3);
    const controls = new Controls(renderer, labelRenderer.domElement, camera);

    const scene = new Scene();
    scene.background = new Color(0xffffff);

    const gridHelper = new GridHelper(10, 20, 0xc0c0c0, 0xc0c0c0);
    scene.add(gridHelper);
    const axesHelper = new AxesHelper(1);
    scene.add(axesHelper);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 3, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // @ts-ignore
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    const gui = new GUI();
    const uiProperties = {
        'grid helper': gridHelper.visible,
        'axis helper': axesHelper.visible,
    };
    gui.add(uiProperties, 'grid helper').onChange((value) => gridHelper.visible = value);
    gui.add(uiProperties, 'axis helper').onChange((value) => axesHelper.visible = value);
    const sceneFolder = gui.addFolder('Scene');

    const scaleCubeScene = new ScaleCubeScene(new Vector3(1, 0, 0), new Vector3(1.501, 0.5, 0.499))
        .addControls(controls)
        .addGUI(sceneFolder);
    scene.add(scaleCubeScene.getSceneGroup());

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
        scaleCubeScene.update(timestamp);
        controls.update();
        render();
        stats.update()
        requestAnimationFrame(animate);
    }

    const render = () => {
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}

// @ts-ignore
helloCube(three_canvas);
