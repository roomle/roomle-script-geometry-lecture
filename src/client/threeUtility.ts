import {
    BoxGeometry,
    BoxHelper,
    ColorRepresentation,
    Group,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshLambertMaterial,
    WireframeGeometry,
} from 'three';

export const newObjectMesh = (geometry: any, edgeColor: ColorRepresentation, faceColor: ColorRepresentation, opacity: number) => {
    const material = new MeshLambertMaterial({color: faceColor, transparent: opacity < 1, opacity});
    const mesh = new Mesh(geometry, material);
    const lineMaterial = new LineBasicMaterial({color: edgeColor, linewidth: 3});
    const lineSegments = new LineSegments(new WireframeGeometry(geometry), lineMaterial);
    const objectGroup = new Group();
    objectGroup.add(mesh);
    objectGroup.add(lineSegments);
    return objectGroup; 
}

export const newBoxMesh = (edgeColor: ColorRepresentation, faceColor: ColorRepresentation, opacity: number) => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({color: 0xe02020, transparent: true, opacity});
    const mesh = new Mesh(geometry, material);
    const box = new BoxHelper(mesh, 0x000000);
    (box.material as LineBasicMaterial).linewidth = 3;
    const objectGroup = new Group();
    objectGroup.add(mesh);
    objectGroup.add(box);
    return objectGroup; 
}