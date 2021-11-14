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
        this.load.image('hud1', 'HUD_Time0.png');
        
        this.load.setPath("assets/Tiles/");
        this.load.image('Lvl1_Tile','Lvl1_Tile.png');

        this.load.setPath('assets/Maps/');
        this.load.tilemapTiledJSON('Stage1_1','Stage1_1.json');
    }

    create()
    { //carga los assets en pantalla desde memoria
        this.start = this.getTime();

        this.hud1 = this.add.tileSprite(0,0,config.width,config.height,'hud1').setOrigin(0);

        //Cargo el JSON
        this.map = this.add.tilemap('Stage1_1');
        //Cargo los Tilesets
        this.map.addTilesetImage('Lvl1_Tile');
        //Pintamos las capas/layers
        this.blocks = this.map.createLayer('blocks','Lvl1_Tile');
        this.map.createLayer('ground','Lvl1_Tile');
        this.blocks.debug = true;

        //Indicamos las colisiones con bloques
        this.map.setCollisionBetween(1,16,true,true,'blocks');

        //Creamos el player
        this.player = new Player(this, 2*gamePrefs.TILE_SIZE, 1*gamePrefs.TILE_SIZE + gamePrefs.INITIAL_HEIGHT, 'bombermanWhite');

        //Creamos un listener para detectar colisiones entre el hero y las paredes
        this.physics.add.collider(this.player.collider,this.blocks);

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
        
        //Inputs
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursor.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursor.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursor.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    getTime()
    { //Calculate Current Time
        let d = new Date();

        return d.getTime();
    }

    update()
    { //actualiza assets

        //Calculate delta time
        this.delta = (this.getTime() - this.start) / 1000;

        //Inputs
        if (this.cursor.up.isDown || this.cursor.W.isDown)
        {
            this.player.update(Directions.UP, this.delta);
        }
        else if (this.cursor.down.isDown || this.cursor.S.isDown)
        {
            this.player.update(Directions.DOWN, this.delta);
        }
        else if (this.cursor.left.isDown || this.cursor.A.isDown)
        {
            this.player.update(Directions.LEFT, this.delta);
        }
        else if (this.cursor.right.isDown || this.cursor.D.isDown)
        {
            this.player.update(Directions.RIGHT, this.delta);
        }
        else
        {
            this.player.update(Directions.NONE, this.delta);
        }

        //Update last time
        this.start = this.getTime();
    }
}