import * as THREE from '../jsm/three.module.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { Functions, ConfiguratorView, modelLoader} from './FunctionsForConf.js';
import {Checkout} from './DataSet.js';
import * as Interface from './InterfaceForConf.js';
import {ConfigurableList,Category} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

import { ObjectSprite } from './ObjectSprite.js';


const list = ConfigurableList.CHECKOUT.Elements;
const listBorders = ConfigurableList.CHECKOUT.ElementsBorders;
let arr_build=[],CopyThisConfigeration=[],activeEditableItem;

let timer;
var CheckOut = function(container2d, app) 
{
    const mainName = "CHECKOUT";
    var configuratorView;

    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
   


    function startConfigurator(){
        setUpInterface(); 
        add_Conf_stack("right");
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
    }

    function reloadConfigurator(item){
        setUpInterface();
        item.userData.configuration.forEach(item=>{
            add_Conf_stack("right",item);
        })        
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);

        Interface.Configurator.SetParamForReconfigurate(item.userData);
        configuratorView.configurateItem(arr_build);
    }


    
    function setUpInterface(){
        Interface.Configurator.SetGeneralElements("stack","CHECKOUT");
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio").click(function() {
            configuratorView.configurateItem(arr_build);
        })
        $(".add-right").click(function() {
            add_Conf_stack("right",CopyThisConfigeration);
            configuratorView.configurateItem(arr_build);
            
        });
        $(".add-left").click(function() {
            add_Conf_stack("left",CopyThisConfigeration);
            configuratorView.configurateItem(arr_build);
        });
        $(".img-item-preview").click(function(e){
            $(".active-item-preview").removeClass("active-item-preview");
            e.currentTarget.classList.toggle("active-item-preview");
            const item=e.currentTarget.id;
            $("#Img"+activeEditableItem).attr("src", list[item].imageName);
            $("#alt"+activeEditableItem).children('.name-tag').html(list[item].itname + "<br />" + list[item].cellemount);
            UpDateValueInArray(arr_build,activeEditableItem,item);
            Interface.Configurator.ClearCopyBuffer();
            configuratorView.configurateItem(arr_build);  
        })

        $("#spawnconfigurated").click(function(){
            configuratorView.configurateItem(arr_build);
            spawnConfigurated();
            configuratorView.hideConfigurator();
            arr_build = Interface.Configurator.ClearArray ();
            $("#confarea").remove();
          });
        
        $(".closeconf").click(function(){
            $("#confarea").remove();
            configuratorView.hideConfigurator();
            StackControl=0;
            arr_build = Interface.Configurator.ClearArray();
        
        });
        $(".info-conf").click(function(e){
        Interface.Configurator.OpenConfigurationMenu(e,"info");
        });     
    }



    function UpDateValueInArray (arr,itemId,newValue){
        arr[arr.findIndex(obj => obj.id ==itemId)].ObjType=newValue;
    }

    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        UpDateValueInArray(arr_build,...id);
        Interface.Configurator.ClearCopyBuffer();
        configuratorView.configurateItem(arr_build);
    }

    function add_Conf_stack (side="right", item=[])
    {
        let itemToInsert="Grid";
        if (item.ObjType)
            itemToInsert=item.ObjType;
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;

        if (StackControl!=1)
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>`;
        Interface.Configurator.AddToArray(arr_build,{id:StackControl, ObjType: itemToInsert}, side =="right" ? "right" : "left");
        Interface.Configurator.CreateButtonControl();
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
            <div class="img_selector-container">
            <img class="img_selector" id="Img${StackControl}" alt="${itemToInsert}" src="${list[itemToInsert].imageName}">
            <img class="img_selector-cover" id="Param${StackControl}" alt="${itemToInsert}" src="../Media/PNG/LayerOverParam.png">
            </div>    
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
               <div class="name-tag"> ${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                ${Interface.ItemCatalog("CHECKOUT",StackControl,listBorders.All)}
                </div>
            </div>             
            ${CloseButton}
            ${Interface.CopyButton(StackControl)}
        `
        div.innerHTML=added;
    
        if (StackControl!=1)
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>{
                arr_build=Interface.Configurator.CloseF(e,arr_build);
                configuratorView.configurateItem(arr_build);
            });
        $("#Copy"+StackControl).click((e)=>CopyThisConfigeration=Interface.Configurator.CopyStack(e, arr_build));
        $(".obj-item").click((e)=>SelectStack(e));
        $("#Param"+StackControl).click((e)=>{
            activeEditableItem=e.currentTarget.id.replace(/[^0-9]/g,'');
            Interface.Configurator.OpenConfigurationMenu(e,"param",Interface.Configurator.CarrentValue(arr_build,activeEditableItem));
            
        });
    }

    var confreqv;
    var renderedsprite = null;

    function spriteFreshBox(configObject) {

        renderedsprite = new ObjectSprite(configObject);
        //renderedsprite.x = configObject.x;     renderedsprite.y = configObject.y;     renderedsprite.rotation = configObject.rotation;
        //renderedsprite.userData = {};
        renderedsprite.userData.name = "CHECKOUT";
        //renderedsprite.userData.nameTag = "";
        //renderedsprite.userData.colors = configObject.userData.colors;
       // renderedsprite.userData.configuration = configObject.userData.configuration;

        renderedsprite.sayHi = function() {
            var arr = [];
            const name = this.userData.name;
            const color = getColorCode(this.userData.colors);
            arr.push([name+' '+color]);

            var itemSet = {};
            this.userData.configuration.forEach(function(a){
                itemSet[a.ObjType] = itemSet[a.ObjType] + 1 || 1;
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
            var configObject = {
                userData: {
                    configuration: this.userData.configuration,
                    colors: this.userData.colors,
                },
                x: this.x+15,
                y: this.y+15,
                rotation: this.rotation,
            }    
            renderedsprite = spriteFreshBox(configObject);    
            spawnConfigurated();
        }
        // renderedsprite.saveIt = function() {
            
        //     var thisObject = {
        //         userData: this.userData,
        //         x:this.x,
        //         y:this.y,
        //         rotation:this.rotation,
        //     }
        //     return thisObject;
        // }

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
        for(var i = 0; i<configObject.userData.configuration.length; i++) {
            var sprite = new PIXI.Sprite.from("sprites/configurator/CHECKOUT/PixiPreview/CheckOut.svg");
            var tint = Category[ConfigurableList.CHECKOUT.Category].Color;
            sprite.tint = tint;
            renderedsprite.addChild(sprite);
            sprite.anchor.set(0.5);
            sprite.x+=(0.7*32+dist*64);
            sprite.scale.x = 0.7;
            sprite.scale.y = 0.794;
            dist += 0.7;
            const text = new PIXI.Text(configObject.userData.configuration[i].ObjType,{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'left'});
            text.anchor.set(0.5);
            text.scale.x = 1/sprite.scale.x;
            text.scale.y = 1/sprite.scale.y;
            sprite.addChild(text);
        }

        renderedsprite.userData.breadth = dist;
        renderedsprite.userData.width = 0.66;


        renderedsprite.children.forEach(item=>item.position.x-=dist*32);
        renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -25;
        renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -25;
        renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 25;
        renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 25;

        selectedItem = this;
        return renderedsprite;
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
                    timer = setTimeout(function() {
                        timer = null;
                        if(app.userData.canTranslate)
                        showContextMenu(event.data.global.x, event.data.global.y);
                    }, 2000);
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

    function showContextMenu(x,y) {
        Functions.showContextMenu(x,y);
        $("#ORconf").click(()=>{
            document.getElementById("ORClick").remove();
            reloadConfigurator(selectedItem);     
        }); 
    }

    async function asyncLoadFresh(item,_shopitems3d,preloadedMeshes) {

        selectedItem = item;

        var meshesObject = {};
        if(preloadedMeshes) {
            meshesObject = preloadedMeshes;
        }
        else {
            const gltfData = await modelLoader('../../sprites/configurator/'+mainName+'/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
        
        var _group = new THREE.Group();
        _shopitems3d.add(_group);
    
        var dist=0;
        var configuration = item.userData.configuration;
        var colors = item.userData.colors;

        _group.add(meshesObject['Side'].clone());
        for(var i = 0; i<configuration.length; i++)
        {
            var mesh = meshesObject[configuration[i].ObjType].clone();
            _group.add(mesh);
            mesh.children[0].material.color.r = colors[0]/255;
            mesh.children[0].material.color.g = colors[1]/255;
            mesh.children[0].material.color.b = colors[2]/255;
            mesh.translateX(0.699/2+dist);
            dist += 0.699;
    
        }
        var lastwall = meshesObject['Side'].clone();

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

CheckOut.prototype = Object.create( EventDispatcher.prototype );
CheckOut.prototype.constructor = CheckOut;

export {CheckOut}

var selectedItem = null;