export class ObjectSprite extends PIXI.Container {

    constructor(configObject) {
        super();
        for(var value in configObject) {
            if(configObject) this[value] = configObject[value];
        }
        console.log(this);
        // this.x = configObject.x;     this.y = configObject.y;     this.rotation = configObject.rotation;
        // this.userData = {};
        // this.userData.name = "CHECKOUT";
        // this.userData.nameTag = "";
        // this.userData.colors = configObject.userData.colors;
        // this.userData.configuration = configObject.userData.configuration;
        this.addChild(new PIXI.Container());
        this.addChild(new PIXI.Container());
        this.addChild(new PIXI.Container());
        this.addChild(new PIXI.Container());
    }

    saveIt() {
        var thisObject = {
            userData: this.userData,
            x:this.x,
            y:this.y,
            rotation:this.rotation,
        }
        return thisObject;
    }

    // clone() {
    //     selectedItem = null;
    //     ObjectSprite(this);
    // }

}


