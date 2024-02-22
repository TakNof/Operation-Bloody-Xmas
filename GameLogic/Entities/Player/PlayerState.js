class PlayerState extends BaseState {
    /**
     * 
     * @param {Player} player The object which will provide the context for the player states.
     * @param {String} key
     */
    constructor(player, key) {
        super(key);
        this.player = player;
    }

    updateChildren(updatePosition = true, updateRotation = true, updateVelocity = true){
        if(this.player.children.length > 0){
            for(let child of this.player.children){
                if(updatePosition){
                    this.updateChildPosition(child);
                }
                
                if(updateRotation){
                    this.updateChildRotation(child);
                }

                if(updateVelocity){
                    this.updateChildVelocity(child);
                }
                
            }
        }
    }

    updateChildPosition(child){
        let sign = this.player.flipX ? -1 : 1;
        child.setPosition(this.player.getPositionX() + sign*child.relativePosition.x, this.player.getPositionY() + child.relativePosition.y);
    }

    updateChildVelocity(child){
        child.body.velocity.x = this.player.getVelocityX();
        child.body.velocity.y = this.player.getVelocityY();
    }

    updateChildRotation(child){
        let sign = this.player.flipX ? -1 : 1;
        child.rotation = adjustAngleValue(sign*child.originInfo.angleOffset);
    }
}
  
