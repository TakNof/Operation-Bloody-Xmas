class Game extends Phaser.Scene{
    constructor(){
        super({key: "Game"});

    }

    //With the preload method we preload the sprites and we generate the object from the raycaster class.
    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("player", "./assets/Player/Sprites/Idle.png");

        this.playerAnimations = [
            {name: "Idle", animationParams: {end: 16, framerate: 15}},
            {name: "Walk", animationParams: {end: 13, framerate: 30, repeat: -1}},
            {name: "Run", animationParams: {end: 11, framerate: 30, repeat: -1}},
            {name: "Jump", animationParams: {end: 16, framerate: 25}},
            {name: "Slide", animationParams: {end: 11, framerate: 15}},
            {name: "Dead", animationParams: {end: 17, framerate: 15}}
        ];

        for(let animation of this.playerAnimations){
            let route = `./assets/Player/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`player_${animation.name}`, `${route}.png`, `${route}.json`);
        }

        const PineSword = {
            name: "PineSword",
            type: "Melee",
            position: {x: 30, y: 10, angleOffset: Math.PI/4},
            size: {x: 54, y: 54},
            config: {
                originPosition: {x: 0.5, y: 1}
            },
            soundDir: "",
            spriteDir: "./assets/Player/Weapons/Pine Sword/Pine Sword.png"
        }

        this.weapons = [PineSword];

        for(let weapon of this.weapons){
            this.load.image(weapon.name, weapon.spriteDir);
        }

        this.load.image("skeleton", "/assets/Enemy/Skeleton/Sprites/Idle.png");

        this.skeletonAnimations = [
            {name: "Idle", animationParams: {end: 4, framerate: 10}},
            {name: "Walk", animationParams: {end: 4, framerate: 10, repeat: -1}},
            {name: "Attack", animationParams: {end: 8, framerate: 30}},
            {name: "Blocking", animationParams: {end: 4, framerate: 15}},
            {name: "Damaged", animationParams: {end: 4, framerate: 15}},
            {name: "Dead", animationParams: {end: 4, framerate: 15}}
        ];

        for(let animation of this.skeletonAnimations){
            let route = `./assets/Enemy/Skeleton/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`skeleton_${animation.name}`, `${route}.png`, `${route}.json`);
        }
    }

    create(){
        this.grid = this.add.grid(0, 0, canvasSize.width*4, canvasSize.height*4, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();
                
        this.walls = new WallsBuilder(this, "wall", 32, 20, true, false);
        this.walls.createWalls();

        this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height*4*0.8}, "player", {x: 80, y: 128}, 200, 2, 100);
        this.player.setWeapons(this.weapons);
        this.player.setSpriteAnimations(this.playerAnimations);
        this.player.setStateMachine("Idle", "Walk", "Jump", "Run", "Slide", "Attack", "Dead");
        this.player.setRaycaster(1);
    
        console.log(this.player.getRaycaster());

        let skeletonConfig = {
            health: 300,
            chaseDistance: 500,
            attackDistance: 100,
            attackDelay: 3000,
            damage: 40,
            attackRate: 1000
        }
    
        this.skeleton = new Skeleton(this, {x: canvasSize.height*4*0.015, y: canvasSize.height*4*0.8}, "skeleton", {x: 20, y: 48}, 100, skeletonConfig);
        this.skeleton.setSpriteAnimations(this.skeletonAnimations);
        this.skeleton.setStateMachine("Idle", "Patrol", "Chase", "Search", "Attack", "Block", "Damaged", "Dead");
        this.skeleton.getStateMachine().reportTransitions = true;
        this.skeleton.setScale(2, 2);

        console.log(this.skeleton);

        this.player.getRaycaster().mapGameObjects(this.walls.walls.getChildren());
        this.player.getRaycaster().mapGameObjects(this.skeleton, true );
        
        this.walls.setColliders(this.player, this.skeleton);

        this.cameras.main.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
        this.cameras.main.setZoom(0.5, 1);
        this.cameras.main.startFollow(this.player);
       

        this.physics.world.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
    }

    update(time, delta){
        this.player.update();
        this.skeleton.update();
    }
}