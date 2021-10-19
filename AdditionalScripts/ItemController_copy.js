import * as THREE from '../jsm/three.module.js';
import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	BufferGeometry,
	MeshStandardMaterial,
	MeshPhongMaterial,
	Mesh,
	CircleGeometry,
	CylinderGeometry,
	MeshBasicMaterial,
	Shape,
	ShapeGeometry,
	TextureLoader,
	RepeatWrapping
} from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {BufferGeometryUtils} from '../jsm/utils/BufferGeometryUtils.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import { HDRCubeTextureLoader } from '../jsm/loaders/HDRCubeTextureLoader.js';
import { CameraControls } from './CameraControls.js';




var ItemController = function(container, _domElement, app)
{   
	
    app.loader.baseUrl = "svgs";
    app.loader
        //.add("Fridge","Fridge.svg")
        //.add("Dispenser","Dispenser.svg")
        //.add("Wheelrack","Wheelrack.svg") 
        .add("FreshBox","FreshBox.svg")
        .add("ZK","ZK.svg")
        .add("LOKO","LOKO.svg");
    app.loader.onComplete.add(doneLoading);
    app.loader.load();
    var menuDiv;
	var clickTimer = null;

    function doneLoading(e)
    {
        console.log("done loading");
    }

    function activate()
    {
        //_domElement.addEventListener( 'pointermove', onPointerMove );
    }

    function deactivate()
    {
    }

	function showContextMenu(x,y)
	{
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		var indiv = document.createElement("div");
		var indiv2 = document.createElement("div");
		var range = document.createElement("input");
		var but1 = document.createElement("button");
		var but3 = document.createElement("button");
		var img = document.createElement("img");
		var img1 = document.createElement("img");

		menuDiv.id="menu";
        menuDiv.setAttribute("class",  "objct_settings");
		menuDiv.style.position = "absolute";
		menuDiv.style.top = y+'px';
		menuDiv.style.left = x+30+'px';

		indiv.setAttribute("style",  "width: 100%; align-items: center; display: flex; justify-content: start;");
        indiv2.setAttribute("style",  "width: 100%; height: 60px; align-items: center; display: flex; justify-content: center;   background-color: #EDEDED;  border: 0.5px solid  black;");
		
        but1.setAttribute( 'class', "button_float" );
		but1.setAttribute( 'id', "remove" );
		but1.addEventListener( 'click', ()=>{
        container.removeChild(selectedItem);
		hideContextMenu(); 
    } );
		
        but3.setAttribute( 'class', "button_float" );
		but3.addEventListener( 'click', hideContextMenu );  
        
        img.setAttribute('class' , "bar-icon");
        img.setAttribute('src' , "./Icons/Bin.svg");
       
        img1.setAttribute('class' , "bar-icon");
        img1.setAttribute('src' , "./Icons/Cross.svg");

		range.setAttribute("class", "rotation custom-range");
		range.setAttribute("type","range");
		range.setAttribute("min","0");
		range.setAttribute("max","8");
		range.setAttribute("step","1");
		range.setAttribute("value","0");
		range.addEventListener( 'input', ()=>{
			selectedItem.rotation = (+range.value/180*Math.PI)*45;
		});

		menuDiv.appendChild(indiv);
		menuDiv.appendChild(indiv2);
		indiv2.appendChild(range);
		indiv.appendChild(but1);
		indiv.appendChild(but3);
        but3.appendChild(img1);
        but1.appendChild(img);

		document.body.appendChild(menuDiv);
	}

	function hideContextMenu()
	{
		document.getElementById("menu").remove();
	}



    function addItem(name)
    {
        function onDragStart(event)
        {
            document.getElementById("rulet").value = 0;
            selectedItem = this;  
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        }
        
        function onDragEnd()
        {   
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
			document.getElementById("rulet").value = 1;
        }
        
        function onDragMove()
        {
            if (this.dragging)
            {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                if ($("#stickmod").css("background-color")=="rgb(147, 210, 255)")
                {
                var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
                stickToItem(closestpoint);
                }
            }
        }

        let item;
        switch(name)
        {
            //case '1': item = PIXI.Sprite.from(app.loader.resources.Dispenser.texture); name = "Dispenser"; break;
            //case '2': item = PIXI.Sprite.from(app.loader.resources.Fridge.texture); name = "Fridge"; break;
            //case '4': item = PIXI.Sprite.from(app.loader.resources.Wheelrack.texture); name = "Wheelrack"; break;
            case '9': item = PIXI.Sprite.from(app.loader.resources.FreshBox.texture); name = "FreshBox"; break;
            case '10': item = PIXI.Sprite.from(app.loader.resources.ZK.texture); name = "ZK"; break;
            case '8': item = PIXI.Sprite.from(app.loader.resources.LOKO.texture); name = "LOKO"; break;
            default: return;
        }
        
        item.name = name;
        container.addChild(item);
        item.interactive = true;
        item.buttonMode = true;
        item.anchor.set(0.5);
        item
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove)
			.on('touchstart', onDragStart)
            .on('touchend', onDragEnd)
            .on('touchmove', onDragMove)
            .on('pointerover',filterOn)
            .on('pointerout',filterOff)
			.on('touchstart',function(event) {
                if (clickTimer == null) {
                    clickTimer = setTimeout(function () {
                    clickTimer = null;}, 500)
					console.log(clickTimer);
                } else {
					console.log(clickTimer);
                    clearTimeout(clickTimer);
                    clickTimer = null;
					console.log(clickTimer);
                    showContextMenu(event.data.global.x, event.data.global.y);
                }
             })
			.on('rightclick',function(event){
				showContextMenu(event.data.global.x, event.data.global.y);
            });
        //filterOff.call(item);
        item.x = 0; item.y = 0;

        var helper = new PIXI.Container();
        helper.x = item.texture.width/2;
        helper.y = item.texture.height/2;
        item.addChild(helper);

        var helper = new PIXI.Container();
        helper.x = -item.texture.width/2;
        helper.y = -item.texture.height/2;
        item.addChild(helper);

        var helper = new PIXI.Container();
        helper.x = -item.texture.width/2;
        helper.y = item.texture.height/2;
        item.addChild(helper);

        var helper = new PIXI.Container();
        helper.x = item.texture.width/2;
        helper.y = -item.texture.height/2;
        item.addChild(helper);

        return item;
    }

	function findObjectsInRange()
	{
        var objectsInRange = [];
        if(selectedItem)
        {
            container.children.forEach(element => {
                if(element!=selectedItem)
                {
                    if(distanceTo(selectedItem, element)<11) objectsInRange.push(element);
                }
            });
        }
        return objectsInRange;
	}


    function findClosestPoint(selecteditem, rangeitemsarray)
    {
        var selectedpoints = selecteditem.children;
        var _distance = 5000;
        var selectedpoint, closestpoint;
        for(var i = 0; i<rangeitemsarray.length; i++)
        {
            for(var j = 0; j<4; j++)
            {
                for(var k = 0; k<4; k++)
                {
                    var firstpos = localWorld(selectedpoints[j]);
                    var secpos = localWorld(rangeitemsarray[i].children[k]);
                    var distance = distanceTo(firstpos,secpos)*64;
                    if(distance<_distance)
                    {
                        _distance = distance;
                        selectedpoint = selectedpoints[j];
                        closestpoint = localWorld(rangeitemsarray[i].children[k]);
                    }
                }
            }
        }
        return [selectedpoint, closestpoint, _distance];
    }

	function stickToItem(closestpointsarr)
	{
		if(closestpointsarr[2]<1)
		{
            var clp = localWorld(closestpointsarr[0]);
            var clp2 = realPosition(selectedItem);
            var offset = {x: (clp.x-clp2.x)*64,y: (clp.y-clp2.y)*64};
            //console.log(closestpointsarr[1]);
            var newItemPosition = {x: closestpointsarr[1].x*64, y: closestpointsarr[1].y*64};
			selectedItem.x = newItemPosition.x; selectedItem.y = newItemPosition.y;
            selectedItem.x-=offset.x; selectedItem.y-=offset.y;
		}

	}

    activate();
    this.activate = activate;
    this.deactivate = deactivate;
    this.addItem = addItem;
    this.findObjectsInRange = findObjectsInRange;

	
	function localWorld(item)
	{
		var p = {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};
		return p;
	}
    

    
};

var selectedItem = null;

const outlineFilterBlue = new PIXI.filters.OutlineFilter(10, 0x99ff99);
const outlineFilterRed = new PIXI.filters.OutlineFilter(10, 0xff0099);

function filterOn() {
    this.filters = [outlineFilterBlue];
}

function filterOff() {
    this.filters = [];
}


var x_pos = document.getElementById("x_pos");
var y_pos = document.getElementById("y_pos");





function distanceTo(point1, point2)
{
    return (Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+(point1.y-point2.y)*(point1.y-point2.y)))/64;
}



function realPosition(item)
{
    var p = {x: item.x/64, y: item.y/64};
    return p;
}


var Configurator = function (_group,  _camera, _domElement,_container2d, app ) {//_scene, 
	//
	
	var scope = this;
	var meshes=[];
	var sprites=[];
	var renderedsprite = null;
	var menuDiv;
	var clickTimer = null;
	
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
	
	function localWorld(item)
	{
		var p = {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};
		return p;
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
			case 6: testPreloadRoof(); break;
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
			case 5: return 0.49;
			case 6: return 0.49;
			case 7: return 0.49;
			case 8: return 0.49;
			case 9: return 0.0265;
		}
	}


	function configuratePostBox()
	{	
		renderedsprite = new PIXI.Container();
		renderedsprite.name = "PostBox";

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

		var dist=0;
		var seq = formPostBoxItemsArray();

		renderedsprite.colors = document.querySelector('input[name="test"]:checked').value.split(' ');
		renderedsprite.configuration = seq;

		_group.add(meshes[8].clone());

		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			var sprite = new PIXI.Sprite.from("sprites/configurator/4/"+seq[i]+".svg");

			_group.add(mesh);
			renderedsprite.addChild(sprite);

			var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;

			mesh.translateX(getPostCoef(+seq[i])/2+dist);
			sprite.anchor.set(0.5);
			sprite.x+=(getPostCoef(+seq[i])*32+dist*64);
			dist += getPostCoef(+seq[i]);
		}
		var lastwall = meshes[8].clone();
		lastwall.translateX(dist);
		_group.add(lastwall);
		_group.children.forEach( item => {item.position.x-=dist/2;});
		renderedsprite.children.forEach(item=>item.position.x-=dist*32);

		renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -22;
		renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -22;
		renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 22;
		renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 22;
	}	



	function formBanchItemsArray()
	{
		return  $('#postbox_controlset .slick-current').map(function(){return (+$(this).attr('data-slick-index'))+1;}).get();
	}

	function getBanchCoef(id)
	{
		switch(id)
		{
			case 1: return 0.49;
			case 2: return 0.2;
		}
	}


	function configurateBanch()
	{		
		renderedsprite = new PIXI.Container();
		renderedsprite.name = "Banch";

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

		renderedsprite.colors = document.querySelector('input[name="test"]:checked').value.split(' ');
		renderedsprite.configuration = seq;

		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			var sprite = new PIXI.Sprite.from("sprites/configurator/5/"+seq[i]+".svg");
			_group.add(mesh);
			renderedsprite.addChild(sprite);

			var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;
						
			mesh.translateX(getBanchCoef(+seq[i])/2+dist);
			sprite.anchor.set(0.5);
			sprite.x+=(getBanchCoef(+seq[i])*32+dist*64);
			dist += getBanchCoef(+seq[i]);
		}
		_group.children.forEach( item => {item.position.x-=dist/2;});
		renderedsprite.children.forEach(item=>item.position.x-=dist*32);
		_camera.position.z = 5;
		_camera.position.y = 1.2;
		renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -16;
		renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -16;
		renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 16;
		renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 16;
	}

	function testPreloadPlant()
	{
		const loader = new GLTFLoader();
			loader.load(
				'../../sprites/configurator/6/'+'1'+'.glb',
				function(gltf){
					for(var i = 0; i<gltf.scene.children.length; i++)
					{
						meshes.push(gltf.scene.children[i]);
						document.getElementById("loadscreen2").style.display="none";
					}
				},
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
				});	
	}

	function testPreloadRoof()
	{
		const loader = new GLTFLoader();
			loader.load(
				'../../sprites/configurator/8/'+'Roof'+'.glb',
				function(gltf){
					for(var i = 0; i<gltf.scene.children.length; i++)
					{
						meshes.push(gltf.scene.children[i]);
						document.getElementById("loadscreen2").style.display="none";
					}
				},
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
				});	
	}

	function testPreloadPostBox()
	{
		const loader = new GLTFLoader();
			loader.load(
				'../../sprites/configurator/4/'+'PB'+'.glb',
				function(gltf){
					for(var i = 0; i<gltf.scene.children.length; i++)
					{
						meshes.push(gltf.scene.children[i]);
						document.getElementById("loadscreen2").style.display="none";
					}
				},
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
				});
	}

	function testPreloadBanch()
	{
		const loader = new GLTFLoader();
			loader.load(
				'../../sprites/configurator/5/'+'BN'+'.glb',
				function(gltf){
					for(var i = 0; i<gltf.scene.children.length; i++)
					{
						meshes.push(gltf.scene.children[i]);
						document.getElementById("loadscreen2").style.display="none";
					}
				},
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
				});
	}

	function formPlantItemsArray()
	{
		return $('#postbox_controlset .slick-current').map(function(){return (+$(this).attr('data-slick-index'))+1;}).get();
	}

	function getPlantCoef(id)
	{
		return 0.49;
	}


	function configuratePlant()
	{	
		renderedsprite = new PIXI.Container();
		renderedsprite.name = "Plant";

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
        renderedsprite.addChild(helper);

		var dist=0;
		var seq = formPlantItemsArray();

		renderedsprite.colors = document.querySelector('input[name="test"]:checked').value.split(' ');
		renderedsprite.configuration = seq;

		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			var sprite = new PIXI.Sprite.from("sprites/configurator/6/"+seq[i]+".svg");
			_group.add(mesh);
			renderedsprite.addChild(sprite);

			var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[1].material.color.r = colors[0]/255;
			mesh.children[1].material.color.g = colors[1]/255;
			mesh.children[1].material.color.b = colors[2]/255;
						
			mesh.translateX(getPlantCoef(+seq[i])/2+dist);
			sprite.anchor.set(0.5);
			sprite.x+=(getPlantCoef(+seq[i])*32+dist*64);
			dist += getPlantCoef(+seq[i]);
		}
		console.log(_group.children);
		_group.children.forEach( item => {item.position.x-=dist/2;});
		renderedsprite.children.forEach(item=>item.position.x-=dist*32);
		_camera.position.z = 5;
		_camera.position.y = 1.2;
		_group.children.forEach( item => {console.log(item.position);});
		renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -6;
		renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -6;
		renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 6;
		renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 6;
	}	

	function getRoofCoef(id)
	{
		return 0.485;
	}	

	function configurateRoof()
	{	
		renderedsprite = new PIXI.Container();
		renderedsprite.name = "Roof";

        var helper = new PIXI.Container();
		renderedsprite.addChild(helper);

        var helper = new PIXI.Container();
		renderedsprite.addChild(helper);


        var helper = new PIXI.Container();
		renderedsprite.addChild(helper);


        var helper = new PIXI.Container();
		renderedsprite.addChild(helper);


		var dist=0;
		var seq = formPlantItemsArray();
		
		//renderedsprite.colors = document.querySelector('input[name="test"]:checked').value.split(' ');
		renderedsprite.configuration = seq;

		console.log(seq);
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshes[+seq[i]-1].clone();
			var sprite = new PIXI.Sprite.from("sprites/configurator/8/"+seq[i]+".svg");
			_group.add(mesh);
			renderedsprite.addChild(sprite);

			/*var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
			mesh.children[1].material.color.r = colors[0]/255;
			mesh.children[1].material.color.g = colors[1]/255;
			mesh.children[1].material.color.b = colors[2]/255;*/
						
			mesh.translateX(getRoofCoef(+seq[i])/2+dist);
			sprite.anchor.set(0.5);
			sprite.x+=(getRoofCoef(+seq[i])*32+dist*64);
			dist += getRoofCoef(+seq[i]);
		}
		console.log(_group.children);
		_group.children.forEach( item => {item.position.x-=dist/2;});
		renderedsprite.children.forEach(item=>item.position.x-=dist*32);
		_camera.position.z = 5;
		_camera.position.y = 1.2;
		_group.children.forEach( item => {console.log(item.position);});
		renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -47;
		renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -47;
		renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = -43;
		renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = -43;
	}	

	function showContextMenu(x,y)
	{
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		var indiv = document.createElement("div");
		var indiv2 = document.createElement("div");
		var range = document.createElement("input");
		var but1 = document.createElement("button");
		var but3 = document.createElement("button");
		var img = document.createElement("img");
		var img1 = document.createElement("img");

		menuDiv.id="menu";
        menuDiv.setAttribute("class",  "objct_settings");
		menuDiv.style.position = "absolute";
		menuDiv.style.top = y+'px';
		menuDiv.style.left = x+30+'px';

		indiv.setAttribute("style",  "width: 100%; align-items: center; display: flex; justify-content: start;");
        indiv2.setAttribute("style",  "width: 100%; height: 60px; align-items: center; display: flex; justify-content: center;   background-color: #EDEDED;  border: 0.5px solid  black;");
		
        but1.setAttribute( 'class', "button_float" );
		but1.setAttribute( 'id', "remove" );
		but1.addEventListener( 'click', ()=>{
			_container2d.removeChild(selectedItem);
		hideContextMenu(); 
    } );
		
        but3.setAttribute( 'class', "button_float" );
		but3.addEventListener( 'click', hideContextMenu );  
        
        img.setAttribute('class' , "bar-icon");
        img.setAttribute('src' , "./Icons/Bin.svg");
       
        img1.setAttribute('class' , "bar-icon");
        img1.setAttribute('src' , "./Icons/Cross.svg");

		range.setAttribute("class", "rotation custom-range");
		range.setAttribute("type","range");
		range.setAttribute("min","0");
		range.setAttribute("max","8");
		range.setAttribute("step","1");
		range.setAttribute("value","0");
		range.addEventListener( 'input', ()=>{
			selectedItem.rotation = (+range.value/180*Math.PI)*45;
		});

		menuDiv.appendChild(indiv);
		menuDiv.appendChild(indiv2);
		indiv2.appendChild(range);
		indiv.appendChild(but1);
		indiv.appendChild(but3);
        but3.appendChild(img1);
        but1.appendChild(img);

		document.body.appendChild(menuDiv);
	}

	function hideContextMenu()
	{
		document.getElementById("menu").remove();
	}

		
	function configurateItem(id, height, width, polki)
	{
		_group.remove(..._group.children);
		switch(id)
		{
			//case 5: configurateBread(width); break;
			//case 2: configuratePolka(polki); break;
			//case 4: configurateRack(1,width); break;
			case 6: configurateRoof(); break;
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
	_container2d.addChild(renderedsprite);
	renderedsprite.interactive = true;
	renderedsprite.buttonMode = true;
    
	function onDragStart(event)
	{
		selectedItem = this;  
		this.data = event.data;
		this.alpha = 0.5;
		this.dragging = true;
		document.getElementById("rulet").value = 0;
	}
	
	function onDragEnd()
	{   
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
		document.getElementById("rulet").value = 1;
	
	}
	function onDragMove()
	{
		if (this.dragging)
		{
			const newPosition = this.data.getLocalPosition(this.parent);
			this.x = newPosition.x;
			this.y = newPosition.y;
			if ($("#stickmod").css("background-color")=="rgb(147, 210, 255)")
			{
			var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
			stickToItem(closestpoint);
			}
		}
	}
	renderedsprite
			.on('pointerdown', onDragStart)
			.on('pointerup', onDragEnd)
			.on('pointerupoutside', onDragEnd)
			.on('pointermove', onDragMove)
			.on('pointerover',filterOn)
			.on('pointerout',filterOff)
			.on('touchstart',function(event) {
                if (clickTimer == null) {
                    clickTimer = setTimeout(function () {
                    clickTimer = null;}, 500)
                } else {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    showContextMenu(event.data.global.x, event.data.global.y);
                }
             })
			.on('rightclick',function(event){
                showContextMenu(event.data.global.x, event.data.global.y);
            });
	}



	function findObjectsInRange()
	{
        var objectsInRange = [];
        if(selectedItem)
        {
            _container2d.children.forEach(element => {
                if(element!=selectedItem)
                {
                    if(distanceTo(selectedItem, element)<11) objectsInRange.push(element);
                }
            });
        }
        return objectsInRange;
	}


    function findClosestPoint(selecteditem, rangeitemsarray)
    {
        var selectedpoints = selecteditem.children;
        var _distance = 5000;
        var selectedpoint, closestpoint;
        for(var i = 0; i<rangeitemsarray.length; i++)
        {
            for(var j = 0; j<4; j++)
            {
                for(var k = 0; k<4; k++)
                {
                    var firstpos = localWorld(selectedpoints[j]);
                    var secpos = localWorld(rangeitemsarray[i].children[k]);
                    var distance = distanceTo(firstpos,secpos)*64;
                    if(distance<_distance)
                    {
                        _distance = distance;
                        selectedpoint = selectedpoints[j];
                        closestpoint = localWorld(rangeitemsarray[i].children[k]);
                    }
                }
            }
        }
        return [selectedpoint, closestpoint, _distance];
    }

	function stickToItem(closestpointsarr)
	{
		if(closestpointsarr[2]<1)
		{
            var clp = localWorld(closestpointsarr[0]);
            var clp2 = realPosition(selectedItem);
            var offset = {x: (clp.x-clp2.x)*64,y: (clp.y-clp2.y)*64};
            //console.log(closestpointsarr[1]);
            var newItemPosition = {x: closestpointsarr[1].x*64, y: closestpointsarr[1].y*64};
			selectedItem.x = newItemPosition.x; selectedItem.y = newItemPosition.y;
            selectedItem.x-=offset.x; selectedItem.y-=offset.y;
		}

	}

	this.configurateItem = configurateItem;
	this.preloadMeshes = preloadMeshes;
	this.spawnConfigurated = spawnConfigurated;
	//this.prFromOneFile = prFromOneFile;

};

Configurator.prototype = Object.create( EventDispatcher.prototype );
Configurator.prototype.constructor = Configurator;


var Parser3d = function(_container2d, _edgegroup, _floorgroup, _shopitems3d, _edgegroup3d, _floorgroup3d, _columngroup, WallGeometry, renderer)
{
	var hdrCubeRenderTarget, mem, hdrCubeMap;
	THREE.DefaultLoadingManager.onLoad = function ( ) {
		pmremGenerator.dispose();
	};

	const hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
	hdrCubeMap = new HDRCubeTextureLoader()
		.setPath( '../textures/pisaHDR/' )
		.setDataType( THREE.UnsignedByteType )
		.load( hdrUrls, function () {
			hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );
			} );
	
	const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileCubemapShader();

	function clear3d()
	{
		_shopitems3d.remove(..._shopitems3d.children);
		_edgegroup3d.remove(..._edgegroup3d.children);
		_floorgroup3d.remove(..._floorgroup3d.children);
	}

	function parseTo3D()
	{
		_shopitems3d.remove(..._shopitems3d.children);
		_edgegroup3d.remove(..._edgegroup3d.children);
		_floorgroup3d.remove(..._floorgroup3d.children);

		_container2d.children.forEach(item=> {
			load3DItem(item);
		});
		
		_edgegroup.children.forEach(item=> {
			load3DWall(item);
		});

		_floorgroup.children.forEach(item=> {
			load3dFloor(item);
		});

		_columngroup.children.forEach(item=> {
			load3dColumn(item);
		})
	}

	function load3dColumn(column2d)
	{
		var geometry = new CylinderGeometry( 0.5, 0.5, 1, 64 );
		const material = new MeshPhongMaterial({color: 0xA5A5A5});
		var column = new Mesh(geometry, material);
		column.castShadow = true;
		column.position.set(column2d.x/64, -column2d.y/64, 0);
		column.rotation.x = Math.PI/2;
		column.scale.x = column2d.scale.x*2;
		column.scale.z = column2d.scale.y*2;
		column.scale.y = 3.5;
		column.position.z = 1.75;
		_edgegroup3d.add(column);
	}

	function load3DWall(wall)
	{
		const geometry = WallGeometry.clone();
		const material = new MeshPhongMaterial({color: 0xA5A5A5 , flatShading: true});
		var edge = new Mesh(geometry, material);
		edge.castShadow = true;
		edge.position.set(wall.x/64, -wall.y/64, 0);
		edge.rotation.z = -wall.rotation;
		edge.scale.x = wall.scale.x;
		edge.scale.y = wall.scale.y;
		edge.scale.z = 3.5;
		_edgegroup3d.add(edge);
	}

	function load3dFloor(floor)
	{
		var points = [];
		floor.children.forEach(point=>{
			points.push({x: point.x/64,y: -point.y/64});
		});
		var shape0 = new Shape(points);
		var geometry = new ShapeGeometry(shape0);
		var material = new MeshPhongMaterial( { color: 0xbbbbbb , flatShading: true} );
		var mesh = new Mesh( geometry, material ) ;
		mesh.receiveShadow = true;
		_floorgroup3d.add( mesh );
		mesh.position.z = 0.01;
	}
	
	function getBanchCoef(id)
	{
		switch(id)
		{
			case 1: return 0.49;
			case 2: return 0.2;
		}
	}
	
	function loadBanch(item)
	{
		var _group = new THREE.Group();
		_shopitems3d.add(_group);
		var meshes = [];
		const loader = new GLTFLoader();
		loader.load(
			'../../sprites/configurator/5/'+'BN'+'.glb',
			function(gltf){
				for(var i = 0; i<gltf.scene.children.length; i++)
				{
					meshes.push(gltf.scene.children[i]);
				}
				var dist=0;
				var seq = item.configuration;
				
				console.log(seq);
				for(var i = 0; i<seq.length; i++)
				{
					var mesh = meshes[+seq[i]-1].clone();
					_group.add(mesh);
				
					mesh.children[0].material.color.r = item.colors[0]/255;
					mesh.children[0].material.color.g = item.colors[1]/255;
					mesh.children[0].material.color.b = item.colors[2]/255;

					let renderTarget = hdrCubeRenderTarget;
					const newEnvMap = renderTarget ? renderTarget.texture : null;
					if (newEnvMap)
					{
						mesh.children.forEach(ch=>{
							ch.castShadow = true;
							ch.material.envMap = newEnvMap;});
					}
										
					mesh.translateX(getBanchCoef(+seq[i])/2+dist);
					dist += getBanchCoef(+seq[i]);
				}
				_group.rotation.set(Math.PI/2,-item.rotation,0);
				_group.position.set(item.x/64, -item.y/64, 0);
				_group.children.forEach( item => {item.position.x-=dist/2;});
			},
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( 'An error happened' );
			});
	}



	function getPostCoef(id)
	{
		switch(id)
		{
			case 1: return 0.699;
			case 2: return 0.49;
			case 3: return 0.49;
			case 4: return 0.49;
			case 5: return 0.49;
			case 6: return 0.49;
			case 7: return 0.49;
			case 8: return 0.49;
			case 9: return 0.0265;
		}
	}
	
	function loadPostBox(item)
	{
		var _group = new THREE.Group();
		//_group.castShadow = true;
		_shopitems3d.add(_group);
		var meshes = [];
		const loader = new GLTFLoader();
		loader.load(
			'../../sprites/configurator/4/'+'PB'+'.glb',
			function(gltf){
				for(var i = 0; i<gltf.scene.children.length; i++)
				{
					meshes.push(gltf.scene.children[i]);
				}
				var dist=0;
				var seq = item.configuration;
				console.log(seq);
				_group.add(meshes[8].clone());
				for(var i = 0; i<seq.length; i++)
				{
					var mesh = meshes[+seq[i]-1].clone();
					_group.add(mesh);
					mesh.children[0].material.color.r = item.colors[0]/255;
					mesh.children[0].material.color.g = item.colors[1]/255;
					mesh.children[0].material.color.b = item.colors[2]/255;
					
					let renderTarget = hdrCubeRenderTarget;
					const newEnvMap = renderTarget ? renderTarget.texture : null;
					if (newEnvMap)
					{
						mesh.children.forEach(ch=>{
							ch.castShadow = true;
							ch.material.envMap = newEnvMap;});
					}
					mesh.translateX(getPostCoef(+seq[i])/2+dist);
					dist += getPostCoef(+seq[i]);
				}

				var lastwall = meshes[8].clone();
				lastwall.translateX(dist);
				_group.add(lastwall);

				_group.rotation.set(Math.PI/2,-item.rotation,0);
				_group.position.set(item.x/64, -item.y/64, 0);
				_group.children.forEach( item => {item.position.x-=dist/2;});
			},
			function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
			function ( error ) {console.log( 'An error happened' );});
	}

	function getPlantCoef(id)
	{
		return 0.49;
	}

	function loadPlant(item)
	{
		var _group = new THREE.Group();
		_shopitems3d.add(_group);
		var meshes = [];
		const loader = new GLTFLoader();
		loader.load(
				'../../sprites/configurator/6/'+'1'+'.glb',
			function(gltf){
				for(var i = 0; i<gltf.scene.children.length; i++)
				{
					meshes.push(gltf.scene.children[i]);
				}
				var dist=0;
				var seq = item.configuration;
				console.log(seq);
				for(var i = 0; i<seq.length; i++)
				{
					var mesh = meshes[+seq[i]-1].clone();
					_group.add(mesh);
					mesh.children[1].material.color.r = item.colors[0]/255;
					mesh.children[1].material.color.g = item.colors[1]/255;
					mesh.children[1].material.color.b = item.colors[2]/255;
					
					let renderTarget = hdrCubeRenderTarget;
					const newEnvMap = renderTarget ? renderTarget.texture : null;
					if (newEnvMap)
					{
						mesh.children.forEach(ch=>{
							ch.castShadow = true;
							ch.material.envMap = newEnvMap;});
					}

					mesh.translateX(getPlantCoef(+seq[i])/2+dist);
					dist += getPlantCoef(+seq[i]);
				}
				_group.rotation.set(Math.PI/2,-item.rotation,0);
				_group.position.set(item.x/64, -item.y/64, 0);
				_group.children.forEach( item => {item.position.x-=dist/2;});
			},
			function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
			function ( error ) {console.log( 'An error happened' );});
	}

	function getRoofCoef(id)
	{
		return 0.485;
	}	

	function loadRoof(item)
	{
		var _group = new THREE.Group();
		_shopitems3d.add(_group);
		var meshes = [];
		const loader = new GLTFLoader();
		loader.load(
				'../../sprites/configurator/8/'+'Roof'+'.glb',
			function(gltf){
				for(var i = 0; i<gltf.scene.children.length; i++)
				{
					meshes.push(gltf.scene.children[i]);
				}
				var dist=0;
				var seq = item.configuration;
				console.log(seq);
				for(var i = 0; i<seq.length; i++)
				{
					var mesh = meshes[+seq[i]-1].clone();
					_group.add(mesh);
					//mesh.children[1].material.color.r = item.colors[0]/255;
					//mesh.children[1].material.color.g = item.colors[1]/255;
					//mesh.children[1].material.color.b = item.colors[2]/255;
					
					let renderTarget = hdrCubeRenderTarget;
					const newEnvMap = renderTarget ? renderTarget.texture : null;
					if (newEnvMap)
					{
						mesh.children.forEach(ch=>ch.material.envMap = newEnvMap);
					}

					mesh.translateX(getRoofCoef(+seq[i])/2+dist);
					dist += getRoofCoef(+seq[i]);
				}
				_group.rotation.set(Math.PI/2,-item.rotation,0);
				_group.position.set(item.x/64, -item.y/64, 0);
				_group.children.forEach( item => {item.position.x-=dist/2;});
			},
			function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
			function ( error ) {console.log( 'An error happened' );});
	}

	function load3DItem(item)
	{	
		var name = item.name;
		const loader = new GLTFLoader();
		if(item.configuration)
		{
			switch(item.name)
			{
				case 'PostBox': loadPostBox(item); break;
				case 'Plant': loadPlant(item); break;
				case 'Banch': loadBanch(item); break;
				case 'Roof': loadRoof(item); break;
			}
		}
		else
		{
			loader.load(
				'./sprites/models/'+name+'.gltf',
				function( gltf)
				{
					var mesh = gltf.scene.children[0];
					if(mesh.children.length>0)
					{
						var mergedmesh = createMesh(mesh.children);
						_shopitems3d.add(mergedmesh);
						mergedmesh.name = name;
						mergedmesh.rotation.set(Math.PI/2,-item.rotation,0);
						mergedmesh.position.set(item.x/64, -item.y/64, 0);
						let renderTarget = hdrCubeRenderTarget;
						const newEnvMap = renderTarget ? renderTarget.texture : null;
						if ( newEnvMap && newEnvMap !== mergedmesh.material.envMap )
						{
							mergedmesh.material.forEach(mat=>mat.envMap = newEnvMap);
						}
						mergedmesh.castShadow = true;
						console.log(mergedmesh);
					}
					else
					{
						_shopitems3d.add(mesh);
						mesh.name = name;
						mesh.rotation.set(Math.PI/2,0,0);
						mesh.position.set(item.x/64, -item.y/64, 0);
					}
				},
				function ( xhr ) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
				function ( error ) { console.log( 'An error happened' );}
				);
		}
	}




	function createMesh(insertedMeshes)
	{
		var materials = [], geometries = [], mergedGeometry = new BufferGeometry(), meshMaterial, mergedMesh;
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

	this.clear3d = clear3d;
	this.parseTo3D = parseTo3D;

}



export { ItemController, Configurator, Parser3d };