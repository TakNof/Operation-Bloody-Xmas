class StateMachine{
    /**
     * 
     * @param {Map} states An object containing the states of the State Machine.
     */
    constructor(states){
        this.states = states;
        this.statesHistory = [];
        this.isTransitioningState = false;
        if (new.target === StateMachine) {
          throw new Error("Can not instanciate an abstract class.");
        }
    } 
    
    create(){
        this.addStateToHistory();
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
        // console.log(this.currentState.stateKey);
        this.isTransitioningState = true;

        this.currentState.exitState();
        this.currentState = this.states.get(stateKey);

        this.addStateToHistory();
        this.currentState.enterState();

        this.isTransitioningState = false;

        this.cleanStatesHistory();

        // console.log(this.statesHistory);
    }

    addStateToHistory(){
        // this.statesHistory.push({state: this.currentState.stateKey, time: this.contextObject.scene.time.now});
        this.statesHistory.push(this.currentState.stateKey);
    }

    getStateHistory(){
        return this.statesHistory;
    }

    cleanStatesHistory(){
        if(this.statesHistory.length > 5){
            this.statesHistory.shift();
        }
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