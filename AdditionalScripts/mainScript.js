import * as THREE from '../jsm/three.module.js';
import { Mesh, MeshPhongMaterial } from '../jsm/three.module.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import {feedback, getComOffer} from './InterfaceForConf.js';
import {MapControls, OrbitControls } from '../jsm/controls/OrbitControls.js';
import {ItemController, Parser3d} from './ItemController_copy.js';
import { createHtmlFile, createHtmlFileLite } from './HtmlPrice.js'
import {ConfigurableList, OrdinaryObjects, Category} from './ConfigurableList.js';
// import {LokoLogis} from './LokoLogis.js'
// import {EcoLogis} from './EcoLogis.js'
// import {LokoFresh} from './LokoFresh.js'
// import {Shelf} from './Shelf.js'
import {CheckOut} from './CheckOut.js'
// import {DoubleShelf} from './DoubleShelf.js'
// import {LokoAccessories} from './LokoAccessories.js'
// import {Fridge} from './Fridge.js'
import {WallBuilder} from './EnviromentTools/WallBuilderUpd.js'
import {BackDrop} from './EnviromentTools/BackDrop.js'
import { FloorDrawer } from './EnviromentTools/FloorDrawer.js';
import {catalogMenu, wallMenu} from './InterfaceForConf.js';
import { CameraControls } from './CameraControls.js';

import { RGBELoader } from '../jsm/loaders/RGBELoader.js';

import * as emailjs from '../emailjs-com/dist/email.min.js';
import { RulerTool } from './EnviromentTools/Ruler.js';



let app, container2d, edgegroup, vertexgroup, floorgroup, columngroup, cameracontrols, configuratorview, itemcontroller;

var renderer, scene, camera, shopitems3d, container3d, edgegroup3d, floorgroup3d, floorgroup3d, doorgroup3d, blockgroup;
var parser3d;
var dimension = true;
var perspcontrols;

var objloader = new OBJLoader();
var WallGeometry;

//tools
var backdrop,builder, ruler, floordrower;


objloader.load(
	'./sprites/wall.obj',
	function ( object ) {
		WallGeometry = object.children[0].geometry;
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	}
);


function init() {
	var cont = document.getElementById('canvas');
	var	rect = cont.getBoundingClientRect();
    app = new PIXI.Application({ width: rect.width, height: rect.height, antialias: true });
	app.userData = {};
	app.userData.mod = 0;
	//app.stickmod = false;
	app.canMove = 1;
	app.userData.snapvert = false;
	app.userData.snapwall = false;
	app.userData.canTranslate = true;

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
	app.stage.addChild(bdrop);
	let rarea = PIXI.Sprite.from('../Media/SVG/RenderArea.svg');
	app.stage.addChild(rarea);
	rarea.x -= 320;
	rarea.y -= 128;
	
	floorgroup = new PIXI.Container();
	columngroup = new PIXI.Container();
	blockgroup = new PIXI.Container();
	edgegroup = new PIXI.Container();
	vertexgroup = new PIXI.Container();
	container2d = new PIXI.Container();
	var axiscontainer = new PIXI.Container();

	app.stage.addChild(floorgroup);
	app.stage.addChild(columngroup);
	app.stage.addChild(blockgroup);
	app.stage.addChild(edgegroup);
	app.stage.addChild(vertexgroup);
	app.stage.addChild(container2d);
	app.stage.addChild(axiscontainer);
	
	cameracontrols = new CameraControls(app, app.view, appGrid);

	shopitems3d = new THREE.Group();
	itemcontroller = new ItemController(container2d, cont, app,shopitems3d);
	document.getElementById("loadscreen").style.display="none";

	//wallbuild

	builder = new WallBuilder(app, edgegroup, vertexgroup, floorgroup, columngroup, app.view, appGrid, axiscontainer, blockgroup);
	backdrop = new BackDrop(bdrop, app.view, app);
	ruler = new RulerTool(app,app.view);
	floordrower = new FloorDrawer(app, floorgroup, vertexgroup,axiscontainer, app.view);

	//endwallbuild

	init3D();
}

function init3D()
{
	container3d = document.getElementById('canvas');

	var rect = container3d.getBoundingClientRect();
	scene = new THREE.Scene();
	scene.rotateX(-Math.PI/2);
    scene.background = new THREE.Color(0xa7e1fc);
	renderer = new THREE.WebGLRenderer({ antialias: true});
	app.userData.renderer = renderer;
	renderer.setSize( rect.width,rect.height );
	renderer.setPixelRatio(1);

	container3d.appendChild(renderer.domElement);

	var ground = new THREE.PlaneGeometry(150,150,1,1);
    let material = new THREE.MeshPhongMaterial({color: 0xaaaaaa, shininess: 10});
	var mesh = new THREE.Mesh(ground, material);
	scene.add(mesh);

	camera = new THREE.PerspectiveCamera( 45, rect.width / rect.height, 0.1, 1000 );

	camera.position.z = 30;		

	var wallgroup3d = new THREE.Group();
	var vertexgroup3d = new THREE.Group();
	edgegroup3d = new THREE.Group();
	floorgroup3d = new THREE.Group();
	doorgroup3d = new THREE.Group();
	parser3d = new Parser3d(container2d, edgegroup, floorgroup, shopitems3d, edgegroup3d, floorgroup3d, columngroup, WallGeometry, renderer, blockgroup);

	scene.add(shopitems3d);
	scene.add(wallgroup3d);
	scene.add(doorgroup3d);
	wallgroup3d.add(vertexgroup3d);
	wallgroup3d.add(floorgroup3d);
	wallgroup3d.add(edgegroup3d);

	const light = new THREE.AmbientLight( 0xffffff, 0.3 );
	scene.add( light );

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	directionalLight.position.set( -3, -3, 3 );
	
    renderer.physicallyCorrectLights = true;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 3;
	
	const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();
	new RGBELoader()
	.setDataType( THREE.UnsignedByteType )
	.setPath( '../Media/HDR/' )
	.load( 'royal_esplanade_1k.hdr', function ( texture ) {
		const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
		scene.environment = envMap;
		texture.dispose();
		pmremGenerator.dispose();
		} );

	scene.add( directionalLight );
	
	perspcontrols = new OrbitControls(camera, renderer.domElement);
	perspcontrols.maxDistance = 500;
	perspcontrols.update()

	animate();
}

function animate() {
	if(!dimension) {
		requestAnimationFrame( animate );
		renderer.render(scene, camera);
	} else {
		requestAnimationFrame( animate );
	}
};


var strDownloadMime = "image/octet-stream";
function saveAsImage() {
	var imgData, imgNode;
	try {
		var strMime = "image/jpeg";
		renderer.render(scene, camera);
		return imgData = renderer.domElement.toDataURL(strMime);
	} catch (e) {
		console.log(e);
		return;
	}
}


function getHtmlDataList(currencyCoef) {
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

	if(dimension) {
		scene.children[0].position.y = -1000;
		scene.background = new THREE.Color(0xFFFFFF);
		camera.position.set(0.014987962346852953, 1.288896086445874, 4.27187224039124);
		perspcontrols.target.set(0.014987962346852953, 1.2888960864458738, -7.837623919220397);
		camera.aspect = 2100/900;
		camera.updateProjectionMatrix()
		renderer.setSize( 2100, 900 );
		//camera.position.set(-1.3401021772795616, 1.9498948595261685, 7.854147756596404);
		//perspcontrols.target.set(-0.18180994093451325, 1.2148807518714777, -0.29283628729376693);
		perspcontrols.update();
		shopitems3d.remove(...shopitems3d.children);
		var promises = [];
		container2d.children.forEach(item => {
			if(item.userData.configuration) promises.push(item.create3D(item, shopitems3d));
			else if (item.colors) {
				promises.push(item.create3D(item));

			}
		})
		promises.push(parser3d.parseStructuresTo3D());

		Promise.all(promises).then(()=>{
			var htmlArray = [];
			var ordinarySet = {};
			container2d.children.forEach(item=> {
				if(item.userData.configuration) {
					htmlArray.push(...item.sayHi());
					htmlArray.push(['_']);
				}
				else {
						var info = item.sayHi();
						if(!ordinarySet[info[1]]) ordinarySet[info[1]] = [...info];
						ordinarySet[info[1]][2] +=1;
						ordinarySet[info[1]][4] = ordinarySet[info[1]][3] * ordinarySet[info[1]][2];
				}
			})
			for(var i in ordinarySet) {
				htmlArray.push(ordinarySet[i]);
			}

			htmlArray.forEach(raw => {
				if(raw[3]&&raw[4]) {
					raw[3]=Math.round(raw[3]*currencyCoef[0]*100)/100;
					raw[4]=Math.round(raw[4]*currencyCoef[0]*100)/100;
				}
			})
			setTimeout(() => {
				const markup = createHtmlFile(htmlArray, saveAsImage(),date,currencyCoef[1]);
				saveString(markup, 'List.html');
				scene.children[0].position.y = 0;
				scene.background = new THREE.Color(0xa7e1fc);
				onWindowResize();
			}, 2000)
		});
	}
	else {
		scene.children[0].position.y = -1000;
		scene.background = new THREE.Color(0xFFFFFF);
		camera.position.set(0.014987962346852953, 1.288896086445874, 4.27187224039124);
		perspcontrols.target.set(0.014987962346852953, 1.2888960864458738, -7.837623919220397);
		camera.aspect = 2100/900;
		camera.updateProjectionMatrix()
		renderer.setSize( 2100, 900 );
		perspcontrols.update();
		var htmlArray = [];
		var ordinarySet = {};
		container2d.children.forEach(item=> {
			if(item.userData.configuration) {
				htmlArray.push(...item.sayHi());
				htmlArray.push(['_']);
			}
			else {
					var info = item.sayHi();
					if(!ordinarySet[info[1]]) ordinarySet[info[1]] = [...info];
					ordinarySet[info[1]][2] +=1;
					ordinarySet[info[1]][4] = ordinarySet[info[1]][3] * ordinarySet[info[1]][2];
			}
		})
		for(var i in ordinarySet) {
			htmlArray.push(ordinarySet[i]);
		}
		setTimeout(() => {
			const markup = createHtmlFile(htmlArray, saveAsImage(),date);
			saveString(markup, 'List.html');
			scene.children[0].position.y = 0;
			scene.background = new THREE.Color(0xa7e1fc);
			onWindowResize();
		}, 2000)
	}
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}


function onWindowResize()
{	//3dView
	var cont = document.getElementById('canvas');
	var	rect = cont.getBoundingClientRect();
	if(camera) {
		camera.aspect = rect.width/rect.height;
		camera.updateProjectionMatrix()
		renderer.setSize( rect.width, rect.height );
	}
	//2dView
	app.renderer.resize(rect.width, rect.height);
}

window.addEventListener('resize', onWindowResize);
window.onload = init;


document.getElementById('export').addEventListener("click",()=> {
	let loading = 0, currency;	
		document.getElementById("feedback").innerHTML = getComOffer;
		$("#fid").click(function(e){ if(e.currentTarget==e.target && loading == 0)$("#fid").remove();})
		$("#plsw").click(()=>{
			document.getElementsByClassName("currency").forEach(item=>{if(item.checked == true) currency=item.value;})	
			document.getElementsByClassName("com-loader")[0].style.display="flex";
			loading = 1;
			const settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=EUR&want="+currency+"&amount=1",
				"method": "GET",
				"headers": {
					"X-RapidAPI-Key": "d94f7e170fmsh735117cad7a13d2p1e90c7jsnd8767228dda7",
					"X-RapidAPI-Host": "currency-converter-by-api-ninjas.p.rapidapi.com"
				}
			};
			/*$.ajax(settings).done(function (response) {
				getHtmlDataList([response.new_amount,currency]);
				setTimeout(function () {$("#fid").remove();},  3000);
				
			});*/
			getHtmlDataList([1,currency]);
			setTimeout(function () {$("#fid").remove();},  3000);
		});
});

document.getElementById( 'export3d' ).addEventListener( 'click', function () {
	parser3d.exportGLTF(scene);
} );


$('#save').click(function() {
	let projectData = {
		objects:[],
		walls:[],
		floors:[],
		columns:[],
		blocks:[],
	}
		
		container2d.children.forEach(item => {
			projectData.objects.push(item.saveIt());
		});
		edgegroup.children.forEach(wall => {
			let wallobject = {
				p1:{x:wall.userData.vertex[0].x,y:wall.userData.vertex[0].y},
				p2:{x:wall.userData.vertex[1].x,y:wall.userData.vertex[1].y},
				width:wall.userData.width,
				windows:[],
				doors:[],
				offset: wall.userData.offset,
				height: wall.userData.height,
			};
			wall.children.forEach(opening => {
				if(opening.name == 'door') {
					wallobject.doors.push({x: opening.x, scalex: opening.userData.scalex, scaley: opening.userData.scaley, height: opening.userData.height})
				}
				if(opening.name == 'window') {
					wallobject.windows.push({x: opening.x, scale: opening.userData.scale, height: opening.userData.height,  heightoffset: opening.userData.heightoffset})
				}
			})
			projectData.walls.push(wallobject)
		})

		columngroup.children.forEach(column => {
			let columnobject = {
				position: {x:column.x, y:column.y},
				scale: {x:column.scale.x,
				},
				height: column.userData.height,
			}
			projectData.columns.push(columnobject);
		})

		blockgroup.children.forEach(block => {
			let blockobject = {
				position: {x:block.x, y:block.y},
				scale: {x:block.scale.x, y: block.scale.y},
				height: block.userData.height,
			}
			projectData.blocks.push(blockobject);
		})

		floorgroup.children.forEach(floor => {
			let floorobject = {
				position: {x:floor.x, y: floor.y},
				pointsarray: [],
			}
			floor.pointsarray.forEach(point => {
				floorobject.pointsarray.push({x:point.x, y:point.y});
			})
			projectData.floors.push(floorobject);
		})
		projectData = JSON.stringify(projectData);
		saveAs(new Blob([s2ab(projectData)],{type:"application/octet-stream"}), 'Project.modx');
		
		})



document.getElementById('cameraswitcher').addEventListener("click", ()=>{
	closeNav();
	if(dimension)
	{
		dimension=false;
		shopitems3d.remove(...shopitems3d.children);
		var promises = [];
		container2d.children.forEach(item => {
			if(item.configuration || item.userData.configuration) promises.push(item.create3D(item, shopitems3d));
			else if (item.colors) {
				promises.push(item.create3D(item));
			}
		})
		Promise.all(promises);
		parser3d.parseStructuresTo3D();
		document.getElementById('canvas').firstChild.style.display = 'none';
		document.getElementById('canvas').lastChild.style.display = '';
	}
	else
	{
		document.getElementById('canvas').firstChild.style.display = '';
		document.getElementById('canvas').lastChild.style.display = 'none';
		dimension = true;
		parser3d.clear3d();
	}
});



function saveString( text, filename ) {
	save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function save( blob, filename ) {
	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();
	// URL.revokeObjectURL( url ); breaks Firefox...
}				


const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594



function CreateMenuObject (){
	let ul = document.getElementById('listnav');
	for(let cat in Category){
		ul.innerHTML =ul.innerHTML + `
			<li>
				<button class="collapsible">${Category[cat].Name}</button>
				<div id=${cat} class="content"></div>
			</li>
		`
	let category = document.getElementById(cat);
	for(let key in ConfigurableList){
		if(cat == ConfigurableList[key].Category)
		category.innerHTML = category.innerHTML + `
					<div class="objname">
						${ConfigurableList[key].Name}
					</div>
			<div class="object" style="border: 1px solid black;">
				<div class="config_button" id="${key}">
					<img class="bar-icon par_sit" src="Media/SVG/SetParametrN.svg">
				</div>
				<div class="draggable CF" id="${key}" data-type="Configurable">
					
					<img class="img_col" src="${ConfigurableList[key].Image}">
				</div>
			</div>
	`}

	for(let key in OrdinaryObjects){
		if(cat == OrdinaryObjects[key].Category)
		category.innerHTML = category.innerHTML + `
			<div class="objname">
					${OrdinaryObjects[key].Name}
			</div>
			<div class="object" style="border: 1px solid black;">
				<div class="draggable NC" id="${key}" data-type="Ordinary">
					
					<img class="img_col" src="${OrdinaryObjects[key].Image}">
				</div>
			</div>
	`}
 
	}
	dropDownSetHeight();	
	activateCatalogFunction();	
}

function dropDownSetHeight() {
	var coll = document.getElementsByClassName("collapsible");
	console.log(coll);
	for (var i = 0; i < coll.length; i++) {
		coll[i].nextElementSibling.style.maxHeight =  null;
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
}

function activateCatalogFunction() {

	$(".draggable").hover(function() { $(this).parent().css( "border", "solid #FF9900 1px" );}, 
	function(){ $(this).parent().css( "border", "solid black 1px" );}

	);

	$(".NC").click(function() {
		itemcontroller.addItem($(this).attr("id"));
	});


	$(".CF").click(function() {
		switch($(this).attr("id")) {
			// case 'LOKOLOGIS': configuratorview = new LokoLogis(container2d, app); break;
			// case 'LOKOFRESH': configuratorview = new LokoFresh(container2d, app); break;
			// case 'ECOLOGIS': configuratorview = new EcoLogis(container2d, app); break;
			// case 'LOKOACCESSORIES': configuratorview = new LokoAccessories(container2d, app); break;
			// case 'SHELF': configuratorview = new Shelf(container2d, app); break;
			// case 'DOUBLESHELF': configuratorview = new DoubleShelf(container2d, app); break;
			// case 'FRIDGE': configuratorview = new Fridge(container2d, app); break;
			case 'CHECKOUT': configuratorview = new CheckOut(container2d, app); break;
		}
		configuratorview.startConfigurator();	
	});
}


function openNav() {document.getElementById("Sidenav").style.width = "239px";}
function closeNav() {
		document.getElementById("Sidenav").style.width = "0"; 
		$(".Nav").addClass('button_nav'); 
		$(".Nav").removeClass('button_nav_s');
		disabalEdit();
	}

function SetSideMenu(item){
 $(item).addClass('button_nav_s');
 $(item).removeClass('button_nav');
 $("#Sidenav").empty();
switch (item.id){
	case "nav-4":{
		$("#Sidenav").append(catalogMenu);
 		CreateMenuObject();
		break;
	}
	case "nav-3":{
		$("#Sidenav").append(wallMenu);
		dropDownSetHeight();
		$("#blueprint").change(e=>{
						backdrop.onBlueprintChange(e)
						dropDownSetHeight();
		});
		$("#editbp").click(()=>backdrop.bpedit());
		$('.wallCF').click(e=>wallControl(e));
		$('.doorCF').click(e=>doorControl(e));
		$('#structureTransparency').change(e => {
			//console.log(e.target.value);
			builder.setStructureAlpha(e.target.value);
		});
		$('#WallsHeight').change(e => {
			builder.setGlobalWallHeightTo(e.target.value);
		});
		$('#NextWallHeight').change(e => {
			builder.setWallHeightTo(e.target.value);
		});

		$('.rullerCF').click(e=>rullerControl(e));
		$('.snapCF').click(e=>snapControl(e));
		if(backdrop.getBD()) {
			$('#editbplabel').css("display", "flex");
			dropDownSetHeight();   
		}
		break;
	}	
}
ActivateMode(0);
 $("#close-nav").click(()=>closeNav());
}

function disabalEdit(){
	OffSelectedWallControl();
	ActivateMode(0);
}

function ActivateMode(id){
	switch(id) {
		case 'radio-wall':
			builder.setMod(0);
			builder.setWallType(1);
			ruler.deactivate();
			floordrower.deactivate();
			app.userData.mod = 2;
			break;
		case 'radio-floor':
			floordrower.activate();
			builder.setMod(1);
			app.userData.mod = 3;
			break;
		case 'radio-columnS':
			builder.setMod(0);
			builder.setWallType(2);
			ruler.deactivate();
			floordrower.deactivate();
			app.userData.mod = 4;
			break;
		case 'radio-columnR':
			builder.setMod(0);
			builder.setWallType(3);
			ruler.deactivate();
			floordrower.deactivate();
			app.userData.mod = 5;
			break;
		case 'radio-door':
			builder.setMod(1);
			builder.spawnDoor();
			ruler.deactivate();
			app.userData.mod = 6;
			break;
		case 'radio-window':
			builder.setMod(1);
			builder.spawnWindow();
			ruler.deactivate();
			floordrower.deactivate();
			app.userData.mod = 6;
			break;
		case 'radio-ruler':
			ruler.activate();
			builder.setMod(1);
			floordrower.deactivate();
			app.userData.mod = 1;
			break;
		default:
			builder.setMod(1);
			ruler.deactivate();
			floordrower.deactivate();
			floordrower.closeFigure();
			app.userData.mod = 0;
			break;
	} 
}

function rullerControl(item){
	if ($(item.currentTarget).hasClass('close-main-menus')){
		$(item.currentTarget).removeClass('close-main-menus');
		ActivateMode(0);
	}
	else{
		$(item.currentTarget).addClass('close-main-menus');
		ActivateMode(item.currentTarget.id);
	}
	$(".wallCF").removeClass('wall_buttons');
	$(".wallCF").addClass('wall_button');
}

function SelectedWallControl(item){
		$(".wallCF").removeClass('wall_buttons');
		$(".wallCF").addClass('wall_button');
		$(item).removeClass('wall_button');
		$(item).addClass('wall_buttons');
		if(item.id=="radio-wall")
			$("#WallControlsDisplay").removeClass('hide');
		else
			$("#WallControlsDisplay").addClass('hide');

}

function OffSelectedWallControl(){
		$(".wallCF").removeClass('wall_buttons');
		$(".wallCF").addClass('wall_button');
		$("#WallControlsDisplay").addClass('hide');


}

function wallControl(item){
	if ($(item.currentTarget).hasClass('wall_buttons')){
		OffSelectedWallControl(item.currentTarget);
		ActivateMode(0);
	}
	else{
		SelectedWallControl(item.currentTarget)
		console.log(item.currentTarget.id);
		ActivateMode(item.currentTarget.id);
	}
	$(".rullerCF").removeClass('close-main-menus');
}

function doorControl(item){
	ActivateMode(item.currentTarget.id);
	OffSelectedWallControl()
	$(".rullerCF").removeClass('close-main-menus');
	
}


$(".Nav").click(function() {
	$(".Nav").addClass('button_nav');
 	$(".Nav").removeClass('button_nav_s');			
		openNav();
		document.getElementById('cameraswitcher').disabled = false;
		document.getElementById('lock').className= "dropdown" ;	
		SetSideMenu(this);
})

$("#cameraswitcher").click(function() {	
	if ($(this).hasClass('active3D')){	
		CamAct()
		$(this).removeClass('active3D');
	}
		
	else{	
		CamDiact()
		$(this).addClass('active3D');
	}
})

function CamDiact() {
	closeNav();
	app.canMove = 0;
	$(".Nav").attr('disabled', true);
	$("#hidescale").css('display', "none");
	var top_button = document.getElementsByClassName("lock");
	for (var i=0; i<top_button.length; i++){
			top_button[i].disabled = false;
		}
}

function CamAct() {
	app.canMove = 1;
	$(".Nav").attr('disabled', false);
	$("#hidescale").css('display', "flex");
	disabalEdit();
}
	

$("#feedbackRequest").click(function() {
	document.getElementById("feedback").innerHTML = feedback;
	
	$("#fid").click(function(e){ if(e.currentTarget==e.target)$("#fid").remove();})

	window.emailjs.init('esAxAOYSmuy0eUmJg');
	$("#plsw").click(function(event) {
	event.preventDefault(); 
	//obj start
	let projectData = {
		objects:[],
		walls:[],
		floors:[],
		columns:[],
		blocks:[],
	}
		container2d.children.forEach(item => {
			projectData.objects.push(item.saveIt());
		});
	if(projectData  != '') {
		projectData = JSON.stringify(projectData );
	}


	//obj end

	//html start
	var htmlArray = [];
	var ordinarySet = {};
		container2d.children.forEach(item=> {
			if(item.configuration) {
				htmlArray.push(...item.sayHi());
				htmlArray.push(['_']);
			}
			else {
					//console.log(item.name);
					var info = item.sayHi();
					if(!ordinarySet[info[1]]) ordinarySet[info[1]] = [...info];
					ordinarySet[info[1]][2] +=1;
					ordinarySet[info[1]][4] = ordinarySet[info[1]][3] * ordinarySet[info[1]][2];
			}
		})
		//console.log(ordinarySet);
		for(var i in ordinarySet) {
			//console.log(ordinarySet[i])
			htmlArray.push(ordinarySet[i]);
		}
		const markup = createHtmlFileLite(htmlArray,currencyCoof);
	//html end


	//sender
	const reader = new FileReader();
	reader.readAsDataURL(new Blob([s2ab(projectData)],{type:"application/octet-stream"}));
	reader.onload = function() {
		const reader1 = new FileReader();
		reader1.readAsDataURL(new Blob([s2ab(markup)],{type:"application/octet-stream"}));
		reader1.onload = function() {
		window.emailjs.send('service_rjl35pa', 'template_ztt7p5p', {
			user_name :	document.getElementsByName("user_name")[0].value,
			user_phone:	document.getElementsByName("user_phone")[0].value,
			user_company: document.getElementsByName("user_company")[0].value,
			user_email:	document.getElementsByName("user_email")[0].value,
			message: document.getElementsByName("message")[0].value,
			variable_pdzvk8x: reader.result, // variable_pdzvk8x txt{} variable_8b27hp4 html
			variable_8b27hp4: reader1.result,
			
		})
			.then(function() {
				//console.log('SUCCESS!');
				document.getElementById('plsw').value="Sent";
				setTimeout(function () {$("#fid").remove();},  5000);
				
			}, function(error) {
				document.getElementById('plsw').value="Something went wrong";
				setTimeout(function () {$("#fid").remove();},  1000);
				//console.log('FAILED...', error);
				
			});	
		}
	}
	
	});
});


$('#newPJ').click(function() {
	$('.hide-nav-controls').css("display", "flex");
	$('.init-but-cont').css("top", "-200px");
	$('.logo-icon').css({"left": "40px", "top":"auto", "width":"100px"});
	$('.RightHead').css("display","block");
	$('.logo-bar').css({"height":"60px", "background-color":"#FF9900"});
	$('.hide-nav-controls').css("height","60px");
	$('#loadscreen3').css("height", "0%");
})

$('#loadPJ').change(function() {
	$('.hide-nav-controls').css("display", "flex");
	$('.init-but-cont').css("top", "-200px");
	$('.logo-icon').css({"left": "40px", "top":"auto", "width":"100px"});
	$('.RightHead').css("display","block");
	$('.logo-bar').css({"height":"60px", "background-color":"#FF9900"});
	$('.hide-nav-controls').css("height","60px");
	$('#loadscreen3').css("height", "0%");
	var fr=new FileReader();
	let decoded;
	fr.onload=function(){
		decoded = JSON.parse(fr.result);
		decoded.objects.forEach(item => {
				console.log(item);
				if(item.name) itemcontroller.addItem(item.name,"",item.x,item.y,item.rotation,item.colors);
				else {
					switch(item.userData.name) {
						// case "LOKOLOGIS": configuratorview = new LokoLogis(container2d, app); break;
						// case "LOKOFRESH": configuratorview = new LokoFresh(container2d, app); break;
						// case "ECOLOGIS": configuratorview = new EcoLogis(container2d, app); break;
						// case "LOKOACCESSORIES": configuratorview = new LokoAccessories(container2d, app); break;
						// case "SHELF": configuratorview = new Shelf(container2d, app); break;
						// case "DOUBLESHELF": configuratorview = new DoubleShelf(container2d, app); break;
						// case "FRIDGE": configuratorview = new Fridge(container2d, app); break;
						case "CHECKOUT": configuratorview = new CheckOut(container2d, app); break;
					}
					configuratorview.loadPostBox(item);
					configuratorview.spawnConfigurated();
				}
		})
		builder.testLoadFromJson(decoded);
		floordrower.testLoadFromJson(decoded);
	document.getElementById('cameraswitcher').disabled = false;
	document.getElementById('lock').className= "dropdown" ;
	}
	  
	fr.readAsText(document.getElementById('loadPJ').files[0]);
})


document.addEventListener('keydown', (e) => {
	if(e.code=='ShiftLeft') app.userData.snapvert = true;
	if ($(".snapCF")){
	$(".snapCF").addClass('close-main-menus');
	}
});

document.addEventListener('keyup', (e) => {
	if(e.code=='ShiftLeft') app.userData.snapvert = false;
	if ($(".snapCF")){
		$(".snapCF").removeClass('close-main-menus');
	}
})

document.addEventListener('keydown', (e) => {
	if(e.code=='ControlLeft') app.userData.snapwall = true;
	if ($(".snapCF")){
	$(".snapCF").addClass('close-main-menus');

	}
});

document.addEventListener('keyup', (e) => {
	if(e.code=='ControlLeft') app.userData.snapwall = false;
	if ($(".snapCF")){
		$(".snapCF").removeClass('close-main-menus');
	}
})


function snapControl(item){
	if ($(item.currentTarget).hasClass('close-main-menus')){
		$(item.currentTarget).removeClass('close-main-menus');
		app.userData.snapvert = false;
	}
	else{
		$(item.currentTarget).addClass('close-main-menus');
		app.userData.snapvert = true;
	}
}