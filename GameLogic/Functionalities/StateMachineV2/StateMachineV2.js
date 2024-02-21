class StateMachineV2{
    /**
     * 
     * @param {Map} states An object containing the states of the State Machine.
     */
    constructor(states){
        this.states = states;
        this.isTransitioningState = false;
        if (new.target === StateMachineV2) {
          throw new Error("Can not instanciate an abstract class.");
        }
    } 
    
    create(){
        this.currentState.enterState();
    }

    update(){
        this.nextStateKey = this.currentState.getNextState();
        
        if(!this.isTransitioningState){
            if(this.nextStateKey === this.currentState.stateKey){
                this.currentState.updateState();
            }else{
                this.transitionToState(this.nextStateKey);
            }
        }
    }

    transitionToState(stateKey){
        console.log(this.currentState.stateKey);
        this.isTransitioningState = true;
        this.currentState.exitState();
        this.currentState = this.states.get(stateKey);
        this.currentState.enterState();
        this.isTransitioningState = false;
    }

    /**
     * 
     * @param {Object} other The object which has entered the trigger. 
     */
    onTriggerEnter(other){
        this.currentState.onTriggerEnter(other);
    }

    /**
     * 
     * @param {Object} other The object which is staying the trigger. 
     */
    onTriggerStay(other){
        this.currentState.onTriggerStay(other);
    }

    /**
     * 
     * @param {Object} other The object which has exited the trigger. 
     */
    onTriggerExit(other){
        this.currentState.onTriggerExit(other);
    }
}