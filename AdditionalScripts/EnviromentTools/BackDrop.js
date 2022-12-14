var BackDrop = function(app, _domElement, applic)
{
    var startPosition = null;
    var endPosition = null;
    var selectedItem = null;
    var arr = [];
    var bdimage = null, mod=1, menuDiv, timer;
    var clickTimer = null;
    function onBlueprintChange(e) {
        if(bdimage) app.removeChild(bdimage);
        if(e.target.files[0]) {
            $('#editbplabel').css("display", "flex");    
            var userImage = e.target.files[0]; 
            var userImageURL = URL.createObjectURL( userImage );
            bdimage = PIXI.Sprite.from(userImageURL);
            bdimage.interactive = true;
            //bdimage.buttonMode = true;
            bdimage.anchor.set(0.5);
            app.addChild(bdimage);
            bdimage
                //.on('pointerdown', onDragStart)
                //.on('pointerup', onDragEnd)
                //.on('pointerupoutside', onDragEnd)
                //.on('pointermove', onDragMove)
                .on('rightclick',function(event){
                    showContextMenutool(event.data.global.x, event.data.global.y);
                })
                .on('touchstart',function(event) {
                    console.log(timer);
                    if (!timer) {
                        timer = setTimeout(function() {onlongtouch(event);}, 2000);
                    }      
                 })
                
                 .on('touchend',function() {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                 });
        }
        else
     
        $('#editbplabel').css("display", "none");
    }

     function onlongtouch(event) { 
        console.log(timer);
        timer = null;
        showContextMenutool(event.data.global.x, event.data.global.y);
    };
    

    function showContextMenutool(x,y)
	{
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		var indiv = document.createElement("div");
		var indiv2 = document.createElement("div");
		var range = document.createElement("input");
		var but1 = document.createElement("button");
        var but2 = document.createElement("button");
		var but3 = document.createElement("button");
		var img = document.createElement("img");
		var img1 = document.createElement("img");
        var img2 = document.createElement("img");

		menuDiv.id="menu";
        menuDiv.setAttribute("class",  "objct_settings");
		menuDiv.style.position = "absolute";
		menuDiv.style.top = y+'px';
		menuDiv.style.left = x+'px';

		indiv.setAttribute("style",  "width: 100%; align-items: center; display: flex; justify-content: start;");
        indiv2.setAttribute("style",  "width: 100%; height: 60px; align-items: center; display: flex; justify-content: center;   background-color: #EDEDED;  border: 0.5px solid  black;");
		
        but1.setAttribute( 'class', "button_float" );
        but1.setAttribute('id' , "rot-check");
        but1.setAttribute("style",  "background-color: #EDEDED");
		but1.addEventListener( 'click', ()=>{
            if(document.getElementById("rot-check").style.backgroundColor == "rgb(237, 237, 237)")
            {
			document.getElementById("rot-check").style.backgroundColor= "#93D2FF";
            document.getElementById("trs-check").style.backgroundColor= "#EDEDED";
            }
            else
            document.getElementById("rot-check").style.backgroundColor= "#EDEDED";

        } );


        but2.setAttribute( 'class', "button_float" );
        but2.setAttribute('id' , "trs-check");
        but2.setAttribute("style",  "background-color: #EDEDED");
        but2.addEventListener( 'click', ()=>{
            if(document.getElementById("trs-check").style.backgroundColor== "rgb(237, 237, 237)")
            {
			document.getElementById("trs-check").style.backgroundColor= "#93D2FF";
            document.getElementById("rot-check").style.backgroundColor= "#EDEDED";
            }
            else
            document.getElementById("trs-check").style.backgroundColor= "#EDEDED";

        } );
		
        but3.setAttribute( 'class', "button_float" );
		but3.addEventListener( 'click', hideContextMenutool );  
        
        img.setAttribute('class' , "bar-icon");
        img.setAttribute('src' , "./Media/SVG/Rotate.svg");
       
        img1.setAttribute('class' , "bar-icon");
        img1.setAttribute('src' , "./Media/SVG/Cross.svg");

        img2.setAttribute('class' , "bar-icon");
        img2.setAttribute('src' , "./Media/SVG/Transper.svg");

		range.setAttribute("class", "rotation custom-range");
		range.setAttribute("type","range");
		range.setAttribute("min","0");
		range.setAttribute("max","360");
		range.setAttribute("step","1");
		range.setAttribute("value","0");
		range.addEventListener( 'input', ()=>{
            if (document.getElementById("rot-check").style.backgroundColor== "rgb(147, 210, 255)")
			bdimage.rotation = (+range.value/180*Math.PI);
            if (document.getElementById("trs-check").style.backgroundColor== "rgb(147, 210, 255)")
			bdimage.alpha=1-range.value/360;
		});

		menuDiv.appendChild(indiv);
		menuDiv.appendChild(indiv2);
		indiv2.appendChild(range);
		indiv.appendChild(but1);
        indiv.appendChild(but2);
		indiv.appendChild(but3);
        but3.appendChild(img1);
        but2.appendChild(img2);
        but1.appendChild(img);

		document.body.appendChild(menuDiv);
	}

	function hideContextMenutool() {
		document.getElementById("menu").remove();
	}



    function bpedit() {
        if(bdimage && arr.length == 0) {

            function onDragStart(event)
            {
                if(mod==1 ){
                //document.getElementById("rulet").value = 0;
                selectedItem = this;
                this.data = event.data;
                //this.alpha = 0.5;
                this.dragging = true;
                applic.canMove = 0;
                }
            }
            
            function onDragEnd()
            {
                if(mod==1){
                //document.getElementById("rulet").value = 1;
                //this.alpha = 1;
                this.dragging = false;
                this.data = null;
                applic.canMove = 1;
                }
            }
            
            function onDragMove()
            {
               
                if (this.dragging && mod==1)
                {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x;
                    this.y = newPosition.y;
                }
            }

            var corner = PIXI.Sprite.from('../../Media/SVG/SetPoint.svg');
            corner.anchor.set(0.5);
            corner.scale.set(0.25);
            corner.x = -64;
            corner.y = 0;
            corner.interactive = true;
            corner.buttonMode = true;
            corner
                .on('pointerdown', onDragStart )
                .on('pointermove', onDragMove )
                .on('pointerup', onDragEnd );
    
            app.addChild(corner);
            arr.push(corner);
    
            var corner = PIXI.Sprite.from('../../Media/SVG/SetPoint.svg');
            corner.anchor.set(0.5);
            corner.scale.set(0.25);
            corner.x = 64;
            corner.y = 0;
            corner.interactive = true;
            corner.buttonMode = true;
            corner
                .on('pointerdown', onDragStart )
                .on('pointermove', onDragMove )
                .on('pointerup', onDragEnd );
            app.addChild(corner);
            arr.push(corner);
            showContextMenu(500,500);
        }
    }

    function showContextMenu(x,y) {
        var menuDiv = document.createElement("div");
        menuDiv.id="lengthinp";
        menuDiv.setAttribute('class', 'scale-menu');
        
        var inp = document.createElement("input");
        inp.setAttribute('class', 'xyz_inputt');
        inp.type = "text";
        inp.id = "realdistance";
        inp.placeholder="1000mm";
        inp.pattern="[0-9]{1,5}";
        
        var but = document.createElement("input");
        but.type="button";
        but.setAttribute('class', 'scale-menu-button');
        but.value="Ok";
        but.id = "if_exists";
        but.addEventListener( 'click', bpscale );
        
        menuDiv.appendChild(inp);
        menuDiv.appendChild(but);
        document.body.appendChild(menuDiv);
        
    }

    function bpscale() {
        var distance = distanceTo(arr[0],arr[1]);
        var realdistance = document.getElementById("realdistance").value/1000;
        var kp = realdistance/distance;
        //alert(kp);
        arr[0].parent.removeChild(arr[0]);
        arr[1].parent.removeChild(arr[1]);
        arr=[];
        document.getElementById("lengthinp").remove();
        if(realdistance)
        bdimage.scale.set(bdimage.scale.x*kp, bdimage.scale.y*kp);
        else {
            alert('Use numbers only!')
        }
    }




    function distanceTo(point1, point2)
    {
        return (Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+(point1.y-point2.y)*(point1.y-point2.y)))/64;
    }

    function getBD() {
        return bdimage;
    }

    this.getBD = getBD;
    this.onBlueprintChange = onBlueprintChange;
	this.bpedit = bpedit;
    //this.BGmove = BGmove;
};

export { BackDrop };