class Stage_BossArena extends Phaser.Scene
{
    constructor()
    { //crea la escena
        super(
        {
            key:"Stage_BossArena"
        });
    }

    preload()
    { //carga los assets en memoria
        //var rutaImg = 'assets/Sprites/';
        this.load.setPath('assets/Sprites/');
        this.load.spritesheet('bombermanWhite', 'Player_White.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('playerDeath', 'Player_White_Dead_Anim.png', {frameWidth:16, frameHeight:24});
        this.load.spritesheet('bigaron', 'Boss_Bigaron.png', {frameWidth:77, frameHeight:152});
        this.load.spritesheet('enemymEx', 'EnemyDieAnim.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('bomb', 'Bomb.png',{frameWidth:16, frameHeight:16});
        this.load.spritesheet('explosion', 'Fire.png',{frameWidth:16, frameHeight:16});
        this.load.spritesheet('score','HUD_Numbers.png', {frameWidth:8, frameHeight:14});
        this.load.spritesheet('hudClock', 'HUDTimeAnim.png', {frameWidth:272, frameHeight:32});
        this.load.spritesheet('exit', 'Obj_Exit.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('hudTime', 'TimeAnim.png', {frameWidth:272, frameHeight:32});

        this.load.setPath("assets/Tiles/");
        this.load.image('BossArenaTile','BossArenaTile.png');

        this.load.setPath('assets/Maps/');
        this.load.tilemapTiledJSON('BossArena','BossArena.json');

        this.load.setPath('assets/Sounds/')
        this.load.audio('Walking1','Walking1.wav');
        this.load.audio('Walking2','Walking2.wav');
        this.load.audio('PlaceBomb','PlaceBomb.wav');
        this.load.audio('BombExplodes','BombExplodes.wav');
        this.load.audio('ItemGet','ItemGet.wav');
        this.load.audio('BossMusic','BossMusic.mp3');
    }

    convertWorldPositionToTile(_posX, _posY)
    {
        var _x = Math.trunc((_posX - gamePrefs.TILE_SIZE / 2) / gamePrefs.TILE_SIZE);
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

    init(data)
    {
        this.currentLives = data.Lives;
        this.scoreValue = data.Score;
        this.currentbombNum = data.BombNum;
        this.currentFireDistance = data.FireDistance;
        this.currentSpeed = data.Speed;
    }

    create()
    { //carga los assets en pantalla desde memoria
        this.start = this.getTime();

        this.hudClock = this.add.sprite(0,0,'hudClock').setOrigin(0);
        this.hudTime = this.add.sprite(0,0,'hudTime').setOrigin(0);

        //Cargo el JSON
        this.map = this.add.tilemap('BossArena');
        //Cargo los Tilesets
        this.map.addTilesetImage('BossArenaTile');
        //Pintamos las capas/layers
        this.blocks = this.map.createLayer('blocks','BossArenaTile');
        this.edges = this.map.createLayer('edges', 'BossArenaTile');
        this.limits = this.map.createLayer('limits', 'BossArenaTile');
        this.map.createLayer('ground','BossArenaTile');
        this.blocks.debug = true;
        
        this.createPools();
        this.createAnimations();
        
        var tmpPos = this.convertTilePositionToWorld(8, 11);
        //Creamos el player
        this.player = new Player(this, tmpPos[0], tmpPos[1], 'bombermanWhite');
        
        this.hudClock.anims.play("HudClockAnim");
        this.hudTime.anims.play("HudTimeAnim");

        //Indicamos las colisiones con bloques
        this.map.setCollisionBetween(1,19,true,true,'blocks');
        this.map.setCollisionBetween(1,19,true,true,'edges');
        this.map.setCollisionBetween(1,19,true,true,'limits');

        //Creamos un listener para detectar colisiones entre el hero y las paredes
        this.physics.add.collider(this.player,this.blocks, this.checkSmoothTransitionBetweenPlayerAndBlocks, null, this);
        this.physics.add.collider(this.player,this.edges);

        //Creamos los bloques destruibles 
        this.desTileMap = new Array(15);

        for (let index = 0; index < this.desTileMap.length; index++) {
            this.desTileMap[index] = new Array(13);
        }

        //Creamos Enemigos
        this.spawnEnemies();

        this.scoreTotal = this.add.group();
        this.createScore();
        
        //Actualizamos informacion respecto al nivel anterior
        this.player.lives = this.currentLives;
        this.setAllScore();
        this.player.bombNum = this.currentbombNum;
        this.player.fireDistance = this.currentFireDistance;
        this.player.playerSpeed = this.currentSpeed;

        this.playerLivesManager = new livesControl(this, 272/3 - 55, 16, 'score');
        this.playerLivesManager.setLives(this.player.lives);

        //Inputs
        this.cursor = this.input.keyboard.createCursorKeys();
        this.cursor.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursor.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.cursor.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.cursor.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.cursor.F1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.cursor.F2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.cursor.F3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.cursor.F4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.cursor.F5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.cursor.F6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.cursor.CTRL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

        this.spacePressed = false;
        this.shiftPressed = false;

        //Music
        this.loadSounds();

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    loadSounds()
    {
        this.walking1 = this.sound.add('Walking1');
        this.walking2 = this.sound.add('Walking2');
        this.placeBomb = this.sound.add('PlaceBomb');
        this.bombExplodes = this.sound.add('BombExplodes');
        this.itemGet = this.sound.add("ItemGet");
        this.music = this.sound.add('BossMusic' , {volume: 0.5});
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

        //#region BigaronIdle
        this.anims.create(
            {
                key:'bigaronIdle',
                frames:this.anims.generateFrameNumbers('bigaron', {start:0, end:0}),
                frameRate:5,
                yoyo:false,
                repeat:-1
            }   
        );
        //#endregion 

         //#region BigaronAttack
        this.anims.create(
            {
                key:'bigaronAttack',
                frames:this.anims.generateFrameNumbers('bigaron', {start:1, end:3}),
                frameRate:5,
                yoyo:false,
                repeat:0 
            }   
        );
        //#endregion

         //#region BigaronHurt
         this.anims.create(
            {
                key:'bigaronHurt',
                frames:this.anims.generateFrameNumbers('bigaron', {start:4, end:4}),
                frameRate:5,
                yoyo:false,
                repeat:0
            }   
        );
        //#endregion
        
    }

    createPools()
    {
        this.bombs = this.physics.add.group();
        this.bombs.maxSize = 1;

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
            pos = this.convertTilePositionToWorld(pos[0] + 1, pos[1]);

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
            
            console.log(!this.player.kickActive);
            bomb.body.immovable = true;
            
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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }

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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }
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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }
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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }
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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }

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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }

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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }

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
                if(tilePos[0] == 15)
                {
                    tilePos[0]--;
                }

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

    checkSmoothTransitionBetweenPlayerAndBlocks(player, block)
    {
        var tmp = this.convertTilePositionToWorld(block.x, block.y - 2);
        tmp[0] -= gamePrefs.TILE_SIZE/2;
        tmp[1] -= gamePrefs.TILE_SIZE/2;
        var canMove = true;
        if (player.dir == Directions.RIGHT)
        {
            var result = tmp[1] - player.body.position.y;
            
            //#region Comprobacion Bombas
            var bombs = this.bombs.getChildren();
            bombs.forEach(bomb => {
                if (bomb.active)
                {
                    var bombPos = this.convertWorldPositionToTile(bomb.x, bomb.y);
                    //var pPos = this.convertWorldPositionToTile(player.body.position.x, player.body.position.y);
                    if (result < -2 && (bombPos[0] == block.x && bombPos[1] == block.y + 1 - 2))
                    {
                        canMove = false;
                    }
                    else if (result > 2 && (bombPos[0] == block.x && bombPos[1] == block.y - 1 - 2))
                    {
                        canMove = false;
                    }
                }
                if (!canMove)
                    return;
            });
            //#endregion

            if (result < -2 && this.blocks.getTileAtWorldXY(tmp[0], tmp[1] + gamePrefs.TILE_SIZE) == null && canMove && this.edges.getTileAtWorldXY(tmp[0], tmp[1] + gamePrefs.TILE_SIZE) == null
            && this.blocks.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1] + gamePrefs.TILE_SIZE) == null)	//Esta por abajo y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[0] == block.x - 1 && bombPos[1] == block.y + 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x + gamePrefs.TILE_SIZE, player.body.position.y + gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
                
            }
            else if (result > 2 && this.blocks.getTileAtWorldXY(tmp[0], tmp[1] - gamePrefs.TILE_SIZE) == null && canMove && this.edges.getTileAtWorldXY(tmp[0], tmp[1] - gamePrefs.TILE_SIZE) == null
            && this.blocks.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1] - gamePrefs.TILE_SIZE) == null)	//Esta por arriba y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[0] == block.x - 1 && bombPos[1] == block.y - 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x + gamePrefs.TILE_SIZE, player.body.position.y - gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
            }
        }
        else if (player.dir == Directions.LEFT)
        {
            var result = tmp[1] - player.body.position.y;
            //#region Comprobacion Bombas
            var bombs = this.bombs.getChildren();
            bombs.forEach(bomb => {
                if (bomb.active)
                {
                    var bombPos = this.convertWorldPositionToTile(bomb.x, bomb.y);
                    //var pPos = this.convertWorldPositionToTile(player.body.position.x, player.body.position.y);
                    if (result < - 2 && (bombPos[0] == block.x && bombPos[1] == block.y + 1 - 2))
                    {
                        canMove = false;
                    }
                    if (result > 2 && (bombPos[0] == block.x && bombPos[1] == block.y - 1 - 2))
                    {
                        canMove = false;
                    }
                }
                if (!canMove)
                    return;
            });
            //#endregion

            if (result < -2 && this.blocks.getTileAtWorldXY(tmp[0], tmp[1] + gamePrefs.TILE_SIZE) == null && canMove && this.edges.getTileAtWorldXY(tmp[0], tmp[1] + gamePrefs.TILE_SIZE) == null
                && this.blocks.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1] + gamePrefs.TILE_SIZE) == null)	//Esta por abajo y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[0] == block.x - 1 && bombPos[1] == block.y + 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x - gamePrefs.TILE_SIZE, player.body.position.y + gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
            }
            else if (result > 2 && this.blocks.getTileAtWorldXY(tmp[0], tmp[1] - gamePrefs.TILE_SIZE) == null && canMove && this.edges.getTileAtWorldXY(tmp[0], tmp[1] - gamePrefs.TILE_SIZE) == null
                && this.blocks.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1] - gamePrefs.TILE_SIZE) == null)	//Esta por arriba y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[0] == block.x - 1 && bombPos[1] == block.y - 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x - gamePrefs.TILE_SIZE, player.body.position.y - gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
            }
        }
        else if (player.dir == Directions.UP)
        {
            var result = tmp[0] - player.body.position.x;
            
            //#region Comprobacion Bombas
            var bombs = this.bombs.getChildren();
            bombs.forEach(bomb => {
                if (bomb.active)
                {
                    var bombPos = this.convertWorldPositionToTile(bomb.x, bomb.y);
                    //var pPos = this.convertWorldPositionToTile(player.body.position.x, player.body.position.y);
                    if (result < -2 && (bombPos[1] == block.y && bombPos[0] == block.x + 1 - 2))
                    {
                        canMove = false;
                    }
                    if (result > 2 && (bombPos[1] == block.y && bombPos[0] == block.x - 1 - 2))
                    {
                        canMove = false;
                    }
                }
                if (!canMove)
                    return;
            });
            //#endregion

            
            console.log(canMove);
            if (result < -2 && this.blocks.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1]) == null && canMove && this.edges.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1]) == null
            && this.blocks.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1] - gamePrefs.TILE_SIZE) == null)	//Esta por derecha y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[1] == block.y - 1 && bombPos[0] == block.x + 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x + gamePrefs.TILE_SIZE, player.body.position.y - gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
                
            }
            else if (result > 2 && this.blocks.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1]) == null && canMove && this.edges.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1]) == null
            && this.blocks.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1] + gamePrefs.TILE_SIZE) == null)	//Esta por izquierda y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[1] == block.y - 1 && bombPos[0] == block.x - 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
               
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x - gamePrefs.TILE_SIZE, player.body.position.y - gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
            }
        }
        else if (player.dir == Directions.DOWN)
        {
            var result = tmp[0] - player.body.position.x;
             //#region Comprobacion Bombas
            var bombs = this.bombs.getChildren();
            bombs.forEach(bomb => {
                if (bomb.active)
                {
                    var bombPos = this.convertWorldPositionToTile(bomb.x, bomb.y);
                    //var pPos = this.convertWorldPositionToTile(player.body.position.x, player.body.position.y);
                    if (result < -2 && (bombPos[1] == block.y && bombPos[0] == block.x + 1 - 2))
                    {
                        canMove = false;
                    }
                    if (result > 2 && (bombPos[1] == block.y && bombPos[0] == block.x - 1 - 2))
                    {
                        canMove = false;
                    }
                }
                if (!canMove)
                    return;
            });
            //#endregion

            
            console.log(canMove);
            if (result < -2 && this.blocks.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1]) == null && canMove && this.edges.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1]) == null
            && this.blocks.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1] + gamePrefs.TILE_SIZE) == null)	//Esta por derecha y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[1] == block.y - 1 && bombPos[0] == block.x + 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x + gamePrefs.TILE_SIZE, player.body.position.y + gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
            }
            else if (result > 2 && this.blocks.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1]) == null && canMove && this.edges.getTileAtWorldXY(tmp[0] - gamePrefs.TILE_SIZE, tmp[1]) == null
            && this.blocks.getTileAtWorldXY(tmp[0] + gamePrefs.TILE_SIZE, tmp[1] + gamePrefs.TILE_SIZE) == null)	//Esta por izquierda y no hay bloque
            {
                bombs.forEach(obj => {
                    if (obj.active)
                    {
                        var bombPos = this.convertWorldPositionToTile(obj.x, obj.y);
                        if (bombPos[1] == block.y - 1 && bombPos[0] == block.x - 1 - 2)
                        {
                            canMove = false;
                        }
                    }
                    if (!canMove)
                    return;
                });
                
                if (canMove)
                {
                    var nextPos = new Phaser.Math.Vector2(player.body.position.x - gamePrefs.TILE_SIZE, player.body.position.y + gamePrefs.TILE_SIZE);
                    player.body.position.x = Phaser.Math.Linear(player.body.position.x, nextPos.x,0.1);
                    player.body.position.y = Phaser.Math.Linear(player.body.position.y, nextPos.y, 0.1);
                }
            }
        }
    }

    spawnEnemies()
    {
        var tmpPos = this.convertTilePositionToWorld(8, 5);
        //Instanciar al jefe.
        this.boss = new Bigaron(this, tmpPos[0], tmpPos[1], 'bigaron', 10, 10000);
    }

    getTime()
    { //Calculate Current Time
        let d = new Date();
        return d.getTime();
    }

    updateScore()
    {
        if(this.boss.killed)
        {
            this.scoreUp(this.boss.scoreEarned);
            this.boss.killed = false;
            this.boss.destroy();
        }
        else if(this.boss.invulnerability)
        {
            var explosions;
            switch (this.boss.explosionCollided_Type) {
                case Explosion_Tiles.CENTRAL:
                    explosions = this.explosion_central.getChildren();
                    break;
                case Explosion_Tiles.HORIZONTAL:
                    explosions = this.explosion_horizontal.getChildren();
                    break;
                case Explosion_Tiles.HORIZONTAL_END_LEFT:
                    explosions = this.explosion_left_end.getChildren();
                    break;
                case Explosion_Tiles.HORIZONTAL_END_RIGHT:
                    explosions = this.explosion_right_end.getChildren();
                    break;
                case Explosion_Tiles.VERTICAL:
                    explosions = this.explosion_vertical.getChildren();
                    break;
                case Explosion_Tiles.VERTICAL_END_DOWN:
                    explosions = this.explosion_down_end.getChildren();
                    break;
                case Explosion_Tiles.VERTICAL_END_UP:
                    explosions = this.explosion_up_end.getChildren();
                    break;
            }
        }
    }

    update()
    { //actualiza assets
        if(this.bombs.maxSize != this.player.bombNum)
        {
            this.bombs.maxSize = this.player.bombNum;
        }
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

        if(this.bombs.maxSize != this.player.bombNum)
        {
            this.bombs.maxSize = this.player.bombNum;
        }  
        
        //ShortCuts a Niveles
        if (this.cursor.F1.isDown)
        {
            this.music.stop();
            this.scene.start('Stage1_1');
        }
        else if(this.cursor.F2.isDown)
        {
            this.music.stop();
            this.scene.start('Stage1_2', 
                            {Lives: this.player.lives, 
                            Score: this.scoreValue,
                            BombNum: this.player.bombNum,
                            FireDistance: this.player.fireDistance,
                            Speed: this.player.playerSpeed});
        }
        else if(this.cursor.F2.isDown)
        {
            this.music.stop();
            this.scene.start('Stage1_2', 
                            {Lives: this.player.lives, 
                            Score: this.scoreValue,
                            BombNum: this.player.bombNum,
                            FireDistance: this.player.fireDistance,
                            Speed: this.player.playerSpeed});
        }
        else if(this.cursor.F3.isDown)
        {
            this.music.stop();
            this.scene.start('Stage1_3', 
                            {Lives: this.player.lives, 
                            Score: this.scoreValue,
                            BombNum: this.player.bombNum,
                            FireDistance: this.player.fireDistance,
                            Speed: this.player.playerSpeed});
        }
        else if(this.cursor.F4.isDown)
        {
            this.music.stop();
            this.scene.start('Stage1_4', 
                            {Lives: this.player.lives, 
                            Score: this.scoreValue,
                            BombNum: this.player.bombNum,
                            FireDistance: this.player.fireDistance,
                            Speed: this.player.playerSpeed});
        }
        else if(this.cursor.F5.isDown)
        {
            this.music.stop();
            this.scene.start('Stage1_5', 
                            {Lives: this.player.lives, 
                            Score: this.scoreValue,
                            BombNum: this.player.bombNum,
                            FireDistance: this.player.fireDistance,
                            Speed: this.player.playerSpeed});
        }
        
        this.gameOver();
    }
}