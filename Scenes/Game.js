class Game extends GeneralGameScene{
    constructor(){
        super("Game");

    }
    
    create(){
        this.game.config.fps = 120;
                        
        this.map = this.make.tilemap({ key: "map" });
        this.tiles = this.map.addTilesetImage("Level1.png", "tiles");

        this.bgLayer = this.map.createLayer("Background", this.tiles, 0, 0);
        this.mgLayer = this.map.createLayer("Midground", this.tiles, 0, 0);

        this.collisionLayer = this.mgLayer;

        this.collisionLayer.setCollisionByExclusion([-1]);

        this.pathFindingGrid = [];
        for (let y = 0; y < this.map.height; y++) {
            let col = [];
            for (let x = 0; x < this.map.width; x++) {
                if(!this.collisionLayer.getTileAt(x, y) && this.collisionLayer.getTileAt(x, y+1)){
                    let tileRight = this.collisionLayer.getTileAt(x+1, y+1);
                    let tileLeft = this.collisionLayer.getTileAt(x-1, y+1);
                    if((tileRight && !tileLeft) || (!tileRight && tileLeft) || (!tileRight && !tileLeft)){
                        col.push(1);
                    }else{
                        col.push(0);
                    }
                }else if(this.collisionLayer.getTileAt(x, y)){
                    col.push(10);
                }else{
                    col.push(2);
                }

                // this.add.text(x*64 + 32, y*64 + 32, `${col[x]}`, {
                //     fontSize: '24px',
                //     fill: '#ffffff'
                // });
            }
            this.pathFindingGrid.push(col);
        }

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
            this.cookies.add(new Cookie(this, {x: 0, y: 0}));
            this.milks.add(new Milk(this, {x: 0, y: 0}));
        }

        this.player = new Player(this, {x: 0, y: 0}, this.playerConfig);
        this.player.setPositionInFreeSpace();
        // this.player.setScale(0.5);
        // this.player.getStateMachine().printTransitions = true;

        this.skeletons = new EnemyGroup(this, 5, 10,  this.skeletonConfig);
        // this.skeletons.getChildren()[0].getStateMachine().printTransitions = true;

        // this.player.getRaycaster().mapGameObjects(this.walls.walls.getChildren());
        this.player.getRaycaster().mapGameObjects(this.skeletons.getChildren(), true );
        this.skeletons.children.iterate((skeleton) =>{
            skeleton.getRaycaster().mapGameObjects(this.player, true);
        })

        this.setCollidersWithTilemap(this.player, this.skeletons, this.cookies, this.milks);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // this.cameras.main.setZoom(0.5, 1);  
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setScroll(0, 0);
       
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // this.input.on("pointermove", (pointer) =>{
        //     this.sword.rotation = Phaser.Math.Angle.BetweenPoints(this.sword, {x: pointer.worldX, y: pointer.worldY}) + Math.PI/2;            
        // });
        this.currentRound = 1;

        this.roundText = this.add.text(10, 10, this.currentRound, { fontSize: '128px', fill: '#eb584d' });
        this.roundText.setScrollFactor(0);

        this.physics.world.on('worldbounds', (body)=>{
            body.gameObject.setPositionInFreeSpace();
        })

    }

    activateNextRound(){
        if(this.allEnemiesEliminated && !this.activatingRound){
            console.log("Changing round")
            this.activatingRound = true;
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
                            this.creatingEnemies = true;                            
                        }
                    })
                }

            });
        }

        if(this.creatingEnemies){
            this.createEnemies();
        }
    }

    createEnemies(){
        let skeleton = this.skeletons.getFirstDead();
        if(skeleton){
            skeleton.reset();
        }else{
            this.allEnemiesEliminated = false
            this.creatingEnemies = false;
            this.activatingRound = false;
        }
    }

    setCollidersWithTilemap(){
        for(let element of arguments){
            this.physics.add.collider(element, this.collisionLayer);
        }
    }

    update(time, delta){
        this.player.update();
        this.skeletons.callAll("update");
        this.activateNextRound();
        if(this.skeletons.getTotalUsed() == 0){
           this.allEnemiesEliminated = true;
        }
    }
}