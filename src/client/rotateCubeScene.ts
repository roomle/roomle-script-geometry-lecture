import { 
    createLabel,
    LectureScene,
    newBoxMesh,
    newDotMesh
} from './threeUtility'
import { Controls } from './threeControls';
import {
    Box3,
    Camera,
    Group,
    Object3D,
    Vector3,
} from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GUI } from 'dat.gui'

export class RotateCubeScene implements LectureScene {
    public sceneGroup: Group;
    private pivotPosition: Vector3
    private originDot: Object3D;
    private pivotDot: Object3D;
    private objectGroup: Object3D;
    private pivotGroup: Object3D;
    private rotateGroup: Object3D;
    private transformedObjectGroup: Object3D;
    private pivotTransformControl: TransformControls | undefined;
    private meshTransformControl: TransformControls | undefined;
    private originLabel: CSS2DObject;
    private pivotLabel: CSS2DObject;
    private operationLabel: CSS2DObject;
    private boundingBox: Box3;

    constructor(pivotPosition: Vector3, objectPosition: Vector3) {
        this.pivotPosition = pivotPosition.clone();
        this.sceneGroup = new Group();
        this.originDot = newDotMesh(new Vector3(0, 0, 0), 0xffff00, 1);
        this.sceneGroup.add(this.originDot);
        this.pivotDot = newDotMesh(this.pivotPosition.clone(), 0x00ff00, 1);
        this.sceneGroup.add(this.pivotDot);
        this.objectGroup = newBoxMesh(0x808080, 0xe02020, 0);
        this.objectGroup.position.copy(objectPosition);
        this.sceneGroup.add(this.objectGroup);
        this.transformedObjectGroup = newBoxMesh(0x000000, 0xe02020, 0);
        this.rotateGroup = new Group();
        this.rotateGroup.add(this.transformedObjectGroup);
        this.pivotGroup = new Group();
        this.pivotGroup.add(this.rotateGroup);
        this.sceneGroup.add(this.pivotGroup);
        this.originLabel = createLabel('origin');
        this.originDot.add(this.originLabel);
        this.pivotLabel = createLabel('pivot');
        this.pivotDot.add(this.pivotLabel);
        this.operationLabel = createLabel('RotateMatrixBy({0, 0, 1}, {0, 0, 0}), 0');
        this.sceneGroup.add(this.operationLabel);
        this.boundingBox = new Box3().setFromObject(this.sceneGroup);
    }

    public getSceneGroup(): Group {
        return this.sceneGroup;
    }

    public setVisibility(visible: boolean): void {
        this.sceneGroup.visible = visible;
        this.originLabel.visible = visible;
        this.pivotLabel.visible = visible;
        this.operationLabel.visible = visible;
        if (!visible && this.pivotTransformControl) {
            this.pivotTransformControl.visible = visible;
            this.pivotTransformControl.enabled = visible;
        }
        if (!visible && this.meshTransformControl) {
            this.meshTransformControl.visible = visible;
            this.meshTransformControl.enabled = visible;
        }
    }

    public update(timestamp: number, camera: Camera): void {
        this.originDot.visible = this.pivotDot.position.length() > 0.1;	
        this.originLabel.visible = this.originDot.visible;
        if (this.pivotPosition.clone().sub(this.pivotDot.position).length() > 0.01 ||
            this.transformedObjectGroup.position.clone().sub(this.objectGroup.position).length() > 0.01) {
            this.pivotPosition.copy(this.pivotDot.position);
            this.pivotGroup.position.copy(this.pivotPosition);
            this.transformedObjectGroup.position.copy(this.objectGroup.position.clone().sub(this.pivotPosition));
        }
        const angle = (90 * timestamp / 1000) % 360; 
        this.rotateGroup.rotation.set(0, -angle * Math.PI / 180, 0);
        const center = new Vector3();
        this.boundingBox.getCenter(center);
        const size = new Vector3();
        this.boundingBox.getSize(size);
        const downVector = new Vector3(0, -1, 0)
            .transformDirection(camera.matrixWorld)
            .multiplyScalar(size.length()/2)
        this.operationLabel.position.copy(center.add(downVector));
        const pivotX = this.pivotPosition.x.toFixed(1);
        const pivotY = this.pivotPosition.y.toFixed(1);
        const pivotZ = this.pivotPosition.z.toFixed(1);
        this.operationLabel.element.innerHTML = 
            `RotateMatrixBy({0, 0, 1}, {${pivotX}, ${pivotY}, ${pivotZ}}, ${Math.trunc(angle)})`;
    }

    public addControls(controls: Controls): LectureScene {
        this.pivotTransformControl = controls.addTransformControl(this.pivotDot, this.sceneGroup);
        this.pivotTransformControl.visible = false;
        this.pivotTransformControl.enabled = false;
        this.meshTransformControl = controls.addTransformControl(this.objectGroup, this.sceneGroup);
        this.meshTransformControl.visible = false;
        this.meshTransformControl.enabled = false;
        return this;
    }

    public addGUI(gui: GUI): LectureScene {
        const uiProperties = {
            'pivot transform control': this.pivotTransformControl?.visible,
            'mesh transform control': this.meshTransformControl?.visible,
        };
        gui.add(uiProperties, 'pivot transform control').onChange((value) => {
            if (this.pivotTransformControl) {
                this.pivotTransformControl.visible = value;
                this.pivotTransformControl.enabled = value;
            }
        });
        gui.add(uiProperties, 'mesh transform control').onChange((value) => {
            if (this.meshTransformControl) {
                this.meshTransformControl.visible = value;
                this.meshTransformControl.enabled = value;
            }
        });
        return this;
    };
}