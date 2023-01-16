import * as THREE from '../jsm/three.module.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { Functions, ConfiguratorView, modelLoader } from './FunctionsForConf.js';
import {Furniture} from './DataSet.js';
import {MainWindow, colorSelect, addStackButtons, depthSelector, RBMmenuConf, ItemCatalogAcces} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList,Category} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.LOKOACCESSORIES.Elements;
const listBorders = ConfigurableList.LOKOACCESSORIES.ElementsBorders;
let arr_build=[];

var LokoAccessories = function(container2d, app) 
{
    const mainName = 'LOKOACCESSORIES';
    var configuratorView;

    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let timer;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#option").append(depthSelector);
        $("#PostBoxconf").append(addStackButtons);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
            configuratorView.configurateItem(arr_build);
        })
        $(".add-right").click(function() {
            add_Conf_stack("right");
            configuratorView.configurateItem(arr_build);
            
        });
        $(".add-left").click(function() {
            add_Conf_stack("left");
            configuratorView.configurateItem(arr_build);
        });


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
        add_Conf_stack("right",'SetBRP');
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
    }


    function reloadConfigurator(item){
        clean_conf_stack();
        setUpInterface();
        item.userData.configuration.forEach(item=>{
            add_Conf_stack("right",item.value);
        })        

        //color set
        const colorSet = document.querySelectorAll('input[name="test"]');
        const selected_color=item.userData.colors.join(' ');
        colorSet.forEach(i=> {if(selected_color == i.value) 
                                       i.checked = true;
                            });
         
        //depth set                    
        const depthSet = document.querySelectorAll('input[name="dept"]');
        depthSet.forEach(i=> {if(item.depth == i.value) 
                                        i.checked = true;
                            });


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
            document.getElementById("spawnconfigurated").disabled = false;

    }


    function CloseF(e){
        var id =e.target.id.replace(/[^0-9]/g,'');
        $("#Collecton"+id).remove();
        arr_build = RemoveFromArray(arr_build, id);  
        CreateButtonControl();
        configuratorView.configurateItem(arr_build);
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
        configuratorView.configurateItem(arr_build);
    }




var confreqv;
var renderedsprite = null;


function spriteFreshBox(configObject) {
    console.log(configObject);

    const offset = configObject.userData.depth==700?'':'N';

    renderedsprite = new PIXI.Container();
    renderedsprite.x = configObject.x;     renderedsprite.y = configObject.y;     renderedsprite.rotation = configObject.rotation;
    renderedsprite.userData = {};
    renderedsprite.userData.name = "LOKOACCESSORIES";
    renderedsprite.userData.configuration = configObject.userData.configuration;
    renderedsprite.userData.colors = configObject.userData.colors;
    renderedsprite.userData.depth = configObject.userData.depth;
    renderedsprite.userData.nameTag = "";

    renderedsprite.sayHi = function() {
        const N = this.userData.depth == 700?'7':'5';
        var arr = [];
        var color = getColorCode(this.userData.colors)
        arr.push([this.userData.name+' '+ color])
        if(this.userData.configuration[0].value == 'SetBRP') {
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name, this.userData.configuration.length, Furniture['PlantD'+N].price, this.userData.configuration.length*Furniture['PlantD'+N].price]);
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name, this.userData.configuration.length, Furniture['BanchD'+N].price, this.userData.configuration.length*Furniture['BanchD'+N].price]);
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name, this.userData.configuration.length, Furniture['RoofD'+N].price, this.userData.configuration.length*Furniture['RoofD'+N].price]);
        }
        if(this.userData.configuration[0].value == 'SetBR') {
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name, this.userData.configuration.length, Furniture['BanchD'+N].price, this.userData.configuration.length*Furniture['BanchD'+N].price]);
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name, this.userData.configuration.length, Furniture['RoofD'+N].price, this.userData.configuration.length*Furniture['RoofD'+N].price]);
        }
        if(this.userData.configuration[0].value == 'SetBP') {
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name, this.userData.configuration.length, Furniture['BanchD'+N].price, this.userData.configuration.length*Furniture['BanchD'+N].price]);
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name, this.userData.configuration.length, Furniture['PlantD'+N].price, this.userData.configuration.length*Furniture['PlantD'+N].price]);
        }
        if(this.userData.configuration[0].value == 'SetRP') {
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name,this.userData.configuration.length, Furniture['RoofD'+N].price, this.userData.configuration.length*Furniture['RoofD'+N].price]);
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name,this.userData.configuration.length, Furniture['PlantD'+N].price, this.userData.configuration.length*Furniture['PlantD'+N].price]);
        }
        if(this.userData.configuration[0].value == 'SetB') {
            arr.push([Furniture['BanchD'+N].art,Furniture['BanchD'+N].name,this.userData.configuration.length, Furniture['BanchD'+N].price, this.userData.configuration.length*Furniture['BanchD'+N].price]);
        }
        if(this.userData.configuration[0].value == 'SetR') {
            arr.push([Furniture['RoofD'+N].art,Furniture['RoofD'+N].name,this.userData.configuration.length, Furniture['RoofD'+N].price, this.userData.configuration.length*Furniture['RoofD'+N].price]);
        }
        if(this.userData.configuration[0].value == 'SetP') {
            arr.push([Furniture['PlantD'+N].art,Furniture['PlantD'+N].name,this.userData.configuration.length, Furniture['PlantD'+N].price, this.userData.configuration.length*Furniture['PlantD'+N].price]);
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
    var seq = configObject.userData.configuration
    if(seq[0].value=='SetBRP') renderedsprite.userData.depth = 750;
    if(seq[0].value=='SetBR') renderedsprite.userData.depth = 550;
    if(seq[0].value=='SetBP') renderedsprite.userData.depth = 600;
    if(seq[0].value=='SetRP') renderedsprite.userData.depth = 250;
    if(seq[0].value=='SetB') renderedsprite.userData.depth = 500;
    if(seq[0].value=='SetR') renderedsprite.userData.depth = 50;
    if(seq[0].value=='SetP') renderedsprite.userData.depth = 200;

    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var helper = new PIXI.Container();
    renderedsprite.addChild(helper);
    var dist=0;


    for(var i = 0; i<configObject.userData.configuration.length; i++)
    {
        var sprite = new PIXI.Sprite.from("sprites/configurator/LOKOACCESSORIES/PixiPreview/"+seq[i].value+offset+".svg");
        const text = new PIXI.Text(ConfigurableList.LOKOACCESSORIES.Elements[seq[i].value].name2D.replaceAll('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
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

    console.log(seq[0]+offset);
    if(seq[0].value=='SetB') {
        renderedsprite.children[0].y = -16;
        renderedsprite.children[1].y = -16;
        renderedsprite.children[2].y = 16;
        renderedsprite.children[3].y = 16;
    }  

    if(seq[0].value=='SetBRP') {
        renderedsprite.children[0].y = -46;
        renderedsprite.children[1].y = -46;
        renderedsprite.children[2].y = 3;
        renderedsprite.children[3].y = 3;
    }
    if(seq[0].value=='SetBP') {
        renderedsprite.children[0].y = -43;
        renderedsprite.children[1].y = -43;
        renderedsprite.children[2].y = 4;
        renderedsprite.children[3].y = 4;
    }
    if(seq[0].value=='SetBR') {
        renderedsprite.children[0].y = -47;
        renderedsprite.children[1].y = -47;
        renderedsprite.children[2].y = -9;
        renderedsprite.children[3].y = -9;
    }
    if(seq[0].value=='SetR') {
        renderedsprite.children[0].y = -46;
        renderedsprite.children[1].y = -46;
        renderedsprite.children[2].y = -42;
        renderedsprite.children[3].y = -42;
    }
    if(seq[0].value=='SetRP') {
        renderedsprite.children[0].y = -46;
        renderedsprite.children[1].y = -46;
        renderedsprite.children[2].y = -30;
        renderedsprite.children[3].y = -30;
    }
    if(seq[0].value=='SetP') {
        renderedsprite.children[0].y = -5;
        renderedsprite.children[1].y = -5;
        renderedsprite.children[2].y = 5;
        renderedsprite.children[3].y = 5;
    }
    if(seq[0].value=='SetB' && offset=="N") {
        renderedsprite.children[0].y = -11;
        renderedsprite.children[1].y = -11;
        renderedsprite.children[2].y = 11;
        renderedsprite.children[3].y = 11;
    }  
    if(seq[0].value=='SetBRP' && offset=="N") {
        renderedsprite.children[0].y = -39;
        renderedsprite.children[1].y = -39;
        renderedsprite.children[2].y = -4;
        renderedsprite.children[3].y = -4;
    }
    if(seq[0].value=='SetBP' && offset=="N") {
        renderedsprite.children[0].y = -31;
        renderedsprite.children[1].y = -31;
        renderedsprite.children[2].y = 1;
        renderedsprite.children[3].y = 1;
    }
    if(seq[0].value=='SetBR' && offset=="N") {
        renderedsprite.children[0].y = -39;
        renderedsprite.children[1].y = -39;
        renderedsprite.children[2].y = 10;
        renderedsprite.children[3].y = 10;
    }
    if(seq[0].value=='SetR' && offset=="N") {
        renderedsprite.children[0].y = -37;
        renderedsprite.children[1].y = -37;
        renderedsprite.children[2].y = -34;
        renderedsprite.children[3].y = -34;
    }
    if(seq[0].value=='SetRP' && offset=="N") {
        renderedsprite.children[0].y = -39;
        renderedsprite.children[1].y = -39;
        renderedsprite.children[2].y = -26;
        renderedsprite.children[3].y = -26;
    }
    if(seq[0].value=='SetP' && offset=="N") {
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
    

    async function asyncLoadFresh(item, _shopitems3d, preloadedMeshes)
	{
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
		var seq = item.userData.configuration;
        let depth = item.userData.depth;
        var offset = '';
        if(depth==500) offset = 'N';
		var colors = item.userData.colors;
		for(var i = 0; i<seq.length; i++)
		{
			var mesh = meshesObject[seq[i].value+offset].clone();
			_group.add(mesh);
			mesh.children[0].material.color.r = colors[0]/255;
			mesh.children[0].material.color.g = colors[1]/255;
			mesh.children[0].material.color.b = colors[2]/255;   
			mesh.translateX(0.49/2+dist);
			dist += 0.49;
		}
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

LokoAccessories.prototype = Object.create( EventDispatcher.prototype );
LokoAccessories.prototype.constructor = LokoAccessories;

export {LokoAccessories}

var selectedItem = null;