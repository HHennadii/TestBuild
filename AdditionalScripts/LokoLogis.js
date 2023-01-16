import * as THREE from '../jsm/three.module.js';
import {EventDispatcher} from '../jsm/three.module.js';
import { Functions, ConfiguratorView, modelLoader } from './FunctionsForConf.js';
import {Postbox_parts,D700,Fresh} from './DataSet.js';
import {MainWindow, colorSelect, addStackButtons, isRoof, depthSelector, RBMmenuConf, CopyButton, ItemCatalogPostBox} from './ConfiguratorInterfaceModuls.js';
import {ConfigurableList,Category} from '../AdditionalScripts/ConfigurableList.js';
import {getColorCode, getPostCoef} from './Coefs.js';


const list = ConfigurableList.LOKOLOGIS.Elements;
const listBorders = ConfigurableList.LOKOLOGIS.ElementsBorders;
let arr_build=[],CopyThisConfigeration=[];

var LokoLogis = function(container2d, app) 
{
    const mainName = 'LOKOLOGIS';
    var configuratorView;

    var prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, StackControl= 0;
    let timer;

    function setUpInterface(){
        $("#setconfigurator").append(MainWindow);
        $("#option").append(colorSelect);
        $("#option").append(depthSelector);
        $("#option").append(isRoof);
        $("#PostBoxconf").append(addStackButtons);
        sceneElement= document.getElementById("confmenu");
        prrect = sceneElement.getBoundingClientRect();
        $(".wrapper, .radio, #access3").click(function() {
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
            arr_build = ClearArray ();
            $("#confarea").remove();
          });
        
        $(".closeconf").click(function(){ 
            StackControl=0;
            arr_build = ClearArray();
            $("#confarea").remove();
            configuratorView.hideConfigurator();
        });
    }



    function startConfigurator(){
        selectedItem = null;
        setUpInterface();
        clean_conf_stack(); 
        const item={
            value:'TerminalPro'
        }   
        add_Conf_stack("right",item);
        configuratorView = new ConfiguratorView(prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh,spriteFreshBox);
        configuratorView.showConfigurator(mainName);
    }


    function reloadConfigurator(item){
        clean_conf_stack();
        setUpInterface();
        let centerSwitch= true, center=-1;
        item.userData.configuration.forEach(item=>{
            if (centerSwitch) center++;
            if (listBorders.terminal.includes(item.value)) centerSwitch=false;
            add_Conf_stack("right",item,centerSwitch);
        })
        for(let i = center-1;i>0;i--){
            if(item.userData.configuration[i].value=="Fridge"){
                RowToFrige(arr_build[i].id); 
            }
        }

        

        
        //color set
        const colorSet = document.querySelectorAll('input[name="test"]');
        const selected_color=item.userData.colors.join(' ');
        colorSet.forEach(i=> {if(selected_color == i.value) 
                                       i.checked = true;
                            });
         
        //depth set                    
        const depthSet = document.querySelectorAll('input[name="depth"]');
        depthSet.forEach(i=> {if(item.userData.depth == i.value) 
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
            CopyThisConfigeration =[itemToCopy.value,true];
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
        ActiveNext(id);
        $("#Collecton"+id).remove();
        arr_build = RemoveFromArray(arr_build, id);
        IsRoof(arr_build);
        CreateButtonControl();
        configuratorView.configurateItem(arr_build);
    }


    function SwitchMode (item_id, value) {
        $("#alt"+item_id).children('.dropdown-content-objSelect-btn').html(ItemCatalogPostBox("LOKOLOGIS",item_id,listBorders[value]));
        $(".obj-item").click((e)=>SelectStack(e));
    }


    function IsPrevFridge(id)
    {
            const itemIndex = arr_build.findIndex(obj => obj.id ==id);
            if(!arr_build[itemIndex+1] && arr_build[itemIndex-1] && listBorders.fresh.includes(arr_build[itemIndex-1].value) && !listBorders.terminal.includes(arr_build[itemIndex].value)){
                SwitchMode(id,"fresh");		
                $("#Img"+id).attr("src", list.Fridge.imageName);
                $("#alt"+id).children('.name-tag').html(list.Fridge.itname + "<br />" + list.Fridge.cellemount);
               UpDateValueInArray(arr_build,id,"Fridge");
            }
            if(!arr_build[itemIndex-1] && arr_build[itemIndex+1] && listBorders.fresh.includes(arr_build[itemIndex+1].value) && !listBorders.terminal.includes(arr_build[itemIndex].value)){
                SwitchMode(id,"fresh");		
                $("#Img"+id).attr("src", list.Fridge.imageName);
                $("#alt"+id).children('.name-tag').html(list.Fridge.itname + "<br />" + list.Fridge.cellemount);
                UpDateValueInArray(arr_build,id,"Fridge");
             }   
    }
    

    function ActiveNext(searchFor)
    {
            const centerIndex = arr_build.findIndex((obj => listBorders.terminal.includes(obj.value)));
            const itemIndex = arr_build.findIndex(obj => obj.id ==searchFor);
            const limitB = itemIndex>centerIndex ? 1 : -1;
            if (arr_build[itemIndex+limitB]){
                SwitchMode(arr_build[itemIndex+limitB].id,"usual");	
            }
    }
    
    
    function RowToFrige(searchFor){
            const centerIndex = arr_build.findIndex((obj => listBorders.terminal.includes(obj.value)))
            const itemIndex = arr_build.findIndex(obj => obj.id ==searchFor)
            const limitB = itemIndex>centerIndex ? itemIndex+1 : 0;
            const limitT = itemIndex>centerIndex ? arr_build.length : itemIndex;
            for (let i=limitB; i<limitT; i++){
                if(!listBorders.fresh.includes(arr_build[i].value)){
                    arr_build[i].value="Fridge";
                    $("#Img"+arr_build[i].id).attr("src", list.Fridge.imageName);
                    $("#alt"+arr_build[i].id).children('.name-tag').html(list.Fridge.itname + "<br />" + list.Fridge.cellemount);
                }
                SwitchMode(arr_build[i].id,"fresh");
            }		
    }


    function IsRoof(arr){  
        let checkbox = document.getElementById("access03");
        const index= arr.findIndex((obj => listBorders.terminal.includes(obj.value)));
            if((arr_build.length==2 && !listBorders.fresh.includes(arr_build[0].value) && !listBorders.fresh.includes(arr_build[1].value)) || (arr_build[index+1] && arr_build[index-1] && !listBorders.fresh.includes(arr_build[index-1].value) && !listBorders.fresh.includes(arr_build[index+1].value))){
                checkbox.style.display="flex";
                return;
            }
        document.getElementById("access3").checked= false; 
        checkbox.style.display="none";
        
    }




    function add_Conf_stack (side="right", item, reconfiguration=false)
    {
        console.log(item)
        let itemToInsert="Type1";
        if (item.value)
            itemToInsert=item.value;
        StackControl=StackControl+1;       
        let buttonType, CloseButton = ``;

        if (!listBorders.terminal.includes(itemToInsert))
            CloseButton = `<button class="remove_post"> <img id="Close${StackControl}" class="bar-iconC" src="./Media/SVG/Cross.svg"> </button>${CopyButton(StackControl)}`;
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
        const selector=itemToInsert=="Type1"?"usual":"terminal";
        let added=`
            <img class="img_selector" id="Img${StackControl}" alt="${itemToInsert}" src="${list[itemToInsert].imageName}">
            <div id="alt${StackControl}" class="dropdown-objSelect-btn">
               <div class="name-tag"> ${list[itemToInsert].itname}<br>${list[itemToInsert].cellemount} </div>
                <div class="dropdown-content-objSelect-btn direction-colomn" style="border-bottom:0px solid black">
                ${ItemCatalogPostBox("LOKOLOGIS",StackControl,listBorders[selector])}
                </div>
            </div> 
            ${CloseButton}
        `
        div.innerHTML=added;
    
        if (!listBorders.terminal.includes(itemToInsert))
            document.getElementById("Close"+StackControl).addEventListener( 'click', (e)=>CloseF(e));
        if(!reconfiguration) IsPrevFridge(StackControl);
        IsRoof(arr_build);
        $("#Copy"+StackControl).click((e)=>{ CopyStack(e);})
        $(".obj-item").click((e)=>SelectStack(e));
    }



    function SelectStack(e){
        const id = e.target.id.split("_");
        $("#Img"+id[0]).attr("src", list[id[1]].imageName);
        $("#alt"+id[0]).children('.name-tag').html(list[id[1]].itname + "<br />" + list[id[1]].cellemount);
        if (listBorders.fresh.includes(id[1])) 
            RowToFrige(id[0]);	
        else 
            ActiveNext(id[0]);
        UpDateValueInArray(arr_build,...id);
        IsRoof(arr_build);
        ClearCopyBuffer();
        configuratorView.configurateItem(arr_build);
    }


var confreqv;
var renderedsprite = null;


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
        if(ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(arr[i].value)) count++;
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
        if(ConfigurableList.LOKOLOGIS.ElementsBorders.terminal.includes(arr[i].value)) pc_idx = i;
        if(!ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(arr[i].value)) count++;
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

function logisCannopies(cannopyarray) {
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


function fridgeCannopies(cannopyarray) {
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


function logisSideCannopies(cannopyarray) {
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



function logisCannopiesRoof(cannopyarray) {
    var pc_idx, roof_arr=[0,1,0];
    var leftPart,rightPart;
    for(var i = 0; i < cannopyarray.length; i++) {
        if(ConfigurableList.LOKOLOGIS.ElementsBorders.terminal.includes(cannopyarray[i])) {
            pc_idx = i;
            break;
        }
    }
    if(pc_idx!=0 && pc_idx!=(cannopyarray.length-1)) {
        leftPart = cannopyarray.length - (cannopyarray.length-pc_idx+1);
        rightPart = cannopyarray.length - (pc_idx+2);
        if (leftPart== 0) roof_arr=[1,0,0];
        if (rightPart== 0) roof_arr=[0,0,1];
        leftPart = fillOnes(leftPart);
        rightPart = fillOnes(rightPart);
        leftPart = logisSideCannopies(leftPart);
        rightPart = logisSideCannopies(rightPart);
        for(var i = 1; i < 3; i++) {
            rightPart[i] = rightPart[i]+leftPart[i]; 
        }
    }
    return [leftPart[0],...rightPart,0,0,0,0, ...roof_arr]; // [leftVolume, rightVolume, mid1Qnt, mid2Qnt, mid3Qnt, SelfSt2, SelfSt3,SelfSt2R, SelfSt3R, LeftRoof, MidlRoof, RightRoof]
}

function LogisConnection (arr,left,right,sizelokocheck,kazyrek){
// exitArr =[leftVolume 0, rightVolume 1, mid1Qnt 2, mid2Qnt 3, mid3Qnt 4, SelfSt2 5, SelfSt3 6, SelfSt2R 7, SelfSt3R 8, LeftRoof 9, MidlRoof 10, RightRoof11] logis
    let exitArr=arr;
    //console.log(sizelokocheck.length+" lengh")
    if (sizelokocheck.length<3){
        let offset=2;
        if(sizelokocheck.length==1) 
            offset=1
        if (left && !right){
            exitArr[1] =offset;
            exitArr[5] =0;
            }
        if (right && !left){
            exitArr[0] =offset;
            exitArr[5] =0;
            }
        if (left && right){
            exitArr[1+offset]=1;
            exitArr[5] =0;
            }
    } 
    if (sizelokocheck.length==3){
        if(left && right){
            if(kazyrek){
                exitArr[10] =1;
                exitArr[8] =0;
                }
            else{
                exitArr[4] =1;
                exitArr[6] =0;
            }
        }
        if(right && !left){
            if(kazyrek){
                exitArr[9] =1;
                exitArr[8] =0;
                }
            else{
                exitArr[0] =3;
                exitArr[6] =0;
                }
        }
        if(left && !right){
            if(kazyrek){
                exitArr[11] =1;
                exitArr[8] =0;
                }
            else{
                exitArr[1] =3;
                exitArr[6] =0;
            }
        }
    }
    // exitArr =[leftVolume 0, rightVolume 1, mid1Qnt 2, mid2Qnt 3, mid3Qnt 4, SelfSt2 5, SelfSt3 6, SelfSt2R 7, SelfSt3R 8, LeftRoof 9, MidlRoof 10, RightRoof11] logis
    if (sizelokocheck.length > 3){
        if(left && !right){
            if(arr[0]){
                exitArr[exitArr[0]+1]=exitArr[exitArr[0]+1]+1;
                exitArr[0]=0;
            }
            else{
                if(kazyrek){
                    exitArr[10]=1;
                    exitArr[9]=0;
                }
                else{
                    exitArr[4]=1;
                    exitArr[9]=0;
                }
            }
        }
        if(right && !left){
            if(arr[1]){
                exitArr[exitArr[1]+1]=exitArr[exitArr[1]+1]+1;
                exitArr[1]=0;
            }
            else{
                if(kazyrek){
                    exitArr[10]=1;
                    exitArr[11]=0;
                }
                else{
                    exitArr[4]=1;
                    exitArr[11]=0;
                }
            }
        }
        if(right && left){
            if(arr[0]){
                exitArr[exitArr[0]+1]=exitArr[exitArr[0]+1]+1;
                exitArr[0]=0;
            }
            else{
                if(kazyrek){
                    exitArr[10]=1;
                    exitArr[9]=0;
                }
                else{
                    exitArr[4]=1;
                    exitArr[9]=0;
                }
            }
            if(arr[1]){
                exitArr[exitArr[1]+1]=exitArr[exitArr[1]+1]+1;
                exitArr[1]=0;
            }
            else{
                if(kazyrek){
                    exitArr[10]=1;
                    exitArr[11]=0;
                }
                else{
                    exitArr[4]=1;
                    exitArr[11]=0;
                }
            }
        }
    }
    return exitArr;
}

function layoutRoof(arr, itemsArray,kazyrek) //countedblocks, seq, kazyrek
{
    var f1 = []; var f2 = [], logis=[0,0,0,0,0,0,0,0,0,0,0,0], fresh=[];
    if(arr[0]) f1 = fillOnes(arr[0]);
    else f1 = [0,0,0];
    if(arr[2]) f2 = fillOnes(arr[2]);
    else f2 = [0,0,0];
    f1 = fridgeCannopies(f1);
    f2 = fridgeCannopies(f2);
    // [leftVolume 0, rightVolume 1, mid1Qnt 2, mid2Qnt 3, mid3Qnt 4, SelfSt3 5, SelfSt2R 6, SelfSt3R 7, LeftRoof 8, MidlRoof 9, RightRoof10] logis
    // [leftVolume,  rightVolume, mid1Qnt, mid2Qnt, mid3Qnt] fredge
    itemsArray = itemsArray.slice(arr[0]);
    itemsArray = itemsArray.slice(0, itemsArray.length-arr[2]);
    if(itemsArray.length == 2) {
        if(kazyrek) {
            logis= [0,0,0,0,0,0,0,1,0,0,0,0];
        }
        else {
            logis= [0,0,0,0,0,1,0,0,0,0,0,0];
        }
    }

    if(itemsArray.length == 3) {
        if(kazyrek) {
            logis= [0,0,0,0,0,0,0,0,1,0,0,0];
        }
        else {
            logis= [0,0,0,0,0,0,1,0,0,0,0,0];
        }
    }
    if(itemsArray.length > 3) {
        if(kazyrek) {
            logis= logisCannopiesRoof(itemsArray);
        }
        else {
            logis= logisCannopies(fillOnes(itemsArray.length));
        }
    }
    
    logis= LogisConnection(logis,arr[0],arr[2], itemsArray,kazyrek);

    fresh = [...logis,f1[0],f2[0],f1[1]+f2[1],f1[2]+f2[2],f1[3]+f2[3]]// [leftVolume 0, rightVolume 1, mid1Qnt 2, mid2Qnt 3, mid3Qnt 4, SelfSt2 5, SelfSt3 6, SelfSt2R 7, SelfSt3R 8, LeftRoof 9, MidlRoof 10, RightRoof 11, leftVolume 12,  rightVolume 13, mid1Qnt 14, mid2Qnt 15, mid3Qnt 16]
    return fresh;
}


function spriteFreshBox(configObject) {
    const offset = configObject.userData.depth==700?'':'N';
    renderedsprite = new PIXI.Container();
    renderedsprite.x = configObject.x;     renderedsprite.y = configObject.y;     renderedsprite.rotation = configObject.rotation;
    renderedsprite.userData = {};
    renderedsprite.userData.name = "LOKOLOGIS";
    renderedsprite.userData.configuration = configObject.userData.configuration;
    renderedsprite.userData.colors = configObject.userData.colors;
    renderedsprite.userData.depth = configObject.userData.depth;
    renderedsprite.userData.kazyrek = configObject.userData.kazyrek;
    renderedsprite.userData.nameTag = "";

    renderedsprite.sayHi = function() {
        var arr = [];
        const name = this.userData.depth == 700?'LOKO LOGIS D700':'LOKO LOGIS D500';
        const logisprice = this.userData.depth == 500?Postbox_parts:D700;
        const color = getColorCode(this.userData.colors);
        arr.push([name+' '+color]);
        var itemSet = {};
        this.userData.configuration.forEach(function(a){
            itemSet[a.value] = itemSet[a.value] + 1 || 1;
        });
        for(var key in itemSet){
            arr.push([logisprice[key].art,logisprice[key].name,itemSet[key],logisprice[key].price,logisprice[key].price*itemSet[key]]);//postboxstack
        }

        if(this.userData.floorconfiguration[0][1]) arr.push([logisprice.Base2.art,logisprice.Base2.name, this.userData.floorconfiguration[0][1],logisprice.Base2.price,logisprice.Base2.price*this.userData.floorconfiguration[0][1]]);
        if(this.userData.floorconfiguration[0][2]) arr.push([logisprice.Base3.art,logisprice.Base3.name, this.userData.floorconfiguration[0][2],logisprice.Base3.price,logisprice.Base3.price*this.userData.floorconfiguration[0][2]]);

        if(this.userData.floorconfiguration[1][0])arr.push([Fresh.Base1.art,Fresh.Base1.name,this.userData.floorconfiguration[1][0],Fresh.Base1.price,Fresh.Base1.price*this.userData.floorconfiguration[1][0]]);
        if(this.userData.floorconfiguration[1][1])arr.push([Fresh.Base2.art,Fresh.Base2.name,this.userData.floorconfiguration[1][1],Fresh.Base2.price,Fresh.Base2.price*this.userData.floorconfiguration[1][1]])
        if(this.userData.floorconfiguration[1][2])arr.push([Fresh.Base3.art,Fresh.Base3.name,this.userData.floorconfiguration[1][2],Fresh.Base3.price,Fresh.Base3.price*this.userData.floorconfiguration[1][2]])

        if(this.userData.roofconfiguration[0] == 1) arr.push([logisprice.LeftCan1.art,logisprice.LeftCan1.name,1,logisprice.LeftCan1.price,logisprice.LeftCan1.price])
        if(this.userData.roofconfiguration[0] == 2) arr.push([logisprice.LeftCan2.art,logisprice.LeftCan2.name,1,logisprice.LeftCan2.price,logisprice.LeftCan2.price])
        if(this.userData.roofconfiguration[0] == 3) arr.push([logisprice.LeftCan3.art,logisprice.LeftCan3.name,1,logisprice.LeftCan3.price,logisprice.LeftCan3.price])

        if(this.userData.roofconfiguration[1] == 1) arr.push([logisprice.RightCan1.art,logisprice.RightCan1.name,1,logisprice.RightCan1.price,logisprice.RightCan1.price])
        if(this.userData.roofconfiguration[1] == 2) arr.push([logisprice.RightCan2.art,logisprice.RightCan2.name,1,logisprice.RightCan2.price,logisprice.RightCan2.price])
        if(this.userData.roofconfiguration[1] == 3) arr.push([logisprice.RightCan3.art,logisprice.RightCan3.name,1,logisprice.RightCan3.price,logisprice.RightCan3.price])
// [leftVolume, rightVolume, mid1Qnt, mid2Qnt, mid3Qnt, SelfSt2, SelfSt3,SelfSt2R, SelfSt3R, LeftRoof, MidlRoof, RightRoof, leftVolume,  rightVolume, mid1Qnt, mid2Qnt, mid3Qnt]
        if(this.userData.roofconfiguration[2]) arr.push([logisprice.MidCan1.art,logisprice.MidCan1.name,this.userData.roofconfiguration[2],logisprice.MidCan1.price,logisprice.MidCan1.price*this.userData.roofconfiguration[2]])
        if(this.userData.roofconfiguration[3]) arr.push([logisprice.MidCan2.art,logisprice.MidCan2.name,this.userData.roofconfiguration[3],logisprice.MidCan2.price,logisprice.MidCan2.price*this.userData.roofconfiguration[3]])
        if(this.userData.roofconfiguration[4]) arr.push([logisprice.MidCan3.art,logisprice.MidCan3.name,this.userData.roofconfiguration[4],logisprice.MidCan3.price,logisprice.MidCan3.price*this.userData.roofconfiguration[4]])

        if(this.userData.roofconfiguration[5]) arr.push([logisprice.Can2.art,logisprice.Can2.name,this.userData.roofconfiguration[5],logisprice.Can2.price,logisprice.Can2.price*this.userData.roofconfiguration[5]])
        if(this.userData.roofconfiguration[6]) arr.push([logisprice.Can3.art,logisprice.Can3.name,this.userData.roofconfiguration[6],logisprice.Can3.price,logisprice.Can3.price*this.userData.roofconfiguration[6]])

        if(this.userData.roofconfiguration[7]) arr.push([logisprice.Can2R.art,logisprice.Can2R.name,this.userData.roofconfiguration[7],logisprice.Can2R.price,logisprice.Can2R.price*this.userData.roofconfiguration[7]])
        if(this.userData.roofconfiguration[8]) arr.push([logisprice.Can3R.art,logisprice.Can3R.name,this.userData.roofconfiguration[8],logisprice.Can3R.price,logisprice.Can3R.price*this.userData.roofconfiguration[8]])

        if(this.userData.roofconfiguration[9]) arr.push([logisprice.LeftCan3R.art,logisprice.LeftCan3R.name,this.userData.roofconfiguration[9],logisprice.LeftCan3R.price,logisprice.LeftCan3R.price*this.userData.roofconfiguration[9]])
        if(this.userData.roofconfiguration[10]) arr.push([logisprice.MidCan3R.art,logisprice.MidCan3R.name,this.userData.roofconfiguration[10],logisprice.MidCan3R.price,logisprice.MidCan3R.price*this.userData.roofconfiguration[10]])
        if(this.userData.roofconfiguration[11]) arr.push([logisprice.RightCan3R.art,logisprice.RightCan3R.name,this.userData.roofconfiguration[11],logisprice.RightCan3R.price,logisprice.RightCan3R.price*this.userData.roofconfiguration[11]])

        if(this.userData.roofconfiguration[13]==1)arr.push([Fresh.RightCan1.art,Fresh.RightCan1.name,1,Fresh.RightCan1.price,Fresh.RightCan1.price])
        if(this.userData.roofconfiguration[13]==2)arr.push([Fresh.RightCan2.art,Fresh.RightCan2.name,1,Fresh.RightCan2.price,Fresh.RightCan2.price])
        if(this.userData.roofconfiguration[13]==3)arr.push([Fresh.RightCan3.art,Fresh.RightCan3.name,1,Fresh.RightCan3.price,Fresh.RightCan3.price])

        if(this.userData.roofconfiguration[12]==1)arr.push([Fresh.LeftCan1.art,Fresh.LeftCan1.name,1,Fresh.LeftCan1.price,Fresh.LeftCan1.price])
        if(this.userData.roofconfiguration[12]==2)arr.push([Fresh.LeftCan2.art,Fresh.LeftCan2.name,1,Fresh.LeftCan2.price,Fresh.LeftCan2.price])
        if(this.userData.roofconfiguration[12]==3)arr.push([Fresh.LeftCan3.art,Fresh.LeftCan3.name,1,Fresh.LeftCan3.price,Fresh.LeftCan3.price])

        if(this.userData.roofconfiguration[14])arr.push([Fresh.MidCan1.art,Fresh.MidCan1.name,this.userData.roofconfiguration[14],Fresh.MidCan1.price,Fresh.MidCan1.price*this.userData.roofconfiguration[14]])
        if(this.userData.roofconfiguration[15])arr.push([Fresh.MidCan2.art,Fresh.MidCan2.name,this.userData.roofconfiguration[15],Fresh.MidCan2.price,Fresh.MidCan2.price*this.userData.roofconfiguration[15]])
        if(this.userData.roofconfiguration[16])arr.push([Fresh.MidCan3.art,Fresh.MidCan3.name,this.userData.roofconfiguration[16],Fresh.MidCan3.price,Fresh.MidCan3.price*this.userData.roofconfiguration[16]])


        var cableConnector = false;
        if(name == 'LOKOLOGIS D500') {
            if(ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(this.userData.configuration[0].value)) {
                arr.push([Fresh.EndwallL.art,Fresh.EndwallL.name,1,Fresh.EndwallL.price,Fresh.EndwallL.price])
                arr.push([Fresh.LeftFreshRightD500.art,Fresh.LeftFreshRightD500.name,1,Fresh.LeftFreshRightD500.price,Fresh.LeftFreshRightD500.price])
                cableConnector = true;
            }
            else {
                arr.push([logisprice.EndwallL.art,logisprice.EndwallL.name,1,logisprice.EndwallL.price,logisprice.EndwallL.price])
            }

            if(ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(this.userData.configuration[this.configuration.length-1].value)) {
                cableConnector = true;
                arr.push([Fresh.EndwallR.art,Fresh.EndwallR.name,1,Fresh.EndwallR.price,Fresh.EndwallR.price])
                arr.push([Fresh.RightFreshLeftD500.art,Fresh.RightFreshLeftD500.name,1,Fresh.RightFreshLeftD500.price,Fresh.RightFreshLeftD500.price])
            }
            else {
                arr.push([logisprice.EndwallR.art,logisprice.EndwallR.name,1,logisprice.EndwallR.price,logisprice.EndwallR.price])
            }
        }
        else {
            arr.push([logisprice.EndwallL.art,logisprice.EndwallL.name,1,logisprice.EndwallL.price,logisprice.EndwallL.price])
            arr.push([logisprice.EndwallR.art,logisprice.EndwallR.name,1,logisprice.EndwallR.price,logisprice.EndwallR.price])

            if(ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(this.userData.configuration[0].value)) {
                arr.push([Fresh.LeftFreshRightD700.art,Fresh.LeftFreshRightD700.name,1,Fresh.LeftFreshRightD700.price,Fresh.LeftFreshRightD700.price])
                cableConnector = true;
            }
            if(ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(this.userData.configuration[this.userData.configuration.length-1].value)) {
                arr.push([Fresh.RightFreshLeftD700.art,Fresh.RightFreshLeftD700.name,1,Fresh.RightFreshLeftD700.price,Fresh.RightFreshLeftD700.price])
                cableConnector = true;
            }
        }
        if(cableConnector) arr.push([Fresh.PowerCable.art,Fresh.PowerCable.name,1,Fresh.PowerCable.price,Fresh.PowerCable.price]);

        arr.push([logisprice.SAAS.art,logisprice.SAAS.name,1,logisprice.SAAS.price,logisprice.SAAS.price]);



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

    var countedblocks = countBlocks(configObject.userData.configuration); // fridges qnt, items qnt, fridges qnt, pc index in config.

    renderedsprite.userData.floorconfiguration = layoutFloor(countedblocks);
    renderedsprite.userData.roofconfiguration = layoutRoof(countedblocks,configObject.userData.configuration,configObject.userData.kazyrek);
    var pc_idx;
    if(configObject.userData.kazyrek)
    {
        if(configObject.userData.configuration.length == 2)
        {
            var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOLOGIS/PixiPreview/Roof"+offset+".svg");
            offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
            renderedsprite.addChild(kaz2d);

            var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOLOGIS/PixiPreview/Roof"+offset+".svg");
            kaz2d.x+=0.485*64;
            offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
            renderedsprite.addChild(kaz2d);
        }
        else
        {
            for(var i = 0; i<configObject.userData.configuration.length; i++) {
                if(ConfigurableList.LOKOLOGIS.ElementsBorders.terminal.includes(configObject.userData.configuration[i].value)) {pc_idx = i; break; };
            }
            renderedsprite.userData.kazyrek = 3;
        }
    }

    for(var i = 0; i<configObject.userData.configuration.length; i++)
    {
        var sprite = new PIXI.Sprite.from("sprites/configurator/LOKOLOGIS/PixiPreview/"+configObject.userData.configuration[i].value+offset+".svg");
        const text = new PIXI.Text(ConfigurableList.LOKOLOGIS.Elements[configObject.userData.configuration[i].value].name2D.replaceAll('<br>','\n'),{fontFamily : 'Arial', fontSize: 10, fill : 0x000000, align : 'center'});
        text.anchor.set(0.5);
        sprite.addChild(text);
        if(offset=='N') {
            if(!ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(configObject.userData.configuration[i].value)) sprite.y+=7.5;
        }
        renderedsprite.addChild(sprite);

        if(configObject.userData.configuration.length>2 && configObject.userData.kazyrek)
        {
            if((pc_idx!=0 && pc_idx!=configObject.userData.configuration.length-1) && (i==pc_idx-1 || i==pc_idx || i==pc_idx+1))
            {
                var kaz2d = new PIXI.Sprite.from("sprites/configurator/LOKOLOGIS/PixiPreview/Roof"+offset+".svg");
                kaz2d.x+=dist*64;
                offset=='N'?kaz2d.y-=15:kaz2d.y-=30;
                renderedsprite.addChild(kaz2d);
            }
        }

        sprite.anchor.set(0.5);
        sprite.x+=(getPostCoef(configObject.userData.configuration[i].value)*32+dist*64);
        dist += getPostCoef(configObject.userData.configuration[i].value);
    }
    renderedsprite.breadth = dist;
    renderedsprite.children.forEach(item=>item.position.x-=dist*32);
    renderedsprite.children[0].x = -dist*32; renderedsprite.children[0].y = -22;
    renderedsprite.children[1].x = dist*32; renderedsprite.children[1].y = -22;
    renderedsprite.children[2].x = -dist*32; renderedsprite.children[2].y = 22;
    renderedsprite.children[3].x = dist*32; renderedsprite.children[3].y = 22;
    if(configObject.userData.depth==500 /* is not a fresh */) {
        renderedsprite.children[0].y = -7;
        renderedsprite.children[1].y = -7;
    }
    for(var i = 0; i<configObject.userData.configuration.length; i++) {
        if(listBorders.fresh.includes(configObject.userData.configuration[i].value)) {
            renderedsprite.children[0].y = -22;
            renderedsprite.children[1].y = -22;
        }
    }

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
    timer = null;
    if(app.userData.canTranslate)
    showContextMenu(event.data.global.x, event.data.global.y);
};



    async function asyncLoadFresh(item, _shopitems3d, preloadedMeshes) {
        console.log(item)
        var meshesObject = {};
        if(preloadedMeshes) {
            meshesObject = preloadedMeshes;
        }
        else {
            const gltfData = await modelLoader('../../sprites/configurator/LOKOLOGIS/CORN.glb');
            for(var i = 0; i< gltfData.scene.children.length; i++) {
                meshesObject[gltfData.scene.children[i].name] = gltfData.scene.children[i];
            }
        }
    
        var _group = new THREE.Group();
        _shopitems3d.add(_group);
        let depth = item.userData.depth;
        var dist=0;
        var seq = item.userData.configuration;
        var offset = '';
        if(depth == 500) offset = 'N';
        if(depth==500 && !ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(seq[0])) _group.add(meshesObject['EndwallN'].clone())
        else _group.add(meshesObject['Endwall'].clone());
        
        var pc_idx;
        if(item.userData.kazyrek)
        {
            if(seq.length == 2)
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
            else
            {
                for(var i = 0; i<seq.length; i++) {
                    if(seq[i].value=='TerminalPro' || seq[i].value=='TerminalST' || seq[i].value=='TerminalSTFR') {pc_idx = i; break; }
                }
            }
        }
    
        var colors = item.userData.colors;
        for(var i = 0; i<seq.length; i++)
        {
            var mesh = meshesObject[seq[i].value+offset].clone();
            _group.add(mesh);

            mesh.children[0].material.color.r = colors[0]/255;
            mesh.children[0].material.color.g = colors[1]/255;
            mesh.children[0].material.color.b = colors[2]/255;
            mesh.translateX(getPostCoef(seq[i].value)/2+dist);
            
            if(seq.length>2 && item.userData.kazyrek)
            {
                if((pc_idx!=0 && pc_idx!=seq.length-1) && (i==pc_idx-1 || i==pc_idx || i==pc_idx+1))
                {
                    var kaz = depth==700?meshesObject['Roof'].clone():meshesObject['RoofN'].clone();
                    kaz.translateX(0.485/2+dist);
                    _group.add(kaz);
                }
            }
            dist += getPostCoef(seq[i].value);
        }
        var lastwall;
        if(depth==500 && !ConfigurableList.LOKOLOGIS.ElementsBorders.fresh.includes(seq[seq.length-1])) lastwall=meshesObject['EndwallN'].clone();
        else lastwall=meshesObject['Endwall'].clone();
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

LokoLogis.prototype = Object.create( EventDispatcher.prototype );
LokoLogis.prototype.constructor = LokoLogis;

export {LokoLogis}

var selectedItem = null;