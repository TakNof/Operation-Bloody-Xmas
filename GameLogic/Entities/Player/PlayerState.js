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
}
  
