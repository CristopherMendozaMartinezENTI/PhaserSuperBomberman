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
        this.load.spritesheet('bomb', 'Bomb.png',{frameWidth:16, frameHeight:16});
        this.load.spritesheet('explosion', 'Fire.png',{frameWidth:16, frameHeight:16});
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
        this.player = new Player(this, 2*gamePrefs.TILE_SIZE + 8, 2*gamePrefs.TILE_SIZE + gamePrefs.INITIAL_HEIGHT, 'bombermanWhite');

        //Creamos un listener para detectar colisiones entre el hero y las paredes
        this.physics.add.collider(this.player,this.blocks);

        this.createPools();
        this.createAnimations();
        
        //Inputs
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursor.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursor.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursor.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.spacePressed = false;
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
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );
        this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL_END_LEFT,
                frames:this.anims.generateFrameNumbers('explosion', {start:4, end:7}),
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL_END_RIGHT,
                frames:this.anims.generateFrameNumbers('explosion', {start:8, end:11}),
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL_END_UP,
                frames:this.anims.generateFrameNumbers('explosion', {start:12, end:15}),
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL_END_DOWN,
                frames:this.anims.generateFrameNumbers('explosion', {start:16, end:19}),
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:20, end:23}),
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:24, end:27}),
                frameRate:5,
                yoyo:true,
                repeat:0
            }
        );
        //#endregion
    
    
    }

    createPools()
    {
        this.bombs = this.physics.add.group();

        //#region Explosion Pool
        this.explosion_horizontal = this.physics.add.group();
        this.explosion_vertical = this.physics.add.group();
        this.explosion_left_end = this.physics.add.group();
        this.explosion_right_end = this.physics.add.group();
        this.explosion_up_end = this.physics.add.group();
        this.explosion_down_end = this.physics.add.group();
        this.explosion_central = this.physics.add.group();
        //#endregion
    }

    spawnBomb()
    {
        var bomb = this.bombs.getFirst(false);
        
        var posX = Math.trunc((this.player.body.position.x - gamePrefs.TILE_SIZE/2) / gamePrefs.TILE_SIZE + 1) * gamePrefs.TILE_SIZE + gamePrefs.TILE_SIZE / 2;
        var posY = Math.trunc((this.player.body.position.y - gamePrefs.INITIAL_HEIGHT) / gamePrefs.TILE_SIZE + 1) * gamePrefs.TILE_SIZE + gamePrefs.INITIAL_HEIGHT;
        
        if(!bomb)
        {//Generate new bomb
            console.log("Create bomb");
            
            bomb = new bombPrefab(this, posX, posY, 'bomb');

            this.bombs.add(bomb);
        }
        else
        {//Reset bomb
            console.log("Reset bomb");

            bomb.active = true;
            bomb.explosionX = posX;
            
            bomb.body.reset(posX, posY);
            bomb.liveTime = gamePrefs.BOMB_EXPLOSION_TIME;
        }

        bomb.body.setVelocity(0,0);
    }

    spawnExplosion(_posX, _posY)
    {
        for (let index = 0; index <= this.player.fireDistance; index++) {
            var explosion;
            if(index == 0)//Central
            {
                explosion = this.explosion_central.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX, _posY, 'explosion', Explosion_Tiles.CENTRAL);

                    this.explosion_central.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX, _posY);
                    explosion.anims.play(Explosion_Tiles.CENTRAL);
                }
            }
            else if(index == this.player.fireDistance)
            {
                //#region Left end
                explosion = this.explosion_left_end.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX - index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL_END_LEFT);

                    this.explosion_left_end.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX- index * gamePrefs.TILE_SIZE, _posY);
                    explosion.anims.play(Explosion_Tiles.HORIZONTAL_END_LEFT);
                }
                //#endregion

                //#region Right end
                explosion = this.explosion_right_end.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX + index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL_END_RIGHT);

                    this.explosion_right_end.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX + index * gamePrefs.TILE_SIZE, _posY);
                    explosion.anims.play(Explosion_Tiles.HORIZONTAL_END_RIGHT);
                }
                //#endregion

                //#region Up end
                explosion = this.explosion_up_end.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX, _posY - index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL_END_UP);

                    this.explosion_up_end.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX, _posY- index * gamePrefs.TILE_SIZE);
                    explosion.anims.play(Explosion_Tiles.VERTICAL_END_UP);
                }
                //#endregion

                //#region Down end
                explosion = this.explosion_down_end.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX, _posY + index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL_END_DOWN);

                    this.explosion_down_end.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX, _posY + index * gamePrefs.TILE_SIZE);
                    explosion.anims.play(Explosion_Tiles.VERTICAL_END_DOWN);
                }
                //#endregion
            }
            else
            {
                //#region Vertical
                explosion = this.explosion_vertical.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX, _posY - index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL);

                    this.explosion_vertical.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX, _posY - index * gamePrefs.TILE_SIZE);
                    explosion.anims.play(Explosion_Tiles.VERTICAL);
                }

                explosion = this.explosion_vertical.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX, _posY + index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL);

                    this.explosion_vertical.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX, _posY + index * gamePrefs.TILE_SIZE);
                    explosion.anims.play(Explosion_Tiles.VERTICAL);
                }
                //#endregion
                
                //#region Horizontal
                explosion = this.explosion_vertical.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX - index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL);

                    this.explosion_vertical.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX - index * gamePrefs.TILE_SIZE, _posY);
                    explosion.anims.play(Explosion_Tiles.HORIZONTAL);
                }

                explosion = this.explosion_vertical.getFirst(false);

                if(!explosion)
                {
                    console.log("Create Explosion Centro");

                    explosion = new ExplosionPrefab(this, _posX + index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL);

                    this.explosion_vertical.add(explosion);
                }
                else
                {
                    console.log("Reset Explosion Centro");

                    explosion.active = true;

                    explosion.body.reset(_posX + index * gamePrefs.TILE_SIZE, _posY);
                    explosion.anims.play(Explosion_Tiles.HORIZONTAL);
                }
                //#endregion
            }
        }
    }

    bombExploded()
    {
        var bombs = this.bombs.getChildren();

        bombs.forEach(bomb => {
            if(bomb.exploded)
            {
                console.log("Ha explotado");
                this.spawnExplosion(bomb.explosionX, bomb.y);
                bomb.exploded = false;
            }
        });
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

        //Inputs
        if (this.cursor.up.isDown || this.cursor.W.isDown)
        {
            this.player.update(Directions.UP, this._delta);
        }
        else if (this.cursor.down.isDown || this.cursor.S.isDown)
        {
            this.player.update(Directions.DOWN, this._delta);
        }
        else if (this.cursor.left.isDown || this.cursor.A.isDown)
        {
            this.player.update(Directions.LEFT, this._delta);
        }
        else if (this.cursor.right.isDown || this.cursor.D.isDown)
        {
            this.player.update(Directions.RIGHT, this._delta);
        }
        else
        {
            this.player.update(Directions.NONE, this._delta);
        }

        if(this.cursor.space.isDown)
        {
            if(!this.spacePressed)
            {
                this.spawnBomb();
                this.spacePressed = true;
            }
        }
        else
        {
            this.spacePressed = false;
        }

        this.bombExploded();

        //Update last time
        this.start = this.getTime();
    }
}