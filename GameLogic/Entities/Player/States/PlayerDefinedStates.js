class PlayerIdleState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.startAnimationWithOffset(); 
    }
        
    updateState(){
        // console.log(this.player.body.center);
        const {a, d, left, right, shift, space} = this.player.config.controls;
    
        this.player.setVelocityX(0);

        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && shift.isDown) {
            this.player.getStateMachine().transitionToState('Run');
        }else if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.player.getStateMachine().transitionToState('Walk');
        }

        if(this.player.body.onFloor() && !this.player.isLanding && !this.player.isAttacking){
            if(space.isDown){
                this.player.getStateMachine().transitionToState('Jump');
            }else{
                this.player.play(this.player.getSpriteAnimations("Idle"), true);
            }
        }

        if(this.player.getVelocityY() > 800){
            this.player.getStateMachine().transitionToState('Fall');
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

class PlayerWalkState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.startAnimationWithOffset();
    }

    updateState(){
        const {a, d, left, right, shift, space} = this.player.config.controls;
        const {defaultVelocity} = this.player.config;

        if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
        }

        if(this.player.body.onFloor() && !this.player.isLanding && !this.player.isAttacking){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(shift.isDown){
                this.player.stateMachine.transitionToState("Run");
            }else{
                this.player.play(this.player.getSpriteAnimations("Walk"), true);
            }
        }
        
        if(this.player.getVelocityY() > 800){
            this.player.getStateMachine().transitionToState('Fall');
        }
        
        if(left.isDown ^ a.isDown  && !this.player.flipX){
            this.player.flipX= true;
            // this.player.setOwnSize(this.player.config.size);
        }else if(right.isDown ^ d.isDown && this.player.flipX){
            this.player.flipX= false;
        }

        let sign = this.player.flipX ? -1: 1;

        this.player.setVelocityX(sign*defaultVelocity);


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

    enterState(){
        this.player.startAnimationWithOffset();
    }

    updateState(){
        const {scene} = this.player;
        const {a, s, d, left, down, right, shift, space} = this.player.config.controls;
        const {defaultVelocity, velocityMultiplier, slideConfig} = this.player.config;

        if(left.isDown ^ a.isDown  && !this.player.flipX){
            this.player.flipX= true;
        }else if(right.isDown ^ d.isDown && this.player.flipX){
            this.player.flipX= false;
        }

        let sign = this.player.flipX ? -1: 1;

        this.player.setVelocityX(sign*defaultVelocity*velocityMultiplier);

        if(this.player.body.onFloor() && !this.player.isLanding && !this.player.isAttacking){
            if(space.isDown){
                this.player.stateMachine.transitionToState('Jump');
            }else if(down.isDown ^ s.isDown && scene.time.now - this.player.lastSlideTimer >= slideConfig.slideCooldown){
                this.player.stateMachine.transitionToState("Slide");
            }else{
                this.player.play(this.player.getSpriteAnimations("Run"), true);
            }
        }
        
        if(this.player.getVelocityY() > 800){
            this.player.getStateMachine().transitionToState('Fall');
        }
        
        if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
            this.player.stateMachine.transitionToState('Walk');
        }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown)){
            this.player.stateMachine.transitionToState('Idle');
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
        const {jumpConfig} = this.player.config;

        this.previousStateStr = this.player.getStateMachine().getStateHistory()[this.player.getStateMachine().getStateHistory().length - 2];
        this.player.startAnimationWithOffset();
        this.player.play(this.player.getSpriteAnimations("Jump"), true);

        this.player.on(`animationupdate`, (anim, frame) =>{

            if(anim.key === this.player.getSpriteAnimations("Jump")){
                if(this.player.body.onCeiling()){
                    this.player.stop();
                    return;
                }
    
                if(frame.index == jumpConfig.jumpFrame){
                    this.ableToChange = false;
                    
                    this.player.setVelocityY(jumpConfig.jumpVelocity);
    
                    this.player.off("animationupdate");
                    this.ableToChange = true;
    
                    
                }
            }
        });
        
    }

    updateState(){
        if(this.ableToChange){
            this.player.getStateMachine().transitionToState(this.previousStateStr);
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

class PlayerFallState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.startAnimationWithOffset();
        this.player.play(this.player.getSpriteAnimations("Fall"), true);
    }

    updateState(){
        if(this.player.body.onFloor()){
            this.player.stop();
            this.player.getStateMachine().transitionToState("Land");
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

class PlayerLandState extends PlayerState{
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {Object} key
     */
    constructor(player, key){
        super(player, key);
    }

    enterState(){
        this.player.isLanding = true;
        this.player.startAnimationWithOffset();
        this.player.play(this.player.getSpriteAnimations("Land"));

        this.player.getStateMachine().transitionToState("Idle");
    }

    updateState(){

    }

    exitState(){
        this.player.isLanding = false;
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
        const {scene} = this.player;
        const {defaultVelocity, velocityMultiplier} = this.player.config;
        const {slideConfig} = this.player.config;

        this.player.lastSlideTimer = scene.time.now;
        let sign = this.player.flipX ? -1: 1;
        
        this.player.setFrictionX(1);
        this.player.setOwnSize({x: 128, y: 64});

        this.player.startAnimationWithOffset(0.5, 0.8, 128, 64);
        this.player.play(this.player.getSpriteAnimations("Slide"), true);

        this.player.on(`animationupdate`, (anim, frame) =>{
            if(frame.index == slideConfig.slideFrame){
                
                this.player.setVelocityX(sign*(defaultVelocity* velocityMultiplier + slideConfig.slideDashAdder));
        
                this.player.off("animationupdate");
            }
        });
    }

    updateState(){
        const {a, d, left, right, shift, space} = this.player.config.controls;
        const {scene} = this.player;
        const {defaultVelocity, velocityMultiplier} = this.player.config;
        const {slideConfig} = this.player.config;

        let sign = this.player.flipX ? -1: 1;

        if(this.player.getVelocityX() != sign*defaultVelocity * velocityMultiplier){
            this.player.setVelocityX(this.player.getVelocityX() - sign*10);
        }

        if(scene.time.now - this.player.lastSlideTimer >= slideConfig.slideDuration || this.player.body.onWall()){
            this.player.play(this.player.getSpriteAnimations("Idle"), true);
            if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && shift.isDown){
                this.player.stateMachine.transitionToState('Run');
            }else if((left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.player.stateMachine.transitionToState('Walk');
            }else if(!(left.isDown ^ right.isDown) ^ (a.isDown ^ d.isDown) && !shift.isDown){
                this.player.stateMachine.transitionToState('Idle');
            }else if(space.isDown && this.player.body.onFloor()){
                this.player.stateMachine.transitionToState('Jump');
            }
        }


    }

    exitState(){
        this.player.setFrictionX(0);
        this.player.y -= this.player.body.height/2;
        this.player.setOwnSize(this.player.config.size);
        this.player.body.reset(this.player.x, this.player.y);
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
        this.ableToChange = false;
        this.player.startAnimationWithOffset(0.5, 0.6, this.player.config.size.x, this.player.config.size.y);
        this.player.play(this.player.getSpriteAnimations("Attack"));
        this.player.isAttacking = true;

        // if(this.player.body.onFloor()){
        //     this.player.y -=32;
        // }

        this.player.on(`animationupdate`, (anim, frame) =>{
            // console.log(this.player.originX, this.player.originY)
            // console.log(this.player);
            if(frame.index == this.player.getCurrentWeapon().config.hitFrame && anim.key === this.player.getSpriteAnimations("Attack")){
                    
                // this.checkHittingEnemies();
                
                this.player.off("animationupdate");
                this.ableToChange = true;
            }
        });

        this.player.on(`animationcomplete-${this.player.getSpriteAnimations("Attack")}`, ()=>{
            this.player.isAttacking = false;
            this.player.off(`animationcomplete-${this.player.getSpriteAnimations("Attack")}`);
        });

        this.player.on("animationstop", (anim, frame)=>{
            if(anim.key === this.player.getSpriteAnimations("Attack")){
                this.player.isAttacking = false;
                this.player.off("animationstop");
            }
        });
    }

    updateState(){        
        if(this.ableToChange && this.player.isAlive){
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