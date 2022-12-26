import * as THREE from '../jsm/three.module.js';
import {OrbitControls } from '../jsm/controls/OrbitControls.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {Functions} from './FunctionsForConf.js';
import {shelf} from './DataSet.js';
import {MainWindow, shelfconf, RBMmenuConf, addStackButtonsShelf, ShelfsConfiguration, CopyButton, ItemCatalog} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

import { FontLoader } from '../src/loaders/FontLoader.js';
import { TextGeometry } from '../src/geometries/TextGeometry.js';


const list = ConfigurableList.SHELF.Elements;
const listBorders = ConfigurableList.SHELF.ElementsBorders;
const needToFixIt = "SHELF";
let arr_build=[],CopyThisConfigeration=[];
let timer;
var Shelf = function(container2d, app) 
{
    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    var hdrCubeRenderTarget;


    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#confmenu").append(shelfconf);
        $("#PostBoxconf").append(addStackButtonsShelf);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, .radio-height, #bottom_ext").click(function() {
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
		showConfigurator();
    }

    function reloadConfigurator(item){
        clean_conf_stack();
        setUpInterface();
        item.configuration.forEach(item=>{
            add_Conf_stack("right",item.ObjType,item.width,item.amount, item.gridtype, item.gridheight, item.borderamount, item.IsBorders, item.IsInner, item.hooksA);
        })        

        //color set
        const colorSet = document.querySelectorAll('input[name="color"]');
        const selected_color=item.userData.colors.join(' ');
        colorSet.forEach(i=> {if(selected_color == i.value) 
                                       i.checked = true;
                            });
         

        //height set
        const height = document.querySelectorAll('input[name="height"]');
        height.forEach(i=> {if(item.userData.height == i.value) 
                                       i.checked = true;
                            });

        //shdpth set
        const shelfDepth = document.querySelectorAll('input[name="depth"]');
        shelfDepth.forEach(i=> {if(item.userData.depth == i.value) 
                                       i.checked = true;
                            });
        //bottom
        const bottom = document.getElementById("bottom_ext");
        if(item.userData.extBot != 0)
            bottom.checked = true;
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
            CopyThisConfigeration =[itemToCopy.ObjType,itemToCopy.width,itemToCopy.amount, itemToCopy.gridtype, itemToCopy.gridheight, itemToCopy.borderamount, itemToCopy.IsBorders, itemToCopy.IsInner, itemToCopy.hooksA];
        }    
    }

    function ClearCopyBuffer(){
        $(".active-copy").removeClass('active-copy');
        CopyThisConfigeration =[];
    }


    function UpDateValueInArray (arr,itemId,newValueW=-1,newValueA=-1,ObjType=-1, gridtype=-1, gridheight=-1, borderamount=-1,mianborder=-1,innerborder=-1, hooksA=-1){
        if(newValueW!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].width=newValueW;
        if(newValueA!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].amount=newValueA;
        if(ObjType!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].ObjType=ObjType;
        if(gridtype!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].gridtype=gridtype;
        if(gridheight!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].gridheight=gridheight;
        if(borderamount!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].borderamount=borderamount;
        if(mianborder!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].IsBorders=mianborder;
        if(innerborder!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].IsInner=innerborder;
        if(hooksA!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].hooksA=hooksA;
    }

    function AddToArray (arr, Push, place="right"){
        if (place == "right")
        arr.push(Push);
        else
        arr.unshift(Push);
    }

    function CarrentValue (arr, searchFor){
        return arr[arr.findIndex(e => e.id == searchFor)].ObjType;
    }

    function RemoveFromArray (arr, itemId){
    return arr.filter(e => e.id != itemId);
    }


    function ClearArray (){
        return	[];
    }

 
    function SetInterface(id, type){
        $("#hooks"+id+", #shelfAmound"+id+", #shelfGrid"+id+", #shelfBorders"+id+", #shelfWight"+id).css({"position":"relative","top":"0px"});
        switch(type){
            case "Type5":{
                $("#hooks"+id+", #shelfAmound"+id+", #shelfGrid"+id+", #shelfBorders"+id).css({"position":"absolute","top":"-1000px"});
                document.getElementById("inner"+id).checked=false;
                document.getElementById("border"+id).checked=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsBorders=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsInner=false;
                break;
            }
            case "Type4":{
                $("#hooks"+id+", #shelfGrid"+id+", #shelfBorders"+id).css({"position":"absolute","top":"-1000px"});
                document.getElementById("inner"+id).checked=false;
                document.getElementById("border"+id).checked=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsBorders=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsInner=false;
                break;
            }
            case "Type2":{
                $("#shelfGrid"+id+", #shelfBorders"+id).css({"position":"absolute","top":"-1000px"});
                document.getElementById("inner"+id).checked=false;
                document.getElementById("border"+id).checked=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsBorders=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsInner=false;
                break;
            }
            case "Type6":{
                $("#hooks"+id+", #shelfGrid"+id).css({"position":"absolute","top":"-1000px"});
                document.getElementById("border"+id).checked=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsBorders=false;
                break;
            }
            case "Type7":{
                $("#hooks"+id+", #shelfGrid"+id+", #shelfBorders"+id).css({"position":"absolute","top":"-1000px"});
                document.getElementById("border"+id).checked=false;
                document.getElementById("inner"+id).checked=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsBorders=false;
                arr_build[ arr_build.findIndex(obj => obj.id ==id)].IsInner=false;
                break;
            }
            case "Type1":{
                $("#hooks"+id).css({"position":"absolute","top":"-1000px"});
                break;
            }
            case "Type3":{
                $("#hooks"+id).css({"position":"absolute","top":"-1000px"});
                break;
            }
        }
    }

    function clean_conf_stack()
    {
    var buttons = document.getElementsByClassName('caru-box');
    for (var  i=buttons.length-1; i>=0; i--)
            buttons[i].remove();
    }
    function CloseF(e){
        var id =e.target.id.replace(/[^0-9]/g,'');
        $("#Collecton"+id).remove();
        arr_build = RemoveFromArray(arr_build, id);
        CreateButtonControl();
        configurateItem();
    }

    function CreateButtonControl ()
    {
            document.getElementById("spawnconfigurated").disabled = false;
    }


    function ExtendedBottom(e){
        const id = e.target.name.replace(/[^0-9]/g,'');
        let value=e.target.value;
        if(e.target.name[0]=="w")
        UpDateValueInArray(arr_build,id,value);
        if(e.target.name[0]=="a")
        UpDateValueInArray(arr_build,id,-1,value);
        if(e.target.name[0]=="g")
        UpDateValueInArray(arr_build,id,-1,-1,-1,value);
        if(e.target.name[0]=="h")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,value);
        if(e.target.name[0]=="b")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,-1,value);
        if(e.target.name[0]=="M")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,-1,-1,e.target.checked);
        if(e.target.name[0]=="I")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,-1,-1,-1,e.target.checked);
        if(e.target.name[0]=="H")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,-1,-1,-1,-1,value);
        configurateItem(); 
    }

    function depthDependents(type,depth){
        switch(type){
            case "Type4":
                if (depth<400) return true;
                break;
            case "Type5":
                if (depth!=500) return true;
                break;
            case "Type6":
                if (depth>600 || depth<300) return true;
                break;
            case "Type7":
                if (depth!=600) return true;
                break;  
        }
        return false;
    }

    function UpdateInterface(id,width,gridtype,amount, gridheight,borderamount,mianborder,innerborder, hooksA){
        const borderamountS = document.querySelectorAll('input[name="borderamount'+id+'"]');
        borderamountS.forEach(i=> {if(borderamount == i.value) 
                                       i.checked = true;
                            });
        const HookamountS = document.querySelectorAll('input[name="Hookamount'+id+'"]');
        HookamountS.forEach(i=> {if(hooksA == i.value) 
                                        i.checked = true;
                            });
        const gridtypeS = document.querySelectorAll('input[name="gridtype'+id+'"]');
        gridtypeS.forEach(i=> {if(gridtype == i.value) 
                                        i.checked = true;
                            });
        const heightgridS = document.querySelectorAll('input[name="heightgrid'+id+'"]');
        heightgridS.forEach(i=> {if(gridheight == i.value) 
                                        i.checked = true;
                            });
        const amountS = document.querySelectorAll('input[name="amount'+id+'"]');
        amountS.forEach(i=> {if(amount == i.value) 
                                        i.checked = true;
                            });
        const widthS = document.querySelectorAll('input[name="width'+id+'"]');
        widthS.forEach(i=> {if(width == i.value) 
                                        i.checked = true;
                            });
        const mianborderS = document.getElementById("border"+id);
        if(mianborder)
            mianborderS.checked = true;
        const innerborderS = document.getElementById("inner"+id);
        if(innerborder)
            innerborderS.checked = true;
    }

    function add_Conf_stack (side="right", ObjType="Type1", width="665",amount="4",gridtype="plastick", gridheight=30, borderamount=2, IsBorders=false, IsInner=false,hooksA=amount)
    {   
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;
        

        if (arr_build.length != 0)
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>`;
        
        CreateButtonControl();
        for (let key in listBorders){   
            if (listBorders[key].includes(ObjType)){
                buttonType=key;
                break;
            }
        }
        const first_in = document.getElementsByClassName('add-left')[0];
        const last_in = document.getElementsByClassName('add-right')[0]; 
        var div = document.createElement('div');
        div.setAttribute('id', "Collecton"+StackControl);
        div.setAttribute('class', 'caru-box-widther');
        side =="right" ? last_in.before(div) : first_in.after(div);
        let added=`
            <img class="img_selector-shelf"  id="Img${StackControl}" alt="${ObjType}" src="${list[ObjType].imageName}">
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
               <div class="name-tag"> ${list[ObjType].itname}<br>${list[ObjType].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                ${ItemCatalog("SHELF",StackControl,listBorders.All)}
                </div>
            </div>
            <div class="shelf-but-selection">
            ${ShelfsConfiguration(StackControl)}
            </div>
            ${CloseButton}
            ${CopyButton(StackControl)}
            
        `
        div.innerHTML=added;
    
        if (arr_build.length != 0)
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>CloseF(e));
        AddToArray(arr_build,{id:StackControl, width: width, amount: amount, ObjType: ObjType, gridtype:gridtype, gridheight:gridheight, borderamount:borderamount, IsBorders: IsBorders, IsInner: IsInner,hooksA:hooksA}, side =="right" ? "right" : "left");

        SetInterface(StackControl, ObjType);
        UpdateInterface(StackControl,width,gridtype,amount, gridheight,borderamount,IsBorders,IsInner, amount)
        $(".bottomCt").click((e)=>ExtendedBottom(e));
        $("#Copy"+StackControl).click((e)=>{ CopyStack(e);})
        $(".obj-item").click((e)=>SelectStack(e));
    }

    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        UpDateValueInArray(arr_build,id[0],-1,-1,id[1]);
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
	
	prcontrols =  new OrbitControls(prcamera, prrenderer.domElement);
	prcontrols.maxDistance = 20;
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


    const backWallArr = {
        "300":{'1320':1, "1473":0, '1625':2, '1778':1, '1930':0, '2082':2,'2235':1,'2387':0,'2540':2},
        "450":{'1320':2, "1473":3, '1625':2, '1778':3, '1930':4, '2082':3,'2235':4,'2387':5,'2540':4},
    }

    
function formItemsArray() {
    return arr_build.map(item=> item.value);
}

function frontPanelAndLeg(arr,mainObj){
    var frontPanelSet = {};
    let RLeg=0;
    
    mainObj.configuration.forEach(function(a,index){
        if(a.ObjType=="Type4"){
            let frontPanel = 'reinforcedfrontPanel'+a.width;
            frontPanelSet[frontPanel] = frontPanelSet[frontPanel] + 1 || 1;
            if(!mainObj.configuration[index-1] && mainObj.configuration[index-1]=="Type4"){
                RLeg+=1;
            }
            else{
                RLeg+=2;
            }
        }
        else{
            let frontPanel = 'frontPanel'+a.width;
            frontPanelSet[frontPanel] = frontPanelSet[frontPanel] + 1 || 1;
        }
    });
    const leg = mainObj.configuration.length;
    arr.push([shelf["leg"+mainObj.userData.height].art,shelf["leg"+mainObj.userData.height].name,leg+1,shelf["leg"+mainObj.userData.height].price,shelf["leg"+mainObj.userData.height].price*leg+1]);
    arr.push([shelf["legBottomEnd"].art,shelf["legBottomEnd"].name,leg+1,shelf["legBottomEnd"].price,shelf["legBottomEnd"].price*leg+1]);
    arr.push([shelf["legTopEnd"].art,shelf["legTopEnd"].name,leg+1,shelf["legTopEnd"].price,shelf["legTopEnd"].price*leg+1]);
    arr.push([shelf["legconnector"].art,shelf["legconnector"].name,leg+1,shelf["legconnector"].price,shelf["legconnector"].price*leg+1]);
    if(RLeg){
        arr.push([shelf["reinforcedLeg"+mainObj.userData.height].art,shelf["reinforcedLeg"+mainObj.userData.height].name,RLeg,shelf["reinforcedLeg"+mainObj.userData.height].price,shelf["reinforcedLeg"+mainObj.userData.height].price*RLeg]);
        arr.push([shelf["reinforcedLegBottomEnd"].art,shelf["reinforcedLegBottomEnd"].name,RLeg,shelf["reinforcedLegBottomEnd"].price,shelf["reinforcedLegBottomEnd"].price*RLeg]);
        arr.push([shelf["reinforcedLegTopEnd"].art,shelf["reinforcedLegTopEnd"].name,RLeg,shelf["reinforcedLegTopEnd"].price,shelf["reinforcedLegTopEnd"].price*RLeg]);
    }
     //buttom L
     var name = "bottomleg"+mainObj.userData.depth;
     arr.push([shelf[name].art,shelf[name].name,mainObj.configuration.length+1,shelf[name].price,shelf[name].price*mainObj.configuration.length+1]);

    for(var key in frontPanelSet){
        //console.log(key);
        arr.push([shelf[key].art,shelf[key].name,frontPanelSet[key],shelf[key].price,shelf[key].price*frontPanelSet[key]]);
    }
}

function backWall(arr,mainObj){
    var backWallSet = {};
    mainObj.configuration.forEach(function(a){
        const name1 = 'backWall300x'+a.width;
        const name2 = 'backWall450x'+a.width;
        
        const qnt300 = backWallArr['300'][mainObj.userData.height];
        const qnt450 = backWallArr['450'][mainObj.userData.height];

        backWallSet[name1] = backWallSet[name1] + qnt300 || qnt300;
        backWallSet[name2] = backWallSet[name2] + qnt450 || qnt450;   
    });

    for(var key in backWallSet){
        arr.push([shelf[key].art,shelf[key].name,backWallSet[key],shelf[key].price,shelf[key].price*backWallSet[key]]);
    }  
}


function priceListShelfs(arr,mainObj){
    var baseShelf, hooksholder, reinforcedbaseShelf, reinforcedreinforcedPriceHolder;
    var baseShelfSet = {};
    var sandShelfSet = {};
    var reinforcedbaseShelfSet = {};
    var hooksHolderSet = {};
    var reinforcedreinforcedPriceHolderSet = {};
    var shelfHolderSet = {};
    var priceHolderShelfSet = {};
    var frontdivSet = {};
    var enddivSet = {};
    var insidedivSet = {};
    var plastickHolderQnt = 0;
    var hooksSet=0;
    var hooks = 'hook'+(+mainObj.userData.depth<=400?+mainObj.userData.depth:450);
    //console.log(hooks);
    
    mainObj.configuration.forEach(function(a){   
        if(a.ObjType=="Type1"){
            baseShelf = 'shelf'+(+mainObj.userData.depth)+'x'+a.width;
            baseShelfSet[baseShelf] = baseShelfSet[baseShelf] + (+a.amount) || +a.amount;
            shelfHolderSet['shelfHolder'+mainObj.userData.depth] = shelfHolderSet['shelfHolder'+mainObj.userData.depth] + (+a.amount) || +a.amount;
            priceHolderShelfSet['priceHolderShelf'+a.width] = priceHolderShelfSet['priceHolderShelf'+a.width] + (+a.amount) || +a.amount;

            if(a.IsBorders) {
                var name = 'front'+a.gridtype+a.width+'h'+a.gridheight;
                frontdivSet[name] = frontdivSet[name] + (+a.amount) || +a.amount;

                var name = 'end'+a.gridtype+mainObj.userData.depth+'h'+a.gridheight;
                enddivSet[name] = enddivSet[name] + (+a.amount)*2 || (+a.amount)*2;

                if(a.gridtype == "plastick") {
                    plastickHolderQnt+=(+a.amount)*8;
                }
            }
            if(a.IsInner) {
                var name = 'inside'+a.gridtype+mainObj.userData.depth+'h'+a.gridheight;
                insidedivSet[name] = insidedivSet[name] + (+a.amount)*a.borderamount || (+a.amount)*a.borderamount;
                if(a.gridtype == "plastick") {
                    plastickHolderQnt+=(+a.borderamount)*2*(+a.amount);
                }
            }
        }
        if(a.ObjType=="Type2"){
            hooksholder = 'holder'+a.width;
            hooksHolderSet[hooksholder] = hooksHolderSet[hooksholder] + (+a.amount) || (+a.amount);
            hooksSet= hooksSet+ (+a.amount*(+a.hooksA)) || +a.amount*(+a.hooksA);
        }
        if(a.ObjType=="Type3") {
            const minDepth = 300;
            const maxDepth = 700;
            var localDepth = mainObj.userData.depth;
            for(var sh = 0; sh<a.amount; sh++) {
                baseShelf = 'shelf'+localDepth+'x'+a.width;
                baseShelfSet[baseShelf] = baseShelfSet[baseShelf] + 1 || 1;
                shelfHolderSet['shelfHolder'+localDepth] = shelfHolderSet['shelfHolder'+localDepth] + 1 || 1;
                priceHolderShelfSet['priceHolderShelf'+a.width] = priceHolderShelfSet['priceHolderShelf'+a.width] + 1 || 1;

                if(a.IsBorders) {
                    var name = 'front'+a.gridtype+a.width+'h'+a.gridheight;
                    frontdivSet[name] = frontdivSet[name] + 1 || 1;
                    var name = 'end'+a.gridtype+localDepth+'h'+a.gridheight;
                    enddivSet[name] = enddivSet[name] + 2 || 2;
                    if(a.gridtype == "plastick") {
                        plastickHolderQnt+=8;
                    }
                }

                if(a.IsInner) {
                    var name = 'inside'+a.gridtype+localDepth+'h'+a.gridheight;
                    insidedivSet[name] = insidedivSet[name] + (+a.borderamount) || (+a.borderamount);
                    if(a.gridtype == "plastick") {
                        plastickHolderQnt+=(+a.borderamount)*2;
                    }
                }

                if(mainObj.userData.depth - (a.amount-sh)*100>=100) localDepth-=100;
            }
        }
        if(a.ObjType=="Type4"){
            reinforcedbaseShelf = 'reinforcedShelf'+(+mainObj.userData.depth)+'x'+a.width;
            reinforcedbaseShelfSet[reinforcedbaseShelf] = reinforcedbaseShelfSet[reinforcedbaseShelf] + +a.amount || +a.amount;
            reinforcedreinforcedPriceHolder = 'reinforcedPriceHolder'+a.width;
            reinforcedreinforcedPriceHolderSet[reinforcedreinforcedPriceHolder] = reinforcedreinforcedPriceHolder[reinforcedreinforcedPriceHolder] + +a.amount || +a.amount;
        }
        if(a.ObjType=="Type5"){
            arr.push([shelf['breadbaskery'].art,shelf['breadbaskery'].name,1,shelf['breadbaskery'].price,shelf['breadbaskery'].price]);
            arr.push([shelf['breadbaskerypriceholder'].art,shelf['breadbaskerypriceholder'].name,1,shelf['breadbaskerypriceholder'].price,shelf['breadbaskerypriceholder'].price]);
            arr.push([shelf['breadshelf500x1000'].art,shelf['breadshelf500x1000'].name,1,shelf['breadshelf500x1000'].price,shelf['breadshelf500x1000'].price]);
            arr.push([shelf['breadshelf400x1000'].art,shelf['breadshelf400x1000'].name,2,shelf['breadshelf400x1000'].price,shelf['breadshelf400x1000'].price*2]);
            arr.push([shelf['breaddivider500'].art,shelf['breaddivider500'].name,3,shelf['breaddivider500'].price,shelf['breaddivider500'].price*3]);
            arr.push([shelf['breaddivider400'].art,shelf['breaddivider400'].name,6,shelf['breaddivider400'].price,shelf['breaddivider400'].price*6]);
            shelfHolderSet['shelfHolder500'] = shelfHolderSet['shelfHolder500'] + 1 || 1;
            shelfHolderSet['shelfHolder400'] = shelfHolderSet['shelfHolder400'] + 2 || 2;
            priceHolderShelfSet['priceHolderShelf1000'] = priceHolderShelfSet['priceHolderShelf1000'] + 3 || 3;
        }
        if(a.ObjType=="Type6"){
            baseShelf = 'sandshelf'+(+mainObj.userData.depth)+'x'+a.width;
            sandShelfSet[baseShelf] = sandShelfSet[baseShelf] + (+a.amount) || +a.amount;
            shelfHolderSet['shelfHolder'+mainObj.userData.depth] = shelfHolderSet['shelfHolder'+mainObj.userData.depth] + (+a.amount) || +a.amount;
            priceHolderShelfSet['priceHolderShelf'+a.width] = priceHolderShelfSet['priceHolderShelf'+a.width] + (+a.amount) || +a.amount;

            var name = 'frontsand'+a.width;
            frontdivSet[name] = frontdivSet[name] + (+a.amount) || +a.amount;

            var name = 'endsand'+mainObj.userData.depth;
            enddivSet[name] = enddivSet[name] + (+a.amount)*2 || (+a.amount)*2;

            if(a.IsInner) {
                var name = 'insidesand'+mainObj.userData.depth;
                insidedivSet[name] = insidedivSet[name] + (+a.amount)*a.borderamount || (+a.amount)*a.borderamount;
                if(a.gridtype == "plastick") {
                    plastickHolderQnt+=(+a.borderamount)*2*(+a.amount);
                }
            }
        }
        if(a.ObjType=="Type7"){
            arr.push([shelf['boxshelf600x1250'].art,shelf['boxshelf600x1250'].name,1,shelf['boxshelf600x1250'].price,shelf['boxshelf600x1250'].price]);
            arr.push([shelf['boxshelf400x1250'].art,shelf['boxshelf400x1250'].name,2,shelf['boxshelf400x1250'].price,shelf['boxshelf400x1250'].price*2]);
            shelfHolderSet['shelfHolder600'] = shelfHolderSet['shelfHolder500'] + 1 || 1;
            shelfHolderSet['shelfHolder400'] = shelfHolderSet['shelfHolder400'] + 2 || 2;
            priceHolderShelfSet['boxpriceholder1250'] = priceHolderShelfSet['boxpriceholder1250'] + 3 || 3;
        }
    });

    //standart shelf
    var extras = 0;
    if(Object.keys(baseShelfSet).length !== 0){ 
        for(var key in baseShelfSet){
            arr.push([shelf[key].art,shelf[key].name,baseShelfSet[key],shelf[key].price,shelf[key].price*+baseShelfSet[key]]);
            extras+=baseShelfSet[key];
        }
        extras *= 2;

        arr.push([shelf['shelfHolderForEach1'].art,shelf['shelfHolderForEach1'].name,extras,shelf['shelfHolderForEach1'].price,shelf['shelfHolderForEach1'].price*+extras]);
        arr.push([shelf['shelfHolderForEach2'].art,shelf['shelfHolderForEach2'].name,extras,shelf['shelfHolderForEach2'].price,shelf['shelfHolderForEach2'].price*+extras]);
    }

    if(plastickHolderQnt) arr.push([shelf['plastickholder'].art,shelf['plastickholder'].name,plastickHolderQnt,shelf['plastickholder'].price,shelf['plastickholder'].price*+plastickHolderQnt]);

    extras = 0;
    if(Object.keys(sandShelfSet).length !== 0){ 
        for(var key in sandShelfSet){
            arr.push([shelf[key].art,shelf[key].name,sandShelfSet[key],shelf[key].price,shelf[key].price*+sandShelfSet[key]]);
            extras+=sandShelfSet[key];
        }
        extras *= 2;
        arr.push([shelf['shelfHolderForEach1'].art,shelf['shelfHolderForEach1'].name,extras,shelf['shelfHolderForEach1'].price,shelf['shelfHolderForEach1'].price*+extras]);
        arr.push([shelf['shelfHolderForEach2'].art,shelf['shelfHolderForEach2'].name,extras,shelf['shelfHolderForEach2'].price,shelf['shelfHolderForEach2'].price*+extras]);
    }


    //holders
    if(Object.keys(shelfHolderSet).length != 0){ 
        //console.log(shelfHolderSet)
        for(var key in shelfHolderSet){
            arr.push([shelf[key].art,shelf[key].name,shelfHolderSet[key]*2,shelf[key].price,shelf[key].price*+shelfHolderSet[key]*2]);
        }    
    }
    //priceholders
    if(Object.keys(priceHolderShelfSet).length !== 0){ 
        for(var key in priceHolderShelfSet){
            arr.push([shelf[key].art,shelf[key].name,priceHolderShelfSet[key],shelf[key].price,shelf[key].price*+priceHolderShelfSet[key]]);
        }    
    }

    //hooks
    if(Object.keys(hooksSet).length !== 0){
        for(var key in hooksHolderSet){
            arr.push([shelf[key].art,shelf[key].name,hooksHolderSet[key],shelf[key].price,shelf[key].price*+hooksHolderSet[key]]);
        } 
        arr.push([shelf[hooks].art,shelf[hooks].name,hooksSet,shelf[hooks].price,shelf[hooks].price*hooksSet]);
        arr.push([shelf["foreachhook"].art,shelf["foreachhook"].name,hooksSet,shelf["foreachhook"].price,shelf["foreachhook"].price*+hooksSet]);
    }


    if(Object.keys(frontdivSet).length !== 0){ 
        //console.log(frontdivSet)
        for(var key in frontdivSet){
            arr.push([shelf[key].art,shelf[key].name,frontdivSet[key],shelf[key].price,shelf[key].price*+frontdivSet[key]]);
        }    
    }

    if(Object.keys(enddivSet).length !== 0){ 
        //console.log(enddivSet)
        for(var key in enddivSet){
            arr.push([shelf[key].art,shelf[key].name,enddivSet[key],shelf[key].price,shelf[key].price*+enddivSet[key]]);
        }    
    }

    if(Object.keys(insidedivSet).length !== 0){ 
        for(var key in insidedivSet){
            arr.push([shelf[key].art,shelf[key].name,insidedivSet[key],shelf[key].price,shelf[key].price*+insidedivSet[key]]);
        }    
    }

    //reniforsed shelf
    if(Object.keys(reinforcedbaseShelfSet).length !== 0){ 
        const hoderlg = "reinforcedShelfHolder"+mainObj.userData.depth;
        for(var key in reinforcedbaseShelfSet){
            arr.push([shelf[key].art,shelf[key].name,reinforcedbaseShelfSet[key],shelf[key].price,shelf[key].price*+reinforcedbaseShelfSet[key]]);
            arr.push([shelf[hoderlg].art,shelf[hoderlg].name,reinforcedbaseShelfSet[key]*2,shelf[hoderlg].price,shelf[hoderlg].price*+reinforcedbaseShelfSet[key]*2]); 
        } 
         
        for(var key in  reinforcedreinforcedPriceHolderSet){
            arr.push([shelf[key].art,shelf[key].name, reinforcedreinforcedPriceHolderSet[key],shelf[key].price,shelf[key].price*+ reinforcedreinforcedPriceHolderSet[key]]); 
        }  
    }
}

/*save
var ext = mainObj.userData.extCooling==true?'Ext':'Int';
var baseShelfSet = {};

var baseShelf;
        if(mainObj.userData.extBot) {
            baseShelf = 'shelf'+(+mainObj.userData.depth+100)+'x'+a.width;
        } else {
            baseShelf = 'shelf'+mainObj.userData.depth+'x'+a.width;
        }
baseShelfSet[baseShelf] = baseShelfSet[baseShelf] + 1 || 1;


 for(var key in baseShelfSet){
        arr.push([shelf[key].art,shelf[key].name,baseShelfSet[key],shelf[key].price,shelf[key].price*baseShelfSet[key]]);
    }
*/



function spriteItem(arr_build, colors, height, depth, extBot, x=0, y=0, rot=0) {
    renderedsprite = new PIXI.Container();
    renderedsprite.x = x;     renderedsprite.y = y;     renderedsprite.rotation = rot;
    renderedsprite.name = "SHELF";
    renderedsprite.configuration = arr_build;
    renderedsprite.userData = {};
    renderedsprite.userData.nameTag = "";
    renderedsprite.userData.colors = colors;
    renderedsprite.userData.height = height;
    renderedsprite.userData.depth = depth;
    renderedsprite.userData.extBot = extBot;

    renderedsprite.clone = function() {
        selectedItem = null;
        renderedsprite = spriteItem(this.configuration, this.userData.colors, this.userData.height, this.userData.depth, this.userData.extBot, this.x+20, this.y+20, this.rotation);
        spawnConfigurated();
    }


    renderedsprite.sayHi = function() {
        var color = getColorCode(this.userData.colors)
        //console.log(color)
        var arr = [['Shelf '+color]];
        frontPanelAndLeg(arr,this);
        backWall(arr,this);
        priceListShelfs(arr,this);
        var fullPrice=0;
        for(var i = 1; i<arr.length; i++) {
            fullPrice+=+arr[i][4]*100;
        }

        arr[0].push('','',fullPrice/100,fullPrice/100);
        return(arr);
    }

    renderedsprite.saveIt = function() {
        var thisObject = {
            name:this.name,
            configuration: this.configuration,
            userData: {
                colors: this.userData.colors,
                height: this.userData.height,
                x:this.x,
                y:this.y,
                rotation:this.rotation,
                depth:this.userData.depth,
                extBot: this.userData.extBot,
            }
        }
        return thisObject;
    }

    renderedsprite.create3D = asyncLoad;

    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);

    var dist=0;
    for(var i = 0; i<arr_build.length; i++)
    {
        var sprite = new PIXI.Sprite.from("sprites/configurator/SHELF/PixiPreview/Shelf.svg");
        renderedsprite.addChild(sprite);        
        sprite.x+=(dist*64);
        sprite.scale.x = arr_build[i].width/1000;
        if(extBot) {
            sprite.scale.y = (+depth+100)/1000;
            sprite.y = -32*(+depth+100)/1000;
        } else {
            sprite.scale.y = depth/1000;
            sprite.y = -32*depth/1000;
        }
        dist += arr_build[i].width/1000;
    }
    let text = new PIXI.Text(renderedsprite.name,{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
    text.y-=32*depth/1000;
    renderedsprite.addChild(text);

    renderedsprite.breadth = dist;

    renderedsprite.children.forEach(item=>item.position.x-=dist*32);
    renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -32;
    renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -32;
    renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 32;
    renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 32;
    if(extBot) {
        renderedsprite.children[0].y = -32*(+depth+100)/1000;
        renderedsprite.children[1].y = -32*(+depth+100)/1000;
        renderedsprite.children[2].y = 32*(+depth+100)/1000;
        renderedsprite.children[3].y = 32*(+depth+100)/1000;
    } else {
        renderedsprite.children[0].y = -32*(+depth)/1000;
        renderedsprite.children[1].y = -32*(+depth)/1000;
        renderedsprite.children[2].y = 32*(+depth)/1000;
        renderedsprite.children[3].y = 32*(+depth)/1000;
    }
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
    $("#depthST").text("Depth: " + selectedItem.userData.depth/1000 + "m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*selectedItem.userData.depth/1000)*100)/100 + "m&#178");
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
        configuration: arr_build,
        userData: {
            colors: document.querySelector('input[name="color"]:checked').value.split(' '),
            height: document.querySelector('input[name="height"]:checked').value,
            depth: document.querySelector('input[name="depth"]:checked').value,
            extBot: document.getElementById("bottom_ext").checked,
        }
    }
    asyncLoad(item,prgroup,preloadedMeshes);
    spriteItem(arr_build, item.userData.colors, item.userData.height, item.userData.depth, item.userData.extBot);
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

    async function asyncLoad(item, _shopitems3d, preloadedMeshes)
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
            const gltfData = await modelLoader('../../sprites/configurator/SHELF/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
        var _group = new THREE.Group();
        _shopitems3d.add(_group);

        var dist=0;
        let depth = item.userData.depth;
        let height = item.userData.height;
        var mesh = meshesObject['Support'+height].clone();
        _group.add(mesh);
        var mesh = meshesObject['Prop'].clone();
        if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
        else mesh.scale.z = depth/1000;
        _group.add(mesh);
        for(var i = 0; i<item.configuration.length; i++)
        {
            var currentStack = item.configuration[i];
            if(currentStack.ObjType=='Type1') {
                for(var sh = 0; sh<currentStack.amount; sh++) {
                    var mesh = meshesObject[currentStack.ObjType].clone();
                    mesh.scale.z = depth/1000;
                    _group.add(mesh);
                    mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
                    if(currentStack.IsBorders) {
                        var mesh = meshesObject['SideBorder_'+currentStack.gridtype].clone();
                        mesh.scale.z = depth/1000;
                        _group.add(mesh);
                        mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                        mesh.scale.x = currentStack.width/1000;
                        mesh.translateX(mesh.scale.x/2+dist);
                        mesh.scale.y = currentStack.gridheight/100;
                    }
                    if(currentStack.IsInner) {
                        for(var poperek = 0; poperek<currentStack.borderamount; poperek++) {
                            var mesh = meshesObject['InnerBorder_'+currentStack.gridtype].clone();
                            mesh.scale.z = depth/1000;
                            _group.add(mesh);
                            mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                            mesh.translateX(dist+(currentStack.width/1000)/(+currentStack.borderamount+1)*(poperek+1));
                            mesh.scale.y = currentStack.gridheight/100;
                        }
                    }
                }
                var mesh = meshesObject['Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                
                var mesh = meshesObject['Wall'+height].clone();
                _group.add(mesh);
                mesh.translateX(currentStack.width/1000/2+dist);
                mesh.scale.x = currentStack.width/1000;
                mesh.rotateY(Math.PI);
    
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
            }
    
            if(currentStack.ObjType=='Type2') {
                for(var sh = 0; sh<currentStack.amount; sh++) {
                    var mesh = meshesObject['HookHolder'].clone();
                    _group.add(mesh);
                    mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
    
                    for(var poperek = 0; poperek<currentStack.hooksA; poperek++) {
                        var mesh = meshesObject['Hook'].clone();
                        mesh.scale.z = depth/1000;
                        _group.add(mesh);
                        mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                        mesh.translateX(dist+(currentStack.width/1000)/(+currentStack.hooksA+1)*(poperek+1));
                        mesh.scale.y = currentStack.gridheight/100;
                        mesh.translateZ(0.06);
                    }
                }
                var mesh = meshesObject['Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                    var mesh = meshesObject['Wall'+height].clone();
                    _group.add(mesh);
                    mesh.translateX(currentStack.width/1000/2+dist);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.rotateY(Math.PI);
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
            }
    
    
            if(currentStack.ObjType=='Type3') {
                const minDepth = 300;
                const maxDepth = 700;
                var localDepth = item.userData.depth;
                for(var sh = 0; sh<currentStack.amount; sh++) {
                    var mesh = meshesObject['Type1'].clone();
                    mesh.scale.z = localDepth/1000;
                    _group.add(mesh);
                    mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
                    if(currentStack.IsBorders) {
                        var mesh = meshesObject['SideBorder_'+currentStack.gridtype].clone();
                        mesh.scale.z = localDepth/1000;
                        _group.add(mesh);
                        mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                        mesh.scale.x = currentStack.width/1000;
                        mesh.translateX(mesh.scale.x/2+dist);
                        mesh.scale.y = currentStack.gridheight/100;
                    }
                    if(currentStack.IsInner) {
                        for(var poperek = 0; poperek<currentStack.borderamount; poperek++) {
                            var mesh = meshesObject['InnerBorder_'+currentStack.gridtype].clone();
                            mesh.scale.z = localDepth/1000;
                            _group.add(mesh);
                            mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                            mesh.translateX(dist+(currentStack.width/1000)/(+currentStack.borderamount+1)*(poperek+1));
                            mesh.scale.y = currentStack.gridheight/100;
                        }
                    }
                    if(depth - (currentStack.amount-sh)*100>=100) localDepth-=100;
                }
                var mesh = meshesObject['Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                var mesh = meshesObject['Wall'+height].clone();
                _group.add(mesh);
                mesh.translateX(currentStack.width/1000/2+dist);
                mesh.scale.x = currentStack.width/1000;
                mesh.rotateY(Math.PI);
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
            }
            if(currentStack.ObjType=='Type4') {
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                if(item.userData.extBot) mesh.translateZ((+depth+100)/1000);
                else mesh.translateZ(depth/1000);
                mesh.translateX(dist);
                mesh.scale.z = 0.5;
                if(item.userData.extBot) mesh.translateZ = 100/1000;
    
                for(var sh = 0; sh<currentStack.amount; sh++) {
                    var mesh = meshesObject['Type4'].clone();
                    if(item.userData.extBot) mesh.scale.z = ((+depth+100)/1000);
                    else mesh.scale.z = (depth/1000);
                    _group.add(mesh);
                    mesh.translateY(height/1000/currentStack.amount*(sh+1));
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
                }
    
                var mesh = meshesObject['Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                //mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                var mesh = meshesObject['Wall'+height].clone();
                _group.add(mesh);
                mesh.translateX(currentStack.width/1000/2+dist);
                mesh.scale.x = currentStack.width/1000;
                mesh.rotateY(Math.PI);
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                if(item.userData.extBot) mesh.translateZ((+depth+100)/1000);
                else mesh.translateZ(depth/1000);
                mesh.translateX(dist);
                mesh.scale.z = 0.5;
            }
    
    
            if(currentStack.ObjType=='Type5') {
                var specialAmount = (height-700)/1000/0.3;
                for(var sh = 0; sh<specialAmount; sh++) {
                    var mesh = meshesObject['Bread_shelf'].clone();
                    mesh.scale.z = depth/1000;
                    _group.add(mesh);
                    mesh.translateY(0.74+(height-740-60)/1000/specialAmount*sh);
                    //mesh.translateY((height-700)/1000/specialAmount*sh+0.7);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
                }
                var mesh = meshesObject['Bread_Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                var mesh = meshesObject['Wall'+height].clone();
                _group.add(mesh);
                mesh.translateX(currentStack.width/1000/2+dist);
                mesh.scale.x = currentStack.width/1000;
                mesh.rotateY(Math.PI);
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
            }
    
    
            if(currentStack.ObjType=='Type6') {
                for(var sh = 0; sh<currentStack.amount; sh++) {
                    var mesh = meshesObject['Bulk_shelf'].clone();
                    mesh.scale.z = (depth/1000);
                    _group.add(mesh);
                    mesh.translateY(0.35+(height-350)/1000/currentStack.amount*sh);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
                    if(currentStack.IsInner) {
                        for(var poperek = 0; poperek<currentStack.borderamount; poperek++) {
                            var mesh = meshesObject['Bulk_InnerBorder'].clone();
                            mesh.scale.z = depth/1000;
                            _group.add(mesh);
                            mesh.translateY((height-350)/1000/currentStack.amount*sh+0.35);
                            mesh.translateX(dist+(currentStack.width/1000)/(+currentStack.borderamount+1)*(poperek+1));
                            mesh.scale.y = currentStack.gridheight/100;
                        }
                    }
                }
    
                var mesh = meshesObject['Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                //mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                var mesh = meshesObject['Wall'+height].clone();
                _group.add(mesh);
                mesh.translateX(currentStack.width/1000/2+dist);
                mesh.scale.x = currentStack.width/1000;
                mesh.rotateY(Math.PI);
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
            }
        
    
            if(currentStack.ObjType=='Type7') {
                var firstHeight = depth*Math.sqrt(2)/2+200;
                var specialAmount = (height-700)/1000/((firstHeight-200)/1000);
        
                for(var sh = 0; sh<specialAmount; sh++) {
                    var mesh = meshesObject['Frow1'].clone();
                    mesh.scale.z = depth/1000;
                    _group.add(mesh);
                    mesh.translateY((height-firstHeight-200)/1000/specialAmount*sh+firstHeight/1000);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);
                    mesh.rotation.set(Math.PI/4,0,0);
        
                }
                var mesh = meshesObject['Base'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                mesh.scale.x = currentStack.width/1000;
                _group.add(mesh);
                var colors = item.userData.colors;
                mesh.material.color.r = colors[0]/255;
                mesh.material.color.g = colors[1]/255;
                mesh.material.color.b = colors[2]/255;
                mesh.translateX(currentStack.width/1000/2+dist);
                var mesh = meshesObject['Wall'+height].clone();
                _group.add(mesh);
                mesh.translateX(currentStack.width/1000/2+dist);
                mesh.scale.x = currentStack.width/1000;
                mesh.rotateY(Math.PI);
                dist += currentStack.width/1000;
                var mesh = meshesObject['Support'+height].clone();
                _group.add(mesh);
                mesh.translateX(dist);
                var mesh = meshesObject['Prop'].clone();
                if(item.userData.extBot) mesh.scale.z = (+depth+100)/1000;
                else mesh.scale.z = depth/1000;
                _group.add(mesh);
                mesh.translateX(dist);
            }
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

Shelf.prototype = Object.create( EventDispatcher.prototype );
Shelf.prototype.constructor = Shelf;

export {Shelf}

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