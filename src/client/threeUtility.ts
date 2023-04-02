import { Controls } from './threeControls';
import {
    ArrowHelper,
    BoxGeometry,
    BoxHelper,
    Camera,
    ColorRepresentation,
    Group,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshLambertMaterial,
    Object3D,
    SphereGeometry,
    Vector3,
    WireframeGeometry,
} from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'dat.gui'

export interface LectureScene {
    getSceneGroup(): Group;
    update(timestamp: number, camera: Camera): void
    addControls(controls: Controls): LectureScene;
    addGUI(gui: GUI): LectureScene;
}

export const newObjectMesh = (geometry: any, edgeColor: ColorRepresentation, faceColor: ColorRepresentation, opacity: number): Group => {
    const material = new MeshLambertMaterial({color: faceColor, transparent: opacity < 1, opacity});
    const mesh = new Mesh(geometry, material);
    const lineMaterial = new LineBasicMaterial({color: edgeColor, linewidth: 3});
    const lineSegments = new LineSegments(new WireframeGeometry(geometry), lineMaterial);
    const objectGroup = new Group();
    objectGroup.add(mesh);
    objectGroup.add(lineSegments);
    return objectGroup; 
};

export const newBoxMesh = (edgeColor: ColorRepresentation, faceColor: ColorRepresentation, opacity: number): Group => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({color: faceColor, transparent: opacity < 1, opacity});
    const mesh = new Mesh(geometry, material);
    mesh.visible = opacity > 0;
    const box = new BoxHelper(mesh, edgeColor);
    (box.material as LineBasicMaterial).linewidth = 3;
    const objectGroup = new Group();
    objectGroup.add(mesh);
    objectGroup.add(box);
    return objectGroup; 
};

export const newDotMesh = (position: Vector3, color: ColorRepresentation, opacity: number): Mesh => {
    const geometry = new SphereGeometry(0.1, 32, 16);
    const material = new MeshLambertMaterial({color, transparent: opacity < 1, opacity});
    const mesh = new Mesh(geometry, material);
    mesh.position.copy(position);
    return mesh;
};

export const addScaleArrowHelpers = (sourceGroup: Object3D, targetObject: Object3D, pivot: Vector3) => {
    const directions = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];
    directions.forEach((direction) => {
        const directionVector = new Vector3(direction[0], direction[1], direction[2])
            .multiplyScalar(0.5)
            .add(targetObject.position);
        const distance = directionVector.length();
        const arrowHelper = new ArrowHelper(directionVector.normalize(), new Vector3(0, 0, 0), distance, 0x00c000);
        sourceGroup.add(arrowHelper);
    });  
}

export const createLabel = (text: string): CSS2DObject => {
    const labelDiv = document.createElement( 'div' );
    labelDiv.className = 'label';
    labelDiv.textContent = text;
    labelDiv.style.backgroundColor = 'transparent';
    const labelObject = new CSS2DObject(labelDiv);
    labelObject.position.set(0, 0, 0);
    // @ts-ignore
    labelObject.center.set(0.5, -0.5);
    labelObject.layers.set(0);
    return labelObject;
}