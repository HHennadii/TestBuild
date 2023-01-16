var CameraControls = function(app, _domElement, grid)
{
    var lastPos = null;
    var ongoingTouches = [];
    var scaling =false, carrentScale;
    function zoom(s,x,y) {
        s = s > 0 ? 0.9 : 1.1;
        if(app.stage.scale.x > 4 && s == 1.1) s = 1;
        if(app.stage.scale.x < 0.25 && s == 0.9) s = 1;
        var worldPos = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
        var newScale = {x: app.stage.scale.x * s, y: app.stage.scale.y * s};
        var newScreenPos = {x: (worldPos.x ) * newScale.x + app.stage.x, y: (worldPos.y) * newScale.y + app.stage.y};
        app.stage.x -= (newScreenPos.x-x) ;
        app.stage.y -= (newScreenPos.y-y) ;
        app.stage.scale.x = newScale.x;
        app.stage.scale.y = newScale.y;
        scaleGrid();
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


    function scaleGrid() {
      var appscale = app.stage.scale.x;
      if(appscale>0 && appscale<1) {
        grid.scale.x = 5;
        grid.scale.y = 5;
      }
      if(appscale>=1) {
        grid.scale.x = 1;
        grid.scale.y = 1;
      }
    }


    function activate() {
      _domElement.addEventListener( 'mousemove', onPointerMove );
      _domElement.addEventListener( 'touchend', onTouchEnd );
      _domElement.addEventListener( 'touchstart', onTouchStart );
      _domElement.addEventListener( 'touchmove', onTouchMove );
      _domElement.addEventListener( 'mousedown', onPointerDown );
      _domElement.addEventListener( 'pointerup', onPointerCancel );
      _domElement.addEventListener( 'pointerleave', onPointerCancel );
      _domElement.addEventListener( 'wheel', onMouseWheel );
    }

   
 

    function deactivate() {
      _domElement.removeEventListener( 'mousemove', onPointerMove );
      _domElement.removeEventListener( 'touchend', onTouchEnd );
      _domElement.removeEventListener( 'touchstart', onTouchStart );
      _domElement.removeEventListener( 'touchmove', onTouchMove );
      _domElement.removeEventListener( 'pointerdown', onPointerDown );
      _domElement.removeEventListener( 'pointerup', onPointerCancel );
      _domElement.removeEventListener( 'pointerleave', onPointerCancel );
      _domElement.removeEventListener( 'wheel', onMouseWheel );
      _domElement.style.cursor = ''; 
    }




    function onPointerDown(e) {
      //console.log(app.canMove);
//		if(e.button == 1 && app.canMove == 1 && ![1,2,3,4,5].includes(app.userData.mod))
    if(e.button == 1 && app.canMove == 1 && ![1].includes(app.userData.mod))

        {
          document.getElementById('canvas').style.cursor = 'move';
		      e.preventDefault();
        lastPos = {x:e.offsetX,y:e.offsetY};
        }
    }

    function onTouchStart(e)
    {   
      if (e.touches.length === 2) {
        scaling = true;
        app.userData.canTranslate = false;
        pinchStart(e);
      }
        if (app.canMove == 1 && ![1,2,3,4,5].includes(app.userData.mod) && e.touches.length === 1)
        { 
        var touches = e.changedTouches;
        ongoingTouches.push(touches[0]);
        lastPos = {x: touches[0].pageX, y: touches[0].pageY}
        }
    }


    function onPointerMove(e)
    {
        if(lastPos && app.canMove == 1 && !e.touches){
            app.stage.x += (e.offsetX-lastPos.x);
            app.stage.y += (e.offsetY-lastPos.y);  
            lastPos = {x:e.offsetX,y:e.offsetY};
          }
    }

    function onTouchMove(e)
    {   
      if (scaling  && e.touches.length === 2) {
        pinch(e);
    }
        if(lastPos  && app.canMove == 1 && e.touches.length === 1){
            var touches = e.changedTouches;
            app.stage.x += (touches[0].pageX-lastPos.x);
            app.stage.y += (touches[0].pageY-lastPos.y);  
            lastPos = {x:touches[0].pageX,y:touches[0].pageY};
        }
    }

    function onTouchEnd(e)
    {   
      app.userData.canTranslate = true;
      if (scaling  && e.touches.length === 2) {
        pinch(e);
        scaling = false;
    }
        if (app.canMove == 1  && e.touches.length === 1)
        {
        lastPos = null;
        }
    }

    function pinchStart(e) {
      carrentScale=app.stage.scale.x/Math.hypot(e.touches[0].pageX - e.touches[1].pageX,e.touches[0].pageY - e.touches[1].pageY);
    }
    function pinch(e) {
      let zoomfactor=carrentScale*Math.hypot(e.touches[0].pageX - e.touches[1].pageX,e.touches[0].pageY - e.touches[1].pageY);
      zoomfactor = zoomfactor<0.3 ? 0.3 : zoomfactor;
      zoomfactor = zoomfactor>3 ? 3 : zoomfactor;
      zoom2(zoomfactor, _domElement.getBoundingClientRect().width/2, _domElement.getBoundingClientRect().height/2);
    }

    function onPointerCancel(e) { 
      if (app.canMove == 1) {
          document.getElementById('canvas').style.cursor = 'default';
          e.preventDefault();
        lastPos = null;
        }
    }

    function onMouseWheel(e) {
        zoom(e.deltaY, e.offsetX, e.offsetY);
    }

  

    activate();
    this.activate = activate;
    this.deactivate = deactivate;

};

export { CameraControls };