class Game extends Phaser.Scene{
    constructor(){
        super({key: "Game"});

    }

    //With the preload method we preload the sprites and we generate the object from the raycaster class.
    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("player", "./assets/Player/Sprites/Idle.png");

        let controls = this.input.keyboard.createCursorKeys();

       for(let key of ["w", "a", "s", "d", "r", "shift", "space", "enter", "esc"]) {
            controls[key] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }

        const PineSword = {
            name: "PineSword",
            type: "Melee",
            position: {x: 30, y: 10, angleOffset: Math.PI/4},
            size: {x: 54, y: 54},
            originPosition: {x: 0.5, y: 1},
            damage: 40,
            soundDir: "",
            spriteDir: "./assets/Player/Weapons/Pine Sword/Sprite/Pine Sword.png"
        }

        let weapons = [PineSword];

        this.playerConfig = {
            name: "player",
            size: {x: 80, y: 128},
            defaultVelocity: 200,
            velocityMultiplier: 2,
            maxHealth: 100,
            possibleStates: ["Idle", "Walk", "Jump", "Run", "Slide", "Attack", "Dead"],
            animations: [
                {name: "Idle", animationParams: {end: 16, framerate: 15}},
                {name: "Walk", animationParams: {end: 13, framerate: 30, repeat: -1}},
                {name: "Run", animationParams: {end: 11, framerate: 30, repeat: -1}},
                {name: "Jump", animationParams: {end: 16, framerate: 25}},
                {name: "Slide", animationParams: {end: 11, framerate: 15}},
                {name: "Dead", animationParams: {end: 17, framerate: 20}}
            ],
            controls: controls,
            slideCooldown: 2000,
            slideDuration: 500,
            slideDashAdder: 400,
            weapons: weapons
        }

        for(let animation of this.playerConfig.animations){
            let route = `./assets/Player/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`player_${animation.name}`, `${route}.png`, `${route}.json`);
        }

        for(let weapon of weapons){
            this.load.image(weapon.name, weapon.spriteDir);
        }

        this.load.image("skeleton", "./assets/Enemy/Skeleton/Sprites/Idle.png");

        let skeletonSounds = [
            {name: "Idle", amount: 3},
            {name: "Walk", amount: 4},
            {name: "Attack", amount: 5},
            {name: "Damaged", amount: 4},
            {name: "Dead", amount: 1}
        ];
        let skeletonSoundsRoute = "assets/Enemy/Skeleton/Sounds/"
        let skeletonSoundsNames = [];
        for(let sound of skeletonSounds){
            for(let i = 0; i < sound.amount; i++){
                let fullname = sound.amount > 1 ? `${sound.name}_${i + 1}`: sound.name;
                skeletonSoundsNames.push(fullname);
                this.load.audio(`skeleton_${fullname}`, `${skeletonSoundsRoute}${fullname}.mp3`);
            }
        }
 
        this.skeletonConfig = {
            name: "skeleton",
            size: {x: 20, y: 48},
            defaultVelocity: 100,
            velocityMultiplier: 1.5,
            maxHealth: 300,
            chaseDistance: 500,
            attackDistance: 100,
            damage: 5,
            attackDelay: 1000,
            attackRate: 850,
            hitFrame: 6,
            swordHitBoxInfo: {x: 50, y: 16, width: 50, height: 40},
            possibleStates: ["Idle", "Patrol", "Chase", "Search", "Attack", "Block", "Damaged","Stunned", "Dead"],
            animations: [
                {name: "Idle", animationParams: {end: 4, framerate: 10}},
                {name: "Walk", animationParams: {end: 4, framerate: 10, repeat: -1}},
                {name: "Attack", animationParams: {end: 8, framerate: 30}},
                {name: "Blocking", animationParams: {end: 4, framerate: 15}},
                {name: "Damaged", animationParams: {end: 4, framerate: 15}},
                {name: "Dead", animationParams: {end: 4, framerate: 15}}
            ],
            sounds: skeletonSoundsNames
        }

        for(let animation of this.skeletonConfig.animations){
            let route = `./assets/Enemy/Skeleton/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`skeleton_${animation.name}`, `${route}.png`, `${route}.json`);
        }
    }

    create(){
        // this.game.config.fps = 120;
        this.grid = this.add.grid(0, 0, canvasSize.width*4, canvasSize.height*4, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();
                
        this.walls = new WallsBuilder(this, "wall", 32, 40, true, true);
        this.walls.createWalls();

        this.player = new Player(this, {x: canvasSize.width/2, y: canvasSize.height*4*0.45}, this.playerConfig);
        this.player.setRaycaster(1);
        
        this.playerText = this.add.text(100, 420, `${this.player.health}`, {
            fontSize: '48px',
            fill: '#000000'
        });

        // this.skeleton = new Skeleton(this, {x: canvasSize.height*4*0.015, y: canvasSize.height*4*0.8}, this.skeletonConfig);

        this.skeletons = new EnemyGroup(this, 4, this.walls, this.skeletonConfig);

        this.player.getRaycaster().mapGameObjects(this.walls.walls.getChildren());
        // this.player.getRaycaster().mapGameObjects(this.skeleton, true );
        
        this.walls.setColliders(this.player, this.skeletons);

        this.cameras.main.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
        // this.cameras.main.setZoom(0.5, 1);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
       

        this.physics.world.setBounds(0, 0, canvasSize.width*2, canvasSize.height*2);
    }

    update(time, delta){
        this.player.update();
        this.skeletons.callAll("update");
        // this.skeleton.update();

        this.playerText.x = this.player.x - 50;
        this.playerText.y = this.player.y - 100;
        this.playerText.text = `${this.player.health}`;
    }
}