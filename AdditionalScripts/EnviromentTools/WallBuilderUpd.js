var WallBuilder = function(app, _edgegroup, _vertexgroup, _floorgroup, _columngroup, _domElement, _grid, axiscontainer, _blockgroup)
{
	var menuDiv = null;
    var _activeEdge = null;
    let timer;
    var clickTime = null;
    var startPosition = null;
    var endPosition = null;
    var _object = null;

    var startwalltosnap = null;
    
    var line = null;

    var dragging = false;

    var snapaxisx, snapaxisy;

    var currentMod = 0;
    var wallType = 0;

    function setMod(id) {
        currentMod = id;
        if(id==-1) deactivate();
        else activate();
    }

    function setWallType(id) {
        wallType = id;   
    }

    function activate() {
        _domElement.addEventListener('pointermove', onPointerMove);
        _domElement.addEventListener('pointerdown', onPointerDown);
        _domElement.addEventListener('pointerup', onPointerCancel);
        _domElement.addEventListener('pointerleave', onPointerCancel);
    }


    function deactivate() {
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.style.cursor = '';  
    }

    function onPointerDown(event) {
        if(event.button == 0 && currentMod == 0) {
            if(wallType == 1) {
                var x = event.offsetX, y = event.offsetY;
                startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                endPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};

                var pnt = new PIXI.Point(x,y);
                var startcorner, startwall;

                startcorner = app.renderer.plugins.interaction.hitTest(pnt, _vertexgroup);
                startwall = app.renderer.plugins.interaction.hitTest(pnt, _edgegroup);
                
                if(!startcorner && !startwall) {
                    _object = createWall(startPosition.x,startPosition.y);
                    var corner = createCorner(startPosition);
                    _object.userData.vertex.push(corner);
                    corner.userData = {};
                    corner.userData.edges = [_object];
                }
                else {
                    if(startcorner) {
                        startPosition.x = startcorner.x; startPosition.y = startcorner.y;
                        endPosition.x = startcorner.x; startPosition.y = startcorner.y;
                        _object = createWall(startPosition.x,startPosition.y);
                        _object.userData.vertex.push(startcorner);
                        startcorner.userData.edges.push(_object);
                    }
                    else {
                        startwalltosnap = startwall;
                        startPosition = consoleProject(event, startwall);
                        endPosition = consoleProject(event, startwall);
                        _object = createWall(startPosition.x,startPosition.y);
                        //var corner = createCorner(startPosition);
                        //_object.userData.vertex.push(corner);
                        //corner.userData = {};
                        //corner.userData.edges = [_object];
                    }
                }
                //showLengthDiv(event.offsetX+500, event.offsetY);
            }
            if(wallType == 2) {
                var x = event.offsetX, y = event.offsetY;
                startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                _object = createColumn(startPosition.x,startPosition.y);
            }
            if(wallType == 3) {
                var x = event.offsetX, y = event.offsetY;
                startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                _object = createBlock(startPosition.x,startPosition.y);
            }
        }
    }


    function onPointerMove(event) {
        var x = event.offsetX, y = event.offsetY; //screen
        var cursorPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage

        if(app.userData.snapvert && currentMod!=1) updateAxisHelpers();
        else if(!dragging) axiscontainer.removeChild(...axiscontainer.children);

        if(wallType == 1) {
            if(_object) {
            //moveLengthDiv(x+500,y,getWallLength(_object));
            endPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};

                if(app.userData.snapvert && startPosition) {
                    var closestaxis;
                    var disttoaxis = 10000;
                    for(let posx of snapaxisx) {
                        if(Math.abs(cursorPosition.x-posx)<disttoaxis) {
                            disttoaxis = Math.abs(cursorPosition.x-posx);
                            closestaxis = posx;
                        }
                        if(disttoaxis<32) {
                            endPosition.x = closestaxis;
                        }
                    }
                    disttoaxis = 10000;
                    for(let posy of snapaxisy) {
                        if(Math.abs(cursorPosition.y-posy)<disttoaxis) {
                            disttoaxis = Math.abs(cursorPosition.y-posy);
                            closestaxis = posy;
                        }
                        if(disttoaxis<32) {
                            endPosition.y = closestaxis;
                        }
                    }
                }
                
                if(app.userData.snapvert && startPosition) {
                    var closestaxis;
                    var disttoaxis = 10000;
                    for(let posx of snapaxisx) {
                        if(Math.abs(cursorPosition.x-posx)<disttoaxis) {
                            disttoaxis = Math.abs(cursorPosition.x-posx);
                            closestaxis = posx;
                        }
                        if(disttoaxis<32) {
                            cursorPosition.x = closestaxis;
                        }
                    }
                    disttoaxis = 10000;
                    for(let posy of snapaxisy) {
                        if(Math.abs(cursorPosition.y-posy)<disttoaxis) {
                            disttoaxis = Math.abs(cursorPosition.y-posy);
                            closestaxis = posy;
                        }
                        if(disttoaxis<32) {
                            cursorPosition.y = closestaxis;
                        }
                    }
                }
            
            var pnt = new PIXI.Point(endPosition.x*app.stage.scale.x+app.stage.x,endPosition.y*app.stage.scale.y+app.stage.y);
            var endcorner, endwall;
    
            endcorner = app.renderer.plugins.interaction.hitTest(pnt, _vertexgroup);
            endwall = app.renderer.plugins.interaction.hitTest(pnt, _edgegroup);

            if(endcorner) {
                endPosition.x = endcorner.x;
                endPosition.y = endcorner.y;
            }

            if(endwall) {
                if(endwall.name == 'door' || endwall.name == 'window') endwall = endwall.parent;
                endPosition = consoleProject(event, endwall);
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
            _object.x = startPosition.x;
            _object.y = startPosition.y;
            var scale = Math.sqrt((endPosition.x/64-startPosition.x/64)*(endPosition.x/64-startPosition.x/64)+(endPosition.y/64-startPosition.y/64)*(endPosition.y/64-startPosition.y/64));
            _object.scale.x = scale; _object.scale.y = scale;
            }
        }
        if(wallType == 3)
        {
            if(_object)
            {
            endPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
            _object.x = startPosition.x;
            _object.y = startPosition.y;
            var scale = Math.sqrt((endPosition.x/64-startPosition.x/64)*(endPosition.x/64-startPosition.x/64)+(endPosition.y/64-startPosition.y/64)*(endPosition.y/64-startPosition.y/64));
            _object.scale.x = 2*(endPosition.x/64-startPosition.x/64); _object.scale.y = 2*(endPosition.y/64-startPosition.y/64);
            }
        }
    }

    function onPointerCancel(event) {   

        if(wallType == 1) {
            if(_object) {

                if(_object && Math.sqrt((endPosition.x-startPosition.x)*(endPosition.x-startPosition.x)+(endPosition.y-startPosition.y)*(endPosition.y-startPosition.y))<6.4) {
                    var tmp = _object;
                    _object = null;
                    hideLengthDiv();
                    removeEdge(tmp);
                    startwalltosnap = null;
                    return
                }


                var pnt = new PIXI.Point(endPosition.x*app.stage.scale.x+app.stage.x,endPosition.y*app.stage.scale.y+app.stage.y);
                var endcorner, endwall;
    
                endcorner = app.renderer.plugins.interaction.hitTest(pnt, _vertexgroup);
                endwall = app.renderer.plugins.interaction.hitTest(pnt, _edgegroup);

                hideLengthDiv();
    
                if(!endcorner && !endwall) {
                    if(startwalltosnap) {
                        var corner = createCorner(startPosition);
                        _object.userData.vertex.push(corner);
                        corner.userData = {};
                        corner.userData.edges = [_object];
                        createWallBetweenWidth(startwalltosnap.userData.vertex[0], corner, startwalltosnap.userData.width, startwalltosnap.userData.height,0);
                        createWallBetweenWidth(corner, startwalltosnap.userData.vertex[1], startwalltosnap.userData.width, startwalltosnap.userData.height,0);
                        removeEdge(startwalltosnap);
                    }
                    var graphics = createCorner(endPosition);
                    _object.userData.vertex.push(graphics);
                    graphics.userData = {};
                    graphics.userData.edges = [_object];
    
                    _object.interactive = true;
                    _object = null;
                }
                else {
                    if(endcorner) {
                        if(endcorner!=_object.userData.vertex[0]) {
                            if(startwalltosnap) {
                                var corner = createCorner(startPosition);
                                _object.userData.vertex.push(corner);
                                corner.userData = {};
                                corner.userData.edges = [_object];
                                createWallBetweenWidth(startwalltosnap.userData.vertex[0], corner, startwalltosnap.userData.width, startwalltosnap.userData.height,0);
                                createWallBetweenWidth(corner, startwalltosnap.userData.vertex[1], startwalltosnap.userData.width, startwalltosnap.userData.height,0);
                                removeEdge(startwalltosnap);
                            }
                            endcorner.userData.edges.push(_object);
                            _object.userData.vertex.push(endcorner);

                            _object.interactive = true;
                            _object = null;
                        }
                        else {
                            removeEdge(_object);

                            _object.interactive = true;
                            _object = null;
                        }
                    }
                    else {
                        if(startwalltosnap) {
                            var corner = createCorner(startPosition);
                            _object.userData.vertex.push(corner);
                            corner.userData = {};
                            corner.userData.edges = [_object];
                            createWallBetweenWidth(startwalltosnap.userData.vertex[0], corner, startwalltosnap.userData.width, startwalltosnap.userData.height,0);
                            createWallBetweenWidth(corner, startwalltosnap.userData.vertex[1], startwalltosnap.userData.width, startwalltosnap.userData.height,0);
                            removeEdge(startwalltosnap);
                        }
                        if(endwall.name == 'door' || endwall.name == 'window') endwall = endwall.parent;
                        var graphics = createCorner(endPosition);
                        graphics.userData = {};
                        graphics.userData.edges = [_object];
                        _object.userData.vertex.push(graphics);
                        createWallBetweenWidth(endwall.userData.vertex[0],graphics, endwall.userData.width, endwall.userData.height,0);
                        createWallBetweenWidth(graphics,endwall.userData.vertex[1], endwall.userData.width, endwall.userData.height,0);
                        removeEdge(endwall);
                        app.stage.removeChild(line);

                        _object.interactive = true;
                        _object = null;
                    }
                }
                startwalltosnap = null;
            }
        }
        if(wallType ==2 ) {
            if(_object) {
            _object.interactive = true;
            _object = null;
            }
        }

        if(wallType ==3 ) {
            if(_object) {
            _object.interactive = true;
            _object = null;
            }
        }

        //if(selected) raycastRainByPoints(edgeIntersectionByVertex(selected));

        delay(50).then(()=>{_vertexgroup.children.forEach(item => {
            sortAdgesByAngle(item);
            alignToNext(item);
            _vertexgroup.alpha = 0;
        })});
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function createWall(x,y) {
        var wall = new PIXI.Graphics();
        wall.beginFill(0x000000, 1);
        wall.drawRect(-32, -32, 64,64);
        wall.endFill();
        _edgegroup.addChild(wall);
        wall.userData = {
            vertex: [],
            width: 15,
            offset: 0,
            height: 3.5,
        };

        wall.scale.y = 0.15;
        wall.scale.x = 0;
        wall.x = x;
        wall.y = y;

        createhelper(wall,{x:-32,y:-32});//1
        createhelper(wall,{x:32,y:-32});//3
        createhelper(wall,{x:-32,y:32});//4
        createhelper(wall,{x:32,y:32});//5

        createhelper(wall,{x:-32,y:0}); //left
        createhelper(wall,{x:32,y:0}); //right

        wall.interactive = false;
        wall
            .on('pointerover',(e) => {
                _vertexgroup.alpha = 1;
                redrawWallTest(wall, 0x0000ff, wall.children[0].position, wall.children[2].position, wall.children[3].position, wall.children[1].position,wall.children[4].position,wall.children[5].position);
                line = new PIXI.Graphics();
                line.lineStyle(2, 0x000000);
                drawDash(line,wall.userData.vertex[0].x, wall.userData.vertex[0].y,wall.userData.vertex[1].x, wall.userData.vertex[1].y, 10, 10);
                app.stage.addChild(line);
                if(!dragging) {
                    showLengthDiv(e.data.global.x+100, e.data.global.y);
                    moveLengthDiv(e.data.global.x+100, e.data.global.y, getWallLength(wall));
                }
            })
            .on('rightclick',e => {
                e.stopPropagation();
                _activeEdge = wall;
                showContextMenu(e.data.global.x, e.data.global.y);
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
             }) 
            .on('pointerout',() => {
                _vertexgroup.alpha = 0;
                redrawWallTest(wall, 0x000000, wall.children[0].position, wall.children[2].position, wall.children[3].position, wall.children[1].position,wall.children[4].position,wall.children[5].position);
                if(line.parent) line.parent.removeChild(line);
                hideLengthDiv();
            });
        return wall;
    }

    function onlongtouch(event) { 
        console.log(timer);
        timer = null;
        if(app.userData.canTranslate)
        showContextMenu(event.data.global.x, event.data.global.y);
    };    
    function hideContextMenu() {
		document.getElementById("cover").remove();
        _activeEdge = null;
	}


	function showContextMenu(x,y) {
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		menuDiv.id="cover";
        menuDiv.setAttribute("class",  "menu-cover");
        menuDiv.innerHTML =wallMenu(x,y);
        document.body.appendChild(menuDiv);
        $("#closeMenu").click(()=>hideContextMenu()); 
		$("#deleteobject").click(()=>removeActiveEdge()); 
        $("#sizeSet").prop("value",decimalAdjust(_activeEdge.scale.y, -2));
        $("#offset").prop("value",_activeEdge.userData.offset); 
        $("#sizeSet").on("input",e=> {
            _activeEdge.scale.y=$("#sizeSet").val()
            _activeEdge.userData.width = _activeEdge.scale.y*100;
        });
        $("#offset").on("input",e=>{
            _activeEdge.userData.offset = $("#offset").val();
            var initialpos = new PIXI.Point((_activeEdge.userData.vertex[0].x+_activeEdge.userData.vertex[1].x)/2,(_activeEdge.userData.vertex[0].y+_activeEdge.userData.vertex[1].y)/2);
            var norm = new PIXI.Point(Math.cos(_activeEdge.rotation-Math.PI/2),Math.sin(_activeEdge.rotation-Math.PI/2));
            _activeEdge.position.x=initialpos.x+norm.x * _activeEdge.userData.offset;
            _activeEdge.position.y=initialpos.y+norm.y * _activeEdge.userData.offset;

            _activeEdge.position.x=initialpos.x+norm.x * _activeEdge.userData.offset;
            _activeEdge.position.y=initialpos.y+norm.y * _activeEdge.userData.offset;
            _vertexgroup.children.forEach(item => {
                //sortAdgesByAngle(item);
                alignToNext(item);
               // _vertexgroup.alpha = 0;
            });

        });
        $("#cover").click(function(e){ if(e.currentTarget==e.target)$("#cover").remove();});
        $("#heightSet").prop("value", _activeEdge.userData.height);
        $("#heightSet").on("input",e => {
            _activeEdge.userData.height = $("#heightSet").val();
        });
	}

    function showContextMenuRound(x,y) {
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		menuDiv.id="cover";
        menuDiv.setAttribute("class",  "menu-cover");
        menuDiv.innerHTML =columnMenu(x,y);
        document.body.appendChild(menuDiv);
        $("#closeMenu").click(()=>hideContextMenu()); 
		$("#deleteobject").click(()=>removeActiveEdge());
        $("#sizeSet").prop("value",decimalAdjust(_activeEdge.scale.y, -2)); 
        $("#sizeSet").on("input",e=>{ _activeEdge.scale.y=$("#sizeSet").val();_activeEdge.scale.x=$("#sizeSet").val();});
        $("#cover").click(function(e){ if(e.currentTarget==e.target)$("#cover").remove();});
	}

    function showContextMenuSquare(x,y) {
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		menuDiv.id="cover";
        menuDiv.setAttribute("class",  "menu-cover");
        menuDiv.innerHTML = squareMenu(x,y);
        document.body.appendChild(menuDiv);
        $("#closeMenu").click(()=>hideContextMenu()); 
		$("#deleteobject").click(()=>removeActiveEdge());
        $("#sizeSety").prop("value",decimalAdjust(_activeEdge.scale.y, -2)); 
        $("#sizeSety").on("input",e=> _activeEdge.scale.y=$("#sizeSety").val());
        $("#sizeSetx").prop("value",decimalAdjust(_activeEdge.scale.x, -2)); 
        $("#sizeSetx").on("input",e=> _activeEdge.scale.x=$("#sizeSetx").val());
        $("#cover").click(function(e){ if(e.currentTarget==e.target)$("#cover").remove();});
	}

    function showContextMenuDoor(x,y) {
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		menuDiv.id="cover";
        menuDiv.setAttribute("class",  "menu-cover");
        menuDiv.innerHTML =doorMenu(x,y);
        document.body.appendChild(menuDiv);
        $("#closeMenu").click(()=>hideContextMenu()); 
		$("#deleteobject").click(()=>{
            removeOpening(_activeEdge);
        });
        $("#doorSize").prop("value",decimalAdjust(Math.abs(_activeEdge.userData.scalex), -2)); 
        $("#doorSize").on("input",e=>{
            var scala = +$("#doorSize").val();
            _activeEdge.userData.scalex = scala*_activeEdge.userData.scalex/Math.abs(_activeEdge.userData.scalex);
            _activeEdge.userData.scaley = scala*_activeEdge.userData.scaley/Math.abs(_activeEdge.userData.scaley);
            _activeEdge.scale.x=$("#doorSize").val()/_activeEdge.parent.scale.x*_activeEdge.userData.scalex/Math.abs(_activeEdge.userData.scalex);
            _activeEdge.scale.y=$("#doorSize").val()/_activeEdge.parent.scale.y*_activeEdge.userData.scaley/Math.abs(_activeEdge.userData.scaley);

        });
        $("#cover").click(function(e){ if(e.currentTarget==e.target)$("#cover").remove();});
        $('#doorSide').click(()=> {
            _activeEdge.scale.x = -_activeEdge.scale.x;
            _activeEdge.userData.scalex = -_activeEdge.userData.scalex;
        });
		$('#cornerSide').click(function(){
            _activeEdge.scale.y = -_activeEdge.scale.y;
            _activeEdge.userData.scaley = -_activeEdge.userData.scaley;
		});
        $("#doorheight").prop("value", _activeEdge.userData.height);
        $('#doorheight').on("input",e=>{
            _activeEdge.userData.height = +$("#doorheight").val();
        });
	}
    
    function showContextMenuWindow(x,y) {
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		menuDiv.id="cover";
        menuDiv.setAttribute("class",  "menu-cover");
        menuDiv.innerHTML =windowMenu(x,y);
        document.body.appendChild(menuDiv);
        $("#closeMenu").click(()=>hideContextMenu()); 
		$("#deleteobject").click(()=>{
            removeOpening(_activeEdge);
        });
        $("#doorSize").prop("value",decimalAdjust(_activeEdge.userData.scale, -2)); 
        $("#doorSize").on("input",e=>{
            var scala = +$("#doorSize").val();
            _activeEdge.userData.scale = scala;
            if(_activeEdge.parent!=app.stage) {
                _activeEdge.scale.x=$("#doorSize").val()/_activeEdge.parent.scale.x;
                _activeEdge.scale.y=1;
            }
            else {
                _activeEdge.scale.x = $("#doorSize").val();
                _activeEdge.scale.y=0.15;
            }

        });
        $("#cover").click(function(e){ if(e.currentTarget==e.target)$("#cover").remove();});

        $("#doorheight").prop("value", _activeEdge.userData.height);
        $('#doorheight').on("input",e=>{
            _activeEdge.userData.height = +$("#doorheight").val();
        });

        $("#doorground").prop("value", _activeEdge.userData.heightoffset);
        $('#doorground').on("input",e=>{
            _activeEdge.userData.heightoffset = +$("#doorground").val();
        });
	}
    

	function removeActiveEdge() {
        if(_activeEdge && !_activeEdge.userData) {
            _activeEdge.parent.removeChild(_activeEdge);
            _activeEdge = null;
        }
        else {
            if(_activeEdge) {
                _activeEdge.userData.vertex.forEach(item => {
                    if(item.userData.edges.length == 1) _vertexgroup.removeChild(item);
                    else {
                        for( var i=0; i<item.userData.edges.length; i++) {
                            if(item.userData.edges[i]==_activeEdge) {
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
        _vertexgroup.children.forEach(item => {
                sortAdgesByAngle(item);
                alignToNext(item);
                _vertexgroup.alpha = 0;
            });
	}


    function createColumn(x,y,s=0.5) {
        function onDragStart(event) {
            if(currentMod == 1  && app.userData.canTranslate ) {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            app.canMove = 0;
            }
        }
        
        function onDragEnd() {
            if(currentMod == 1) {
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            app.canMove = 1;
            }
        }
        
        function onDragMove() {
            if (this.dragging && currentMod == 1  && app.userData.canTranslate ) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
            else
                this.alpha=1;
        }

        var column = new PIXI.Graphics();
        var clickTimer2 = null;
        column.beginFill(0x000000, 1);
        column.drawCircle(0, 0, 64);
        column.endFill();
        _columngroup.addChild(column);
        column.x = x;
        column.y = y;
        
        column.scale.x = s;
        column.scale.y = s;

        column.interactive = false;
        column.buttonMode = true;
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
                _activeEdge = column;
                showContextMenuRound(event.data.global.x, event.data.global.y);
            })
            .on('touchstart',function(event) {
                console.log(timer);
                if (!timer) {
                    timer = setTimeout(function() {onlongtouchR(event);}, 2000);
                }      
             })
            
             .on('touchend',function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
             }) 
        return column;
    }
    function onlongtouchR(event) { 
        console.log(timer);
        timer = null;
        if(app.userData.canTranslate)
        showContextMenuRound(event.data.global.x, event.data.global.y);
    };

    function createBlock(x,y, sx=1,sy=1) {
        function onDragStart(event) {
            if(currentMod == 1  && app.userData.canTranslate ) {
            //document.getElementById("rulet").value = 0;
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            app.canMove = 0;
            }
        }
        
        function onDragEnd() {
            if(currentMod == 1) {
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            app.canMove = 1;
            }
        }
        
        function onDragMove() {
            if (this.dragging && currentMod == 1  && app.userData.canTranslate ) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
            else
                this.alpha=1;
        }

        var column = new PIXI.Graphics();
        column.pivot.x = 32;
        column.pivot.y = 32;

        var clickTimer2 = null;
        column.beginFill(0x000000, 1);
        column.drawRect (0,0, 64, 64);
        column.endFill();
        _blockgroup.addChild(column);
        column.x = x;
        column.y = y;

        column.scale.x = sx;
        column.scale.y = sy;

        column.interactive = false;
        column.buttonMode = true;
        column
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerover',()=>{
                redrawBlock(column, 0x0000ff);
            })
            .on('pointerout',()=>{
                redrawBlock(column, 0x000000);
            })
            .on('rightclick',function(event){
                _activeEdge = column;
                showContextMenuSquare(event.data.global.x, event.data.global.y); 
            })
            .on('touchstart',function(event) {
                console.log(timer);
                if (!timer) {
                    timer = setTimeout(function() {onlongtouchS(event);}, 2000);
                }      
             })
            
             .on('touchend',function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
             }) 
        return column;
    }
    function onlongtouchS(event) { 
        console.log(timer);
        timer = null;
        if(app.userData.canTranslate)
        showContextSquare(event.data.global.x, event.data.global.y);
    };

    function redrawWall(graphics,color, point1, point2, point3, point4) {
        graphics.clear();
        const path = [point1.x, point1.y, -32, 0, point2.x, point2.y, point3.x, point3.y,32,0, point4.x, point4.y];
        graphics.beginFill(color, 1);
        graphics.drawPolygon(path);
        graphics.endFill();
    }

    function redrawWallTest(graphics,color, point1, point2, point3, point4, point5, point6) {
        graphics.clear();
        const path = [point1.x, point1.y, point5.x, point5.y, point2.x, point2.y, point3.x, point3.y,point6.x,point6.y, point4.x, point4.y];
        graphics.beginFill(color, 1);
        graphics.drawPolygon(path);
        graphics.endFill();
    }

    function redrawColumn(graphics, color) {
        graphics.clear();
        graphics.beginFill(color,1);
        graphics.drawCircle(0,0,64);
        graphics.endFill();
    }

    function redrawBlock(graphics, color) {
        graphics.clear();
        graphics.beginFill(color,1);
        graphics.drawRect(0,0,64,64);
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
            if(currentMod == 1 && app.userData.mod != 1  && app.userData.canTranslate )
            {
            this.data = event.data;
            this.dragging = true;
            dragging = true;
            app.canMove = 0;
            //showSelected(this);
            //_vertexgroup.alpha = 1;
            }
        }
        
        function onDragEnd()
        {
            if(currentMod == 1)
            {
            this.dragging = false;
            this.data = null;
            //generateFloor();
            dragging = false;
            app.canMove = 1;
            //hideSelected(this);
            //_vertexgroup.alpha = 0;
            }
        }
        
        function onDragMove(event)
        {
            if (this.dragging && currentMod == 1  && app.userData.canTranslate )
            {
                if(app.userData.snapvert) updateAxisHelpers(this);
                else axiscontainer.removeChild(...axiscontainer.children);
                const newPosition = this.data.getLocalPosition(this.parent);

                //var cursorPosition = {x:event.data.global.x, y:event.data.global.y};

                var x = event.data.global.x, y = event.data.global.y; //screen
                var cursorPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage
                if(app.userData.snapvert) {
                    var closestaxis;
                    var disttoaxis = 10000;
                    for(let posx of snapaxisx) {
                        if(Math.abs(cursorPosition.x-posx)<disttoaxis) {
                            disttoaxis = Math.abs(cursorPosition.x-posx);
                            closestaxis = posx;
                        }
                        if(disttoaxis<32) {
                            cursorPosition.x = closestaxis;
                            //console.log(closestaxis);
                        }
                    }
                    disttoaxis = 10000;
                    for(let posy of snapaxisy) {
                        if(Math.abs(cursorPosition.y-posy)<disttoaxis) {
                            disttoaxis = Math.abs(cursorPosition.y-posy);
                            closestaxis = posy;
                        }
                        if(disttoaxis<32) {
                            cursorPosition.y = closestaxis;
                            //console.log(closestaxis);
                        }
                    }
                }

                this.x = cursorPosition.x;
                this.y = cursorPosition.y;
                this.userData.edges.forEach(item=>{adjust(item, item.userData.vertex[0], item.userData.vertex[1]);})
                _vertexgroup.children.forEach(item =>
                    {
                        sortAdgesByAngle(item);
                        alignToNext(item);
                    });
            }
            else 
            this.alpha = 1;
        }

        const corner = new PIXI.Graphics();
        corner.userData = {
            edges: [],
        }
        corner.lineStyle(2, 0x000000, 1);
        corner.beginFill(0xFFFFFF, 1);
        corner.drawCircle(0, 0, 8);
        corner.endFill();
        corner.x = position.x;
        corner.y = position.y;
        corner.interactive = true;
        corner
            .on('pointerover',()=> {
                showSelected(corner);
                //for(var i = 0; i<corner.userData.edges.length; i++) {
                  //  addText(corner.userData.edges[i],i);
                //}
                _vertexgroup.alpha = 1;
            })
            .on('pointerout',()=> {
                hideSelected(corner);
                _vertexgroup.alpha = 0;
            })
            .on('pointerupoutside', onDragEnd)
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd);
        _vertexgroup.addChild(corner);
        return corner;
    }

    function adjust(edge, startPosition, endPosition) {
        var initialpos = new PIXI.Point((startPosition.x+endPosition.x)/2, (startPosition.y+endPosition.y)/2);
        
        /*var one = new PIXI.Point();
        edge.localTransform.apply(new PIXI.Point(0,32),one);
        var vector = {x:one.x-edge.x, y:one.y-edge.y};
        var len = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
        var norm = {x:vector.x/len, y:vector.y/len};
        edge.position.x=initialpos.x+norm.x * edge.userData.offset;
        edge.position.y=initialpos.y+norm.y * edge.userData.offset;

        var eendPosition = new PIXI.Point(endPosition.x+norm.x * edge.userData.offset, endPosition.y+norm.y * edge.userData.offset);
*/
        var norm = new PIXI.Point(Math.cos(edge.rotation-Math.PI/2),Math.sin(edge.rotation-Math.PI/2));
        edge.position.x=initialpos.x+norm.x * edge.userData.offset;
        edge.position.y=initialpos.y+norm.y * edge.userData.offset;
        var eendPosition = new PIXI.Point(endPosition.x+norm.x * edge.userData.offset, endPosition.y+norm.y * edge.userData.offset);

        myLookAt(edge, eendPosition);
        var l = Math.sqrt((endPosition.x/64-startPosition.x/64)*(endPosition.x/64-startPosition.x/64)+(endPosition.y/64-startPosition.y/64)*(endPosition.y/64-startPosition.y/64));
        var deltaScale = edge.scale.x/l;
        edge.scale.x = l;
        edge.children.forEach(opening => {
            if(opening.name == "door" || opening.name == "window") {
                opening.scale.x = opening.scale.x*deltaScale;
            }
            
        })
    }

    function setActiveWallWidth(width) {
        _activeEdge.scale.y = width;
    }

	function sortAdgesByAngle(vertex) {
		vertex.userData.edges.sort(function(a,b) {
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

	function calculateAngle(vertex, edge) {
		if(edge.userData.vertex[0]==vertex) {
			return edge.rotation;
		}
		else {
			if(edge.rotation>0) return edge.rotation - Math.PI;
			else return edge.rotation+Math.PI;
		}
	}


	function alignAdges(vertex, edge1, edge2) {
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

        
            //CENTRAL ALIGN

            var left1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,0),left1);
            var right1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,0), right1);

            var left2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,0),left2);
            var right2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,0), right2);
			
			var intersection = checkLineIntersection(left1.x, left1.y, right1.x, right1.y, left2.x, left2.y, right2.x, right2.y);
			
            var intvectorc1 = new PIXI.Point(intersection.x,intersection.y);
            var intvectorc2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvectorc1,int1);
            edge1.children[4].x = int1.x; edge1.children[4].y = int1.y;
            edge1.userData.left = intvectorc1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvectorc2, int2);
            edge2.children[4].x = int2.x; edge2.children[4].y = int2.y;
            edge2.userData.left = intvectorc1;

            //

            redrawWallTest(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position,edge1.children[4].position,edge1.children[5].position);
            redrawWallTest(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position,edge2.children[4].position,edge2.children[5].position);

            //redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            //redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
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

            //CENTRAL ALIGN

            var left1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,0),left1);
            var right1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,0), right1);

            var left2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,0),left2);
            var right2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,0), right2);
			
			var intersection = checkLineIntersection(left1.x, left1.y, right1.x, right1.y, left2.x, left2.y, right2.x, right2.y);
			
            var intvectorc1 = new PIXI.Point(intersection.x,intersection.y);
            var intvectorc2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvectorc1,int1);
            edge1.children[4].x = int1.x; edge1.children[4].y = int1.y;
            edge1.userData.left = intvectorc1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvectorc2, int2);
            edge2.children[5].x = int2.x; edge2.children[5].y = int2.y;
            edge2.userData.right = intvectorc1;

            //

            redrawWallTest(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position,edge1.children[4].position,edge1.children[5].position);
            redrawWallTest(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position,edge2.children[4].position,edge2.children[5].position);


            //redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            //redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
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

            //CENTRAL ALIGN

            var left1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,0),left1);
            var right1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,0), right1);

            var left2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,0),left2);
            var right2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,0), right2);
			
			var intersection = checkLineIntersection(left1.x, left1.y, right1.x, right1.y, left2.x, left2.y, right2.x, right2.y);
			
            var intvectorc1 = new PIXI.Point(intersection.x,intersection.y);
            var intvectorc2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvectorc1,int1);
            edge1.children[5].x = int1.x; edge1.children[5].y = int1.y;
            edge1.userData.right = intvectorc1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvectorc2, int2);
            edge2.children[4].x = int2.x; edge2.children[4].y = int2.y;
            edge2.userData.left = intvectorc1;

            //

            redrawWallTest(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position,edge1.children[4].position,edge1.children[5].position);
            redrawWallTest(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position,edge2.children[4].position,edge2.children[5].position);


            //redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            //redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}
            
        if(edge1.userData.vertex[1]==vertex && edge2.userData.vertex[1]==vertex)
		{
            var one = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,-32),one);
            var three = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,-32), three);

            var oone = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,32),oone);
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


            //CENTRAL ALIGN

            var left1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(-32,0),left1);
            var right1 = new PIXI.Point();
            edge1.localTransform.apply(new PIXI.Point(32,0), right1);

            var left2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(-32,0),left2);
            var right2 = new PIXI.Point();
            edge2.localTransform.apply(new PIXI.Point(32,0), right2);
			
			var intersection = checkLineIntersection(left1.x, left1.y, right1.x, right1.y, left2.x, left2.y, right2.x, right2.y);
			
            var intvectorc1 = new PIXI.Point(intersection.x,intersection.y);
            var intvectorc2 = new PIXI.Point(intersection.x,intersection.y);

            var int1 = new PIXI.Point();
            edge1.localTransform.applyInverse(intvectorc1,int1);
            edge1.children[5].x = int1.x; edge1.children[5].y = int1.y;
            edge1.userData.right = intvectorc1;


            var int2 = new PIXI.Point();
            edge2.localTransform.applyInverse(intvectorc2, int2);
            edge2.children[5].x = int2.x; edge2.children[5].y = int2.y;
            edge2.userData.right = intvectorc1;

            //

            redrawWallTest(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position,edge1.children[4].position,edge1.children[5].position);
            redrawWallTest(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position,edge2.children[4].position,edge2.children[5].position);


            //redrawWall(edge1, 0x000000, edge1.children[0].position, edge1.children[2].position, edge1.children[3].position, edge1.children[1].position);
            //redrawWall(edge2, 0x000000, edge2.children[0].position, edge2.children[2].position, edge2.children[3].position, edge2.children[1].position);
		}
    }

    function alignOneself(vertex, edge) {
        if(edge.userData.vertex[0]==vertex) {
            var one = new PIXI.Point();
            var three = new PIXI.Point();
            edge.children[0].x = -32; edge.children[0].y = -32;
            edge.children[2].x = -32; edge.children[2].y = 32;

            edge.children[4].x = -32; //edge.children[5].x = 32;
            //redrawWall(edge, 0x000000, edge.children[0].position, edge.children[2].position, edge.children[3].position, edge.children[1].position);
            redrawWallTest(edge, 0x000000, edge.children[0].position, edge.children[2].position, edge.children[3].position, edge.children[1].position,edge.children[4].position,edge.children[5].position);
        }
        else {
            var one = new PIXI.Point();
            var three = new PIXI.Point();
            edge.children[1].x = 32; edge.children[0].y = -32;
            edge.children[3].x = 32; edge.children[2].y = 32;

            //edge.children[4].x = -32; 
            edge.children[5].x = 32;
            //redrawWall(edge, 0x000000, edge.children[0].position, edge.children[2].position, edge.children[3].position, edge.children[1].position);
            redrawWallTest(edge, 0x000000, edge.children[0].position, edge.children[2].position, edge.children[3].position, edge.children[1].position,edge.children[4].position,edge.children[5].position);
        }
    }


	function alignToNext(vertex)
	{
		if(vertex.userData.edges.length>1)
		{
			for(var i=0; i<vertex.userData.edges.length-1; i++)
			{
                var firstEdge = vertex.userData.edges[i];
                var secondEdge = vertex.userData.edges[i+1];
                var delta = firstEdge.rotation-secondEdge.rotation;
                //console.log(delta);
				if(delta!=0 && delta != Math.PI && delta != -Math.PI)alignAdges(vertex, firstEdge, secondEdge);
                else alignOneself(vertex, vertex.userData.edges[i]);
			}
            var firstEdge = vertex.userData.edges[vertex.userData.edges.length-1];
            var secondEdge = vertex.userData.edges[0];
            var delta = firstEdge.rotation-secondEdge.rotation;
            //console.log(delta);
            if(delta!=0 && delta != Math.PI && delta != -Math.PI)alignAdges(vertex, firstEdge, secondEdge);
            else alignOneself(vertex, vertex.userData.edges[vertex.userData.edges.length-1]);
		}
        if(vertex.userData.edges.length == 1) {
            alignOneself(vertex, vertex.userData.edges[0]);
        }
	}

	function raycastRainByPoints(points) {
        console.log(points);
		points.forEach(point => {
			if(point) {
                var origin = new PIXI.Point(point[0], point[1]);
                var screenCoords = new PIXI.Point(origin.x*app.stage.scale.x+app.stage.x, origin.y*app.stage.scale.y+app.stage.y);
                const circle = createCorner(origin);
                while(true) {
                    var intr = app.renderer.plugins.interaction.hitTest(screenCoords, _edgegroup);
                    if(!intr) break;
                    createWallBetween(intr.userData.vertex[0],circle);
                    createWallBetween(intr.userData.vertex[1],circle);
                    removeEdge(intr);
                }
		    }
		});
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


	function edgeIntersectionByVertex(vertex) {
		var points = [];
		if(vertex) {//заглушка
		vertex.userData.edges.forEach(edge => {
			var skippededges = edge.userData.vertex[1]?edge.userData.vertex[0].userData.edges.concat(edge.userData.vertex[1].userData.edges):edge.userData.vertex[0].userData.edges;
			_edgegroup.children.forEach(item => {
				if(!skippededges.includes(item)) points.push(lineSegmentsIntersect(edge, item));
			    });
		    });		
	    }
		return points;
	}

    function lineSegmentsIntersect(edge1, edge2)
	{
		var x1 = edge1.userData.vertex[0].position.x;
		var y1 = edge1.userData.vertex[0].position.y;
		var x2 = edge1.userData.vertex[1].position.x;
		var y2 = edge1.userData.vertex[1].position.y;
		var x3 = edge2.userData.vertex[0].position.x;
		var y3 = edge2.userData.vertex[0].position.y;
		var x4 = edge2.userData.vertex[1].position.x;
		var y4 = edge2.userData.vertex[1].position.y;
		var a_dx = x2 - x1;
		var a_dy = y2 - y1;
		var b_dx = x4 - x3;
		var b_dy = y4 - y3;
		var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
		var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
		return (s >= 0 && s <= 1 && t >= 0 && t <= 1) ? [x1 + t * a_dx, y1 + t * a_dy] : false;
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

    function myLookAt(object, target) {
        var dx = target.x - object.x;
        var dy = target.y - object.y;
		var rotation = Math.atan2(dy, dx);
		object.rotation = rotation;
	}

	function createWallBetween(vertex1, vertex2) {
        var wall = createWall((vertex1.x+vertex2.x)/2,(vertex1.y+vertex2.y)/2);
        wall.interactive = true;
        myLookAt(wall, vertex2);
        wall.scale.x = Math.sqrt((vertex1.x/64-vertex2.x/64)*(vertex1.x/64-vertex2.x/64)+(vertex1.y/64-vertex2.y/64)*(vertex1.y/64-vertex2.y/64));
        wall.userData = {};
        wall.userData.vertex = [vertex1,vertex2];
        vertex1.userData.edges.push(wall);
        vertex2.userData.edges.push(wall);
        return wall;
	}

    function createWallBetweenWidth(vertex1, vertex2, width, height, offset) {
        var wall = createWall((vertex1.x+vertex2.x)/2,(vertex1.y+vertex2.y)/2);
        wall.userData.width = width;
        wall.userData.height = height;
        wall.userData.offset = offset;
        wall.scale.y = width*0.01;
        wall.interactive = true;
        myLookAt(wall, vertex2);
        wall.scale.x = Math.sqrt((vertex1.x/64-vertex2.x/64)*(vertex1.x/64-vertex2.x/64)+(vertex1.y/64-vertex2.y/64)*(vertex1.y/64-vertex2.y/64));
        wall.userData.vertex = [vertex1,vertex2];
        vertex1.userData.edges.push(wall);
        vertex2.userData.edges.push(wall);
        return wall;
    }

    function getWallLength(wall) {
        return Math.round(wall.scale.x*100)/100;
    }

    function showLengthDiv(x,y) {
		var lengthDiv = document.createElement("div");
		lengthDiv.id = "walllength";
        lengthDiv.setAttribute('class' , "ruller");
		document.getElementById("canvas").appendChild(lengthDiv);
	}

	function moveLengthDiv(x,y, length) {
		var lengthDiv = document.getElementById("walllength");
		if(lengthDiv) {
		lengthDiv.style.top = (y-28)+'px';
		lengthDiv.style.left = (x-40)+'px';
		lengthDiv.innerText = Math.round(length*100)/100;
		}
	}

    function hideLengthDiv() {
        const el = document.getElementById("walllength");
	    if(el) el.remove();
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

    
    function updateSnapAxisArray(skippedvert) {
        let setx = new Set();
        let sety = new Set();
        _vertexgroup.children.forEach(vert => {
            if(vert!=skippedvert) {
                setx.add(vert.position.x);
                sety.add(vert.position.y);
            }
        });
        snapaxisx = setx;
        snapaxisy = sety;
    }


    function updateAxisHelpers(skippedvert) {
        axiscontainer.removeChild(...axiscontainer.children);
        updateSnapAxisArray(skippedvert);
        for(let pos of snapaxisx) {
            var line = new PIXI.Graphics();
            line.lineStyle(0.5,0xff0000);
            line.moveTo(pos,-320);
            line.lineTo(pos,320);
            axiscontainer.addChild(line);
        }
        for(let pos of snapaxisy) {
            var line = new PIXI.Graphics();
            line.lineStyle(0.5,0xff0000);
            line.moveTo(-1280, pos);
            line.lineTo(1280, pos);
            axiscontainer.addChild(line);
        }
    }


    function testLoadFromJson(projectData) {
        try {
            //let decoded = JSON.parse(projectData)
            let decoded = projectData;
            let points = new Set();
            decoded.walls.forEach(item =>{
                let p1 = JSON.stringify(item.p1);
                let p2 = JSON.stringify(item.p2);
                points.add(p1)
                points.add(p2)
            })
            let allPoints = []
            points.forEach(point => allPoints.push(JSON.parse(point)))
            let vertexes = []
            allPoints.forEach(item => vertexes.push(createCorner(item)));
            let walls = decoded.walls;
            walls.forEach(wall => {
                vertexes.forEach(vertex => {
                    if(vertex.x==wall.p1.x && vertex.y==wall.p1.y) {wall.p1 = vertex;}
                    if(vertex.x==wall.p2.x && vertex.y==wall.p2.y) {wall.p2 = vertex;}
                })
            })
            walls.forEach(wall => {
                let newwall = createWallBetweenWidth(wall.p1, wall.p2, wall.width, wall.height, wall.offset);
                wall.doors.forEach(door => spawnDoor(newwall,door));
                wall.windows.forEach(window => spawnWindow(newwall, window));
                adjust(newwall, newwall.userData.vertex[0], newwall.userData.vertex[1])
            });

            let columns = decoded.columns;
            columns.forEach(column => {
                var col = createColumn(column.position.x, column.position.y, column.scale.x);
                col.interactive = true;
            })

            let blocks = decoded.blocks;
            blocks.forEach(block => {
                var col = createBlock(block.position.x, block.position.y, block.scale.x);
                col.interactive = true;
            })
        }
        catch {
            alert('Not proper or damaged project file');
        }
    }



    function spawnDoor(loadedwall, loadeddoor) {

       


        function onDragStart(event) {
            if(currentMod == 1  && app.userData.canTranslate ) {
            this.data = event.data;
            this.dragging = true;
            app.canMove = 0;
            }
        }
        
        function onDragEnd() {
            if(currentMod == 1) {
            this.dragging = false;
            this.data = null;
            app.canMove = 1;
            }
        }
        
        function onDragMove(event) {
            if (this.dragging && currentMod == 1  && app.userData.canTranslate ) {
                if(this.parent==app.stage) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x;
                    if(this.parent == app.stage) this.y = newPosition.y;
    
                    var x = event.data.global.x, y = event.data.global.y; //screen
                    var screenCoords = new PIXI.Point(x,y);
                    var intr = app.renderer.plugins.interaction.hitTest(screenCoords, _edgegroup);
                    if(intr && intr!=this.parrent && intr!=this) {
                        this.scale.x = this.userData.scalex/intr.scale.x;
                        this.scale.y = this.userData.scaley/intr.scale.y;

                        this.setParent(intr);    
                        var pixiglobal = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage
                        var edgelocal = new PIXI.Point();
                        intr.localTransform.applyInverse(pixiglobal, edgelocal);
                        this.x = edgelocal.x;
                        this.y = 0;

                    }
                }
                else {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    var x = event.data.global.x, y = event.data.global.y; //screen
                    var screenCoords = new PIXI.Point(x,y);
                    var intr = app.renderer.plugins.interaction.hitTest(screenCoords, _edgegroup);
                    if(!intr) {
                        this.scale.x = this.userData.scalex;
                        this.scale.y = this.userData.scaley;

                        this.setParent(app.stage);
                        this.x = newPosition.x;
                        this.y = newPosition.y;
                    }
                    else {
                        if(intr==this.parent || intr==this) {
                            var e = {offsetX: event.data.global.x, offsetY: event.data.global.y};
                            var pixiglobal = consoleProject(e, this.parent);
                            var edgelocal = new PIXI.Point();
                            this.parent.localTransform.applyInverse(pixiglobal, edgelocal);
                            this.position.x = edgelocal.x;
                            this.y = 0;
                        }
                        else {
                            this.scale.x = this.userData.scalex/intr.scale.x;
                            this.scale.y = this.userData.scaley/intr.scale.y;

                            this.setParent(intr);    
                            var pixiglobal = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage
                            var edgelocal = new PIXI.Point();
                            intr.localTransform.applyInverse(pixiglobal, edgelocal);
                            this.x = edgelocal.x;
                            this.y = 0;
                        }
                    }
                }
            }
            else
                this.alpha = 1;
        }
        //const door = new PIXI.Graphics();
        const door = PIXI.Sprite.from('./Media/SVG/Door.svg');
        door.name = 'door';
        //door.anchor.set(0.5);
        door.pivot.x = 32;
        door.pivot.y = 0;
        //door.beginFill(0xFFFF00);
        door
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('touchstart',function(event) {
                console.log(timer);
                if (!timer) {
                    timer = setTimeout(function() {onlongtouchD(event);}, 2000);
                }      
             })
            
             .on('touchend',function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
             }) 
            .on('pointerover',(e) => {
            e.stopPropagation();
            })
            .on('rightclick',e => {
                e.stopPropagation();
                _activeEdge = door;
                showContextMenuDoor(e.data.global.x, e.data.global.y);
            });
            
        //door.drawRect(-32,-32,64,64);
        door.interactive = true;
        if(loadedwall){
            loadedwall.addChild(door);
            door.userData = {
                scalex: loadeddoor.scalex,
                scaley: loadeddoor.scaley,
                height: loadeddoor.height,
            }
            door.position.x = loadeddoor.x;
            door.scale.x = loadeddoor.scalex/loadedwall.scale.x;
            door.scale.y = loadeddoor.scaley/loadedwall.scale.y;

        }
        else {
            app.stage.addChild(door);
            door.userData = {
                scalex: 1,
                scaley: 1,
                height: 2,
            }
        }
        return door;
    }

    function onlongtouchD(event) { 
        console.log(timer);
        timer = null;
        if(app.userData.canTranslate)
        showContextMenuDoor(event.data.global.x, event.data.global.y);
    };

    function spawnWindow(loadedwall, loadedwindow) {

        

        function onDragStart(event) {
            if(currentMod == 1  && app.userData.canTranslate ) {
            this.data = event.data;
            this.dragging = true;
            app.canMove = 0;
            }
        }
        
        function onDragEnd() {
            if(currentMod == 1) {
            this.dragging = false;
            this.data = null;
            app.canMove = 1;
            }
        }
        
        function onDragMove(event) {
        if (this.dragging && currentMod == 1  && app.userData.canTranslate ) {
            if(this.parent==app.stage) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                if(this.parent == app.stage) this.y = newPosition.y;

                var x = event.data.global.x, y = event.data.global.y; //screen
                var screenCoords = new PIXI.Point(x,y);
                var intr = app.renderer.plugins.interaction.hitTest(screenCoords, _edgegroup);
                if(intr && intr!=this.parrent && intr!=this) {
                    this.scale.x = this.userData.scale/intr.scale.x;
                    this.scale.y = 1;

                    this.setParent(intr);    
                    var pixiglobal = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage
                    var edgelocal = new PIXI.Point();
                    intr.localTransform.applyInverse(pixiglobal, edgelocal);
                    //console.log(edgelocal);
                    this.x = edgelocal.x;
                    this.y = 0;

                }
            }
            else {
                const newPosition = this.data.getLocalPosition(this.parent);
                var x = event.data.global.x, y = event.data.global.y; //screen
                var screenCoords = new PIXI.Point(x,y);
                var intr = app.renderer.plugins.interaction.hitTest(screenCoords, _edgegroup);
                if(!intr) {
                    this.scale.x = this.userData.scale;
                    this.scale.y = 0.15;

                    this.setParent(app.stage);
                    this.x = newPosition.x;
                    this.y = newPosition.y;
                }
                else {
                    if(intr==this.parent || intr==this) {
                        var e = {offsetX: event.data.global.x, offsetY: event.data.global.y};
                        var pixiglobal = consoleProject(e, this.parent);
                        var edgelocal = new PIXI.Point();
                        this.parent.localTransform.applyInverse(pixiglobal, edgelocal);
                        this.position.x = edgelocal.x;
                        this.y = 0;
                    }
                    else {
                        this.scale.x = this.userData.scale/intr.scale.x;
                        this.scale.y = 1;

                        this.setParent(intr);    
                        var pixiglobal = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage
                        var edgelocal = new PIXI.Point();
                        intr.localTransform.applyInverse(pixiglobal, edgelocal);
                        this.x = edgelocal.x;
                        this.y = 0;
                    }
                }
            }
        }
        else
        this.alpha =1;
    }
        const door = new PIXI.Graphics();
        door.name = 'window';

        door.beginFill(0x555599);
        door
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('touchstart',function(event) {
                console.log(timer);
                if (!timer) {
                    timer = setTimeout(function() {onlongtouchW(event);}, 2000);
                }      
             })
            
             .on('touchend',function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
             }) 
            .on('pointerover',(e) => {
                e.stopPropagation();
                })
            .on('rightclick',e => {
                e.stopPropagation();
                _activeEdge = door;
                showContextMenuWindow(e.data.global.x, e.data.global.y);
            });
        door.drawRect(-32,-32,64,64);
        door.interactive = true;
        if(loadedwall){
            loadedwall.addChild(door);
            door.userData = {
                scale: loadedwindow.scale,
                height: loadedwindow.height,
                heightoffset: loadedwindow.heightoffset,
            }
            door.position.x = loadedwindow.x;
            door.scale.x = loadedwindow.scale/loadedwall.scale.x;
            door.scale.y = 1;
        }
        else {
            app.stage.addChild(door);
            door.scale.y = 0.15;
            door.userData = {
                scale: 1,
                height: 1.5,
                heightoffset: 0.8,
            }
        }
        return door;
    }

    function onlongtouchW(event) { 
        console.log(timer);
        timer = null;
        if(app.userData.canTranslate)
        showContextMenuWindow(event.data.global.x, event.data.global.y);
    };

    function removeOpening(opening) {
       const parent= opening.parent;
       parent.removeChild(opening);
       hideContextMenu();
    }

    function setStructureAlpha(value) {
        _edgegroup.alpha = +value/10;
        _floorgroup.alpha = +value/10;
        _columngroup.alpha = +value/10;
        _blockgroup.alpha = +value/10;
    }

    activate();
    this.activate = activate;
    this.deactivate = deactivate;
    this.setMod = setMod;
    this.setWallType = setWallType;
    this.spawnDoor = spawnDoor;
    this.spawnWindow = spawnWindow;
    this.testLoadFromJson = testLoadFromJson;
    this.setStructureAlpha = setStructureAlpha;

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


function decimalAdjust(value, exp) {
    value = +value;
    exp = +exp;
    value = value.toString().split('e');
    value = Math['round'](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  function wallMenu(x,y){
    return `
    <div id="menu" class="objct_settings" style="position: absolute; top: ${y+"px"}; left: ${x+"px"};">
        <div style="width: 100%; align-items: center; display: flex; justify-content: start;">
            <button class="button_float" id="deleteobject">
                <img class="wall-icon" src="./Media/SVG/Bin.svg">
            </button>
            <button class="button_float" id="closeMenu">
                <img class="wall-icon" src="./Media/SVG/Cross.svg">
            </button>
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/width.svg">        
            <input class="xyz_input" type="number" id="sizeSet" value="0.15">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/offset.svg">        
            <input class="xyz_input" type="number" id="offset" value="0">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/height.svg">        
            <input class="xyz_input" type="number" id="heightSet" value="0.15">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/width.svg">        
            <input class="xyz_input" type="number" id="lengthSet" value="0.15">
        </div>
    </div>    
`
}


function columnMenu(x,y){
    return `
    <div id="menu" class="objct_settings" style="position: absolute; top: ${y+"px"}; left: ${x+"px"};">
        <div style="width: 100%; align-items: center; display: flex; justify-content: start;">
            <button class="button_float" id="deleteobject">
                <img class="wall-icon" src="./Media/SVG/Bin.svg">
            </button>
            <button class="button_float" id="closeMenu">
                <img class="wall-icon" src="./Media/SVG/Cross.svg">
            </button>
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/width.svg">        
            <input class="xyz_input" type="number" id="sizeSet" value="0.15">
        </div>
    </div>    
`
}

function squareMenu(x,y){
    return `
    <div id="menu" class="objct_settings" style="position: absolute; top: ${y+"px"}; left: ${x+"px"};">
        <div style="width: 100%; align-items: center; display: flex; justify-content: start;">
            <button class="button_float" id="deleteobject">
                <img class="wall-icon" src="./Media/SVG/Bin.svg">
            </button>
            <button class="button_float" id="closeMenu">
                <img class="wall-icon" src="./Media/SVG/Cross.svg">
            </button>
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/width.svg">        
            <input class="xyz_input" type="number" id="sizeSetx" value="0.15">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/height.svg">        
            <input class="xyz_input" type="number" id="sizeSety" value="0.15">
        </div>
    </div>    
`
}


function doorMenu(x,y){
    return `
    <div id="menu" class="objct_settings" style="position: absolute; top: ${y+"px"}; left: ${x+"px"};">
        <div style="width: 100%; align-items: center; display: flex; justify-content: start;">
            <button class="button_float" id="deleteobject">
                <img class="wall-icon" src="./Media/SVG/Bin.svg">
            </button>
            <button class="button_float" id="closeMenu">
                <img class="wall-icon" src="./Media/SVG/Cross.svg">
            </button>
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/width.svg">        
            <input class="xyz_input" type="number" id="doorSize" value="0.15">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/height.svg">        
            <input class="xyz_input" type="number" id="doorheight" value="0.15">
        </div>
        <div style="width: 100%; align-items: center; display: flex; justify-content: start;">
        <button class="button_float" id="doorSide">
                <img class="wall-icon" src="./Media/SVG/SimpVert.svg">
            </button>
            <button class="button_float" id="cornerSide">
                <img class="wall-icon" src="./Media/SVG/SimpHor.svg">
            </button>
        </div>
    </div>    
`
}


function windowMenu(x,y){
    return `
    <div id="menu" class="objct_settings" style="position: absolute; top: ${y+"px"}; left: ${x+"px"};">
        <div style="width: 100%; align-items: center; display: flex; justify-content: start;">
            <button class="button_float" id="deleteobject">
                <img class="wall-icon" src="./Media/SVG/Bin.svg">
            </button>
            <button class="button_float" id="closeMenu">
                <img class="wall-icon" src="./Media/SVG/Cross.svg">
            </button>
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/width.svg">        
            <input class="xyz_input" type="number" id="doorSize" value="0.15">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/height.svg">        
            <input class="xyz_input" type="number" id="doorheight" value="0.15">
        </div>
        <div style="width: 158px; height: 50px; align-items: center; display: flex; justify-content: space-around;   background-color: #fDfDfD;  border: 0.5px solid  black;">
            <img class="wall-icon" src="./Media/SVG/windHeight.svg">        
            <input class="xyz_input" type="number" id="doorground" value="0.15">
        </div>
    </div>    
`
}