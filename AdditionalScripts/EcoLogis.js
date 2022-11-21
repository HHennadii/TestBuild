import * as THREE from '../jsm/three.module.js';
import {OrbitControls } from '../jsm/controls/OrbitControls.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {Postbox_parts,D700,Fresh} from './DataSet.js';
import {getPostCoef} from './Coefs.js';
import {MainWindow, colorSelect, isRoof, RBMmenuConf} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.ECOLOGIS.Elements;
const listBorders = ConfigurableList.ECOLOGIS.ElementsBorders;
const needToFixIt = "ECOLOGIS";
let timer;
var EcoLogis = function(container2d, app) 
{
    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let arr_build=[];
   
	var hdrCubeRenderTarget;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#option").append(isRoof);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
            configurateItem();
        })
        
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
        add_Conf_stack();
        add_Conf_stack();
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
         
        //roof
        const roof = document.getElementById("access3");
        if(item.kazyrek != 0)
             roof.checked = true;


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
        if (arr_build.length>1) 
            document.getElementById("spawnconfigurated").disabled = false;
        else 
            document.getElementById("spawnconfigurated").disabled = true;
    }



    function IsRoof(arr){  
        let checkbox = document.getElementById("access03");
        checkbox.style.display="flex";
                
        
    }
    


    function NextObj(e){
        const id = e.target.id.replace(/[^0-9]/g,'');
        const type = e.target.dataset.type;
        let value, itemIndex = listBorders[type].indexOf(CarrentValue (arr_build, id));
        if(listBorders[type][itemIndex+1])
            value=listBorders[type][itemIndex+1];
        else
            value=listBorders[type][0];
        $("#Img"+id).attr("src", list[value].imageName);
        document.getElementById("alt"+id).innerHTML= list[value].itname + "<br />" + list[value].cellemount;
        UpDateValueInArray(arr_build,id,value);
        configurateItem(); 
         
    }

    function PrevObj(e){
        const id = e.target.id.replace(/[^0-9]/g,'');
        const type = e.target.dataset.type;
        let value, itemIndex = listBorders[type].indexOf(CarrentValue (arr_build, id));
        if(listBorders[type][itemIndex-1])
            value=listBorders[type][itemIndex-1];
        else
            value=listBorders[type][listBorders[type].length-1];
        $("#Img"+id).attr("src", list[value].imageName);
        document.getElementById("alt"+id).innerHTML= list[value].itname + "<br />" + list[value].cellemount;
        UpDateValueInArray(arr_build,id,value);
        configurateItem();  
    }

    function add_Conf_stack (side="right", itemToInsert="Type1")
    {
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;

        AddToArray(arr_build,{id:StackControl, value: itemToInsert}, side =="right" ? "right" : "left");
        CreateButtonControl();
        for (let key in listBorders){   
            if (listBorders[key].includes(itemToInsert)){
                //console.log(key);
                buttonType=key;
                break;
            }
        }
 
        var div = document.createElement('div');
        div.setAttribute('id', "Collecton"+StackControl);
        div.setAttribute('class', 'caru-box');
        document.getElementsByClassName('paramtr_conf')[0].append(div);
        let added=`
            <img class="img_selector" id="Img${StackControl}" alt="${itemToInsert}" src="${list[itemToInsert].imageName}">
            <div id="alt${StackControl}">${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount}</div>
            ${CloseButton}
            <div class="remove_post right-side-bt">
                <img id="Right${StackControl}" data-type="${buttonType}" class="bar-iconC" src="./Media/SVG/Close.svg">
            </div>
            <div class="remove_post left-side-bt">
                <img id="Left${StackControl}" data-type="${buttonType}" class="bar-iconC" src="./Media/SVG/Close.svg"></div>
            </div>
        `
        div.innerHTML=added;
    

        document.getElementById("Right"+StackControl).addEventListener( 'click', (e)=>NextObj(e)); 
        document.getElementById("Left"+StackControl).addEventListener( 'click', (e)=>PrevObj(e));
        IsRoof(arr_build);
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
	prgroup.position.y = -0.7;
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
	prrenderer.render(prscene, prcamera);
	window.requestAnimationFrame( pranimate );
	}
};



var preloadedMeshes= {};
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
                document.getElementById("loadscreen2").style.display="none";
                configurateItem();
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

function getKazyrek()
{
    return document.getElementById("access3").checked ? true : false;
}


function countBlocks(arr)
{
    var f1 = 0; var it = 0; var f2 = 0; var start = 0; var pc_idx = 0;
    f1 = countFridges(arr,start);
    start = f1;
    [it,pc_idx] = countItems(arr,start);
    start+=it;
    f2 = countFridges(arr,start);
    return [f1,it,f2,pc_idx];
}

function countFridges(arr,start)
{
    var count = 0;
    for(var i = start; i<arr.length; i++)
    {
        if(arr[i]=="Fridge") count++;
        else break;
    }
    return count;
}

function countItems(arr,start)
{
    var count = 0;
    var pc_idx = 0;
    for(var i = start; i<arr.length; i++)
    {
        if(arr[i]=="TerminalPro" || arr[i]=="TerminalST" || arr[i]=="TerminalSTFR") pc_idx = i;
        if(arr[i]!="Fridge") count++;
        else break;
    }
    return [count,pc_idx];
}

function layoutFloor(arr)
{
    var f1 = []; var f2 = [];
    if(arr[0]) f1 = fillOnes(arr[0]);
    else f1 = [0,0,0];
    if(arr[2]) f2 = fillOnes(arr[2]);
    else f2 = [0,0,0];
    var f = [f1[0]+f2[0],f1[1]+f2[1],f1[2]+f2[2]];
    var it = fillOnes(arr[1]);
    return [it,f];
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

function layoutRoof(arr, itemsArray,kazyrek) //countedblocks, seq, kazyrek
{
    var f1 = []; var f2 = [];
    if(arr[0]) f1 = fillOnes(arr[0]);
    else f1 = [0,0,0];
    if(arr[2]) f2 = fillOnes(arr[2]);
    else f2 = [0,0,0];
    var f = [f1[0]+f2[0],f1[1]+f2[1],f1[2]+f2[2]];

    var it = [], pc_idx = arr[3];
    if(itemsArray.length==2)
    {
        if(kazyrek)
        {
            return [[0,0,0],[0,0,0]];
        }
        else
        {
            if(itemsArray[0]==1 || itemsArray[1]==1) return [[1,0,0],[1,0,0]];
            else return [[0,1,0],[0,0,0]];
        }
    }
    else
    {
        if(kazyrek)
        {
            if(arr[3]!=0 && arr[3]!=arr.length-1)
            {
                if(itemsArray[pc_idx-1]!=1 && itemsArray[pc_idx+1]!=1)
                {
                    var left = (pc_idx-1)-arr[0];
                    var right = itemsArray.length-(pc_idx+2)-arr[2];

                    //console.log(left);
                    //console.log(right);
                    left = fillOnes(left); right = fillOnes(right);

                    it = [left[0]+right[0], left[1]+right[1],left[2]+right[2]];
                }
            }
            else it = fillOnes(arr[1]);
        }
        else it = fillOnes(arr[1]);
    }
    return [it,f]; //returns [[1can,2can,3can]for post; [1,2,3] for fresh]

}


function configurateEcoLogisObject()
{
    var dist=0;
    var seq = formItemsArray();
    var offset = '';
    offset = 'N';

    prgroup.add(meshesObject['Endwall'+offset].clone());
    if(getKazyrek())
    {
            var kaz1;
            kaz1 = meshesObject['RoofN'].clone();
            kaz1.translateX(0.485/2);
            prgroup.add(kaz1);
            var kaz2;
            kaz2 = meshesObject['RoofN'].clone();
            kaz2.translateX(0.485+0.485/2);
            prgroup.add(kaz2);
    }
    for(var i = 0; i<2; i++)
    {
        var mesh = meshesObject[seq[i]+offset].clone();
        prgroup.add(mesh);
        var colors = document.querySelector('input[name="test"]:checked').value.split(' ');
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
    prgroup.add(lastwall);
    prgroup.children.forEach( item => {item.position.x-=dist/2;});
    prcamera.position.z = 5;
    prcamera.position.y = 1.2;
    spriteEcoLogis(seq, colors, getKazyrek(), "500");
}

function spriteEcoLogis(seq, colors, kazyrek, depth, x=0, y=0, rot=0)
{
    const offset ='N';
    renderedsprite = new PIXI.Container();
    renderedsprite.x = x;     renderedsprite.y = y;     renderedsprite.rotation = rot;
    renderedsprite.name = "ECOLOGIS";
    renderedsprite.colors = colors;
    renderedsprite.configuration = seq;
    renderedsprite.kazyrek = kazyrek;
    renderedsprite.depth = depth;
    renderedsprite.breadth = 0.97;


    renderedsprite.sayHi = function() {
        //console.log(this.configuration);
        var arr = [];
        const name = this.name;
        const color = getColorCode(this.colors);
        arr.push([name+' '+color]);
        var itemSet = {};
        this.configuration.forEach(function(a){
            itemSet[a] = itemSet[a] + 1 || 1;
        });
        for(var key in itemSet){
            arr.push([Postbox_parts[key].art,Postbox_parts[key].name,itemSet[key],Postbox_parts[key].price,Postbox_parts[key].price*itemSet[key]]);
        }
        arr.push([Postbox_parts.Base2.art,Postbox_parts.Base2.name,1,Postbox_parts.Base2.price,Postbox_parts.Base2.price]);
        if(this.kazyrek) {
            arr.push([Postbox_parts.Can2R.art,Postbox_parts.Can2R.name,1,Postbox_parts.Can2R.price,Postbox_parts.Can2R.price]);
        } else {
            arr.push([Postbox_parts.Can2.art,Postbox_parts.Can2.name,1,Postbox_parts.Can2.price,Postbox_parts.Can2.price]);
        }
        arr.push([Postbox_parts.EndwallL.art,Postbox_parts.EndwallL.name,1,Postbox_parts.EndwallL.price,Postbox_parts.EndwallL.price]);
        arr.push([Postbox_parts.EndwallR.art,Postbox_parts.EndwallR.name,1,Postbox_parts.EndwallR.price,Postbox_parts.EndwallR.price]);
        arr.push([Postbox_parts.SAAS.art,Postbox_parts.SAAS.name,1,Postbox_parts.SAAS.price,Postbox_parts.SAAS.price]);
        var fullPrice=0;
        for(var i = 1; i<arr.length; i++) {
            //console.log(arr[i][4]);
            fullPrice+=+arr[i][4]*100;
        }
        //console.log(fullPrice);

        arr[0].push('','',fullPrice/100,fullPrice/100);
        //console.log(arr);
        return(arr);
    }

    renderedsprite.saveIt = function() {
        var thisObject = {
            name:this.name,
            configuration: this.configuration,
            color: this.colors,
            x:this.x,
            y:this.y,
            rotation:this.rotation,
            kazyrek:this.kazyrek,
            depth:this.depth,
        }
        return thisObject;
    }

    renderedsprite.create3D = asyncLoadEcoLogis;

    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);

    var dist=0;
    if(kazyrek)
    {
        var kaz2d = new PIXI.Sprite.from("sprites/configurator/ECOLOGIS/PixiPreview/Roof"+offset+".svg");
        offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
        renderedsprite.addChild(kaz2d);
        var kaz2d = new PIXI.Sprite.from("sprites/configurator/ECOLOGIS/PixiPreview/Roof"+offset+".svg");
        kaz2d.x+=0.485*64;
        offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
        renderedsprite.addChild(kaz2d);
    }
    for(var i = 0; i<2; i++)
    {
        var sprite = new PIXI.Sprite.from("sprites/configurator/ECOLOGIS/PixiPreview/"+seq[i]+offset+".svg");
        renderedsprite.addChild(sprite);        
        sprite.anchor.set(0.5);
        sprite.x+=(0.49*32+dist*64);
        dist += 0.49;
    }
    renderedsprite.children.forEach(item=>item.position.x-=dist*32);
    renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -14.5;
    renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -14.5;
    renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 14.5;
    renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 14.5;
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
    $("#ORrotate").on("input change",(item)=>{selectedItem.rotation = (+item.target.value/180*Math.PI)*45;});
    $("#ORClick").click(function(e){ if(e.currentTarget==e.target)$("#ORClick").remove();})
    $("#ORconf").click(()=>{
        hideContextMenu();
        reloadConfigurator(selectedItem);     
    });
    $("#depthST").text("Depth: " + " 0.5 m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*selectedItem.depth/1000)*100)/100 + "m&#178");
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
        configuration:formItemsArray(),
        colors:document.querySelector('input[name="test"]:checked').value.split(' '),
        kazyrek:getKazyrek(),
        depth: $("input[name='dept']").filter(":checked").val(),
    }
    asyncLoadEcoLogis(item,prgroup,preloadedMeshes);
    spriteEcoLogis(item.configuration, item.colors,item.kazyrek, '500', 0,0,0);
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

    function onDragStart(event) {
        if([0,1,6].includes(app.userData.mod) && app.userData.canTranslate)
        {
        selectedItem = this;  
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
        app.canMove = 0;
        }
    }

    function onDragEnd() {   
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
        app.canMove = 1;
    }

    function onDragMove() {
        if (this.dragging && app.userData.canTranslate) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
            if (app.userData.snapvert)
            {
            var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
            stickToItem(closestpoint);
            }
        }
        else
				this.alpha = 1;
    }
renderedsprite
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
        .on('pointerover',filterOn)
        .on('pointerout',filterOff)
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

    async function asyncLoadEcoLogis(item, _shopitems3d, preloadedMeshes) {
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
            const gltfData = await modelLoader('../../sprites/configurator/ECOLOGIS/CORN.glb');
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
        if(depth == 500) offset = 'N';
        var startWall = meshesObject['Endwall'+offset].clone();
        _group.add(startWall);
        let renderTarget = hdrCubeRenderTarget;
        const newEnvMap = renderTarget ? renderTarget.texture : null;
        if (newEnvMap)
        {
            startWall.children.forEach(ch=>{
                ch.castShadow = true;
                ch.material.envMap = newEnvMap;});
        }
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
            if (newEnvMap)
            {
                mesh.children.forEach(ch=>{
                    ch.castShadow = true;
                    ch.material.envMap = newEnvMap;});
            }
            dist += 0.49;
        }
        var lastwall = meshesObject['Endwall'+offset].clone();
        lastwall.children[0].material.color.r = colors[0]/255;
        lastwall.children[0].material.color.g = colors[1]/255;
        lastwall.children[0].material.color.b = colors[2]/255;
        lastwall.translateX(dist);
        if (newEnvMap)
        {
            lastwall.children.forEach(ch=>{
                ch.castShadow = true;
                ch.material.envMap = newEnvMap;});
        }
        _group.add(lastwall);
        if(!preloadedMeshes) _group.rotation.set(Math.PI/2,-item.rotation,0);
        if(item.position) _group.position.set(item.x/64, -item.y/64, 0);
        _group.children.forEach( item => {item.position.x-=dist/2;});
        return
    }

this.configurateItem = configurateItem;
this.preloadMeshes = preloadMeshesObject;
this.spawnConfigurated = spawnConfigurated;
this.loadPostBox = spriteEcoLogis;
this.startConfigurator = startConfigurator;

};

EcoLogis.prototype = Object.create( EventDispatcher.prototype );
EcoLogis.prototype.constructor = EcoLogis;

export {EcoLogis}

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


function modelLoader(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject);
    });
}