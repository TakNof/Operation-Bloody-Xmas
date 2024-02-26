class SkeletonIdleState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        if(getRndInteger(1, 10) == 1){
            this.soundConfig = `Idle_${getRndInteger(1, 3)}`;
            if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying){
                this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
            }
        }
        
        this.timeout = setTimeout(() =>{
            this.enemy.getStateMachine().transitionToState("Patrol");
        
        }, getRndInteger(2, 3)*1000)
    }

    updateState(){
        this.enemy.setVelocityX(0);
        this.enemy.play(this.enemy.getSpriteAnimations("Idle"), true);
        
        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.chaseDistance && this.enemy.getScene().player.isAlive){
            clearTimeout(this.timeout);
            this.enemy.getStateMachine().transitionToState("Chase");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonPatrolState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.soundConfig = `Walk_${getRndInteger(1, 4)}`;
        this.enemy.setVelocityX(-this.enemy.defaultVelocity);
        this.enemy.flipX = true;

        this.firstTimeout = setTimeout(() =>{
            this.enemy.setVelocityX(this.enemy.defaultVelocity);
            this.enemy.flipX = false;
            
            this.secondTimeout = setTimeout(() =>{
                this.enemy.stateMachine.transitionToState("Idle");                    
            }, getRndInteger(2, 3)*1000)
        }, getRndInteger(2, 3)*1000)
    }

    updateState(){
        const {player} = this.enemy.scene
        this.enemy.onWallFound();
        this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
        if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying && this.enemy.body.onFloor()){
            this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
        }

        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.chaseDistance && player.isAlive){
            clearTimeout(this.firstTimeout);
            clearTimeout(this.secondTimeout);
            this.enemy.getStateMachine().transitionToState("Chase");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonChaseState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.soundConfig = `Walk_${getRndInteger(1, 4)}`;
    }

    updateState(){
        const {player} = this.enemy.getScene();

        this.enemy.onWallFound();
        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.attackDistance && player.isAlive){
            this.enemy.getStateMachine().transitionToState("Attack");
        }else if(this.enemy.getDistanceToPlayer() >= this.enemy.config.chaseDistance && player.isAlive){
            this.enemy.lastPlayerSeenPosition = player.getPosition();
            this.enemy.getStateMachine().transitionToState("Search");
        }else{
            this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
            if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying && this.enemy.body.onFloor()){
                this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
            }

            this.enemy.flipX = player.getPositionX() < this.enemy.getPositionX();
            let sign = this.enemy.flipX ? -1: 1;

            this.enemy.setVelocityX(sign*this.enemy.defaultVelocity);
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonSearchState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.soundConfig1 = `Idle_${getRndInteger(1, 3)}`;
        this.soundConfig2 = `Walk_${getRndInteger(1, 4)}`;
    }

    updateState(){
        this.enemy.onWallFound();
        this.reachedPlayerLastSeenPosition = false;

        if(Math.abs(this.enemy.lastPlayerSeenPosition.x - this.enemy.getPositionX()) <= 10 && this.enemy.getDistanceToPlayer() > this.enemy.config.chaseDistance){
            this.reachedPlayerLastSeenPosition = true;

            this.enemy.setVelocityX(0);
            this.enemy.play(this.enemy.getSpriteAnimations("Idle"), true);
            if(!this.enemy.getSpriteSounds(this.soundConfig1).sound.isPlaying && getRndInteger(1, 10) == 1){
                this.enemy.getSpriteSounds(this.soundConfig1).playSound(this.enemy.getPosition());
            }
            
            if(!this.interval){
                this.interval = setInterval(() =>{
                    this.enemy.flipX = !this.enemy.flipX;
                }, 2000);

                this.timeout = setTimeout(() =>{
                    clearInterval(this.interval);
                    this.enemy.getStateMachine().transitionToState("Patrol");
                }, getRndInteger(4, 6)*1000)
            }
        }else if(this.enemy.getDistanceToPlayer() <= this.enemy.config.chaseDistance){
            clearInterval(this.interval);
            clearTimeout(this.timeout);
            this.enemy.getStateMachine().transitionToState("Chase");
            

        }else if(!this.reachedPlayerLastSeenPosition){
            this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
            if(!this.enemy.getSpriteSounds(this.soundConfig2).sound.isPlaying && this.enemy.body.onFloor()){
                this.enemy.getSpriteSounds(this.soundConfig2).playSound(this.enemy.getPosition());
            }
            this.enemy.flipX = this.enemy.lastPlayerSeenPosition.x < this.enemy.getPositionX();
            let sign = this.enemy.flipX ? -1: 1;

            this.enemy.setVelocityX(sign*this.enemy.defaultVelocity);
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonAttackState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.soundConfig1 = `Idle_${getRndInteger(1, 3)}`;
        this.idleAnim = true;
        this.enemy.setVelocityX(0);
    }

    updateState(){
        const {scene, config, swordHitBox} = this.enemy;
        const {player} = this.enemy.getScene();
        this.updateChildren();

        if(this.idleAnim){
            this.enemy.play(this.enemy.getSpriteAnimations("Idle"), true);
            
        }
        
        this.enemy.flipX = player.getPositionX() < this.enemy.getPositionX();

        if(player.isAlive){
            let rangeAttack = this.enemy.getDistanceToPlayer() - this.enemy.config.attackDistance;
            if(rangeAttack > 20){
                this.enemy.getStateMachine().transitionToState("Chase");
            }else if(scene.time.now  - this.enemy.lastAttackTimer >= config.attackRate) {
                swordHitBox.body.enable = true;
                this.soundConfig2 = `Attack_${getRndInteger(1, 5)}`;
                this.enemy.play(this.enemy.getSpriteAnimations("Attack"))

                this.idleAnim =  false;
                this.enemy.lastAttackTimer = scene.time.now;
    
                this.enemy.on(`animationupdate`, (anim, frame) =>{
                    if(frame.index == config.hitFrame){
                        this.startHit();
                    }
                });
            }
        }else{
            this.enemy.getStateMachine().transitionToState("Patrol");
        }

        this.enemy.on(`animationcomplete-${this.enemy.getSpriteAnimations("Attack")}`, ()=>{
            this.idleAnim = true;
        })
    }

    exitState(){
        if(this.enemy.isStunned){
            this.enemy.lastAttackTimer = this.enemy.scene.time.now + this.enemy.config.attackDelay;
        }
    }

    getNextState(){
        return this.stateKey;
    }

    startHit(){
        const {scene, config, swordHitBox} = this.enemy;
        const {player} = this.enemy.getScene();
        if(scene.physics.overlap(swordHitBox, player) && player.isAlive){
            player.decreaseHealthBy(config.damage);
            swordHitBox.body.enable = false;
            
            if(!this.enemy.getSpriteSounds(this.soundConfig2).sound.isPlaying){
                this.enemy.getSpriteSounds(this.soundConfig2).playSound(this.enemy.getPosition());
            }
        }
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonBlockState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.enemy.setVelocityY(-600);
        this.enemy.play(this.enemy.getSpriteAnimations("Jump"), true);
    }

    updateState(){
        if(this.enemy.getStateMachine().getStateHistory()[this.enemy.getStateMachine().getStateHistory().length - 2] === "Run"){
            this.enemy.stateMachine.transitionToState("Run");
        }else{
            this.enemy.stateMachine.transitionToState("Walk");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonDamagedState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.soundConfig = `Damaged_${getRndInteger(1, 4)}`;
        this.enemy.play(this.enemy.getSpriteAnimations("Damaged"), true);
        if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying){
            this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
        }

        this.enemy.addDamagedTimeToHistory();
        this.enemy.checkStunning();
        this.enemy.on(`animationcomplete-${this.enemy.getSpriteAnimations("Damaged")}`, ()=>{
            if(this.enemy.isStunned){
                this.enemy.getStateMachine().transitionToState("Stunned");
            }else{
                this.enemy.getStateMachine().transitionToState("Attack");
            }
        })  
    }

    updateState(){}

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonStunnedState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){}

    updateState(){
        this.enemy.setVelocityX(0);
        this.enemy.play(this.enemy.getSpriteAnimations("Idle"), true);
        if(!this.enemy.isStunned){
            this.enemy.getStateMachine().transitionToState("Patrol");
        }
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}

class SkeletonDeadState extends EnemyState{
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {Object} key
     */
    constructor(enemy, key){
        super(enemy, key);
    }

    enterState(){
        this.soundConfig = "Dead";

        this.enemy.play(this.enemy.getSpriteAnimations("Dead"));
        if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying){
            this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
        }

        this.enemy.body.enable = false;

        setTimeout(() => {
            this.enemy.getScene().tweens.add({
                targets: this.enemy,
                alpha: 0,
                duration: 5000,
                ease: "Cubic",
                onComplete: () => {
                    this.enemy.destroyChildren();
                    this.enemy.destroy();
                },
            });
        }, 1000);
    }

    updateState(){
        this.enemy.setVelocityX(0);
    }

    exitState(){}

    getNextState(){
        return this.stateKey;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){}

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){}

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){}
}