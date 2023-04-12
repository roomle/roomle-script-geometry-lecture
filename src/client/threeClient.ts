import { Controls } from './threeControls';
import { LectureScene } from './threeUtility';
import { ScaleCubeScene } from './scaleCubeScene';
import { RotateCubeScene } from './rotateCubeScene';
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
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement);

    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-2, 2, 3);
    const controls = new Controls(renderer, renderer.domElement, camera);

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

    const scaleCubeScene = new ScaleCubeScene(new Vector3(1, 0, 0), new Vector3(1.501, 0.5, 0.499))
        .addControls(controls);
    scene.add(scaleCubeScene.getSceneGroup());
    scaleCubeScene.setVisibility(false);
    const rotateCubeScene = new RotateCubeScene(new Vector3(1, 0, 0), new Vector3(1.501, 0.5, 0.499))
        .addControls(controls);
    scene.add(rotateCubeScene.getSceneGroup());
    rotateCubeScene.setVisibility(false);

    // @ts-ignore
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    const gui = new GUI();
    const uiProperties = {
        'grid helper': gridHelper.visible,
        'axis helper': axesHelper.visible,
        'scene': 'rotate cube',
    };
    gui.add(uiProperties, 'grid helper').onChange((value) => gridHelper.visible = value);
    gui.add(uiProperties, 'axis helper').onChange((value) => axesHelper.visible = value);
    gui.add<any>(uiProperties, 'scene', ['scale cube', 'rotate cube']).onChange((scene: string) => setCurrentScene(scene));
    let currentScene: LectureScene | null = scaleCubeScene;
    let sceneFolder: GUI | null = gui.addFolder('Scene');
    const setCurrentScene = (scene: string) => {
        if (sceneFolder) {
            gui.removeFolder(sceneFolder);
        }
        sceneFolder = gui.addFolder('Scene');
        currentScene?.setVisibility(false);
        switch (scene) {
            case 'scale cube':
                currentScene = scaleCubeScene;
                break;
            case 'rotate cube':
                currentScene = rotateCubeScene;
                break;
        }
        if (currentScene) {
            currentScene.setVisibility(true);
            currentScene.addGUI(sceneFolder);
        }
    };
    setCurrentScene(uiProperties.scene);

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
        currentScene?.update(timestamp, camera);
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
