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

    }

    create()
    { //carga los assets en pantalla desde memoria
       this.player = this.physics.add.sprite(config.width/2, config.height/2, 'bombermanWhite').setOrigin(0.5).setScale(1);

       this.anims.create (
           {
               key:'up',
               frames:this.anims.generateFrameNumbers('bombermanWhite', {start:0, end:2}),
               frameRate:5,
               yoyo:true,
               repeat:-1
           }
       );
       this.anims.create (
            {
                key:'down',
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:3, end:5}),
                frameRate:5,
                yoyo:true,
                repeat:-1
            }
        );
        this.anims.create (
            {
                key:'left',
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:6, end:8}),
                frameRate:7,
                yoyo:false,
                repeat:-1
            }
        );
        this.anims.create (
            {
                key:'right',
                frames:this.anims.generateFrameNumbers('bombermanWhite', {start:9, end:11}),
                frameRate:5,
                yoyo:false,
                repeat:-1
            }
        );
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    update()
    { //actualiza assets
        if (this.cursor.up.isDown)
        {
            this.player.play('up', true);
            this.player.body.velocity.y = gamePrefs.speedPlayer * -1;
            this.player.body.velocity.x = 0;
        }
        else if (this.cursor.down.isDown)
        {
            this.player.play('down', true);
            this.player.body.velocity.y = gamePrefs.speedPlayer;
            this.player.body.velocity.x = 0;
        }
        else if (this.cursor.left.isDown)
        {
            this.player.play('left', true);
            this.player.body.velocity.x = gamePrefs.speedPlayer * -1;
            this.player.body.velocity.y = 0;
        }
        else if (this.cursor.right.isDown)
        {
            this.player.play('right', true);
            this.player.body.velocity.x = gamePrefs.speedPlayer;
            this.player.body.velocity.y = 0;
        }
        else{
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;

        }
    }
}