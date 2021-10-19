var ItemController = function(container, _domElement, app)
{    
    app.loader.baseUrl = "svgs";
    app.loader
        //.add("Fridge","Fridge.svg")
        //.add("Dispenser","Dispenser.svg")
        //.add("Wheelrack","Wheelrack.svg")
        .add("FreshBox","FreshBox.svg")
        .add("ZK","ZK.svg")
        .add("LOKO","LOKO.svg");
    app.loader.onComplete.add(doneLoading);
    app.loader.load();
    var mod;
    function doneLoading(e)
    {
        console.log("done loading");
    }



    function activate()
    {
        //_domElement.addEventListener( 'pointermove', onPointerMove );
    }

    function deactivate()
    {
    }


    function addItem(name)
    {
        function onDragStart(event)
        {
            
            selectedItem = this;  
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        
        }
        
        function onDragEnd()
        {   
           
            this.alpha = 1;
            this.dragging = false;
            this.data = null;
        
        }
        
        function onDragMove()
        {
            if (this.dragging)
            {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                if ($("#stickmod").css("background-color")=="rgb(147, 210, 255)")
                {
                var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
                stickToItem(closestpoint);
                }
            }
        }

        let item;
        switch(name)
        {
            //case '1': item = PIXI.Sprite.from(app.loader.resources.Dispenser.texture); name = "Dispenser"; break;
            //case '2': item = PIXI.Sprite.from(app.loader.resources.Fridge.texture); name = "Fridge"; break;
            //case '4': item = PIXI.Sprite.from(app.loader.resources.Wheelrack.texture); name = "Wheelrack"; break;
            case '9': item = PIXI.Sprite.from(app.loader.resources.FreshBox.texture); name = "FreshBox"; break;
            case '10': item = PIXI.Sprite.from(app.loader.resources.ZK.texture); name = "ZK"; break;
            case '8': item = PIXI.Sprite.from(app.loader.resources.LOKO.texture); name = "LOKO"; break;
            default: return;
        }
        
        item.name = name;
        container.addChild(item);
        item.interactive = true;
        item.buttonMode = true;
        item.anchor.set(0.5);
        item
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove)
            .on('pointerover',filterOn)
            .on('pointerout',filterOff);
        //filterOff.call(item);
        item.x = 0; item.y = 0;

        var helper = new PIXI.Container();
        helper.x = item.texture.width/2;
        helper.y = item.texture.height/2;
        item.addChild(helper);

        var helper = new PIXI.Container();
        helper.x = -item.texture.width/2;
        helper.y = -item.texture.height/2;
        item.addChild(helper);

        var helper = new PIXI.Container();
        helper.x = -item.texture.width/2;
        helper.y = item.texture.height/2;
        item.addChild(helper);

        var helper = new PIXI.Container();
        helper.x = item.texture.width/2;
        helper.y = -item.texture.height/2;
        item.addChild(helper);

        return item;
    }

	function findObjectsInRange()
	{
        var objectsInRange = [];
        if(selectedItem)
        {
            container.children.forEach(element => {
                if(element!=selectedItem)
                {
                    if(distanceTo(selectedItem, element)<11) objectsInRange.push(element);
                }
            });
        }
        return objectsInRange;
	}


    function findClosestPoint(selecteditem, rangeitemsarray)
    {
        var selectedpoints = selecteditem.children;
        var _distance = 5000;
        var selectedpoint, closestpoint;
        for(var i = 0; i<rangeitemsarray.length; i++)
        {
            for(var j = 0; j<4; j++)
            {
                for(var k = 0; k<4; k++)
                {
                    var firstpos = localWorld(selectedpoints[j]);
                    var secpos = localWorld(rangeitemsarray[i].children[k]);
                    var distance = distanceTo(firstpos,secpos)*64;
                    if(distance<_distance)
                    {
                        _distance = distance;
                        selectedpoint = selectedpoints[j];
                        closestpoint = localWorld(rangeitemsarray[i].children[k]);
                    }
                }
            }
        }
        return [selectedpoint, closestpoint, _distance];
    }

	function stickToItem(closestpointsarr)
	{
		if(closestpointsarr[2]<1)
		{
            var clp = localWorld(closestpointsarr[0]);
            var clp2 = realPosition(selectedItem);
            var offset = {x: (clp.x-clp2.x)*64,y: (clp.y-clp2.y)*64};
            //console.log(closestpointsarr[1]);
            var newItemPosition = {x: closestpointsarr[1].x*64, y: closestpointsarr[1].y*64};
			selectedItem.x = newItemPosition.x; selectedItem.y = newItemPosition.y;
            selectedItem.x-=offset.x; selectedItem.y-=offset.y;
		}

	}

    function distanceTo(point1, point2)
    {
        return (Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+(point1.y-point2.y)*(point1.y-point2.y)))/64;
    }

    function localWorld(item)
    {
        var p = {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};
        return p;
    }

    function realPosition(item)
    {
        var p = {x: item.x/64, y: item.y/64};
        return p;
    }

    activate();
    this.activate = activate;
    this.deactivate = deactivate;
    this.addItem = addItem;
    this.findObjectsInRange = findObjectsInRange;


    remove.addEventListener('click', ()=>{
        container.removeChild(selectedItem);
    });
    

    
};

var selectedItem = null;

const outlineFilterBlue = new PIXI.filters.OutlineFilter(10, 0x99ff99);
const outlineFilterRed = new PIXI.filters.OutlineFilter(10, 0xff0099);

function filterOn() {
    this.filters = [outlineFilterBlue];
}

function filterOff() {
    this.filters = [];
}


var x_pos = document.getElementById("x_pos");
var y_pos = document.getElementById("y_pos");

var scroll = document.getElementById("rotid");
var valscroll = document.getElementById("valrotid");

var remove = document.getElementById("remove");

scroll.addEventListener( 'input', ()=>{
	valscroll.value=scroll.value;
	selectedItem.rotation = +valscroll.value/180*Math.PI;
});
valscroll.addEventListener( 'input', ()=>{
	scroll.value=valscroll.value;
	selectedItem.rotation = +valscroll.value/180*Math.PI;
});

x_pos.addEventListener('input',()=>{selectedItem.position.x = x_pos.value*64;});
y_pos.addEventListener('input',()=>{selectedItem.position.y = y_pos.value*64;});


export { ItemController };