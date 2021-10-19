import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	BufferGeometry,
	MeshStandardMaterial,
	Mesh,
	CircleGeometry,
	MeshBasicMaterial
} from '../three.module.js';
import { GLTFLoader } from '../loaders/GLTFLoader.js';
import {BufferGeometryUtils} from '../utils/BufferGeometryUtils.js';


var Configurator = function ( _group,  _camera, _domElement,_container2d, app ) {//_scene, 
	//

	var scope = this;
	var meshes=[];
	var sprites=[];
	var renderedsprite = null;
	
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
	
	
	function testCreateMesh(insertedGroup)
	{
	var materials = [],
	geometries = [],
	mergedGeometry = new BufferGeometry(),
	meshMaterial,
	mergedMesh;
	insertedGroup.forEach(function(object){
		if(object.children.length>0)
		{
			object.children.forEach(function(mesh,index){
				mesh.updateMatrix();
				geometries.push(mesh.geometry.clone().applyMatrix4(mesh.matrixWorld));
				meshMaterial = new MeshStandardMaterial(mesh.material);
				materials.push(meshMaterial);
				console.log(meshMaterial);
			});
		}
		else
		{
			object.updateMatrix();
			geometries.push(object.geometry.clone().applyMatrix4(object.matrixWorld));
			meshMaterial = new MeshStandardMaterial(object.material);
			materials.push(meshMaterial);
			console.log(meshMaterial);
		}
		});
	mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, true);
	mergedGeometry.groupsNeedUpdate = true;
	mergedMesh = new Mesh(mergedGeometry, materials);
	mergedMesh.rotation.x=Math.PI/2;
	mergedMesh.geometry.computeBoundingBox();
	
			var geometry = new CircleGeometry(0.1,12);
			var material = new MeshBasicMaterial( { color: 0x00ffff } );
			var mesh = new Mesh(geometry,material);
			mesh.rotation.x=-Math.PI/2;
			mergedMesh.add(mesh);
			mesh.position.set(mergedMesh.geometry.boundingBox.min.x,0,mergedMesh.geometry.boundingBox.min.z);
			mesh.visible = false;
			
			var mesh = mesh.clone();
			mesh.position.set(mergedMesh.geometry.boundingBox.max.x,0,mergedMesh.geometry.boundingBox.max.z);
			mergedMesh.add(mesh);

			var mesh = mesh.clone();
			mesh.position.set(mergedMesh.geometry.boundingBox.min.x,0,mergedMesh.geometry.boundingBox.max.z);
			mergedMesh.add(mesh);
			
			var mesh = mesh.clone();
			mesh.position.set(mergedMesh.geometry.boundingBox.max.x,0,mergedMesh.geometry.boundingBox.min.z);
			mergedMesh.add(mesh);
	
	return mergedMesh;
	}
	
	
	function preloadMeshes(id)
	{
		console.log("Preloading "+id);
		meshes=[];
		switch(id)
		{
			// 5: testPreloadBread(); break;
			//case 2: preloadPolka(); break;
			//case 4: testPreloadRack(); break;
			case 4: testPreloadPostBox(); break;
			case 7: testPreloadBanch(); break;
			case 5: testPreloadPlant(); break;
		}
	}
	
	
	function testPreloadRack()
	{
		var mesh1;
		const loader = new GLTFLoader();
			loader.load(
			'../../sprites/configurator/2/'+'Bottom_connector'+'.glb',


			'../../sprites/configurator/2/'+'Bottom_connector'+'.glb',


			function( gltf)
			{
				mesh1 = gltf.scene.children[0];	
				meshes.push(mesh1);
		var mesh2;
			loader.load(
			'../../sprites/configurator/2/'+'Bottom_shelf'+'.glb',
			function( gltf)
			{
				mesh2 = gltf.scene.children[0];	
				meshes.push(mesh2);
		var mesh3;
			loader.load(
			'../../sprites/configurator/2/'+'Main_connector'+'.glb',
			function( gltf)
			{
				mesh3 = gltf.scene.children[0];	
				meshes.push(mesh3);
		var mesh4;
			loader.load(
			'../../sprites/configurator/2/'+'Shelf'+'.glb',
			function( gltf)
			{
				mesh4 = gltf.scene.children[0];	
				meshes.push(mesh4);
		var mesh5;
			loader.load(
			'../../sprites/configurator/2/'+'Wall'+'.glb',
			function( gltf)
			{
				mesh5 = gltf.scene.children[0];	
				meshes.push(mesh5);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}

	
	function preloadPolka()
	{
		var mesh1;
		const loader = new GLTFLoader();
			loader.load(
			'../../sprites/configurator/3/'+'polka'+'.glb',
			function( gltf)
			{
				mesh1 = gltf.scene.children[0];
				if(mesh1.children.length>0)
				{
					mesh1 = createMesh(mesh1.children);
				}		
				meshes.push(mesh1);
		var mesh2;
			loader.load(
			'../../sprites/configurator/3/'+'stolbik'+'.glb',
			function( gltf)
			{
				mesh2 = gltf.scene.children[0];
				if(mesh2.children.length>0)
				{
					mesh2 = createMesh(mesh2.children);
				}		
				meshes.push(mesh2);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}


	
	function spawnPolkaNew(quantity)
	{
		var delta_h = 0.8/quantity;
		for(var cnt = 0; cnt<quantity; cnt++)
		{
			var polka = meshes[0].clone();
			polka.position.y = polka.position.y+delta_h*cnt;
			_group.add(polka);
		}
	}
	
	function spawnStolbikNew(param)
	{
		var mesh = meshes[1].clone();
		var smesh = mesh.clone();
		_group.remove(..._group.children);
		_group.add(mesh)
		_group.add(smesh);
		smesh.position.z = -0.5;
	}
	
	
	function testPreloadBread()
	{
		var mesh1;
		const loader = new GLTFLoader();
			loader.load(
			'../../sprites/configurator/1/'+'End_connector'+'.glb',
			function( gltf)
			{
				mesh1 = gltf.scene.children[0];	
				meshes.push(mesh1);
		var mesh2;
			loader.load(
			'../../sprites/configurator/1/'+'Mian_shelf'+'.glb',
			function( gltf)
			{
				mesh2 = gltf.scene.children[0];
				meshes.push(mesh2);
		var mesh3;
			loader.load(
			'../../sprites/configurator/1/'+'Middle_connector'+'.glb',
			function( gltf)
			{
				mesh3 = gltf.scene.children[0];
				meshes.push(mesh3);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}
	
	function testPreloadPostBox()
	{
		var mesh1;
		const loader = new GLTFLoader();
			loader.load(
			'../../sprites/configurator/4/'+'1'+'.glb',
			function( gltf)
			{
				mesh1 = gltf.scene.children[0];	
				meshes.push(mesh1);
				//console.log(mesh1.children[0].material);
		var mesh2;
			loader.load(
			'../../sprites/configurator/4/'+'2'+'.glb',
			function( gltf)
			{
				mesh2 = gltf.scene.children[0];	
				meshes.push(mesh2);
		var mesh3;
			loader.load(
			'../../sprites/configurator/4/'+'3'+'.glb',
			function( gltf)
			{
				mesh3 = gltf.scene.children[0];	
				meshes.push(mesh3);
		var mesh4;
			loader.load(
			'../../sprites/configurator/4/'+'4'+'.glb',
			function( gltf)
			{
				mesh4 = gltf.scene.children[0];	
				meshes.push(mesh4);
		var mesh5;
			loader.load(
			'../../sprites/configurator/4/'+'5'+'.glb',
			function( gltf)
			{
				mesh5 = gltf.scene.children[0];	
				meshes.push(mesh5);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}
	
	
	function testPreloadBanch()
	{
		var mesh1;
		const loader = new GLTFLoader();
			loader.load(
			'../../sprites/configurator/5/'+'1'+'.glb',
			function( gltf)
			{
				mesh1 = gltf.scene.children[0];	
				meshes.push(mesh1);
				//sprites.push(app.loader.resources.c5_1.texture);
		var mesh2;
			loader.load(
			'../../sprites/configurator/5/'+'2'+'.glb',
			function( gltf)
			{
				mesh2 = gltf.scene.children[0];
				meshes.push(mesh2);
				//sprites.push(app.loader.resources.c5_2.texture);
		var mesh3;
			loader.load(
			'../../sprites/configurator/5/'+'3'+'.glb',
			function( gltf)
			{
				mesh3 = gltf.scene.children[0];
				meshes.push(mesh3);
				//sprites.push(app.loader.resources.c5_3.texture);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}
	
	
	
	function testPreloadPlant()
	{
		var mesh1;
		const loader = new GLTFLoader();
			loader.load(
			'../../sprites/configurator/6/'+'1'+'.glb',
			function( gltf)
			{
				mesh1 = gltf.scene.children[0];	
				meshes.push(mesh1);
		var mesh2;
			loader.load(
			'../../sprites/configurator/6/'+'2'+'.glb',
			function( gltf)
			{
				mesh2 = gltf.scene.children[0];
				meshes.push(mesh2);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			}
			);
	}
	
	
	function configurateBread(repeats)
	{
		var times;
		var mesh = meshes[0].clone();
		_group.add(mesh)
		for(var cnt=0; cnt<repeats; cnt++)
		{
			var mesh = meshes[1].clone();
			_group.add(mesh);
			mesh.translateX(-cnt*0.8);
			if(repeats>1 && cnt!=repeats-1)
			{
				var mesh = meshes[2].clone();
				_group.add(mesh)	
				mesh.translateX(-cnt*0.8);
			}
			times = -cnt;
		}
		var mesh = meshes[0].clone();
		_group.add(mesh);
		mesh.rotation.y = Math.PI;
		mesh.translateX(-times*0.8);
		_group.children.forEach( item => {item.position.x-=times*0.8/2;});
		_camera.position.z = 4;
		_camera.position.y = 1;
	}
	
	
	
	function configuratePolka(polki)
	{
		spawnStolbikNew(1);
		spawnPolkaNew(polki);
	}
	
	function configurateRack(mirror, repeats)
	{
		var times;
		for(var cnt=0; cnt<repeats; cnt++)
		{
			var m_mesh = meshes[0].clone();
			_group.add(m_mesh);
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[1].clone();
			_group.add(m_mesh);
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[2].clone();
			_group.add(m_mesh);
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[3].clone();
			_group.add(m_mesh);
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[4].clone();
			_group.add(m_mesh);
			m_mesh.translateZ(cnt);
			if(mirror==true)
			{
			var m_mesh = meshes[0].clone();
			_group.add(m_mesh);
			m_mesh.scale.x*=-1;
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[1].clone();
			_group.add(m_mesh);
			m_mesh.scale.x*=-1;
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[3].clone();
			_group.add(m_mesh);
			m_mesh.scale.x*=-1;
			m_mesh.translateZ(cnt);
			var m_mesh = meshes[4].clone();
			_group.add(m_mesh);
			m_mesh.scale.x*=-1;
			m_mesh.translateZ(cnt);
			}
			times = cnt;
		}
		var mesh = meshes[0].clone();
		mesh.translateZ(times+1);
		_group.add(mesh);
		if(mirror==true)
		{
		var mesh = meshes[0].clone();
		mesh.translateZ(times+1);
		_group.add(mesh);
		mesh.scale.x*=-1;
		}
		var mesh = meshes[2].clone();
		mesh.translateZ(times+1);
		_group.add(mesh);
		_group.children.forEach( item => {item.position.z-=times/2;});
	}
		
		
	function formPostBoxItemsArray()
	{
		return $('#postbox_controlset .slick-current').map(function(){return (+$(this).attr('data-slick-index'))+1;}).get();

	}

	function getPostCoef(id)
	{
		switch(id)
		{
			case 1: return 0.699;
			case 2: return 0.49;
			case 3: return 0.49;
			case 4: return 0.49;
			case 9: return 0.0265;
		}
	}


	function configuratePostBox()
	{		
		var dist=0;
		var seq = formPostBoxItemsArray();
		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			_group.add(mesh);
			var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;

			mesh.translateX(getPostCoef(+seq[i])/2+dist);
			dist += getPostCoef(+seq[i]);
		}
		console.log(_group.children);

		console.log(_camera.position);
		_group.children.forEach( item => {item.position.x-=dist/2;});

		_group.children.forEach( item => {console.log(item.position);});
	}	



	function formBanchItemsArray()
	{
		return  $('#postbox_controlset .slick-current').map(function(){return (+$(this).attr('data-slick-index'))+1;}).get();
	}

	function getBanchCoef(id)
	{
		switch(id)
		{
			case 1: return 0.5;
			case 2: return 0.5;
			case 3: return 0.2;
		}
	}


	function configurateBanch()
	{		
		renderedsprite = new PIXI.Container();

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);


		var dist=0;
		var seq = formBanchItemsArray();
		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			var sprite = new PIXI.Sprite.from("sprites/configurator/5/"+seq[i]+".svg");
			_group.add(mesh);
			renderedsprite.addChild(sprite);

			var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[1].material.color.r = colors[0]/255;
			mesh.children[1].material.color.g = colors[1]/255;
			mesh.children[1].material.color.b = colors[2]/255;
						
			mesh.translateX(getBanchCoef(+seq[i])/2+dist);
			sprite.anchor.set(0.5);
			sprite.x+=(getBanchCoef(+seq[i])*32+dist*64)
			dist += getBanchCoef(+seq[i]);
		}
		//console.log(_group.children);
		_group.children.forEach( item => {item.position.x-=dist/2;});
		renderedsprite.children.forEach(item=>item.position.x-=dist*32);
		_camera.position.z = 5;
		_camera.position.y = 1.2;
		renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -16;
		renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -16;
		renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 16;
		renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 16;

		//_group.children.forEach( item => {console.log(item.position);});
	}	



	function formPlantItemsArray()
	{
		return $('#postbox_controlset .slick-current').map(function(){return (+$(this).attr('data-slick-index'))+1;}).get();
	}

	function getPlantCoef(id)
	{
		return 0.5;
	}


	function configuratePlant()
	{		
		var dist=0;
		var seq = formPlantItemsArray();
		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			_group.add(mesh);

			var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[1].material.color.r = colors[0]/255;
			mesh.children[1].material.color.g = colors[1]/255;
			mesh.children[1].material.color.b = colors[2]/255;
						
			mesh.translateX(getPlantCoef(+seq[i])/2+dist);
			dist += getPlantCoef(+seq[i]);
		}
		console.log(_group.children);
		_group.children.forEach( item => {item.position.x-=dist/2;});
		_camera.position.z = 5;
		_camera.position.y = 1.2;
		_group.children.forEach( item => {console.log(item.position);});
	}	

		
	function configurateItem(id, height, width, polki)
	{
		_group.remove(..._group.children);
		switch(id)
		{
			//case 5: configurateBread(width); break;
			//case 2: configuratePolka(polki); break;
			//case 4: configurateRack(1,width); break;
			case 4: configuratePostBox(); break;
			case 7: configurateBanch(); break;
			case 5: configuratePlant(); break;
		}
	}
	
	function spawnConfigurated()
	{
		if(_group.children.length>0)
		//_scene.add(testCreateMesh(_group.children));
	formPostBoxItemsArray();
	console.log("create");
	_container2d.addChild(renderedsprite);
	renderedsprite.interactive = true;
	renderedsprite.buttonMode = true;
	function onDragStart(event)
	{
		//selectedItem = this;  
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;
	}
	
	function onDragEnd()
	{   
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
	
	}
	function onDragMove()
	{
		if (this.dragging)
		{
			const newPosition = this.data.getLocalPosition(this.parent);
			this.x = newPosition.x;
			this.y = newPosition.y;
			/*if ($("#stickmod").css("background-color")=="rgb(147, 210, 255)")
			{
			var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
			stickToItem(closestpoint);
			}*/
		}
	}
	renderedsprite
			.on('pointerdown', onDragStart)
			.on('pointerup', onDragEnd)
			.on('pointerupoutside', onDragEnd)
			.on('pointermove', onDragMove)
			.on('pointerover',filterOn)
			.on('pointerout',filterOff);
	}

	this.configurateItem = configurateItem;
	this.preloadMeshes = preloadMeshes;
	this.spawnConfigurated = spawnConfigurated;
	//this.prFromOneFile = prFromOneFile;

};

Configurator.prototype = Object.create( EventDispatcher.prototype );
Configurator.prototype.constructor = Configurator;

export { Configurator };

const outlineFilterBlue = new PIXI.filters.OutlineFilter(10, 0x99ff99);
const outlineFilterRed = new PIXI.filters.OutlineFilter(10, 0xff0099);



function filterOn() {
    this.filters = [outlineFilterBlue];
}

function filterOff() {
    this.filters = [];
}

	/*
	function prFromOneFile()
	{
		const loader = new GLTFLoader();
		
			loader.load(
				'../../sprites/configurator/3/'+'polkastolbik'+'.glb',
				function(gltf){
					console.log(gltf.scene.children.length);
					_scene.add(gltf.scene.children[0],gltf.scene.children[1]);
					//var mesh = gltf.scene.children[0];
					//meshes.push(mesh);
				},
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
				});
	}*/