import {ConfigurableList} from './ConfigurableList.js';
const list = ConfigurableList;


export const MainWindow = `
<div id="confarea">
		<div class="conf_background"></div>
		<div id="loadscreen2" class="loader2">
            <div>
                <div style="display: flex;">
                    <span class="span">L</span>
                    <span class="span" style="--delay: 0.1s">O</span>
                    <span class="span" style="--delay: 0.3s">A</span>
                    <span class="span" style="--delay: 0.4s">D</span>
                    <span class="span" style="--delay: 0.5s">I</span>
                    <span class="span" style="--delay: 0.6s">N</span>
                    <span class="span" style="--delay: 0.7s">G</span>
                </div>
                <div id="loadingPR" style="text-align: right; margin-top:20px; font-size: 15px;" class="oxygen">
                    In progress
                </div>
            </div>
		</div>
       

		<div class="configurator">
			<button class="closeconf"><img class="wall-icon" src="./Media/SVG/Cross.svg"></button>
			<input id="spawnconfigurated" type="button" class="create_button" value="Create" disabled>
            <div id="confmenu" class="confmenu">
            <div id="option" class="shelfconf">
            </div>
            </div>
            <div class="paramtr_conf" id="PostBoxconf" >
            </div>
            <div style="width:100%; height: 60px; backgrond-color: transparent; z-index:1;">
            </div>	
		</div>
       
	</div>
    
`;

export function ItemCatalog(name,originId,items){
    let readyDiv=``;
    items.forEach(e=> readyDiv+=`<div id="${originId+"_"+e}" class="box stronger obj-item">${list[name].Elements[e].itname}</div>`)
    return readyDiv;
}

export function ItemCatalogPostBox(name,originId,items){
    let readyDiv=``;
    items.forEach(e=> readyDiv+=`<div id="${originId+"_"+e}" class="box stronger obj-item">${list[name].Elements[e].itname} ${list[name].Elements[e].cellemount}</div>`)
    return readyDiv;
}

export function ItemCatalogAcces(name,originId,items){
    let readyDiv=``;
    items.forEach(e=> readyDiv+=`<div id="${originId+"_"+e}" class="box stronger obj-item">${list[name].Elements[e].cellemount}</div>`)
    return readyDiv;
}

export const colorSelect = `
<div class="dropdown-shelf">
Color <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
<div class="dropdown-content-shelf-color direction-colomn">
<label class="colorRow">
    <input class="radio" type="radio" name="test" value="236 236 231">
    <img src="../Media/SVG/C1.svg" class="dots"> Paper white
</label>
<label class="colorRow">
    <input class="radio" type="radio" name="test" value="183 179 168">
    <img src="../Media/SVG/C2.svg" class="dots"> Organic grey
</label>
<label class="colorRow">
    <input class="radio" type="radio" name="test" value="127 134 138" checked>
    <img src="../Media/SVG/C3.svg" class="dots"> Meteorite
</label>
<label class="colorRow">
    <input class="radio" type="radio" name="test" value="151 147 146">
    <img src="../Media/SVG/C4.svg" class="dots"> Greyhound
</label>
<label class="colorRow">
    <input class="radio" type="radio" name="test" value="48 61 58">
    <img src="../Media/SVG/C5.svg" class="dots"> Grünewald
green
</label>
<label class="colorRow">
    <input class="radio" type="radio" name="test" value="14 14 16">
    <img src="../Media/SVG/C6.svg" class="dots"> Ultima black
</label>
</div>
</div>
`;


export const RMBmenu =`

<div id="menu" class="objct_settings" style="position: absolute; top: 534px; left: 406px;">
<div style="width: 242px; align-items: center; display: flex; justify-content: end;">
    <button class="button_float" id="copyObject"><img class="wall-icon" src="./Media/SVG/Copy.svg">
    </button>
    <button id="ORremove" class="button_float" id="remove"><img class="wall-icon" src="./Media/SVG/Bin.svg">
    </button>
    <button id="ORclose" class="button_float"><img class="wall-icon" src="./Media/SVG/Cross.svg">
    </button>
</div>
<div style="width: 100%; height: 50px; display: flex; justify-content: center;   background-color: #ededed; align-items: center;  border: 1px solid  black;">
    <input id="ORrotate" class="rotation custom-range" type="range" min="0" max="360" step="1" value="0" style="width:80%; top:66%;">
</div>
<div style="width: 100%; height:50px; display: flex; justify-content: center;   background-color: #ededed;  border: 1px solid  black;">
    <div class="color_select" style="top:66%">
    <label >
        <input class="radio" type="radio" name="test" value="236 236 231">
        <img src="../Media/SVG/C1.svg" class="dots">
    </label>
    <label>
        <input class="radio" type="radio" name="test" value="183 179 168">
        <img src="../Media/SVG/C2.svg" class="dots">
    </label>
    <label>
        <input class="radio" type="radio" name="test" value="127 134 138" checked>
        <img src="../Media/SVG/C3.svg" class="dots">
    </label>
    <label>
        <input class="radio" type="radio" name="test" value="151 147 146">
        <img src="../Media/SVG/C4.svg" class="dots">
    </label>
    <label>
        <input class="radio" type="radio" name="test" value="48 61 58">
        <img src="../Media/SVG/C5.svg" class="dots">
    </label>
    <label>
        <input class="radio" type="radio" name="test" value="14 14 16">
        <img src="../Media/SVG/C6.svg" class="dots">
    </label>
</div>
</div></div>

`

export const addStackButtons =`		
    <div class="postbox_control add-left oxygen">
        <img class="add-icon" src="./Media/SVG/Add-icon.svg">
        Add column
        <br>
        Left
        <br>
        &#8203
    </div>
    <div class="postbox_control add-right oxygen">
        <img class="add-icon" src="./Media/SVG/Add-icon.svg">
        Add column
        <br>
        Right
        <br>
        &#8203
    </div>      
`;

export const addStackButtonsShelf =`		
    <div class="postbox_control add-left oxygen">
        <img class="add-icon" src="./Media/SVG/Add-icon.svg">
        Add shelf
        <br>
        Left
        <br>
        &#8203
    </div>
    <div class="postbox_control add-right oxygen">
        <img class="add-icon" src="./Media/SVG/Add-icon.svg">
        Add shelf
        <br>
        Right
        <br>
        &#8203
    </div>      
`;



export const isRoof =`
<div class="dropdown-shelf" id="access03" style="display: none;">
Roof 
<input type="checkbox" class="custom-checkbox" id="access3"> 
<label for="access3"></label>
</div>
`;



export const depthSelector =`
<div class="dropdown-shelf">
Depth <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
<div class="dropdown-content-shelf direction-colomn">
<label class="shelf-height">
    <input class="radio-height" type="radio" name="dept" value="700" id="option-1" checked>
    <span>700mm</span>
</label>
<label class="shelf-height">
    <input class="radio-height" type="radio" name="dept" value="500" id="option-2">
    <span>500mm</span>
</label>




</div>
</div>
`;

export const feedback =`
<div id="fid" class="feedback-cover login-box">
    <div class="send-noodles contact-form" style="margin-top: -400px; transition: 0.3s;">
        <form id="contact-form">
            <div class="row ">
                <div class="column">
                    <input type="file" id="variable_8b27hp4" name="user_file" value="this_one" style="display: none;">
                    <div class="user-box">
                        <input type="text" name="user_name" id="S1" required="">
                        <label for="S1">Name</label>
                        </div>
                    <div class="user-box">
                    <input type="text" name="user_phone" id="S2"  required="">
                    <label for="S2">Phone</label>
                    </div>
                </div>
                <div class="column">
                    <div class="user-box">
                        <input type="text" name="user_company"  id="S3" required="">
                        <label for="S3">Company</label>
                        </div>
                        <div class="user-box">
                        <input type="text" name="user_email" id="S4"  required="">
                        <label for="S4">E-mail</label>
                        </div>
                </div>
                </div>
                <div class="user-box">
                <textarea type="text" name="message"   required=""></textarea>
                <label>Comment</label>
                </div>
            <div class="align-center">  
            <input type="button" class="send_button" id="plsw" value="Send request">
            </div>	
        </form>
    </div>
</div>
`

export const RBMmenuConf =`
<div id="menu" class="objct_settings" style="position: absolute; top: 526px; left: 914px;">
    <div style="width: 222px; align-items: center; display: flex; justify-content: space-between;">
        <button class="button_float" id="copyObject">
            <img class="wall-icon" src="./Media/SVG/Copy.svg">
        </button>
        <button id="ORremove" class="button_float" >
            <img class="wall-icon" src="./Media/SVG/Bin.svg">
        </button>
        <button id="ORconf" class="button_float" >
            <img class="wall-icon" src="./Media/SVG/Sitns.svg">
        </button>
        <button id="ORclose" class="button_float">
            <img class="wall-icon" src="./Media/SVG/Cross.svg">
        </button>
    </div>
    <div style="width: 100%; height: 60px; align-items: flex-start; display: flex; justify-content: center; align-items: center;  background-color: #EDEDED;  border: 0.5px solid  black;">
        <input  id="ORrotate" class="rotation custom-range" style="width:80%; top:66%;" type="range" min="0" max="360" step="1" value="0">
    </div>
    <div class="oxygen" style="width: 100%; text-align: center; height: 40px; align-items: center; display: flex; justify-content: space-around;   background-color: #EDEDED;  border: 0.5px solid  black;">
        <div id="depthST" class="size-param">
        </div>
        <div id="lengthST" class="size-param">
        </div>
        <div id="squareST" class="size-param">
        </div>
    </div>
</div>
`


export const shelfconf = `
    <div class="shelfconf">

    <div class="dropdown-shelf">
        Color <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
        <div class="dropdown-content-shelf-color direction-colomn">
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="236 236 231">
            <img src="../Media/SVG/C1.svg" class="dots"> Paper white
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="183 179 168">
            <img src="../Media/SVG/C2.svg" class="dots"> Organic grey
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="127 134 138" checked>
            <img src="../Media/SVG/C3.svg" class="dots"> Meteorite
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="151 147 146">
            <img src="../Media/SVG/C4.svg" class="dots"> Greyhound
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="48 61 58">
            <img src="../Media/SVG/C5.svg" class="dots"> Grünewald
green
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="14 1xyz_input4 16">
            <img src="../Media/SVG/C6.svg" class="dots"> Ultima black
        </label>
        </div>
    </div>

    <div class="dropdown-shelf">
        Height <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
        <div class="dropdown-content-shelf direction-colomn">
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="height" value="1320" checked>
                <span>1320mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="height" value="1473">
                <span>1473mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="height" value="1778">
                <span>1778mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="height" value="2082">
                <span>2082mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="height" value="2235">
                <span>2235mm</span>
            </label>
        </div>
    </div>
    
    <div class="dropdown-shelf">
        Shefs depth <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
        <div class="dropdown-content-shelf direction-colomn">
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="depth" value="200" checked>
                <span>200mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="depth" value="300">
                <span>300mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="depth" value="400">
                <span>400mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="depth" value="500">
                <span>500mm</span>
            </label>
            <label class="shelf-height">
                <input class="radio-height" type="radio" name="depth" value="600">
                <span>600mm</span>
            </label>
        </div>
    </div>
    <div class="dropdown-shelf">
        <div class="box stronger" id="access03">   \
        Extended <br> bottom 
        <input type="checkbox" class="custom-checkbox" id="bottom_ext"> 
        <label for="bottom_ext"></label>
    </div>

    
</div>
        
</div>
`;

export function FridgesConfiguration(StackControl){
    return `<div class="dropdown-main-btn">
    <img class="bar-icon par_sit" src="Media/SVG/SetParametr.svg">

        <div class="dropdown-content-main-btn direction-colomn" style="border-bottom:0px solid black">
        <div  id="changeMenuDoors${StackControl}"></div>    
            

            <div class="dropdown-amount" id="shelfAmound${StackControl}">
                Shelves <br> amount  <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                <div class="dropdown-content-amount direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amountshelf${StackControl}" value="4" checked>
                        <span>4</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amountshelf${StackControl}" value="5">
                        <span>5</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amountshelf${StackControl}" value="6">
                        <span>6</span>
                    </label>
                </div>
            </div>
            
            <div class="dropdown-width" id="shelfWight${StackControl}">
                Width <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                <div class="dropdown-content-width direction-colomn" id="changeMenuW${StackControl}">
                </div>
            </div>
        </div>
</div>`
}




export function fridgeWidthSet(freeze,StackControl){
    const setInW= document.getElementById("changeMenuW"+StackControl);
    const setInDoors= document.getElementById("changeMenuDoors"+StackControl);
    if (freeze){
        setInW.innerHTML = `
        <label class="shelf-height">
            <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="797" checked>
            <span>797mm</span>
        </label>
        <label class="shelf-height">
            <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1562">
            <span>1562mm</span>
        </label>
    `
        
    setInDoors.innerHTML =`
    <div class="box stronger dropdown-inner" style="display:none;" id="shelfGrid${StackControl}">
            Door  
            <input type="checkbox" class="custom-checkbox bottomCt" name="isDoor${StackControl}" id="border${StackControl}" checked> 
            <label for="border${StackControl}"></label>
            <div class="dropdown-content-inner direction-colomn">
                <label class="shelf-height">
                    <input class="radio-height bottomCt" type="radio" name="typeDoor${StackControl}" value="Rooling" checked>	
                    <span>Sliding<br> doors</span>
                </label>
            </div>
    </div>
`
    }
    else{
        setInW.innerHTML = `
    <label class="shelf-height">
        <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="937" checked>
        <span>937mm</span>
    </label>
    <label class="shelf-height">
        <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1250">
        <span>1250mm</span>
    </label>
    <label class="shelf-height">
        <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1562">
        <span>1562mm</span>
    </label>
    <label class="shelf-height">
        <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1875">
        <span>1875mm</span>
    </label>
    <label class="shelf-height">
        <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="2500">
        <span>2500mm</span>
    </label>
`
        setInDoors.innerHTML =`
        <div class="box stronger dropdown-inner" id="shelfGrid${StackControl}"> 
                Door 
                <input type="checkbox" class="custom-checkbox bottomCt" name="isDoor${StackControl}" id="border${StackControl}"> 
                <label for="border${StackControl}"></label>
                <div class="dropdown-content-inner direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="typeDoor${StackControl}" value="Rooling" checked>	
                        <span>Sliding<br> doors </span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt " type="radio" name="typeDoor${StackControl}" value="FrontOpen">
                        <span>Hinged<br>doors</span>
                    </label>
                </div>
        </div>
    `
    }
}


export function CopyButton(StackControl){
    return `<button id="Copy${StackControl}" class="copy-menu deactive-copy"> <img  class="bar-iconC" src="./Media/SVG/Copy.svg"> </button>`
}

export function ShelfsConfiguration(StackControl){
    return `<div class="dropdown-main-btn">
    <img class="bar-icon par_sit" src="Media/SVG/SetParametr.svg">

            <div class="dropdown-content-main-btn direction-colomn" style="border-bottom:0px solid black">
                <div class="box stronger dropdown-inner" id="shelfBorders${StackControl}">  
                Inner <br> Borders
                <input type="checkbox" class="custom-checkbox bottomCt" name="Innerborders${StackControl}" id="inner${StackControl}"> 
                <label for="inner${StackControl}"></label>
                <div class="dropdown-content-inner direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="borderamount${StackControl}" value="2" checked>
                        <span>2</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="borderamount${StackControl}" value="3">
                        <span>3</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="borderamount${StackControl}" value="4">
                        <span>4</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="borderamount${StackControl}" value="5">
                        <span>5</span>
                    </label>
                </div>
            </div>
            <div class="box stronger dropdown-inner" id="hooks${StackControl}">  
                Hooks <br> amount <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                <div class="dropdown-content-inner direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="Hookamount${StackControl}" value="4" checked>
                        <span>4</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="Hookamount${StackControl}" value="5">
                        <span>5</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="Hookamount${StackControl}" value="6">
                        <span>6</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="Hookamount${StackControl}" value="7">
                        <span>7</span>
                    </label>
                </div>
            </div>

            <div class="box stronger dropdown-borders" id="shelfGrid${StackControl}"> 
            Shelves <br> Borders 
                <input type="checkbox" class="custom-checkbox bottomCt" name="Mainborders${StackControl}" id="border${StackControl}"> 
                <label for="border${StackControl}"></label>
                <div class="dropdown-content-borders direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="gridtype${StackControl}" value="plastick" checked>	
                        <span>Plastick</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt " type="radio" name="gridtype${StackControl}" value="grid">
                        <span>Grid</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="heightgrid${StackControl}" value="30" checked>
                        <span>30mm</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="heightgrid${StackControl}" value="60">
                        <span>60mm</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="heightgrid${StackControl}" value="90">
                        <span>90mm</span>
                    </label>
                </div>
            </div>

            <div class="dropdown-amount" id="shelfAmound${StackControl}">
                Shelves <br> amount <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                <div class="dropdown-content-amount direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amount${StackControl}" value="4" checked>
                        <span>4</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amount${StackControl}" value="5">
                        <span>5</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amount${StackControl}" value="6">
                        <span>6</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amount${StackControl}" value="7">
                        <span>7</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height bottomCt" type="radio" name="amount${StackControl}" value="8">
                        <span>8</span>
                    </label>
                </div>
            </div>
            
            <div class="dropdown-width" id="shelfWight${StackControl}">
                Width <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                    <div class="dropdown-content-width direction-colomn">
                        <label class="shelf-height">
                            <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="665" checked>
                            <span>665mm</span>
                        </label>
                        <label class="shelf-height">
                            <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1000">
                            <span>1000mm</span>
                        </label>
                        <label class="shelf-height">
                            <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1250">
                            <span>1250mm</span>
                        </label>
                        <label class="shelf-height">
                            <input class="radio-height bottomCt" type="radio" name="width${StackControl}" value="1330">
                            <span>1330mm</span>
                        </label>
                    </div>
            </div>
        </div>
</div>`
}


export const fridgeconf = `
    <div class="fridgeconf">
    <div class="dropdown-shelf">
        Color <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
        <div class="dropdown-content-shelf-color direction-colomn">
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="236 236 231">
            <img src="../Media/SVG/C1.svg" class="dots"> Paper white
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="183 179 168">
            <img src="../Media/SVG/C2.svg" class="dots"> Organic grey
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="127 134 138" checked>
            <img src="../Media/SVG/C3.svg" class="dots"> Meteorite
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="151 147 146">
            <img src="../Media/SVG/C4.svg" class="dots"> Greyhound
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="48 61 58">
            <img src="../Media/SVG/C5.svg" class="dots"> Grünewald
green
        </label>
        <label class="colorRow">
            <input class="radio" type="radio" name="color" value="14 14 16">
            <img src="../Media/SVG/C6.svg" class="dots"> Ultima black
        </label>
        </div>
    </div>
    <div class="dropdown-shelf">
        Face border <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
        <div class="dropdown-content-shelf direction-colomn">
        <div class="box stronger dropdown-inner" style="border-bottom: 1px solid black;">  
            Left side <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                <div class="dropdown-content-inner direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height" type="radio" name="borderL" value="LeftGlass" checked>
                        <span>Glass</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height" type="radio" name="borderL" value="LeftMirror">
                        <span>Mirror</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height" type="radio" name="borderL" value="LeftSolid">
                        <span>Solid</span>
                    </label> 
                </div>
        </div>

        <div class="box stronger dropdown-width">  
            Right side <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
                <div class="dropdown-content-width direction-colomn">
                    <label class="shelf-height">
                        <input class="radio-height" type="radio" name="borderR" value="RightGlass" checked>
                        <span>Glass</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height" type="radio" name="borderR" value="RightMirror">
                        <span>Mirror</span>
                    </label>
                    <label class="shelf-height">
                        <input class="radio-height" type="radio" name="borderR" value="RightSolid">
                        <span>Solid</span>
                    </label> 
                </div>
        </div>

        </div>
    </div> 
    <div class="dropdown-shelf">
        Editional <br> borders  <img class="small-icon" src="Media/SVG/CloseM.svg" alt="">
        <div class="dropdown-content-shelf " style="dispaly:flex; height:40px; align-items: center; border: 1px solid black;">
        <img class="bar-icon par_sit" id="substactSP" style="width:20px; height:20px; margin: 0px 5px;" src="Media/SVG/Substract.svg">
        <div id="akrile" data-min="0" data-max="0" data-carrent="0" >0</div>
        <img class="bar-icon par_sit" id="addSP" style="width:20px; height:20px; margin: 0px 5px;" src="Media/SVG/Add.svg">
        </div>
    </div> 
    <div class="dropdown-shelf">
            <div class="box stronger" id="access03">  
                 External<br> cooling
                <input type="checkbox" class="custom-checkbox" id="bottom_ext"> 
                <label for="bottom_ext"></label>
            </div>   
        </div>  
    </div> 

</div>
        
</div>
`;


export const addStackButtonsFridge =`		
    <div class="postbox_control add-left oxygen">
        <img class="add-icon" src="./Media/SVG/Add-icon.svg">
        Add Fridge
        <br>
        Left
        <br>
        &#8203
    </div>
    <div class="postbox_control add-right oxygen">
        <img class="add-icon" src="./Media/SVG/Add-icon.svg">
        Add Fridge
        <br>
        Right
        <br>
        &#8203
    </div>      
`;


export const catalogMenu =`
<div class="button_cls" style="justify-content: flex-end;">
<button class="close-main-menu" id="close-nav"> <img src="Media/SVG/Cross.svg" class="wall-icon"> </button>
</div>
            <div id="catalog" style="margin: 0px 25px;">
				<ul id="listnav" style="list-style-type:none; margin: 0px; margin-bottom: 100px; padding: 0px;"></ul>
			</div>
`


export const wallMenu =`
<div class="button_cls">
<div class="two-on-sides">
<button class="close-main-menu rullerCF" id="radio-ruler"> <img src="Media/SVG/Rulet.svg" class="wall-icon"> </button>
<button class="close-main-menu snapCF" id="radio-ruler"> <img src="Media/SVG/Align.svg" class="wall-icon"> </button>
</div>
<button class="close-main-menu" id="close-nav"> <img src="Media/SVG/Cross.svg" class="wall-icon"> </button>
</div>
<div id="wall" style="margin: 0px 25px;">
<ul id="listnav" style="list-style-type:none; margin: 0px; margin-bottom: 100px; padding: 0px;">
			<li>
				
				
                    <div class="main_groupe">
                        BackGround
                        <input type="file" id="blueprint" value="A" class="inputfile">
                        <label for="blueprint" class="Background_button" style="display: flex; width:188px;"><img src="Media/SVG/SetBG.svg" class="wall-icon"> Select an image</label>
                        <input type="button" id="editbp" value="Set scale" class="inputfile">
                        <label for="editbp" class="Background_button" id="editbplabel" style="display: none; width:188px;"><img src="Media/SVG/SetScale.svg" class="wall-icon">&#8203Set scale</label>
                        </div>
                    
	            
               
			</li>	
            <li>
            <div class="main_groupe">
				Structure <br>Builder
				<br>
                
                    <div style="font-size:13px; margin-top: 15px; font-family: Oxygen;">Structure Transparency</div>
                    <input id="structureTransparency" style="width: 189px;" type="range" min="1" max="10" step="1" value="10">
                
                <div class="wall-container">
                <button class="wall_button wallCF" id="radio-wall" value="1"><img src="Media/SVG/TheWall.svg" class="wall-icon"></button>
                <button class="wall_button wallCF" id="radio-floor" value="4"><img src="Media/SVG/Floor.svg" class="wall-icon"></button>
                <button class="wall_button wallCF" id="radio-columnS" value="2"><img src="Media/SVG/Cround.svg" class="wall-icon"></button>
                <button class="wall_button wallCF" id="radio-columnR" value="3"><img src="Media/SVG/Crect.svg" class="wall-icon"></button>
                </div>

                <div id="WallControlsDisplay" class="hide">
                    <div class="wall-param">Set walls <br> height to:
                        <input id="WallsHeight" class="numder-input" style="margin-left:2em" type="number" value="3.5">
                    </div>
                    <div class="wall-param">Next wall <br> height is:
                        <input id="NextWallHeight" class="numder-input" style="margin-left:2em" type="number" value="3.5">
                    </div>
                </div>
	            
            </div>   
			</li>
            <li>
            <div class="main_groupe">
				Door & Window
				
                <div class="wall-container">
                <button class="door_button doorCF" id="radio-door" value="1"><img src="Media/SVG/TheDoor.svg" class="wall-icon"></button>
                <button class="door_button doorCF" id="radio-window" value="2"><img src="Media/SVG/TheWindow.svg" class="wall-icon"></button>
                <div style="width: 40px;"></div>
                <div style="width: 40px;"></div>
                </div>
	            
            </div> 
			</li>		
		</ul>             
</div>
`
