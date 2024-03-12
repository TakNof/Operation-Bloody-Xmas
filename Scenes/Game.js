class Game extends GeneralGameScene{
    constructor(){
        super("Game");

    }
    
    create(){
        // this.game.config.fps = 120;
        this.grid = this.add.grid(0, 0, canvasSize.width*4, canvasSize.height*4, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();
                
        this.walls = new WallsBuilder(this, "wall", 64, 20, true, true);
        this.walls.createWalls();
        


        this.cookies = this.add.group({
            maxSize: 5,
            repeat: 5,
            visible: false,
            active: false
        });

        this.milks = this.add.group({
            maxSize: 5,
            repeat: 5,
            visible: false,
            active: false
        });


        for(let i = 0; i < this.cookies.maxSize; i++){
            this.cookies.add(new Cookie(this, {x: 0, y: 0}, "Cookie", 64));
            this.milks.add(new Milk(this, {x: 0, y: 0}, "Milk", 64));
        }

        // this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height*4*0.46}, this.playerConfig);
        this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height*4*0.1}, this.playerConfig);
        this.player.setRaycaster(1);
        // this.player.getStateMachine().printTransitions = true;

        this.skeletons = new EnemyGroup(this, 6, this.walls, this.skeletonConfig);
        // this.skeletons.getChildren()[0].getStateMachine().printTransitions = true;

        this.player.getRaycaster().mapGameObjects(this.walls.walls.getChildren());
        // this.player.getRaycaster().mapGameObjects(this.skeleton, true );
        
        this.walls.setColliders(this.player, this.skeletons, this.cookies, this.milks);
        // this.walls.setColliders(this.player);

        this.cameras.main.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
        // this.cameras.main.setZoom(0.5, 1);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setScroll(0, 0);
       
        this.physics.world.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);

        // this.input.on("pointermove", (pointer) =>{
        //     this.sword.rotation = Phaser.Math.Angle.BetweenPoints(this.sword, {x: pointer.worldX, y: pointer.worldY}) + Math.PI/2;            
        // });
        this.currentRound = 1;

        this.roundText = this.add.text(10, 10, this.currentRound, { fontSize: '128px', fill: '#eb584d' });
        this.roundText.setScrollFactor(0);              
    }

    activateNextRound(){
        if(this.skeletons.getTotalUsed() == 0 && !this.creatingEnemies){
            console.log("Changing round")
             this.creatingEnemies = true;
            this.currentRound ++;
            this.tweens.add({
                targets: this.roundText,
                alpha: 0,
                ease: "Cubic",
                duration: 2000,
                onComplete: ()=>{
                    
                    this.tweens.add({
                        targets: this.roundText,
                        alpha: 1,
                        ease: "Sinusoidal",
                        duration: 4000,
                        onStart: ()=>{
                            this.roundText.text = this.currentRound;
                        }
                    })
                    this.createEnemies();
                }

            });
        }
    }

    createEnemies(){
        let skeleton = this.skeletons.getFirstDead();
        skeleton.reset();

        let x;
        let y;

        // do{
        //     x = getRndInteger(0, this.walls.wallNumberRatio.x);
        //     y = getRndInteger(0, this.walls.wallNumberRatio.y);
        // }while(this.walls.wallMatrix[x][y])
        
        x = getRndInteger(0, this.walls.wallNumberRatio.x);
        y = getRndInteger(0, this.walls.wallNumberRatio.y);

        skeleton.x = this.walls.blockSize*(x + 0.5);
        skeleton.y = this.walls.blockSize*(y + 0.5);

        this.creatingEnemies = false;
    }

    update(time, delta){
        this.player.update();
        this.skeletons.callAll("update");
        this.activateNextRound();
    }
}