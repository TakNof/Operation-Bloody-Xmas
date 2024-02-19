class Game extends Phaser.Scene{
    constructor(){
        super({key: "Game"});

    }

    //With the preload method we preload the sprites and we generate the object from the raycaster class.
    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("player", "./assets/Player/Sprites/Idle.png");

        this.playerAnimations = [
            {name: "Dead", animationParams: {end: 17, framerate: 15}},
            {name: "Idle", animationParams: {end: 16, framerate: 15}},
            {name: "Jump", animationParams: {end: 16, framerate: 25}},
            {name: "Run", animationParams: {end: 11, framerate: 30}},
            {name: "Slide", animationParams: {end: 11, framerate: 15}},
            {name: "Walk", animationParams: {end: 13, framerate: 30, repeat: -1}}
        ];

        for(let animation of this.playerAnimations){
            let route = `./assets/Player/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`player_${animation.name}`, `${route}.png`, `${route}.json`);
        }
    }

    create(){
        this.grid = this.add.grid(0, 0, canvasSize.width*2, canvasSize.height*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

        
        const PineSword = {
            name: "PineSword",
            type: "Melee",
            soundDir: "",
            spriteDir: "./assets/Player/Weapons/Pine Sword/Pine Sword.png"
        }

        const weapons = [PineSword];
                
        this.walls = new WallsBuilder(this, "wall", 32, 20, true, true);
        this.walls.createWalls();

        this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height/2}, "player", {x: 80, y: 128}, 200, 2, 100);
        this.player.setSpriteAnimations(this.playerAnimations);
        this.player.setStateMachine("Idle", ["Idle", "Jump", "Run", "Slide", "Walk", "Dead"]);
        // this.player.setStateMachine("Idle", ["Idle"]);
        
        console.log(this.player);
        console.log(this.player.getStateMachine());

        this.walls.setColliders(this.player);

        this.cameras.main.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
        this.cameras.main.startFollow(this.player);        
    }

    update(time, delta){
        this.player.update();
    }
}