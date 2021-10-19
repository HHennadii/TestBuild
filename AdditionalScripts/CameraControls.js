var CameraControls = function(app, _domElement, grid)
{
    var lastPos = null;
    var ongoingTouches = [];

    function zoom(s,x,y)
    {
        s = s > 0 ? 0.9 : 1.1;
        var worldPos = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
        var newScale = {x: app.stage.scale.x * s, y: app.stage.scale.y * s};
        var newScreenPos = {x: (worldPos.x ) * newScale.x + app.stage.x, y: (worldPos.y) * newScale.y + app.stage.y};
        app.stage.x -= (newScreenPos.x-x) ;
        app.stage.y -= (newScreenPos.y-y) ;
        document.getElementById('scale2D').value= newScale.x;
        app.stage.scale.x = newScale.x;
        app.stage.scale.y = newScale.y;

        if(app.stage.scale.x>10)
        {
          app.stage.scale.x = 10; app.stage.scale.y = 10;
        }
        if(app.stage.scale.x<0.3)
        {
          app.stage.scale.x = 0.3; app.stage.scale.y = 0.3;
        }
        //scaleGrid();
    }

    function zoom2(s,x,y)
    {
        var worldPos = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
        var newScale = {x: s, y: s};
        var newScreenPos = {x: (worldPos.x ) * newScale.x + app.stage.x, y: (worldPos.y) * newScale.y + app.stage.y};
        app.stage.x -= (newScreenPos.x-x) ;
        app.stage.y -= (newScreenPos.y-y) ;
        app.stage.scale.x = newScale.x;
        app.stage.scale.y = newScale.y;
    }


    function scaleGrid()
    {
      var appscale = Math.floor(app.stage.scale.x);
      console.log(appscale);
      if(appscale!=0)
      {
        if(appscale>5)
        {
          grid.scale.x = 0.1;
          grid.scale.y = 0.1;
          console.log(grid.scale);
        }
        if(appscale<=5 && appscale>=1)
        {
          grid.scale.x = 1;
          grid.scale.y = 1;
        }
      }
      else
      {
        grid.scale.x = 10;
        grid.scale.y = 10;
        console.log(app.stage.scale.x);
      }
    }


    function activate()
    {
		_domElement.addEventListener( 'pointermove', onPointerMove );
	
    _domElement.addEventListener( 'touchend', onTouchEnd );
    _domElement.addEventListener( 'touchstart', onTouchStart );
    _domElement.addEventListener( 'touchmove', onTouchMove );

		_domElement.addEventListener( 'pointerdown', onPointerDown );
     

		_domElement.addEventListener( 'pointerup', onPointerCancel );
		

		_domElement.addEventListener( 'pointerleave', onPointerCancel );
        _domElement.addEventListener( 'mousewheel', onMouseWheel );
    }

   
 

    function deactivate()
    {
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
        _domElement.removeEventListener( 'mousewheel', onMouseWheel );
        _domElement.style.cursor = ''; 
    }

    function onPointerDown(e)
    { 
		if(e.button == 0 && document.getElementById("rulet").value == 1)
        { 
		e.preventDefault();
        lastPos = {x:e.offsetX,y:e.offsetY};
        }
    }

    function onTouchStart(e)
    {   
        if (document.getElementById("rulet").value == 1)
        { 
        var touches = e.changedTouches;
        ongoingTouches.push(touches[0]);
        lastPos = {x: touches[0].pageX, y: touches[0].pageY}
        }
    }


    function onPointerMove(e)
    {
        if(lastPos && document.getElementById("rulet").value == 1){
            app.stage.x += (e.offsetX-lastPos.x);
            app.stage.y += (e.offsetY-lastPos.y);  
            lastPos = {x:e.offsetX,y:e.offsetY};
          }
    }

    function onTouchMove(e)
    {   
        if(lastPos  && document.getElementById("rulet").value == 1){
            var touches = e.changedTouches;
            app.stage.x += (touches[0].pageX-lastPos.x);
            app.stage.y += (touches[0].pageY-lastPos.y);  
            lastPos = {x:touches[0].pageX,y:touches[0].pageY};
        }
    }

    function onTouchEnd(e)
    {   
        if (document.getElementById("rulet").value == 1)
        {
        lastPos = null;
        }
    }

    function onPointerCancel(e)
    { 
      if (document.getElementById("rulet").value == 1)
        {
        e.preventDefault();
        lastPos = null;
        }
    }

    function onMouseWheel(e)
    {
        zoom(e.deltaY, e.offsetX, e.offsetY);
    }

    document.getElementById('scale2D').addEventListener ('input', ()=>{
      zoom2(document.getElementById('scale2D').value, _domElement.getBoundingClientRect().width/2, _domElement.getBoundingClientRect().height/2);
    });

    activate();
    this.activate = activate;
    this.deactivate = deactivate;

};

export { CameraControls };