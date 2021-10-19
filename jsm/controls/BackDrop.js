import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	MeshBasicMaterial,
	Mesh,
	CircleGeometry,
	TextureLoader,
	RepeatWrapping
} from '../../../build/three.module.js';


var BackDrop = function ( scene, bgelement, _camera, _domElement ) {

	var _plane = new Plane();
	var _raycaster = new Raycaster();

	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];

	var _selected = null, _hovered = null;

	var arr = [];

	//

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'pointermove', onPointerMove );
		_domElement.addEventListener( 'pointerdown', onPointerDown );
		_domElement.addEventListener( 'pointerup', onPointerCancel );
		_domElement.addEventListener( 'pointerleave', onPointerCancel );
	}

	function deactivate() {

		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.style.cursor = '';
	}

	function dispose() {

		deactivate();

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

	function onMouseMove( event )
{
		var rect = _domElement.getBoundingClientRect();
		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
		_raycaster.setFromCamera( _mouse, _camera );
		if ( _selected && scope.enabled )
		{
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) )
			{
				_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );
			}
			scope.dispatchEvent( { type: 'drag', object: _selected } );
			return;
		}
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( arr, true, _intersections );
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
		}
		else
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
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( arr, true, _intersections );
		if ( _intersections.length > 0 )
		{
			_selected = _intersections[ 0 ].object;
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) )
			{
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
		}
	}

	function onMouseCancel( event )
	{
		event.preventDefault();
		if ( _selected )
		{
			scope.dispatchEvent( { type: 'dragend', object: _selected } );
			_selected = null;
		}
		_domElement.style.cursor = _hovered ? 'pointer' : 'auto';
	}

	
function bpedit()
{	
	const cgeometry = new CircleGeometry( 0.25, 8 );
	const cmaterial = new MeshBasicMaterial( { color: 0x0044ff } );
	const circle1 = new Mesh( cgeometry, cmaterial );
	const circle2 = new Mesh( cgeometry, cmaterial );
	
	scene.add(circle1);
	scene.add(circle2);
	arr.push(circle1);
	arr.push(circle2);
	
	showContextMenu(500,500);
}
	
function showContextMenu(x,y)
{
	var menuDiv = document.createElement("div");
	menuDiv.id="lengthinp";
	menuDiv.style.position = "absolute";
	menuDiv.style.background = "red";
	menuDiv.style.top = y+'px';
	menuDiv.style.left = x+'px';
	
	var inp = document.createElement("input");
	inp.type = "text";
	inp.id = "realdistance";
	
	var but = document.createElement("input");
	but.type="button";
	but.value="Ok";
	but.addEventListener( 'click', bpscale );
	
	menuDiv.appendChild(inp);
	menuDiv.appendChild(but);

	document.body.appendChild(menuDiv);
}

function bpscale()
{
	var distance = arr[0].position.distanceTo(arr[1].position);
	var realdistance = document.getElementById("realdistance").value;
	var kp = realdistance/distance;
	alert(kp);
	arr[0].parent.remove(arr[0]);
	arr[1].parent.remove(arr[1]);
	arr=[];
	document.getElementById("lengthinp").remove();
	var object = scene.getObjectByName( "backdrop" );
	object.scale.set(object.scale.x*kp,object.scale.y*kp,object.scale.z*kp);
}



var scroll = document.getElementById("transbp");
scroll.addEventListener( 'input', activateScroll );
function activateScroll()
{
	var object = scene.getObjectByName( "backdrop" );
	object.material.opacity=1-scroll.value/360;
}

var scrollRot = document.getElementById("rotbp");
scrollRot.addEventListener( 'input', activateRot );
function activateRot()
{
	var object = scene.getObjectByName( "backdrop" );
	object.rotation.z=+scrollRot.value/180*Math.PI;
}


	activate();

	// API
	this.enabled = true;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	
	this.bpedit = bpedit;

};

BackDrop.prototype = Object.create( EventDispatcher.prototype );
BackDrop.prototype.constructor = BackDrop;

export { BackDrop };