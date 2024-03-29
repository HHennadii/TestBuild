import * as THREE from '../jsm/three.module.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { Functions, ConfiguratorView, modelLoader } from './FunctionsForConf.js';
import {Postbox_parts,D700,Fresh} from './DataSet.js';
import {MainWindow, colorSelect, addStackButtons, isRoof, RBMmenuConf, CopyButton, ItemCatalogPostBox} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList,Category} from './ConfigurableList.js';
import {getColorCode} from './Coefs.js';

const list = ConfigurableList.LOKOFRESH.Elements;
const listBorders = ConfigurableList.LOKOFRESH.ElementsBorders;
let arr_build=[],CopyThisConfigeration=[];


var LokoFresh = function(container2d, app) 
{
    const mainName = 'LOKOFRESH';
    var configuratorView;

    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let timer;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#PostBoxconf").append(addStackButtons);
        $("#option").append(isRoof);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
            configuratorView.configurateItem(arr_build);
        })
        $(".add-right").click(function() {
            add_Conf_stack("right",...CopyThisConfigeration);
            configuratorView.configurateItem(arr_build);
        });
        $(".add-left").click(function() {
            add_Conf_stack("left",...CopyThisConfigeration);
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
        add_Conf_stack("right",'TerminalCooling');
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
        //roof
        const roof = document.getElementById("access3");
        if(item.userData.kazyrek != 0)
             roof.checked = true;

        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
        configuratorView.configurateItem(arr_build);
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
            CopyThisConfigeration =[itemToCopy];
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
        if (arr_build.length>1) 
            document.getElementById("spawnconfigurated").disabled = false;
        else 
            document.getElementById("spawnconfigurated").disabled = true;
    }


    function CloseF(e){
        var id =e.target.id.replace(/[^0-9]/g,'');
        $("#Collecton"+id).remove();
        arr_build = RemoveFromArray(arr_build, id);
        CreateButtonControl();
        IsRoof(arr_build);
        configuratorView.configurateItem(arr_build);
    }



    
    function IsRoof(arr){  
        let checkbox = document.getElementById("access03");
        const index= arr.findIndex((obj => listBorders.terminal.includes(obj.value)));
            if((arr_build.length==2 ) || (arr_build[index+1] && arr_build[index-1]) ){
                checkbox.style.display="flex";
                return;
            }
        document.getElementById("access3").checked= false; 
        checkbox.style.display="none";
        
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
        IsRoof(arr_build);
        ClearCopyBuffer();
        configuratorView.configurateItem(arr_build);
         
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
        IsRoof(arr_build);
        ClearCopyBuffer();
        configuratorView.configurateItem(arr_build);
    }

    function add_Conf_stack (side="right", itemToInsert="Cooling")
    {
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;

        if (!listBorders.terminal.includes(itemToInsert))
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>${CopyButton(StackControl)}`;
        AddToArray(arr_build,{id:StackControl, value: itemToInsert}, side =="right" ? "right" : "left");
        CreateButtonControl();
        for (let key in listBorders){   
            if (listBorders[key].includes(itemToInsert)){
                //console.log(key);
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
        const selector=itemToInsert=="Cooling"?"usual":"terminal";
        
        let added=`
            <img class="img_selector" id="Img${StackControl}" alt="${itemToInsert}" src="${list[itemToInsert].imageName}">
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
               <div class="name-tag"> ${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                ${ItemCatalogPostBox("LOKOFRESH",StackControl,listBorders[selector])}
                </div>
            </div> 
            ${CloseButton}
            
           
        `
        div.innerHTML=added;
    
        if (!listBorders.terminal.includes(itemToInsert))
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>CloseF(e));
        IsRoof(arr_build);
        $("#Copy"+StackControl).click((e)=>{ CopyStack(e);})
        $(".obj-item").click((e)=>SelectStack(e));
    }




    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        UpDateValueInArray(arr_build,...id);
        ClearCopyBuffer();
        configuratorView.configurateItem(arr_build);
    }



var confreqv;
var renderedsprite = null;



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
    //console.log(cannopyarray)
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
        if(ConfigurableList.LOKOFRESH.ElementsBorders.terminal.includes(cannopyarray[i].value)) {
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


function spriteFreshBox(configObject) {
    var pc_idx;

    renderedsprite = new PIXI.Container();
    renderedsprite.x = configObject.x;     renderedsprite.y = configObject.y;     renderedsprite.rotation = configObject.rotation;
    renderedsprite.userData = {};
    renderedsprite.userData.name = "LOKOFRESH";
    renderedsprite.userData.configuration = configObject.userData.configuration;
    renderedsprite.userData.colors = configObject.userData.colors;
    renderedsprite.userData.depth = 700;
    renderedsprite.userData.kazyrek = configObject.userData.kazyrek;
    renderedsprite.userData.nameTag = "";

    renderedsprite.userData.roofconfiguration = layoutRoof(configObject.userData.configuration, configObject.userData.kazyrek);

    renderedsprite.sayHi = function() {
        var arr = [];
        const name = this.userData.name;
        const color = getColorCode(this.userData.colors);
        arr.push([name+' '+color]);
        var itemSet = {};
        this.userData.configuration.forEach(function(a){
            itemSet[a.value] = itemSet[a.value] + 1 || 1;
        });
        for(var key in itemSet){
            arr.push([Fresh[key].art,Fresh[key].name,itemSet[key],Fresh[key].price,Fresh[key].price*itemSet[key]]);
        }

        const floorBlocks = fillOnes(this.userData.configuration.length);

        if(floorBlocks[0]) arr.push([Fresh.Base1.art,Fresh.Base1.name,floorBlocks[0],Fresh.Base1.price,Fresh.Base1.price*floorBlocks[0]]);
        if(floorBlocks[1]) arr.push([Fresh.Base2.art,Fresh.Base2.name,floorBlocks[1],Fresh.Base2.price,Fresh.Base2.price*floorBlocks[1]]);
        if(floorBlocks[2]) arr.push([Fresh.Base3.art,Fresh.Base3.name,floorBlocks[2],Fresh.Base3.price,Fresh.Base3.price*floorBlocks[2]]);

    // [leftVolume, rightVolume, mid1Qnt, mid2Qnt, mid3Qnt, SelfSt2, SelfSt3,SelfSt2R, SelfSt3R, LeftRoof, MidlRoof, RightRoof]
        if(this.userData.roofconfiguration[0] == 1) arr.push([Fresh.LeftCan1.art,Fresh.LeftCan1.name,1,Fresh.LeftCan1.price,Fresh.LeftCan1.price])
        if(this.userData.roofconfiguration[0] == 2) arr.push([Fresh.LeftCan2.art,Fresh.LeftCan2.name,1,Fresh.LeftCan2.price,Fresh.LeftCan2.price])
        if(this.userData.roofconfiguration[0] == 3) arr.push([Fresh.LeftCan3.art,Fresh.LeftCan3.name,1,Fresh.LeftCan3.price,Fresh.LeftCan3.price])

        if(this.userData.roofconfiguration[1] == 1) arr.push([Fresh.RightCan1.art,Fresh.RightCan1.name,1,Fresh.RightCan1.price,Fresh.RightCan1.price])
        if(this.userData.roofconfiguration[1] == 2) arr.push([Fresh.RightCan2.art,Fresh.RightCan2.name,1,Fresh.RightCan2.price,Fresh.RightCan2.price])
        if(this.userData.roofconfiguration[1] == 3) arr.push([Fresh.RightCan3.art,Fresh.RightCan3.name,1,Fresh.RightCan3.price,Fresh.RightCan3.price])

        if(this.userData.roofconfiguration[2]) arr.push([Fresh.MidCan1.art,Fresh.MidCan1.name,this.userData.roofconfiguration[2],Fresh.MidCan1.price,Fresh.MidCan1.price*this.userData.roofconfiguration[2]])
        if(this.userData.roofconfiguration[3]) arr.push([Fresh.MidCan2.art,Fresh.MidCan2.name,this.userData.roofconfiguration[3],Fresh.MidCan2.price,Fresh.MidCan2.price*this.userData.roofconfiguration[3]])
        if(this.userData.roofconfiguration[4]) arr.push([Fresh.MidCan3.art,Fresh.MidCan3.name,this.userData.roofconfiguration[4],Fresh.MidCan3.price,Fresh.MidCan3.price*this.userData.roofconfiguration[4]])

        if(this.userData.roofconfiguration[5]) arr.push([Fresh.Can2.art,Fresh.Can2.name,this.userData.roofconfiguration[5],Fresh.Can2.price,Fresh.Can2.price*this.userData.roofconfiguration[5]])
        if(this.userData.roofconfiguration[6]) arr.push([Fresh.Can3.art,Fresh.Can3.name,this.userData.roofconfiguration[6],Fresh.Can3.price,Fresh.Can3.price*this.userData.roofconfiguration[6]])

        if(this.userData.roofconfiguration[7]) arr.push([Fresh.Can2R.art,Fresh.Can2R.name,this.userData.roofconfiguration[7],Fresh.Can2R.price,Fresh.Can2R.price*this.userData.roofconfiguration[7]])
        if(this.userData.roofconfiguration[8]) arr.push([Fresh.Can3R.art,Fresh.Can3R.name,this.userData.roofconfiguration[8],Fresh.Can3R.price,Fresh.Can3R.price*this.userData.roofconfiguration[8]])

        if(this.userData.roofconfiguration[9]) arr.push([Fresh.LeftCan3R.art,Fresh.LeftCan3R.name,this.userData.roofconfiguration[9],Fresh.LeftCan3R.price,Fresh.LeftCan3R.price*this.userData.roofconfiguration[9]])
        if(this.userData.roofconfiguration[10]) arr.push([Fresh.MidCan3R.art,Fresh.MidCan3R.name,this.userData.roofconfiguration[10],Fresh.MidCan3R.price,Fresh.MidCan3R.price*this.userData.roofconfiguration[10]])
        if(this.userData.roofconfiguration[11]) arr.push([Fresh.RightCan3R.art,Fresh.RightCan3R.name,this.userData.roofconfiguration[11],Fresh.RightCan3R.price,Fresh.RightCan3R.price*this.userData.roofconfiguration[11]])

        arr.push([Fresh.EndwallL.art,Fresh.EndwallL.name,1,Fresh.EndwallL.price,Fresh.EndwallL.price]);
        arr.push([Fresh.EndwallR.art,Fresh.EndwallR.name,1,Fresh.EndwallR.price,Fresh.EndwallR.price]);

        arr.push([Fresh.SAAS.art,Fresh.SAAS.name,1,Fresh.SAAS.price,Fresh.SAAS.price]);
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

    for(var i = 0; i<configObject.userData.configuration.length; i++) {
        var sprite = new PIXI.Sprite.from("sprites/configurator/LOKOFRESH/PixiPreview/"+configObject.userData.configuration[i].value+".svg");
        const text = new PIXI.Text(ConfigurableList.LOKOFRESH.Elements[configObject.userData.configuration[i].value].name2D.replaceAll('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
        text.anchor.set(0.5);
        sprite.addChild(text);
        renderedsprite.addChild(sprite);
        sprite.anchor.set(0.5);
        sprite.x+=(0.699*32+dist*64);
        dist += 0.699;
    }

    if(configObject.userData.kazyrek) {
        if(configObject.userData.configuration.length==2) {
            var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOFRESH/PixiPreview/Roof.svg");
            kaz2d.y-=30;
            renderedsprite.addChild(kaz2d);
            var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOFRESH/PixiPreview/Roof.svg");
            kaz2d.x+=0.699*64;
            kaz2d.y-=30;
            renderedsprite.addChild(kaz2d);
        }
        else {
            for(var i = 0; i<configObject.userData.configuration.length; i++) {
                if(ConfigurableList.LOKOFRESH.ElementsBorders.terminal.includes(configObject.userData.configuration[i].value)) {pc_idx = i; break;}
            }
            if(pc_idx!=0 && pc_idx!=(configObject.userData.configuration.length-1))
            {
                var locdist = 0;
                var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOFRESH/PixiPreview/Roof.svg");
                kaz2d.x+= (pc_idx-1)*0.699*64 + locdist*64;
                kaz2d.y-=30;
                renderedsprite.addChild(kaz2d);
                locdist+=0.699;

                var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOFRESH/PixiPreview/Roof.svg");
                kaz2d.x+=(pc_idx-1)*0.699*64 + locdist*64;
                kaz2d.y-=30;
                renderedsprite.addChild(kaz2d);
                locdist+=0.699;

                var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOFRESH/PixiPreview/Roof.svg");
                kaz2d.x+=(pc_idx-1)*0.699*64 + locdist*64;
                kaz2d.y-=30;
                renderedsprite.addChild(kaz2d);
                locdist+=0.699;

            }
        }
    }
    renderedsprite.breadth = dist;

    renderedsprite.children.forEach(item=>item.position.x-=dist*32);

    renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -22;
    renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -22;
    renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 22;
    renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 22;

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
    $("#depthST").text("Depth: " + " 0.7 m");
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


    async function asyncLoadFresh(item,_shopitems3d,preloadedMeshes) {
        var meshesObject = {};
        if(preloadedMeshes) {
            meshesObject = preloadedMeshes;
        }
        else {
            const gltfData = await modelLoader('../../sprites/configurator/LOKOFRESH/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
        
        var _group = new THREE.Group();
        _shopitems3d.add(_group);
    
        var dist=0;
        var seq = item.userData.configuration;
        var colors = item.userData.colors;
        var pc_idx;
        if(item.userData.kazyrek) {
            if(seq.length == 2) {
                var kaz1 = meshesObject['Roof'].clone();
                kaz1.translateX(0.699/2);
                _group.add(kaz1);
                var kaz2 = meshesObject['Roof'].clone();
                kaz2.translateX(0.699+0.699/2);
                _group.add(kaz2);
            }
            else {
                for(var i = 0; i<seq.length; i++) {
                    if(ConfigurableList.LOKOFRESH.ElementsBorders.terminal.includes(seq[i].value)) {pc_idx = i; break;}
                }
                if(pc_idx!=0 && pc_idx!=(seq.length-1)) {
                    var locdist = 0.699*(pc_idx-1);
                    var kaz1 = meshesObject['Roof'].clone();
                    kaz1.translateX(locdist+0.699/2);
                    locdist+=0.699;
                    _group.add(kaz1);
                    var kaz2 = meshesObject['Roof'].clone();
                    kaz2.translateX(locdist+0.699/2);
                    locdist+=0.699;
                    _group.add(kaz2);
                    var kaz3 = meshesObject['Roof'].clone();
                    kaz3.translateX(locdist+0.699/2);
                    _group.add(kaz3);
                }
            }
        }
        _group.add(meshesObject['Endwall'].clone());
        for(var i = 0; i<seq.length; i++)
        {
            var mesh = meshesObject[seq[i].value].clone();
            _group.add(mesh);
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

LokoFresh.prototype = Object.create( EventDispatcher.prototype );
LokoFresh.prototype.constructor = LokoFresh;

export {LokoFresh}

var selectedItem = null;