//const masseProton = 1,6726 10-27 Kg;

const masseProton = 2000;

function Proton(x,y){
    Particule.call(this, x,y,0,0,255,255,1);
    this.masse = masseProton;
}
Proton.prototype = Object.create(Particule.prototype);
Proton.prototype.constructor = Proton;

