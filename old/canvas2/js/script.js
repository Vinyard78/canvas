window.onload = function()
{   
    /*
        const masseProton = 1,6726 10-27 Kg;    
        const masseNeutron = 1,6749 10-27 Kg;
        const masseElectron = 9,1094 10-31 Kg;
    */

    const masseProton = 2000;
    const masseNeutron = 2000;
    const masseElectron = 1;

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

    function Particule(x,y,r,g,b,a,nature){
        Pixel.call(this,x,y,r,g,b,a);
        // negative : -1 ou positive : +1
        this.nature = nature;
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

    function Proton(x,y){
        Particule.call(this, x,y,0,0,255,255,1);
        this.masse = masseProton;
    }
    Proton.prototype = Object.create(Particule.prototype);
    Proton.prototype.constructor = Proton;

    function Electron(x,y){
        Particule.call(this, x,y,255,0,0,255,-1);
        this.masse = masseElectron;
    }
    Electron.prototype = Object.create(Particule.prototype);
    Electron.prototype.constructor = Electron;
    
    var canvas = {
        element:null,
        context:null,
        imageData:null,
        pixelData:[],
        tempData:[],
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
            this.pixelData[this.toIndex(Pixel.x,Pixel.y)] = Pixel;
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
        },
        pixelCollision: function(Pixel){
            // pour l instant, ne fait que repartir en arriere
            let pixelForce = Pixel.calculateForceFinale();
            // Retour a la position initiale
            if(pixelForce.x > 0) Pixel.move("left");
            if(pixelForce.x < 0) Pixel.move("right");
            if(pixelForce.y > 0) Pixel.move("down");
            if(pixelForce.y < 0) Pixel.move("up");
            // force interne inversee
            let temp = 0;

            temp = Pixel.forceObject.toUp;
            Pixel.forceObject.toUp = Pixel.forceObject.toDown;
            Pixel.forceObject.toDown = temp;

            temp = Pixel.forceObject.toRight;
            Pixel.forceObject.toRight = Pixel.forceObject.toLeft;
            Pixel.forceObject.toLeft = temp;
        }
    }

    document.querySelector('#btn').onclick = function (){
        //stop = !stop;
        let proton = new Proton(1,20);
        proton.addForce("toRight",10);
        canvas.placePixelIntoData(proton);
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
    proton.addForce("toDown",5);
    proton.addForce("toRight",10);
    canvas.placePixelIntoData(proton);
    canvas.tempData = canvas.pixelData.slice();

    canvas.putPixelData();

    //var stop = false;
    var i = 0;
    var canvasLength = canvas.tempData.length;
    
    //while(!stop) {
    setInterval(()=>{
        //if(!stop){
            while(i < canvasLength){

                if(canvas.tempData[i].constructor.name === "Proton") {
                    canvas.tempData[i].applyForce();                         

                    if(canvas.pixelData[canvas.toIndex(canvas.tempData[i].x,canvas.tempData[i].y)].constructor.name !== "Electron") {
                        canvas.placePixelIntoData(canvas.tempData[i]);
                        canvas.placePixelIntoData(new Pixel(canvas.toCartesian(i).x,canvas.toCartesian(i).y));
                    } else {
                        canvas.pixelCollision(canvas.tempData[i]);
                        canvas.placePixelIntoData(canvas.tempData[i]);
                    }
                }
                i++;
            }
            
            i=0;
            // Affichage
            canvas.putPixelData();

            canvas.tempData = canvas.pixelData.slice();
        //}
    //}
    },0);

}