import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	BoxGeometry,
	BufferGeometry,
	MeshBasicMaterial,
	MeshPhongMaterial,
	MeshStandardMaterial,
	Mesh,
	Group,
	CircleGeometry 
} from '../../../build/three.module.js';
import { GLTFLoader } from '../loaders/GLTFLoader.js';
import { OBJLoader } from '../loaders/OBJLoader.js';
import {BufferGeometryUtils} from '../utils/BufferGeometryUtils.js';

var WallBuild = function ( shopitems, scene, vertexgroup, edgegroup, _objects, _camera, _domElement ) {

	var _plane = new Plane(new Vector3(0,0,1));
	var _raycaster = new Raycaster();
	var _object;

	
	var startPosition = new Vector3();
	var endPosition;
	var _circle;	
	var active = true;
	
	
	var objloader = new OBJLoader();
	var WallGeometry;
	objloader.load(
		'../../../build/project1908/musor/wall.obj',
		function ( object ) {
			object.traverse( function( child ) {
				if ( child instanceof Mesh ) {
					const material = new MeshPhongMaterial({color: 0x676A72 , flatShading: true});
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




	
	
	var _mouse = new Vector2();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];

	var _selected = null, _hovered = null;

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'pointermove', onPointerMove );
		_domElement.addEventListener( 'pointerdown', onPointerDown );
		_domElement.addEventListener( 'pointerup', onPointerCancel );
		_domElement.addEventListener( 'pointerleave', onPointerCancel );
/*		_domElement.addEventListener( 'touchmove', onTouchMove );
		_domElement.addEventListener( 'touchstart', onTouchStart );
		_domElement.addEventListener( 'touchend', onTouchEnd );*/

	}

	function deactivate() {

		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
/*		_domElement.removeEventListener( 'touchmove', onTouchMove );
		_domElement.removeEventListener( 'touchstart', onTouchStart );
		_domElement.removeEventListener( 'touchend', onTouchEnd );*/

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

	function onMouseMove( event )
	{
		var rect = _domElement.getBoundingClientRect();
		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
		_raycaster.setFromCamera( _mouse, _camera );
		if ( _object && scope.enabled ) {
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
				endPosition = _intersection;
				_object.position.copy( new Vector3().addVectors(endPosition,startPosition).divideScalar(2));
				myLookAt(_object, endPosition);
				//_object.lookAt(endPosition.x,endPosition.y,endPosition.z);
				_object.scale.set(endPosition.distanceTo(startPosition),_object.scale.y,_object.scale.z);
			}
			scope.dispatchEvent( { type: 'drag', object: _selected } );
			return;
		}

		_intersections.length = 0;

		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( _objects, true, _intersections );

		if ( _intersections.length > 0 ) 
		{
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

	function onPointerDown( event )
	{
		event.preventDefault();
		switch ( event.pointerType )
		{
			case 'mouse':
			case 'pen':
				onMouseDown( event );
				break;
			// TODO touch
		}
	}
	function createCube(name)
	{
	switch(name)
	{
		case '1': name ="Dispenser"; break;
		case '2': name ="Fridge"; break;
		case '3': name ="PostBox"; break;
		case '4': name ="Wheelrack"; break;
	}
			const loader = new GLTFLoader();
			console.log(name);
			loader.load(
			'../../../build/project1908/musor/models/'+name+'.gltf',
			function( gltf)
			{
				var mesh = gltf.scene.children[0];
				if(mesh.children.length>0)
				{
					var mergedmesh = createMesh(mesh.children);
					shopitems.add(mergedmesh);
					mergedmesh.name = name;
					mergedmesh.rotation.set(0,0,0);
				}
				else
				{
					shopitems.add(mesh);
					mesh.name = name;
					mesh.rotation.set(0,0,0);
				}
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}
	
	
	function createMesh(insertedMeshes)
	{
	var materials = [],
	geometries = [],
	mergedGeometry = new BufferGeometry(),
	meshMaterial,
	mergedMesh;
	insertedMeshes.forEach(function(mesh, index) {
	  mesh.updateMatrix();
	  geometries.push(mesh.geometry);
	  meshMaterial = new MeshStandardMaterial(mesh.material);
	  materials.push(meshMaterial);
	});
	mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
	mergedGeometry.groupsNeedUpdate = true;
	mergedMesh = new Mesh(mergedGeometry, materials);
	return mergedMesh;
	}
	
	
	function switchState()
	{
		if(!active)
		{
		activate();
		active = !active;
		}
		else
		{
		deactivate();
		active = !active;
		}
	}
	

	
	
	function onMouseDown( event )
	{
		if(event.button == 0)
		{
			event.preventDefault();
			_intersections.length = 0;
			_raycaster.setFromCamera( _mouse, _camera );
			const intersects = _raycaster.intersectObjects(vertexgroup.children);
			if(intersects.length>0)
			{
				startPosition.x = intersects[0].object.position.x;
				startPosition.y = intersects[0].object.position.y;
				startPosition.z = 0;
				const geometry = WallGeometry.clone();
				const material = new MeshPhongMaterial({color: 0x676A72 , flatShading: true});
				_object = new Mesh(geometry, material);
				var scaleY = document.getElementById("wallwidth").value;
				var scaleZ = document.getElementById("wallheight").value;
				_object.scale.x=0;
				_object.scale.y=+scaleY;
				_object.scale.z=+scaleZ;
				_object.userData.vertex=[intersects[0].object];
				intersects[0].object.userData.edges.push(_object);
				edgegroup.add(_object);
				_object.position.set(intersects[0].object.position.x,intersects[0].object.position.y,0);
				_object.name = "edge";
			}
			else
			{
				_raycaster.ray.intersectPlane(_plane,_intersection);
				if(_intersection)
				{
					startPosition.copy(_intersection);
					const geometry = WallGeometry.clone();
					const material = new MeshPhongMaterial({color: 0x676A72 , flatShading: true});
					_object = new Mesh(geometry, material);
					const cgeometry = new CircleGeometry( 0.07, 12 );
					const cmaterial = new MeshBasicMaterial( { color: 0x000000 } );
					const circle = new Mesh( cgeometry, cmaterial );
					vertexgroup.add( circle );
					circle.position.set(_intersection.x,_intersection.y,4);
					circle.name = "vertex";
					var scaleY = document.getElementById("wallwidth").value;
					var scaleZ = document.getElementById("wallheight").value;
					_object.scale.x=0;
					_object.scale.y=+scaleY;
					_object.scale.z=+scaleZ;
					_object.userData.vertex=[circle];
					circle.userData.edges=[_object];
					edgegroup.add(_object);
					_object.position.set(_intersection.x,_intersection.y,0);
					_object.name = "edge";
				}
			}
			if ( _intersections.length > 0 )
			{
				_domElement.style.cursor = 'move';
				scope.dispatchEvent( { type: 'dragstart', object: _object } );
			}
		}
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

	function onMouseCancel( event )
	{
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		const intersects = _raycaster.intersectObjects(vertexgroup.children);
		if ( _object ) {
		scope.dispatchEvent( { type: 'dragend', object: _object } );
		if(intersects.length==0)
		{
			const cgeometry = new CircleGeometry( 0.07, 12 );
			const cmaterial = new MeshBasicMaterial( { color: 0x000000 } );
			const circle = new Mesh( cgeometry, cmaterial );
			vertexgroup.add( circle );
			circle.position.set(endPosition.x, endPosition.y,4);
			circle.name = "vertex";
			_object.userData.vertex.push(circle);
			circle.userData.edges=[_object];
		}
		else
		{
			_object.userData.vertex.push(intersects[0].object);
			intersects[0].object.userData.edges.push(_object);
				endPosition.x = intersects[0].object.position.x;
				endPosition.y = intersects[0].object.position.y;
				endPosition.z = 0;
				_object.position.copy( new Vector3().addVectors(endPosition,startPosition).divideScalar(2));
				//_object.lookAt(endPosition.x,endPosition.y,endPosition.z);
				myLookAt(_object, endPosition);
				_object.scale.set(endPosition.distanceTo(startPosition),_object.scale.y,_object.scale.z);
		}
		_object = null;
		}
		_domElement.style.cursor = _hovered ? 'pointer' : 'auto';
	}
	
	function myLookAt(object, target)
	{
		var difference = new Vector3().subVectors(target, object.position,);
		var rotZ = Math.atan2(difference.y, difference.x);
		object.rotation.set(0,0,rotZ);
	}
	
	
/*
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
		 _raycaster.intersectObjects( _objects, true, _intersections );

		if ( _intersections.length > 0 ) {

			_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;

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
*/
	activate();
	


	// API
	this.enabled = true;
	this.transformGroup = false;
	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;
	this.createCube = createCube;
	this.switchState = switchState;
	this.active = active;

};

WallBuild.prototype = Object.create( EventDispatcher.prototype );
WallBuild.prototype.constructor = WallBuild;

export { WallBuild };