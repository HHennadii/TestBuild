var FloorDrawer = function(app, _floorgroup, _domElement)
{
    var startPosition = null;
    var startVertex = null;
    var pointsarray=[];

    var isdrawing = false;

    var _activeFloor = null;
    var clickTimer = null;

    var floor = null;

    var menuDiv = null;
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

            if(!startVertex)
            {
                floor = new PIXI.Graphics();
                floor.on('rightclick',function(event){
                    showContextMenu2(event.data.global.x, event.data.global.y);
                    _activeFloor = floor;
                })
                floor.on('touchstart',function(event) {
                    if (clickTimer == null) {
                        clickTimer = setTimeout(function () {
                        clickTimer = null;}, 500)
                        console.log(clickTimer);
                    } else {
                        console.log(clickTimer);
                        clearTimeout(clickTimer);
                        clickTimer = null;
                        console.log(clickTimer);
                        showContextMenu2(event.data.global.x, event.data.global.y);
                        _activeFloor = floor;
                    }
                 })

                _floorgroup.addChild(floor);
                isdrawing = true;
                pointsarray.length = 0;
                var x = event.offsetX, y = event.offsetY;
                startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                startVertex = createCorner(startPosition, floor);
                startVertex.alpha = 0;
                pointsarray.push(startVertex);
            }
            else
            {
                var x = event.offsetX, y = event.offsetY;
                startPosition =  {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
                pointsarray[pointsarray.length-1].interactive = true;
                var vert = createCorner(startPosition, floor);
                vert.alpha = 0;
                pointsarray.push(vert);
                drawPath(pointsarray,floor,1);
            }
        }
    }


    function onPointerMove(event)
    {
        if(isdrawing)
        {
            console.log('moving');
            var x = event.offsetX, y = event.offsetY;
            var position =  {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
            var tmparr = [...pointsarray];
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

    function createCorner(position)
    {
        /*function onDragStart(event)
        {
            if(!isdrawing)
            {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            }
        }
        
        function onDragEnd()
        {
            if(!isdrawing)
            {
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
            }
        }
        
        function onDragMove()
        {
            if(!isdrawing)
            {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
            }
        }*/


        const corner = new PIXI.Graphics();
        corner.lineStyle(10, 0x000000, 1);
        corner.beginFill(0x6666FF, 1);
        corner.drawCircle(0, 0, 10);
        corner.endFill();
        corner.x = position.x;
        corner.y = position.y;
        corner.interactive = false;
        corner
            //.on('pointerdown', onDragStart)
            //.on('pointermove', onDragMove)
            //.on('pointerup', onDragEnd)
            .on('pointerup', ()=>
            {
                    if(corner==startVertex)
                    {
                        //startPosition = corner.position;
                        startVertex = null;
                        isdrawing = false;
                    }
            })
            .on('pointerover',()=>
            {
                if(corner == startVertex)
                {

                }
            })
        floor.addChild(corner);
        return corner;
    }



    function hideContextMenu()
	{
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
        img1.setAttribute('src' , "./Icons/Cross.svg");

        img3.setAttribute('class' , "bar-icon");
        img3.setAttribute('src' , "./Icons/Bin.svg");

		
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
        graph.lineTo(pointsarray[0].x,pointsarray[0].y);
        graph.endFill();
    }

    function myPolygon(graphics, path)
    {
        graphics.beginFill(0x664422 , 1);
        graphics.lineStyle(10, 0x000000, 1,0.5,true);
        graphics.moveTo(path[0]);
        for(var i = 1; i<path.length; i++)
        {
            graphics.lineTo(path[i]);
        }
        graphics.lineTo(path[0]);
        graphics.endFill();
    }


    document.addEventListener('keydown',event=>{
        if(event.code == "Escape" && isdrawing)
        {
        console.log(pointsarray);
        drawPath(pointsarray,floor,0);
        pointsarray.length = null;
        isdrawing = false;
        floor.interactive = true;
        startVertex = null;
        }
    });

    document.getElementById('radio-floor').addEventListener('click',()=>
    {
        if(isdrawing)
        {
        console.log(pointsarray);
        drawPath(pointsarray,floor,0);
        pointsarray.length = null;
        isdrawing = false;
        floor.interactive = true;
        startVertex = null;
        }
    });



    activate();
    this.activate = activate;
    this.deactivate = deactivate;
};


export { FloorDrawer };