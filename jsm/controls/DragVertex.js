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
	CircleGeometry,
	Shape,
	ShapeGeometry,
	TextureLoader,
	RepeatWrapping
} from '../../../build/three.module.js';

import { OBJLoader } from '../loaders/OBJLoader.js';
import {ShapeUtils} from '../../../src/extras/ShapeUtils.js';



var DragVertex = function (  floorgroup, vertexgroup, edgegroup, _objects, _camera, _domElement ) {

	var _plane = new Plane();
	var _raycaster = new Raycaster();

	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];

	var _selected = null, _hovered = null;


	var objloader = new OBJLoader();
	var WallGeometry;
	objloader.load(
		'../../../build/project1908/musor/wall.obj',
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

	function activate()
	{
		_domElement.addEventListener( 'pointermove', onPointerMove );
		_domElement.addEventListener( 'pointerdown', onPointerDown );
		_domElement.addEventListener( 'pointerup', onPointerCancel );
		_domElement.addEventListener( 'pointerleave', onPointerCancel );
		_domElement.addEventListener( 'touchmove', onTouchMove );
		_domElement.addEventListener( 'touchstart', onTouchStart );
		_domElement.addEventListener( 'touchend', onTouchEnd );
	}

	function deactivate()
	{
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.removeEventListener( 'touchmove', onTouchMove );
		_domElement.removeEventListener( 'touchstart', onTouchStart );
		_domElement.removeEventListener( 'touchend', onTouchEnd );
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

	function onPointerMove( event )
	{
		event.preventDefault();
		switch ( event.pointerType )
		{
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
		if ( _selected && scope.enabled )
		{
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) )
			{
				_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );
				_selected.userData.edges.forEach(item => {adjust(item, item.userData.vertex[0].position, item.userData.vertex[1].position);});
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
				_hovered.material.color.r = 0.1;
				_hovered.material.color.g = 0.1;
				_hovered.material.color.b = 1;
				//_hovered.scale.set(
			}
		}
		else
		{
			if ( _hovered !== null )
			{
				scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );
				_domElement.style.cursor = 'auto';
				_hovered.material.color.r = 0;
				_hovered.material.color.g = 0;
				_hovered.material.color.b = 0;
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

	function onMouseDown( event )
	{
		event.preventDefault();
		_intersections.length = 0;
		_raycaster.setFromCamera( _mouse, _camera );
		_raycaster.intersectObjects( _objects, true, _intersections );
		if ( _intersections.length > 0 )
		{
			_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) )
			{
				_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
				_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );
			}
			_domElement.style.cursor = 'move';
			scope.dispatchEvent( { type: 'dragstart', object: _selected } );
		}
	}

	function adjust(edge, startPosition, endPosition)
	{
		edge.position.copy( new Vector3().addVectors(endPosition,startPosition).divideScalar(2));
		edge.position.z = 0;
		myLookAt(edge, endPosition);
		edge.scale.set(endPosition.distanceTo(startPosition),edge.scale.y,edge.scale.z);
	}
		
		
	function sortAdgesByAngle(vertex)
	{
		vertex.userData.edges.sort(function(a,b)
		{
			return calculateAngle(vertex, a)-calculateAngle(vertex,b);
		});
	}

	function calculateAngle(vertex, edge)
	{
		if(edge.userData.vertex[0]==vertex)
		{
			return edge.rotation.z;
		}
		else
		{
			if(edge.rotation.z>0) return edge.rotation.z - Math.PI;
			else return edge.rotation.z+Math.PI;
		}
	}

	function alignAdges(vertex, edge1, edge2)
	{
		edge1.updateMatrixWorld();
		edge2.updateMatrixWorld();
		edge1.updateMatrix();
		edge2.updateMatrix();
		
		//edge1.geometry.attributes.position.getY(i);
		
		if(edge1.userData.vertex[0]==vertex && edge2.userData.vertex[0]==vertex)
		{
			var y1 = edge1.geometry.attributes.position.getY(1);
			var one = new Vector3(-1, y1, 0);
			var three = new Vector3(1, y1,0);
			
			edge1.localToWorld(one);
			edge1.localToWorld(three);
			
			var y2 = edge2.geometry.attributes.position.getY(18);
			var four = new Vector3(-1, y2, 0);
			var five = new Vector3(1, y2,0);
			
			edge2.localToWorld(four);
			edge2.localToWorld(five);
			
			var intersection = checkLineIntersection(one.x, one.y, three.x, three.y, four.x, four.y, five.x, five.y);
			var intvector1 = new Vector3(intersection.x, intersection.y,0);
			var intvector2 = intvector1.clone();
			edge1.worldToLocal(intvector1);
			edge2.worldToLocal(intvector2);
			
			var pos = new Vector2(intersection.x, intersection.y);
			edge1.userData.one = pos;
			edge2.userData.four = pos;
			
			moveGeometryVertexes(edge1, 1, intvector1);
			moveGeometryVertexes(edge2, 4, intvector2);
			
			//move centers
			
		}
		
		if(edge1.userData.vertex[0]==vertex && edge2.userData.vertex[1]==vertex)
		{
			var y1 = edge1.geometry.attributes.position.getY(1);
			var one = new Vector3(-1, y1, 0);
			var three = new Vector3(1, y1,0);
			
			edge1.localToWorld(one);
			edge1.localToWorld(three);
			
			var y2 = edge2.geometry.attributes.position.getY(1);
			var oone = new Vector3(-1, y2, 0);
			var tthree = new Vector3(1, y2,0);
			
			edge2.localToWorld(oone);
			edge2.localToWorld(tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			var intvector1 = new Vector3(intersection.x, intersection.y,0);
			var intvector2 = intvector1.clone();
			edge1.worldToLocal(intvector1);
			edge2.worldToLocal(intvector2);
			
			var pos = new Vector2(intersection.x, intersection.y);
			edge1.userData.one = pos;
			edge2.userData.three = pos;
			
			moveGeometryVertexes(edge1, 1, intvector1);
			moveGeometryVertexes(edge2, 3, intvector2);
		}
		
		if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[0]==vertex)
		{
			var y1 = edge1.geometry.attributes.position.getY(18);
			var one = new Vector3(-1, y1, 0);
			var three = new Vector3(1, y1,0);

			edge1.localToWorld(one);
			edge1.localToWorld(three);
			
			var y2 = edge2.geometry.attributes.position.getY(18);
			var four = new Vector3(-1, -0.5, 0);
			var five = new Vector3(1, -0.5,0);

			edge2.localToWorld(four);
			edge2.localToWorld(five);
			
			var intersection = checkLineIntersection(one.x, one.y, three.x, three.y, four.x, four.y, five.x, five.y);
			var intvector1 = new Vector3(intersection.x, intersection.y,0);
			var intvector2 = intvector1.clone();
			edge1.worldToLocal(intvector1);
			edge2.worldToLocal(intvector2);
			
			
			var pos = new Vector2(intersection.x, intersection.y);
			edge1.userData.five = pos;
			edge2.userData.four = pos;
			
			moveGeometryVertexes(edge1, 5, intvector1);
			moveGeometryVertexes(edge2, 4, intvector2);
		}
		
		if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[1]==vertex)
		{
			var y1 = edge1.geometry.attributes.position.getY(18);
			var one = new Vector3(1, y1, 0);
			var three = new Vector3(-1, y1,0);
			edge1.localToWorld(one);
			edge1.localToWorld(three);

			var y2 = edge2.geometry.attributes.position.getY(1);
			var four = new Vector3(1, y2,0);
			var five = new Vector3(-1, y2,0);
			edge2.localToWorld(four);
			edge2.localToWorld(five);

			
			var intersection = checkLineIntersection(four.x, four.y, five.x, five.y, one.x, one.y, three.x, three.y);
			var intvector1 = new Vector3(intersection.x, intersection.y,0);
			var intvector2 = intvector1.clone();
			edge1.worldToLocal(intvector1);
			edge2.worldToLocal(intvector2);
			
			var pos = new Vector2(intersection.x, intersection.y);
			edge1.userData.five = pos;
			edge2.userData.three = pos;
			
			moveGeometryVertexes(edge1, 5, intvector1);
			moveGeometryVertexes(edge2, 3, intvector2);
		}
	}


	function moveGeometryVertexes(edge, vertnumber, coords)
	{
		var one = [1,2,4,14,16,25,26,28]
		var three = [7,8,10,13,24,27,29]
		var four = [18,21,23,35,42,45,47]
		var five = [19,20,22,30,33,36,39,41]
		//center
		var zero = [0,3,5,17,32,34,43,44,46]
		var two = [6,9,11,12,15,31,37,38,40]
		
		switch(vertnumber)
		{
			case 0:
				moveGeometryVertex(edge, zero, coords);
				break;
			case 1:
				moveGeometryVertex(edge, one, coords);
				break;
			case 2:
				moveGeometryVertex(edge, two, coords);
				break;
			case 3:
				moveGeometryVertex(edge, three, coords);
				break;
			case 4:
				moveGeometryVertex(edge, four, coords);
				break;
			case 5:
				moveGeometryVertex(edge, five, coords);
				break;
		}
		edge.geometry.attributes.position.needsUpdate = true;
	}

	function moveGeometryVertex(edge, indexes, coords)
	{
		indexes.forEach(id => {
			edge.geometry.attributes.position.setX(id, coords.x);
		});
	}

	function alignToNext(vertex)
	{
		if(vertex.userData.edges.length>1)
		{
			for(var i=0; i<vertex.userData.edges.length-1; i++)
			{
				alignAdges(vertex, vertex.userData.edges[i], vertex.userData.edges[i+1]);
			}
			alignAdges(vertex, vertex.userData.edges[vertex.userData.edges.length-1], vertex.userData.edges[0]);
		}
	}

	function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY)
	{
		var denominator, a, b, numerator1, numerator2, result = {
			x: null,
			y: null,
			onLine1: false,
			onLine2: false
		};
		denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
		if (denominator == 0)
		{
			return result;
		}
		a = line1StartY - line2StartY;
		b = line1StartX - line2StartX;
		numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
		numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
		a = numerator1 / denominator;
		b = numerator2 / denominator;

		result.x = line1StartX + (a * (line1EndX - line1StartX));
		result.y = line1StartY + (a * (line1EndY - line1StartY));
		if (a > 0 && a < 1)
		{
			result.onLine1 = true;
		}
		if (b > 0 && b < 1)
		{
			result.onLine2 = true;
		}
		return result;
	}


	function raycastRainByPoints(points)
	{
		const rc = new Raycaster();
		points.forEach(point =>
		{
			if(point)
			{
			var origin = new Vector3(point[0], point[1], 4);
			rc.set(origin, new Vector3(0,0,-1));
			const intersects = rc.intersectObjects(edgegroup.children);
			const cgeometry = new CircleGeometry( 0.07, 12 );
			const cmaterial = new MeshBasicMaterial( { color: 0x000000 } );
			const circle = new Mesh( cgeometry, cmaterial );
			vertexgroup.add( circle );
			circle.position.set(point[0], point[1], 4);
			var used = [];
			intersects.forEach(inter =>
			{
				if(!used.includes(inter.object))
				{
				var width = inter.object.scale.y;
				createWallBetween(inter.object.userData.vertex[0],circle,width);
				createWallBetween(inter.object.userData.vertex[1],circle,width);
				removeEdge(inter.object);
				used.push(inter.object);
				}
			});
			}
		});
	}


	function edgeIntersectionByVertex(vertex)
	{
		var points = [];
		vertex.userData.edges.forEach(edge =>
		{
			var skippededges = edge.userData.vertex[1]?edge.userData.vertex[0].userData.edges.concat(edge.userData.vertex[1].userData.edges):edge.userData.vertex[0].userData.edges;
			edgegroup.children.forEach(item =>
			{
				if(!skippededges.includes(item)) points.push(lineSegmentsIntersect(edge, item));
			});
		});		
		return points;
	}
		
	function lineSegmentsIntersect(edge1, edge2)
	{
		var x1 = edge1.userData.vertex[0].position.x;
		var y1 = edge1.userData.vertex[0].position.y;
		var x2 = edge1.userData.vertex[1].position.x;
		var y2 = edge1.userData.vertex[1].position.y;
		var x3 = edge2.userData.vertex[0].position.x;
		var y3 = edge2.userData.vertex[0].position.y;
		var x4 = edge2.userData.vertex[1].position.x;
		var y4 = edge2.userData.vertex[1].position.y;
		var a_dx = x2 - x1;
		var a_dy = y2 - y1;
		var b_dx = x4 - x3;
		var b_dy = y4 - y3;
		var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
		var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
		return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
	}

	function createWallBetween(vertex1, vertex2, width)
	{
		const geometry = WallGeometry.clone();
		const material = new MeshPhongMaterial({color: 0x676A72 , flatShading: true});
		const mesh = new Mesh(geometry, material);
		mesh.scale.set(1,0.5,3);
		mesh.position.copy( new Vector3().addVectors(vertex2.position,vertex1.position).divideScalar(2));
		mesh.position.z = 0;
		myLookAt(mesh, vertex2.position);
		//mesh.scale.set(vertex2.position.distanceTo(vertex1.position), mesh.scale.y, mesh.scale.z);
		mesh.scale.set(vertex2.position.distanceTo(vertex1.position), width, mesh.scale.z);
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

	function removeEdge(edge)
	{
		if(edge)
		{
			edge.userData.vertex.forEach(item => {
				if(item.userData.edges.length == 1) item.parent.remove(item);
				else
				{
					for( var i=0; i<item.userData.edges.length; i++)
					{
						if(item.userData.edges[i]==edge)
						{
							item.userData.edges.splice(i,1);
							break;
						}
					}
				}
				});
			edgegroup.remove(edge);
		}
	}
	
	

	function getTales()
	{
		var taleEdges=[];
		vertexgroup.children.forEach(vertex => {
			if(vertex.userData.edges.length==1 && !taleEdges.includes(vertex.userData.edges[0]))
			{
				var currentVertex = vertex;
				var currentEdge = vertex.userData.edges[0];
				var power = 1;
				while(power<3)
				{
					if(!taleEdges.includes(currentEdge))
					{
						taleEdges.push(currentEdge);
						currentVertex = nextVertex(currentVertex, currentEdge);
						power = currentVertex.userData.edges.length;
						if(power == 1) break;
						currentEdge = nextEdge(currentEdge, currentVertex);
					}
					else break;
				}
			}
		});
		return taleEdges;
	}

	function nextEdge(edge, vertex)
	{
		if(vertex.userData.edges[0] == edge) return vertex.userData.edges[1];
		else return vertex.userData.edges[0];
	}

	function nextVertex(vertex,edge)
	{
		if(edge.userData.vertex[0] == vertex) return edge.userData.vertex[1];
		else return edge.userData.vertex[0];
	}
		
	/*
		function sleep(milliseconds)
		{
		  const date = Date.now();
		  let currentDate = null;
		  do
		  {
			currentDate = Date.now();
		  } while (currentDate - date < milliseconds);
		}
	*/
		
	function generateFloor()
	{
		if(edgegroup.children.length!=0)
		{
			const texture = new TextureLoader().load( '../../../build/project1908/textures/floor.jpg' );
			texture.repeat.set(0.15,0.15);
			texture.wrapS = RepeatWrapping;
			texture.wrapT = RepeatWrapping;
			
			floorgroup.remove(...floorgroup.children);
			var tails = getTales();
			for(var i=0; i<1; i++)
			{
				if(!tails.includes(edgegroup.children[i]))
				{
					var path0 = [];
					var finished0 = false;
					var edge0 = edgegroup.children[i];
					var vertex0 = edge0.userData.vertex[0];
					while(!finished0)
					{
						if(!finished0)
						{
							vertex0 = nextVertex(vertex0, edge0);
							var points = getPoints(vertex0, edge0);
							edge0 = getNextEdge(vertex0, edge0, tails);
							
							if(points[1]==path0[0] && path0.length>2) finished0 = true;
							else
							{
							if(points[0]!=path0[path0.length-1]) path0.push(points[0],points[1]);
							else path0.push(points[1]);
							}
						}
					}
					var shape0 = new Shape(path0);
					var geometry = new ShapeGeometry(shape0);
					var material = new MeshBasicMaterial( { map: texture } );
					var mesh = new Mesh( geometry, material ) ;
					mesh.userData.Area = ShapeUtils.area(path0);
					floorgroup.add( mesh );
					mesh.position.z = 0.01;
					console.log(path0);
				}
			}
		}
	}
		
	function getNextEdge(vertex, edge, tails)
	{
		var idx = vertex.userData.edges.indexOf(edge);
		if(idx == vertex.userData.edges.length-1)
		{
			if(!tails.includes(vertex.userData.edges[0])) return vertex.userData.edges[0];
			else return getNextEdge(vertex, vertex.userData.edges[0], tails);
		}
		else
		{
			if(!tails.includes(vertex.userData.edges[idx+1])) return vertex.userData.edges[idx+1];
			else return getNextEdge(vertex, vertex.userData.edges[idx+1],tails);
		}
	}

	function getPoints(vertex, edge)
	{
		if(edge.userData.vertex[0] == vertex) return [edge.userData.three, edge.userData.one];
		else return [edge.userData.four, edge.userData.five];
	}
		
	function onPointerCancel( event )
	{
		event.preventDefault();
		switch ( event.pointerType )
		{
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
		if ( _selected )
		{
			scope.dispatchEvent( { type: 'dragend', object: _selected } );	
			raycastRainByPoints(edgeIntersectionByVertex(_selected));
			_selected = null;
		}
		if(scope.works)
		{
			vertexgroup.children.forEach(item =>
			{
				sortAdgesByAngle(item);
				alignToNext(item);
			});
			generateFloor();
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

	function myLookAt(object, target)
	{
		var difference = new Vector3().subVectors(target, object.position,);
		var rotZ = Math.atan2(difference.y, difference.x);
		object.rotation.set(0,0,rotZ);
	}


	activate();

	// API
	this.works = true;
	this.enabled = true;
	this.transformGroup = false;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;

};

DragVertex.prototype = Object.create( EventDispatcher.prototype );
DragVertex.prototype.constructor = DragVertex;

export { DragVertex };