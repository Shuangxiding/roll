export default function drawCoords(scene,group) {
    var xmat = new THREE.LineBasicMaterial({color: 0xff0000});
    var ymat = new THREE.LineBasicMaterial({color: 0x00ff00});
    var zmat = new THREE.LineBasicMaterial({color: 0x0000ff});

    var xgeo = new THREE.Geometry();
    xgeo.vertices.push(
            new THREE.Vector3(-1000, 0, 0),
            new THREE.Vector3(1000, 0, 0)
    );
    var ygeo = new THREE.Geometry();
    ygeo.vertices.push(
            new THREE.Vector3(0, -1000, 0),
            new THREE.Vector3(0, 1000, 0)
    );
    var zgeo = new THREE.Geometry();
    zgeo.vertices.push(
            new THREE.Vector3(0, 0, -1000),
            new THREE.Vector3(0, 0, 1000)
    );

    var xline = new THREE.Line(xgeo, xmat);
    var yline = new THREE.Line(ygeo, ymat);
    var zline = new THREE.Line(zgeo, zmat);
    scene.add(new THREE.Line(xgeo, new THREE.LineBasicMaterial({color: 0xffcc00})))
    scene.add(new THREE.Line(ygeo, new THREE.LineBasicMaterial({color: 0x00ffcc})))
    scene.add(new THREE.Line(zgeo, new THREE.LineBasicMaterial({color: 0xcc00ff})))
    group.add(xline);
    group.add(yline);
    group.add(zline);
}