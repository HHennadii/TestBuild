var RulerTool = function(app, _domElement)
{
    var startPosition = null;
    var endPosition = null;
    var ruler = null;

    function activate()
    {
		_domElement.addEventListener( 'pointermove', onPointerMove );
		_domElement.addEventListener( 'pointerdown', onPointerDown );
		_domElement.addEventListener( 'pointerup', onPointerCancel );
		_domElement.addEventListener( 'pointerleave', onPointerCancel );
    }

    function deactivate()
    {
		_domElement.removeEventListener( 'pointermove', onPointerMove );
		_domElement.removeEventListener( 'pointerdown', onPointerDown );
		_domElement.removeEventListener( 'pointerup', onPointerCancel );
		_domElement.removeEventListener( 'pointerleave', onPointerCancel );
		_domElement.style.cursor = ''; 
    }

    function onPointerDown(event)
    {
        if(event.button == 0 && !ruler)
        {
            var x = event.offsetX, y = event.offsetY;
            startPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
            var texture = PIXI.Texture.from('./Media/PNG/Ruler.png');
            ruler = new PIXI.TilingSprite(
                texture,
                64,
                32,
            );
            ruler.anchor.set(0.5);
            ruler.x = startPosition.x;
            ruler.y = startPosition.y;
            app.stage.addChild(ruler);
			showLengthDiv(x+40,y-40);
        }
    }


    function onPointerMove(event)
    {
        if(ruler)
        {
        var x = event.offsetX, y = event.offsetY;
        endPosition = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
        ruler.x = (endPosition.x+startPosition.x)/2;
        ruler.y = (endPosition.y+startPosition.y)/2;
        ruler.width = Math.sqrt((endPosition.x-startPosition.x)*(endPosition.x-startPosition.x)+(endPosition.y-startPosition.y)*(endPosition.y-startPosition.y));
        myLookAt(ruler, endPosition);
        moveLengthDiv(x+100,y-100,ruler.width/64);
        }
    }

	function showLengthDiv(x,y)
	{
		var lengthDiv = document.createElement("div");
		lengthDiv.id = "rulerlength";
        lengthDiv.setAttribute('class' , "ruller");
		document.getElementById("canvas").appendChild(lengthDiv);
	}
	
	function moveLengthDiv(x,y, length)
	{
		var lengthDiv = document.getElementById("rulerlength");
		if(lengthDiv)
		{
		lengthDiv.style.top = (y-28)+'px';
		lengthDiv.style.left = (x-40)+'px';
		lengthDiv.innerText = Math.round(length*100)/100;
		}
	}

    function onPointerCancel(event)
    {
        app.stage.removeChild(ruler);
	    if(document.getElementById("rulerlength")) document.getElementById("rulerlength").remove();
        ruler = null;
    }

    function myLookAt(object, target)
	{
        var dx = target.x - object.x;
        var dy = target.y - object.y;
		var rotation = Math.atan2(dy, dx);
		object.rotation = rotation;
	}

    //activate();
    this.activate = activate;
    this.deactivate = deactivate;
};

export { RulerTool };