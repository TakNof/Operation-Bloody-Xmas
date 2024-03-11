class Game extends GeneralGameScene{
    constructor(){
        super("Game");

    }
    
    create(){
        // this.game.config.fps = 120;
        this.grid = this.add.grid(0, 0, canvasSize.width*4, canvasSize.height*4, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();
                
        this.walls = new WallsBuilder(this, "wall", 64, 20, true, false );
        this.walls.createWalls();

        // this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height*4*0.46}, this.playerConfig);
        this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height*4*0.1}, this.playerConfig);
        this.player.setRaycaster(1);
        // this.player.getStateMachine().printTransitions = true;
    
        // this.skeleton = new Skeleton(this, {x: canvasSize.height*4*0.015, y: canvasSize.height*4*0.8}, this.skeletonConfig);

        this.skeletons = new EnemyGroup(this, 2, this.walls, this.skeletonConfig);

        this.player.getRaycaster().mapGameObjects(this.walls.walls.getChildren());
        // this.player.getRaycaster().mapGameObjects(this.skeleton, true );
        
        this.walls.setColliders(this.player, this.skeletons);
        // this.walls.setColliders(this.player);

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
        this.skeletons.callAll("update");  
   }
}