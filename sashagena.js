import { BackDrop } from './AdditionalScripts/BackDrop.js';
import { CameraControls } from './AdditionalScripts/CameraControls.js';
import { RulerTool } from './AdditionalScripts/Ruler.js';
import { WallBuilder } from './AdditionalScripts/WallBuilder.js';
import { FloorDrawer } from './AdditionalScripts/FloorDrawer.js';


import * as THREE from './jsm/three.module.js';
import { Mesh, MeshStandardMaterial, BufferGeometry, MeshPhongMaterial } from './jsm/three.module.js';
import {MapControls } from './jsm/controls/OrbitControls.js';
//import {Configurator } from './jsm/controls/Configurator.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { BufferGeometryUtils } from './jsm/utils/BufferGeometryUtils.js';
import { OBJLoader } from './jsm/loaders/OBJLoader.js';
//import { ItemController } from './AdditionalScripts/ItemController.js';
import { GLTFExporter } from './jsm/exporters/GLTFExporter.js';
import { HDRCubeTextureLoader } from './jsm/loaders/HDRCubeTextureLoader.js';

import {ItemController, Configurator, Parser3d} from './AdditionalScripts/ItemController_copy.js';
import * as emailjs from './emailjs-com/dist/email.min.js';

		

	document.addEventListener('DOMContentLoaded', function() {
				
	}, false);


	window.emailjs.init('user_Yy1wt8KSMpsmQaOVvEBSy');
				document.getElementById('plsw').addEventListener("click", function(event) {
					event.preventDefault();
					var list = '';
					container2d.children.forEach(item=> {
						if(item.configuration)
						{
							list+=item.name+': '+item.configuration+'\n; ';
						}
						else
						{
						list+=item.name+'\n; ';
						}
					});
					  document.getElementsByName('contact_number')[0].value=list; 
					 console.log(document.getElementById('contact-form').contact_number.value); 
					
					window.emailjs.sendForm('service_21bip6d', 'contact_form', document.getElementById('contact-form'))
						.then(function() {
							console.log('SUCCESS!');
							document.getElementById('plsw').value="Sent";
							setTimeout(function () {document.getElementById('plsw').value="Send request";},  5000);
						}, function(error) {
							console.log('FAILED...', error);
						});
						
					});

let app, container2d,builder, edgegroup, vertexgroup, floorgroup, columngroup, ruler, cameracontrols, backdrop, bdimage, itemcontroller, floordrawer,appGrid;

var animframe3d = null;

var renderer, scene, camera, shopitems3d, container3d, edgegroup3d, floorgroup3d, floorgroup3d, doorgroup3d;
var parser3d;
var selected_cofigur_item, ruler_mod=0, hdrCubeRenderTarget, mem, hdrCubeMap;
var dimension = true;

var objloader = new OBJLoader();
var WallGeometry;
objloader.load(
	'./sprites/wall.obj',
	function ( object ) {
		object.traverse( function( child ) {
			if ( child instanceof Mesh ) {
				const material = new MeshPhongMaterial({color: 0xA5A5A5 , flatShading: true});
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

//sasha
var shopitems, container;
var prscene, prcamera, prrect, prrenderer, sceneElement, configurator, prgroup, prcontrols;

var rect;

var kastyl;

sceneElement = document.getElementById("confmenu");

function init()
{	
	var cont = document.getElementById('canvas');
	var	rect = cont.getBoundingClientRect();
    app = new PIXI.Application({ width: rect.width, height: rect.height, antialias: true });

    cont.appendChild(app.view);

	app.renderer.backgroundColor = 0xFFFFFF;
	app.stage.x = rect.width/2;
	app.stage.y = rect.height/2;

	var appGrid = new PIXI.Graphics();
	appGrid.lineStyle(0.5,0x000000);
	for(var i = -4800; i<4800; i+=64)
	{	
		if(i%320==0) appGrid.lineStyle(0.5, 0x000000);
		appGrid.moveTo(i,-4800);
		appGrid.lineTo(i,4800);
		appGrid.moveTo(-4800,i);
		appGrid.lineTo(4800,i);
		appGrid.lineStyle(0.5,0xAAAAAA);
	}
	app.stage.addChild(appGrid);
	
	var bdrop = new PIXI.Container();
	floorgroup = new PIXI.Container();
	columngroup = new PIXI.Container();
	edgegroup = new PIXI.Container();
	vertexgroup = new PIXI.Container();
	container2d = new PIXI.Container();		

	app.stage.addChild(bdrop);
	app.stage.addChild(floorgroup);
	app.stage.addChild(columngroup);
	app.stage.addChild(edgegroup);
	app.stage.addChild(vertexgroup);
	app.stage.addChild(container2d);

	builder = new WallBuilder(app, edgegroup, vertexgroup, floorgroup, columngroup, app.view, appGrid);
	builder.deactivate();
	cameracontrols = new CameraControls(app, app.view, appGrid);
	ruler = new RulerTool(app,cont);
	ruler.deactivate();
	backdrop = new BackDrop(bdrop,cont);
	itemcontroller = new ItemController(container2d, cont, app);
	floordrawer = new FloorDrawer(app, floorgroup, app.view);
	floordrawer.deactivate();
	document.getElementById("loadscreen").style.display="none";
}


function init3D()
{
	container3d = document.getElementById('canvas');

	var rect = container3d.getBoundingClientRect();
	scene = new THREE.Scene();
	scene.rotateX(-Math.PI/2);
	scene.background = new THREE.Color(0xEEFFFF);
	renderer = new THREE.WebGLRenderer({ antialias: true});
	renderer.setSize( rect.width, rect.height );
	renderer.setPixelRatio(1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	container3d.appendChild(renderer.domElement);

	var ground = new THREE.PlaneGeometry(150,150,1,1);
	var material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 10});
	var mesh = new THREE.Mesh(ground, material);
	mesh.receiveShadow = true;
	scene.add(mesh);

	camera = new THREE.PerspectiveCamera( 45, rect.width / rect.height, 1, 1000 );
	camera.position.z = 30;		
/*	GRID			
	const gridHelper = new THREE.GridHelper( 256, 256 );
	gridHelper.rotateX(Math.PI/2);
	scene.add( gridHelper ); */	
	var wallgroup3d = new THREE.Group();
	var vertexgroup3d = new THREE.Group();
	edgegroup3d = new THREE.Group();
	shopitems3d = new THREE.Group();
	floorgroup3d = new THREE.Group();
	doorgroup3d = new THREE.Group();
	parser3d = new Parser3d(container2d, edgegroup, floorgroup, shopitems3d, edgegroup3d, floorgroup3d, columngroup, WallGeometry, renderer);

	scene.add(shopitems3d);
	scene.add(wallgroup3d);
	scene.add(doorgroup3d);
	wallgroup3d.add(vertexgroup3d);
	wallgroup3d.add(floorgroup3d);
	wallgroup3d.add(edgegroup3d);

	const light = new THREE.AmbientLight( 0xffffff, 0.6 );
	scene.add( light );
	const directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 0.1 );
	directionalLight.castShadow = true;
	//directionalLight.target.position.set(0,0,0);
	directionalLight.position.set( -3, -3, 3 );
	directionalLight.castShadow = true;
	directionalLight.shadow.camera.top = 32;
	directionalLight.shadow.camera.bottom = - 32;
	directionalLight.shadow.camera.left = - 32;
	directionalLight.shadow.camera.right = 32;
	directionalLight.shadow.camera.near = 0.1;
	directionalLight.shadow.camera.far = 40;
	scene.add( directionalLight );

	var perspcontrols = new MapControls(camera, renderer.domElement);
	perspcontrols.screenSpacePanning = false;
	perspcontrols.minDistance = 2;
	perspcontrols.maxDistance = 500;
	perspcontrols.maxPolarAngle = Math.PI / 2.1;

	parseTo3dClass()
	
	animframe3d = window.requestAnimationFrame( animate );
}

function switchTo3D()
{
	if(!scene) init3D();
	else
	{
		parseTo3dClass();
	}
}


function parseTo3dClass()
{
	parser3d.parseTo3D();
}


document.addEventListener('keypress', (e)=>{
	if (e.code == "KeyB" && e.ctrlKey)
	{
		var list = '';
	container2d.children.forEach(item=> {
		if(item.configuration)
		{
			list+=item.name+': '+item.configuration+'\n';
		}
		else
		{
		list+=item.name+'\n';
		}
	});
	alert(list);
	}	
});


function load3DWall(wall)
{
	const geometry = WallGeometry.clone();
	const material = new MeshPhongMaterial({color: 0xA5A5A5 , flatShading: true});
	var edge = new Mesh(geometry, material);
	edge.position.set(wall.x/64, -wall.y/64, 0);
	edge.rotation.z = -wall.rotation;
	edge.scale.x = wall.scale.x;
	scene.add(edge);
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

function animate()
{
	myRender();
	
	window.requestAnimationFrame( animate );
};

function myRender()
{
	if(scene)
	renderer.render(scene, camera);
}

function onWindowResize()
{	//3dView
	var cont = document.getElementById('canvas');
	var	rect = cont.getBoundingClientRect();
	if(camera)
	{
	camera.aspect = rect.width/rect.height;
	camera.updateProjectionMatrix()
	renderer.setSize( rect.width, rect.height );
	}
	//2dView
	//app.renderer.view.style.width = rect.width+'px';
	app.renderer.resize(rect.width, rect.height);

	//configuratorview
	prrect = sceneElement.getBoundingClientRect();
	if(prcamera)
	{
	prcamera.aspect = prrect.width/prrect.height;
	prcamera.updateProjectionMatrix();
	prrenderer.setSize(prrect.width, prrect.height);
	}
}

window.addEventListener('resize', onWindowResize);
window.onload = init;

function setMod(id)
{	
	if (id!=-1 && id!=0) {mem=id;}
	if(id == 0 )
	{	
		container2d.children.forEach(item=>item.interactive = false);
		//
		ruler.activate();
		document.getElementById("rulet").value = 0;
		ruler_mod=1;
		builder.setMod(0);
		builder.deactivate();
		//floordrawer.activate();
		//floordrawer.deactivate();
	}

	if(id == -1 )
	{
		container2d.children.forEach(item=>item.interactive = true);
		ruler.deactivate();
		document.getElementById("rulet").value = 1;
		ruler_mod=0;
		
		if(mem==1)
		{
			container2d.children.forEach(item=>item.interactive = true);
			builder.setMod(1);
			builder.deactivate();
			backdrop.BGmove(0);
			vertexgroup.children.forEach(item => item.alpha = 0);
		}
		if(mem==2)
		{
			container2d.children.forEach(item=>item.interactive = true);
			builder.activate();	
			builder.setMod(0);
			backdrop.BGmove(0);
			vertexgroup.children.forEach(item => item.alpha = 1);
		}
		if(mem==3)
		{
			container2d.children.forEach(item=>item.interactive = true);
			builder.setMod(0);
			builder.deactivate();
			backdrop.BGmove(1);
			vertexgroup.children.forEach(item => item.alpha = 1);
		}
	}
	if(id==1 && ruler_mod==0)
	{
		container2d.children.forEach(item=>item.interactive = true);
		builder.setMod(1);
		builder.deactivate();
		backdrop.BGmove(0);
		vertexgroup.children.forEach(item => item.alpha = 0);
	}
	if(id==2 && ruler_mod==0)
	{
		container2d.children.forEach(item=>item.interactive = true);
		builder.activate();	
		builder.setMod(0);
		backdrop.BGmove(0);
		vertexgroup.children.forEach(item => item.alpha = 1);
	}
	if(mem==3 && ruler_mod==0)
		{
			container2d.children.forEach(item=>item.interactive = true);
			builder.setMod(0);
			builder.deactivate();
			backdrop.BGmove(1);
			vertexgroup.children.forEach(item => item.alpha = 1);
		}
}


document.getElementById('cameraswitcher').addEventListener("click", ()=>{
	if(dimension)
	{
		dimension=false;
		if(!scene)
		{
			init3D();
			console.log(dimension);
			document.getElementById('canvas').firstChild.style.display = 'none';
			document.getElementById('canvas').lastChild.style.display = '';
		}
		else
		{
		parser3d.parseTo3D();
		document.getElementById('canvas').firstChild.style.display = 'none';
		document.getElementById('canvas').lastChild.style.display = '';
		}
	}
	else
	{
		console.log(dimension);
		document.getElementById('canvas').firstChild.style.display = '';
		document.getElementById('canvas').lastChild.style.display = 'none';
		dimension = true;
		parser3d.clear3d();
		scene = null;
		window.cancelAnimationFrame(animframe3d);
	}
});

var confreqv;

function showConfigurator(id)
{		
	prscene = new THREE.Scene();
	prscene.background = new THREE.Color(0xCBCED6);
	prrect = sceneElement.getBoundingClientRect();
	prscene.userData.element = sceneElement;
	prcamera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
	prcamera.position.z = 2;
	prcamera.position.y = 0.5;
	prscene.userData.camera = prcamera;

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 );
	prscene.add( light );
	
	var light = new THREE.AmbientLight( 0x222222, 4 );
	prscene.add( light );
	
	prrenderer = new THREE.WebGLRenderer({ antialias: true});
	prrenderer.setSize( prrect.width, prrect.height );
	sceneElement.appendChild(prrenderer.domElement);
	
	prgroup = new THREE.Group();
	prgroup.position.y = -0.7;
	prscene.add(prgroup);
	
	configurator = new Configurator( prgroup, prcamera, prrenderer.domElement,container2d, app);
	configurator.preloadMeshes(id);
	
	prcontrols =  new MapControls(prcamera, prrenderer.domElement);
	prcontrols.screenSpacePanning = false;
	prcontrols.minDistance = 4;
	prcontrols.maxDistance = 20;
	prcontrols.maxPolarAngle = Math.PI / 3;
	//prcontrols.enablePan = false;
	

	prcamera.position.z = 2;
	//var pqnt = document.getElementById('scale_x_i_range');
	//pqnt.addEventListener('input',()=>configurator.configurateItem(id,1,+pqnt.value,+pqnt.value));
	// configurator.configurateItem(selected_cofigur_item,1,$(this).find( ".slick-current" ).attr("data-slick-index"),$(this).find( ".slick-current" ).attr("data-slick-index"));
	kastyl = id;
	
	//var spawn = document.getElementById('spawnconfigurated');
	//spawn.addEventListener('click', ()=>{configurator.spawnConfigurated();hideConfigurator();document.getElementById("confarea").style.display = "none";});
	confreqv = window.requestAnimationFrame(pranimate);
	
}

function hideConfigurator()
{
	sceneElement.removeChild(prrenderer.domElement);
	prscene = null;
	prcamera = null;
	prrenderer = null;
	configurator = null;
	window.cancelAnimationFrame(confreqv);
	
	var spawn = document.getElementById('spawnconfigurated');
	spawn.removeEventListener('click', ()=>configurator.spawnConfigurated());
}

function pranimate()
{
	prcontrols.update();
	if(prrenderer)
	{
	prrenderer.render(prscene, prcamera);
	window.requestAnimationFrame( pranimate );
	}
};

function exportGLTF( input )
{
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
			console.log( output );
			saveString( output, 'scene.gltf' );
		}
	}, options );
}

function saveString( text, filename )
{
	save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function save( blob, filename )
{
	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();
	// URL.revokeObjectURL( url ); breaks Firefox...
}				


const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

document.getElementById( 'exporter' ).addEventListener( 'click', function () {
		exportGLTF( scene );
} );


//sashaend

//gena
var container;
var camera, scene, renderer;
var controller;
var reticle, pmremGenerator, current_object, controls;
var hitTestSource = null;
var hitTestSourceRequested = false;	
//genaend
var list_content = [ 
	{'id':'0','name': 'Empty','category':'3','imageName':'1','costumisation_code':'0'},
	{'id':'1','name': 'Empty','category':'3','imageName':'1','costumisation_code':'0'},
	{'id':'2','name': 'Empty','category':'3','imageName':'2','costumisation_code':'0'},
	{'id':'3','name': 'Empty','category':'3','imageName':'3','costumisation_code':'0'},
	{'id':'4','name': 'LOKO LOGIS','category':'1','imageName':'4','costumisation_code':'1'},	
	{'id':'5','name': 'LOKO PLANT','category':'1','imageName':'2','costumisation_code':'1'},
	{'id':'6','name': 'LOKO ROOF','category':'1','imageName':'6','costumisation_code':'1'},
	{'id':'7','name': 'LOKO BENCH','category':'1','imageName':'1','costumisation_code':'1'},
	{'id':'8','name': 'LOKO LOCAL','category':'1','imageName':'9','costumisation_code':'0'},
	{'id':'9','name': 'LOKO FRESH','category':'1','imageName':'7','costumisation_code':'0'},
	{'id':'10','name': 'LOKO COMMON','category':'1','imageName':'8','costumisation_code':'0'}
	

	/*
	  1-Modified
	  2-Mirror
	  3-Scale-x iteration
	  4-Scale-y	iteration
	  5-Shelfs
	  6-Scale-x cm
	  7-Scale-y cm
	  8-Aces1
	  9-Aces2
	  10-Aces3
	  11-Aces4
	*/


];
var list_category = [ 
//	{'category':'2','name': 'Parsel systems with configuration'},
	{'category':'1','name': 'Parsel systems'},
//	{'category':'3','name': 'Category 3'} 
];


create_admin_feature_list();

function searchSelect(){
	var text = document.getElementById("search_selector");
	if (text.innerText == "Category")
		text.innerText = "Items";
	else
		text.innerText = "Category";
	filterObj();

}
//dropdown 
var coll = document.getElementsByClassName("collapsible");
var i;

	for (i = 0; i < coll.length; i++) {
		coll[i].nextElementSibling.style.maxHeight = coll[i].nextElementSibling.scrollHeight + "px";
		coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight){
		content.style.maxHeight = null;
		} else {
		content.style.maxHeight = content.scrollHeight + "px";
		} 
	});
	}

	function openLists()
	{
		var coll = document.getElementsByClassName("collapsible");
		for (i = 0; i < coll.length; i++)
			if (!coll[i].nextElementSibling.style.maxHeight)
				coll[i].click();
			else
			{
				coll[i].click();
				coll[i].click();
			}
	}

	
//dropdown

// list generation start

var Post_box_control_stack= 1;


var Postbox_stack = [ 
	{'id':'1','model': '1','imageName':'PSB/1.png'},
	{'id':'2','model': '2','imageName':'PSB/2.png'},
	{'id':'3','model': '3','imageName':'PSB/3.png'},
	{'id':'4','model': '4','imageName':'PSB/4.png'},
	{'id':'5','model': '4','imageName':'PSB/5.png'},
	{'id':'6','model': '4','imageName':'PSB/6.png'},
	{'id':'7','model': '4','imageName':'PSB/7.png'},
	{'id':'8','model': '4','imageName':'PSB/8.png'},
];

var banch_stack = [ 
	{'id':'1','model': '1','imageName':'BNC/1.png'},
	{'id':'2','model': '2','imageName':'BNC/2.png'}
];
var vazon_stack = [ 
	{'id':'1','model': '1','imageName':'VZN/1.png'}
];

var roof_stack = [ 
	{'id':'1','model': '1','imageName':'ROF/1.png'}
];





$(".postbox_control").click(function() {
	add_Conf_stack();
});


function add_Conf_stack ()
{
	var conf_item;
	if(selected_cofigur_item == 7)
	conf_item=banch_stack;
	if(selected_cofigur_item == 5)
	conf_item=vazon_stack;
	if(selected_cofigur_item == 4)
	conf_item=Postbox_stack;
	if(selected_cofigur_item == 6)
	conf_item=roof_stack;


	console.log(conf_item);
	Post_box_control_stack=Post_box_control_stack+1;
	var put_in = document.getElementById('postbox_controlset');
	var div = document.createElement('div');
	//div.setAttribute('class' , "box");
	div.setAttribute('id', "Collecton"+Post_box_control_stack);
	div.setAttribute('class', 'caru-box');
	put_in.appendChild(div);


	var input2 = document.createElement('button');
	input2.setAttribute('class', "remove_post");
	var inimg = document.createElement('img');
	inimg.setAttribute('class' , "bar-iconC");
	inimg.setAttribute('src' , "./Icons/Cross.svg");
	div.appendChild(input2);
	input2.appendChild(inimg);

	var carouseldiv = document.createElement('div');
	carouseldiv.setAttribute('class' , "carousel");
	carouseldiv.setAttribute('id' , "Caruselnumber"+Post_box_control_stack);
	div.appendChild(carouseldiv);
	for(var i=0; i<conf_item.length; i++)
	{
		var item_div = document.createElement('div');
		item_div.setAttribute('id' , "Item"+Post_box_control_stack);
		item_div.setAttribute('class', 'inner-carusel');
		carouseldiv.appendChild(item_div);
		var inimg = document.createElement('img');
		inimg.setAttribute('class' , "img_selector");
		inimg.setAttribute('src' , "./textures/Configurator_icons/"+conf_item[i]['imageName']);
		item_div.appendChild(inimg);
	}

	$("#Caruselnumber"+Post_box_control_stack).slick({
		slidesToShow: 1,
		dots:false,
		centerMode: true,
		arrows:false,
		});
	
	$("#Caruselnumber"+Post_box_control_stack).on('afterChange', function() {	 
		//$('.slick-slide').css('border', '1px solid transparent'); 
		//$('.slick-current').css('border','1px solid #000');     
		configurator.configurateItem(selected_cofigur_item,1,1,1);
		//configurator.configurateItem(1,1,2,2);
		console.log($(this).find( ".slick-current" ).attr("data-slick-index"));
		});
		//$('.slick-slide').css('border', '1px solid transparent');
		//$('.slick-current').css('border','1px solid #000');
	
	$(".remove_post").click(function() {
		var id =$(this).parent().attr('id');
		$("#"+id).remove();
		Post_box_control_stack=Post_box_control_stack-1;
		configurator.configurateItem(selected_cofigur_item,1,1,1);
	});

	configurator.configurateItem(selected_cofigur_item,1,1,1);
}



function create_admin_feature_list()
{
	var ul = document.getElementById('listnav');
	for (var i = 0; i < list_category.length; i++)
	{
		var li = insert_li(ul);
		insert_btn(li,list_category[i]);
		var div_coll = insert_div_collapsible(li);
		for (var j = 0; j < list_content.length; j++){
			if (list_category[i]['category']== list_content[j]['category']){
				var main_div = insert_main_div(div_coll);
				if (list_content[j]['costumisation_code'][0]== '1')
				insert_div_conf(main_div,list_content[j]['id']);
				var div = insert_div(main_div,list_content[j]['id']);
				var divwrapper = document.createElement('div');
				divwrapper.setAttribute('class' , "objname");
				divwrapper.append(list_content[j]['name']);
				div.appendChild(divwrapper);
				insert_img(div,list_content[j]['imageName']);
				
			}
		}
		//li.appendChild(document.createElement('hr'));
	}
}

function insert_div_collapsible(node) {
	var div = document.createElement('div');
	div.setAttribute('class' , "content");
	node.appendChild(div);
	return div; 
}
function insert_div_conf(node, id) {
	var div = document.createElement('div');
	div.setAttribute('class' , "config_button");
	div.setAttribute( 'id' , id);
	var img = document.createElement('img');
	img.setAttribute('class' , "bar-icon par_sit");
	img.setAttribute('src' , "Icons"+"\\"+"SetParametr.svg");
	div.appendChild(img);
	node.appendChild(div);
	
}
function insert_li(node) {
	var li = document.createElement('li');
	node.appendChild(li);
	return li; 
}
function insert_btn(node, list_content) {
	var btn = document.createElement('button');
	btn.setAttribute('class' , "collapsible ");
	btn.append(list_content['name']);
	node.appendChild(btn); 
}
function insert_main_div(node) {
	var div = document.createElement('div');
	div.setAttribute('class' , "ar-object");
	node.appendChild(div);
	return div;
}
function insert_div(node,id) {
	var div = document.createElement('div');
	div.setAttribute('class' , "draggable");
	div.setAttribute( 'id' , id);
	node.appendChild(div);
	//node.appendChild(document.createElement('hr'));
	return div; 
}
function insert_img(node, imageName) {
	var img = document.createElement('img');
	img.setAttribute('class' , "img_col");
	img.setAttribute('src' , "./textures/"+ imageName +".png");
	node.appendChild(img);
}




function openNav() {
		document.getElementsByClassName("sideconf")[0].style.left="249px";
		document.getElementById("Sidenav").style.width = "239px";
	
	
}

function closeNav() {
  document.getElementById("Sidenav").style.width = "0";
  document.getElementsByClassName("sideconf")[0].style.left="10px";
}


function filterObj() {
	var input, filter, ul, li, a, i,j,div,btn, txtValue;
	input = document.getElementById('form1');
	filter = input.value.toUpperCase();
	ul = document.getElementById("listnav");
	li = ul.getElementsByTagName('li');
	for (i = 0; i < li.length; i++) {
		div = li[i].getElementsByTagName("div")[0];
		btn = li[i].getElementsByTagName("button")[0];
		a = div.getElementsByTagName("a");
		if (document.getElementById("search_selector").innerText == "Items"){
			openLists()
			div.style.display = "block";
			btn.style.display = "block";
			var categoryEmptyCheck=0;
			for (j = 0; j < a.length; j++){
				var innerdiv =a[j].getElementsByTagName("div")[0];
				txtValue = innerdiv.textContent || innerdiv.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {	
					a[j].style.display = "block";
					categoryEmptyCheck = 1;
					} else {
						
					a[j].style.display = "none";
					}
			}
			if (categoryEmptyCheck == 0) {	
				div.style.display = "none";
				btn.style.display = "none";		
				} else {					
				div.style.display = "block";
				btn.style.display = "block";	
				}					
		}
		else {
			for (j = 0; j < a.length; j++)
				a[j].style.display = "block";
			openLists()
			txtValue = btn.textContent || btn.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {	
				div.style.display = "block";
				btn.style.display = "block";
				} else {
				div.style.display = "none";
				btn.style.display = "none";
				}
		}
	}
}

function set_configurator_menu(id) {
	for (var i = 0; i < list_content.length; i++)
		if (list_content[i]['id'] == id){
			/*
			if (list_content[i]['costumisation_code'][1]== 0)
			document.getElementById("mirror").style.display="none";
			else
			document.getElementById("mirror").style.display="block";
			if (list_content[i]['costumisation_code'][2]== 0)
			document.getElementById("scale_x_i").style.display="none";
			else
			document.getElementById("scale_x_i").style.display="block";
			if (list_content[i]['costumisation_code'][3]== 0)
			document.getElementById("scale_y_i").style.display="none";
			else
			document.getElementById("scale_y_i").style.display="block";
			if (list_content[i]['costumisation_code'][4]== 0)
			document.getElementById("shelfs").style.display="none";
			else
			document.getElementById("shelfs").style.display="block";
			if (list_content[i]['costumisation_code'][5]== 0)
			document.getElementById("scale_x_cm").style.display="none";
			else
			document.getElementById("scale_x_cm").style.display="block";
			if (list_content[i]['costumisation_code'][6]== 0)
			document.getElementById("scale_y_cm").style.display="none";
			else
			document.getElementById("scale_y_cm").style.display="block";
			if (list_content[i]['costumisation_code'][7]== 0){
			document.getElementById("access1").style.display="none";
			document.getElementById("access12").style.display="none";
			}
			else
			{
			document.getElementById("access1").style.display="block";
			document.getElementById("access12").style.display="block";
			}
			if (list_content[i]['costumisation_code'][8]== 0)
			document.getElementById("access2").style.display="none";
			else
			document.getElementById("access2").style.display="block";
			if (list_content[i]['costumisation_code'][9]== 0)
			{
			document.getElementById("access3").style.display="none";
			document.getElementById("access34").style.display="none";
			}
			else
			{
			document.getElementById("access3").style.display="block";
			document.getElementById("access34").style.display="block";
			}
			if (list_content[i]['costumisation_code'][10]== 0)
			document.getElementById("access4").style.display="none";
			else
			document.getElementById("access4").style.display="block";
			*/
			if (list_content[i]['costumisation_code'][11]== 0)
			document.getElementById("PostBoxconf").style.display="none";
			else
			document.getElementById("PostBoxconf").style.display="block";

		}
			
}


$(".button_nav").click(function() {
	floordrawer.deactivate();
	$('#radio-floor').css("background-color","#EDEDED");
	$('#radio-wall').css("background-color","#EDEDED");

	var inputValue = $(this).attr("value");	
	//setMod(inputValue);
	for (var i=1; i<=5; i++)
		{
		document.getElementById("block_"+i).style.display="none";
		}

	for (var i=1; i<5; i++)
		{
			document.getElementById("nav-"+i).style.backgroundColor="#EDEDED";
		}
		if (inputValue=='1'){
			openNav();
			setMod(3);
			document.getElementById("block_1").style.display="block";
		}
		
		if (inputValue=='2'){
			openNav();
			setMod(1);
		//	document.getElementById("wall_conf").style.display="none";
		//	document.getElementById("columnS_conf").style.display="none";
		//	document.getElementById("columnR_conf").style.display="none";
			document.getElementById("block_2").style.display="block";
			}
		if (inputValue=='3'){
			openNav();
			setMod(1);
			document.getElementById("block_3").style.display="block";
		}	
		if (inputValue=='4'){
			openNav();
			setMod(1);
			document.getElementById("block_4").style.display="block";
		}
		if (inputValue=='5'){
			openNav();
			setMod(1);
			document.getElementById("block_5").style.display="block";
		}	
		if (inputValue=='6'){
			closeNav();
			setMod(1);
			
		}			
	$(this).css("background-color","#93D2FF");

})


$(".button_side").click(function() {

	var inputValue = $(this).attr("id");	
	if ($(this).css("background-color")=="rgb(147, 210, 255)")
	{	
		switch(inputValue)
		{
			case 'rulet': setMod(-1); break; 
			case '2':  break; 
			case '3':  break; 
		}
		$(this).css("background-color","#ededed");
	}
		
	else
	{	
		switch(inputValue)
		{
			case 'rulet': setMod(0); break; 
			case '2':  break;
			case '3':  break; 
		}
		$(this).css("background-color","#93D2FF");
	}
		




})


$(".button_3D").click(function() {	
	if ($(this).css("background-color")=="rgb(147, 210, 255)")
	{	
		CamAct()
		$(this).css("background-color","#ededed");
	}
		
	else
	{	
		CamDiact()
		$(this).css("background-color","#93D2FF");
	}
		

})


function CamDiact() {
	closeNav();
	document.getElementById("rulet").value = 0;
	document.getElementById('scale2D').disabled = true;
	$("#rulet").css("background-color","#ededed");
	setMod(-1);
	for (var i=1; i<=5; i++)
		{
		document.getElementById("block_"+i).style.display="none";
		}

	for (var i=1; i<5; i++)
		{
			document.getElementById("nav-"+i).style.backgroundColor="#EDEDED";
		}

	var top_button = document.getElementsByClassName("button_nav");
	var side_button = document.getElementsByClassName("button_side");
	for (var i=0; i<top_button.length; i++)
		{
			top_button[i].disabled = true;
			top_button[i].style.backgroundColor = "#DDD";
		}
	for (var i=0; i<side_button.length-2; i++)
		{
			side_button[i].disabled = true;
			side_button[i].style.backgroundColor = "#DDD";
		}
	
}


function CamAct() {
	document.getElementById("rulet").value = 1;
	var top_button = document.getElementsByClassName("button_nav");
	var side_button = document.getElementsByClassName("button_side");
	document.getElementById('scale2D').disabled = false;
	for (var i=0; i<top_button.length; i++)
		{
			top_button[i].disabled = false;
			top_button[i].style.backgroundColor = "#EDEDED";
		}
	for (var i=0; i<side_button.length-2; i++)
		{
			side_button[i].disabled = false;
			side_button[i].style.backgroundColor = "#EDEDED";
		}
	
}





	$("#side_close_open").click(function(){
		if (document.getElementsByClassName("sideconf")[0].style.height!="180px")
		{
		document.getElementsByClassName("sideconf")[0].style.height="180px";
		document.getElementById("side_cl_op_id").style.transform="rotate(270deg)";
		}
		else
		{
		document.getElementsByClassName("sideconf")[0].style.height="60px";
		document.getElementById("side_cl_op_id").style.transform="rotate(90deg)";
		}
	})



	$(".rset2").click(function() {
		var inputValue = $(this).attr("value");
		if ($(this).css("background-color") == "rgb(147, 210, 255)")
		{
			setMod(1);
			$(this).css("background-color","#EDEDED");
			floordrawer.deactivate();
			document.getElementById("rulet").value = 1;
		}
		else
		{	
			document.getElementById("rulet").value = 0;
			vertexgroup.children.forEach(item => item.alpha = 1);
			builder.setWallType(inputValue);
			setMod(2);
			if (inputValue == 4) floordrawer.activate();
			else floordrawer.deactivate();
			
		for (var i=0;i<4; i++)
		{
			document.getElementsByClassName("rset2")[i].style.backgroundColor="#EDEDED";
		}
			$(this).css("background-color","#93D2FF");
		}
				
	});
	
	$(".rset3").click(function() {
		var inputValue = $(this).attr("value");
		doorwindow.setItem(inputValue);
		for (var i=0;i<2; i++)
		{
			document.getElementsByClassName("rset3")[i].style.backgroundColor="#EDEDED";
		}
		$(this).css("background-color","#93D2FF");	
	});


$(".search_bar").keyup(function(){
	filterObj();
});


$(".draggable").click(function(){
	if (list_content[$(this).attr("id")]['costumisation_code'][0]== 1)
	{
		document.getElementById("confarea").style.display = "flex";
		set_configurator_menu($(this).attr("id"));	
		selected_cofigur_item = +$(this).attr("id");
		document.getElementById("loadscreen2").style.display="flex";
		clean_conf_stack();
		showConfigurator(+$(this).attr("id"));
		
	}
	else
	{
		itemcontroller.addItem($(this).attr("id"));
	}
});


$(".draggable").hover(function(){ $(this).parent().css( "border", "solid #93D2FF 2px" );}, 
function(){ $(this).parent().css( "border", "solid transparent 2px" );}

);

$("#search_selector").click(function(){
	searchSelect()
});

$("#blueprint").change(function(){
	document.getElementById("choose_file_text").innerHTML=this.files.item(0).name;
      
})




$("#close-nav").click(function(){
	closeNav();
	setMod(1);
	$('#radio-wall').css("background-color","#EDEDED");
	for (var i=1; i<7; i++)
		{
			document.getElementById("nav-"+i).style.backgroundColor="#EDEDED";
			
		}
});






$(".closeconf").click(function(){
	document.getElementById("confarea").style.display = "none";
	hideConfigurator();
	
});



function clean_conf_stack ()
{
  var buttons = document.getElementsByClassName('caru-box');
  for (var  i=buttons.length-1; i>=0; i--)
		buttons[i].remove();

}


$(".pic_set").click(function(){
	if (document.getElementById("img_config").style.display != "none")
		document.getElementById("img_config").style.display = "none";
	else
		document.getElementById("img_config").style.display = "block";	
});



$(".openN").click(function(){
	openNav();
});


$(".closeN").click(function(){
	closeNav();
});


$(".logo").click(function(){
	closeNav();
	closeInf();
});


$(".moreInfo").click(function(){
	closeInf();
});


$("#ARButton").click(function(){
	current_object.visible = false;
});



$("#place-button").click(function(){
	arPlace();
});


$("#spawnconfigurated").click(function(){
	configurator.spawnConfigurated();
	hideConfigurator();
	document.getElementById("confarea").style.display = "none";
  });







  $(".Float1").click(function() {

	var inputValue = $(this).attr("value");

	var turn_off=document.getElementsByClassName("Float1");
	for (var i=0; i<turn_off.length; i++)
	{
		if (turn_off[i].value!=inputValue)
			turn_off[i].style.backgroundColor = "#ededed";
	}


	if ($(this).css("background-color")=="rgb(147, 210, 255)")
	{
		$(this).css("background-color","#ededed");
		console.log(0);
	}
	else
	{
		$(this).css("background-color","#93D2FF");
		console.log(inputValue);
	}

})





$(".Float2").click(function() {

	var inputValue = $(this).attr("value");

	var turn_off=document.getElementsByClassName("Float2");
	var filled = document.getElementById("float_wall_input");
	for (var i=0; i<turn_off.length; i++)
	{
		if (turn_off[i].value!=inputValue)
			turn_off[i].style.backgroundColor = "#ededed";
	}


	if ($(this).css("background-color")=="rgb(147, 210, 255)")
	{
		$(this).css("background-color","#ededed");
		filled.value=0;
	}
	else
	{
		$(this).css("background-color","#93D2FF");
		filled.value=inputValue;
	}

})



$(".Float3").click(function() {

	var inputValue = $(this).attr("value");

	if ($(this).css("background-color")=="rgb(147, 210, 255)")
	{
		$(this).css("background-color","#ededed");		
	}
	else
	{
		$(this).css("background-color","#93D2FF");
	}

})

$(".radio").click(function() {

	configurator.configurateItem(selected_cofigur_item,1,1,1);

})



	