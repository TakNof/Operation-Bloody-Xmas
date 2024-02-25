class EnemyState extends BaseState {
    /**
     * 
     * @param {Enemy} enemy The object which will provide the context for the enemy states.
     * @param {String} key
     */
    constructor(enemy, key) {
        super(key);
        this.enemy = enemy;
    }

    updateChildren(updatePosition = true, updateVelocity = true){
        if(this.enemy.children.length > 0){
            for(let child of this.enemy.children){
                if(updatePosition){
                    this.updateChildPosition(child);
                }

                if(updateVelocity){
                    this.updateChildVelocity(child);
                }
            }
        }
    }

    updateChildPosition(child){
        let sign = this.enemy.flipX ? -1 : 1;
        child.setPosition(this.enemy.getPositionX() + sign*child.relativePosition.x, this.enemy.getPositionY() + child.relativePosition.y);
    }

    updateChildVelocity(child){
        child.body.velocity.x = this.enemy.getVelocityX();
        child.body.velocity.y = this.enemy.getVelocityY();
    }


}
  
