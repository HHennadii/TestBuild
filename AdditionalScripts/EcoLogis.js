import * as THREE from '../jsm/three.module.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { Functions, ConfiguratorView, modelLoader } from './FunctionsForConf.js';
import {Postbox_parts,D700,Fresh} from './DataSet.js';
import {MainWindow, colorSelect, isRoof, RBMmenuConf, ItemCatalogPostBox} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList,Category} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.ECOLOGIS.Elements;
const listBorders = ConfigurableList.ECOLOGIS.ElementsBorders;
let arr_build=[];

var EcoLogis = function(container2d, app) 
{
    const mainName = 'ECOLOGIS';
    var configuratorView;

    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let timer;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#option").append(isRoof);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
            configuratorView.configurateItem(arr_build);
        })
        
        $("#spawnconfigurated").click(function(){
            configuratorView.configurateItem(arr_build);
            spawnConfigurated();
            configuratorView.hideConfigurator();
            arr_build = ClearArray ();
            $("#confarea").remove();
          });
        
        $(".closeconf").click(function(){
            $("#confarea").remove();
            configuratorView.hideConfigurator();
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
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
    }


    function reloadConfigurator(item){
        clean_conf_stack();
        setUpInterface();
        item.userData.configuration.forEach(item=>{
            add_Conf_stack("right",item);
        })        

        //color set
        const colorSet = document.querySelectorAll('input[name="color"]');
        const selected_color=item.userData.colors.join(' ');
        colorSet.forEach(i=> {if(selected_color == i.value) 
                                       i.checked = true;
                            });
         
        //roof
        const roof = document.getElementById("access3");
        if(item.userData.kazyrek != 0)
             roof.checked = true;


        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
        configuratorView.configurateItem(arr_build);
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
    




    function add_Conf_stack (side="right", item)
    {
        let itemToInsert="Type1";
        if (item)
            itemToInsert=item.value;
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
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
               <div class="name-tag"> ${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                ${ItemCatalogPostBox("ECOLOGIS",StackControl,listBorders.All)}
                </div>
            </div>
            ${CloseButton}
        `
        div.innerHTML=added;
        IsRoof(arr_build);
        $(".obj-item").click((e)=>SelectStack(e));
    }

    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        UpDateValueInArray(arr_build,id[0],id[1]);
        configuratorView.configurateItem(arr_build);
    }

var confreqv;
var renderedsprite = null;

function spriteFreshBox(configObject)
{
    const offset ='N';
    renderedsprite = new PIXI.Container();
    renderedsprite.x = configObject.x;     renderedsprite.y = configObject.y;     renderedsprite.rotation = configObject.rotation;
    renderedsprite.userData = {};
    renderedsprite.userData.name = "ECOLOGIS";
    renderedsprite.userData.colors = configObject.userData.colors;
    renderedsprite.userData.configuration = configObject.userData.configuration;
    renderedsprite.userData.kazyrek = configObject.userData.kazyrek;
    renderedsprite.userData.depth = configObject.userData.depth;
    renderedsprite.userData.breadth = 0.97;
    renderedsprite.userData.nameTag = "";


    renderedsprite.sayHi = function() {
        var arr = [];
        const name = this.name;
        const color = getColorCode(this.userData.colors);
        arr.push([name+' '+color]);
        var itemSet = {};
        this.userData.configuration.forEach(function(a){
            itemSet[a.value] = itemSet[a.value] + 1 || 1;
        });
        for(var key in itemSet){
            arr.push([Postbox_parts[key].art,Postbox_parts[key].name,itemSet[key],Postbox_parts[key].price,Postbox_parts[key].price*itemSet[key]]);
        }
        arr.push([Postbox_parts.Base2.art,Postbox_parts.Base2.name,1,Postbox_parts.Base2.price,Postbox_parts.Base2.price]);
        if(this.userData.kazyrek) {
            arr.push([Postbox_parts.Can2R.art,Postbox_parts.Can2R.name,1,Postbox_parts.Can2R.price,Postbox_parts.Can2R.price]);
        } else {
            arr.push([Postbox_parts.Can2.art,Postbox_parts.Can2.name,1,Postbox_parts.Can2.price,Postbox_parts.Can2.price]);
        }
        arr.push([Postbox_parts.EndwallL.art,Postbox_parts.EndwallL.name,1,Postbox_parts.EndwallL.price,Postbox_parts.EndwallL.price]);
        arr.push([Postbox_parts.EndwallR.art,Postbox_parts.EndwallR.name,1,Postbox_parts.EndwallR.price,Postbox_parts.EndwallR.price]);
        arr.push([Postbox_parts.SAAS.art,Postbox_parts.SAAS.name,1,Postbox_parts.SAAS.price,Postbox_parts.SAAS.price]);
        var fullPrice=0;
        for(var i = 1; i<arr.length; i++) {
            fullPrice+=+arr[i][4]*100;
        }

        arr[0].push('','',fullPrice/100,fullPrice/100);
        return(arr);
    }

    renderedsprite.clone = function() {
        selectedItem = null;
        var configObject = {
            userData: this.userData,
            x: this.x+15,
            y: this.y+15,
            rotation: this.rotation,
        }
        renderedsprite = spriteFreshBox(configObject);
        spawnConfigurated();
    }

    renderedsprite.saveIt = function() {
        var thisObject = {
            userData: this.userData,
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
    if(configObject.userData.kazyrek) {
        var kaz2d = new PIXI.Sprite.from("sprites/configurator/ECOLOGIS/PixiPreview/Roof"+offset+".svg");
        offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
        renderedsprite.addChild(kaz2d);
        var kaz2d = new PIXI.Sprite.from("sprites/configurator/ECOLOGIS/PixiPreview/Roof"+offset+".svg");
        kaz2d.x+=0.485*64;
        offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
        renderedsprite.addChild(kaz2d);
    }

    for(var i = 0; i<2; i++) {
        var sprite = new PIXI.Sprite.from("sprites/configurator/ECOLOGIS/PixiPreview/"+configObject.userData.configuration[i].value+offset+".svg");
        const text = new PIXI.Text(ConfigurableList.ECOLOGIS.Elements[configObject.userData.configuration[i].value].name2D.replaceAll('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
        text.anchor.set(0.5);
        sprite.addChild(text);
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

    var tint = Category[ConfigurableList.LOKOLOGIS.Category].Color;
    renderedsprite.children.forEach(ch => {
        ch.tint = tint;
    })
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
    $("#depthST").text("Depth: " + " 0.5 m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*selectedItem.depth/1000)*100)/100 + "m&#178");
    $("#lengthST").text("Length: " + Math.round(selectedItem.breadth*100)/100 + "m");
}

function hideContextMenu()
{
    document.getElementById("ORClick").remove();
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




    async function asyncLoadFresh(item, _shopitems3d, preloadedMeshes) {
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
        var seq = item.userData.configuration;
        let depth = item.userData.depth;
        var offset = '';
        if(depth == 500) offset = 'N';
        var startWall = meshesObject['Endwall'+offset].clone();
        _group.add(startWall);
        if(item.userData.kazyrek)
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
            var mesh = meshesObject[seq[i].value+offset].clone();
            _group.add(mesh);
            var colors = item.userData.colors;
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
        if(!preloadedMeshes) _group.rotation.set(Math.PI/2,-item.rotation,0);
        if(item.position) _group.position.set(item.x/64, -item.y/64, 0);
        _group.children.forEach( item => {item.position.x-=dist/2;});

        if(preloadedMeshes) Functions.addDimensions( _group );

        return
    }


this.spawnConfigurated = spawnConfigurated;
this.loadPostBox = spriteFreshBox;
this.startConfigurator = startConfigurator;

};

EcoLogis.prototype = Object.create( EventDispatcher.prototype );
EcoLogis.prototype.constructor = EcoLogis;

export {EcoLogis}

var selectedItem = null;