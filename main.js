//variaveis
var trex,trexImg, chao, chaoImg, chao2,nuvem_img;
var cactoImg1,cactoImg2,cactoImg3,cactoImg4,cactoImg5,cactoImg6,trexCollided;
var grupoNuvem, grupoCacto;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var placar = 0;
var restart,restartImg,gameOver,gameOverImg;
var jump, die, checkpoint;

//carregar arquivos
function preload(){
    trexImg = loadAnimation("trex1.png","trex3.png","trex4.png");
    chaoImg = loadImage("ground2.png");
    nuvem_img = loadImage("cloud.png");
    cactoImg1 = loadImage("obstacle1.png");
    cactoImg2 = loadImage("obstacle2.png");
    cactoImg3 = loadImage("obstacle3.png");
    cactoImg4 = loadImage("obstacle4.png");
    cactoImg5 = loadImage("obstacle5.png");
    cactoImg6 = loadImage("obstacle6.png");
    trexCollided = loadAnimation("trex_collided.png");
    restartImg = loadImage("restart.png");
    gameOverImg = loadImage("gameOver.png");
    jump = loadSound("jump.mp3");
    die = loadSound("die.mp3");
    checkpoint = loadSound("checkpoint.mp3");
    
}

//criar os objetos e suas propriedades
function setup(){
    createCanvas(windowWidth,windowHeight);
    
    trex = createSprite(50,height-180,30,70);
    trex.addAnimation("correndo",trexImg);
    trex.addAnimation("collided",trexCollided);
    trex.scale = 0.7;
    trex.debug = false;
   // trex.setCollider("rectangle",0,0,60,70);

    chao = createSprite(300,height-190,600,10);
    chao.addImage(chaoImg);
    

    chao2 = createSprite(300,height-180,600,10);
    chao2.visible = false;

    grupoNuvem = new Group();
    grupoCacto = new Group();

    gameOver = createSprite(width/2,height/3);
    gameOver.addImage(gameOverImg);
    restart = createSprite(width/2,gameOver.y+50);
    restart.addImage(restartImg);
    restart.scale = 0.5;


}


//loop de desenho e animação
function draw(){
    background(240);
    drawSprites();
    textFont("arial black")
    text("PLACAR: " + placar,width-120,30);
    if(gameState === PLAY){
        chao.velocityX= -4;
        if(frameCount % 100 === 0){
            checkpoint.play();
        }
        gameOver.visible = false;
        restart.visible = false;
        placar = placar + Math.round(frameRate()/60);
        //criando chão infito
        if(chao.x < 0){
            chao.x = chao.width/2;
        }
        //pulo
        if(touches.length > 0 || keyDown("space") && trex.y > 100){
            trex.velocityY = -10;
            jump.play();
            touches= [];
        }
        //colisao
        if(trex.isTouching(grupoCacto)){
            gameState = END;
            die.play();
        }

        gerarNuvens();
        gerarCactos();
    } else if(gameState === END){
        gameOver.visible = true;
        restart.visible = true;
        chao.velocityX = 0;
        grupoCacto.setVelocityXEach(0);
        grupoNuvem.setVelocityXEach(0);
        grupoCacto.setLifetimeEach(-1);
        grupoNuvem.setLifetimeEach(-1);
        trex.changeAnimation("collided");
    }
    

    //console.log(trex.y)
    

    
    console.log(gameState);
    //gravidade
    trex.velocityY = trex.velocityY + 0.5;

    trex.collide(chao2);

    if(mousePressedOver(restart)){
        reset();
    }
    

    //console.log(frameCount);
}

function gerarNuvens(){
    if(frameCount%120 === 0){
        var nuvem =createSprite(width,random(20,60));
        nuvem.addImage(nuvem_img);
        nuvem.scale=0.7;
        nuvem.velocityX = -2;
        nuvem.depth = trex.depth;
        trex.depth += 1;

        //console.log(trex.depth);
        //console.log(nuvem.depth);
        nuvem.lifetime = width/2;
        grupoNuvem.add(nuvem);
    } 
}

function gerarCactos(){
    if(frameCount%100 === 0){
        var cacto =createSprite(width,height-210,10,40);
        cacto.scale=0.6;
        cacto.velocityX = -4;
        cacto.depth = trex.depth;
        trex.depth += 1;

        var num = Math.round(random(1,6));

        switch(num){
            case 1: cacto.addImage(cactoImg1);
                    cacto.scale=0.9;
            break;
            case 2: cacto.addImage(cactoImg2);
            break;
            case 3: cacto.addImage(cactoImg3);
            break;
            case 4: cacto.addImage(cactoImg4);
            break;
            case 5: cacto.addImage(cactoImg5);
            break;
            case 6: cacto.addImage(cactoImg6);
            break;
            default: break;
        }

        cacto.lifetime = width/4;
        grupoCacto.add(cacto);

    }


}

function reset(){
    gameState = PLAY;
    //restart.visible = false;
    //gameOver.visible = false;
    placar = 0;
    grupoCacto.destroyEach();
    grupoNuvem.destroyEach();
    trex.changeAnimation("correndo");
}