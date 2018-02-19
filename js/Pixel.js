function Pixel(x,y,r=255 ,g=255,b=255,a=255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.x = x;
    this.y = y;
}
Pixel.prototype.move = function(direction){
    switch(direction){
        case "up": this.y--; break;
        case "down": this.y++; break;
        case "right": this.x++; break;
        case "left": this.x--; break;
        default: break;
    }
}