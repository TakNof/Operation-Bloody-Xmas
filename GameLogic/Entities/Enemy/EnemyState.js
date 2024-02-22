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
}
  
