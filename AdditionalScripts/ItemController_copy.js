import * as THREE from '../jsm/three.module.js';
import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	BoxGeometry,
	BufferGeometry,
	MeshStandardMaterial,
	MeshPhongMaterial,
	MeshLambertMaterial,
	MeshMatcapMaterial,
	Mesh,
	CircleGeometry,
	CylinderGeometry,
	MeshBasicMaterial,
	Shape,
	ShapeGeometry,
	TextureLoader,
	RepeatWrapping
} from '../jsm/three.module.js';
import {RMBmenu} from './InterfaceForConf.js';
import { GLTFExporter } from '../jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import {Functions} from './FunctionsForConf.js';
import {BufferGeometryUtils} from '../jsm/utils/BufferGeometryUtils.js';
import { HDRCubeTextureLoader } from '../jsm/loaders/HDRCubeTextureLoader.js';
import { getPostCoef } from './Coefs.js';
import { ConfigurableList, OrdinaryObjects,Category } from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

import {CSG} from './EnviromentTools/three-csg-ts/lib/esm/CSG.js'
//import {CSG} from './EnviromentTools/three-csg.js';



var ItemController = function(container2d, _domElement, app, _shopitems3d)
{   
	let timer;
    app.loader.baseUrl = "sprites/ordinary/PixiPreview";
	for (let i in OrdinaryObjects) {
		app.loader.add(i,i+'.svg');
	}
    app.loader.onComplete.add(doneLoading);
    app.loader.load();
    var menuDiv;
	var clickTimer = null;

    function doneLoading(e) {
        console.log("done loading");
    }



	function showContextMenu(x,y)
	{
		let menuDiv = document.createElement("div");
		menuDiv.id = "ORClick";
		menuDiv.className = "OR-cover";

		menuDiv.innerHTML = RMBmenu;
		document.body.appendChild(menuDiv);
		$("#menu").css({"position":"absolute","top":y+"px","left":x+30+"px"});
		$("#ORclose").click(()=>{hideContextMenu()});
		$("#ORremove").click(()=>{container2d.removeChild(selectedItem); hideContextMenu();});
		$("#nameTag").val(selectedItem.userData.nameTag);
    	$("#nameTag").on("input change",(item)=>{selectedItem.userData.nameTag=item.target.value});
		$("#ORrotate").on("input change",(item)=>{selectedItem.rotation = (+item.target.value/180*Math.PI);});
		$("#ORClick").click(function(e){ if(e.currentTarget==e.target)$("#ORClick").remove();})

		$("input[name=test]").change(()=>{
			setItemColor();
		});
		 //color set
		const colorSet = document.querySelectorAll('input[name="test"]');
        const selected_color=selectedItem.colors.join(' ');
        colorSet.forEach(i=> {if(selected_color == i.value) 
                                       i.checked = true;
                            }
							);
	}


	function hideContextMenu()
	{
		document.getElementById("ORClick").remove();
	}


	function setItemColor() {
		selectedItem.colors = document.querySelector('input[name="test"]:checked').value.split(' ');
	}



    function addItem(name, nameTag="" ,x=0 ,y=0 ,rot=0 ,colors=[127,134,138])
    {
		let item = PIXI.Sprite.from(app.loader.resources[name].texture);
		var tint = Category[OrdinaryObjects[name].Category].Color;
        item.tint = tint;
		


		item.sayHi = function() {
			const ord = OrdinaryObjects[this.name];
			var color = getColorCode(this.colors);
			const art = ord.art;
			const name = ord.Name+' '+color;
			const price = ord.price;
			//console.log(name);
			return [art,name,0,price,0];
		}
        item.name = name;
		item.x = x; item.y = y;
		item.rotation = rot;
		item.colors = colors;
		item.userData={};
		item.userData.nameTag=nameTag;
		item.saveIt = function() {
			var thisObject = {
				name:this.name,
				colors: this.colors,
				x:this.x,
				y:this.y,
				rotation:this.rotation,
			}
			return thisObject;
		}
		item.create3D = async function loadOrdinaryItem(item) {
			
			const name = item.name;
			const gltfData = await modelLoader('./sprites/ordinary/Models/'+name+'.gltf');
			var mesh = gltfData.scene.children[0];
			if(mesh.children.length>0)
			{
				var mergedmesh = createMesh(mesh.children);
				_shopitems3d.add(mergedmesh);
				mergedmesh.name = name;
				mergedmesh.rotation.set(Math.PI/2,-item.rotation,0);
				mergedmesh.position.set(item.x/64, -item.y/64, 0);
				mergedmesh.material[1].color.r = item.colors[0]/255;
				mergedmesh.material[1].color.g = item.colors[1]/255;
				mergedmesh.material[1].color.b = item.colors[2]/255;
				mergedmesh.castShadow = true;
			}
			else
			{
				_shopitems3d.add(mesh);
				mesh.name = name;
				mesh.rotation.set(Math.PI/2,0,0);
				mesh.position.set(item.x/64, -item.y/64, 0);
			}
		}

        container2d.addChild(item);
        item.interactive = true;
        item.buttonMode = true;
        item.anchor.set(0.5);
        item
            .on('pointerdown', function(event) {
				Functions.onDragStart(event,this,app)
				selectedItem = this; //прибрати, коли увесь загальний функціонал перейде у Functions
			})
			.on('pointerup', function() {
				Functions.onDragEnd(this)
			})
			.on('pointerupoutside', function() {
				Functions.onDragEnd(this)
			})
			.on('pointermove', function(event) {
				Functions.onDragMove(event,this,container2d);
			})
			.on('pointerover', function() {
				Functions.filterOn(this);
			})
			.on('pointerout', function() {
				Functions.filterOff(this)
			})
			.on('touchstart',function(event) {
				if (!timer) {
					timer = setTimeout(function() {onlongtouch(event);}, 2000);
				}      
			 })
			 
			 .on('touchend',function() {
				if (timer) {
					clearTimeout(timer);
					timer = null;
				}
			 }) 
			.on('rightclick',function(event){
				showContextMenu(event.data.global.x, event.data.global.y);
            });

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

		const text = new PIXI.Text(OrdinaryObjects[name].Name2D.replaceAll('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
        text.anchor.set(0.5);
        text.scale.x = 1/item.scale.x;
        text.scale.y = 1/item.scale.y;
        item.addChild(text);

        return item;
    }


	function onlongtouch(event) { 
        timer = null;
		if(app.userData.canTranslate)
        showContextMenu(event.data.global.x, event.data.global.y);
    };

    this.addItem = addItem;
};

var selectedItem = null;



var Parser3d = function(_container2d, _edgegroup, _floorgroup, _shopitems3d, _edgegroup3d, _floorgroup3d, _columngroup, WallGeometry, renderer, _blockgroup)
{
	const loader = new GLTFLoader();
    var objloader = new OBJLoader();
    var DoorGeometry;
    var WindowGeometry;
    var WallGeometry;


	function preload(){
        loader.load(
            '../Media/OBJ/door.glb',
            function ( gltf ) {
				DoorGeometry = gltf.scene.children[0];
            },
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                //console.log( 'An error happened' );
            }
        );
        loader.load(
            '../Media/OBJ/window.glb',
            function ( gltf ) {
				WindowGeometry = gltf.scene.children[0];
            },
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                //console.log( 'An error happened' );
            }
        );
        objloader.load(
            '../Media/OBJ/wallTest.obj',
            function ( object ) {
                WallGeometry = object.children[0].geometry;
            },
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                //console.log( 'An error happened' );
            }
        );
    }


	async function exportGLTF(input)
	{
		_shopitems3d.remove(..._shopitems3d.children);
		_edgegroup3d.remove(..._edgegroup3d.children);
		_floorgroup3d.remove(..._floorgroup3d.children);
		let promises = [];
		_container2d.children.forEach(item => {
			promises.push(asyncLoad3DItem(item));
		})
		_edgegroup.children.forEach(edge => {
            promises.push(asyncLoadWall(edge))
        })
		_columngroup.children.forEach(column => {
            promises.push(load3dColumn(column))
        })
		_blockgroup.children.forEach(block => {
            promises.push(load3dBlock(block))
        })
		_floorgroup.children.forEach(floor => {
            promises.push(load3dFloor(floor))
        })
		Promise.all(promises).then(()=> {
			const gltfExporter = new GLTFExporter();
			const options = {
				trs: false,
				onlyVisible: false,
				truncateDrawRange: true,
				binary: false,
				maxTextureSize: Number( 4096 ) || Infinity // To prevent NaN value
			};
			gltfExporter.parse( input, function ( result ) {
				if ( result instanceof ArrayBuffer ) {
					saveArrayBuffer( result, 'scene.glb' );
				} else {
					const output = JSON.stringify( result, null, 2 );
					saveString( output, 'scene.gltf' );
				}
			}, options );
		})
	}

	function saveString( text, filename )
	{
		saveAs( new Blob( [ text ], { type: 'text/plain' } ), filename );
	}

	function saveArrayBuffer( buffer, filename ) {
		saveAs( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
	}


    function modelLoader(url) {
        return new Promise((resolve, reject) => {
            loader.load(url, data => resolve(data), null, reject);
        });
    }


	async function loadOrdinaryItem(item) {
		const name = item.name;
		const gltfData = await modelLoader('./sprites/ordinary/Models/'+name+'.gltf');
		var mesh = gltfData.scene.children[0];
		if(mesh.children.length>0)
		{
			var mergedmesh = createMesh(mesh.children);
			_shopitems3d.add(mergedmesh);
			mergedmesh.name = name;
			mergedmesh.rotation.set(Math.PI/2,-item.rotation,0);
			mergedmesh.position.set(item.x/64, -item.y/64, 0);
			mergedmesh.material[1].color.r = item.colors[0]/255;
			mergedmesh.material[1].color.g = item.colors[1]/255;
			mergedmesh.material[1].color.b = item.colors[2]/255;
			mergedmesh.castShadow = true;
		}
		else
		{
			_shopitems3d.add(mesh);
			mesh.name = name;
			mesh.rotation.set(Math.PI/2,0,0);
			mesh.position.set(item.x/64, -item.y/64, 0);
		}
	}

	async function asyncParseTo3D() {
		_shopitems3d.remove(..._shopitems3d.children);
		_edgegroup3d.remove(..._edgegroup3d.children);
		_floorgroup3d.remove(..._floorgroup3d.children);
		let promises = [];
		_container2d.children.forEach(item => {
			promises.push(asyncLoad3DItem(item));
		})
		Promise.all(promises);
	}



    async function asyncLoad3DItem(item) {
		if(item.configuration || item.userData.configuration) {
				await item.create3D(item,_shopitems3d);
		}
		else await loadOrdinaryItem(item);
    }


	function parseStructuresTo3D() {
        let promises = []
        _edgegroup.children.forEach(edge => {
            promises.push(asyncLoadWall(edge))
        })
		_columngroup.children.forEach(column => {
            promises.push(load3dColumn(column))
        })
		_blockgroup.children.forEach(block => {
            promises.push(load3dBlock(block))
        })
		_floorgroup.children.forEach(floor => {
            promises.push(load3dFloor(floor))
        })
        Promise.all(promises);
    }

	function moveGeometryVertexes(edge, vertnumber, coords)
	{
		var one = [1,2,4,14,16,25,26,28,48,51]
		var three = [7,8,10,13,24,27,29,49]
		var four = [18,21,23,35,42,45,47,54,57]
		var five = [19,20,22,30,33,36,39,41,59]
		//center
		var zero = [0,3,5,17,32,34,43,44,46,53,55]
		var two = [6,9,11,12,15,31,37,38,40,50,52,56,58]
		
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



    async function asyncLoadWall(wall) {
        var geometry = WallGeometry.clone();
        var material = new MeshStandardMaterial({color: 0xA5A5A5 , flatShading: false});
		var wallheight = wall.userData.height;
        const box = new THREE.Mesh(geometry, material);
		var left = wall.children[4].x/64;
		var right = wall.children[5].x/64;
		var rightup = wall.children[1].x/64;
		var rightdown = wall.children[3].x/64;
		var leftdown = wall.children[2].x/64;
		var leftup = wall.children[0].x/64;

		moveGeometryVertexes(box, 0, {x:left});
		moveGeometryVertexes(box, 2, {x:right});
		moveGeometryVertexes(box, 3, {x:rightup});
		moveGeometryVertexes(box, 5, {x:rightdown});
		moveGeometryVertexes(box, 1, {x:leftup});
		moveGeometryVertexes(box, 4, {x:leftdown});

        box.updateMatrix();

		var openings = false;
        var openingHolesGeometry = new THREE.Mesh(new THREE.BoxGeometry(0,0,0), material)
        wall.children.forEach(opening => {
            if(opening.name == 'door') {
				const door = new THREE.Mesh(new THREE.BoxGeometry(1/wall.scale.x, 1, opening.userData.height/wallheight).translate(0,0,opening.userData.height/2/wallheight), new THREE.MeshNormalMaterial());
                openingHolesGeometry.updateMatrix();
                door.updateMatrix();
                var doorHole = new THREE.Mesh(door.geometry.clone().scale(wall.scale.x*Math.abs(opening.scale.x),1,1).translate(opening.x/64,0,0), material)
                openingHolesGeometry = CSG.union(openingHolesGeometry, doorHole);
				openings = true;
            }
            if(opening.name == 'window') {
				const window = new THREE.Mesh(new THREE.BoxGeometry(1/wall.scale.x, 1, opening.userData.height/wallheight).translate(0,0,(opening.userData.heightoffset+opening.userData.height/2)/wallheight), new THREE.MeshNormalMaterial());
                openingHolesGeometry.updateMatrix();
                window.updateMatrix();
                var doorHole = new THREE.Mesh(window.geometry.clone().scale(wall.scale.x*Math.abs(opening.scale.x),1,1).translate(opening.x/64,0,0), material)
                openingHolesGeometry = CSG.union(openingHolesGeometry, doorHole);
				openings = true;
            }
        })
		var result;
        if(openings) result = CSG.subtract(box, openingHolesGeometry);
		else result = box;
		result.castShadow = true;
		result.receiveShadow = true;
        wall.children.forEach(opening => {
            if(opening.name == 'door') {
                var door = DoorGeometry.clone();
                door.scale.set(opening.scale.x,1/wall.scale.y, opening.userData.height/wallheight);
                door.position.x = opening.x/64;
				door.y = 0.02;
                door.castShadow = true;
                result.add(door)
            }
            if(opening.name == 'window') {
                var window = WindowGeometry.clone();
				window.scale.set(opening.scale.x, 1/wall.scale.y, opening.userData.height/wallheight);
                window.position.x = opening.x/64;
                window.position.z = opening.userData.heightoffset/wallheight;
                result.add(window)
            }
        })

        result.scale.x = wall.scale.x;
        result.scale.y = wall.scale.y;
        result.scale.z = wall.userData.height;
        result.position.x = wall.x/64; result.position.y = -wall.y/64;
        result.rotation.z = -wall.rotation;
        _shopitems3d.add(result)
    }


	async function load3dColumn(column2d)
	{
		var geometry = new CylinderGeometry( 0.5, 0.5, 1, 64 );
        var material = new MeshPhongMaterial({color: 0xffffff , flatShading: false});
		var column = new Mesh(geometry, material);
		column.castShadow = true;
		column.position.set(column2d.x/64, -column2d.y/64, 0);
		column.rotation.x = Math.PI/2;
		column.scale.x = column2d.scale.x*2;
		column.scale.z = column2d.scale.y*2;
		column.scale.y = column2d.userData.height;
		column.position.z = column.scale.y/2;
		_edgegroup3d.add(column);
	}

	async function load3dBlock(column2d)
	{
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new MeshPhongMaterial({color: 0xffffff , flatShading: false});
		var column = new Mesh(geometry, material);
		column.castShadow = true;
		column.position.set(column2d.x/64, -column2d.y/64, 0);
		column.rotation.x = Math.PI/2;
		column.scale.x = column2d.scale.x;
		column.scale.z = column2d.scale.y;
		column.scale.y = column2d.userData.height;
		column.position.z = column.scale.y/2;
		_edgegroup3d.add(column);
	}


	function clear3d()
	{
		_shopitems3d.remove(..._shopitems3d.children);
		_edgegroup3d.remove(..._edgegroup3d.children);
		_floorgroup3d.remove(..._floorgroup3d.children);
	}


	async function load3dFloor(floor)
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
		mesh.position.x = floor.x/64;
		mesh.position.y = -floor.y/64;
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


    preload();



	this.clear3d = clear3d;
	this.parseTo3D = asyncParseTo3D;
	this.parseStructuresTo3D = parseStructuresTo3D;
	this.exportGLTF = exportGLTF;

}



export { ItemController, Parser3d };

function modelLoader(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject);
    });
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