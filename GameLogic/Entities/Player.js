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
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} defaultVelocity The default velocity for the Living sprite.
    * @param {Number} velocityMultiplier The runing velocity of the Player.
    * @param {Number} maxHealth The maximum health of the player.
    * 
    */
    constructor(scene, originInfo, playerImgStr, size, defaultVelocity, velocityMultiplier, maxHealth){
        super(scene, originInfo, playerImgStr, size, defaultVelocity);
        this.velocityMultiplier = velocityMultiplier;

        this.controls = this.getScene().input.keyboard.createCursorKeys();

       for(let key of ["w", "a", "s", "d", "r", "shift", "space", "enter", "esc"]) {
            this.controls[key.toLowerCase()] = this.getScene().input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }

        this.setBounce(0.2);

        this.setMaxHealth(maxHealth);

        // this.setSpriteSounds("player", "hurt", "death", "heal");

        this.roundsShot = 0;
        this.damageDealed = 0;
        this.damageReceived = 0;
        this.lastSwitchWeaponTimer = 0;
        this.creationTime = this.getScene().time.now;
    }

    /**
     * Sets the HUD object of the player.
     * @param {Object} canvasSize
     */
    setHUD(enemies = undefined){
        this.hud = new HUD(this.scene3D, enemies);
        this.hud.setHUDElementValue("health", this.getHealth(), true, "%");
    }

    /**
     * Gets the HUD object of the player.
     * @returns {HUD}
     */
    getHUD(){
        return this.hud;
    }

    /**
     * Sets the list of weapons of the player.
     * @param {Array<Object>} weapons
     */
    setWeapons(weapons){
        this.weapons = new Array(weapons.length);

        for(let [i, weapon] of weapons.entries()){
            this.weapons[i] = new Weapon(
                this.getScene3D(),
                {x: canvasSize.width/2, y: canvasSize.height*0.9},
                weapon.name,
                1000,
                weapon.bulletProperties,
                weapon.distanceLimits,
                weapon.animationParams
            )
            this.weapons[i].setProjectiles(this.getScene());
            this.weapons[i].setVisible(false);
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

    update(){
        this.move();
        this.jump();
        this.shoot();
        this.switchWeapons();
    }

    /**
     * This method allows the player to have the basic controls of movement according to the stablished parameters.
     * The movement only works through the key arrows.
     */
    move(){
        if(this.getVelocityX() == 0 && this.getVelocityY() == 0){
            this.play(this.getSpriteAnimations("Idle").getAnimationName(), true);
        }

        if(this.getDebug() === true){

        }     
    
        if((this.controls.up.isDown ^ this.controls.down.isDown) ^ (this.controls.w.isDown ^ this.controls.s.isDown)){
            if (this.controls.up.isDown || this.controls.w.isDown){
                //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
                // this.setVelocityX(this.getXcomponent());
                // this.setVelocityY(this.getYcomponent()); 

            }else if(this.controls.down.isDown || this.controls.s.isDown){    
                // this.setVelocityX(-this.getXcomponent());
                // this.setVelocityY(-this.getYcomponent());
            }

            if(this.getDebug() === true){
                // for(let ray of this.getSpriteRays().rays){
                //     ray.body.setVelocityX(this.getVelocityX());
                //     ray.body.setVelocityY(this.getVelocityY());
                // }
            }
        } 

        if((this.controls.left.isDown ^ this.controls.right.isDown) ^ (this.controls.a.isDown ^ this.controls.d.isDown)){
            if(this.body.onFloor()){
                this.play(this.getSpriteAnimations("Walk").getAnimationName(), true);
            }

            if (this.controls.left.isDown || this.controls.a.isDown){
                this.setVelocityX(-this.defaultVelocity);
                this.flipX= true;

            }else if(this.controls.right.isDown || this.controls.d.isDown){
                this.setVelocityX(this.defaultVelocity);
                this.flipX= false;
            }
        }else if(this.body.onFloor()){
            this.setVelocityX(0);
            this.play(this.getSpriteAnimations("Idle").getAnimationName());
        }

        // if(this.getDebug() === true){
        //     this.getSpriteRays().setInitialRayAngleOffset(this.getOriginInfo().angleOffset);
        // }
    }


    jump(){
        if(this.controls.space.isDown && this.body.onFloor()){
            this.play(this.getSpriteAnimations("Jump").getAnimationName(), true);
            this.setVelocityY(-600);
        }
    }

    shoot(){
        // if(this.controls.space.isDown){
        //     let time = this.getScene().time.now;

        //     if (time - this.lastShotTimer > this.getCurrentWeapon().getDelayBetweenShots()) {
        //         this.getCurrentWeapon().shootProjectile(this, this.getCurrentWeapon().getBulletVelocity());
        //         this.getHUD().setHUDElementValue("ammo", this.getCurrentWeapon().getProjectiles().countActive(false), false);

        //         this.lastShotTimer = time;
        //     }
        // }
    }

    /**
     * Allow the player to switch among the weapons.
     */
    switchWeapons(){
        // if(this.controls.shift.isDown){
        //     let time = this.getScene().time.now;
        //     if (time - this.lastSwitchWeaponTimer  > this.getCurrentWeapon().switchWeaponDelay) {
        //         this.getCurrentWeapon().playSwitchWeaponSound();

        //         this.getCurrentWeapon().setVisible(false);

        //         let index = this.weapons.indexOf(this.getCurrentWeapon());

        //         if(index == this.weapons.length - 1){
        //             this.setCurrentWeapon(this.weapons[0]);
        //         }else{
        //             this.setCurrentWeapon(this.weapons[index + 1]);
        //         }

        //         this.getCurrentWeapon().setVisible(true);

        //         this.lastShotTimer = 0;
        //         this.lastSwitchWeaponTimer = time;

        //         this.getHUD().setHUDElementValue("ammo", this.getCurrentWeapon().getProjectiles().countActive(false), false);
        //     }
        // }
    }
}