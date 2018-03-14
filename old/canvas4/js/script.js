window.onload = function()
{       
    // Listener du bouton
    document.querySelector('#btn').onclick = function (){
        //stop = !stop;
        let proton = null;
        /*for(let i = 1; i < canvas.element.height-1; i++){
            proton = new Proton(canvas.element.width-2,i);
            proton.addForce("toDown",1);
            proton.nbTourWhenMoved = nbTour;
            if(canvas.pixelData[canvas.toIndex(canvas.element.width-2,i)].constructor.name === "Pixel") {
                canvas.placePixelIntoData(proton);
            }
        }*/

        setInterval(function(){
            proton = new Proton(canvas.element.width/2,canvas.element.height/2);
            
            proton.nbTourWhenMoved = nbTour;
            
            let rand = parseInt(Math.random()*80)%8;
            /*for(let i = 1; i < canvas.element.height-1; i++){
                proton = new Proton(canvas.element.width-2,i);
                proton.addForce("toDown",1);
                proton.nbTourWhenMoved = nbTour;
                if(canvas.pixelData[canvas.toIndex(canvas.element.width-2,i)].constructor.name === "Pixel") {
                    canvas.placePixelIntoData(proton);
                }
            }*/
            switch(rand){
                case 0:proton.addForce("toUp",1);break;
                case 1:proton.addForce("toDown",1);break;
                case 2:proton.addForce("toLeft",1);break;
                case 3:proton.addForce("toRight",1);break;
                case 4:proton.addForce("toUp",1);proton.addForce("toRight",1);break;
                case 5:proton.addForce("toDown",1);proton.addForce("toRight",1);break;
                case 6:proton.addForce("toUp",1);proton.addForce("toLeft",1);break;
                case 7:proton.addForce("toDown",1);proton.addForce("toLeft",1);break;
                default:break;
            }
            if(canvas.pixelData[canvas.toIndex(canvas.element.width/2,canvas.element.height/2)].constructor.name === "Pixel") {
                canvas.placePixelIntoData(proton);
            }
            
        },0);

        /*proton = new Proton(1,1);
        proton.addForce("toRight",1);
        if(canvas.pixelData[canvas.toIndex(1,1)].constructor.name === "Pixel") {
            canvas.placePixelIntoData(proton);
        }

        proton = new Proton(1,2);
        proton.addForce("toUp",1);
        proton.nbTourWhenMoved = nbTour;
        if(canvas.pixelData[canvas.toIndex(1,2)].constructor.name === "Pixel") {
            canvas.placePixelIntoData(proton);
        }*/

        canvas.putPixelData();
    };

    canvas.createPixelData();

    //Creation du bord du canvas avec des electrons
    for(let i = 0; i < canvas.pixelData.length; i++){
        let cartesian = canvas.toCartesian(i);
        if(cartesian.x === 0 || cartesian.x === canvas.element.width -1 || cartesian.y === 0 || cartesian.y === canvas.element.height -1){
            canvas.placePixelIntoData(new Electron(cartesian.x,cartesian.y));
        }
    }
    //Creation du bord du canvas avec des bloc qui n interragissent pas avec les particules
    /*for(let i = 0; i < canvas.pixelData.length; i++){
        let cartesian = canvas.toCartesian(i);
        if(cartesian.x === 0 || cartesian.x === canvas.element.width -1 || cartesian.y === 0 || cartesian.y === canvas.element.height -1){
            canvas.placePixelIntoData(new Particule(cartesian.x,cartesian.y,255,255,255,255,0));
        }
    }*/

    /*var proton = new Proton(1,1);
    proton.addForce("toDown",1);
    proton.addForce("toRight",1);
    canvas.placePixelIntoData(proton);*/
    //canvas.tempData = canvas.pixelData.slice();

    canvas.putPixelData();

    //var stop = false;
    var i = 0;
    //var canvasLength = canvas.tempData.length;
    var canvasLength = canvas.pixelData.length;
    var newIndex = 0;
    var pastCartesian = {
        x:0,
        y:0
    };
    var nbTour = 0;
    
    /**
     * Boucle de temps
     */
    //while(!stop) {
    setInterval(()=>{
        //if(!stop){

            let rand = parseInt(Math.random()*10)%2;
            if(rand > 0) {
                i = 0;
                while(i < canvasLength){

                if(canvas.pixelData[i].constructor.name === "Proton" && canvas.pixelData[i].nbTourWhenMoved !== nbTour) {
                    
                    pastCartesian.x = canvas.pixelData[i].x;
                    pastCartesian.y = canvas.pixelData[i].y;

                    canvas.pixelData[i].applyForce();   

                    newIndex = canvas.toIndex(canvas.pixelData[i].x,canvas.pixelData[i].y);                     

                    canvas.pixelData[i].nbTourWhenMoved = nbTour;

                    if(canvas.pixelData[newIndex].constructor.name === "Pixel") {
                        canvas.placePixelIntoData(canvas.pixelData[i]);
                        canvas.placePixelIntoData(new Pixel(pastCartesian.x,pastCartesian.y));
                    } else {
                        canvas.pixelCollision(i,nbTour);
                        //canvas.placePixelIntoData(canvas.tempData[i]);
                    }
                }
                i++;
            }

            nbTour++;
            // Affichage
            canvas.putPixelData();
            } else {
                i = canvasLength-1;
                //On fait un tour de balayage d ecran dans l'autre sens pour eviter que toutes les particules se retrouvent retrancher en haut a gauche au fil du temps

                while(i >= 0){

                    if(canvas.pixelData[i].constructor.name === "Proton" && canvas.pixelData[i].nbTourWhenMoved !== nbTour) {
                        
                        pastCartesian.x = canvas.pixelData[i].x;
                        pastCartesian.y = canvas.pixelData[i].y;

                        canvas.pixelData[i].applyForce();   

                        newIndex = canvas.toIndex(canvas.pixelData[i].x,canvas.pixelData[i].y);                     

                        canvas.pixelData[i].nbTourWhenMoved = nbTour;

                        if(canvas.pixelData[newIndex].constructor.name === "Pixel") {
                            canvas.placePixelIntoData(canvas.pixelData[i]);
                            canvas.placePixelIntoData(new Pixel(pastCartesian.x,pastCartesian.y));
                        } else {
                            canvas.pixelCollision(i,nbTour);
                            //canvas.placePixelIntoData(canvas.tempData[i]);
                        }
                    }
                    i--;
                }
                nbTour++;
                // Affichage
                canvas.putPixelData();
            }

            

            //i=canvasLength-1;

            //canvas.tempData = canvas.pixelData.slice();

            

            //i=0;



        //}
    //}
    },0);

}