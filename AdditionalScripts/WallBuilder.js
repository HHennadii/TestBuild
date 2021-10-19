var WallBuilder = function(app, _edgegroup, _vertexgroup, _floorgroup, _columngroup, _domElement, _grid)
{

	var menuDiv = null;
    var _activeEdge = null;

    var clickTime = null;
    var startPosition = null;
    var endPosition = null;
    var _object = null;
    
    var endcornertosnap = null;
    var startcornersnap = null;

    var endwalltosnap = null;
    var startwalltosnap = null;

    var line = null;

    var selectedcorner = null;


    var currentMod = 0;
    var wallType = 1;

    function setMod(id)
    {
        currentMod = id;
        if(id==-1) deactivate();
        else activate();
    }

    function setWallType(id)
    {
        wallType = id;   
    }

    function activate()
    {
        _domElement.addEventListener('pointermove', onPointerMove);
        _domElement.addEventListener('pointerdown', onPointerDown);
        _domElement.addEventListener('pointerup', onPointerCancel);
        _domElement.addEventListener('pointerleave', onPointerCancel);
        document.getElementById("rulet").value = 0;
        
    }





    function deactivate()
    {
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.style.cursor = '';  
        document.getElementById("rulet").value = 0;
    }

    function onPointerDown(event)
    {
        if(event.button == 0 && currentMod == 0)
        {
            if(wallType == 1)
            {
               // var man = new PIXI.InteractionManager(app.renderer);
               // var last = man.hitTest(new PIXI.Point(event.offsetX, event.offsetY), _vertexgroup);
               // if(last) startcornersnap = last;


                if(startwalltosnap)
                {
                    startPosition = consoleProject(event, startwalltosnap);
                    _object = createWall(startPosition.x,startPosition.y);
                    _object.userData = {};
                    var graphics = createCorner(startPosition);
                    _object.userData.vertex = [graphics];
                    graphics.userData = {};
                    graphics.userData.edges = [_object];
                }
                else
                {
                    if(startcornersnap)
                    {
                        startPosition.x = startcornersnap.x; startPosition.y = startcornersnap.y;
                        _object = createWall(startPosition.x,startPosition.y);
                        _object.userData = {};
                        _object.userData.vertex = [startcornersnap];
                        startcornersnap.userData.edges.push(_object);
                    }
                    else
                    {
                        var x = event.offsetX, y = event.offsetY;
                        startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                        _object = createWall(startPosition.x,startPosition.y);
                        _object.userData = {};
                        var graphics = createCorner(startPosition);
                        _object.userData.vertex = [graphics];
                        graphics.userData = {};
                        graphics.userData.edges = [_object];
                    }
                }
            }
            if(wallType == 2)
            {
                var x = event.offsetX, y = event.offsetY;
                startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                _object = createColumn(startPosition.x,startPosition.y);
            }
        }
    }


    function onPointerMove(event)
    {
        var x = event.offsetX, y = event.offsetY;
        if(wallType == 1)
        {
            if(_object)
            {
            endPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
            if(endwalltosnap)
            {
                endPosition = consoleProject(event, endwalltosnap);
            }
            if(endcornertosnap)
            {
                endPosition.x = endcornertosnap.x; endPosition.y = endcornertosnap.y;
            }
            _object.x = (endPosition.x+startPosition.x)/2;
            _object.y = (endPosition.y+startPosition.y)/2;
            myLookAt(_object, endPosition);
            _object.scale.x = Math.sqrt((endPosition.x/64-startPosition.x/64)*(endPosition.x/64-startPosition.x/64)+(endPosition.y/64-startPosition.y/64)*(endPosition.y/64-startPosition.y/64));
            }
        }
        if(wallType == 2)
        {
            if(_object)
            {
            endPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
            if(endwalltosnap)
            {
                endPosition = consoleProject(event, endwalltosnap);
            }
            if(endcornertosnap)
            {
                endPosition.x = endcornertosnap.x; endPosition.y = endcornertosnap.y;
            }
            _object.x = startPosition.x;
            _object.y = startPosition.y;
            var scale = Math.sqrt((endPosition.x/64-startPosition.x/64)*(endPosition.x/64-startPosition.x/64)+(endPosition.y/64-startPosition.y/64)*(endPosition.y/64-startPosition.y/64));
            _object.scale.x = scale; _object.scale.y = scale;
            }
        }
    }
/*
    function onPointerCancel(event)
    {
        if(wallType == 1)
        {
        if(_object)
        {
            if(!endcornertosnap)
            {
                var graphics = createCorner(endPosition);
                _object.userData.vertex.push(graphics);
                graphics.userData = {};
                graphics.userData.edges = [_object];
                if(endwalltosnap)
                {
                    createWallBetween(endwalltosnap.userData.vertex[0],graphics);
                    createWallBetween(endwalltosnap.userData.vertex[1],graphics);
                    removeEdge(endwalltosnap);
                    app.stage.removeChild(line);
                    endwalltosnap = null;
                }
            }
            else
            {
                if(endcornertosnap == _object.userData.vertex[0])
                {
                    if(endcornertosnap.userData.edges.length == 1) _vertexgroup.removeChild(endcornertosnap); //ДОРОБИТИ!!!!
                    //removeEdge(_object);
                    _edgegroup.removeChild(_object);
                    endcornertosnap = null;
                }
                else
                {
                endcornertosnap.userData.edges.push(_object);
                _object.userData.vertex.push(endcornertosnap);
                endcornertosnap = null;
                }
            }
            if(startwalltosnap)
            {
                _edgegroup.removeChild(startwalltosnap);
                createWallBetween(startwalltosnap.userData.vertex[0],_object.userData.vertex[0]);
                createWallBetween(startwalltosnap.userData.vertex[1],_object.userData.vertex[0]);
                //removeEdge(startwalltosnap);
                startwalltosnap = null;
            }

            this.data = null;
            _object.interactive = true;
            _object = null;
            startcornersnap = null;
        }
        }
        if(wallType ==2 )
        {
            if(_object)
            {
            _object.interactive = true;
            _object = null;
            }
        }
    }*/


    function onPointerCancel(event)
    {   
        if(wallType == 1)
        {
            if(_object)
            {
               // var man = new PIXI.InteractionManager(app.renderer);
               // var last = man.hitTest(new PIXI.Point(event.offsetX, event.offsetY), _vertexgroup);
               // if(last) endcornertosnap = last;
                if(endcornertosnap)
                {

                    if(endcornertosnap!=_object.userData.vertex[0])
                    {
                        endcornertosnap.userData.edges.push(_object);
                        _object.userData.vertex.push(endcornertosnap);
                        endcornertosnap = null;
                    }
                    else
                    {
                        removeEdge(_object);
                        endcornertosnap = null;
                    }
                }
                else
                {
                    if(startwalltosnap)
                    {
                        createWallBetween(startwalltosnap.userData.vertex[0],_object.userData.vertex[0]);
                        createWallBetween(startwalltosnap.userData.vertex[1],_object.userData.vertex[0]);
                        removeEdge(startwalltosnap);
                        startwalltosnap = null;
                    }
                    if(endwalltosnap)
                    {
                        var graphics = createCorner(endPosition);
                        graphics.userData = {};
                        graphics.userData.edges = [_object];
                        _object.userData.vertex.push(graphics);
                        createWallBetween(endwalltosnap.userData.vertex[0],graphics);
                        createWallBetween(endwalltosnap.userData.vertex[1],graphics);
                        removeEdge(endwalltosnap);
                        app.stage.removeChild(line);
                        endwalltosnap = null;
                    }
                    else
                    {
                        var graphics = createCorner(endPosition);
                        _object.userData.vertex.push(graphics);
                        graphics.userData = {};
                        graphics.userData.edges = [_object];
                    }
                }
            startcornersnap = null;
            _object.interactive = true;
            _object = null;
            }
        }
        if(wallType ==2 )
        {
            if(_object)
            {
            _object.interactive = true;
            _object = null;
            }
        }
    }

/* my try again
    function onPointerCancel(event)
    {   
        if(_object)
        {
            if(wallType == 1)
            {
                var man = new PIXI.InteractionManager(app.renderer);
                var last = man.hitTest(new PIXI.Point(event.offsetX, event.offsetY), _vertexgroup);
                if(last) endcornertosnap = last;
                if(endcornertosnap)
                {
                    if(endcornertosnap!=_object.userData.vertex[0])
                    {
                        endcornertosnap.userData.edges.push(_object);
                        _object.userData.vertex.push(endcornertosnap);
                        endcornertosnap = null;
                    }
                    else
                    {
                        removeEdge(_object);
                        endcornertosnap = null;
                    }
                }
                else
                {
                    if(startwalltosnap)
                    {
                        createWallBetween(startwalltosnap.userData.vertex[0],_object.userData.vertex[0]);
                        createWallBetween(startwalltosnap.userData.vertex[1],_object.userData.vertex[0]);
                        removeEdge(startwalltosnap);
                        startwalltosnap = null;
                    }
                    if(endwalltosnap)
                    {
                        var graphics = createCorner(endPosition);
                        graphics.userData = {};
                        graphics.userData.edges = [_object];
                        _object.userData.vertex.push(graphics);
                        createWallBetween(endwalltosnap.userData.vertex[0],graphics);
                        createWallBetween(endwalltosnap.userData.vertex[1],graphics);
                        removeEdge(endwalltosnap);
                        app.stage.removeChild(line);
                        endwalltosnap = null;
                    }
                    else
                    {
                        var graphics = createCorner(endPosition);
                        _object.userData.vertex.push(graphics);
                        graphics.userData = {};
                        graphics.userData.edges = [_object];
                    }
                }
                startcornersnap = null;
                _object.interactive = true;
                _object = null;
            }
            if(wallType ==2 )
            {
                _object.interactive = true;
                _object = null;
            }
        }
    }*/


    function createWall(x,y)
    {
        var wall = new PIXI.Graphics();
        wall.beginFill(0x000000, 1);
        wall.drawRect(-32, -32, 64,64);
        wall.endFill();
        _edgegroup.addChild(wall);

        wall.scale.y = 0.15;

        wall.x = x;
        wall.y = y;

        createhelper(wall,{x:-32,y:-32});//1
        createhelper(wall,{x:32,y:-32});//3
        createhelper(wall,{x:-32,y:32});//4
        createhelper(wall,{x:32,y:32});//5

        wall.interactive = false;
        wall
            .on('pointerover',()=>
            {
                endwalltosnap = wall;
                _vertexgroup.alpha = 1;
                redrawWall(wall, 0x0000ff, wall.children[0].position, wall.children[2].position, wall.children[3].position, wall.children[1].position);
                line = new PIXI.Graphics();
                line.lineStyle(2, 0x000000);
                drawDash(line,wall.userData.vertex[0].x, wall.userData.vertex[0].y,wall.userData.vertex[1].x, wall.userData.vertex[1].y, 10, 10);
                app.stage.addChild(line);
            })
            .on('pointerdown',()=>
            {
                startwalltosnap = wall;
            })
            .on('rightclick',function(event){
                showContextMenu(event.data.global.x, event.data.global.y);
                _activeEdge = wall;
            })
            .on('touchstart',function(event) {
                if (clickTime == null) {
                    clickTime = setTimeout(function () {
                    clickTime = null;}, 500)
                    console.log(clickTime);
                } else {
                    console.log(clickTime);
                    clearTimeout(clickTime);
                    clickTime = null;
                    console.log(clickTime);
                    showContextMenu(event.data.global.x, event.data.global.y);
                     _activeEdge = wall;
                } 
             })
            .on('pointerout',()=>
            {
                endwalltosnap = null;
                _vertexgroup.alpha = 0;
                redrawWall(wall, 0x000000, wall.children[0].position, wall.children[2].position, wall.children[3].position, wall.children[1].position);
                line.parent.removeChild(line);
            });
        return wall;
    }


	function showContextMenu(x,y)
	{
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		var indiv = document.createElement("div");
		var indiv2 = document.createElement("div");
		var range = document.createElement("input");
		var but1 = document.createElement("button");
        var but2 = document.createElement("button");
		var but3 = document.createElement("button");
        var but4 = document.createElement("button");
		var img = document.createElement("img");
		var img1 = document.createElement("img");
        var img2 = document.createElement("img");
        var img3 = document.createElement("img");

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
            //document.getElementById("rot-check").style.backgroundColor= "#EDEDED";
            }
            else
            document.getElementById("trs-check").style.backgroundColor= "#EDEDED";

        } );
		
        but3.setAttribute( 'class', "button_float" );
		but3.addEventListener( 'click', hideContextMenu ); 

        but4.setAttribute( 'class', "button_float" );
		but4.addEventListener( 'click', removeActiveEdge ); 
        
        img.setAttribute('class' , "bar-icon");
        img.setAttribute('src' , "./Icons/height.svg");
       
        img1.setAttribute('class' , "bar-icon");
        img1.setAttribute('src' , "./Icons/Cross.svg");

        img2.setAttribute('class' , "bar-icon");
        img2.setAttribute('src' , "./Icons/width.svg");

        img3.setAttribute('class' , "bar-icon");
        img3.setAttribute('src' , "./Icons/Bin.svg");

		range.setAttribute("class", "xyz_input");
		range.setAttribute("type","number");
        range.setAttribute("style","width: 180px;");
		range.setAttribute("value","0.15");
		range.addEventListener( 'input', ()=>{
           // if (document.getElementById("rot-check").style.backgroundColor== "rgb(147, 210, 255)")
		   //	_activeEdge.scale.z = (+range.value);
            if (document.getElementById("trs-check").style.backgroundColor== "rgb(147, 210, 255)")
			_activeEdge.scale.y = (+range.value);
		});

		menuDiv.appendChild(indiv);
		menuDiv.appendChild(indiv2);
		indiv2.appendChild(range);
		//indiv.appendChild(but1);
        indiv.appendChild(but2);
		indiv.appendChild(but4);
        indiv.appendChild(but3);
        but4.appendChild(img3);
        but3.appendChild(img1);
        but2.appendChild(img2);
        but1.appendChild(img);

		document.body.appendChild(menuDiv);
	}

	function hideContextMenu()
	{
		document.getElementById("menu").remove();
        _activeEdge = null;
	}


    function showContextMenu2(x,y)
	{
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		var indiv = document.createElement("div");
		var indiv2 = document.createElement("div");
		var range = document.createElement("input");
		var but1 = document.createElement("button");
        var but2 = document.createElement("button");
		var but3 = document.createElement("button");
        var but4 = document.createElement("button");
		var img = document.createElement("img");
		var img1 = document.createElement("img");
        var img2 = document.createElement("img");
        var img3 = document.createElement("img");

		menuDiv.id="menu";
        menuDiv.setAttribute("class",  "objct_settings");
		menuDiv.style.position = "absolute";
		menuDiv.style.top = y+'px';
		menuDiv.style.left = 30+x+'px';

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
            //document.getElementById("rot-check").style.backgroundColor= "#EDEDED";
            }
            else
            document.getElementById("trs-check").style.backgroundColor= "#EDEDED";

        } );
		
        but3.setAttribute( 'class', "button_float" );
		but3.addEventListener( 'click', hideContextMenu ); 

        but4.setAttribute( 'class', "button_float" );
		but4.addEventListener( 'click', removeActiveEdge ); 
        
        img.setAttribute('class' , "bar-icon");
        img.setAttribute('src' , "./Icons/height.svg");
       
        img1.setAttribute('class' , "bar-icon");
        img1.setAttribute('src' , "./Icons/Cross.svg");

        img2.setAttribute('class' , "bar-icon");
        img2.setAttribute('src' , "./Icons/width.svg");

        img3.setAttribute('class' , "bar-icon");
        img3.setAttribute('src' , "./Icons/Bin.svg");

		range.setAttribute("class", "xyz_input");
		range.setAttribute("type","number");
        range.setAttribute("style","width: 180px;");
		range.setAttribute("value","0.15");
		range.addEventListener( 'input', ()=>{
           // if (document.getElementById("rot-check").style.backgroundColor== "rgb(147, 210, 255)")
		   //	_activeEdge.scale.z = (+range.value);
            if (document.getElementById("trs-check").style.backgroundColor== "rgb(147, 210, 255)")
			_activeEdge.scale.y = (+range.value);
		});

		menuDiv.appendChild(indiv);
		//menuDiv.appendChild(indiv2);
		//indiv2.appendChild(range);
		//indiv.appendChild(but1);
        //indiv.appendChild(but2);
		indiv.appendChild(but4);
        indiv.appendChild(but3);
        but4.appendChild(img3);
        but3.appendChild(img1);
        but2.appendChild(img2);
        but1.appendChild(img);

		document.body.appendChild(menuDiv);
	}

	function removeActiveEdge()
	{
        if(_activeEdge && !_activeEdge.userData)
        {
            _columngroup.removeChild(_activeEdge);
            _activeEdge = null;
        }
        else
        {
            if(_activeEdge)
            {
                startwalltosnap = null;
                startcornersnap = null;
                _activeEdge.userData.vertex.forEach(item => {
                    if(item.userData.edges.length == 1) _vertexgroup.removeChild(item);
                    else
                    {
                        for( var i=0; i<item.userData.edges.length; i++)
                        {
                            if(item.userData.edges[i]==_activeEdge)
                            {
                                item.userData.edges.splice(i,1);
                                break;
                            }
                        }
                    }
                    });
                _edgegroup.removeChild(_activeEdge);
                _activeEdge = null;
            }
        }
		hideContextMenu();
	}


    function createColumn(x,y)
    {
        function onDragStart(event)
        {
            if(currentMod == 1)
            {
            document.getElementById("rulet").value = 0;
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            }
        }
        
        function onDragEnd()
        {
            if(currentMod == 1)
            {
            document.getElementById("rulet").value = 1;
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            }
        }
        
        function onDragMove()
        {
            if (this.dragging && currentMod == 1)
            {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }

        var column = new PIXI.Graphics();
        var clickTimer2 = null;
        column.beginFill(0x000000, 1);
        column.drawCircle(0, 0, 64);
        column.endFill();
        _columngroup.addChild(column);
        column.x = x;
        column.y = y;

        column.interactive = false;
        //column.buttonMode = true;
        column
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerover',()=>{
                redrawColumn(column, 0x0000ff);
            })
            .on('pointerout',()=>{
                redrawColumn(column, 0x000000);
            })
            .on('rightclick',function(event){
                showContextMenu(event.data.global.x, event.data.global.y);
                _activeEdge = column;
            })
            .on('touchstart',function(event) {
                if (clickTimer2 == null) {
                    clickTimer2 = setTimeout(function () {
                    clickTimer2 = null;}, 500)
					console.log(clickTimer2);
                } else {
					console.log(clickTimer2);
                    clearTimeout(clickTimer2);
                    clickTimer2 = null;
					console.log(clickTimer2);
                    showContextMenu2(event.data.global.x, event.data.global.y);
                    _activeEdge = column;;
                }
             });
        return column;
    }

    function redrawWall(graphics,color, point1, point2, point3, point4)
    {
        graphics.clear();
        const path = [point1.x, point1.y, -32, 0, point2.x, point2.y, point3.x, point3.y,32,0, point4.x, point4.y];
        graphics.beginFill(color, 1);
        graphics.drawPolygon(path);
        graphics.endFill();
    }

    function redrawColumn(graphics, color)
    {
        graphics.clear();
        graphics.beginFill(color,1);
        graphics.drawCircle(0,0,64);
        graphics.endFill();
    }

    function createhelper(item, position)
    {
        var helper = new PIXI.Container();
        helper.x = position.x; helper.y = position.y;
        item.addChild(helper);
        return helper;
    }

    function createCorner(position)
    {
        function onDragStart(event)
        {
            if(currentMod == 1)
            {
            document.getElementById("rulet").value = 0;
            this.data = event.data;
            //this.alpha = 0.5;
            this.dragging = true;
            }
        }
        
        function onDragEnd()
        {
            if(currentMod == 1)
            {
            document.getElementById("rulet").value = 1;
            //this.alpha = 1;
            this.dragging = false;
            this.data = null;
            //generateFloor();
            }
        }
        
        function onDragMove()
        {
            if (this.dragging && currentMod == 1)
            {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                this.userData.edges.forEach(item=>{adjust(item, item.userData.vertex[0], item.userData.vertex[1]);})
                _vertexgroup.children.forEach(item =>
                    {
                        sortAdgesByAngle(item);
                        alignToNext(item);
                    });
            }
        }

        const corner = new PIXI.Graphics();
        corner.lineStyle(2, 0x000000, 1);
        corner.beginFill(0xFFFFFF, 1);
        corner.drawCircle(0, 0, 8);
        corner.endFill();
        corner.x = position.x;
        corner.y = position.y;
        corner.interactive = true;
        corner
            .on('pointerdown', ()=>{if(currentMod == 0) startcornersnap = corner;})
            .on('pointerover',()=> {
                //console.log(corner.userData.edges);
                showSelected(corner);
                /*for(var i = 0; i<corner.userData.edges.length; i++)
                {
                    addText(corner.userData.edges[i],i);
                }*/
                _vertexgroup.alpha = 1;
                endcornertosnap = corner;
            })
            .on('pointerout',()=> {
                hideSelected(corner);
                _vertexgroup.alpha = 0;
                endcornertosnap = null;
            })
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd);
        _vertexgroup.addChild(corner);
        return corner;
    }

    function adjust(edge, startPosition, endPosition)
    {
        edge.x = (startPosition.x+endPosition.x)/2;
        edge.y = (startPosition.y+endPosition.y)/2;
        myLookAt(edge, endPosition);
        edge.scale.x = Math.sqrt((endPosition.x/64-startPosition.x/64)*(endPosition.x/64-startPosition.x/64)+(endPosition.y/64-startPosition.y/64)*(endPosition.y/64-startPosition.y/64));
    }

    function setActiveWallWidth(width)
    {
        _activeEdge.scale.y = width;
    }

	function sortAdgesByAngle(vertex)
	{
		vertex.userData.edges.sort(function(a,b)
		{
			return calculateAngle(vertex, a)-calculateAngle(vertex,b);
		});
	}

    function addText(item, text)
    {
        item.removeChild(item.children[4]);
        let a = new PIXI.Text(text,{fontFamily : 'Arial', fontSize: 30, fill : 0xffffff, align : 'center'});
        a.scale.x = 1/item.scale.x;
        item.addChild(a);
    }

	function calculateAngle(vertex, edge)
	{
		if(edge.userData.vertex[0]==vertex)
		{
			return edge.rotation;
		}
		else
		{
			if(edge.rotation>0) return edge.rotation - Math.PI;
			else return edge.rotation+Math.PI;
		}
	}

/*
	function alignAdges(vertex, edge1, edge2)
	{
		if(edge1.userData.vertex[0]==vertex && edge2.userData.vertex[0]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[2],one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[3], three);

            var four = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[0],four);
            var five = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[1], five);
			
			var intersection = checkLineIntersection(one.x, one.y, three.x, three.y, four.x, four.y, five.x, five.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[2].x = int1.x; edge1.children[2].y = int1.y;
            edge1.userData.four = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[0].x = int2.x; edge2.children[0].y = int2.y;
            edge2.userData.one = intvector1;

            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}

		if(edge1.userData.vertex[0]==vertex && edge2.userData.vertex[1]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[2],one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[3], three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[2],oone);
            var tthree = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[3], tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[2].x = int1.x; edge1.children[2].y = int1.y;
            edge1.userData.four = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[3].x = int2.x; edge2.children[3].y = int2.y;
            edge2.userData.five = intvector1;

            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}

		if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[0]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[0],one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[1], three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[0],oone);
            var tthree = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[1], tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[1].x = int1.x; edge1.children[1].y = int1.y;
            edge1.userData.three = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[0].x = int2.x; edge1.children[0].y = int2.y;
            edge2.userData.one = intvector1;


            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}

		if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[1]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[0],one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(edge1.children[1], three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[2],oone);
            var tthree = new PIXI.Point();
            edge2.localTransform.apply(edge2.children[3], tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[1].x = int1.x; edge1.children[1].y = int1.y;
            edge1.userData.three = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[3].x = int2.x; edge1.children[3].y = int2.y;
            edge2.userData.five = intvector1;


            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}

	}*/

	function alignAdges(vertex, edge1, edge2)
	{
        if(edge1.userData.vertex[0]==vertex && edge2.userData.vertex[0]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,32),one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,32), three);

            var four = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,-32),four);
            var five = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,-32), five);
			
			var intersection = checkLineIntersection(one.x, one.y, three.x, three.y, four.x, four.y, five.x, five.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[2].x = int1.x; edge1.children[2].y = int1.y;
            edge1.userData.four = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[0].x = int2.x; edge2.children[0].y = int2.y;
            edge2.userData.one = intvector1;

            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}

        if(edge1.userData.vertex[0]==vertex && edge2.userData.vertex[1]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,32),one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,32), three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,32),oone);
            var tthree = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,32), tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[2].x = int1.x; edge1.children[2].y = int1.y;
            edge1.userData.four = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[3].x = int2.x; edge2.children[3].y = int2.y;
            edge2.userData.five = intvector1;

            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}

        if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[0]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,-32),one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,-32), three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,-32),oone);
            var tthree = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,-32), tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[1].x = int1.x; edge1.children[1].y = int1.y;
            edge1.userData.three = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[0].x = int2.x; edge1.children[0].y = int2.y;
            edge2.userData.one = intvector1;


            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}
            
        if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[1]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,-32),one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,-32), three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,-32),oone);
            var tthree = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,32), tthree);
			
			var intersection = checkLineIntersection(oone.x, oone.y, tthree.x, tthree.y, one.x, one.y, three.x, three.y);
			
            var intvector1 = new PIXI.Point(intersection.x,intersection.y);
            var intvector2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvector1,int1);
            edge1.children[1].x = int1.x; edge1.children[1].y = int1.y;
            edge1.userData.three = intvector1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvector2, int2);
            edge2.children[3].x = int2.x; edge1.children[3].y = int2.y;
            edge2.userData.five = intvector1;


            redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}
    }



	function alignToNext(vertex)
	{
		if(vertex.userData.edges.length>1)
		{
			for(var i=0; i<vertex.userData.edges.length-1; i++)
			{
				alignAdges(vertex, vertex.userData.edges[i], vertex.userData.edges[i+1]);
			}
			alignAdges(vertex, vertex.userData.edges[vertex.userData.edges.length-1], vertex.userData.edges[0]);
		}
	}



	function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY)
	{
		var denominator, a, b, numerator1, numerator2, result = {
			x: null,
			y: null,
			onLine1: false,
			onLine2: false
		};
		denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
		if (denominator == 0){return result;}
		a = line1StartY - line2StartY;
		b = line1StartX - line2StartX;
		numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
		numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
		a = numerator1 / denominator;
		b = numerator2 / denominator;
		result.x = line1StartX + (a * (line1EndX - line1StartX));
		result.y = line1StartY + (a * (line1EndY - line1StartY));
		if (a > 0 && a < 1){result.onLine1 = true;}
		if (b > 0 && b < 1){result.onLine2 = true;}
		return result;
	}


    function consoleProject(event, wall)
    {
        var x = event.offsetX, y = event.offsetY;
        var p = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
		var a ={
			x: wall.userData.vertex[0].position.x,
			y: wall.userData.vertex[0].position.y,
		}
		var b={
			x: wall.userData.vertex[1].position.x,
			y: wall.userData.vertex[1].position.y,
		}
        return project(p,a,b).point;
    }

    function myLookAt(object, target)
	{
        var dx = target.x - object.x;
        var dy = target.y - object.y;
		var rotation = Math.atan2(dy, dx);
		object.rotation = rotation;
	}

	function createWallBetween(vertex1, vertex2)
	{
        var wall = createWall((vertex1.x+vertex2.x)/2,(vertex1.y+vertex2.y)/2);
        wall.interactive = true;
        myLookAt(wall, vertex2);
        wall.scale.x = Math.sqrt((vertex1.x/64-vertex2.x/64)*(vertex1.x/64-vertex2.x/64)+(vertex1.y/64-vertex2.y/64)*(vertex1.y/64-vertex2.y/64));
        wall.userData = {};
        wall.userData.vertex = [vertex1,vertex2];
        vertex1.userData.edges.push(wall);
        vertex2.userData.edges.push(wall);
	}

	function removeEdge(edge)
	{
		if(edge)
		{
			edge.userData.vertex.forEach(item => {
				if(item.userData.edges.length == 1) _vertexgroup.removeChild(item);
				else
				{
					for( var i=0; i<item.userData.edges.length; i++)
					{
						if(item.userData.edges[i]==edge)
						{
							item.userData.edges.splice(i,1);
							break;
						}
					}
				}
				});
			_edgegroup.removeChild(edge);
		}
	}

	function nextEdge(edge, vertex)
	{
		if(vertex.userData.edges[0] == edge) return vertex.userData.edges[1];
		else return vertex.userData.edges[0];
	}

	function nextVertex(vertex,edge)
	{
		if(edge.userData.vertex[0] == vertex) return edge.userData.vertex[1];
		else return edge.userData.vertex[0];
	}

	function getTales()
	{
		var taleEdges=[];
		_vertexgroup.children.forEach(vertex => {
			if(vertex.userData.edges.length==1 && !taleEdges.includes(vertex.userData.edges[0]))
			{
				var currentVertex = vertex;
				var currentEdge = vertex.userData.edges[0];
				var power = 1;
				while(power<3)
				{
					if(!taleEdges.includes(currentEdge))
					{
						taleEdges.push(currentEdge);
						currentVertex = nextVertex(currentVertex, currentEdge);
						power = currentVertex.userData.edges.length;
						if(power == 1) break;
						currentEdge = nextEdge(currentEdge, currentVertex);
					}
					else break;
				}
			}
		});
		return taleEdges;
	}
/*
	function getNextEdge(vertex, edge, tails)
	{
		var idx = vertex.userData.edges.indexOf(edge);
		if(idx == vertex.userData.edges.length-1)
		{
			if(!tails.includes(vertex.userData.edges[0])) return vertex.userData.edges[0];
			else return getNextEdge(vertex, vertex.userData.edges[0], tails);
		}
		else
		{
			if(!tails.includes(vertex.userData.edges[idx+1])) return vertex.userData.edges[idx+1];
			else return getNextEdge(vertex, vertex.userData.edges[idx+1],tails);
		}
	}*/

    function getNextEdge(vertex, edge, tails)
    {
		var idx = vertex.userData.edges.indexOf(edge);
		if(idx == 0)
		{
			if(!tails.includes(vertex.userData.edges[vertex.userData.edges.length-1])) return vertex.userData.edges[vertex.userData.edges.length-1];
			else return getNextEdge(vertex, vertex.userData.edges[vertex.userData.edges.length-1], tails);
		}
		else
		{
			if(!tails.includes(vertex.userData.edges[idx-1])) return vertex.userData.edges[idx-1];
			else return getNextEdge(vertex, vertex.userData.edges[idx-1],tails);
		}
    }

	function getPoints(vertex, edge)
	{
		if(edge.userData.vertex[0] == vertex) return [edge.userData.three, edge.userData.one];
		else return [edge.userData.four, edge.userData.five];
	}


	function generateFloor()
	{
        if(_edgegroup.children.length!=0)
        {
            _floorgroup.removeChild(_floorgroup.children[0]);
            var circle = new PIXI.Graphics();
            circle.lineStyle(10, 0x000000, 0);

            _floorgroup.addChild(circle);
            var tails = getTales();
            console.log(tails);
            for(var i = 0; i<_edgegroup.children.length; i++)
            {
                if(!tails.includes(_edgegroup.children[i]))
                {
                    console.log('in func');

                    var path0 = [];
                    var finished0 = false;
                    var edge0 = _edgegroup.children[i];
                    var vertex0 = edge0.userData.vertex[0];
                    
                    while(!finished0)
                    {
                        vertex0 = nextVertex(vertex0,edge0);
                        var points = getPoints(vertex0, edge0);
                        edge0 = getNextEdge(vertex0, edge0, tails);
                        
                        if(points[1]==path0[0] && path0.length>2) finished0 = true;
                        else
                        {
                        if(points[0]!=path0[path0.length-1]) path0.push(points[0],points[1]);
                        else path0.push(points[1]);
                        }
                        console.log(path0);
                    }
                console.log(path0);
                //тут намалювати підлогу
                circle.beginFill(0x664422 , 1);
                //myPolygon(circle, path0);
                circle.drawPolygon(path0);
                circle.endFill();

                }
            }
        }
	}

    function myPolygon(graphics, path)
    {
        graphics.beginFill(0x664422 , 1);
        graphics.moveTo(path[0]);
        for(var i = 1; i<path.length; i++)
        {
            graphics.lineTo(path[i]);
        }
        graphics.endFill();
    }

    activate();
    this.activate = activate;
    this.deactivate = deactivate;
    this.setMod = setMod;
    this.setWallType = setWallType;
};

function showSelected(graphics)
{
    graphics.clear();
    graphics.lineStyle(2, 0x000000, 0);
    graphics.beginFill(0x000077, 1);
    graphics.drawCircle(0, 0, 8);
    graphics.endFill();
}

function hideSelected(graphics)
{
    graphics.clear();
    graphics.lineStyle(2, 0x000000, 1);
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawCircle(0, 0, 8);
    graphics.endFill();
}

function drawDash(target, x1, y1, x2, y2, dashLength = 5, spaceLength = 5)
{
    let x = x2 - x1;
    let y = y2 - y1;
    let hyp = Math.sqrt((x) * (x) + (y) * (y));
    let units = hyp / (dashLength + spaceLength);
    let dashSpaceRatio = dashLength / (dashLength + spaceLength);
    let dashX = (x / units) * dashSpaceRatio;
    let spaceX = (x / units) - dashX;
    let dashY = (y / units) * dashSpaceRatio;
    let spaceY = (y / units) - dashY;
    target.moveTo(x1, y1);
    while (hyp > 0)
    {
        x1 += dashX;
        y1 += dashY;
        hyp -= dashLength;
        if (hyp < 0)
        {
            x1 = x2;
            y1 = y2;
        }
        target.lineTo(x1, y1);
        x1 += spaceX;
        y1 += spaceY;
        target.moveTo(x1, y1);
        hyp -= spaceLength;
    }
    target.moveTo(x2, y2);
}

function project( p, a, b )
{
var atob = { x: b.x - a.x, y: b.y - a.y };
var atop = { x: p.x - a.x, y: p.y - a.y };
var len = atob.x * atob.x + atob.y * atob.y;
var dot = atop.x * atob.x + atop.y * atob.y;
var t = Math.min( 1, Math.max( 0, dot / len ) );
dot = ( b.x - a.x ) * ( p.y - a.y ) - ( b.y - a.y ) * ( p.x - a.x );
return{
    point:
    {
        x: a.x + atob.x * t,
        y: a.y + atob.y * t
    },
    left: dot < 1,
    dot: dot,
    t: t
};
}

export { WallBuilder };