var canvas = {
    element:null,
    context:null,
    imageData:null,
    pixelData:[],
    //tempData:[],
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
    pixelCollision: function(index, nbTour){

        let pixel = canvas.pixelData[index];
        let indexPixel2 = canvas.toIndex(pixel.x,pixel.y);
        let origin = canvas.toCartesian(index);
        let tempX = pixel.x;
        let tempY = pixel.y;
        // Tourne la force appliquee a la particule de 45 degre dans le sens des aiguilles d une montre
        pixel.turnForceObject();
        // Change les coordonnees x et y de la particule en fonction de la force appliquee
        pixel.applyForce();
        // Verifie pour les 6 autres possibilites de trajectoire de la partiucle (autour d elle autre que sa position initiale et autre que celle deja changee juste avant)
        for(let i = 0; i < 7; i++){
            // Si la position finale n est pas un pixel, donc une case vide, ou pas un pixel qui existe (et qui est donc en dehors du canvas) et que ce n est pas la position d origine de la particule
            if((pixel.x !== origin.x || pixel.y !== origin.y) && (!canvas.pixelData[canvas.toIndex(pixel.x,pixel.y)] || canvas.pixelData[canvas.toIndex(pixel.x,pixel.y)].constructor.name !== "Pixel")){
                // Retour a la position initiale
                pixel.x = tempX;
                pixel.y = tempY;

                pixel.turnForceObject();
                pixel.applyForce();
            } else {
                break;
            }
        }

        // Si ce n est pas la position initiale de la particule, on remplace sa position initiale par un pixel vide
        if(pixel.x !== origin.x || pixel.y !== origin.y){
            
            canvas.placePixelIntoData(pixel);
            canvas.placePixelIntoData(new Pixel(origin.x,origin.y));
        }

        // idem avec le deuxieme pixel qui collisionne

        let pixel2 = canvas.pixelData[indexPixel2];

        if(pixel2 && pixel2.constructor.name === "Proton" && pixel2.nbTourWhenMoved !== nbTour){
	    
	        tempX = pixel2.x;
	        tempY = pixel2.y;
	        
	        pixel2.turnForceObject();
	        // Change les coordonnees x et y de la particule en fonction de la force appliquee
	        pixel2.applyForce();
	        // Verifie pour les 6 autres possibilites de trajectoire de la partiucle (autour d elle autre que sa position initiale et autre que celle deja changee juste avant)
	        for(let i = 0; i < 7; i++){
	            // Si la position finale n est pas un pixel, donc une case vide, ou pas un pixel qui existe (et qui est donc en dehors du canvas)
	            if((!canvas.pixelData[canvas.toIndex(pixel2.x,pixel2.y)] || canvas.pixelData[canvas.toIndex(pixel2.x,pixel2.y)].constructor.name !== "Pixel")){
	                // Retour a la position initiale
	                pixel2.x = tempX;
	                pixel2.y = tempY;

	                pixel2.turnForceObject();
	                pixel2.applyForce();
	            } else {
	                break;
	            }
	        }

	        // Si ce n est pas la position initiale de la particule, on remplace sa position initiale par un pixel vide
	        if(pixel2.x !== tempX || pixel2.y !== tempY){
                canvas.placePixelIntoData(pixel2);
	            canvas.placePixelIntoData(new Pixel(tempX,tempY));
	        }
            pixel2.nbTourWhenMoved = nbTour;
	    }
    }
}