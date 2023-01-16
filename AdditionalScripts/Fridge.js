import * as THREE from '../jsm/three.module.js';
import {EventDispatcher} from '../jsm/three.module.js';
import {Functions,ConfiguratorInterface, ConfiguratorView, modelLoader} from './FunctionsForConf.js';
import {SlimDeck} from './DataSet.js';
import {RBMmenuConf, FridgesConfiguration, fridgeWidthSet, CopyButton, ItemCatalog} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList,Category} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.FRIDGE.Elements;
const listBorders = ConfigurableList.FRIDGE.ElementsBorders;
let arr_build=[],CopyThisConfigeration=[];
let timer;
var Fridge = function(container2d, app) 
{
    const mainName = 'FRIDGE';
    var configuratorView;

    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;


    function setUpInterface(){
        ConfiguratorInterface.SetGeneralElements("Fridge","FRIDGE");
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, .radio-height, #bottom_ext").click(function() {
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
        $("#spawnconfigurated").click(function(){
            configuratorView.configurateItem(arr_build);
            spawnConfigurated();
            configuratorView.hideConfigurator();
            arr_build = ConfiguratorInterface.ClearArray ();
            $("#confarea").remove();
          });
        
        $(".closeconf").click(function(){
            $("#confarea").remove();
            configuratorView.hideConfigurator();
            StackControl=0;
            arr_build = ConfiguratorInterface.ClearArray();
        
        });
        $("#substactSP").click(function(){
            const info = document.getElementById("akrile");
            if (+info.innerHTML > +info.dataset.min){
                info.innerHTML = +info.innerHTML-1;
                configuratorView.configurateItem(arr_build);
            }
        });
        $("#addSP").click(function(){
            const info = document.getElementById("akrile");
            if (+info.innerHTML < +info.dataset.max){
                info.innerHTML = +info.innerHTML+1;
                configuratorView.configurateItem(arr_build);
            }
        });
    }



    function startConfigurator(){
        selectedItem = null;
        setUpInterface();
        add_Conf_stack();
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
    }

    

    function reloadConfigurator(item){
        setUpInterface();
        item.userData.configuration.forEach(item=>{
            add_Conf_stack("right", item);
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
        //faceborders set
        const faceborderR = document.querySelectorAll('input[name="border"]');
        faceborderR.forEach(i=> {if(item.userData.faceborderR == i.value) 
                                       i.checked = true;
                            });
        const faceborderL = document.querySelectorAll('input[name="border"]');
        faceborderL.forEach(i=> {if(item.userData.faceborderL == i.value) 
                                       i.checked = true;
                            });

        //bottom
        const bottom = document.getElementById("bottom_ext");
        if(item.userData.extCooling != 0)
            bottom.checked = true;
        document.getElementById("akrile").innerHTML=item.userData.editionalBordersEm;
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
        configuratorView.configurateItem(arr_build);
    }




    function UpDateValueInArray (arr,itemId, ObjType=-1, width=-1, shAmount=-1, shDepth=-1,isDoor=-1, doorType=-1){
        if(width!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].width=width;
        if(shAmount!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].shAmount=shAmount;
        if(ObjType!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].ObjType=ObjType;
        if(shDepth!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].shDepth=shDepth;
        if(isDoor!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].isDoor=isDoor;
        if(doorType!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].doorType=doorType;
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
        }
    }

    


    function CloseF(e){
        var id =e.target.id.replace(/[^0-9]/g,'');
        $("#Collecton"+id).remove();
        arr_build = ConfiguratorInterface.RemoveFromArray(arr_build, id);
        configuratorView.configurateItem(arr_build);
    }


    function ExtendedBottom(e){
        const id = e.target.name.replace(/[^0-9]/g,'');
        let value=e.target.value;
        if(e.target.name[0]=="w")
        UpDateValueInArray(arr_build,id,-1,value);
        if(e.target.name[0]=="a")
        UpDateValueInArray(arr_build,id,-1,-1,value);
        if(e.target.name[0]=="d")
        UpDateValueInArray(arr_build,id,-1,-1,-1,value);
        if(e.target.name[0]=="i")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,e.target.checked);
        if(e.target.name[0]=="t")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,-1,value);

        configuratorView.configurateItem(arr_build);
    }

    function UpdateInterface(id,width,shAmount,shDepth, isDoor, doorType){
        const shAmountS = document.querySelectorAll('input[name="amountshelf'+id+'"]');
        shAmountS.forEach(i=> {if(shAmount == i.value) 
                                        i.checked = true;
                            });
        const doorTypeS = document.querySelectorAll('input[name="typeDoor'+id+'"]');
        doorTypeS.forEach(i=> {if(doorType == i.value) 
                                        i.checked = true;
                            });
        const widthS = document.querySelectorAll('input[name="width'+id+'"]');
        widthS.forEach(i=> {if(width == i.value) 
                                        i.checked = true;
                            });
        const isDoorS = document.getElementById("border"+id);
        if(isDoor)
            isDoorS.checked = true;
    }





    function add_Conf_stack (side="right", item=[])
    {
        let ObjType="standart", width="937",shAmount="4",shDepth=ObjType=="freeze"?"300":"360", isDoor=false, doorType="FrontOpen";
        if(item.ObjType)    
            ObjType=item.ObjType;
        if(item.width)
            width=item.width;
        if(item.shAmount)
            shAmount=item.shAmount;
        if(item.shDepth)
            shDepth=item.shDepth;
        if(item.isDoor)
            isDoor=item.isDoor;
        if(item.doorType)
            doorType=item.doorType;    


        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;
        

        if (arr_build.length != 0)
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>`;
        
        ConfiguratorInterface.CreateButtonControl();
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
                ${ItemCatalog("FRIDGE",StackControl,listBorders.All)}
                </div>
            </div>
            <div class="shelf-but-selection">
            ${FridgesConfiguration(StackControl)}
    </div>
            ${CopyButton(StackControl)}
            ${CloseButton}
        `
        div.innerHTML=added;
        fridgeWidthSet(listBorders.fresh.includes(ObjType)?true:false,StackControl);
    
        if (arr_build.length != 0)
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>CloseF(e));
        ConfiguratorInterface.AddToArray(arr_build,{id:StackControl, ObjType: ObjType, width: width, shAmount: shAmount, shDepth:shDepth, isDoor:isDoor, doorType:doorType}, side =="right" ? "right" : "left");
        SetInterface(StackControl, ObjType);
        UpdateInterface(StackControl,width,shAmount,shDepth, isDoor, doorType);
        $(".bottomCt").click((e)=>ExtendedBottom(e));
        $("#Copy"+StackControl).click((e)=>{CopyThisConfigeration=ConfiguratorInterface.CopyStack(e, arr_build);})
        $(".obj-item").click((e)=>SelectStack(e));
        $("#settingsButton").click((e)=>OpenConfigurationMenu(e));
    }


    function OpenConfigurationMenu(){
        let MenuBody =`
            <div class="right-menu">
            </div>
        `
        $("#confarea").prepend(MenuBody);

    } 

    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        UpDateValueInArray(arr_build,...id);
        CopyThisConfigeration=ConfiguratorInterface.ClearCopyBuffer();
        configuratorView.configurateItem(arr_build);
    }

//
var confreqv;
var renderedsprite = null;


function addToArray(arr, from, name, qnt) {
    arr.push([from[name].art,from[name].name,qnt,from[name].price,from[name].price*qnt]);
}

function addMultipleToArray(arr, from, name, qnt) {
    for(var item in from[name]) {
        arr.push([from[name][item].art,from[name][item].name,qnt,from[name][item].price,+from[name][item].price*+qnt]);
    } 
}

function spriteFreshBox(configObject) {
    renderedsprite = new PIXI.Container();
    renderedsprite.x = configObject.x;     renderedsprite.y = configObject.y;     renderedsprite.rotation = configObject.rotation;
    renderedsprite.userData = {};
    renderedsprite.userData.name = "FRIDGE";
    renderedsprite.userData.configuration = configObject.userData.configuration;;
    renderedsprite.userData.colors = configObject.userData.colors;
    renderedsprite.userData.faceborderL = configObject.userData.faceborderL;
    renderedsprite.userData.faceborderR = configObject.userData.faceborderR;
    renderedsprite.userData.extCooling = configObject.userData.extCooling;
    renderedsprite.userData.editionalBordersEm = configObject.userData.editionalBordersEm;
    renderedsprite.userData.nameTag = configObject.userData.nameTag;

    renderedsprite.sayHi = function() {
        var color = getColorCode(this.userData.colors)
        var arr = [['Refrigerated multideck '+color]];

        var ext = this.userData.extCooling==true?'Ext':'Int';

        var name = this.userData.configuration[0].ObjType+this.userData.faceborderL;
        addToArray(arr, SlimDeck, name, 1);
        name = this.userData.configuration[this.userData.configuration.length-1].ObjType+this.userData.faceborderR;
        addToArray(arr, SlimDeck, name, 1);

        var itemSet = {};
        this.userData.configuration.forEach(stack => {
            if(stack.isDoor)
                name = stack.ObjType+ext+stack.doorType+stack.width;
            else
                name = stack.ObjType+ext+stack.width;
            itemSet[name] = itemSet[name] + 1 || 1;
        })

        var dividerSet = {};
        const CheckSet =this.userData.configuration;
        this.userData.configuration.forEach((stack,it) => {
            if (CheckSet[it+1]){
                let Ldoor='',Rdoor=''
                if(stack.isDoor) Ldoor="doors"
                if(CheckSet[it+1].isDoor) Rdoor="doors"
                name ="inner" + stack.ObjType+Ldoor+"-"+CheckSet[it+1].ObjType +Rdoor;
                dividerSet[name] = dividerSet[name] + 1 || 1;
            }
        })
        for(var key in dividerSet){
            addToArray(arr, SlimDeck, key, dividerSet[key]);
        }
        var shelvesObj = {};
        this.userData.configuration.forEach(function(a){
            var realWidth=+a.width, realAmount=+a.shAmount;
            if(a.width == 2500) {
                realWidth = 1250;
                realAmount = +a.shAmount*2;
            } 
            if(a.width == 1875) {
                realWidth = 937;
                realAmount = +a.shAmount*2;
            }
            if(a.width == 1562) {
                realWidth = 780;
                realAmount = +a.shAmount*2;
            }
            if(a.ObjType == "freeze") a.shDepth = 300;
            if(a.ObjType == "standart") a.shDepth = 360;
            if(a.ObjType == "pro")  a.shDepth = 360;
            var name = "shelf"+realWidth+'x'+a.shDepth;
            shelvesObj[name] = shelvesObj[name] ? +shelvesObj[name]+realAmount : +realAmount;
        });
        for(var key in shelvesObj) {
            addToArray(arr, SlimDeck, key, shelvesObj[key]);
        }



        for(var key in itemSet){
            addMultipleToArray(arr, SlimDeck, key, itemSet[key]);
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
        var sprite = new PIXI.Sprite.from("sprites/configurator/FRIDGE/PixiPreview/Fridge.svg");
        var tint = Category[ConfigurableList.FRIDGE.Category].Color;
        sprite.tint = tint;

        renderedsprite.addChild(sprite);        
        sprite.anchor.set(0.5);
        sprite.x+=(configObject.userData.configuration[i].width/1000*32 + dist*64);
        sprite.scale.x = configObject.userData.configuration[i].width/1000;
        sprite.scale.y = 0.674;
        dist += configObject.userData.configuration[i].width/1000;
        const text = new PIXI.Text(ConfigurableList.FRIDGE.Elements[configObject.userData.configuration[i].ObjType].itname.replace('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
        text.anchor.set(0.5);
        text.scale.x = 1/sprite.scale.x;
        text.scale.y = 1/sprite.scale.y;
        sprite.addChild(text);
    }


    renderedsprite.breadth = dist;

    renderedsprite.children.forEach(item=>item.position.x-=dist*32);
    renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -21.6;
    renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -21.6;
    renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 21.6;
    renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 21.6;

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
    $("#ORclose").click(()=>{Functions.hideContextMenu()});
    $("#ORremove").click(()=>{container2d.removeChild(selectedItem); Functions.hideContextMenu();});
    $("#copyObject").click(()=>{selectedItem.clone(); Functions.hideContextMenu();});
    $("#ORrotate").on("input change",(item)=>{selectedItem.rotation = (+item.target.value/180*Math.PI);});
    $("#nameTag").val(selectedItem.userData.nameTag);
    $("#nameTag").on("input change",(item)=>{selectedItem.userData.nameTag=item.target.value});
    $("#ORClick").click(function(e){ if(e.currentTarget==e.target)$("#ORClick").remove();})
    $("#ORconf").click(()=>{
        Functions.hideContextMenu();
        reloadConfigurator(selectedItem);     
    });
    $("#depthST").text("Depth: " + " 0.660 m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*0.660)*100)/100 + "m&#178");
    $("#lengthST").text("Length: " + Math.round(selectedItem.breadth*100)/100 + "m");
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
                    Functions.showContextMenu(event.data.global.x, event.data.global.y);
                    $("#ORconf").click(()=>{
                        document.getElementById("ORClick").remove();;
                        reloadConfigurator(selectedItem);     
                    });
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
            Functions.showContextMenu(event.data.global.x, event.data.global.y);
            $("#ORconf").click(()=>{
                document.getElementById("ORClick").remove();;
                reloadConfigurator(selectedItem);     
            });
        });
}

    

    function setMeshColor(mesh,colors) {
        mesh.children[0].material.color.r = colors[0]/255;
        mesh.children[0].material.color.g = colors[1]/255;
        mesh.children[0].material.color.b = colors[2]/255;
    }


    async function asyncLoadFresh(item, _shopitems3d, preloadedMeshes)
    { 
        var akrylicBorders = 0;
        var colors = item.userData.colors;
        var meshesObject = {};
        if(preloadedMeshes) {
            meshesObject = preloadedMeshes;
        }
        else {
            const gltfData = await modelLoader('../../sprites/configurator/FRIDGE/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
        var _group = new THREE.Group();
        _shopitems3d.add(_group);
    
    
        var faceborderL = item.userData.faceborderL;
        if(faceborderL == 'LeftGlass') {
            var mesh = meshesObject['SideA1'].clone();
            setMeshColor(mesh,colors)
            _group.add(mesh);
        }
        if(faceborderL == 'LeftMirror') {
            var mesh = meshesObject['SideA2'].clone();
            setMeshColor(mesh,colors)
            _group.add(mesh);
        }
        if(faceborderL == 'LeftSolid') {
            var mesh = meshesObject['SideA3'].clone();
            setMeshColor(mesh,colors)
            _group.add(mesh);
        }
    
    
        var dist = 0;
        for(var i = 0; i<item.userData.configuration.length; i++)
        {
            var currentStack = item.userData.configuration[i];
            var nextStack = item.userData.configuration[i+1];
    
            var mesh = meshesObject['Main'].clone();
            setMeshColor(mesh,colors)
    
            mesh.scale.x = currentStack.width/1000;
            mesh.translateX(mesh.scale.x/2+dist);
    
            _group.add(mesh);
    
            var mesh = meshesObject['LittlePanel'].clone();
            setMeshColor(mesh,colors)
            mesh.translateX(dist);
            _group.add(mesh);
            
            if(!item.userData.extCooling && currentStack.ObjType!='freeze') {
                var mesh = meshesObject['Reshetka'].clone();
                mesh.translateX(dist+currentStack.width/1000-0.25);
                setMeshColor(mesh,colors)
                _group.add(mesh);
            }
    
            if(currentStack.ObjType=='freeze') {
                var mesh = meshesObject['Reshetka'].clone();
                setMeshColor(mesh,colors)
                mesh.translateX(dist+currentStack.width/1000-0.25);
                _group.add(mesh);
                var locDist = dist;
                const doorQnt = Math.floor(currentStack.width/1000/0.62);
                for(var door = 0; door<doorQnt; door++) {
                    var mesh = meshesObject['DoorW'].clone();
                    setMeshColor(mesh,colors)
                    mesh.translateX(locDist);
                    _group.add(mesh);
                    locDist+=0.75;
                }
            }
            else {
                if(currentStack.isDoor) {
                    var locDist = dist;
                    var doorQnt;
                    if(currentStack.width==2500) {
                        doorQnt = 4;
                    }
                    if(currentStack.width<2500) {
                        doorQnt = 3;
                    }
                    if(currentStack.width<1875) {
                        doorQnt = 2;
                    }
                    var doorScale = currentStack.width/1000/doorQnt;

                    for(var door = 0; door<doorQnt; door++) {
                        var mesh = meshesObject['DoorN'].clone();
                        setMeshColor(mesh,colors)
                        mesh.translateX(locDist);
                        mesh.scale.x = doorScale;
                        _group.add(mesh);
                        locDist+=currentStack.width/1000/doorQnt;
                    }
                }
            }
            if(currentStack.width<1600) {
                for(var sh = 0; sh<(+currentStack.shAmount); sh++) {
                    var mesh = meshesObject['Shelf'].clone();
                    //setMeshColor(mesh,colors)
                    mesh.scale.z = currentStack.shDepth/1000;
                    mesh.translateZ(-0.1);
                    _group.add(mesh);
                    mesh.translateY((1600-350)/1000/(+currentStack.shAmount)*sh+0.2);
                    mesh.scale.x = currentStack.width/1000;
                    mesh.translateX(mesh.scale.x/2+dist);            
                }
            }
            else {
                for(var sh = 0; sh<(+currentStack.shAmount); sh++) {
                    var mesh = meshesObject['Shelf'].clone();
                    //setMeshColor(mesh,colors)
                    mesh.scale.z = currentStack.shDepth/1000;
                    mesh.translateZ(-0.1);
                    _group.add(mesh);
                    mesh.translateY((1600-350)/1000/(+currentStack.shAmount)*sh+0.2);
                    mesh.scale.x = currentStack.width/1000/2;
                    mesh.translateX(mesh.scale.x/2+dist);
                    
                    var mesh = meshesObject['Shelf'].clone();
                    //setMeshColor(mesh,colors)
                    mesh.scale.z = currentStack.shDepth/1000;
                    mesh.translateZ(-0.1);
                    _group.add(mesh);
                    mesh.translateY((1600-350)/1000/(+currentStack.shAmount)*sh+0.2);
                    mesh.scale.x = currentStack.width/1000/2;
                    mesh.translateX(mesh.scale.x*1.5+dist);     
                }
            }
            if(getDifference(currentStack,nextStack)) {
                var mesh = meshesObject['Between1'].clone();
                setMeshColor(mesh,colors)
                mesh.translateX(dist+currentStack.width/1000);
                _group.add(mesh);
            }

            if(currentStack.width>1600) akrylicBorders++;
            if(!getDifference(currentStack,nextStack) && nextStack) {
                akrylicBorders++;
            }
    
            dist+=currentStack.width/1000;
        }
        var faceborderR = item.userData.faceborderR;
        if(faceborderR == 'RightGlass') {
            var mesh = meshesObject['SideA1'].clone();
            setMeshColor(mesh,colors)
            mesh.translateX(dist);
            _group.add(mesh);
        }
        if(faceborderR == 'RightMirror') {
            var mesh = meshesObject['SideA2'].clone();
            setMeshColor(mesh,colors)
            mesh.translateX(dist);
            _group.add(mesh);
        }
        if(faceborderR == 'RightSolid') {
            var mesh = meshesObject['SideA3'].clone();
            setMeshColor(mesh,colors)
            mesh.translateX(dist);
            _group.add(mesh);
        }

        if(!preloadedMeshes) _group.rotation.set(Math.PI/2,-item.rotation,0);
        if(item.position) _group.position.set(item.x/64, -item.y/64, 0);
        _group.children.forEach( item => {item.position.x-=dist/2;});
        if(document.getElementById("akrile"))
            document.getElementById("akrile").dataset.max=akrylicBorders;

            if(preloadedMeshes) Functions.addDimensions( _group );

        return
    }


this.spawnConfigurated = spawnConfigurated;
this.loadPostBox = spriteFreshBox;
this.startConfigurator = startConfigurator;

};

Fridge.prototype = Object.create( EventDispatcher.prototype );
Fridge.prototype.constructor = Fridge;

export {Fridge}

var selectedItem = null;

function getDifference(item1, item2) {
    if(!item1 || !item2) return false;
    return (!(item1.ObjType==item2.ObjType && item1.isDoor==item2.isDoor));
}