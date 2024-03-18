 /**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the player/s.
 */
class Player extends Living{
    /**
    * The constructor of Player Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {Object} config The configuration object for the Enemy.
    * 
    */
    constructor(scene, originInfo, config){
        super(scene, originInfo, config);

        this.setWeapons(config.weapons);

        this.pressedKeyHistory = [];
        this.lastSlideTimer = -config.slideConfig.slideCooldown;
        this.isLanding = false;
        this.isAttacking = false;

        this.bodyMarker = this.scene.add.circle(this.x, this.y, 5, 0xb31714); //Red
        this.offsetMarker = this.scene.add.circle(this.x, this.y, 5, 0xd4c711); //yellow
        this.originMarker = this.scene.add.circle(this.x, this.y, 5, 0x11d445); //green

        this.playerText = this.scene.add.text(0, 0, `${this.health}`, {
            fontSize: '24px',
            fill: '#ffffff'
        });

        this.getScene().input.keyboard.on('keydown', (event) => {
            if(this.config.controls[event.key.toLowerCase()])
                this.addkeyToHistory(event.key.toLowerCase());
        });

        this.getScene().input.on('pointerdown', function (pointer){
            if(pointer.leftButtonDown() && this.player.getStateMachine().currentState.stateKey != "Attack" && !this.player.isAttacking && this.player.isAlive){
                this.player.getStateMachine().transitionToState("Attack");
            }
        }, this.getScene());

        // this.getScene().input.keyboard.createCombo('PHASER', { resetOnMatch: true });

        // this.getScene().input.keyboard.createCombo('TAKNOF', { resetOnMatch: true });

        // this.getScene().input.keyboard.on('keycombomatch', function (event) {
        //     console.log("phaser has been written: ");
        //     console.log(event);
        // });

    }

    flipXCustom(){
        this.flipX = !this.flipX;
        if(this.getRaycaster()){
            this.getRaycaster().ray.setAngle(this.getRaycaster().ray.angle + Math.PI); 
        }
    }

    /**
     * Sets the list of weapons of the player.
     * @param {Array<Object>} weapons
     */
    setWeapons(weapons){
        this.weapons = new Array(weapons.length);

        for(let [i, weapon] of weapons.entries()){
            let weaponClass = this.__checkClassConstructor(`${weapon.type}Weapon`, "Weapon");
            this.weapons[i] = new weaponClass(this.getScene(), weapon.position, weapon);
            this.weapons[i].setVisible(false);
            this.addChild(this.weapons[i].hitBox);
        }

        this.setCurrentWeapon(this.weapons[0]);        
    }

    /**
     * Gets the list of weapons of the player.
     * @returns {Array<Weapon>}
     */
    getWeapons(){
        return this.weapons;
    }

    /**
     * Sets the current weapon of the player.
     * @param {Weapon} weapon
     */
    setCurrentWeapon(weapon){
        this.currentWeapon = weapon;
        this.currentWeapon.setVisible(true);
    }

    /**
     * Gets the current weapon of the player.
     * @return {Weapon}
     */
    getCurrentWeapon(){
        return this.currentWeapon;
    }

    /**
     * Sets the time the player has been alive.
     */
    setTimeAlive(){
        this.timeAlive = (this.getScene().time.now - this.creationTime)/1000;
    }

    /**
     * Gets the time the player has been alive.
     * @returns {Number}
     */    
    getTimeAlive(){
        return this.timeAlive;
    }

    addDamageDealed(damage){
        this.damageDealed += damage;
    }

    getDamageDealed(){
        return this.damageDealed;
    }

    addDamageReceived(damage){
        this.damageReceived += damage;
    }

    getDamageReceived(){
        return this.damageReceived;
    }

    setScore(type){
        let score = {timeScore: 0, difficulty: 0, damageDealedScore: 0, damageReceivedScore: 0, totalScore: 0};
        let aux = ["I'm too young to die", "Hurt me Plenty", "Ultra-Violence", "Nightmare"];
        console.log(options.difficulty.setting)  ; 
        switch (type) {
            case "Victory":
                score.timeScore = `TIME ALIVE = ${Math.round(this.getTimeAlive())}s + BONUS`; 
                score.totalScore += (1000000/this.getTimeAlive());

                if(options.difficulty.setting == 0){
                    score.difficulty = `DIFICULTY = ${aux[options.difficulty.setting].toUpperCase()}, SCORE x${1}`;
                }else{
                    score.difficulty = `DIFICULTY = ${aux[options.difficulty.setting].toUpperCase()}, SCORE x${options.difficulty.setting * 10}`;
                }
                break;

            case "Defeat":
                score.timeScore = `TIME ALIVE = ${Math.round(this.getTimeAlive())}s`; 
                score.totalScore += this.getTimeAlive()*10;

                score.difficulty = `DIFICULTY = ${aux[options.difficulty.setting].toUpperCase()}`
                break;

            default:
                throw new Error("Invalid type: " + type);
        }
        
        score.damageDealedScore = `DAMAGE DEALED = ${Math.round(this.getDamageDealed())}`;
        score.damageReceivedScore = `DAMAGE RECIEVED = -${Math.round(this.getDamageReceived())}`;

        score.totalScore += this.getDamageDealed()*10;
        score.totalScore -= this.getDamageReceived()*10;

        if(type == "Victory"){
            if(options.difficulty.setting != 0){
                score.totalScore *= options.difficulty.setting * 10;
            }
        }
        
        this.score = score;
        this.score.totalScore = Math.round(score.totalScore/10)*10;
    }

    getScore(){
        return this.score;
    }

    addkeyToHistory(key){
        this.pressedKeyHistory.push(key);
        this.cleanPressedKeyHistory();
    }

    getPressedKeyHistory(){
        return this.pressedKeyHistory;
    }

    cleanPressedKeyHistory(){
        if(this.pressedKeyHistory.length > 5){
            this.pressedKeyHistory.shift();
        }
    }

    grabItem(){
        if(this.scene.cookies.getFirstAlive()){
            this.grabCookies();
        }

        if(this.scene.milks.getFirstAlive()){
            this.grabMilk();
        }
    }

    grabCookies(){
        this.scene.physics.overlap(this, this.scene.cookies, (player, cookie) =>{
            this.repairShield(cookie.ShieldRegenAmount);
            cookie.setVisible(false);
            cookie.setActive(false);

            cookie.x = 0;
            cookie.y = 0;
        });
    }

    grabMilk(){
        this.scene.physics.overlap(this, this.scene.milks, (player, milk) =>{
            this.heal(milk.HealthRegenAmount);
            milk.setVisible(false);
            milk.setActive(false);

            milk.x = 0;
            milk.y = 0;
        });

    }

    update(){
        this.getStateMachine().update();
        this.getScene().sound.listenerPosition.set(this.getPositionX(), this.getPositionY());

        this.grabItem();

        this.getRaycaster().ray.setOrigin(this.getPositionX(), this.getPositionY());
        this.getRaycaster().ray.cast();
        
        this.bodyMarker.setPosition(this.body.center.x, this.body.center.y);

        let offsetX = this.body.center.x - this.body.width/2;
        let offsetY = this.body.center.y - this.body.height/2;

        this.offsetMarker.setPosition(offsetX, offsetY);
        
        this.originMarker.setPosition((this.x-this.width/2) + this.width*this.getCustomSpriteOrigin().x, (this.y-this.height/2) + this.height*this.getCustomSpriteOrigin().y);

        this.playerText.x = this.x - 60;
        this.playerText.y = this.y - 100;
        this.playerText.text = `HP: ${this.getHealth()}, SH: ${this.getShield()}`;

        if(this.isAlive && !this.body.onFloor() && this.getStateMachine().currentState.stateKey !== "Fall" && this.getVelocityY() > 500){
            this.getStateMachine().transitionToState('Fall');
        }
    }    
}