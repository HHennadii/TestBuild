import * as THREE from '../jsm/three.module.js';
import {OrbitControls} from '../jsm/controls/OrbitControls.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {SlimDeck} from './DataSet.js';
import {MainWindow, fridgeconf, RBMmenuConf, addStackButtonsFridge, FridgesConfiguration, fridgeWidthSet, CopyButton, ItemCatalog} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.FRIDGE.Elements;
const listBorders = ConfigurableList.FRIDGE.ElementsBorders;
const needToFixIt = "FRIDGE";
let arr_build=[],CopyThisConfigeration=[];
let timer;
var Fridge = function(container2d, app) 
{
    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    var hdrCubeRenderTarget;


    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#confmenu").append(fridgeconf);
        $("#PostBoxconf").append(addStackButtonsFridge);
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
        $("#substactSP").click(function(){
            const info = document.getElementById("akrile");
            if (+info.innerHTML > +info.dataset.min){
                info.innerHTML = +info.innerHTML-1;
                configurateItem();
                }
        });
        $("#addSP").click(function(){
            const info = document.getElementById("akrile");
            if (+info.innerHTML < +info.dataset.max){
                info.innerHTML = +info.innerHTML+1;
                configurateItem();
                }
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
            add_Conf_stack("right", item.ObjType, item.width,item.shAmount,item.shDepth, item.isDoor, item.doorType);
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
            CopyThisConfigeration =[itemToCopy.ObjType, itemToCopy.width,itemToCopy.shAmount,itemToCopy.shDepth, itemToCopy.isDoor, itemToCopy.doorType];
        }    
    }

    function ClearCopyBuffer(){
        $(".active-copy").removeClass('active-copy');
        CopyThisConfigeration =[];
    }


    function UpDateValueInArray (arr,itemId, ObjType=-1, width=-1, shAmount=-1, shDepth=-1,isDoor=-1, doorType=-1){
        if(width!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].width=width;
        if(shAmount!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].shAmount=shAmount;
        if(ObjType!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].ObjType=ObjType;
        if(shDepth!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].shDepth=shDepth;
        if(isDoor!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].isDoor=isDoor;
        if(doorType!=-1)arr[arr.findIndex(obj => obj.id ==itemId)].doorType=doorType;
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
        UpDateValueInArray(arr_build,id,-1,value);
        if(e.target.name[0]=="a")
        UpDateValueInArray(arr_build,id,-1,-1,value);
        if(e.target.name[0]=="d")
        UpDateValueInArray(arr_build,id,-1,-1,-1,value);
        if(e.target.name[0]=="i")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,e.target.checked);
        if(e.target.name[0]=="t")
        UpDateValueInArray(arr_build,id,-1,-1,-1,-1,-1,value);

        configurateItem(); 
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





    function add_Conf_stack (side="right", ObjType="standart", width="937",shAmount="4",shDepth="360", isDoor=false, doorType="FrontOpen")
    {

        console.log(ObjType, width,shAmount,shDepth, isDoor, doorType);
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
        AddToArray(arr_build,{id:StackControl, ObjType: ObjType, width: width, shAmount: shAmount, shDepth:shDepth, isDoor:isDoor, doorType:doorType}, side =="right" ? "right" : "left");
        SetInterface(StackControl, ObjType);
        UpdateInterface(StackControl,width,shAmount,shDepth, isDoor, doorType);
        $(".bottomCt").click((e)=>ExtendedBottom(e));
        $("#Copy"+StackControl).click((e)=>{ CopyStack(e);})
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

//
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
    
    //
    //const id = needToFixIt;
    const id = 'FRIDGE';
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
	
	prcontrols =  new OrbitControls(prcamera, prrenderer.domElement);
	prcontrols.maxDistance = 20;
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


function addToArray(arr, from, name, qnt) {
    arr.push([from[name].art,from[name].name,qnt,from[name].price,from[name].price*qnt]);
}

function addMultipleToArray(arr, from, name, qnt) {
    for(var item in from[name]) {
        arr.push([from[name][item].art,from[name][item].name,qnt,from[name][item].price,+from[name][item].price*+qnt]);
    } 
}

function spriteItem(arr_build, colors, faceborderR,faceborderL, extCooling, editionalBordersEm, x=0, y=0, rot=0) {

    renderedsprite = new PIXI.Container();
    renderedsprite.x = x;     renderedsprite.y = y;     renderedsprite.rotation = rot;
    renderedsprite.name = "FRIDGE";
    renderedsprite.configuration = arr_build;
    renderedsprite.userData = {};
    renderedsprite.userData.colors = colors;
    renderedsprite.userData.faceborderL = faceborderL;
    renderedsprite.userData.faceborderR = faceborderR;
    renderedsprite.userData.extCooling = extCooling;
    renderedsprite.userData.editionalBordersEm = editionalBordersEm;

    renderedsprite.sayHi = function() {
        var color = getColorCode(this.userData.colors)
        var arr = [['Refrigerated multideck '+color]];

        var ext = this.userData.extCooling==true?'Ext':'Int';

        var name = this.configuration[0].ObjType+this.userData.faceborderL;
        addToArray(arr, SlimDeck, name, 1);
        name = this.configuration[this.configuration.length-1].ObjType+this.userData.faceborderR;
        addToArray(arr, SlimDeck, name, 1);

        var itemSet = {};
        this.configuration.forEach(stack => {
            if(stack.isDoor)
                name = stack.ObjType+ext+stack.doorType+stack.width;
            else
                name = stack.ObjType+ext+stack.width;
            itemSet[name] = itemSet[name] + 1 || 1;
        })

        var dividerSet = {};
        const CheckSet =this.configuration;
        this.configuration.forEach((stack,it) => {
            if (CheckSet[it+1]){
                let Ldoor='',Rdoor=''
                if(stack.isDoor) Ldoor="doors"
                if(CheckSet[it+1].isDoor) Rdoor="doors"
                name ="inner" + stack.ObjType+Ldoor+"-"+CheckSet[it+1].ObjType +Rdoor;
                dividerSet[name] = dividerSet[name] + 1 || 1;
            }
        })
        for(var key in dividerSet){
            //console.log(key);
            addToArray(arr, SlimDeck, key, dividerSet[key]);
        }
        var shelvesObj = {};
        this.configuration.forEach(function(a){
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
            //console.log(key);
            //console.log(SlimDeck[key]);
            addToArray(arr, SlimDeck, key, shelvesObj[key]);
        }



        for(var key in itemSet){
            //console.log(key);
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
        renderedsprite = spriteItem(this.configuration, this.userData.colors, this.userData.faceborderR, this.faceborderL, this.userData.extCooling, this.userData.editionalBordersEm, this.x+20, this.y+20, this.rotation);
        spawnConfigurated();
    }
    renderedsprite.saveIt = function() {
        var thisObject = {
            name:this.name,
            configuration: this.configuration,
            userData: {
                colors: this.userData.colors,
                x:this.x,
                y:this.y,
                rotation:this.rotation,
                extCooling: this.userData.extCooling,
                faceborderL: this.faceborderL,
                faceborderR: this.faceborderR,
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
        var sprite = new PIXI.Sprite.from("sprites/configurator/FRIDGE/PixiPreview/Fridge.svg");
        renderedsprite.addChild(sprite);        

        sprite.x+=(dist*64);
        sprite.y = -21.6; //тут
        sprite.scale.x = arr_build[i].width/1000;
        sprite.scale.y = 0.674;
        dist += arr_build[i].width/1000;
    }
    let text = new PIXI.Text(renderedsprite.name,{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
    renderedsprite.addChild(text);

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
    $("#ORclose").click(()=>{hideContextMenu()});
    $("#ORremove").click(()=>{container2d.removeChild(selectedItem); hideContextMenu();});
    $("#copyObject").click(()=>{selectedItem.clone(); hideContextMenu();});
    $("#ORrotate").on("input change",(item)=>{selectedItem.rotation = (+item.target.value/180*Math.PI);});
    $("#ORClick").click(function(e){ if(e.currentTarget==e.target)$("#ORClick").remove();})
    $("#ORconf").click(()=>{
        hideContextMenu();
        reloadConfigurator(selectedItem);     
    });
    $("#depthST").text("Depth: " + " 0.660 m");
    $("#squareST").html("Square: " + Math.round((selectedItem.breadth*0.660)*100)/100 + "m&#178");
    $("#lengthST").text("Length: " + Math.round(selectedItem.breadth*100)/100 + "m");
}

function hideContextMenu()
{
    document.getElementById("ORClick").remove();
}

    
function configurateItem()
{
    prgroup.remove(...prgroup.children);
    //замютив глибину
    arr_build.forEach(stack => {
        if(stack.ObjType == "freeze") stack.shDepth = 300;
        if(stack.ObjType == "standart") stack.shDepth = 360;
        if(stack.ObjType == "pro")  stack.shDepth = 360;
    })
    var item = {
        configuration: arr_build,
        userData: {
            colors: document.querySelector('input[name="color"]:checked').value.split(' '),
            faceborderR: document.querySelector('input[name="borderR"]:checked').value,
            faceborderL: document.querySelector('input[name="borderL"]:checked').value,
            extCooling: document.getElementById("bottom_ext").checked,
            editionalBordersEm: +document.getElementById("akrile").innerHTML,
        }
    }

    asyncLoad(item,prgroup,preloadedMeshes);
    spriteItem(item.configuration, item.userData.colors, item.userData.faceborderR, item.userData.faceborderL, item.userData.extCooling, item.userData.editionalBordersEm);
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


    function setMeshColor(mesh,colors) {
        mesh.children[0].material.color.r = colors[0]/255;
        mesh.children[0].material.color.g = colors[1]/255;
        mesh.children[0].material.color.b = colors[2]/255;
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
        for(var i = 0; i<item.configuration.length; i++)
        {
            var currentStack = item.configuration[i];
            var nextStack = item.configuration[i+1];
    
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
    
        let renderTarget = hdrCubeRenderTarget;
        const newEnvMap = renderTarget ? renderTarget.texture : null;
        _group.children.forEach(child => {
            if (newEnvMap)
            {
                child.children.forEach(ch=>{
                    //ch.castShadow = true;
                    ch.material.envMap = newEnvMap;
                })
                //child.children[0].material.color.r = colors[0]/255;
                //child.children[0].material.color.g = colors[1]/255;
                //child.children[0].material.color.b = colors[2]/255;
            }
        });



        if(!preloadedMeshes) _group.rotation.set(Math.PI/2,-item.rotation,0);
        if(item.position) _group.position.set(item.x/64, -item.y/64, 0);
        _group.children.forEach( item => {item.position.x-=dist/2;});
        //console.log(akrylicBorders);
        if(document.getElementById("akrile"))
            document.getElementById("akrile").dataset.max=akrylicBorders;
        return
    }


this.configurateItem = configurateItem;
this.preloadMeshes = preloadMeshesObject;
this.spawnConfigurated = spawnConfigurated;
this.loadPostBox = spriteItem;
this.startConfigurator = startConfigurator;

};

Fridge.prototype = Object.create( EventDispatcher.prototype );
Fridge.prototype.constructor = Fridge;

export {Fridge}

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

function getDifference(item1, item2) {
    if(!item1 || !item2) return false;
    return (!(item1.ObjType==item2.ObjType && item1.isDoor==item2.isDoor));
}


function modelLoader(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject);
    });
}