class PlayerIdleState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){

        const {a, d, left, right, shift, space} = this.player.config.controls;

        this.player.setVelocityX(0);

        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && shift.isDown) {
            this.player.getStateMachine().transitionToState('Run');
        }else if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.player.getStateMachine().transitionToState('Walk');
        }
        
        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.getStateMachine().transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Idle"), true);
            }
        }

        this.updateChildren();
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

class PlayerWalkState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){
        const {a, d, left, right, shift, space} = this.player.config.controls;
        const {defaultVelocity} = this.player.config;

        if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
        }

        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(shift.isDown){
                this.player.stateMachine.transitionToState("Run");
            }else{
                this.player.play(this.player.getSpriteAnimations("Walk"), true);
            }
        }

        if(left.isDown || a.isDown){
            this.player.flipX= true;
        }else if(right.isDown || d.isDown){
            this.player.flipX= false;
        }

        let sign = this.player.flipX ? -1: 1;

        this.player.setVelocityX(sign*defaultVelocity);

        this.updateChildren();
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

class PlayerRunState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){}

    updateState(){
        const {scene} = this.player;
        const {a, s, d, left, down, right, shift, space} = this.player.config.controls;
        const {defaultVelocity, velocityMultiplier, slideCooldown, slideDashAdder} = this.player.config;

        if(left.isDown || a.isDown){
            this.player.flipX= true;

        }else if(right.isDown || d.isDown){
            this.player.flipX= false;
        }

        let sign = this.player.flipX ? -1: 1;

        this.player.setVelocityX(sign*defaultVelocity*velocityMultiplier);

        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(down.isDown ^ s.isDown && scene.time.now - this.player.lastSlideTimer >= slideCooldown){
                this.player.lastSlideTimer = scene.time.now;
                
                this.player.setVelocityX(sign*(defaultVelocity*velocityMultiplier + slideDashAdder));
                this.player.stateMachine.transitionToState("Slide");
            }else{
                this.player.play(this.player.getSpriteAnimations("Run"), true);
            }
        }
        
        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.player.stateMachine.transitionToState('Walk');
        }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
        }

        this.updateChildren();
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

class PlayerJumpState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.setVelocityY(-600);
        this.player.play(this.player.getSpriteAnimations("Jump"), true);
    }

    updateState(){
        if(this.player.getStateMachine().getStateHistory()[this.player.getStateMachine().getStateHistory().length - 2] === "Run"){
            this.player.stateMachine.transitionToState("Run");
        }else{
            this.player.stateMachine.transitionToState("Walk");
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

class PlayerSlideState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.setFrictionX(1);
        this.previousSize = this.player.getSize();
        this.player.setOwnSize({x: 128, y: 64})

        for(let i = 0; i < 24; i++){
            if(this.player.flipX){
                this.player.body.setOffset(i*4,100);
            }else{
                this.player.body.setOffset(i,100);
            }
        }
    }

    updateState(){
        const {a, d, left, right, shift, space} = this.player.config.controls;
        const {scene} = this.player;
        const {defaultVelocity, velocityMultiplier, slideDuration} = this.player.config;

        let sign = this.player.flipX ? -1: 1;

        if(this.player.getVelocityX() != sign*defaultVelocity * velocityMultiplier){
            this.player.setVelocityX(this.player.getVelocityX() - sign*10);
        }

        if(this.player.body.onFloor()){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Slide"), true);
            }
        }

        if(scene.time.now - this.player.lastSlideTimer >= slideDuration){
            if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && shift.isDown){
                this.player.stateMachine.transitionToState('Run');
            }else if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.player.stateMachine.transitionToState('Walk');
            }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.player.stateMachine.transitionToState('Idle');
            }
        }

        this.updateChildren();
    }

    exitState(){
        this.player.setFrictionX(0);
        this.player.setOwnSize(this.previousSize);
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

class PlayerAttackState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.isOnProgress = true;
        
        let sign = this.player.flipX ? -1 : 1;
        this.player.getScene().tweens.add({
            targets: this.player.getCurrentWeapon(),
            angle: sign*180,
            duration: 100,
            ease: "Linear",
            yoyo: true,
            onStart: () => {
                this.checkHittingEnemies();
            },
            onComplete: () => {
                this.isOnProgress = false;
            },
        });
    }

    updateState(){
        this.updateChildren(true, false, true);
        
        if(!this.isOnProgress && this.player.isAlive){
            this.player.getStateMachine().transitionToState("Idle");
        }
    }

    checkHittingEnemies(){
        const {scene, config} = this.player;

        scene.physics.overlap(this.player.getCurrentWeapon(), scene.skeletons, (weapon, enemy) =>{
            if(!enemy.isStunned){
                enemy.lastAttackTimer = -enemy.config.attackRate;
            }

            enemy.getStateMachine().transitionToState("Damaged");
            enemy.decreaseHealthBy(this.player.getCurrentWeapon().config.damage);
        });
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

class PlayerDeadState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.play(this.player.getSpriteAnimations("Dead"));
    }

    updateState(){
        this.player.setVelocityX(0)
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