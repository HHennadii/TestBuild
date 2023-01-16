import * as THREE from '../jsm/three.module.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import {OrbitControls } from '../jsm/controls/OrbitControls.js';
import { RGBELoader } from '../jsm/loaders/RGBELoader.js';
import * as InterfaceModule from './InterfaceForConf.js';
import { FontLoader } from '../src/loaders/FontLoader.js';
import { TextGeometry } from '../src/geometries/TextGeometry.js';
const outlineFilterBlue = new PIXI.filters.OutlineFilter(10, 0x99ff99);
let container2d,app;
let selectedItem;


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

    showContextMenu(x,y) {
        
        let menuDiv = document.createElement("div");
        menuDiv.id = "ORClick";
        menuDiv.className = "OR-cover";
        menuDiv.innerHTML = InterfaceModule.RBMmenuConf;
        document.body.appendChild(menuDiv);
        $("#menu").css({"position":"absolute","top":y+"px","left":x+30+"px"});
        $("#ORclose").click(()=>{document.getElementById("ORClick").remove();});
        $("#ORremove").click(()=>{container2d.removeChild(selectedItem); document.getElementById("ORClick").remove();;});
        $("#copyObject").click(()=>{selectedItem.clone(); document.getElementById("ORClick").remove();;});
        $("#ORrotate").on("input change",(item)=>{selectedItem.rotation = (+item.target.value/180*Math.PI);});
        $("#nameTag").val(selectedItem.userData.nameTag);
        $("#nameTag").on("input change",(item)=>{selectedItem.userData.nameTag=item.target.value});
        $("#ORClick").click(function(e){ if(e.currentTarget==e.target)$("#ORClick").remove();})
        $("#depthST").text("Depth: " + " 0.660 m");
        $("#squareST").html("Square: " + Math.round((selectedItem.userData.breadth*selectedItem.userData.width)*100)/100 + "m&#178");
        $("#lengthST").text("Length: " + Math.round(selectedItem.userData.breadth*100)/100 + "m");
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

            if (app.userData.snapvert) {
                var closestpoint = findClosestPoint(selectedItem,findObjectsInRange());
                stickToItem(closestpoint);
            }

            if (app.userData.snapwall) {
                if(!otherthis.configuration) {
                    var closestpoint = getClosestWall(e, container2d.parent.children[6]);
                    if(!closestpoint.point.left) {
                        otherthis.rotation = closestpoint.wall.rotation;
                        otherthis.x = closestpoint.point.point.x + Math.cos(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+otherthis.texture.height/2-closestpoint.wall.userData.offset);
                        otherthis.y = closestpoint.point.point.y + Math.sin(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+otherthis.texture.height/2-closestpoint.wall.userData.offset)
                    }
                    else {
                        otherthis.rotation = closestpoint.wall.rotation+Math.PI;
                        otherthis.x = closestpoint.point.point.x + Math.cos(otherthis.rotation-Math.PI/2)*(-closestpoint.wall.userData.offset-closestpoint.wall.userData.width/100*32-otherthis.texture.height/2)// + Math.cos(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+otherthis.texture.width/2-closestpoint.wall.userData.offset);
                        otherthis.y = closestpoint.point.point.y + Math.sin(otherthis.rotation-Math.PI/2)*(-closestpoint.wall.userData.offset-closestpoint.wall.userData.width/100*32-otherthis.texture.height/2)// + Math.sin(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+otherthis.texture.height/2-closestpoint.wall.userData.offset)
                   }
                }
                else {
                    var closestpoint = getClosestWall(e, container2d.parent.children[6]);
                    var containerheight = otherthis.children[2].y - otherthis.children[0].y;
                    if(!closestpoint.point.left) {
                        otherthis.rotation = closestpoint.wall.rotation;
                        otherthis.x = closestpoint.point.point.x + Math.cos(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+containerheight/2-closestpoint.wall.userData.offset);
                        otherthis.y = closestpoint.point.point.y + Math.sin(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+containerheight/2-closestpoint.wall.userData.offset)
                    }
                    else {
                        otherthis.rotation = closestpoint.wall.rotation+Math.PI;
                        otherthis.x = closestpoint.point.point.x + Math.cos(otherthis.rotation-Math.PI/2)*(-closestpoint.wall.userData.offset-closestpoint.wall.userData.width/100*32-containerheight/2)// + Math.cos(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+otherthis.texture.width/2-closestpoint.wall.userData.offset);
                        otherthis.y = closestpoint.point.point.y + Math.sin(otherthis.rotation-Math.PI/2)*(-closestpoint.wall.userData.offset-closestpoint.wall.userData.width/100*32-containerheight/2)// + Math.sin(otherthis.rotation+Math.PI/2)*(closestpoint.wall.userData.width/100*32+otherthis.texture.height/2-closestpoint.wall.userData.offset)
                   }
                }

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
    lengthDiv.innerText = otherthis.userData.nameTag?otherthis.userData.nameTag:otherthis.name?otherthis.name:otherthis.userData.name;
    },

    filterOff(otherthis) {
        otherthis.filters = [];
        const el = document.getElementById("nametagdisplay");
        if(el) el.remove();
    },

}



export function ConfiguratorView (prscene, prgroup, prcamera, prrenderer, prrect, prcontrols, sceneElement, confreqv, arr_build, asyncLoadFresh, spriteFreshBox) {

    var preloadedMeshes = {};

    function showConfigurator(id) {

        prscene = new THREE.Scene();
        prscene.background = new THREE.Color(0xCBCED6);
        prrect = sceneElement.getBoundingClientRect();
        prscene.userData.element = sceneElement;
        prcamera = new THREE.PerspectiveCamera( 50, 1, 0.1, 10 );
        prcamera.position.z = 2;
        prcamera.position.y = 0.5;
        prscene.userData.camera = prcamera;

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
        directionalLight.position.set( -3, -3, 3 );
        prscene.add( directionalLight );

        const alight = new THREE.AmbientLight( 0xffffff, 0.3 );
        prscene.add( alight );
        
        prrenderer = new THREE.WebGLRenderer({ antialias: true});
        prrenderer.setSize( prrect.width, 400 );
        sceneElement.appendChild(prrenderer.domElement);

        prrenderer.physicallyCorrectLights = true;
        prrenderer.toneMapping = THREE.ACESFilmicToneMapping;
        prrenderer.toneMappingExposure = 3;

        const pmremGenerator = new THREE.PMREMGenerator( prrenderer );
        pmremGenerator.compileEquirectangularShader();
        new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .setPath( '../Media/HDR/' )
        .load( 'royal_esplanade_1k.hdr', function ( texture ) {
            const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            //prscene.background = envMap;
            prscene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
            } );


        
        prgroup = new THREE.Group();
        prscene.add(prgroup);

        preloadMeshesObject(id, asyncLoadFresh);
        
        prcontrols =  new OrbitControls(prcamera, prrenderer.domElement);
        prcontrols.maxDistance = 20;
        prcontrols.target = new THREE.Vector3(0, 1, 0);
        prcontrols.update();

        prcamera.position.set(-2.5, 2.5, 2.5);
        prcamera.position.z = 2;

        confreqv = window.requestAnimationFrame( pranimate );
        onWindowResize();
        if (+$(".configurator ").css('height').replace(/px/i, '') > 698) {$(".configurator, .loader2, .right-menu").css('top', window.innerHeight/2-350); }
    }

    function hideConfigurator() {
        sceneElement.removeChild(prrenderer.domElement);
        prscene = null;
        prcamera = null;
        prrenderer = null;
        window.cancelAnimationFrame(confreqv);
    }

    function pranimate() {
        prcontrols.update();
        if(prrenderer) {
            
            if(prgroup.children[0]) {
        
                prgroup.children[0].children.forEach(obj => {
        
                    if(obj.name === "billboardL") {
        
                        var dx = prcamera.position.x - obj.position.x;
                        var dy = prcamera.position.z - obj.position.z;
                        var rotation = Math.atan2(dy, dx);
                        obj.rotation.set(0,-rotation+Math.PI/2,0);
                    }
        
                    if(obj.name === "billboardH") {
                        
                        var dx = prcamera.position.x - obj.position.x;
                        var dy = prcamera.position.z - obj.position.z;
                        var rotation = Math.atan2(dy, dx);
                        obj.rotation.set(0,-rotation+Math.PI/2,-Math.PI/2);
                    }
                })
            }
    
        prrenderer.render(prscene, prcamera);
        window.requestAnimationFrame( pranimate );
        }
    }

    function configurateItem(arr_build) {
        prgroup.remove(...prgroup.children);
        var item = {
            userData: {
                configuration:arr_build,
                colors:document.querySelector('input[name="color"]:checked')?.value.split(' '),
                height: document.querySelector('input[name="height"]:checked')?.value,
                depth: document.querySelector('input[name="depth"]:checked')?.value,
                extBot: document.getElementById("bottom_ext")?.checked,
                faceborderR: document.querySelector('input[name="borderR"]:checked')?.value,
                faceborderL: document.querySelector('input[name="borderL"]:checked')?.value,
                extCooling: document.getElementById("bottom_ext")?.checked,
                editionalBordersEm: +document.getElementById("akrile")?.innerHTML,
                nameTag: "",
                kazyrek: document.getElementById("access3")?.checked ? true : false,
            },
            x: 0,
            y: 0,
            rotation: 0,
        }
        asyncLoadFresh(item,prgroup,preloadedMeshes);
        spriteFreshBox(item);
    }

    function onWindowResize() {

        var prrect = sceneElement.getBoundingClientRect();
        if(prcamera) {
            prcamera.aspect = prrect.width/prrect.height;
            prcamera.updateProjectionMatrix();
            prrenderer.setSize(prrect.width, prrect.height);
        }
    }


    function preloadMeshesObject(id, asyncLoadFresh) {
        preloadedMeshes = {};
        const loader = new GLTFLoader();
            loader.load(
                '../../sprites/configurator/'+id+'/'+'CORN.glb',
                function(gltf){
                    for(var i = 0; i<gltf.scene.children.length; i++)
                    {
                        preloadedMeshes[gltf.scene.children[i].name] = gltf.scene.children[i];
                    }
                    document.getElementById("loadscreen2").style.display="none";
                    var item = {
                        userData: {
                            configuration:arr_build,
                            colors:document.querySelector('input[name="color"]:checked')?.value.split(' '),
                            height: document.querySelector('input[name="height"]:checked')?.value,
                            depth: document.querySelector('input[name="depth"]:checked')?.value,
                            extBot: document.getElementById("bottom_ext")?.checked,
                            faceborderR: document.querySelector('input[name="borderR"]:checked')?.value,
                            faceborderL: document.querySelector('input[name="borderL"]:checked')?.value,
                            extCooling: document.getElementById("bottom_ext")?.checked,
                            editionalBordersEm: +document.getElementById("akrile")?.innerHTML,
                        },
                    }
                    asyncLoadFresh(item,prgroup,preloadedMeshes);
                },
                function ( xhr ) {
                    if(typeof(xhr.loaded / xhr.total)=='number' && xhr.loaded / xhr.total!="Infinity") {
                        $("#loadingPR").html(Math.round( xhr.loaded / xhr.total * 100 ) + '%' );
                    }
                    else
                    $("#loadingPR").html("In progress");
                },
                function ( error ) {
                    console.log( 'An error happened' );
                });
    }

    this.showConfigurator = showConfigurator;
    this.hideConfigurator = hideConfigurator;
    this.configurateItem = configurateItem;
}







    function project( p, a, b ) {

        var atob = { x: b.x - a.x, y: b.y - a.y };
        var atop = { x: p.x - a.x, y: p.y - a.y };
        var len = atob.x * atob.x + atob.y * atob.y;
        var dot = atop.x * atob.x + atop.y * atob.y;
        var t = Math.min( 1, Math.max( 0, dot / len ) );
        dot = ( b.x - a.x ) * ( p.y - a.y ) - ( b.y - a.y ) * ( p.x - a.x );

        return {
            point: {
                x: a.x + atob.x * t,
                y: a.y + atob.y * t
            },
            left: dot < 1,
            dot: dot,
            t: t
        };
    }

    function doorProject(event, wall) {
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
        return project(p,a,b);
    }

    function getClosestWall(event, _edgegroup) {

        if( _edgegroup.children.length===0 ) return null;

        event = {
            offsetX: event.data.global.x,
            offsetY: event.data.global.y,
        };

        var closestWall = {
            "wall": _edgegroup.children[0],
            "point": doorProject(event, _edgegroup.children[0]),
        };

        var x = event.offsetX, y = event.offsetY;
        var p = {x: (x - app.stage.x) / app.stage.scale.x, y: (y - app.stage.y)/app.stage.scale.y};
        var distance = Math.sqrt((closestWall.point.point.x-p.x)*(closestWall.point.point.x-p.x)+(closestWall.point.point.y-p.y)*(closestWall.point.point.y-p.y));

        for(var i = 1; i<_edgegroup.children.length; i++) {

            var intwall = _edgegroup.children[i];
            var point = doorProject(event, _edgegroup.children[i]);
            var intdistance = Math.sqrt((point.point.x-p.x)*(point.point.x-p.x)+(point.point.y-p.y)*(point.point.y-p.y));

            if(intdistance < distance) {
                distance = intdistance;
                closestWall.wall = intwall;
                closestWall.point = point;

            }
        }
        return closestWall;
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

    function findObjectsInRange() {
        var objectsInRange = [];

        if(selectedItem) {
            container2d.children.forEach(element => {

                if(element!=selectedItem) {
                    
                    if(distanceTo(selectedItem, element)<11) objectsInRange.push(element);

                }
            });
        }
        return objectsInRange;
    }

    function RemoveFromArray (arr, itemId){
        return arr.filter(e => e.id != itemId);
    }

    function stickToItem(closestpointsarr) {
        if(closestpointsarr[2]<1) {
            var clp = localWorld(closestpointsarr[0]);
            var clp2 = realPosition(selectedItem);
            var offset = {x: (clp.x-clp2.x)*64,y: (clp.y-clp2.y)*64};
            var newItemPosition = {x: closestpointsarr[1].x*64, y: closestpointsarr[1].y*64};
            selectedItem.x = newItemPosition.x; selectedItem.y = newItemPosition.y;
            selectedItem.x-=offset.x; selectedItem.y-=offset.y;
        }

    }

    function distanceTo(point1, point2) {
        return (Math.sqrt((point1.x-point2.x)*(point1.x-point2.x)+(point1.y-point2.y)*(point1.y-point2.y)))/64;
    }

    function localWorld(item) {
        return {x: (item.getGlobalPosition().x - app.stage.x) / (app.stage.scale.x*64), y: (item.getGlobalPosition().y - app.stage.y)/(app.stage.scale.y*64)};   
    }

    function realPosition(item) {
        return {x: item.x/64, y: item.y/64};
    }



    export function modelLoader(url) {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data => resolve(data), null, reject);
        });
    }


	