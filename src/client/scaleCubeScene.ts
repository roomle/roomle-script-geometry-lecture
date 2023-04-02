import { 
    addScaleArrowHelpers,
    LectureScene,
    newBoxMesh,
    newDotMesh
} from './threeUtility'
import { Controls } from './threeControls';
import {
     Group,
     Object3D,
     Vector3,
} from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GUI } from 'dat.gui'

export class ScaleCubeScene implements LectureScene {
    public sceneGroup: Group;
    private pivotPosition: Vector3
    private originDot: Object3D;
    private pivotDot: Object3D;
    private objectGroup: Object3D;
    private pivotGroup: Object3D;
    private scaleGroup: Object3D;
    private scaleArrowGroup: Object3D;
    private transformedObjectGroup: Object3D;
    private pivotTransformControl: TransformControls | undefined;
    private meshTransformControl: TransformControls | undefined;

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
        this.scaleGroup = new Group();
        this.scaleGroup.add(this.transformedObjectGroup);
        this.scaleArrowGroup = new Group();
        this.scaleGroup.add(this.scaleArrowGroup);
        addScaleArrowHelpers(this.scaleArrowGroup, this.transformedObjectGroup, this.pivotDot.position);
        this.pivotGroup = new Group();
        this.pivotGroup.add(this.scaleGroup);
        this.sceneGroup.add(this.pivotGroup);
    }

    public getSceneGroup(): Group {
        return this.sceneGroup;
    }

    public update(timestamp: number): void {
        this.originDot.visible = this.pivotDot.position.length() > 0.1;	
        if (this.pivotPosition.clone().sub(this.pivotDot.position).length() > 0.01 ||
            this.transformedObjectGroup.position.clone().sub(this.objectGroup.position).length() > 0.01) {
            this.pivotPosition.copy(this.pivotDot.position);
            this.pivotGroup.position.copy(this.pivotPosition);
            this.transformedObjectGroup.position.copy(this.objectGroup.position.clone().sub(this.pivotPosition));
            this.scaleArrowGroup.clear();
            addScaleArrowHelpers(this.scaleArrowGroup, this.transformedObjectGroup, this.pivotDot.position);
        }
        const scale = 1.5 + 0.5 * Math.sin(timestamp / 1000); 
        this.scaleGroup.scale.set(scale, scale, scale);
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