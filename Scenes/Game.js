class Game extends GeneralGameScene{
    constructor(){
        super({key: "Game"});

    }
    
    create(){
        // this.game.config.fps = 120;
        this.grid = this.add.grid(0, 0, canvasSize.width*4, canvasSize.height*4, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();
                
        this.walls = new WallsBuilder(this, "wall", 32, 40, true, true );
        this.walls.createWalls();

        this.player = new Player(this, {x: canvasSize.width/2, y: 0}, this.playerConfig);
        this.player.setRaycaster(1);
        this.player.getStateMachine().printTransitions = true;
        
        this.playerText = this.add.text(100, 420, `${this.player.health}`, {
            fontSize: '48px',
            fill: '#000000'
        });

        // this.skeleton = new Skeleton(this, {x: canvasSize.height*4*0.015, y: canvasSize.height*4*0.8}, this.skeletonConfig);

        // this.skeletons = new EnemyGroup(this, 1, this.walls, this.skeletonConfig);

        this.player.getRaycaster().mapGameObjects(this.walls.walls.getChildren());
        // this.player.getRaycaster().mapGameObjects(this.skeleton, true );
        
        // this.walls.setColliders(this.player, this.skeletons);
        this.walls.setColliders(this.player)

        this.cameras.main.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
        // this.cameras.main.setZoom(0.5, 1);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
       

        this.physics.world.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);

        // this.input.on("pointermove", (pointer) =>{
        //     this.sword.rotation = Phaser.Math.Angle.BetweenPoints(this.sword, {x: pointer.worldX, y: pointer.worldY}) + Math.PI/2;            
        // });
    }

    update(time, delta){
        this.player.update();
        // this.skeletons.callAll("update");
        // console.log(this.sword.angle);
        // console.log(this.player.isLanding);
        // this.skeleton.update();

        this.playerText.x = this.player.x - 50;
        this.playerText.y = this.player.y - 100;
        this.playerText.text = `${this.player.health}`;
    }
}