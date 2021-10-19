import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	BoxGeometry,
	MeshBasicMaterial,
	MeshPhongMaterial,
	Mesh,
	CircleGeometry 
} from '../../../build/three.module.js';
import { OBJLoader } from '../loaders/OBJLoader.js';
import {CSG} from '../../../build/project0209/three-csg.js';

var EdgeSplitter = function (scene, edgegroup, vertexgroup, _camera, _domElement ) {

	var _plane = new Plane();
	var _raycaster = new Raycaster();

	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];

	var _selected = null, _hovered = null;

	var menuDiv = null;
	var _activeEdge = null;
	
	
	var objloader = new OBJLoader();
	var WallGeometry;
	objloader.load(
		'../../../build/project0209/musor/wall.obj',
		function ( object ) {
			object.traverse( function( child ) {
				if ( child instanceof Mesh ) {
					const material = new MeshBasicMaterial( { color: 0x000000 } );
					child.material = material;
				}
			} );
			WallGeometry = object.children[0].geometry;
		},
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);


	//

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'pointermove', onPointerMove );
		_domElement.addEventListener( 'pointerdown', onPointerDown );
		_domElement.addEventListener( 'pointerup', onPointerCancel );
		_domElement.addEventListener( 'pointerleave', onPointerCancel );
		_domElement.addEventListener( 'touchmove', onTouchMove );
		_domElement.addEventListener( 'touchstart', onTouchStart );
		_domElement.addEventListener( 'touchend', onTouchEnd );

	}

	function deactivate() {

		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.removeEventListener( 'touchmove', onTouchMove );
		_domElement.removeEventListener( 'touchstart', onTouchStart );
		_domElement.removeEventListener( 'touchend', onTouchEnd );

		_domElement.style.cursor = '';

	}

	function dispose() {

		deactivate();

	}

	function getObjects() {

		return _objects;

	}

	function onPointerMove( event ) {

		event.preventDefault();

		switch ( event.pointerType ) {

			case 'mouse':
			case 'pen':
				onMouseMove( event );
				break;

			// TODO touch

		}

	}

	function onMouseMove( event ) {

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );
/*
		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

			}

			scope.dispatchEvent( { type: 'drag', object: _selected } );

			return;

		}
*/
		_intersections.length = 0;

		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( edgegroup.children, true, _intersections );

		if ( _intersections.length > 0 ) {

			var object = _intersections[ 0 ].object;

			_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );

			if ( _hovered !== object )
			{
				scope.dispatchEvent( { type: 'hoveron', object: object } );
				_domElement.style.cursor = 'pointer';
				_hovered = object;
			}
		} else
		{
			if ( _hovered !== null )
			{
				scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );
				_domElement.style.cursor = 'auto';
				_hovered = null;
			}
		}
	}

	function showLength(edge)
	{
		var l1 = edge.userData.one.distanceTo(edge.userData.three);
		var l2 = edge.userData.four.distanceTo(edge.userData.five);
		console.log(l1 +'; '+ l2);
	}


	function onPointerDown( event ) {

		event.preventDefault();

		switch ( event.pointerType ) {

			case 'mouse':
			case 'pen':
				onMouseDown( event );
				break;

			// TODO touch

		}

	}

	function onMouseDown( event )
	{
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( edgegroup.children, true, _intersections );
		if ( _intersections.length > 0)
		{
			_selected = ( scope.transformGroup === true ) ? edgegroup.children[ 0 ] : _intersections[ 0 ].object;
			_activeEdge = _selected;
			//outline(_selected);
			if(scope.enabled)
				if(event.button == 2)
				{
					showContextMenu(event.clientX+4, event.clientY+4);
				}
		}
	}

	function showContextMenu(x,y)
	{
		showLength(_activeEdge);
		if(menuDiv!=null) menuDiv.remove();
		event.preventDefault();
		menuDiv = document.createElement("div");
		menuDiv.id="menu";
		menuDiv.style.position = "absolute";
		menuDiv.style.background = "red";
		menuDiv.style.top = y+'px';
		menuDiv.style.left = x+'px';
		var but1 = document.createElement("input");
		but1.type="button";
		but1.value="delete";
		but1.addEventListener( 'click', removeActiveEdge );
		var but2 = document.createElement("input");
		but2.type="button";
		but2.value="split";
		but2.addEventListener( 'click', splitActiveEdge );
		var but3 = document.createElement("input");
		but3.type="button";
		but3.value="hidemenu";
		but3.addEventListener( 'click', hideContextMenu );
		var but4 = document.createElement("input");
		but4.type="button";
		but4.value="door";
		but4.addEventListener( 'click', createHoleInActive );
		menuDiv.appendChild(but1);
		menuDiv.appendChild(but2);
		menuDiv.appendChild(but3);
		menuDiv.appendChild(but4);

		document.body.appendChild(menuDiv);
	}

	function hideContextMenu()
	{
		document.getElementById("menu").remove();
	}

	function removeActiveEdge()
	{
		if(_activeEdge)
		{
			_activeEdge.userData.vertex.forEach(item => {
				if(item.userData.edges.length == 1) item.parent.remove(item);
				else
				{
					for( var i=0; i<item.userData.edges.length; i++)
					{
						if(item.userData.edges[i]==_activeEdge)
						{
							item.userData.edges.splice(i,1);
							break;
						}
					}
				}
				});
			_activeEdge.parent.remove(_activeEdge);
		}
		hideContextMenu();
	}

	function splitActiveEdge()
	{
		var p ={
			x: _intersections[0].point.x,
			y: _intersections[0].point.y,
		}
		var a ={
			x: _activeEdge.userData.vertex[0].position.x,
			y: _activeEdge.userData.vertex[0].position.y,
		}
		var b={
			x: _activeEdge.userData.vertex[1].position.x,
			y: _activeEdge.userData.vertex[1].position.y,
		}
		var target = project(p,a,b).point;
		createWallsBetween(_activeEdge.userData.vertex[0],target,_activeEdge.userData.vertex[1]);
		removeActiveEdge();
	}
	
	function createWallBetween(vertex1, vertex2)
	{
		const geometry = WallGeometry.clone();
		const material = new MeshPhongMaterial({color: 0x676A72 , flatShading: true});
		const mesh = new Mesh(geometry, material);
		mesh.position.copy( new Vector3().addVectors(vertex2.position,vertex1.position).divideScalar(2));
		mesh.position.z = 0;
		myLookAt(mesh, vertex2.position);
		mesh.scale.set(vertex2.position.distanceTo(vertex1.position), _activeEdge.scale.y, mesh.scale.z);
		mesh.userData.vertex = [vertex1, vertex2];
		if(vertex1.userData.edges) vertex1.userData.edges.push(mesh);
		else vertex1.userData.edges = [mesh];
		if(vertex2.userData.edges) vertex2.userData.edges.push(mesh);
		else vertex2.userData.edges = [mesh];
		edgegroup.add(mesh);
		mesh.updateMatrixWorld();
	}
	
	function createWallsBetween(vertex1, intersectedPoint, vertex2)
	{
		const cgeometry = new CircleGeometry( 0.07, 12 );
		const cmaterial = new MeshBasicMaterial( { color: 0x000000 } );
		const circle = new Mesh( cgeometry, cmaterial );
		circle.position.set(intersectedPoint.x,intersectedPoint.y,4);
		circle.name = "vertex";
		vertexgroup.add( circle );
		createWallBetween(vertex1, circle);
		createWallBetween(vertex2, circle);
	}

	function acreateHoleInActive()
	{
		var geometry = WallGeometry.clone();;
		var mesh = new Mesh(geometry);
		var meshbsp = CSG.fromMesh(mesh);
		
		var ageometry = new BoxGeometry(1/_activeEdge.scale.x,2,1);
		var amesh = new Mesh(ageometry);
		var ameshbsp = CSG.fromMesh(amesh);
		
		var subbsp = meshbsp.subtract(ameshbsp);
		var result = CSG.toMesh(subbsp, mesh.matrix, _activeEdge.material);
		result.scale.z = _activeEdge.scale.z;
		result.position.copy(_activeEdge.position);
		var vect = new Vector3(_activeEdge.userData.vertex[1].position.x,_activeEdge.userData.vertex[1].position.y,0);
		result.lookAt(vect);
		_activeEdge.userData.vertex[0].userData.edges.push(result);
		_activeEdge.userData.vertex[1].userData.edges.push(result);
		result.userData.vertex = [_activeEdge.userData.vertex[0]];
		result.userData.vertex.push(_activeEdge.userData.vertex[1]);
		edgegroup.add(result);
		addDoor(result);
		removeActiveEdge();
	}
	
	function createHoleInActive()
	{
		//var geometry = WallGeometry.clone();;
		//var mesh = new Mesh(geometry);
		//var meshbsp = CSG.fromMesh(mesh);
		
		//var ageometry = new BoxGeometry(1/_activeEdge.scale.x,2,1);
		//var amesh = new Mesh(ageometry);
		//var ameshbsp = CSG.fromMesh(amesh);
		
		//var subbsp = meshbsp.subtract(ameshbsp);
		//var result = CSG.toMesh(subbsp, mesh.matrix, _activeEdge.material);
		//result.scale.z = _activeEdge.scale.z;
		//result.position.copy(_activeEdge.position);
		//var vect = new Vector3(_activeEdge.userData.vertex[1].position.x,_activeEdge.userData.vertex[1].position.y,0);
		//result.lookAt(vect);
		//_activeEdge.userData.vertex[0].userData.edges.push(result);
		//_activeEdge.userData.vertex[1].userData.edges.push(result);
		//result.userData.vertex = [_activeEdge.userData.vertex[0]];
		//result.userData.vertex.push(_activeEdge.userData.vertex[1]);
		//edgegroup.add(result);
		addDoor(_activeEdge);
		//removeActiveEdge();
	}
	
	function addDoor(edge)
	{
		const oloader = new OBJLoader();

		// load a resource
		oloader.load(
			// resource URL
			'../../../build/project0209/musor/door.obj',
			// called when resource is loaded
			function ( object ) {
				object.traverse( function( child ) {
					if ( child instanceof Mesh ) {
						const material = new MeshBasicMaterial( { color: 0xffff00 } );
						child.material = material;
					}
				} );
				edge.add( object );
				object.scale.x = 1/edge.scale.x;
				object.scale.y = 30;
				object.scale.z = 1/edge.scale.z;
				//object.scale.z = edge.scale.z;
			},
			// called when loading is in progresses
			function ( xhr ) {

				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
		);
	}

	function testBoolean()
	{
		var material = new MeshBasicMaterial( { color: 0x000000 } );
		
		var geometry = new BoxGeometry(6,1,3);
		var mesh = new Mesh(geometry);
		mesh.position.add(new Vector3(0,0,3));
		mesh.updateMatrix();
		
		var meshbsp = CSG.fromMesh(mesh);
		
		var ageometry  = new BoxGeometry(3,1,1);
		var amesh = new Mesh(ageometry);
		var ameshbsp = CSG.fromMesh(amesh)
		
		var subbsp = meshbsp.subtract(ameshbsp);
		var result = CSG.toMesh(subbsp, mesh.matrix, material);
		scene.add(result);
		result.position.z = 5;
		alert('asd');
	}

	function project( p, a, b )
	{
    var atob = { x: b.x - a.x, y: b.y - a.y };
    var atop = { x: p.x - a.x, y: p.y - a.y };
    var len = atob.x * atob.x + atob.y * atob.y;
    var dot = atop.x * atob.x + atop.y * atob.y;
    var t = Math.min( 1, Math.max( 0, dot / len ) );
    dot = ( b.x - a.x ) * ( p.y - a.y ) - ( b.y - a.y ) * ( p.x - a.x );
    return{
        point:
		{
            x: a.x + atob.x * t,
            y: a.y + atob.y * t
        },
        left: dot < 1,
        dot: dot,
        t: t
    };
}

	function onPointerCancel( event ) {

		event.preventDefault();

		switch ( event.pointerType ) {

			case 'mouse':
			case 'pen':
				onMouseCancel( event );
				break;

			// TODO touch

		}

	}

	function onMouseCancel( event ) {

		event.preventDefault();

		if ( _selected ) {

			scope.dispatchEvent( { type: 'dragend', object: _selected } );
		//	_selected.parent.remove(_selected);
			_selected = null;

		}

		_domElement.style.cursor = _hovered ? 'pointer' : 'auto';

	}

	function onTouchMove( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

			}

			scope.dispatchEvent( { type: 'drag', object: _selected } );

			return;

		}

	}

	function onTouchStart( event ) {

		event.preventDefault();
		event = event.changedTouches[ 0 ];

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

		_intersections.length = 0;

		_raycaster.setFromCamera( _mouse, _camera );
		 _raycaster.intersectObjects( edgegroup.children, true, _intersections );

		if ( _intersections.length > 0 ) {

			_selected = ( scope.transformGroup === true ) ? edgegroup.children[ 0 ] : _intersections[ 0 ].object;

			_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
				_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

			}
			_domElement.style.cursor = 'move';
			scope.dispatchEvent( { type: 'dragstart', object: _selected } );
		}
	}

	function onTouchEnd( event ) {
		event.preventDefault();
		if ( _selected ) {
			scope.dispatchEvent( { type: 'dragend', object: _selected } );
			_selected = null;
		}
		_domElement.style.cursor = 'auto';
	}
	
	function myLookAt(object, target)
	{
		var difference = new Vector3().subVectors(target, object.position,);
		var rotZ = Math.atan2(difference.y, difference.x);
		object.rotation.set(0,0,rotZ);
	}


	var offsetbar = document.getElementById('offset');
	offsetbar.addEventListener('input',moveGeometryVertexes);

	function moveGeometryVertexes()
	{
		var offsetvalue = offsetbar.value;
		for(var i = 1; i<42; i++)
		{
			var start = _activeEdge.geometry.attributes.position.getY(i);
			_activeEdge.geometry.attributes.position.setY(i, coords(i)+offsetvalue/100);
		}
		_activeEdge.geometry.attributes.position.needsUpdate = true;
	}
	
	function coords(i)
	{
		var one = [1,2,4,14,16,25,26,28];
		var three = [7,8,10,13,24,27,29];
		var four = [18,21,23,35,42,45,47];
		var five = [19,20,22,30,33,36,39,41];
		if(one.includes(i)) return 0.5;
		if(three.includes(i)) return 0.5;
		if(four.includes(i)) return -0.5;
		if(five.includes(i)) return -0.5;
		else return 0;
	}
	
	
	function outline(wall)
	{
		wall.material.color.r = 0;
		wall.material.color.g = 1;
		wall.material.color.b = 1;
	}
	
	function removeOutline(wall)
	{
		wall.material.color.r = 0.4;
		wall.material.color.g = 0.41
		wall.material.color.b = 0.44;
	}
	
	
	
	
	activate();

	// API

	this.enabled = true;
	this.transformGroup = false;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;
	
	this.testBoolean = testBoolean;

};

EdgeSplitter.prototype = Object.create( EventDispatcher.prototype );
EdgeSplitter.prototype.constructor = EdgeSplitter;

export { EdgeSplitter };