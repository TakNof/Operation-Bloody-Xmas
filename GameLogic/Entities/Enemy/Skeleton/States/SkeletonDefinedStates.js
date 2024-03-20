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
        if(Phaser.Math.Between(1, 10) == 1){
            this.soundConfig = `Idle_${Phaser.Math.Between(1, 3)}`;
            if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying){
                this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
            }
        }
        
        this.timeout = this.enemy.getScene().time.delayedCall(Phaser.Math.Between(2, 3)*1000, () =>{
            this.enemy.getStateMachine().transitionToState("Patrol");
        });
    }

    updateState(){
        this.enemy.setVelocityX(0);
        this.enemy.play(this.enemy.getSpriteAnimations("Idle"), true);
        
        if(this.enemy.playerInSight && this.enemy.getScene().player.isAlive){
            this.timeout.destroy();
            this.enemy.getStateMachine().transitionToState("Chase");

        }
    }

    exitState(){
        this.timeout = undefined;
    }

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
        const {defaultVelocity} = this.enemy.config;

        this.soundConfig = `Walk_${Phaser.Math.Between(1, 4)}`;
        this.enemy.flipX = !this.enemy.flipX;
        let sign = this.enemy.flipX ? -1: 1;
        this.enemy.setVelocityX(sign*defaultVelocity);

        this.interval = this.enemy.getScene().time.addEvent({
            delay: Phaser.Math.Between(1, 3)*1000,
            callback: ()=>{
                this.enemy.flipX = !this.enemy.flipX;
                let sign = this.enemy.flipX ? -1: 1;
                this.enemy.setVelocityX(sign*defaultVelocity);
            },
            callbackScope: this,
            loop: true
        });

        this.timeout = this.enemy.getScene().time.delayedCall(Phaser.Math.Between(4, 6)*1000, ()=>{
            if(this.interval){
                this.interval.remove();
                this.interval = undefined;
            }

            this.timeout.destroy();
            this.timeout = undefined;
            this.enemy.getStateMachine().transitionToState("Idle"); 
        })
    }

    updateState(){
        const {player} = this.enemy.scene
        
        this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
        if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying && this.enemy.body.onFloor()){
            this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
        }

        if(this.enemy.playerInSight && player.isAlive){
            this.interval.remove();
            this.timeout.destroy();

            this.interval = undefined;
            this.timeout = undefined;
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
        this.soundConfig = `Walk_${Phaser.Math.Between(1, 4)}`;
        this.enemy.getPathFinder().refreshTarget();
        if(this.enemy.body.onFloor()){
            this.enemy.getPathFinder().setPath();
        }
        this.enemy.getPathFinder().getPathCallInterval().paused = false;
        this.enemy.displayIndicativeTextTween("!!!", 3000);
    }

    updateState(){
        const {player} = this.enemy.getScene();

        this.enemy.getPathFinder().refreshTarget();
        if(this.enemy.getDistanceToPlayer() <= this.enemy.config.attackDistance && player.isAlive){
            this.enemy.getStateMachine().transitionToState("Attack");
        }else if(!this.enemy.playerInSight && player.isAlive){
            this.enemy.getPathFinder().targetLastSeenPosition = player.getPosition();
            this.enemy.getStateMachine().transitionToState("Search");
        }else if(this.enemy.getPathFinder().path){
            this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
            if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying && this.enemy.body.onFloor()){
                this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
            }
            this.enemy.moveToPoint();
        }
    }

    exitState(){
        this.enemy.getPathFinder().getPathCallInterval().paused = true;
    }

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
        this.soundConfig1 = `Idle_${Phaser.Math.Between(1, 3)}`;
        this.soundConfig2 = `Walk_${Phaser.Math.Between(1, 4)}`;
        this.searchTimer = this.enemy.scene.time.delayedCall(10000, () => {
            console.log("Unable to reach player");
            this.enemy.getPathFinder().unableToReachTarget = false;
        }, [], this);

        if(this.enemy.body.onFloor()){
            this.enemy.getPathFinder().setPath();
        }
        this.enemy.getPathFinder().getPathCallInterval().paused = false;
        
        this.reachedPlayerLastSeenPosition = false;
    }

    updateState(){
        if(this.enemy.playerInSight){
            if(this.interval){
                this.interval.remove();
                this.timeout.destroy();

                this.interval = undefined;
                this.timeout = undefined;
            }
            this.enemy.getPathFinder().targetLastSeenPosition = undefined;
            this.enemy.getStateMachine().transitionToState("Chase");
        }
        
        if((Phaser.Math.Distance.BetweenPoints(this.enemy.getPosition(), this.enemy.getPathFinder().target) <= 10 && !this.enemy.playerInSight) || this.enemy.getPathFinder().unableToReachTarget){
            this.reachedPlayerLastSeenPosition = true;
            this.enemy.getPathFinder().reset();
                    
            this.enemy.setVelocityX(0);
            this.enemy.play(this.enemy.getSpriteAnimations("Idle"), true);
            
            if(!this.interval || this.interval.paused){
                let searchStateTime = Phaser.Math.Between(4, 6)*1000;

                this.enemy.displayIndicativeTextTween("???", searchStateTime);

                this.interval = this.enemy.getScene().time.addEvent({
                    delay: Phaser.Math.Between(1, 3)*1000,
                    callback: ()=>{
                        this.enemy.flipX = !this.enemy.flipX;
                        this.enemy.getSpriteSounds(this.soundConfig1).playSound(this.enemy.getPosition());
                    },
                    callbackScope: this,
                    loop: true
                });

                this.timeout = this.enemy.getScene().time.delayedCall(searchStateTime, () =>{
                    this.interval.remove();
                    this.timeout.destroy();

                    this.interval = undefined;
                    this.timeout = undefined;

                    this.enemy.getStateMachine().transitionToState("Patrol");
                    this.enemy.lastAttackTimer = this.enemy.scene.time.now + this.enemy.config.attackDelay;
                })
            }

        }else if(!this.reachedPlayerLastSeenPosition && this.enemy.getPathFinder().path){
            this.enemy.play(this.enemy.getSpriteAnimations("Walk"), true);
            if(!this.enemy.getSpriteSounds(this.soundConfig2).sound.isPlaying && this.enemy.body.onFloor()){
                this.enemy.getSpriteSounds(this.soundConfig2).playSound(this.enemy.getPosition());
            }
            this.enemy.moveToPoint();
        }
    }

    exitState(){
        this.enemy.getPathFinder().unableToReachTarget = false;

        this.searchTimer.destroy();
        this.searchTimer = undefined;
    }

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
        this.enemy.getPathFinder().reset();
        this.soundConfig1 = `Idle_${Phaser.Math.Between(1, 3)}`;
        this.idleAnim = true;
    }

    updateState(){
        this.enemy.setVelocityX(0);
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
                this.soundConfig2 = `Attack_${Phaser.Math.Between(1, 5)}`;
                this.enemy.play(this.enemy.getSpriteAnimations("Attack"));

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
            this.enemy.lastAttackTimer = this.enemy.scene.time.now + this.enemy.config.attackRate;
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
            this.enemy.getStateMachine().transitionToState("Run");
        }else{
            this.enemy.getStateMachine().transitionToState("Walk");
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
        this.soundConfig = `Damaged_${Phaser.Math.Between(1, 4)}`;
        this.enemy.play(this.enemy.getSpriteAnimations("Damaged"), true);
        if(!this.enemy.getSpriteSounds(this.soundConfig).sound.isPlaying){
            this.enemy.getSpriteSounds(this.soundConfig).playSound(this.enemy.getPosition());
        }

        this.enemy.addDamagedTimeToHistory();
        this.enemy.checkStunning();
        this.enemy.on(`animationcomplete-${this.enemy.getSpriteAnimations("Damaged")}`, (anim, frame)=>{
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

        if(Phaser.Math.Between(1, 2) == 1){
            let itemIsMilk = Phaser.Math.Between(1, 3) < 2;

            let item;
            if(itemIsMilk){
                item = this.enemy.scene.milks.get();
            }else{
                item = this.enemy.scene.cookies.get();
            }

            if(item){
                item.setActive(true);
                item.setVisible(true);
                
                item.x = this.enemy.x;
                item.y = this.enemy.y;
            }
            
        }

        setTimeout(() => {
            this.enemy.getScene().tweens.add({
                targets: this.enemy,
                alpha: 0,
                duration: 5000,
                ease: "Cubic",
                onComplete: () => {
                    this.enemy.disable();
                    this.enemy.getPathFinder().cleanPathMarkers();
                    this.enemy.getPathFinder().clearPath();
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