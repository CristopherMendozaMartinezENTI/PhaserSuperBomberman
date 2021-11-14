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
        //this.load.image('background', 'Stage1_1.png');
        this.load.image('hud1', 'HUD_Time0.png');
        this.load.setPath('assets/Maps/');
        this.load.tilemapTiledJSON('Stage1_1','Stage1_1.json');
    }

    create()
    { //carga los assets en pantalla desde memoria
        this.hud1 = this.add.tileSprite(0,0,config.width,config.height,'hud1').setOrigin(0);
        //this.bg1 = this.add.tileSprite(0,32,config.width,config.height,'background').setOrigin(0);
        this.player = new Player(this, 1*gamePrefs.TILE_SIZE + 8, 1*gamePrefs.TILE_SIZE + gamePrefs.INITIAL_HEIGHT, 'bombermanWhite');

        //Pintamos el nivel
        //Cargo el JSON
        this.map = this.add.tilemap('Stage1_1');
        //Cargo los Tilesets
        this.map.addTilesetImage('Lvl1_Tile');
        //Pintamos las capas/layers
        this.walls = this.map.createLayer('blocks','Lvl1_Tile');
        this.map.createLayer('ground','Lvl1_Tile');

        //Indicamos las colisiones con paredes/suelo/techo
        //this.map.setCollisionBetween(1,11,true,true,'blocks');
        
        //Creamos un listener para detectar colisiones entre el hero y las paredes
        //this.physics.add.collider(this.player,this.walls);

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
            this.player.update(Directions.UP);
        }
        else if (this.cursor.down.isDown)
        {
            this.player.update(Directions.DOWN);
        }
        else if (this.cursor.left.isDown)
        {
            this.player.update(Directions.LEFT);
        }
        else if (this.cursor.right.isDown)
        {
            this.player.update(Directions.RIGHT);
        }
        else
        {
            this.player.update(Directions.NONE);
        }
    }
}