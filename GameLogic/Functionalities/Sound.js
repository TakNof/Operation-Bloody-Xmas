class Sound{
    constructor(scene, key){
        this.scene = scene;
        this.key = key;

        this.sound = this.scene.sound.add(key);
    }

    playSound(spritePosition){
        let config;
        if(spritePosition){
            config = {
                source: {
                    x: spritePosition.x,
                    y: spritePosition.y,
                    orientationX: 0,
                    orientationY: 0,
                    orientationZ: -1,
                    // distanceModel: 'inverse',
                    refDistance: 6,
                    rolloffFactor: 1,
                    coneInnerAngle: 180,
                    coneOuterAngle: 280,
                    coneOuterGain: 0.5
                }
            }
        }

        this.sound.play(config);
    }

    stopSound(){
        this.sound.stop();
    }
}