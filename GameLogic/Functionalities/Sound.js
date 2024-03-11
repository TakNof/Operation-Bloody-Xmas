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
                    panningModel: 'HRTF',
                    distanceModel: 'inverse',
                    orientationX: 0,
                    orientationY: 0,
                    orientationZ: -1,
                    refDistance: 100,
                    rolloffFactor: 1,
                    coneInnerAngle: 180,
                    coneOuterAngle: 280,
                    coneOuterGain: 0.8
                }
            }
            this.sound.play(config);
        }else{
            this.sound.play();
        }

        
    }

    stopSound(){
        this.sound.stop();
    }
}