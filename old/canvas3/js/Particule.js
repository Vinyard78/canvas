/*

const masseProton = 1,6726 10-27 Kg;    
const masseNeutron = 1,6749 10-27 Kg;
const masseElectron = 9,1094 10-31 Kg;

const masseProton = 2000;
const masseNeutron = 2000;
const masseElectron = 1;

*/
function Particule(x,y,r,g,b,a,nature){
    Pixel.call(this,x,y,r,g,b,a);
    // negative : -1 ou positive : +1
    this.nature = nature;
    this.masse = 0;
    /*this.vitesse = {
        x:0,
        y:0
    };*/
    this.forceObject = {
        toUp:0,
        toDown:0,
        toRight:0,
        toLeft:0
    };
}
Particule.prototype = Object.create(Pixel.prototype);
Particule.prototype.constructor = Particule;
Particule.prototype.addForce = function(direction,number=1){
    this.forceObject[direction]+=number;
};
Particule.prototype.calculateForceFinale = function(){
    let forceFinale = {x:0,y:0};

    let xForce =    this.forceObject.toRight - this.forceObject.toLeft;
    let yForce =    this.forceObject.toUp - this.forceObject.toDown;

    // Renvoi un object de ce type {x:0,y:0}, {x:1,y:1}, {x:-1,y:1} etc. 
    forceFinale.x = xForce === 0 ? 0 : xForce > 0 ? 1 : -1;
    forceFinale.y = yForce === 0 ? 0 : yForce > 0 ? 1 : -1;

    return forceFinale;
};
Particule.prototype.applyForce = function(){
    let forceFinale = this.calculateForceFinale();
    if(forceFinale.x > 0) this.move("right");
    if(forceFinale.x < 0) this.move("left");
    if(forceFinale.y > 0) this.move("up");
    if(forceFinale.y < 0) this.move("down");
};
// Tourne la force appliquee a la particule de 45 degre dans le sens des aiguilles d une montre
Particule.prototype.turnForceObject = function(){
    let forceFinale = this.calculateForceFinale();
    if(forceFinale.x === 0 && forceFinale.y === 1){
        this.forceObject = {
            toUp:1,
            toDown:0,
            toRight:1,
            toLeft:0
        };
    } else if (forceFinale.x === 1 && forceFinale.y === 1) {
        this.forceObject = {
            toUp:0,
            toDown:0,
            toRight:1,
            toLeft:0
        };
    } else if (forceFinale.x === 1 && forceFinale.y === 0) {
        this.forceObject = {
            toUp:0,
            toDown:1,
            toRight:1,
            toLeft:0
        };
    } else if (forceFinale.x === 1 && forceFinale.y === -1) {
        this.forceObject = {
            toUp:0,
            toDown:1,
            toRight:0,
            toLeft:0
        };
    } else if (forceFinale.x === 0 && forceFinale.y === -1) {
        this.forceObject = {
            toUp:0,
            toDown:1,
            toRight:0,
            toLeft:1
        };
    } else if (forceFinale.x === -1 && forceFinale.y === -1 ) {
        this.forceObject = {
            toUp:0,
            toDown:0,
            toRight:0,
            toLeft:1
        };
    } else if (forceFinale.x === -1 && forceFinale.y === 0 ) {
        this.forceObject = {
            toUp:1,
            toDown:0,
            toRight:0,
            toLeft:1
        };
    } else if (forceFinale.x === -1 && forceFinale.y === 1) {
        this.forceObject = {
            toUp:1,
            toDown:0,
            toRight:0,
            toLeft:0
        };
    }
};