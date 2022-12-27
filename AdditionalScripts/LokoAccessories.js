import * as THREE from '../jsm/three.module.js';
import {OrbitControls } from '../jsm/controls/OrbitControls.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {Functions} from './FunctionsForConf.js';
import {Furniture} from './DataSet.js';
import {getPostCoef} from './Coefs.js';
import {MainWindow, colorSelect, addStackButtons, depthSelector, RBMmenuConf, ItemCatalogAcces} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList,Category} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.LOKOACCESSORIES.Elements;
const listBorders = ConfigurableList.LOKOACCESSORIES.ElementsBorders;
const needToFixIt = "LOKOACCESSORIES";

var LokoAccessories = function(container2d, app) 
{
    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let arr_build=[];
    let timer;
    var hdrCubeRenderTarget;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#option").append(depthSelector);
        $("#PostBoxconf").append(addStackButtons);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
            configurateItem();
        })
        $(".add-right").click(function() {
            add_Conf_stack("right");
            configurateItem();
            
        });
        $(".add-left").click(function() {
            add_Conf_stack("left");
            configurateItem();
        });


        $("#spawnconfigurated").click(function(){
            spawnConfigurated();
            hideConfigurator();
            arr_build = ClearArray ();
            $("#confarea").remove();
          });
        
        $(".closeconf").click(function(){
            $("#confarea").remove();
            hideConfigurator();
            StackControl=0;
            
            arr_build = ClearArray();
        
        });
    }



    function startConfigurator(){
        selectedItem = null;
        setUpInterface();
        clean_conf_stack();    
        add_Conf_stack("right",'SetBRP');
		showConfigurator();
    }


    function reloadConfigurator(item){
        clean_conf_stack();
        setUpInterface();
        item.configuration.forEach(item=>{
            add_Conf_stack("right",item);
        })        

        //color set
        const colorSet = document.querySelectorAll('input[name="test"]');
        const selected_color=item.colors.join(' ');
        colorSet.forEach(i=> {if(selected_color == i.value) 
                                       i.checked = true;
                            });
         
        //depth set                    
        const depthSet = document.querySelectorAll('input[name="dept"]');
        depthSet.forEach(i=> {if(item.depth == i.value) 
                                        i.checked = true;
                            });


        showConfigurator();
        configurateItem();
    }


    function CarrentValue (arr, searchFor){
        return arr[arr.findIndex(e => e.id == searchFor)].value;
    }


    function AddToArray (arr, Push, place="right"){
        if (place == "right")
        arr.push(Push);
        else
        arr.unshift(Push);
    }


    function RemoveFromArray (arr, itemId){
    return arr.filter(e => e.id != itemId);
    }


    function ClearArray (){
        return	[];
    }

    
    function UpDateValueInArray (arr,itemId,newValue){
        arr[arr.findIndex(obj => obj.id ==itemId)].value=newValue;
    }


    function clean_conf_stack()
    {
    var buttons = document.getElementsByClassName('caru-box');
    for (var  i=buttons.length-1; i>=0; i--)
            buttons[i].remove();
    }


    function CreateButtonControl ()
    {
            document.getElementById("spawnconfigurated").disabled = false;

    }


    function CloseF(e){
        var id =e.target.id.replace(/[^0-9]/g,'');
        $("#Collecton"+id).remove();
        arr_build = RemoveFromArray(arr_build, id);  
        CreateButtonControl();
        configurateItem();
    }

    

    function add_Conf_stack (side="right", itemToInsert="SetB")
    {
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;
        for (let key in listBorders){   
            if (listBorders[key].includes(itemToInsert)){
                //console.log(key);
                buttonType=key;
                break;
            }
        }

        if (arr_build.length > 0){
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>
                           <div id="alt${StackControl}">${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount}</div>`;
            itemToInsert=arr_build[0].value;
            }
        else
            CloseButton =`
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
                <div class="name-tag"> ${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                    ${ItemCatalogAcces("LOKOACCESSORIES",StackControl,listBorders.All)}
                </div>
            </div>    
            `
        CreateButtonControl();
        

        const first_in = document.getElementsByClassName('add-left')[0];
        const last_in = document.getElementsByClassName('add-right')[0]; 
        var div = document.createElement('div');
        div.setAttribute('id', "Collecton"+StackControl);
        div.setAttribute('class', 'caru-box');
        side =="right" ? last_in.before(div) : first_in.after(div);
        let added=`
            <img class="img_selector" id="Img${StackControl}" alt="${itemToInsert}" src="${list[itemToInsert].imageName}">
            ${CloseButton}
        `
        div.innerHTML=added;
    
        if (arr_build.length > 0)
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>CloseF(e));
        AddToArray(arr_build,{id:StackControl, value: itemToInsert}, side =="right" ? "right" : "left");
        $(".obj-item").click((e)=>SelectStack(e));
    }


    function SelectStack(e){
        const id = e.target.id.split("_");
        for(let i=0;i<arr_build.length;i++)
        {
        $("#Img"+arr_build[i].id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+arr_build[i].id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        }
        UpDateValueInArray(arr_build,...id);
        configurateItem();
    }




var confreqv;

function onWindowResize()
{	//3dView
    var cont = document.getElementById('canvas');
    var	rect = cont.getBoundingClientRect();
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


function showConfigurator()
{		
    const id = needToFixIt;
	prscene = new THREE.Scene();
	prscene.background = new THREE.Color(0xCBCED6);
	prrect = sceneElement.getBoundingClientRect();
	prscene.userData.element = sceneElement;
	prcamera = new THREE.PerspectiveCamera( 50, 1, 0.1, 10 );
	prcamera.position.z = 2;
	prcamera.position.y = 0.5;
	prscene.userData.camera = prcamera;

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
	directionalLight.position.set( -3, -3, 3 );
    prscene.add( directionalLight );

	const alight = new THREE.AmbientLight( 0xffffff, 0.3 );
	prscene.add( alight );
	
	prrenderer = new THREE.WebGLRenderer({ antialias: true});
	prrenderer.setSize( prrect.width, 400 );
	sceneElement.appendChild(prrenderer.domElement);
	
    prrenderer.physicallyCorrectLights = true;
	prrenderer.toneMapping = THREE.ACESFilmicToneMapping;
	prrenderer.toneMappingExposure = 3;
    
	prgroup = new THREE.Group();
	prscene.add(prgroup);


	preloadMeshesObject(id);
    //console.log(id);
	
	prcontrols =  new OrbitControls(prcamera, prrenderer.domElement);
	//prcontrols.screenSpacePanning = false;
	//prcontrols.minDistance = 4;
	prcontrols.maxDistance = 20;
	//prcontrols.maxPolarAngle = Math.PI / 3;
	
	//prcamera.position.z = 2;
    prcamera.position.set(-2.5, 2.5, 2.5);

    prcontrols.target = new THREE.Vector3(0, 0.7, 0);
    prcontrols.update();

	confreqv = window.requestAnimationFrame(pranimate);
	onWindowResize();
	if (+$(".configurator").css('height').replace(/px/i, '') > 698) {$(".configurator, .loader2").css('top', window.innerHeight/2-350); }
}

function hideConfigurator()
{
	sceneElement.removeChild(prrenderer.domElement);
	prscene = null;
	prcamera = null;
	prrenderer = null;
	window.cancelAnimationFrame(confreqv);
	//var spawn = document.getElementById('spawnconfigurated');
	//spawn.removeEventListener('click', ()=>spawnConfigurated());
}

function pranimate()
{
	prcontrols.update();
	if(prrenderer)
	{
        
    if(prgroup.children[0]){
        prgroup.children[0].children.forEach(obj => {
            if(obj.name === "billboardL") {
                var dx = prcamera.position.x - obj.position.x;
                var dy = prcamera.position.z - obj.position.z;
                var rotation = Math.atan2(dy, dx);
                obj.rotation.set(0,-rotation+Math.PI/2,0);
            }
            if(obj.name === "billboardH") {
                var dx = prcamera.position.x - obj.position.x;
                var dy = prcamera.position.z - obj.position.z;
                var rotation = Math.atan2(dy, dx);
                obj.rotation.set(0,-rotation+Math.PI/2,-Math.PI/2);
            }
        })
    }

	prrenderer.render(prscene, prcamera);
	window.requestAnimationFrame( pranimate );
	}
};



var preloadedMeshes = {};
var sprites=[];
var renderedsprite = null;
var menuDiv;
var clickTimer = null;

function localWorld(item)
{
    var p = {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};
    return p;
}


function preloadMeshesObject(id)
{
    //console.log("Preloading "+id);
    preloadedMeshes = {};
    const loader = new GLTFLoader();
        loader.load(
            '../../sprites/configurator/'+id+'/'+'CORN.glb',
            function(gltf){
                for(var i = 0; i<gltf.scene.children.length; i++)
                {
                    preloadedMeshes[gltf.scene.children[i].name] = gltf.scene.children[i];
                }
                configurateItem();
                document.getElementById("loadscreen2").style.display="none";
            },
            function ( xhr ) {
                if(typeof(xhr.loaded / xhr.total)=='number' && xhr.loaded / xhr.total!="Infinity") {
                    $("#loadingPR").html(Math.round( xhr.loaded / xhr.total * 100 ) + '%' );
                }
                else
                $("#loadingPR").html("In progress");
            },
            function ( error ) {
                console.log( 'An error happened' );
            });
} 
    
function formItemsArray() {
    return arr_build.map(item=> item.value);
}

function configurateItemObject()
{		
    var dist=0;
    var seq = formItemsArray();
    let depth = $("input[name='dept']").filter(":checked").val();
    var offset = '';
    if(depth==500) offset = 'N';
    //console.log(seq);
    var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
    for(var i = 0; i<seq.length; i++)
    {
        var mesh = meshesObject[seq[i]+offset].clone();
        prgroup.add(mesh);
        mesh.children[0].material.color.r = colors[0]/255;
        mesh.children[0].material.color.g = colors[1]/255;
        mesh.children[0].material.color.b = colors[2]/255;   
        mesh.translateX(0.49/2+dist);
        dist += 0.49;
    }
    prgroup.children.forEach( item => {item.position.x-=dist/2;});
    prcamera.position.z = 5;
    prcamera.position.y = 1.2;
    spriteItem(seq,colors,depth);
}

function spriteItem(seq, colors, depth, x=0, y=0, rot=0) {
    const offset = depth==700?'':'N';
    renderedsprite = new PIXI.Container();
    renderedsprite.x = x;     renderedsprite.y = y;     renderedsprite.rotation = rot;
    renderedsprite.name = "LOKOACCESSORIES";
    renderedsprite.depth = depth;
    renderedsprite.userData = {};
    renderedsprite.userData.nameTag = "";
    renderedsprite.sayHi = function() {
        const N = this.depth == 700?'7':'5';
        var arr = [];
        var color = getColorCode(this.colors)
        arr.push([this.name+' '+ color])
        if(this.configuration[0] == 'SetBRP') {
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name, this.configuration.length, Furniture['PlantD'+N].price, this.configuration.length*Furniture['PlantD'+N].price]);
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name, this.configuration.length, Furniture['BanchD'+N].price, this.configuration.length*Furniture['BanchD'+N].price]);
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name, this.configuration.length, Furniture['RoofD'+N].price, this.configuration.length*Furniture['RoofD'+N].price]);
        }
        if(this.configuration[0] == 'SetBR') {
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name, this.configuration.length, Furniture['BanchD'+N].price, this.configuration.length*Furniture['BanchD'+N].price]);
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name, this.configuration.length, Furniture['RoofD'+N].price, this.configuration.length*Furniture['RoofD'+N].price]);
        }
        if(this.configuration[0] == 'SetBP') {
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name, this.configuration.length, Furniture['BanchD'+N].price, this.configuration.length*Furniture['BanchD'+N].price]);
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name, this.configuration.length, Furniture['PlantD'+N].price, this.configuration.length*Furniture['PlantD'+N].price]);
        }
        if(this.configuration[0] == 'SetRP') {
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name,this.configuration.length, Furniture['RoofD'+N].price, this.configuration.length*Furniture['RoofD'+N].price]);
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name,this.configuration.length, Furniture['PlantD'+N].price, this.configuration.length*Furniture['PlantD'+N].price]);
        }
        if(this.configuration[0] == 'SetB') {
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name,this.configuration.length, Furniture['BanchD'+N].price, this.configuration.length*Furniture['BanchD'+N].price]);
        }
        if(this.configuration[0] == 'SetR') {
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name,this.configuration.length, Furniture['RoofD'+N].price, this.configuration.length*Furniture['RoofD'+N].price]);
        }
        if(this.configuration[0] == 'SetP') {
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name,this.configuration.length, Furniture['PlantD'+N].price, this.configuration.length*Furniture['PlantD'+N].price]);
        }
        var fullPrice=0;
        for(var i = 1; i<arr.length; i++) {
            fullPrice+=+arr[i][4]*100;
        }
        arr[0].push('','',fullPrice/100,fullPrice/100);

        return(arr);
    }

    renderedsprite.clone = function() {
        selectedItem = null;
        renderedsprite = spriteItem(this.configuration, this.colors, this.depth, this.x+20, this.y+20, this.rotation);
        spawnConfigurated();
    }

    renderedsprite.saveIt = function() {
        var thisObject = {
            name:this.name,
            configuration: this.configuration,
            colors: this.colors,
            x:this.x,
            y:this.y,
            rotation:this.rotation,
            depth:this.depth,
        }
        return thisObject;
    }
    renderedsprite.create3D = asyncLoadLokoAccesories;

    if(seq[0]=='SetBRP') renderedsprite.depth = 750;
    if(seq[0]=='SetBR') renderedsprite.depth = 550;
    if(seq[0]=='SetBP') renderedsprite.depth = 600;
    if(seq[0]=='SetRP') renderedsprite.depth = 250;
    if(seq[0]=='SetB') renderedsprite.depth = 500;
    if(seq[0]=='SetR') renderedsprite.depth = 50;
    if(seq[0]=='SetP') renderedsprite.depth = 200;

    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var dist=0;
    renderedsprite.colors = colors;
    renderedsprite.configuration = seq;
    for(var i = 0; i<seq.length; i++)
    {
        var sprite = new PIXI.Sprite.from("sprites/configurator/LOKOACCESSORIES/PixiPreview/"+seq[i]+offset+".svg");
        const text = new PIXI.Text(ConfigurableList.LOKOACCESSORIES.Elements[seq[i]].name2D.replaceAll('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
        text.anchor.set(0.5);
        sprite.addChild(text);
        renderedsprite.addChild(sprite);    
        sprite.anchor.set(0.5);
        sprite.x+=(getBanchCoef(1)*32+dist*64);
        dist += getBanchCoef(1);
    }

    renderedsprite.breadth = dist;

    renderedsprite.children.forEach(item=>item.position.x-=dist*32);
    renderedsprite.children[0].x = -dist*32; 
    renderedsprite.children[1].x = dist*32;  
    renderedsprite.children[2].x = -dist*32; 
    renderedsprite.children[3].x = dist*32;  

    //console.log(seq[0]+offset);
    if(seq[0]=='SetB') {
        renderedsprite.children[0].y = -16;
        renderedsprite.children[1].y = -16;
        renderedsprite.children[2].y = 16;
        renderedsprite.children[3].y = 16;
    }  

    if(seq[0]=='SetBRP') {
        renderedsprite.children[0].y = -46;
        renderedsprite.children[1].y = -46;
        renderedsprite.children[2].y = 3;
        renderedsprite.children[3].y = 3;
    }
    if(seq[0]=='SetBP') {
        renderedsprite.children[0].y = -43;
        renderedsprite.children[1].y = -43;
        renderedsprite.children[2].y = 4;
        renderedsprite.children[3].y = 4;
    }
    if(seq[0]=='SetBR') {
        renderedsprite.children[0].y = -47;
        renderedsprite.children[1].y = -47;
        renderedsprite.children[2].y = -9;
        renderedsprite.children[3].y = -9;
    }
    if(seq[0]=='SetR') {
        renderedsprite.children[0].y = -46;
        renderedsprite.children[1].y = -46;
        renderedsprite.children[2].y = -42;
        renderedsprite.children[3].y = -42;
    }
    if(seq[0]=='SetRP') {
        renderedsprite.children[0].y = -46;
        renderedsprite.children[1].y = -46;
        renderedsprite.children[2].y = -30;
        renderedsprite.children[3].y = -30;
    }
    if(seq[0]=='SetP') {
        renderedsprite.children[0].y = -5;
        renderedsprite.children[1].y = -5;
        renderedsprite.children[2].y = 5;
        renderedsprite.children[3].y = 5;
    }
    if(seq[0]=='SetB' && offset=="N") {
        renderedsprite.children[0].y = -11;
        renderedsprite.children[1].y = -11;
        renderedsprite.children[2].y = 11;
        renderedsprite.children[3].y = 11;
    }  
    if(seq[0]=='SetBRP' && offset=="N") {
        renderedsprite.children[0].y = -39;
        renderedsprite.children[1].y = -39;
        renderedsprite.children[2].y = -4;
        renderedsprite.children[3].y = -4;
    }
    if(seq[0]=='SetBP' && offset=="N") {
        renderedsprite.children[0].y = -31;
        renderedsprite.children[1].y = -31;
        renderedsprite.children[2].y = 1;
        renderedsprite.children[3].y = 1;
    }
    if(seq[0]=='SetBR' && offset=="N") {
        renderedsprite.children[0].y = -39;
        renderedsprite.children[1].y = -39;
        renderedsprite.children[2].y = 10;
        renderedsprite.children[3].y = 10;
    }
    if(seq[0]=='SetR' && offset=="N") {
        renderedsprite.children[0].y = -37;
        renderedsprite.children[1].y = -37;
        renderedsprite.children[2].y = -34;
        renderedsprite.children[3].y = -34;
    }
    if(seq[0]=='SetRP' && offset=="N") {
        renderedsprite.children[0].y = -39;
        renderedsprite.children[1].y = -39;
        renderedsprite.children[2].y = -26;
        renderedsprite.children[3].y = -26;
    }
    if(seq[0]=='SetP' && offset=="N") {
        renderedsprite.children[0].y = -1;
        renderedsprite.children[1].y = -1;
        renderedsprite.children[2].y = 2;
        renderedsprite.children[3].y = 2;
    }

    var tint = Category[ConfigurableList.LOKOLOGIS.Category].Color;
    renderedsprite.children.forEach(ch => {
        ch.tint = tint;
    })

    return renderedsprite;
}



function getBanchCoef(id)
{
    switch(id)
    {
        case 1: return 0.49;
        case 2: return 0.2;
    }
}


function showContextMenu(x,y)
{
    let menuDiv = document.createElement("div");
    menuDiv.id = "ORClick";
    menuDiv.className = "OR-cover";

    menuDiv.innerHTML = RBMmenuConf;
    document.body.appendChild(menuDiv);
    $("#menu").css({"position":"absolute","top":y+"px","left":x+30+"px"});
    $("#ORclose").click(()=>{hideContextMenu()});
    $("#ORremove").click(()=>{container2d.removeChild(selectedItem); hideContextMenu();});
    $("#copyObject").click(()=>{selectedItem.clone(); hideContextMenu();});
    $("#ORrotate").on("input change",(item)=>{selectedItem.rotation = (+item.target.value/180*Math.PI);});
    $("#nameTag").val(selectedItem.userData.nameTag);
    $("#nameTag").on("input change",(item)=>{selectedItem.userData.nameTag=item.target.value});
    $("#ORClick").click(function(e){ if(e.currentTarget==e.target)$("#ORClick").remove();})
    $("#ORconf").click(()=>{
        hideContextMenu();
        reloadConfigurator(selectedItem);     
    });
    $("#depthST").text(selectedItem.depth==700? "Depth: 0.70 m" : "Depth: 0.50 m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*selectedItem.depth/1000)*100)/100 + "m&#178");
    $("#lengthST").text("Length: " + Math.round(selectedItem.breadth*100)/100 + "m");
}



function hideContextMenu()
{
    document.getElementById("ORClick").remove();
}

    
function configurateItem(id)
{
    prgroup.remove(...prgroup.children);
    var item = {
        configuration:formItemsArray(),
        colors:document.querySelector('input[name="test"]:checked').value.split(' '),
        depth: $("input[name='dept']").filter(":checked").val(),
    }
    //configurateFreshBoxObject();
    asyncLoadLokoAccesories(item,prgroup,preloadedMeshes);
    spriteItem(item.configuration, item.colors,item.depth, 0,0,0);
}

function spawnConfigurated() {
    if(selectedItem) {
        renderedsprite.x = selectedItem.x;
        renderedsprite.y = selectedItem.y;
        renderedsprite.rotation = selectedItem.rotation;
        container2d.removeChild(selectedItem);
    }
    container2d.addChild(renderedsprite);
    renderedsprite.interactive = true;
    renderedsprite.buttonMode = true;

   
renderedsprite
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


    async function asyncLoadLokoAccesories(item, _shopitems3d, preloadedMeshes)
	{
        if(preloadedMeshes) {
            const pmremGenerator = new THREE.PMREMGenerator( prrenderer );
            hdrCubeRenderTarget = pmremGenerator.fromCubemap( app.userData.hdrCubeMap );
            pmremGenerator.compileCubemapShader();
        }
        else {
            const pmremGenerator = new THREE.PMREMGenerator( app.userData.renderer );
            hdrCubeRenderTarget = pmremGenerator.fromCubemap( app.userData.hdrCubeMap );
            pmremGenerator.compileCubemapShader();
        }
        var meshesObject = {};
        if(preloadedMeshes) {
            meshesObject = preloadedMeshes;
        }
        else {
            const gltfData = await modelLoader('../../sprites/configurator/LOKOACCESSORIES/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
		var _group = new THREE.Group();
		_shopitems3d.add(_group);

		var dist=0;
		var seq = item.configuration;
        let depth = item.depth;
        var offset = '';
        if(depth==500) offset = 'N';
		var colors = item.colors;
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshesObject[seq[i]+offset].clone();
			_group.add(mesh);
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;   
			mesh.translateX(0.49/2+dist);
            // let renderTarget = hdrCubeRenderTarget;
            // console.log(renderTarget);
            // const newEnvMap = renderTarget ? renderTarget.texture : null;
            // console.log(mesh);
            // if (newEnvMap)
            // {
            //     mesh.children.forEach(ch=>{
            //         ch.castShadow = true;
            //         console.log(ch);
            //         ch.material.envMap = newEnvMap;});
            // }
			dist += 0.49;
		}
        let renderTarget = hdrCubeRenderTarget;
        const newEnvMap = renderTarget ? renderTarget.texture : null;
        _group.children.forEach(child => {
            if (newEnvMap) {
                //console.log('in if loop')
                //child.material.envMap = newEnvMap;
                child.children.forEach(ch=>{
                    //console.log(ch.material);
                    //ch.castShadow = true;
                    ch.material.envMap = newEnvMap;
                })
            }
        });
		if(!preloadedMeshes) _group.rotation.set(Math.PI/2,-item.rotation,0);
		if(item.position) _group.position.set(item.x/64, -item.y/64, 0);
		_group.children.forEach( item => {item.position.x-=dist/2;});

        if(preloadedMeshes) Functions.addDimensions( _group );

        return
	}


this.configurateItem = configurateItem;
this.preloadMeshes = preloadMeshesObject;
this.spawnConfigurated = spawnConfigurated;
this.loadPostBox = spriteItem;
this.startConfigurator = startConfigurator;

};

LokoAccessories.prototype = Object.create( EventDispatcher.prototype );
LokoAccessories.prototype.constructor = LokoAccessories;

export {LokoAccessories}

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

function modelLoader(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject);
    });
}