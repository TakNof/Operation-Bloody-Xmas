class PathFinder{
    constructor(scene, objectOwner, target = scene.player){
        this.scene = scene;
        this.objectOwner = objectOwner;
        this.path;
        this.pathId;
        this.target = target;
        this.targetLastSeenPosition;
        this.targetHighPositionVariation = false;
        this.unableToReachTarget = false;
        this.markers = [];
        this.timeToCompletePath = 7000;

        this.setEasyStar();
        this.setPathCallInterval();

    }

    setEasyStar(){
        this.easyStar = new EasyStar.js(this.scene.physics.config.gravity.y, this.objectOwner.config.jumpVelocity);

        this.easyStar.setGrid(this.scene.pathFindingGrid);

        this.easyStar.setAcceptableTiles([0, 1, 2]);

        this.easyStar.enableDiagonals();
        // this.easyStar.enableCornerCutting();

        this.easyStar.setTileCost(2, 20);
        this.easyStar.setTileCost(1, 1);
        this.easyStar.setTileCost(0, 0);
    }

    getEasyStar(){
        return this.easyStar;
    }

    setPath(){
        if(this.targetHighPositionVariation){
            this.clearPath();
        }

        console.log("Setting path");
        
        let data = [
            Math.floor(this.objectOwner.getPositionX()/64), 
            Math.floor(this.objectOwner.getPositionY()/64),
            this.targetLastSeenPosition ? Math.floor(this.targetLastSeenPosition.x/64): Math.floor(this.target.x/64),
            this.targetLastSeenPosition ? Math.floor(this.targetLastSeenPosition.y/64): Math.floor(this.target.y/64),
        ];
        
        this.pathId = this.easyStar.findPath(...data, (path) =>{
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                // console.warn("Path was found");
                this.path = path;
                this.visualizePathMarkers();

                if(!this.pathTimer){
                    this.setUnreachablePathTimer()
                }else{
                    this.resetUnreachablePathTimer();
                }
            }
        });
        this.easyStar.calculate();
    }

    clearPath(){
        if(this.pathId){
            this.easyStar.cancelPath(this.pathId);
            this.pathId = undefined;
        }

        this.removeUnreachablePathTimer();
    }

    visualizePathMarkers(){
        this.cleanPathMarkers();

        for(let step of this.path){
            this.markers.push(this.scene.add.rectangle((2*step.x + 1)*32, (2*step.y + 1)*32, 10, 10, 0xb31714));
        }
    }

    cleanPathMarkers(){
        for(let i = 0; i < this.markers.length; i++){
            this.markers[i].destroy();
        }

        this.markers = [];
    }

    refreshTarget(position){
        if(position){
            this.targetHighPositionVariation = Phaser.Math.Distance.Between(
                position.x,
                position.y,
                this.target.x,
                this.target.y
            ) >= 64;
            this.target = position;
        }else{
            this.targetHighPositionVariation = Phaser.Math.Distance.Between(
                this.scene.player.getPositionX(),
                this.scene.player.getPositionY(),
                this.target.x,
                this.target.y
            ) >= 64;
            this.target = this.scene.player;
        }

        // console.log(this.targetHighPositionVariation);
    }

    setPathCallInterval(){
        this.resetPathCallInterval();

        this.pathInterval = this.scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                if(this.objectOwner.body.onFloor()){
                    this.setPath();
                }
            },
            callbackScope: this,
            loop: true
        });
        this.pathInterval.paused = true;
    }

    getPathCallInterval(){
        return this.pathInterval;
    }

    resetPathCallInterval(){
        if(this.pathInterval){
            this.pathInterval.reset();
        }
    }

    setUnreachablePathTimer(){
        this.pathTimer = this.scene.time.delayedCall(this.timeToCompletePath, () => {
            this.objectOwner.getStateMachine().transitionToState("Search");
            this.unableToReachTarget = true;
            console.log("Unreachable path");
        }, [], this);
    }

    resetUnreachablePathTimer(){
        this.pathTimer.reset({delay: this.timeToCompletePath, callback: () => {
            this.objectOwner.getStateMachine().transitionToState("Search");
            this.unableToReachTarget = true;
            console.log("Unreachable path");
        }, callbackScope: this});
    }

    removeUnreachablePathTimer(){
        if(this.pathTimer){
            this.pathTimer.remove();
            this.unableToReachTarget = false;
        }
    }
}