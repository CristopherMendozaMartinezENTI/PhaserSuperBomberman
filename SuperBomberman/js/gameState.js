class gameState extends Phaser.Scene
{
    constructor()
    { //crea la escena
        super(
        {
            key:"gameState"
        });
    }
    preload()
    { //carga los assets en memoria
        //var rutaImg = 'assets/Sprites/';
        this.load.setPath('assets/Sprites/');
        this.load.spritesheet('bombermanWhite', 'Player_White.png', {frameWidth:16, frameHeight:24});
        this.load.image('background', 'Stage1_1.png');
        this.load.image('hud1', 'HUD_Time0.png');
    }

    create()
    { //carga los assets en pantalla desde memoria
        this.hud1 = this.add.tileSprite(0,0,config.width,config.height,'hud1').setOrigin(0);
        this.bg1 = this.add.tileSprite(0,32,config.width,config.height,'background').setOrigin(0);
        this.player = this.physics.add.sprite(46, 32, 'bombermanWhite').setOrigin(0).setScale(1);

       this.anims.create (
           {
               key:Directions.UP,
               frames:this.anims.generateFrameNumbers('bombermanWhite', {start:0, end:2}),
               frameRate:7,
               yoyo:true,
               repeat:-1
           }
       );
       this.anims.create (
            {
                key:Directions.DOWN,
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:3, end:5}),
                frameRate:7,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create (
            {
                key:Directions.LEFT,
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:6, end:8}),
                frameRate:7,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create (
            {
                key:Directions.RIGHT,
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:9, end:11}),
                frameRate:7,
                yoyo:true,
                repeat:-1
            }
        );
        this.cursor = this.input.keyboard.createCursorKeys();
        this.player.dir = Directions.DOWN;
    }

    update()
    { //actualiza assets
        if (this.cursor.up.isDown)
        {
            this.player.play(Directions.UP, true);
            this.player.body.velocity.y = gamePrefs.speedPlayer * -1;
            this.player.body.velocity.x = 0;
            this.player.dir = Directions.UP;
        }
        else if (this.cursor.down.isDown)
        {
            this.player.play(Directions.DOWN, true);
            this.player.body.velocity.y = gamePrefs.speedPlayer;
            this.player.body.velocity.x = 0;
            this.player.dir = Directions.DOWN;
        }
        else if (this.cursor.left.isDown)
        {
            this.player.play(Directions.LEFT, true);
            this.player.body.velocity.x = gamePrefs.speedPlayer * -1;
            this.player.body.velocity.y = 0;
            this.player.dir = Directions.LEFT;
        }
        else if (this.cursor.right.isDown)
        {
            this.player.play(Directions.RIGHT, true);
            this.player.body.velocity.x = gamePrefs.speedPlayer;
            this.player.body.velocity.y = 0;
            this.player.dir = Directions.RIGHT;
        }
        else
        {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            if(this.player.dir == Directions.UP)
                this.player.setFrame(1);
            else if(this.player.dir == Directions.DOWN)
                this.player.setFrame(4);
            else if(this.player.dir == Directions.LEFT)
                this.player.setFrame(7);
            else if(this.player.dir == Directions.RIGHT)
                this.player.setFrame(10);
        }
        //console.log(this.player.body.x);
        //console.log(this.player.body.y);
    }
}