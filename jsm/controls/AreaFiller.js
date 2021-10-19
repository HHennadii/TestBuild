import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	
	BoxGeometry,
	MeshBasicMaterial,
	Mesh
} from '../../../build/three.module.js';
import {ShapeUtils} from '../../../src/extras/ShapeUtils.js';

var AreaFiller = function ( _shopitems, _floor, _camera, _domElement ) {

	var _plane = new Plane();
	var _raycaster = new Raycaster();

	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];

	var _selected = null, _hovered = null;

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

		return _floor;

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
		_raycaster.intersectObjects( _floor, true, _intersections );

		if ( _intersections.length > 0 ) {

			var object = _intersections[ 0 ].object;

			_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );

			if ( _hovered !== object ) {

				scope.dispatchEvent( { type: 'hoveron', object: object } );

				_domElement.style.cursor = 'pointer';
				_hovered = object;

			}

		} else {

			if ( _hovered !== null ) {

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

			// TODO touch

		}

	}

	function onMouseDown( event )
	{
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( _floor, true, _intersections );
		if ( _intersections.length > 0 )
		{
			_selected = ( scope.transformGroup === true ) ? _floor[ 0 ] : _intersections[ 0 ].object;
			_selected.material.transparent = true;
			_selected.material.opacity = 0.5;
			fillArea(_selected);
/*			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

				_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
				_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

			}
			_domElement.style.cursor = 'move';
			scope.dispatchEvent( { type: 'dragstart', object: _selected } );*/
		}
	}
	
	
	function getVertices(floorMesh)
	{
		var vertices=[];
		var pos = floorMesh.geometry.attributes.position;
		for(var i = 0; i<pos.count; i++)
		{
			vertices.push(new Vector2(pos.getX(i), pos.getY(i)));
		}
		return vertices;
	}
	
	function fillWall(vertices)
	{
		for(var cnt = 0; cnt<vertices.length; cnt++)
		{
			var wallLength = vertices[cnt].distanceTo(vertices[(cnt+1)%vertices.length]);
			var itemLength = 1;
			
			var k = Math.floor(wallLength/itemLength);
			
			var difference = new Vector2().subVectors(vertices[(cnt+1)%vertices.length],vertices[cnt]);
			var rotZ = Math.atan2(difference.y, difference.x);
			
			var firstPos = difference.clone().normalize();
			
			var _direction = firstPos.clone();
			
			firstPos.add(vertices[cnt]);		
			
			for(var i = 0; i < k; i++)
			{
			var geometry = new BoxGeometry( 1,1,1 );
			var material = new MeshBasicMaterial( { color: 0x000000 } );
			var mesh = new Mesh(geometry,material);
			_shopitems.add(mesh);
			mesh.position.set(firstPos.x,firstPos.y,0);
			mesh.rotation.set(0,0,rotZ);
			firstPos.add(_direction);
			}
		}
	}
	
	
	

	function fillArea(floorAreaMesh)
	{
		fillWall(getVertices(floorAreaMesh));
		//getVertices(floorAreaMesh);
		//alert(floorAreaMesh.geometry.attributes.position.count);
		//alert(floorAreaMesh.userData.Area);
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
		 _raycaster.intersectObjects( _floor, true, _intersections );

		if ( _intersections.length > 0 ) {

			_selected = ( scope.transformGroup === true ) ? _floor[ 0 ] : _intersections[ 0 ].object;

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

	activate();

	// API

	this.enabled = true;
	this.transformGroup = false;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;

};

AreaFiller.prototype = Object.create( EventDispatcher.prototype );
AreaFiller.prototype.constructor = AreaFiller;

export { AreaFiller };
