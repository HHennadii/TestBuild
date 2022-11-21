var FloorDrawer = function(app, _floorgroup, _vertexgroup, axiscontainer, _domElement)
{
    var isdrawing = false;

    var _activeFloor = null;
    var clickTimer = null;

    var floor = null;

    var menuDiv = null;
    var timer;

    var snapaxisx, snapaxisy;

    function activate()
    {
        _domElement.addEventListener('pointermove', onPointerMove);
        _domElement.addEventListener('pointerdown', onPointerDown);
        //_domElement.addEventListener('pointerup', onPointerCancel);
        //_domElement.addEventListener('pointerleave', onPointerCancel);
    }

    function deactivate()
    {
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
        /*
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.style.cursor = '';  */
    }

    function onPointerDown(event)
    {
        if(event.button == 0)
        {
            var x = event.offsetX, y = event.offsetY; //screen
            var cursorPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y}; //pixistage            
            var startPosition = {x:cursorPosition.x, y:cursorPosition.y};
            if(app.userData.snapvert) {
                var closestaxis;
                var disttoaxis = 10000;
                for(let posx of snapaxisx) {
                    if(Math.abs(cursorPosition.x-posx)<disttoaxis) {
                        disttoaxis = Math.abs(cursorPosition.x-posx);
                        closestaxis = posx;
                    }
                    if(disttoaxis<32) {
                        startPosition.x = closestaxis;
                    }
                }
                disttoaxis = 10000;
                for(let posy of snapaxisy) {
                    if(Math.abs(cursorPosition.y-posy)<disttoaxis) {
                        disttoaxis = Math.abs(cursorPosition.y-posy);
                        closestaxis = posy;
                    }
                    if(disttoaxis<32) {
                        startPosition.y = closestaxis;
                    }
                }
            }
            if(!isdrawing)
            {
                isdrawing = true;
                function onDragStart(event) {
                    if([0,1,6].includes(app.userData.mod) && app.userData.canTranslate )
                    {
                    var initial = new PIXI.Point(this.x, this.y);
                    var point = event.data.getLocalPosition(this.parent);
                    this.delta = {x: point.x-initial.x, y: point.y-initial.y};
                    app.canMove = 0;
                    this.data = event.data;
                    this.alpha = 0.5;
                    this.dragging = true;
                    }
                }
                
                function onDragEnd() {
                    this.alpha = 1;
                    this.dragging = false;
                    this.data = null;
                    app.canMove = 1;
                    hideLengthDiv();
                }
                
                function onDragMove(event) {
                    if (this.dragging && app.userData.canTranslate ) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x - this.delta.x;
                    this.y = newPosition.y - this.delta.y;
                    hideLengthDiv();
                    }
                    else
				        this.alpha = 1;
                }
                function onPointerOver(e) {
                    var sum=0;
                    const vertexes = this.children;
                    for(var i=0; i<vertexes.length-1; i++) {
                        sum+=vertexes[i].x*vertexes[i+1].y - vertexes[i].y*vertexes[i+1].x;
                    }
                    sum+=vertexes[vertexes.length-1].x*vertexes[0].y - vertexes[vertexes.length-1].y*vertexes[0].x;
                    sum = Math.abs(sum);
                    showLengthDiv(e.data.global.x+100, e.data.global.y);
                    moveLengthDiv(e.data.global.x+100, e.data.global.y, sum/2/4096);
                }
        
                function onPointerOut() {
                    hideLengthDiv();
                }
            
                floor = new PIXI.Graphics();
                floor.on('rightclick',function(event){
                    showContextMenu2(event.data.global.x, event.data.global.y);
                    _activeFloor = this;
                })
                floor.on('touchstart',function(event) {
                var sum=0;
                const vertexes = this.children;
                for(var i=0; i<vertexes.length-1; i++) {
                    sum+=Math.abs(vertexes[i].x*vertexes[i+1].y - vertexes[i].y*vertexes[i+1].x);
                }
                //showLengthDiv(event.data.global.x+100, event.data.global.y);
                //moveLengthDiv(event.data.global.x+100, event.data.global.y, sum/2/4096);
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
                 .on('pointerdown', onDragStart)
                 .on('pointermove', onDragMove)
                 .on('pointerup', onDragEnd)
                 .on('pointerupoutside', onDragEnd)
                 .on('pointerover', onPointerOver)
                 .on('pointerout', onPointerOut);

                _floorgroup.addChild(floor);
                var startVertex = createCorner(startPosition, floor);
                //startVertex.alpha = 0;
                floor.pointsarray = [];
                floor.pointsarray.push(startVertex);
            }
            else
            {
                floor.pointsarray[floor.pointsarray.length-1].interactive = true;
                //createCorner(startPosition);
                var vert = createCorner(startPosition, floor);
                //vert.alpha = 0;
                floor.pointsarray.push(vert);
                drawPath(floor.pointsarray,floor,1);
            }
        }
    }

    function onlongtouch(event) { 
        console.log(timer);
        timer = null;
		if(app.userData.canTranslate)
        showContextMenu2(event.data.global.x, event.data.global.y);
    };

    function showLengthDiv(x,y) {
		var lengthDiv = document.createElement("div");
		lengthDiv.id = "floorarea";
        lengthDiv.setAttribute('class' , "ruller");
		document.getElementById("canvas").appendChild(lengthDiv);
	}

	function moveLengthDiv(x,y, length) {
		var lengthDiv = document.getElementById("floorarea");
		if(lengthDiv) {
		lengthDiv.style.top = (y-28)+'px';
		lengthDiv.style.left = (x-40)+'px';
		lengthDiv.innerText = Math.round(length*100)/100;
		}
	}

    function hideLengthDiv() {
        const el = document.getElementById("floorarea");
	    if(el) el.remove();
    }

    function onPointerMove(event)
    {
        if(app.userData.snapvert) updateAxisHelpers();
        if(isdrawing)
        {
            var x = event.offsetX, y = event.offsetY;
            var position =  {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
            var tmparr = [...floor.pointsarray];
            tmparr.push(position);
            drawPath(tmparr,floor,1);
        }
    }

    function removeActiveFloor()
    {
        _floorgroup.removeChild(_activeFloor);
        document.getElementById("menu").remove();
    }

    function onPointerCancel(event)
    {

    }

    function createFloor() {
        function onDragStart(event) {
            var initial = new PIXI.Point(this.x, this.y);
            var point = event.data.getLocalPosition(this.parent);
            this.delta = {x: point.x-initial.x, y: point.y-initial.y};
            app.canMove = 0;
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        }
        
        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            app.canMove = 1;
        }
        
        function onDragMove(event) {
            if (this.dragging) {
            hideLengthDiv();
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x - this.delta.x;
            this.y = newPosition.y - this.delta.y;
            }
        }
        function onPointerOver(e) {
            var sum=0;
            const vertexes = this.children;
            for(var i=0; i<vertexes.length-1; i++) {
                sum+=Math.abs(vertexes[i].x*vertexes[i+1].y - vertexes[i].y*vertexes[i+1].x);
            }
            showLengthDiv(e.data.global.x+100, e.data.global.y);
            moveLengthDiv(e.data.global.x+100, e.data.global.y, sum/2/4096);
        }

        function onPointerOut() {
            hideLengthDiv();
        }
    
        floor = new PIXI.Graphics();
        floor.on('rightclick',function(event){
            showContextMenu2(event.data.global.x, event.data.global.y);
            _activeFloor = this;
        })
        floor.on('touchstart',function(event) {
            if (clickTimer == null) {
                clickTimer = setTimeout(function () {
                clickTimer = null;}, 500)
            } else {
                clearTimeout(clickTimer);
                clickTimer = null;
                showContextMenu2(event.data.global.x, event.data.global.y);
                _activeFloor = this;
               // hideLengthDiv();
            }
         })
         .on('pointerdown', onDragStart)
         .on('pointermove', onDragMove)
         .on('pointerup', onDragEnd)
         .on('pointerupoutside', onDragEnd)
         .on('pointerover', onPointerOver)
         .on('pointerout', onPointerOut);

        _floorgroup.addChild(floor);
        floor.pointsarray = [];
        return floor;
    }

    function createCorner(position, floor)
    {
        function onDragStart(event)
        {
            event.stopPropagation();
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            app.canMove = 0;
        }

        function onTouchStart(event) {
            event.stopPropagation();
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            this.alpha = 1;
            app.canMove = 0;
        }

        function onTouchEnd() {
            this.dragging = false;
            this.data = null;
            this.parent.children.forEach(ch => {
                ch.alpha = 0;
            })
            app.canMove = 1;
        }
        
        function onDragEnd()
        {
            this.dragging = false;
            this.data = null;
            app.canMove = 1;
        }
        
        function onDragMove(event)
        {
            if(this.dragging)
            {
                if(app.userData.snapvert) updateAxisHelpers(this);
                else axiscontainer.removeChild(...axiscontainer.children);
            var newPosition = this.data.getLocalPosition(this.parent);
            var x = event.data.global.x,  y = event.data.global.y;
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
                        newPosition.x = closestaxis-this.parent.x;
                    }
                }
                disttoaxis = 10000;
                for(let posy of snapaxisy) {
                    if(Math.abs(cursorPosition.y-posy)<disttoaxis) {
                        disttoaxis = Math.abs(cursorPosition.y-posy);
                        closestaxis = posy;
                    }
                    if(disttoaxis<32) {
                        newPosition.y = closestaxis-this.parent.y;
                    }
                }
            }

            this.x = newPosition.x;
            this.y = newPosition.y;
            drawPath(this.parent.pointsarray,this.parent,0);  
            }
        }

        function onPointerOver() {
            this.alpha = 1;
            //this.parent.children.forEach(ch => {
            //    ch.alpha = 1;
            //})
        }

        function onPointerOut() {
            this.parent.children.forEach(ch => {
                ch.alpha = 0;
            })
        }

        const corner = new PIXI.Graphics();
        corner.lineStyle(10, 0x000000, 1);
        corner.beginFill(0x6666FF, 1);
        corner.drawCircle(0, 0, 10);
        corner.endFill();
        corner.x = position.x;
        corner.y = position.y;
        corner.interactive = false;
        corner
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointerover', onPointerOver)
            .on('pointerout', onPointerOut)
            .on('touchstart', onTouchStart)
            .on('touchend', onTouchEnd)
            .on('touchendoutside', onTouchEnd)

        floor.addChild(corner);
        return corner;
    }



    function hideContextMenu() {
		document.getElementById("menu").remove();
	}


    function showContextMenu2(x,y)
	{
		if(menuDiv!=null) menuDiv.remove();
		menuDiv = document.createElement("div");
		var indiv = document.createElement("div");
		var but3 = document.createElement("button");
        var but4 = document.createElement("button");
		var img1 = document.createElement("img");
        var img3 = document.createElement("img");

		menuDiv.id="menu";
        menuDiv.setAttribute("class",  "objct_settings");
		menuDiv.style.position = "absolute";
		menuDiv.style.top = y+'px';
		menuDiv.style.left = 30+x+'px';

		indiv.setAttribute("style",  "width: 100%; align-items: center; display: flex; justify-content: start;");
		
        
		
        but3.setAttribute( 'class', "button_float" );
		but3.addEventListener( 'click', hideContextMenu ); 

        but4.setAttribute( 'class', "button_float" );
		but4.addEventListener( 'click',  removeActiveFloor ); 
       
        img1.setAttribute('class' , "bar-icon");
        img1.setAttribute('src' , "./Media/SVG/Cross.svg");

        img3.setAttribute('class' , "bar-icon");
        img3.setAttribute('src' , "./Media/SVG/Bin.svg");

		
		menuDiv.appendChild(indiv);
		indiv.appendChild(but4);
        indiv.appendChild(but3);
        but4.appendChild(img3);
        but3.appendChild(img1);

		document.body.appendChild(menuDiv);
	}


    function drawPath(points,graph,line)
    {
        graph.clear();
        if(line) graph.lineStyle(2,0x000000);
        else graph.lineStyle(0,0x000000);
        graph.beginFill(0xbbbbbb);
        graph.moveTo(points[0].x, points[0].y);
        for(var i = 1; i<points.length; i++)
        {
            graph.lineTo(points[i].x, points[i].y);
        }
        graph.lineTo(graph.pointsarray[0].x,graph.pointsarray[0].y);
        graph.endFill();
    }


    function testLoadFromJson(projectData) {
        try {
            //let decoded = JSON.parse(projectData)
            let decoded = projectData.floors;
            decoded.forEach(floor => {
                var loadedfloor = createFloor();
                loadedfloor.x = floor.position.x;
                loadedfloor.y = floor.position.y;
                floor.pointsarray.forEach(point => {
                    loadedfloor.pointsarray.push(createCorner({x:point.x, y:point.y}, loadedfloor));
                })
                _floorgroup.addChild(loadedfloor);
                drawPath(loadedfloor.pointsarray, loadedfloor, 0);
                loadedfloor.interactive = true;

                loadedfloor.pointsarray.forEach(pnh => {
                    pnh.interactive = true;
                    pnh.alpha = 0;
                })
            })
        }
        catch {
            alert('Not proper or damaged project file');
        }
    }


    document.addEventListener('keydown',event=>{
        if(event.code == "Escape" && isdrawing)
        {
        drawPath(floor.pointsarray,floor,0);
        floor.interactive = true;

        floor.pointsarray.forEach(pnh => {
            pnh.interactive = true;
            pnh.alpha = 0;
        })
        floor = null;
        isdrawing = false;
        }
    });

    function closeFigure() {
        if(isdrawing) {
            drawPath(floor.pointsarray,floor,0);
            floor.interactive = true;
    
            floor.pointsarray.forEach(pnh => {
                pnh.interactive = true;
                pnh.alpha = 0;
            })
            floor = null;
            isdrawing = false;
        }
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




    //activate();
    this.activate = activate;
    this.deactivate = deactivate;
    this.testLoadFromJson = testLoadFromJson;
    this.closeFigure = closeFigure;
};


export { FloorDrawer };