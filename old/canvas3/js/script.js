window.onload = function()
{       
    // Listener du bouton
    document.querySelector('#btn').onclick = function (){
        //stop = !stop;
        let proton = null;
        for(let i = 1; i < canvas.element.height-1; i++){
            proton = new Proton(canvas.element.width-2,i);
            proton.addForce("toRight",1);
            proton.nbTourWhenMoved = nbTour;
            if(canvas.pixelData[canvas.toIndex(canvas.element.width-2,i)].constructor.name === "Pixel") {
                canvas.placePixelIntoData(proton);
            }
        }

        /*setInterval(function(){
            for(let i = 1; i < 98; i++){
                proton = new Proton(198,i);
                proton.addForce("toDown",10);
                canvas.placePixelIntoData(proton);
            }
        },1000);*/

        proton = new Proton(1,1);
        proton.addForce("toRight",1);
        if(canvas.pixelData[canvas.toIndex(1,1)].constructor.name === "Pixel") {
            canvas.placePixelIntoData(proton);
        }

        proton = new Proton(1,2);
        proton.addForce("toUp",1);
        proton.nbTourWhenMoved = nbTour;
        if(canvas.pixelData[canvas.toIndex(1,2)].constructor.name === "Pixel") {
            canvas.placePixelIntoData(proton);
        }

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
            i=0;
            // Affichage
            canvas.putPixelData();

            //canvas.tempData = canvas.pixelData.slice();
        //}
    //}
    },0);

}