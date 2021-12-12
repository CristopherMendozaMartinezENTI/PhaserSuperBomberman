class Stage1_1 extends Phaser.Scene
{
    constructor()
    { //crea la escena
        super(
        {
            key:"Stage1_1"
        });
    }

    preload()
    { //carga los assets en memoria
        //var rutaImg = 'assets/Sprites/';
        this.load.setPath('assets/Sprites/');
        this.load.spritesheet('bombermanWhite', 'Player_White.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('playerDeath', 'Player_White_Dead_Anim.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('puropen', 'Enemy_Porupen.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('denkyun', 'Enemy_Denkyun.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('enemymEx', 'EnemyDieAnim.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('bomb', 'Bomb.png',{frameWidth:16, frameHeight:16});
        this.load.spritesheet('explosion', 'Fire.png',{frameWidth:16, frameHeight:16});
        this.load.spritesheet('score','HUD_Numbers.png', {frameWidth:8, frameHeight:14});
        this.load.spritesheet('hudClock', 'HUDTimeAnim.png', {frameWidth:272, frameHeight:32});
        this.load.spritesheet('exit', 'Obj_Exit.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('hudTime', 'TimeAnim.png', {frameWidth:272, frameHeight:32});
        this.load.spritesheet('desBlock', 'DestructibleBlock1.png', {frameWidth:16, frameHeight:16})
        this.load.spritesheet('desBlockExplosion', 'DestructibleBlock1_Anim.png', {frameWidth:16, frameHeight:16});

        this.load.spritesheet('bombUp', 'PowerUp_BombUp.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('fireUp', 'PowerUp_FireUp.png', {frameWidth:16, frameHeight:16});
        
        this.load.setPath("assets/Tiles/");
        this.load.image('Lvl1_Tile','Lvl1_Tile.png');

        this.load.setPath('assets/Maps/');
        this.load.tilemapTiledJSON('Stage1_1','Stage1_1.json');

        this.load.setPath('assets/Sounds/')
        this.load.audio('Walking1','Walking1.wav');
        this.load.audio('Walking2','Walking2.wav');
        this.load.audio('PlaceBomb','PlaceBomb.wav');
        this.load.audio('BombExplodes','BombExplodes.wav');
        this.load.audio('Area1Music','Area1Music.mp3');
    }

    convertWorldPositionToTile(_posX, _posY)
    {
        var _x = Math.trunc((_posX - gamePrefs.TILE_SIZE / 2) / gamePrefs.TILE_SIZE) + 1;
        var _y = Math.trunc((_posY - gamePrefs.INITIAL_HEIGHT) / gamePrefs.TILE_SIZE);
        
        var returnPos = [_x, _y];
        return returnPos;
    }

    convertTilePositionToWorld(_posX, _posY)
    {
        var _x = _posX * gamePrefs.TILE_SIZE + gamePrefs.TILE_SIZE / 2;
        var _y = _posY * gamePrefs.TILE_SIZE + this.hudClock.height + gamePrefs.TILE_SIZE / 2;
        
        var returnPos = [_x, _y]; 
        return returnPos;
    }

    create()
    { //carga los assets en pantalla desde memoria
        this.start = this.getTime();

        this.hudClock = this.add.sprite(0,0,'hudClock').setOrigin(0);
        this.hudTime = this.add.sprite(0,0,'hudTime').setOrigin(0);

        //Cargo el JSON
        this.map = this.add.tilemap('Stage1_1');
        //Cargo los Tilesets
        this.map.addTilesetImage('Lvl1_Tile');
        //Pintamos las capas/layers
        this.blocks = this.map.createLayer('blocks','Lvl1_Tile');
        this.map.createLayer('ground','Lvl1_Tile');
        this.blocks.debug = true;
        
        var tmpPos = this.convertTilePositionToWorld(2, 1);
        //Creamos el player
        this.player = new Player(this, tmpPos[0], tmpPos[1], 'bombermanWhite');
        
        this.createPools();
        this.createAnimations();
        
        this.hudClock.anims.play("HudClockAnim");
        this.hudTime.anims.play("HudTimeAnim");

        //Indicamos las colisiones con bloques
        this.map.setCollisionBetween(1,16,true,true,'blocks');

        
        //Creamos un listener para detectar colisiones entre el hero y las paredes
        this.physics.add.collider(this.player,this.blocks);

        //Creamos los bloques destruibles 
        this.desTileMap = new Array(15);

        for (let index = 0; index < this.desTileMap.length; index++) {
            this.desTileMap[index] = new Array(13);
        }

        this.spawnDesObj();

        this.spawnDoor();

        //Creamos Enemigos
        this.spawnEnemies();

        this.scoreTotal = this.add.group();
        this.scoreValue = 0;
        this.createScore();
        
        console.log(this.player.lives);
        this.playerLivesManager = new livesControl(this, 272/3 - 55, 16, 'score');

        //Inputs
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursor.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursor.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursor.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.spacePressed = false;
        this.shiftPressed = false;

        //Music
        this.loadSounds();
    }

    loadSounds()
    {
        this.walking1 = this.sound.add('Walking1');
        this.walking2 = this.sound.add('Walking2');
        this.placeBomb = this.sound.add('PlaceBomb');
        this.bombExplodes = this.sound.add('BombExplodes');
        this.music = this.sound.add('Area1Music' , {volume: 0.5});
        this.music.loop = true;
        this.music.play();
    }

    createScore()
    {
        var score;
        for (let i = 0; i < 8; i++)
        {
            score = new scorePrefab(this, 272/2 - 21 - (i*8),16,'score');
            if (i == 0)
                score.setScore(0);
            this.scoreTotal.add(score);
        }
    }

    setAllScore()
    {
        var score = this.scoreTotal.getChildren();
        for (let index = 1; index < score.length; index++) {
            if (Math.pow(10, index) > this.scoreValue)
            break;
            const element = score[index];
            var tmp = this.scoreValue % Math.pow(10, index + 1);
            tmp = Math.trunc(tmp/Math.pow(10, index));
            element.setScore(tmp);
        }
    }

    scoreUp(_value)
    {
        this.scoreValue += _value;
        if (this.scoreValue >= 100000000)
        {
            var temp = this.scoreTotal.getFirst(true);
            this.scoreValue = 99999999;
            temp.setScore(9);
        }

        this.setAllScore();
    }

    gameOver()
    {
        if (this.player.lives <= 0)
            {
                console.log("GAME OVER");
                this.scene.start('Stage1_1');
            }
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
                frameRate:5,
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
                frameRate:10,
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
                frameRate:9,
                yoyo:true,
                repeat:0
            }
        );
        this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL_END_LEFT,
                frames:this.anims.generateFrameNumbers('explosion', {start:4, end:7}),
                frameRate:9,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL_END_RIGHT,
                frames:this.anims.generateFrameNumbers('explosion', {start:8, end:11}),
                frameRate:9,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL_END_UP,
                frames:this.anims.generateFrameNumbers('explosion', {start:12, end:15}),
                frameRate:9,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL_END_DOWN,
                frames:this.anims.generateFrameNumbers('explosion', {start:16, end:19}),
                frameRate:9,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.HORIZONTAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:20, end:23}),
                frameRate:9,
                yoyo:true,
                repeat:0
            }
        );this.anims.create(
            {
                key:Explosion_Tiles.VERTICAL,
                frames:this.anims.generateFrameNumbers('explosion', {start:24, end:27}),
                frameRate:9,
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
                frameRate:1,
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
                frameRate:5,
                yoyo:false,
                repeat:-1
            }   
        );

        this.anims.create(
            {
                key:PowerUpTypes.FIRE_UP,
                frames:this.anims.generateFrameNumbers('fireUp', {start:0, end:1}),
                frameRate:5,
                yoyo:false,
                repeat:-1
            }   
        );
        //#endregion
    }

    createPools()
    {
        this.bombs = this.physics.add.group();
        this.enemies = this.add.group();
        this.desObjs = this.add.group();

        this.powerUps = this.physics.add.group();

        this.bombs.maxSize = this.player.bombNum;

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
        this.placeBomb.play();

        if(this.bombs.getTotalFree())
        {
            var bomb = this.bombs.getFirst(false);
    
            var pos = this.convertWorldPositionToTile(this.player.body.position.x, this.player.body.position.y);
            pos = this.convertTilePositionToWorld(pos[0], pos[1]);

            var posX = pos[0];
            var posY = pos[1];

            if(!bomb)
            {//Generate new bomb
                bomb = new bombPrefab(this, posX, posY, 'bomb', !this.player.kickActive);
    
                this.bombs.add(bomb);
            }
            else
            {//Reset bomb
                bomb.active = true;
                bomb.explosionX = posX;
                
                bomb.body.reset(posX, posY);
                bomb.liveTime = gamePrefs.BOMB_EXPLOSION_TIME;
            }
    
            bomb.body.setVelocity(0,0);
            
            bomb.body.immovable = !this.player.kickActive;
            
            this.physics.add.collider(this.player, bomb);
        }
    }

    spawnExplosion(_posX, _posY)
    {
        console.log(this.convertWorldPositionToTile(_posX, _posY));
        this.bombExplodes.play();
        var right = false;
        var left = false;
        var up = false;
        var down = false;
        
        for (let index = 0; index <= this.player.fireDistance; index++) {
            var explosion;
            if(index == 0)//Central
            {
                explosion = this.explosion_central.getFirst(false);

                if(!explosion)
                {
                    explosion = new ExplosionPrefab(this, _posX, _posY, 'explosion', Explosion_Tiles.CENTRAL);

                    this.explosion_central.add(explosion);
                }
                else
                {
                    explosion.active = true;

                    explosion.body.reset(_posX, _posY);
                    explosion.anims.play(Explosion_Tiles.CENTRAL);
                }

                explosion.body.setSize(17,17);
            }
            else if(index == this.player.fireDistance)//Ends
            {
                var tilePos = this.convertWorldPositionToTile(_posX - index * gamePrefs.TILE_SIZE, _posY);
                if(this.blocks.getTileAtWorldXY(_posX - index * gamePrefs.TILE_SIZE, _posY) == null && !left && this.desTileMap[tilePos[0]][tilePos[1]] == null) 
                {
                    explosion = this.explosion_left_end.getFirst(false);

                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX - index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL_END_LEFT);
    
                        this.explosion_left_end.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;
    
                        explosion.body.reset(_posX- index * gamePrefs.TILE_SIZE, _posY);
                        explosion.anims.play(Explosion_Tiles.HORIZONTAL_END_LEFT);
                    }
                }//Left end

                tilePos = this.convertWorldPositionToTile(_posX + index * gamePrefs.TILE_SIZE, _posY);
                if(this.blocks.getTileAtWorldXY(_posX + index * gamePrefs.TILE_SIZE, _posY) == null && !right && this.desTileMap[tilePos[0]][tilePos[1]] == null) 
                {
                    explosion = this.explosion_right_end.getFirst(false);

                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX + index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL_END_RIGHT);

                        this.explosion_right_end.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;
    
                        explosion.body.reset(_posX + index * gamePrefs.TILE_SIZE, _posY);
                        explosion.anims.play(Explosion_Tiles.HORIZONTAL_END_RIGHT);
                    }
                }//Right end

                tilePos = this.convertWorldPositionToTile(_posX, _posY - index * gamePrefs.TILE_SIZE);
                if(this.blocks.getTileAtWorldXY(_posX, _posY - index * gamePrefs.TILE_SIZE) == null && !up && this.desTileMap[tilePos[0]][tilePos[1]] == null) 
                {

                    explosion = this.explosion_up_end.getFirst(false);
    
                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX, _posY - index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL_END_UP);
    
                        this.explosion_up_end.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;
    
                        explosion.body.reset(_posX, _posY- index * gamePrefs.TILE_SIZE);
                        explosion.anims.play(Explosion_Tiles.VERTICAL_END_UP);
                    }
                }//Up end

                tilePos = this.convertWorldPositionToTile(_posX, _posY + index * gamePrefs.TILE_SIZE);
                if(this.blocks.getTileAtWorldXY(_posX, _posY + index * gamePrefs.TILE_SIZE) == null && !down && this.desTileMap[tilePos[0]][tilePos[1]] == null) 
                {
                    
                    explosion = this.explosion_down_end.getFirst(false);
    
                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX, _posY + index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL_END_DOWN);
    
                        this.explosion_down_end.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;
    
                        explosion.body.reset(_posX, _posY + index * gamePrefs.TILE_SIZE);
                        explosion.anims.play(Explosion_Tiles.VERTICAL_END_DOWN);
                    }
                }//Down end
            }
            else
            {
                var tilePos = this.convertWorldPositionToTile(_posX, _posY - index * gamePrefs.TILE_SIZE);
                if(this.blocks.getTileAtWorldXY(_posX, _posY - index * gamePrefs.TILE_SIZE) == null && !up && this.desTileMap[tilePos[0]][tilePos[1]] == null) 
                {
                    explosion = this.explosion_vertical.getFirst(false);
    
                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX, _posY - index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL);
    
                        this.explosion_vertical.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;
    
                        explosion.body.reset(_posX, _posY - index * gamePrefs.TILE_SIZE);
                        explosion.anims.play(Explosion_Tiles.VERTICAL);
                    }
                    explosion.body.setSize(17,17);
                }//Vertical Up
                else
                    up = true;

                tilePos = this.convertWorldPositionToTile(_posX, _posY + index * gamePrefs.TILE_SIZE);
                if(this.blocks.getTileAtWorldXY(_posX, _posY + index * gamePrefs.TILE_SIZE) == null && !down && this.desTileMap[tilePos[0]][tilePos[1]] == null) 
                {
                    explosion = this.explosion_vertical.getFirst(false);

                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX, _posY + index * gamePrefs.TILE_SIZE, 'explosion', Explosion_Tiles.VERTICAL);

                        this.explosion_vertical.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;

                        explosion.body.reset(_posX, _posY + index * gamePrefs.TILE_SIZE);
                        explosion.anims.play(Explosion_Tiles.VERTICAL);
                    }
                    explosion.body.setSize(17,17);
                }//Vertical Down
                else
                    down = true;
                    
                tilePos = this.convertWorldPositionToTile(_posX - index * gamePrefs.TILE_SIZE, _posY);
                if(this.blocks.getTileAtWorldXY(_posX - index * gamePrefs.TILE_SIZE, _posY) == null && !left && this.desTileMap[tilePos[0]][tilePos[1]] == null)
                {
                    explosion = this.explosion_vertical.getFirst(false);
    
                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX - index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL);
    
                        this.explosion_vertical.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;
    
                        explosion.body.reset(_posX - index * gamePrefs.TILE_SIZE, _posY);
                        explosion.anims.play(Explosion_Tiles.HORIZONTAL);
                    }
                    explosion.setSize(17,17);
                }//Horizontal Left
                else
                    left = true;
                
                tilePos = this.convertWorldPositionToTile(_posX + index * gamePrefs.TILE_SIZE, _posY);
                if(this.blocks.getTileAtWorldXY(_posX + index * gamePrefs.TILE_SIZE, _posY) == null  && !right && this.desTileMap[tilePos[0]][tilePos[1]] == null)
                {
                    explosion = this.explosion_vertical.getFirst(false);

                    if(!explosion)
                    {
                        explosion = new ExplosionPrefab(this, _posX + index * gamePrefs.TILE_SIZE, _posY, 'explosion', Explosion_Tiles.HORIZONTAL);

                        this.explosion_vertical.add(explosion);
                    }
                    else
                    {
                        explosion.active = true;

                        explosion.body.reset(_posX + index * gamePrefs.TILE_SIZE, _posY);
                        explosion.anims.play(Explosion_Tiles.HORIZONTAL);
                    }
                    explosion.setSize(17,17);
                }//Horizontal Right
                else
                    right = true;
                
            }
        }
    }

    bombExploded()
    {
        var bombs = this.bombs.getChildren();

        bombs.forEach(bomb => {
            if(bomb.exploded)
            {
                this.spawnExplosion(bomb.explosionX, bomb.y);
                bomb.exploded = false;
            }
        });
    }

    spawnEnemies()
    {
        var playerPos = this.convertWorldPositionToTile(this.player.x, this.player.y);
        var desObjs = this.desObjs.getChildren();
        var tmpPos;

        var changedPos = false;

        for (let i = 0; i < 3; i++) 
        {
            changedPos = false;

            while(!changedPos)
            {
                tmpPos = this.convertTilePositionToWorld(Phaser.Math.Between(2, 14), Phaser.Math.Between(1, 11));

                //Indestructible blocks
                if(this.blocks.getTileAtWorldXY(tmpPos[0], tmpPos[1]) != null)
                {
                    continue;
                }

                var samePos = false;
                //Destructible blocks
                desObjs.forEach(_e => {
                    var desPos = this.convertWorldPositionToTile(_e.x, _e.y);
                    if(desPos == tmpPos)
                    {
                       samePos = true;
                    }
                });

                if(samePos)
                {
                    continue;
                }

                //Player pos
                if(playerPos == tmpPos)
                {
                    continue;
                }

                //Enemies
                samePos = false;
                if(this.enemies.getLength() != 0)
                {
                    var enemies = this.enemies.getChildren();
                    enemies.forEach(_e => {
                        var ePos = this.convertWorldPositionToTile(_e.x, _e.y);
                        if(ePos == tmpPos)
                        {
                           samePos = true;
                        }
                    });
                }
                
                if(samePos)
                {
                    continue;
                }

                changedPos = true;
            }
            this.enemies.add(new Puropen(this, tmpPos[0], tmpPos[1], 'puropen'));
        }
    }

    spawnDesObj()
    {
        for (let i = 0; i < 32; i++) {
            var randomPos = [Phaser.Math.Between(2, 14), Phaser.Math.Between(1, 11)];
            var tmpPos = this.convertTilePositionToWorld(randomPos[0], randomPos[1]);
            while(this.blocks.getTileAtWorldXY(tmpPos[0], tmpPos[1]) != null)
            {
                randomPos = [Phaser.Math.Between(2, 14), Phaser.Math.Between(1, 11)];
                tmpPos = this.convertTilePositionToWorld(randomPos[0], randomPos[1]);
            }
            this.desObjs.add(new DestructibleBlocks(this, tmpPos[0], tmpPos[1], 'desObj1', 1, 100, true));

            randomPos = this.convertWorldPositionToTile(tmpPos[0], tmpPos[1]);
            console.log(randomPos);
            if(randomPos[0] == 15)
            {
                randomPos[0]--;
            }
            this.desTileMap[randomPos[0]][randomPos[1]] = 1;
        }
        console.log(this.desTileMap);
    }

    spawnDoor()
    {
        var destrObj = this.desObjs.getChildren();
        var rand = Phaser.Math.Between(0, destrObj.length);
        var conversion = this.convertWorldPositionToTile(destrObj[rand].x, destrObj[rand].y);
        console.log("Door position:", conversion[0]-3, conversion[1]- 1);
        this.exit = new exitDoorManager(this, destrObj[rand].x, destrObj[rand].y, 'exit', rand);
        this.exit.anims.play('exitDoorAnim');
    }

    getTime()
    { //Calculate Current Time
        let d = new Date();
        return d.getTime();
    }

    updateScore()
    {
        var enemies = this.enemies.getChildren();

        var desObjs = this.desObjs.getChildren();

        enemies.forEach(_e => {
            if(_e.killed)
            {
                this.scoreUp(_e.scoreEarned);
                _e.destroy();
            }
        });

        if (desObjs[this.exit.randomEnemy].killed)
        {
            this.exit.resetSpawn();
        }

        desObjs.forEach(_e => {
            if(_e.killed)
            {
                console.log(this.desTileMap);
                var tilePos = this.convertWorldPositionToTile(_e.x, _e.y);
                console.log(tilePos);
                this.desTileMap[tilePos[0]][tilePos[1]] = null;
                this.scoreUp(_e.scoreEarned);

                if(_e.x != this.exit.x || _e.y != this.exit.y) // Not same wall than the exit door
                {
                    var random = Phaser.Math.Between(0, 100);
                    if(random >= 0 && random <= gamePrefs.POWER_UP_SPAWN_RATE) // 20%
                    {
                        var powerUp = this.powerUps.getFirst(false);
    
                        random = Phaser.Math.Between(0,1);
                        random = Math.round(random);
                        if(random == 0) // Fire Up
                        {
                            console.log(powerUp);
                            if(!powerUp)
                            {
                                powerUp = new PowerUps(this, _e.x, _e.y, 'fireUp', PowerUpTypes.FIRE_UP);
    
                                this.powerUps.add(powerUp);
                            }
                            else
                            {
                                powerUp.active = true;
                                powerUp.type = PowerUpTypes.FIRE_UP;
                                
                                powerUp.body.reset(_e.x, _e.y);
                            }
                        }
                        else // Bomb Up
                        {
                            if(!powerUp)
                            {
                                powerUp = new PowerUps(this, _e.x, _e.y, 'bombUp', PowerUpTypes.BOMB_UP);
                                
                                this.powerUps.add(powerUp);
                            }
                            else
                            {
                                powerUp.active = true;
                                powerUp.type = PowerUpTypes.BOMB_UP;
                                
                                powerUp.body.reset(_e.x, _e.y);
                            }
                        }
                    }
                }

                _e.destroy();
            }
        });
    }

    update()
    { //actualiza assets
        //Calculate delta time
        this._delta = (this.getTime() - this.start) / 1000;
        this.playerLivesManager.setLives(this.player.lives);
        
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

        if (this.cursor.shift.isDown)
        {
            if (!this.shiftPressed)
            {   
                //Comprobacion de que funciona quitar vidas
                    //this.player.setLives(-1);
                    //console.log(this.player.lives);
                this.scoreUp(100);
                //this.setAllScore();
                this.shiftPressed = true;
                
                this.player.changeBombNum(this.player.bombNum + 1);
                this.bombs.maxSize = this.player.bombNum;
    
            }
        }
        else
        {
            this.shiftPressed = false;
        }
        this.bombExploded();
        this.updateScore();

        //Update last time
        this.start = this.getTime();

        if (this.exit.changeScene == true)
        {
            this.scene.start('Stage1_2');
        }

        if(this.bombs.maxSize != this.player.bombNum)
        {
            this.bombs.maxSize = this.player.bombNum;
        }   

        this.gameOver();
    }
}