import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	BoxGeometry,
	PlaneGeometry,
	MeshBasicMaterial,
	MeshPhongMaterial,
	Mesh,
	CircleGeometry 
} from '../../../build/three.module.js';
import { OBJLoader } from '../loaders/OBJLoader.js';
import {CSG} from '../../../build/project0209/three-csg.js';

var DoorWindow = function (_doorgroup, edgegroup, vertexgroup, _camera, _domElement ) {

	var _plane = new Plane();
	var _raycaster = new Raycaster();
	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];
	var _selected = null, _hovered = null;
	var _activeEdge = null;
	var objloader = new OBJLoader();
	var scope = this;
	
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
	
	var DoorGeometry;
	objloader.load(
		'../../../build/project0209/musor/door.obj',
		function ( object ) {
			object.traverse( function( child ) {
				if ( child instanceof Mesh ) {
					const material = new MeshBasicMaterial( { color: 0x442266 } );
					child.material = material;
				}
			} );
			DoorGeometry = object.children[0].geometry;
		},
		function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		function ( error ) {
			console.log( 'An error happened' );
		}
	);
	
	

	var door_window = 0;
	
	var lastDoor; //for tests
	
	function setItem(id)
	{
		door_window = id;
	}


	function activate()
	{
		_domElement.addEventListener( 'pointermove', onPointerMove );
		_domElement.addEventListener( 'pointerdown', onPointerDown );
		_domElement.addEventListener( 'pointerup', onPointerCancel );
		_domElement.addEventListener( 'pointerleave', onPointerCancel );
	}

	function deactivate()
	{
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.style.cursor = '';
	}

	function dispose()
	{
		deactivate();
	}

	function getObjects()
	{
		return _objects;
	}

	function onPointerMove( event ) {

		event.preventDefault();
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				onMouseMove( event );
				break;
		}
	}

	function onMouseMove( event ) {

		var rect = _domElement.getBoundingClientRect();
		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
		_raycaster.setFromCamera( _mouse, _camera );
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


	function onPointerDown( event ) {

		event.preventDefault();
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				onMouseDown( event );
				break;
		}
	}

	function onMouseDown( event )
	{
		if(scope.enabled)
		{
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( edgegroup.children, true, _intersections );
		if ( _intersections.length > 0)
		{
			_selected = ( scope.transformGroup === true ) ? edgegroup.children[ 0 ] : _intersections[ 0 ].object;
			_activeEdge = _selected;
			createHoleInActive(_activeEdge);
		}
		}
	}
	
	function swapWall(wall)
	{
		var geometry = wall.geometry.clone();
		var material = new MeshPhongMaterial({color: 0xA5A5A5 , flatShading: true});
		var mesh = new Mesh(geometry, material);
		mesh.updateMatrix();
		var meshbsp = CSG.fromMesh(mesh);
		var ageometry  = new BoxGeometry(1/wall.scale.x,1,2/3);
		ageometry.translate(0,0,2/6);
		var amesh = new Mesh(ageometry);
		var ameshbsp = CSG.fromMesh(amesh)
		var subbsp = meshbsp.subtract(ameshbsp);
		var result = CSG.toMesh(subbsp, mesh.matrix, material);
		result.scale.copy(wall.scale);
		result.position.copy(wall.position);
		result.rotation.copy(wall.rotation);
		result.userData.vertex = wall.userData.vertex;
		wall.userData.vertex[0].userData.edges.push(result);
		wall.userData.vertex[1].userData.edges.push(result);
		result.userData.door = wall.userData.door;
		result.userData.door[0].userData.edge = [result];
		edgegroup.add(result);
		removeEdge(wall);
		
		_activeEdge = result;
	}
	
	function ohFuckSwapBack(wall)
	{
		var geometry = WallGeometry.clone();
		var material = new MeshPhongMaterial({color: 0xA5A5A5 , flatShading: true});
		var mesh = new Mesh(geometry, material);
		mesh.updateMatrix();

		mesh.scale.copy(wall.scale);
		mesh.position.copy(wall.position);
		mesh.rotation.copy(wall.rotation);
		mesh.userData.vertex = wall.userData.vertex;
		wall.userData.vertex[0].userData.edges.push(mesh);
		wall.userData.vertex[1].userData.edges.push(mesh);
		mesh.userData.door = wall.userData.door;
		mesh.userData.door[0].userData.edge = [mesh];
		edgegroup.add(mesh);
		removeEdge(wall);
	}
	
	
	
	
	function removeEdge(wall)
	{
			wall.userData.vertex.forEach(item => {
				for( var i=0; i<item.userData.edges.length; i++)
				{
					if(item.userData.edges[i]==wall)
					{
						item.userData.edges.splice(i,1);
						break;
					}
				}
			});
		edgegroup.remove(wall);
	}
	
	function createHoleInActive()
	{
		addDoor(_activeEdge);
		//swapWall(_activeEdge);
		//ohFuckSwapBack(_activeEdge);
	}
	
	function addDoor(edge)
	{
		var geometry = DoorGeometry.clone();
		var material = new MeshBasicMaterial( { color: 0x442266 } );
		var mesh = new Mesh(geometry, material);
		_doorgroup.add( mesh );
		var helpergeometry = new PlaneGeometry( 1, 1 );
		var helpermaterial = new MeshBasicMaterial( { color: 0x00000f } );
		var helpermesh = new Mesh(helpergeometry, material);
		helpermesh.position.z = 7;
		helpermesh.scale.y = edge.scale.y;
		helpermesh.rotation.z = edge.rotation.z;
		mesh.add(helpermesh);
		mesh.scale.z = 2;
		
		mesh.userData.edge = [edge];
		edge.userData.door = [mesh];
		mesh.position.copy(edge.position);
		lastDoor = mesh;
	}
	

var scroll = document.getElementById("Obj_location");
scroll.addEventListener( 'input', activateScroll );
function activateScroll()
{
	var originPoint = lastDoor.userData.edge[0].userData.vertex[0].position.clone();
	var difference = new Vector2().subVectors(lastDoor.userData.edge[0].userData.vertex[1].position,originPoint);
	var vect = originPoint.addScaledVector(difference,scroll.value/100);
	console.log(1/scroll.value);
	lastDoor.position.set(vect.x,vect.y,0);
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
		}
	}

	function onMouseCancel( event ) {

		event.preventDefault();

		if ( _selected ) {
			scope.dispatchEvent( { type: 'dragend', object: _selected } );
			_selected = null;
		}
		_domElement.style.cursor = _hovered ? 'pointer' : 'auto';
	}

	
	activate();

	// API

	this.enabled = true;
	this.transformGroup = false;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;
	

	this.setItem = setItem;
	
};

DoorWindow.prototype = Object.create( EventDispatcher.prototype );
DoorWindow.prototype.constructor = DoorWindow;

export { DoorWindow };