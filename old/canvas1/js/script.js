window.onload = function()
{   
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
            case "up-right": this.y--; this.x++; break;
            case "up-left": this.y--; this.x--; break;
            case "down": this.y++; break;
            case "down-right": this.y++; this.x++; break;
            case "down-left": this.y++; this.x--; break;
            case "right": this.x++; break;
            case "left": this.x--; break;
            default: break;
        }
    }

    function Particule(x,y,r,g,b,a,nature){
        Pixel.call(this,x,y,r,g,b,a);
        // negative : -1 ou positive : +1
        this.nature = nature;
        this.hasMoved = false;
        this.forceObject = {
            toUp:0,
            toUpRight:0,
            toUpLeft:0,
            toDown:0,
            toDownRight:0,
            toDownLeft:0,
            toRight:0,
            toLeft:0
        };
    }
    Particule.prototype = Object.create(Pixel.prototype);
    Particule.prototype.constructor = Particule;
    Particule.prototype.addForce = function(direction){
        this.forceObject[direction]++;
    };
    Particule.prototype.applyForce = function(){
        let forceFinale = {x:0,y:0};
        forceFinale.x = this.forceObject.toUpRight - this.forceObject.toUpLeft + 
                        this.forceObject.toDownRight - this.forceObject.toDownLeft +
                        this.forceObject.toRight - this.forceObject.toLeft;
        forceFinale.y = this.forceObject.toUpRight + this.forceObject.toUpLeft 
                        - this.forceObject.toDownRight - this.forceObject.toDownLeft +
                        this.forceObject.toUp - this.forceObject.toDown;
        if(forceFinale.x > 0) this.move("right");
        if(forceFinale.x < 0) this.move("left");
        if(forceFinale.y > 0) this.move("up");
        if(forceFinale.y < 0) this.move("down");
    };

    function Proton(x,y){
        Particule.call(this, x,y,0,0,255,255,1);
    }
    Proton.prototype = Object.create(Particule.prototype);
    Proton.prototype.constructor = Proton;

    function Electron(x,y){
        Particule.call(this, x,y,255,0,0,255,-1);
    }
    Electron.prototype = Object.create(Particule.prototype);
    Electron.prototype.constructor = Electron;
    
    var canvas = {
        element:null,
        context:null,
        imageData:null,
        pixelData:[],
        isInit:false,
        init: function(){
            this.element = document.getElementById('canvas');
            if(!this.element) {
                alert("Impossible de récupérer le canvas");
                return;
            }

            this.context = this.element.getContext('2d');
            if(!this.context) {
                alert("Impossible de récupérer le context du canvas");
                return;
            }

            this.imageData = this.context.getImageData(0,0,this.element.width,this.element.height);

            this.isInit = true;
        },
        verifInit: function(){
            if(!this.isInit){
               this.init(); 
            }
        },
        createPixelData: function(){   
            this.verifInit();
            for(let y = 0; y < this.element.height; y++){
                for(let x = 0; x < this.element.width; x++) {
                    this.placePixelIntoData(new Pixel(x,y));
                }
            }
        },
        placePixelIntoData: function(Pixel) {
            /*let pixelTemp = this.pixelData[this.toIndex(Pixel.x,Pixel.y)];
            if(pixelTemp && pixelTemp.__proto__.__proto__.constructor.name === "Particule"){
                return false;
            } else {*/
                this.pixelData[this.toIndex(Pixel.x,Pixel.y)] = Pixel; 
               /* return true;
            }*/
        },
        putPixelData: function(){
            if(!this.pixelData){
                this.createPixelData();
            } 
            
            for(let i = 0; i < this.imageData.data.length; i+=4){

                this.imageData.data[i] = this.pixelData[i/4].r;
                this.imageData.data[i + 1] = this.pixelData[i/4].g;
                this.imageData.data[i + 2] = this.pixelData[i/4].b;
                this.imageData.data[i + 3] = this.pixelData[i/4].a;
            }

            this.context.putImageData(this.imageData,0,0);
        },
        toIndex: function(x,y){
            return (this.element.width)*y + x;
        },
        toCartesian: function(index){
            return {
                x: index%this.element.width,
                y: parseInt(index/this.element.width)
            };
        }
    }

    document.querySelector('#btn').onclick = function (){
        stop = !stop;
    };

    canvas.createPixelData();

    //Creation du bord du canvas avec des electrons
    for(let i = 0; i < canvas.pixelData.length; i++){
        let cartesian = canvas.toCartesian(i);
        if(cartesian.x === 0 || cartesian.x === canvas.element.width -1 || cartesian.y === 0 || cartesian.y === canvas.element.height -1){
            canvas.placePixelIntoData(new Electron(cartesian.x,cartesian.y));
        }
    }

    var proton = new Proton(1,1);
    proton.addForce("toDownRight");
    canvas.placePixelIntoData(proton);

    canvas.putPixelData();

    var stop = false;
    var i = 0;
    var canvasLength = canvas.pixelData.length;
    var protonArrayTemp = [];
    
    //while(!stop) {
    setInterval(()=>{
        if(!stop){
            while(i < canvasLength){
                /*if(canvas.pixelData[i].__proto__.constructor.name !== "Pixel") {
                    canvas.movePixel(canvas.pixelData[i],"down-right");   
                }*/
                if(canvas.pixelData[i].__proto__.constructor.name === "Proton") {
                    if(!canvas.pixelData[i].hasMoved){
                        canvas.pixelData[i].applyForce();  
                        if(canvas.pixelData[canvas.toIndex(canvas.pixelData[i].x,canvas.pixelData[i].y)].__proto__.constructor.name !== "Electron") {
                            canvas.placePixelIntoData(canvas.pixelData[i]);
                            canvas.placePixelIntoData(new Pixel(canvas.toCartesian(i).x,canvas.toCartesian(i).y));
                        }
                        /*if(canvas.placePixelIntoData(canvas.pixelData[i])){
                            canvas.placePixelIntoData(new Pixel(canvas.pixelData[i].x,canvas.pixelData[i].y));
                        } else {
                            // colisions ?
                        }*/
                        canvas.pixelData[i].hasMoved = true;

                        protonArrayTemp.push(canvas.pixelData[i]);
                    }
                }
                i++;
            }
            
            i=0;
            // Affichage
            canvas.putPixelData();
            // Remise a zero du tag 'hasMoved' des protons qui ont bouges
            protonArrayTemp.forEach((element)=>{
                element.hasMoved = false;
            });
            // Vidage du tableau qui recupere les protons qui ont bouges
            protonArrayTemp.length = 0;
        }
    //}
    },0);

}