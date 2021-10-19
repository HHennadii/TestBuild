import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	MeshBasicMaterial,
	BackSide,
	Mesh,
	CircleGeometry
} from '../../../build/three.module.js';


var DragItems = function ( _objects, _camera, _domElement, outlinePass, scene ) {

	var _plane = new Plane();
	var _raycaster = new Raycaster();

	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];

	var _selected = null, _hovered = null;
	
	
	var current = null;
	var menuDiv = null;

	//

	var scope = this;


	var x_pos = document.getElementById("x_pos");
	var y_pos = document.getElementById("y_pos");
	
	var scroll = document.getElementById("rotid");
	var valscroll = document.getElementById("valrotid");
	
	var remove = document.getElementById("remove");
	
	
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

		return _objects.children;

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

		if ( _selected && scope.enabled ) {

			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
				
				var closestpoint = findClosestPoint(_selected,findObjectsInRange(_selected));
				if(closestpoint[1])
				{
					if( _intersection.distanceTo(closestpoint[1])>1)
					{
						_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );
					}
					else
					{
						stickToItem(closestpoint);
					}
				}
				else
				_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

				x_pos.value = _selected.position.x;
				y_pos.value = _selected.position.y;
				valscroll.value = _selected.rotation.z*180/Math.PI;
			}
			scope.dispatchEvent( { type: 'drag', object: _selected } );
			return;
		}
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( _objects.children, true, _intersections );
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
	

	
	function findObjectsInRange(item)
	{
		var objectsInRange = [];
		_objects.children.forEach(element => {
			if(element!=item)
			{
				if(item.position.distanceTo(element.position)<11) objectsInRange.push(element);
				element.updateMatrix();
				element.updateMatrixWorld();
			}
		});
		return objectsInRange;
	}

	function findClosestPoint(selecteditem, rangeitemsarray)
	{
		var selectedpoints = selecteditem.children;
		var _distance = 5000;
		var selectedpoint;
		var closestpoint;
		for(var i = 0; i<rangeitemsarray.length; i++)
			for(var j = 0; j<4; j++)
				for(var k = 0; k<4; k++)
				{
					selectedpoints[j].updateMatrixWorld();
					selectedpoints[j].updateMatrix();
					rangeitemsarray[i].children[k].updateMatrixWorld();
					rangeitemsarray[i].children[k].updateMatrix();
					var firstpos = selecteditem.localToWorld(selectedpoints[j].position.clone());
					var secpos = rangeitemsarray[i].localToWorld(rangeitemsarray[i].children[k].position.clone());
					var distance = firstpos.distanceTo(secpos);
					if(distance<_distance)
					{
						_distance = distance;
						selectedpoint = selectedpoints[j];
						closestpoint = rangeitemsarray[i].localToWorld(rangeitemsarray[i].children[k].position.clone());
					}
				}
		return [selectedpoint, closestpoint, _distance];
	}

	function stickToItem(closestpointsarr)
	{
		_selected.updateMatrixWorld();
		_selected.updateMatrix();
		if(closestpointsarr[2]<1)
		{
			var offset = _selected.localToWorld(closestpointsarr[0].position.clone());
			offset.sub(_selected.position);
			_selected.position.copy(closestpointsarr[1].clone().sub(offset));
			_selected.position.z = 0;
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


	function onMouseDown( event ) {
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( _objects.children, true, _intersections );
		outlinePass.selectedObjects = [];
		if ( _intersections.length > 0 ) {
			//_selected = ( scope.transformGroup === true ) ? _objects.children[ 0 ] : _intersections[ 0 ].object;
			if(scope.transformGroup === true)
			{
				if(_intersections[0].object.parent == _objects)
				{
					_selected = _intersections[0].object;
					//console.log("Object or Object with children");
				}
				else
				{
					_selected = _intersections[0].object.parent;
					//console.log("Object's child");
				}
			}
			
			current = _selected;
			outlinePass.selectedObjects = [current];

			x_pos.value = current.position.x;
			y_pos.value = current.position.y;
			valscroll.value = current.rotation.z*180/Math.PI;
			document.getElementById("text").innerText = current.name;
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
				_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
				_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );
			}
			_domElement.style.cursor = 'move';
			scope.dispatchEvent( { type: 'dragstart', object: _selected } );
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
		 _raycaster.intersectObjects( _objects.children, true, _intersections );
		if ( _intersections.length > 0 ) {
			_selected = ( scope.transformGroup === true ) ? _objects.children[ 0 ] : _intersections[ 0 ].object;
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
	
	scroll.addEventListener( 'input', ()=>{
		valscroll.value=scroll.value;
		current.rotation.y = +valscroll.value/180*Math.PI;
	});
	valscroll.addEventListener( 'input', ()=>{
		scroll.value=valscroll.value;
		current.rotation.y = +valscroll.value/180*Math.PI;
	});
	
	x_pos.addEventListener('input',()=>{current.position.x = x_pos.value;});
	y_pos.addEventListener('input',()=>{current.position.y = y_pos.value;});
	
	remove.addEventListener('click', ()=>{
		current.parent.remove(current);
	});
	
	activate();

	// API
	this.enabled = true;
	this.transformGroup = true;
	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;

};

DragItems.prototype = Object.create( EventDispatcher.prototype );
DragItems.prototype.constructor = DragItems;

export { DragItems };
