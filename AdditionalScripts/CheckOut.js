import * as THREE from '../jsm/three.module.js';
import {OrbitControls } from '../jsm/controls/OrbitControls.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {Functions} from './FunctionsForConf.js';
import {Checkout} from './DataSet.js';
import {getPostCoef} from './Coefs.js';
import {MainWindow, colorSelect, addStackButtons, RBMmenuConf, CopyButton, ItemCatalog} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.CHECKOUT.Elements;
const listBorders = ConfigurableList.CHECKOUT.ElementsBorders;
const needToFixIt = "CHECKOUT";
let timer;
var CheckOut = function(container2d, app) 
{
    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let arr_build=[],CopyThisConfigeration=[];
   
	var hdrCubeRenderTarget;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#PostBoxconf").append(addStackButtons);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
            configurateItem();
        })
        $(".add-right").click(function() {
            add_Conf_stack("right",...CopyThisConfigeration);
            configurateItem();
            
        });
        $(".add-left").click(function() {
            add_Conf_stack("left",...CopyThisConfigeration);
            configurateItem();
        });


        $("#spawnconfigurated").click(function(){
            configurateItem();
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
        add_Conf_stack("right");
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


        showConfigurator();
        configurateItem();
    }

    function CopyStack(item){
        if($(item.currentTarget).hasClass('active-copy')){
            $(".active-copy").addClass('deactive-copy');
            $(".active-copy").removeClass('active-copy');
            CopyThisConfigeration =[];
        }
        else{
            $(".active-copy").addClass('deactive-copy');
            $(".active-copy").removeClass('active-copy');
            $(item.currentTarget).addClass('active-copy');
            $(item.currentTarget).removeClass('deactive-copy');
            let itemToCopy=arr_build[arr_build.findIndex(e => e.id == +item.currentTarget.id.replace(/[^0-9]/g,''))];
            CopyThisConfigeration =[itemToCopy.value];
        }    
    }

    function ClearCopyBuffer(){
        $(".active-copy").removeClass('active-copy');
        CopyThisConfigeration =[];
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
    function add_Conf_stack (side="right", itemToInsert="Grid")
    {
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;

        if (StackControl!=1)
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>`;
        AddToArray(arr_build,{id:StackControl, value: itemToInsert}, side =="right" ? "right" : "left");
        CreateButtonControl();
        for (let key in listBorders){   
            if (listBorders[key].includes(itemToInsert)){
                buttonType=key;
                break;
            }
        }
        const first_in = document.getElementsByClassName('add-left')[0];
        const last_in = document.getElementsByClassName('add-right')[0]; 
        var div = document.createElement('div');
        div.setAttribute('id', "Collecton"+StackControl);
        div.setAttribute('class', 'caru-box');
        side =="right" ? last_in.before(div) : first_in.after(div);
        let added=`
            <img class="img_selector" id="Img${StackControl}" alt="${itemToInsert}" src="${list[itemToInsert].imageName}">    
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
               <div class="name-tag"> ${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                ${ItemCatalog("CHECKOUT",StackControl,listBorders.All)}
                </div>
            </div>             
            ${CloseButton}
            ${CopyButton(StackControl)}
        `
        div.innerHTML=added;
    
        if (StackControl!=1)
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>CloseF(e));
        $("#Copy"+StackControl).click((e)=>CopyStack(e));
        $(".obj-item").click((e)=>SelectStack(e));
    }


    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        UpDateValueInArray(arr_build,...id);
        ClearCopyBuffer();
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
    const id = "CHECKOUT";
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
	
	prcontrols =  new OrbitControls(prcamera, prrenderer.domElement);
	//prcontrols.screenSpacePanning = false;
	//prcontrols.minDistance = 4;
	prcontrols.maxDistance = 20;
	//prcontrols.maxPolarAngle = Math.PI / 3;
	
	//prcamera.position.z = 2;
    prcamera.position.set(-2.5, 2.5, 2.5);

    prcontrols.target = new THREE.Vector3(0, 0.7, 0);
    prcontrols.update();
	
	prcamera.position.z = 2;
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
    preloadedMeshes = {};
    const loader = new GLTFLoader();
        loader.load(
            '../../sprites/configurator/'+id+'/'+'CORN.glb',
            function(gltf){
                for(var i = 0; i<gltf.scene.children.length; i++)
                {
                    preloadedMeshes[gltf.scene.children[i].name] = gltf.scene.children[i];
                }
                document.getElementById("loadscreen2").style.display="none";
                //if(id=="CHECKOUT") configurateFreshBoxObject();
                var item = {
                    configuration:formFreshBoxItemsArray(),
                    colors:document.querySelector('input[name="test"]:checked').value.split(' '),
                    kazyrek:getKazyrek(),
                }
                asyncLoadFresh(item,prgroup,preloadedMeshes);
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
    
function formFreshBoxItemsArray() {
    return arr_build.map(item=> item.value);
}

function getKazyrek()
{
    return false;
}

function fillOnes(l)
{
    if(l==0) return [0,0,0];
    if(l==1) return [1,0,0];
    if(l>1)
    {
        var a = Math.floor(l/3);
        var b = l%3;
        if(b%2==0) return [0,b/2,a];
        else return [0,(l-(a-1)*3)/2, a-1]
    }
}

function fridgeCannopies(cannopyarray) {
    var volume=0, volume2=0;
    for(var i = 2; i>=0; i--) {
        if(cannopyarray[i]) {
            cannopyarray[i]-=1;
            volume = i+1;
            break;
        }
    }
    for(var i = 2; i>=0; i--) {
        if(cannopyarray[i]) {
            cannopyarray[i]-=1;
            volume2 = i+1;
            break;
        }
    }
    return [volume,volume2, ...cannopyarray ,0,0,0,0,0,0,0];
}


function fridgeSideCannopies(cannopyarray) {
    var volume=0;
    for(var i = 2; i>=0; i--) {
        if(cannopyarray[i]) {
            cannopyarray[i]-=1;
            volume = i+1;
            break;
        }
    }
    return [volume, ...cannopyarray];
}



function fridgeCannopiesRoof(cannopyarray) {
    var pc_idx, roof_arr=[0,1,0];
    var leftPart,rightPart;
    for(var i = 0; i < cannopyarray.length; i++) {
        if(ConfigurableList.CHECKOUT.ElementsBorders.terminal.includes(cannopyarray[i])) {
            pc_idx = i;
            break;
        }
    }

    if(pc_idx!=0 && pc_idx!=(cannopyarray.length-1)) {
        leftPart = cannopyarray.length - (cannopyarray.length-pc_idx+1);
        rightPart = cannopyarray.length - (pc_idx+1+1);
        if (leftPart== 0) roof_arr=[1,0,0];
        if (rightPart== 0) roof_arr=[0,0,1];
        leftPart = fillOnes(leftPart);
        rightPart = fillOnes(rightPart);
        leftPart = fridgeSideCannopies(leftPart);
        rightPart = fridgeSideCannopies(rightPart);
        for(var i = 1; i < 3; i++) {
            rightPart[i] = rightPart[i]+leftPart[i]; 
        }
    }
    return [leftPart[0],...rightPart,0,0,0,0, ...roof_arr]; // [leftVolume, rightVolume, mid1Qnt, mid2Qnt, mid3Qnt, SelfSt2, SelfSt3,SelfSt2R, SelfSt3R, LeftRoof, MidlRoof, RightRoof]
}



function layoutRoof(itemsArray,kazyrek) //countedblocks, seq, kazyrek
{
    // [leftVolume, rightVolume, mid1Qnt, mid2Qnt, mid3Qnt, SelfSt2, SelfSt3,SelfSt2R, SelfSt3R, LeftRoof, MidlRoof, RightRoof]

    if(itemsArray.length == 2) {
        if(kazyrek) {
            return [0,0,0,0,0,0,0,1,0,0,0,0];
        }
        else {
            return [0,0,0,0,0,1,0,0,0,0,0,0];
        }
    }

    if(itemsArray.length == 3) {
        if(kazyrek) {
            return [0,0,0,0,0,0,0,0,1,0,0,0];
        }
        else {
            return [0,0,0,0,0,0,1,0,0,0,0,0];
        }
    }

    if(itemsArray.length > 3) {
        if(kazyrek) { 
            return fridgeCannopiesRoof(itemsArray);
        }
        else {
            return fridgeCannopies(fillOnes(itemsArray.length));
        }
    }

}

function configurateFreshBoxObject() {
    var dist=0;
    var seq = formFreshBoxItemsArray();
    var pc_idx;
    if(getKazyrek()) {
        if(seq.length == 2) {
            var kaz1 = meshesObject['Roof'].clone();
            kaz1.translateX(0.699/2);
            prgroup.add(kaz1);
            var kaz2 = meshesObject['Roof'].clone();
            kaz2.translateX(0.699+0.699/2);
            prgroup.add(kaz2);
        }
        else {
            for(var i = 0; i<seq.length; i++) {
                if(ConfigurableList.CHECKOUT.ElementsBorders.terminal.includes(seq[i])) {pc_idx = i; break;}
            }
            if(pc_idx!=0 && pc_idx!=(seq.length-1)) {
                var locdist = 0.699*(pc_idx-1);
                var kaz1 = meshesObject['Roof'].clone();
                kaz1.translateX(locdist+0.699/2);
                locdist+=0.699;
                prgroup.add(kaz1);
                var kaz2 = meshesObject['Roof'].clone();
                kaz2.translateX(locdist+0.699/2);
                locdist+=0.699;
                prgroup.add(kaz2);
                var kaz3 = meshesObject['Roof'].clone();
                kaz3.translateX(locdist+0.699/2);
                prgroup.add(kaz3);
            }
        }
    }
    prgroup.add(meshesObject['Endwall'].clone());
    for(var i = 0; i<seq.length; i++)
    {
        var mesh = meshesObject[seq[i]].clone();
        prgroup.add(mesh);
        var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
        mesh.children[0].material.color.r = colors[0]/255;
        mesh.children[0].material.color.g = colors[1]/255;
        mesh.children[0].material.color.b = colors[2]/255;    
        mesh.translateX(0.699/2+dist);
        dist += 0.699;
    }
    var lastwall = meshesObject['Endwall'].clone();
    lastwall.children[0].material.color.r = colors[0]/255;
    lastwall.children[0].material.color.g = colors[1]/255;
    lastwall.children[0].material.color.b = colors[2]/255;
    lastwall.translateX(dist);
    prgroup.add(lastwall);
    prgroup.children.forEach( item => {item.position.x-=dist/2;});
    prcamera.position.z = 5;
    prcamera.position.y = 1.2;
    spriteFreshBox(seq, colors, getKazyrek());
}

function spriteFreshBox(seq, colors, kazyrek, x=0, y=0, rot=0) {
    var pc_idx;

    renderedsprite = new PIXI.Container();
    renderedsprite.x = x;     renderedsprite.y = y;     renderedsprite.rotation = rot;
    renderedsprite.name = "CHECKOUT";
    renderedsprite.userData = {};
    renderedsprite.userData.nameTag = "";
    renderedsprite.colors = colors;
    renderedsprite.configuration = seq;

    renderedsprite.sayHi = function() {
        var arr = [];
        const name = this.name;
        const color = getColorCode(this.colors);
        arr.push([name+' '+color]);

        var itemSet = {};
        this.configuration.forEach(function(a){
            itemSet[a] = itemSet[a] + 1 || 1;
        });
        for(var key in itemSet){
            arr.push([Checkout[key].art,Checkout[key].name,itemSet[key],Checkout[key].price,Checkout[key].price*itemSet[key]]);//postboxstack
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
        renderedsprite = spriteFreshBox(this.configuration, this.colors, 0, this.x+20, this.y+20, this.rotation);
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
        }
        return thisObject;
    }

    renderedsprite.create3D = asyncLoadFresh;

    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);

    var dist=0;

    for(var i = 0; i<seq.length; i++) {
        var sprite = new PIXI.Sprite.from("sprites/configurator/CHECKOUT/PixiPreview/CheckOut.svg");
        renderedsprite.addChild(sprite);
        sprite.anchor.set(0.5);
        sprite.x+=(0.7*32+dist*64);
        sprite.scale.x = 0.7;
        sprite.scale.y = 0.794;
        dist += 0.7;
    }
    let text = new PIXI.Text("Check\n out",{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'left'});
    text.y-=32*0.794;
    renderedsprite.addChild(text);

    renderedsprite.breadth = dist;

    renderedsprite.children.forEach(item=>item.position.x-=dist*32);
    renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -25;
    renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -25;
    renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 25;
    renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 25;

    return renderedsprite;
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
    $("#depthST").text("Depth: " + " 0.794 m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*794/1000)*100)/100 + "m&#178");
    $("#lengthST").text("Length: " + Math.round(selectedItem.breadth*100)/100 + "m");
}

function hideContextMenu()
{
    document.getElementById("ORClick").remove();
}

    
function configurateItem()
{
    prgroup.remove(...prgroup.children);
    var item = {
        configuration:formFreshBoxItemsArray(),
        colors:document.querySelector('input[name="test"]:checked').value.split(' '),
        kazyrek:getKazyrek(),
    }
    //configurateFreshBoxObject();
    asyncLoadFresh(item,prgroup,preloadedMeshes);
    spriteFreshBox(item.configuration, item.colors,item.kazyrek, 0,0,0);
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

    async function asyncLoadFresh(item,_shopitems3d,preloadedMeshes) {
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
            const gltfData = await modelLoader('../../sprites/configurator/CHECKOUT/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
        
        var _group = new THREE.Group();
        _shopitems3d.add(_group);
    
        var dist=0;
        var seq = item.configuration;
        var colors = item.colors;
        var pc_idx;

        _group.add(meshesObject['Side'].clone());
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
        var lastwall = meshesObject['Side'].clone();
        /*
        lastwall.children[0].material.color.r = colors[0]/255;
        lastwall.children[0].material.color.g = colors[1]/255;
        lastwall.children[0].material.color.b = colors[2]/255;*/
        lastwall.translateX(dist);
        _group.add(lastwall);
        if(!preloadedMeshes) _group.rotation.set(Math.PI/2,-item.rotation,0);
        if(item.position) _group.position.set(item.x/64, -item.y/64, 0);
        _group.children.forEach( item => {item.position.x-=dist/2;});

        if(preloadedMeshes) Functions.addDimensions( _group );

        return
    }

this.configurateItem = configurateItem;
this.preloadMeshes = preloadMeshesObject;
this.spawnConfigurated = spawnConfigurated;
this.loadPostBox = spriteFreshBox;
this.startConfigurator = startConfigurator;

};

CheckOut.prototype = Object.create( EventDispatcher.prototype );
CheckOut.prototype.constructor = CheckOut;

export {CheckOut}

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