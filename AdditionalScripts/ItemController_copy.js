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
import {RMBmenu} from './ConfiguratorInterfaceModuls.js';
import { GLTFExporter } from '../jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import {Functions} from './FunctionsForConf.js';
import {BufferGeometryUtils} from '../jsm/utils/BufferGeometryUtils.js';
import { HDRCubeTextureLoader } from '../jsm/loaders/HDRCubeTextureLoader.js';
import { getPostCoef } from './Coefs.js';
import { ConfigurableList, OrdinaryObjects } from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

import {CSG} from './EnviromentTools/three-csg-ts/lib/esm/CSG.js'
//import {CSG} from './EnviromentTools/three-csg.js';



var ItemController = function(container2d, _domElement, app, _shopitems3d)
{   
	var hdrCubeRenderTarget;
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



    function addItem(name,nameTag="",x=0,y=0,rot=0,colors=[127,134,138])
    {

        let item = PIXI.Sprite.from(app.loader.resources[name].texture);
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
				const pmremGenerator = new THREE.PMREMGenerator( app.userData.renderer );
				hdrCubeRenderTarget = pmremGenerator.fromCubemap( app.userData.hdrCubeMap );
				pmremGenerator.compileCubemapShader();
			
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
				let renderTarget = hdrCubeRenderTarget;
				const newEnvMap = renderTarget ? renderTarget.texture : null;
				if ( newEnvMap && newEnvMap !== mergedmesh.material.envMap )
				{
					mergedmesh.material.forEach(mat=>mat.envMap = newEnvMap);
				}
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
				//console.log(timer);
				//console.log(event)
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
        //filterOff.call(item);
        //item.x = 0; item.y = 0;

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


	function onlongtouch(event) { 
        //console.log(timer);
        timer = null;
		if(app.userData.canTranslate)
        showContextMenu(event.data.global.x, event.data.global.y);
    };

	function findObjectsInRange()
	{
        var objectsInRange = [];
        if(selectedItem)
        {
            container2d.children.forEach(element => {
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
            var newItemPosition = {x: closestpointsarr[1].x*64, y: closestpointsarr[1].y*64};
			selectedItem.x = newItemPosition.x; selectedItem.y = newItemPosition.y;
            selectedItem.x-=offset.x; selectedItem.y-=offset.y;
		}
	}

    this.addItem = addItem;
    this.findObjectsInRange = findObjectsInRange;

	function localWorld(item)
	{
		var p = {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};
		return p;
	}
};

var selectedItem = null;



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



	var hdrCubeRenderTarget, mem, hdrCubeMap;
	THREE.DefaultLoadingManager.onLoad = function ( ) {
		pmremGenerator.dispose();
	};

	const hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
	hdrCubeMap = new HDRCubeTextureLoader()
		.setPath( '../Media/HDR/' )
		.setDataType( THREE.UnsignedByteType )
		.load( hdrUrls, function () {
			hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );
			} );
	
	const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileCubemapShader();

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




async function asyncLoadPostBox(item) {
	var meshesObject = {};
	const gltfData = await modelLoader('../../sprites/configurator/LOKOLOGIS/CORN.glb');
	for(var i = 0; i< gltfData.scene.children.length; i++) {
		meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
	}
	var _group = new THREE.Group();
	_shopitems3d.add(_group);
    let depth = item.depth;
    var dist=0;
    var seq = item.configuration;
    var offset = '';
    if(depth == 500) offset = 'N';
    if(depth==500 && seq[0]!="Fridge") _group.add(meshesObject['EndwallN'].clone())
    else _group.add(meshesObject['Endwall'].clone());
    
    var pc_idx;
    if(item.kazyrek)
    {
        if(seq.length == 2)
        {
            var kaz1;
            kaz1 = depth==700?meshesObject['Roof'].clone():meshesObject['RoofN'].clone();
            kaz1.translateX(0.485/2);
            _group.add(kaz1);

            var kaz2;
            kaz2 = depth==700?meshesObject['Roof'].clone():meshesObject['RoofN'].clone();
            kaz2.translateX(0.485+0.485/2);
            _group.add(kaz2);
        }
        else
        {
            for(var i = 0; i<seq.length; i++) {
                if(seq[i]=='TerminalPro' || seq[i]=='TerminalST' || seq[i]=='TerminalSTFR') {pc_idx = i; break; }
            }
        }
    }

    var colors = item.colors;


    for(var i = 0; i<seq.length; i++)
    {
        var mesh = meshesObject[seq[i]+offset].clone();
        _group.add(mesh);
        mesh.children[0].material.color.r = colors[0]/255;
        mesh.children[0].material.color.g = colors[1]/255;
        mesh.children[0].material.color.b = colors[2]/255;
        mesh.translateX(getPostCoef(seq[i])/2+dist);
		let renderTarget = hdrCubeRenderTarget;
		const newEnvMap = renderTarget ? renderTarget.texture : null;
		if (newEnvMap)
		{
			mesh.children.forEach(ch=>{
				ch.castShadow = true;
				ch.material.envMap = newEnvMap;});
		}
        
        if(seq.length>2 && item.kazyrek)
        {
            if((pc_idx!=0 && pc_idx!=seq.length-1) && (i==pc_idx-1 || i==pc_idx || i==pc_idx+1))
            {
                var kaz = depth==700?meshesObject['Roof'].clone():meshesObject['RoofN'].clone();
                kaz.translateX(0.485/2+dist);
                _group.add(kaz);
            }
        }
        dist += getPostCoef(seq[i]);
    }
    var lastwall;
    if(depth==500 && seq[seq.length-1]!="Fridge") lastwall=meshesObject['EndwallN'].clone();
    else lastwall=meshesObject['Endwall'].clone();
    lastwall.children[0].material.color.r = colors[0]/255;
    lastwall.children[0].material.color.g = colors[1]/255;
    lastwall.children[0].material.color.b = colors[2]/255;
    lastwall.translateX(dist);
    _group.add(lastwall);
	_group.rotation.set(Math.PI/2,-item.rotation,0);
	_group.position.set(item.x/64, -item.y/64, 0);
	_group.children.forEach( item => {item.position.x-=dist/2;});
}

	async function asyncLoadFresh(item) {
		var meshesObject = {};
		const gltfData = await modelLoader('../../sprites/configurator/LOKOFRESH/CORN.glb');
		for(var i = 0; i< gltfData.scene.children.length; i++) {
			meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
		}
		var _group = new THREE.Group();
		_shopitems3d.add(_group);

		var dist=0;
		var seq = item.configuration;
		var colors = item.colors;
		var pc_idx;
		if(item.kazyrek) {
			if(seq.length == 2) {
				var kaz1 = meshesObject['Roof'].clone();
				kaz1.translateX(0.699/2);
				_group.add(kaz1);
				var kaz2 = meshesObject['Roof'].clone();
				kaz2.translateX(0.699+0.699/2);
				_group.add(kaz2);
			}
			else {
				for(var i = 0; i<seq.length; i++) {
					if(ConfigurableList.LOKOFRESH.ElementsBorders.terminal.includes(seq[i])) {pc_idx = i; break;}
				}
				if(pc_idx!=0 && pc_idx!=(seq.length-1)) {
					var locdist = 0.699*(pc_idx-1);
					var kaz1 = meshesObject['Roof'].clone();
					kaz1.translateX(locdist+0.699/2);
					locdist+=0.699;
					_group.add(kaz1);
					var kaz2 = meshesObject['Roof'].clone();
					kaz2.translateX(locdist+0.699/2);
					locdist+=0.699;
					_group.add(kaz2);
					var kaz3 = meshesObject['Roof'].clone();
					kaz3.translateX(locdist+0.699/2);
					_group.add(kaz3);
				}
			}
		}
		_group.add(meshesObject['Endwall'].clone());
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshesObject[seq[i]].clone();
			_group.add(mesh);
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;    
			mesh.translateX(0.699/2+dist);
			dist += 0.699;

			let renderTarget = hdrCubeRenderTarget;
			const newEnvMap = renderTarget ? renderTarget.texture : null;
			if (newEnvMap)
			{
				mesh.children.forEach(ch=>{
					ch.castShadow = true;
					ch.material.envMap = newEnvMap;});
			}
		}
		var lastwall = meshesObject['Endwall'].clone();
		lastwall.children[0].material.color.r = colors[0]/255;
		lastwall.children[0].material.color.g = colors[1]/255;
		lastwall.children[0].material.color.b = colors[2]/255;
		lastwall.translateX(dist);
		_group.add(lastwall);
		_group.rotation.set(Math.PI/2,-item.rotation,0);
		_group.position.set(item.x/64, -item.y/64, 0);
		_group.children.forEach( item => {item.position.x-=dist/2;});
	}

	async function asyncLoadEcoLogis(item)
	{
		var meshesObject = {};
		const gltfData = await modelLoader('../../sprites/configurator/ECOLOGIS/CORN.glb');
		for(var i = 0; i< gltfData.scene.children.length; i++) {
			meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
		}
		var _group = new THREE.Group();
		_shopitems3d.add(_group);
		var dist=0;
		var seq = item.configuration;
		let depth = item.depth;
		var offset = '';
		if(depth == 500) offset = 'N';
	
		_group.add(meshesObject['Endwall'+offset].clone());
		if(item.kazyrek)
		{
				var kaz1;
				kaz1 = depth==700?meshesObject['Roof'].clone():meshesObject['RoofN'].clone();
				kaz1.translateX(0.485/2);
				_group.add(kaz1);
				var kaz2;
				kaz2 = depth==700?meshesObject['Roof'].clone():meshesObject['RoofN'].clone();
				kaz2.translateX(0.485+0.485/2);
				_group.add(kaz2);
		}
		for(var i = 0; i<2; i++)
		{
			var mesh = meshesObject[seq[i]+offset].clone();
			_group.add(mesh);
			var colors = item.colors;
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;
			mesh.translateX(0.49/2+dist);
			dist += 0.49;
		}
		var lastwall = meshesObject['Endwall'+offset].clone();
		lastwall.children[0].material.color.r = colors[0]/255;
		lastwall.children[0].material.color.g = colors[1]/255;
		lastwall.children[0].material.color.b = colors[2]/255;
		lastwall.translateX(dist);
		_group.add(lastwall);
		_group.rotation.set(Math.PI/2,-item.rotation,0);
		_group.position.set(item.x/64, -item.y/64, 0);
		_group.children.forEach( item => {item.position.x-=dist/2;});
	}


	async function asyncLoadLokoAccesories(item)
	{
		var meshesObject = {};
		const gltfData = await modelLoader('../../sprites/configurator/LOKOACCESSORIES/CORN.glb');
		for(var i = 0; i< gltfData.scene.children.length; i++) {
			meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
		}
		var _group = new THREE.Group();
		_shopitems3d.add(_group);

		var dist=0;
		var seq = item.configuration;
		var colors = item.colors;
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshesObject[seq[i]].clone();
			_group.add(mesh);
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;   
			mesh.translateX(getBanchCoef(1)/2+dist);
			dist += getBanchCoef(1);
		}
		_group.rotation.set(Math.PI/2,-item.rotation,0);
		_group.position.set(item.x/64, -item.y/64, 0);
		_group.children.forEach( item => {item.position.x-=dist/2;});
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
			let renderTarget = hdrCubeRenderTarget;
			const newEnvMap = renderTarget ? renderTarget.texture : null;
			if ( newEnvMap && newEnvMap !== mergedmesh.material.envMap )
			{
				mergedmesh.material.forEach(mat=>mat.envMap = newEnvMap);
			}
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
		if(item.configuration) {
			if(item.name=='LOKOLOGIS') await asyncLoadPostBox(item);
			if(item.name=='LOKOACCESSORIES') await asyncLoadLokoAccesories(item);
			if(item.name=='LOKOFRESH') await asyncLoadFresh(item);
			if(item.name=='ECOLOGIS') await asyncLoadEcoLogis(item);
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

	function vertnumbers(edge) {
		var number = -1;
		for(var i = 0; i<edge.geometry.attributes.position.count; i++) {
			if(edge.geometry.attributes.position.getX(i) == -0.5 && edge.geometry.attributes.position.getY(i)==0.5) console.log(i);
		}
	}


    async function asyncLoadWall(wall) {
        var geometry = WallGeometry.clone();
        var material = new MeshPhongMaterial({color: 0xffffff , flatShading: false});
		var wallheight = wall.userData.height;
        const box = new THREE.Mesh(geometry, material);
		var left = wall.children[4].x/64;
		var right = wall.children[5].x/64;
		var rightup = wall.children[1].x/64;
		var rightdown = wall.children[3].x/64;
		var leftdown = wall.children[2].x/64;
		var leftup = wall.children[0].x/64;


		//vertnumbers(box);
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

	function compareGLTF(a,b)
	{
		if(a.name<b.name) return -1;
		if(a.name>b.name) return 1;
		return 0;
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
				for(var i = 0; i<gltf.scene.children.length; i++) meshes.push(gltf.scene.children[i]);
				var dist=0;
				var seq = item.configuration;
				for(var i = 0; i<seq.length; i++)
				{
					var mesh = meshes[+seq[i]-1].clone();
					_group.add(mesh);
					let renderTarget = hdrCubeRenderTarget;
					const newEnvMap = renderTarget ? renderTarget.texture : null;
					if (newEnvMap) mesh.children.forEach(ch=>ch.material.envMap = newEnvMap);
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