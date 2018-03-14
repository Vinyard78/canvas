window.onload = function()
{   
    function Pixel(r=255 ,g=255,b=255,a=255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    function Particule(r,g,b,a,nature){
        Pixel.call(this,r,g,b,a);
        // negative : -1 ou positive : +1
        this.nature = nature;
    }
    Particule.prototype = Object.create(Pixel.prototype);
    Particule.prototype.constructor = Particule;

    function Proton(){
        Particule.call(this, 0,0,255,255,1);
    }
    Proton.prototype = Object.create(Particule.prototype);
    Proton.prototype.constructor = Proton;


    function Electron(){
        Particule.call(this, 0,0,255,255,-1);
    }
    Electron.prototype = Object.create(Particule.prototype);
    Electron.prototype.constructor = Electron;
    
    var canvas = {
        element:null,
        context:null,
        imageData:null,
        pixelData:null,
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

            let length = this.element.width * this.element.height;
            let array = [];

            for(var i = 0; i < length; i++){
                array.push(new Pixel());
            }

            this.pixelData = array;
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
        }
    }

    canvas.createPixelData();

    canvas.pixelData[0] = new Proton();

    canvas.putPixelData();

    var i = 1;

    setInterval(function(){
    //while(i < canvas.pixelData.length){
        if(i < canvas.pixelData.length) {

            canvas.pixelData[i] = canvas.pixelData[i-1];
            canvas.pixelData[i-1] = new Pixel();

            canvas.putPixelData();
            i++;
        }
    //}
    },0);

}