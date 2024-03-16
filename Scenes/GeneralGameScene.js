class GeneralGameScene extends Phaser.Scene{
    constructor(key){
        super({key: key});
    }

    preload(){
        this.load.image("wall", "./assets/Base Tile.png", {frameWidth: 64, frameHeight: 64});
        this.load.image("player", "./assets/Player/Sprites/Idle.png");

        let controls = this.input.keyboard.createCursorKeys();

       for(let key of ["w", "a", "s", "d", "r", "shift", "space", "enter", "esc"]) {
            controls[key] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }

        let PineSwordSounds = [
            {name: "Hit", amount: 3},
            {name: "Swing", amount: 1},
        ];
        const PineSword = {
            name: "pineSword",
            type: "Melee",
            size: {x: 42, y: 96},
            position: {x: 30, y: 10, angleOffset: Math.PI/4},
            originPosition: {x: 0.5, y: 0.5},
            hitBoxConfig:{
                position: {x: 40, y: -20},
                size: {x: 80, y: 150}
            },
            damage: 50,
            hitFrame: 6,
            sounds: this.loadAudios("pineSword", "./assets/Player/Weapons/Pine Sword/Sounds/", PineSwordSounds),
            spriteDir: "./assets/Player/Weapons/Pine Sword/Sprite/Pine Sword.png"
        }

        let weapons = [PineSword];

        let playerSounds = [
            {name: "Walk", amount: 1},
            {name: "Run", amount: 1},
        ];

        this.playerConfig = {
            name: "player",
            size: {x: 50, y: 128},
            originPosition: {x: 0.5, y: 0.5},
            defaultVelocity: 200,
            velocityMultiplier: 2,
            maxHealth: 100,
            maxShield: 150,
            jumpConfig: {
                jumpFrame: 3,
                jumpVelocity: -650,
            },
            slideConfig: {
                slideFrame: 3,
                slideCooldown: 2000,
                slideDuration: 500,
                slideDashAdder: 400,
            },
            possibleStates: ["Idle", "Walk", "Jump", "Fall", "Land", "Run", "Slide", "Attack", "Dead"],
            animations: [
                {name: "Idle", animationParams: {end: 5, framerate: 15}},
                {name: "Walk", animationParams: {end: 14, framerate: 30, repeat: -1}},
                {name: "Run", animationParams: {end: 15, framerate: 30, repeat: -1}},
                {name: "Jump", animationParams: {end: 11, framerate: 15}},
                {name: "Fall", animationParams: {end: 5, framerate: 12, repeat: -1}},
                {name: "Land", animationParams: {end: 11, framerate: 20,}},
                {name: "Slide", animationParams: {end: 5, framerate: 30}},
                {name: "Attack", animationParams: {end: 11, framerate: 30}},
                {name: "Dead", animationParams: {end: 16, framerate: 20}}   
            ],
            controls: controls,
            weapons: weapons,
            sounds: this.loadAudios("player", "./assets/Player/Sounds/", playerSounds),
        }

        for(let animation of this.playerConfig.animations){
            let route = `./assets/Player/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`player_${animation.name}`, `${route}.png`, `${route}.json`);
        }

        for(let weapon of weapons){
            this.load.image(weapon.name, weapon.spriteDir);
        }

        this.load.image("Cookie", "./assets/Items/Cookie.png");
        this.load.image("Milk", "./assets/Items/Milk.png");

        this.load.image("skeleton", "./assets/Enemy/Skeleton/Sprites/Idle.png");

        let skeletonSounds = [
            {name: "Idle", amount: 3},
            {name: "Walk", amount: 4},
            {name: "Attack", amount: 5},
            {name: "Damaged", amount: 4},
            {name: "Dead", amount: 1}
        ];

        this.skeletonConfig = {
            name: "skeleton",
            size: {x: 20, y: 48},
            originPosition: {x: 0.5, y: 0.5},
            defaultVelocity: 100,
            velocityMultiplier: 1.5,
            maxHealth: 300,
            chaseDistance: 500,
            attackDistance: 100,
            damage: 20,
            attackDelay: 1000,
            attackRate: 850,
            hitFrame: 6,
            swordHitBoxInfo: {x: 50, y: 16, width: 50, height: 40},
            possibleStates: ["Idle", "Patrol", "Chase", "Search", "Attack", "Block", "Damaged","Stunned", "Dead"],
            animations: [
                {name: "Idle", animationParams: {end: 3, framerate: 10}},
                {name: "Walk", animationParams: {end: 3, framerate: 10, repeat: -1}},
                {name: "Attack", animationParams: {end: 7, framerate: 30}},
                {name: "Blocking", animationParams: {end: 3, framerate: 15}},
                {name: "Damaged", animationParams: {end: 3, framerate: 15}},
                {name: "Dead", animationParams: {end: 3, framerate: 15}}
            ],
            sounds: this.loadAudios("skeleton", "./assets/Enemy/Skeleton/Sounds/", skeletonSounds),
        }

        for(let animation of this.skeletonConfig.animations){
            let route = `./assets/Enemy/Skeleton/Animations/${animation.name}/${animation.name}`;
            this.load.atlas(`skeleton_${animation.name}`, `${route}.png`, `${route}.json`);
        }

        this.load.spritesheet("tiles", "./assets/Tileset/tilesetfonseca.png", { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON("map","assets/Tileset/escenario.json");
    }

    /**
     * 
     * @param {String} spriteName The name of the asociated sprite to relate the sound.
     * Eg: If you're creating the sounds for the player, you have to put here "player".
     * @param {String} route The route where the sounds are located
     * @param {JSON} listOfSoundsParameters A json with the parameters of the sounds you wish to create.
     * @return {Array<String>} An array with the sounds' names.
     */
    loadAudios(spriteName, route, listOfSoundsParameters){
        let soundNames = [];
        for(let sound of listOfSoundsParameters){
            for(let i = 0; i < sound.amount; i++){
                let fullname = sound.amount > 1 ? `${sound.name}_${i + 1}`: sound.name;
                soundNames.push(fullname);
                this.load.audio(`${spriteName}_${fullname}`, `${route}${fullname}.mp3`);
            }
        }

        return soundNames;
    }
}