class TitleScreen extends Phaser.Scene
{
    constructor()
    { //crea la escena
        super(
        {
            key:"TitleScreen"
        });
    }

    preload()
    { //carga los assets en memoria
        //var rutaImg = 'assets/Sprites/';
        this.load.setPath('assets/Sprites/');
        this.load.image('TittleScreen_Background', 'TittleScreen_Background.png');

        this.load.setPath('assets/Sounds/')
        this.load.audio('ItemGet','ItemGet.wav');
        this.load.audio('Area1Music','Area1Music.mp3');
    }

    create()
    { //carga los assets en pantalla desde memoria
        this.background = this.add.tileSprite(0,0,config.width,config.height,'TittleScreen_Background').setOrigin(0);

        //Inputs
        this.cursor = this.input.keyboard.createCursorKeys();

        //Music
        this.loadSounds();

        this.cameras.main.fadeIn(1000, 255, 255, 255);
    }

    loadSounds()
    {
        this.itemGet = this.sound.add("ItemGet");
        this.music = this.sound.add('Area1Music' , {volume: 0.5});
        this.music.loop = true;
        this.music.play();
    }

  
    createAnimations()
    {
        //#region Player
        this.anims.create (
        {
            key:Directions.UP,
            frames:this.anims.generateFrameNumbers('bombermanWhite', {start:0, end:2}),
            frameRate:5,
            yoyo:true,
            repeat:-1
        }
        );
        this.anims.create (
            {
                key:Directions.DOWN,
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:3, end:5}),
                frameRate:5,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create (
            {
                key:Directions.LEFT,
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:6, end:8}),
                frameRate:5,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create (
            {
                key:Directions.RIGHT,
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:9, end:11}),
                frameRate:5,
                yoyo:true,
                repeat:-1
            }
        );
        //#endregion
        
        //#region ExitDoor
        this.anims.create(
            {
                key:'exitDoorAnim',
                frames:this.anims.generateFrameNumbers('exit', {start:0, end:1}),
                frameRate:25,
                yoyo:false,
                repeat:-1
            }
        );
        //#endregion

        //#region HudClock
        this.anims.create(
            {
                key:'HudClockAnim',
                frames:this.anims.generateFrameNumbers('hudClock', {start:0, end:7}),
                frameRate:1,
                yoyo:false,
                repeat:-1
            }   
        );
        //#endregion

        //#region HudTime
        this.anims.create(
            {
                key:'HudTimeAnim',
                frames:this.anims.generateFrameNumbers('hudTime', {start:0, end:13}),
                duration:112000,
                yoyo:false,
                repeat:-1
            }   
        );
        //#endregion

        //#region DestructibleBlock
        this.anims.create(
            {
                key:'desObjAnim',
                frames:this.anims.generateFrameNumbers('desBlock', {start:0, end:7}),
                frameRate:10,
                yoyo:false,
                repeat:-1
            }   
        );
        //#endregion
        
        //#region DestructibleBlock Explosion
        this.anims.create(
            {
                key:'desObjAnimEx',
                frames:this.anims.generateFrameNumbers('desBlockExplosion', {start:0, end:8}),
                frameRate:15,
                yoyo:false,
                repeat:0
            }   
        );
        //#endregion

        //#region Bomb
        this.anims.create(
            {
                key:'bombAnim',
                frames:this.anims.generateFrameNumbers('bomb', {start:0, end:2}),
                frameRate:5,
                yoyo:true,
                repeat:-1
            }   
        );
        //#endregion

        //#region Explosion
        this.anims.create(
            {
                key:Explosion_Tiles.CENTRAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:0, end:3}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );
        this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL_END_LEFT,
                frames:this.anims.generateFrameNumbers('explosion', {start:4, end:7}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL_END_RIGHT,
                frames:this.anims.generateFrameNumbers('explosion', {start:8, end:11}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL_END_UP,
                frames:this.anims.generateFrameNumbers('explosion', {start:12, end:15}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL_END_DOWN,
                frames:this.anims.generateFrameNumbers('explosion', {start:16, end:19}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:20, end:23}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:24, end:27}),
                frameRate:15,
                yoyo:true,
                repeat:0
            }
        );
        //#endregion
    
        //#region Puropen
        this.anims.create(
            {
                key:EnemyTypes.PUROPEN + Directions.UP,
                frames:this.anims.generateFrameNumbers(EnemyTypes.PUROPEN, {start:0, end:3}),
                frameRate:30,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create(
            {
                key:EnemyTypes.PUROPEN + Directions.LEFT,
                frames:this.anims.generateFrameNumbers(EnemyTypes.PUROPEN, {start:4, end:7}),
                frameRate:30,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create(
            {
                key:EnemyTypes.PUROPEN + Directions.DOWN,
                frames:this.anims.generateFrameNumbers(EnemyTypes.PUROPEN, {start:8, end:11}),
                frameRate:30,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create(
            {
                key:EnemyTypes.PUROPEN + Directions.RIGHT,
                frames:this.anims.generateFrameNumbers(EnemyTypes.PUROPEN, {start:12, end:15}),
                frameRate:30,
                yoyo:true,
                repeat:-1
            }
        );
        //#endregion

        //#region Denkyun
        this.anims.create(
            {
                key:EnemyTypes.DENKYUN,
                frames:this.anims.generateFrameNumbers(EnemyTypes.DENKYUN, {start:0, end:5}),
                frameRate:15,
                yoyo:true,
                repeat:-1
            }
        );
        //#endregion

        //#region Enemy Explosion
        this.anims.create(
            {
                key:'enemymExAnim',
                frames:this.anims.generateFrameNumbers('enemymEx', {start:0, end:9}),
                frameRate:15,
                yoyo:false,
                repeat:0
            }   
        );
        //#endregion

        //#region Player death
        this.anims.create(
            {
                key:'playerDeathAnim',
                frames:this.anims.generateFrameNumbers('playerDeath', {start:0, end:5}),
                frameRate:10,
                yoyo:false,
                repeat:0
            }   
        );
        //#endregion
    
        //#region PowerUps
        this.anims.create(
            {
                key:PowerUpTypes.BOMB_UP,
                frames:this.anims.generateFrameNumbers('bombUp', {start:0, end:1}),
                frameRate:25,
                yoyo:false,
                repeat:-1
            }   
        );

        this.anims.create(
            {
                key:PowerUpTypes.FIRE_UP,
                frames:this.anims.generateFrameNumbers('fireUp', {start:0, end:1}),
                frameRate:25,
                yoyo:false,
                repeat:-1
            }   
        );
        //#endregion
    }

    getTime()
    { //Calculate Current Time
        let d = new Date();
        return d.getTime();
    }

    update()
    { //actualiza assets
        //Calculate delta time
        this._delta = (this.getTime() - this.start) / 1000;
        
        if(this.cursor.space.isDown)
        {
            this.itemGet.play();
            this.music.stop();
            this.scene.start('Stage1_1');
        }

        //Update last time
        this.start = this.getTime();
    }
}