class Bigaron extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _health, _scoreEarned)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.body.setSize(16,16,false);
        this.body.setOffset(32, 84);
        
        this.setOrigin(.5);

        this.depth = 1;

        this.health = _health;
        this.scoreEarned = _scoreEarned;

        this.dirChanged = false;
        this.killed = false;

        this.explosionCollided_X = -10;
        this.explosionCollided_Y = -10;
        this.explosionCollided_Type = 0;
        
        this.invulnerability = false;
        this.invulnerableTime = gamePrefs.INVULNERABLE_TIME;

        _scene.physics.add.collider(this, _scene.limits, this.changeDirection, null, this);
        _scene.physics.add.collider(this, _scene.blocks, this.changeDirection, null, this);

        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.kill, null, this);

        this.dir = Directions.RIGHT;
        this.lastDir = Directions.LEFT;
        this.speed = 2;
        this.body.velocity.x = this.speed * -15;
        this.attackTimeDown = 1500;
        this.currentTimeDown = 10000;
        this.attackMode = false;
    }

    preUpdate(time, delta)
    {
        if(this.health <= 0 && !this.anims.isPlaying)
        {
            this.killed = true;
            //this.anims.play("enemymExAnim");
        }
        else
        {
            this.moveEnemy();
            this.timeDown(delta);
        }
        super.preUpdate(time, delta);

        //Activate attack mode
        this.attackTimeDown -= delta;
        if(this.attackTimeDown < 0 && !this.attackMode)
        {
            console.log("Martillazo");
            this.attackMode = true;
            this.lastDir = this.dir;
            this.dir = Directions.NONE;
            this.speed = 0;
            this.anims.play("bigaronAttack");
        }
    } 

    update(_delta)
    {
        if(this.invulnerability)
        {
            console.log("Boss Hitted");
            if(this.tintFill)
            {
                this.anims.play("bigaronHurt");
            }
            else{
                this.anims.play("bigaronIdle"); 
            }
            this.invulnerableTime -= _delta;
            if (this.invulnerableTime <= 0)
            {
                this.invulnerability = false;
                this.invulnerableTime = gamePrefs.INVULNERABLE_TIME;
                this.tintFill = false;
            }
        }
    }

    timeDown(delta)
    {
        this.currentTimeDown -= delta;
        if(this.currentTimeDown <= 0)
        {
            this.invulnerability = false;
            this.speed = 2;
            this.attackTimeDown = 1500;
            this.currentTimeDown = 10000;
            this.attackMode = false;
            this.dir = this.lastDir;
            this.anims.play("bigaronIdle"); 
        }
    }

    moveEnemy()
    {
        if(this.dir == Directions.UP)
        {
            this.body.velocity.y = this.speed * -15;
        }
        else if(this.dir == Directions.DOWN)
        {
            this.body.velocity.y = this.speed * 15;
        }
        else if(this.dir == Directions.LEFT)
        {
            this.body.velocity.x = this.speed * -15;
        }
        else if(this.dir == Directions.RIGHT)
        {
            this.body.velocity.x = this.speed * 15;
        }
    }

    turnBack(_enemy)
    {
        if(_enemy.health > 0 && !_enemy.dirChanged)
        {
            if(_enemy.dir == Directions.UP)
            {
                _enemy.body.velocity.y = _enemy.speed * 15;
                _enemy.dir = Directions.DOWN;
                
            }
            else if(_enemy.dir == Directions.DOWN)
            {
                 _enemy.body.velocity.y = _enemy.speed * -15;
                 _enemy.dir = Directions.UP;
            }
            else if(_enemy.dir == Directions.RIGHT)
            {  
                _enemy.body.velocity.x = _enemy.speed * -15;
                _enemy.dir = Directions.LEFT;    
            }
            else if(_enemy.dir == Directions.LEFT)
            {
                _enemy.body.velocity.x = _enemy.speed * 15;
                _enemy.dir = Directions.RIGHT;
            }
            _enemy.dirChanged = true;
        }
    }

    changeDirection(_enemy)
    {
        if(_enemy.attackMode)
        {
            return;
        }
        if(_enemy.health > 0)
        {
            var changed = false;
            var changedDir = Math.random() * 4;
    
            while(!changed)
            {
                if(changedDir == 0 && _enemy.dir != Directions.UP)
                {
                    changed = true;
                    _enemy.body.velocity.y = _enemy.speed * -15;
                    _enemy.dir = Directions.UP;
                }
                else if(changedDir == 1 && _enemy.dir != Directions.DOWN)
                {
                    changed = true;
                    _enemy.body.velocity.y = _enemy.speed * 15;
                    _enemy.dir = Directions.DOWN;
                }
                else if(changedDir == 2 && _enemy.dir != Directions.LEFT)
                {
                    changed = true;
                    _enemy.body.velocity.x = _enemy.speed * -15;
                    _enemy.dir = Directions.LEFT;
                }
                else if(changedDir == 3 && _enemy.dir != Directions.RIGHT)
                {
                    changed = true;
                    _enemy.body.velocity.x = _enemy.speed * 15;
                    _enemy.dir = Directions.RIGHT;
                }
                else
                {
                    changedDir = Math.trunc(Math.random() * 4);
                }
            }
        }
        _enemy.dirChanged = true;
    }

    kill(_enemy, _explosion)
    {
        if(!_enemy.invulnerability)
        {
            _enemy.explosionCollided_Type = _explosion.explosionTile;
            _enemy.explosionCollided_X = _explosion.x;
            _enemy.explosionCollided_Y = _explosion.y;
            _enemy.health--;
            _enemy.invulnerability = true;
        }
    }
}