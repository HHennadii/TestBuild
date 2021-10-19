import {
	EventDispatcher,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	MeshBasicMaterial,
	Mesh,
	PlaneGeometry,
	TextureLoader,
	RepeatWrapping
} from '../../../build/three.module.js';

var RulerTool = function (_scene, _camera, _domElement ) {

	var _plane = new Plane(new Vector3(0,0,1));
	var _raycaster = new Raycaster();

	var _mouse = new Vector2();
	var _intersection = new Vector3();
	
	var startPosition = new Vector2();
	var endPosition = new Vector2();
	var ruler;
	
	var loader = new TextureLoader();
    loader.setCrossOrigin("");
    var texture = loader.load('../../../build/project0209/textures/Ruler.jpg');
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1,1);

    var material = new MeshBasicMaterial( { map: texture } );

	var scope = this;

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


	function onPointerMove( event )
	{
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
		var hWidth = rect.width/2, hHeight = rect.height/2;
		_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
		_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
		_raycaster.setFromCamera( _mouse, _camera );
		if(_raycaster.ray.intersectPlane(_plane, _intersection) && ruler)
		{
			endPosition = _intersection;
			endPosition.z = 0;
			ruler.position.copy( new Vector3().addVectors(endPosition,startPosition).divideScalar(2));
			ruler.position.z = 25;
			myLookAt(ruler, endPosition);
			ruler.scale.set(endPosition.distanceTo(startPosition),ruler.scale.y,ruler.scale.z);
			texture.repeat.set(endPosition.distanceTo(startPosition),1);
			var pos = endPosition.clone();
			pos.project(_camera);
			pos.x = (pos.x*hWidth)+hWidth;
			pos.y = -(pos.y*hHeight)+hHeight;
			moveLengthDiv(pos.x+100,pos.y-100,startPosition.distanceTo(endPosition));
		}
	}
	
	
	function showLengthDiv(x,y)
	{
		var lengthDiv = document.createElement("div");
		lengthDiv.id = "rulerlength";
		lengthDiv.style.position = "absolute";
		lengthDiv.style.background = "black";
		lengthDiv.style.top = y+'px';
		lengthDiv.style.left = x+'px';
		lengthDiv.innerText = "test";
		document.getElementById("Canvas3d").appendChild(lengthDiv);
	}
	
	function moveLengthDiv(x,y, length)
	{
		var lengthDiv = document.getElementById("rulerlength");
		if(lengthDiv)
		{
		lengthDiv.style.top = y+'px';
		lengthDiv.style.left = x+'px';
		lengthDiv.innerText = length;
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
		if(event.button == 0 && scope.enabled)
		{
			event.preventDefault();
			_raycaster.setFromCamera( _mouse, _camera );
			_raycaster.ray.intersectPlane(_plane, _intersection);
			if(_intersection)
			{
				startPosition.copy(_intersection);
				startPosition.z=0;
				const geometry = new PlaneGeometry( 1, 1 );
				ruler = new Mesh ( geometry, material );
				ruler.position.set( startPosition.x, startPosition.y, 25 );
				ruler.scale.set(0,ruler.scale.y,ruler.scale.z);
				_scene.add(ruler);
			var rect = _domElement.getBoundingClientRect();
			var hWidth = rect.width/2, hHeight = rect.height/2;
			var pos = ruler.position.clone();
			pos.project(_camera);
			pos.x = (pos.x*hWidth)+hWidth;
			pos.y = -(pos.y*hHeight)+hHeight;
			showLengthDiv(pos.x+40,pos.y-40);
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
		}
	}

	function onMouseCancel( event ) {
		event.preventDefault();
		if(ruler)
		{
		_scene.remove(ruler);
		ruler = null;
		document.getElementById("rulerlength").remove();
		}
	}

	function myLookAt(object, target)
	{
		var difference = new Vector3().subVectors(target, object.position,);
		var rotZ = Math.atan2(difference.y, difference.x);
		object.rotation.set(0,0,rotZ);
	}
	
	activate();

	this.enabled = true;
	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;

};

RulerTool.prototype = Object.create( EventDispatcher.prototype );
RulerTool.prototype.constructor = RulerTool;

export { RulerTool };