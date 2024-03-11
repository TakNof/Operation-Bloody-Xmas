class MainMenu extends Phaser.Scene{
    constructor(){
        super({key: "MainMenu"});
    }

    preload(){
        this.load.image("MainMenuBG", "./assets/MainMenu/Main Menu BG.png");
        this.load.image("GameLogo", "./assets/MainMenu/Game Logo.png")
        this.load.image("PlayButton", "./assets/MainMenu/Play Button.png");
        this.load.audio("MainMenuTheme", "./assets/MainMenu/Main Menu Theme.mp3");
    }
    
    create(){
        this.background = this.add.image(canvasSize.width/2, canvasSize.height/2, "MainMenuBG");
        this.background.setScale(0.5);

        this.logo = this.add.image(canvasSize.width/2, canvasSize.height/2, "GameLogo");
        this.logo.setAlpha(0);
        
        this.playButton = this.add.image(canvasSize.width/2, canvasSize.height*0.8, "PlayButton");
        this.playButton.setAlpha(0);
        this.playButton.setScale(0.7);


        this.playButton.on('pointerover', () => {
            this.playButton.setTint(0xffcc00);
        });
          
        this.playButton.on('pointerout', () => {
            this.playButton.setTint(0xffffff);
        });

        this.playButton.on('pointerdown', () => {
            this.stopScene();
          });

        this.cameras.main.fadeIn(4000, 0, 0, 0);

        this.tweens.add({
            targets: this.logo,
            duration: 2000, 
            alpha: 1,
            ease: "Cubic",
            delay: 2000,
        }); 

        this.tweens.add({
            targets: this.logo,
            duration: 2000,
            ease: "Sinusoidal",
            y: '-=100',
            delay: 4000,
            onComplete: ()=>{
                this.tweens.add({
                    targets: this.playButton,
                    alpha: 1,
                    ease: "Sinusoidal",
                    onComplete: ()=>{
                        this.playButton.setInteractive({ useHandCursor: true });
                    }
                })
            }
        }); 
                
        this.mainThemeMusic = this.sound.add("MainMenuTheme");

        this.mainThemeMusic.loop = true;

        if(!this.mainThemeMusic.isPlaying){
            this.mainThemeMusic.play();
        }
    }

    update(time, delta){

   }

   stopScene() {
        this.cameras.main.fadeOut(4000, 0, 0, 0, () => {
            this.scene.start("Game")
            this.scene.stop();
        });
    }
}