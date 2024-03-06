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
        super(scene, originInfo, config.name, config.size, config.defaultVelocity);
        this.config = config;
        this.setOrigin(this.config.spriteOrigin.x, this.config.spriteOrigin.y);
        this.setBounce(0.1);

        this.setMaxHealth(config.maxHealth);
        this.setStateMachine(...config.possibleStates);
        this.setSpriteAnimations(config.animations);
        this.setWeapons(config.weapons);
        // console.log(this.width - this.body.width, this.height - this.body.height);
        // this.setOffset(this.width - this.body.width, this.height - this.body.height);
        // this.setOffset(this.body.width/2, 0);
        // this.setOffset();

        this.pressedKeyHistory = [];
        this.lastSlideTimer = -config.slideCooldown;
        this.isLanding = false;
        
        this.getScene().input.keyboard.on('keydown', (event) => {
            if(this.config.controls[event.key.toLowerCase()])
                this.addkeyToHistory(event.key.toLowerCase());
        });

        this.getScene().input.on('pointerdown', function (pointer){
            if(pointer.leftButtonDown() && this.player.getStateMachine().currentState.stateKey != "Attack" && this.player.isAlive){
                this.player.getStateMachine().transitionToState("Attack");
            }
        }, this.getScene());
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
            this.addChild(this.weapons[i]);
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
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;
        this.getScene().physics.collide(this, shooter.getProjectiles2D(),
            function(sprite, projectile){
                let index = shooter.getProjectiles2D().getChildren().indexOf(projectile);
                let projectile3D = shooter.getProjectiles3D().getChildren()[index];
                thisObject.__checkDamage(
                    projectile,
                    projectile3D,
                    shooter.getBulletProperties(),
                    shooter.getDistanceLimits(),
                    shooter.getDistanceToPlayer()
                );
            }
        );
    }

    /**
     * This method is called when a projectile has collided with a living sprite,
     * here he health and the state of the living sprite is determined by the
     * damage and limit distances of the projected projectiles.
     * @param {Projectile} projectile 
     * @param {Number} damage 
     * @param {Object} distanceLimits 
     * @param {Number} currentDistance
     */
    __checkDamage(projectile, projectile3D, bulletProperties, distanceLimits, currentDistance){
        projectile.body.reset(-100, -100); 

        projectile.setActive(false);
        projectile.setVisible(false);

        projectile3D.body.reset(-100, -100); 

        projectile3D.setActive(false);
        projectile3D.setVisible(false);

        let damage = bulletProperties.damage;

        if(currentDistance > distanceLimits.min && currentDistance < distanceLimits.max){
            damage *= 220/currentDistance;
            // console.log(`${this} Normal damage ${damage}`);
        }else if(currentDistance >= distanceLimits.max){
            damage *= 1/distanceLimits.max;
            // console.log(`${this} Minimal damage ${damage}`);
        }else if(currentDistance <= distanceLimits.min){
            damage *= bulletProperties.critical * 220/currentDistance;
            // console.log(`${this} Critical damage ${damage}`);
        }

        this.addDamageReceived(damage);

        if(this.getHealth() - damage <= 0){
            this.setHealth(0);
            
            this.getSpriteSounds("death").playSound();

            this.isAlive = false;

        }else{
            this.getSpriteSounds("hurt").playSound();
            this.getHUD().displayHurtRedScreen();
            this.setHealth(this.getHealth() - damage);
        }

        this.getHUD().setHUDElementValue("health", this.getHealth(), true, "%");
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

    update(){
        this.getStateMachine().update();
        this.getScene().sound.listenerPosition.set(this.getPositionX(), this.getPositionY());
        for(let ray of this.getRaycaster().rays){
            ray.setOrigin(this.getPositionX(), this.getPositionY());
            ray.cast()
        }
    }
}