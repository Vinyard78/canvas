//const masseElectron = 9,1094 10-31 Kg;

const masseElectron = 1;

function Electron(x,y){
    Particule.call(this, x,y,255,0,0,255,-1);
    this.masse = masseElectron;
}
Electron.prototype = Object.create(Particule.prototype);
Electron.prototype.constructor = Electron;