import * as THREE from '../jsm/three.module.js';
import { FontLoader } from '../src/loaders/FontLoader.js';
import { TextGeometry } from '../src/geometries/TextGeometry.js';
const outlineFilterBlue = new PIXI.filters.OutlineFilter(10, 0x99ff99);
let selectedItem,container2d,app;


export const Functions = {

    addDimensions( _group ) {
        const aabb = new THREE.Box3();
        aabb.setFromObject( _group );
            
        const helper = new THREE.Box3Helper( aabb, 0xff5555 );
        helper.name = "boundingbox";
        _group.add( helper );
    
        let bevelEnabled = false,
        font = undefined,
        fontName = "optimer",
        fontWeight = "bold";
    
        const heightfont = 0,
        size = 0.045,
        curveSegments = 4,
        bevelThickness = 0.1,
        bevelSize = 0.25;
    
        const loader = new THREE.FontLoader();
        loader.load( './AdditionalScripts/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
            font = response;
            const width = Math.round((aabb.max.z - aabb.min.z)*1000) + "mm";
            var textWidth = new THREE.TextGeometry( width, {
                font: font,
                size: size,
                height: heightfont,
                curveSegments: curveSegments,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled
            });
            textWidth.computeBoundingBox();
    
            const length = Math.round((aabb.max.x - aabb.min.x)*1000) + "mm";
            var textLength = new THREE.TextGeometry( length, {
                font: font,
                size: size,
                height: heightfont,
                curveSegments: curveSegments,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled
            } );
            textLength.center();
    
            const height = Math.round((aabb.max.y - aabb.min.y)*1000) + "mm";
            var textHeight = new THREE.TextGeometry( height, {
                font: font,
                size: size,
                height: heightfont,
                curveSegments: curveSegments,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelEnabled: bevelEnabled
            } );
            textHeight.center();
            textHeight.computeBoundingBox();
            const centerOffsetH = 0.5 * ( textHeight.boundingBox.max.x - textHeight.boundingBox.min.x );
    
            const textMat = new THREE.MeshBasicMaterial( { color: 0x151515 } );
    
            var textMeshW = new THREE.Mesh( textWidth, textMat );
            textMeshW.name = "billboard";
            var textMeshL = new THREE.Mesh( textLength, textMat );
            textMeshL.name = "billboardL";
            var textMeshH = new THREE.Mesh( textHeight, textMat );
            textMeshH.name = "billboardH";

    
            textMeshW.position.set(aabb.min.x-0.07,0,aabb.min.z);
            textMeshW.rotation.set(-Math.PI/2,0,-Math.PI/2);
    
            textMeshL.position.set(0,aabb.max.y + 0.03,aabb.min.z);
    
            textMeshH.position.set(aabb.min.x - 0.07,aabb.max.y - centerOffsetH,aabb.min.z);
            textMeshH.rotation.set(0,0,-Math.PI/2);
    
            _group.add( textMeshW );
            _group.add( textMeshL );
            _group.add( textMeshH );
        });
    },

    onDragStart(event,otherthis,appimport) {
        app=appimport;
        if([0,1,6].includes(app.userData.mod) && app.userData.canTranslate)
        {
        selectedItem = otherthis;  
        otherthis.data = event.data;
        otherthis.alpha = 0.5;
        otherthis.dragging = true;
        app.canMove = 0;
        }
    },

    onDragMove(e,otherthis,containerimport) {
        container2d=containerimport;
        if (document.getElementById("nametagdisplay")){
            const el = document.getElementById("nametagdisplay");
            el.style.top = (e.data.global.y-20)+'px';
            el.style.left = (e.data.global.x+20)+'px';
        }
        if (otherthis.dragging && app.userData.canTranslate) {
            
            if(document.getElementById("nametagdisplay")) 
                document.getElementById("nametagdisplay").remove();
            const newPosition = otherthis.data.getLocalPosition(otherthis.parent);
            otherthis.x = newPosition.x;
            otherthis.y = newPosition.y;
            if (app.userData.snapvert)
            {
            var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
            stickToItem(closestpoint);
            }
        }
        else
				this.alpha = 1;
    },

    onDragEnd(otherthis) {   
        otherthis.alpha = 1;
        otherthis.dragging = false;
        otherthis.data = null;
        app.canMove = 1;
    },

    filterOn(otherthis) {
    otherthis.filters = [outlineFilterBlue];
    var lengthDiv = document.createElement("div");
    lengthDiv.id = "nametagdisplay";
    lengthDiv.setAttribute('class' , "ruller");
    document.getElementById("canvas").appendChild(lengthDiv);
    lengthDiv.innerText = otherthis.userData.nameTag?otherthis.userData.nameTag:otherthis.name;
    },

    filterOff(otherthis) {
        otherthis.filters = [];
        const el = document.getElementById("nametagdisplay");
        if(el) el.remove();
    },

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

    function findObjectsInRange()
    {
        var objectsInRange = [];
        if(selectedItem)
        {
            container2d.children.forEach(element => {
                if(element!=selectedItem)
                {
                    if(distanceTo(selectedItem, element)<11) objectsInRange.push(element);
                }
            });
        }
        return objectsInRange;
    }

    function stickToItem(closestpointsarr)
    {
        if(closestpointsarr[2]<1)
        {
            var clp = localWorld(closestpointsarr[0]);
            var clp2 = realPosition(selectedItem);
            var offset = {x: (clp.x-clp2.x)*64,y: (clp.y-clp2.y)*64};
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
    return {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};   
}

function realPosition(item)
{
    return {x: item.x/64, y: item.y/64};
}






	