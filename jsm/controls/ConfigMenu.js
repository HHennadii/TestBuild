import { OBJLoader } from '../loaders/OBJLoader.js';
import {CSG} from '../../../build/project1908/three-csg.js';

var ConfigMenu = function (scene, edgegroup, vertexgroup, _objects, _camera, _domElement ) {

	var menuDiv = null;	
	
	var objloader = new OBJLoader();

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




	function showContextMenu(x,y)
	{
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

ConfigMenu.prototype = Object.create( EventDispatcher.prototype );
ConfigMenu.prototype.constructor = ConfigMenu;

export { ConfigMenu };