class PathFinder{
    constructor(scene, objectOwner, target = scene.player.getPosition()){
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
        this.setUnreachablePathTimer();
    }

    setEasyStar(){
        this.easyStar = new EasyStar.js(this.scene.physics.config.gravity.y, this.objectOwner.config.jumpVelocity);

        this.easyStar.setGrid(this.scene.pathFindingGrid);

        this.easyStar.setAcceptableTiles([0, 1, 2]);

        this.easyStar.enableDiagonals();
        this.easyStar.enableCornerCutting();

        this.easyStar.setTileCost(2, 1000);
        this.easyStar.setTileCost(1, 0);
        this.easyStar.setTileCost(0, 20);
    }

    getEasyStar(){
        return this.easyStar;
    }

    setPath(){
        if(this.targetHighPositionVariation){
            this.clearPath();
        }

        // console.log("Setting path");
        
        let data = [
            Math.floor(this.objectOwner.getPositionX()/64), 
            Math.floor(this.objectOwner.getPositionY()/64),
            Math.floor(this.target.x/64),
            Math.floor(this.target.y/64),
        ];
        
        this.pathId = this.easyStar.findPath(...data, (path) =>{
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                // console.warn("Path was found");
                this.path = path;
                this.visualizePathMarkers();

                if(this.pathTimer.paused){
                    this.pathTimer.paused = false;
                }
            }
        });
        this.easyStar.calculate();
    }

    clearPath(){
        if(this.pathId){
            // console.log("Clearing path")
            this.easyStar.cancelPath(this.pathId);
            this.pathId = undefined;
        }

        // this.removeUnreachablePathTimer();
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

    refreshTarget(){
        if(this.targetLastSeenPosition){
            this.targetHighPositionVariation = Phaser.Math.Distance.Between(
                this.targetLastSeenPosition.x,
                this.targetLastSeenPosition.y,
                this.target.x,
                this.target.y
            ) >= 64;
            this.target = this.targetLastSeenPosition;
        }else{
            this.targetHighPositionVariation = Phaser.Math.Distance.Between(
                this.scene.player.getPositionX(),
                this.scene.player.getPositionY(),
                this.target.x,
                this.target.y
            ) >= 64;
            this.target = this.scene.player.getPosition();
        }

        // console.log(this.targetHighPositionVariation);
    }

    setPathCallInterval(){
        this.resetPathCallInterval();

        this.pathInterval = this.scene.time.addEvent({
            delay: 500,
            callback: ()=>{
                // console.log("Calling set path method");
                if(this.objectOwner.body.onFloor() || (this.path.length > 0 && this.objectOwner.isPointAhead(this.path[0]))){
                    // console.log("Call success");
                    this.setPath();
                }
            },
            callbackScope: this,
            loop: true
        });
        this.pathInterval.paused = true;
        this.unableToReachTarget = false;
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
            this.unableToReachTarget = true;
            // console.log("Unreachable path");
        }, [], this);

        this.pathTimer.paused = true;
    }

    getUnreachablePathTimer(){
        return this.pathTimer;
    }

    resetUnreachablePathTimer(){
        console.log("reseting timer for unableToReachTarget...");
        this.pathTimer.reset({delay: this.timeToCompletePath, callback: () => {
            this.unableToReachTarget = true;
            // console.log("Unreachable path");
        }, callbackScope: this});
    }

    removeUnreachablePathTimer(){
        if(this.pathTimer){
            this.pathTimer.paused = true;
            this.resetUnreachablePathTimer();
            this.unableToReachTarget = false;
        }
    }

    reset(){
        this.getPathCallInterval().paused = true;
        this.setUnreachablePathTimer();
        this.clearPath();
        this.cleanPathMarkers();
    }
}