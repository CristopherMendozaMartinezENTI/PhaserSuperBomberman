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

        _scene.physics.add.collider(this, _scene.edges, this.changeDirection, null, this);
        _scene.physics.add.collider(this, _scene.bombs, this.changeDirection, null, this);

        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.kill, null, this);
    }

    preUpdate(time,delta)
    {
        if(this.health <= 0 && !this.anims.isPlaying)
        {
            this.killed = true;
            //this.anims.play("enemymExAnim");
        }
        else
        {
            this.moveEnemy();
        }
        super.preUpdate(time, delta);
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

    turnBack(_enemy, _collidedEnemy)
    {
        if(_enemy.health > 0 && !_enemy.dirChanged)
        {
            if(_enemy.dir == Directions.UP)
            {
                if(_enemy.body.position.y > _collidedEnemy.body.position.y)//Current enemy
                {
                    _enemy.body.velocity.y = _enemy.speed * 15;
                    _enemy.dir = Directions.DOWN;
                }

                //Collided enemy
                if(_collidedEnemy.dir == Directions.DOWN)
                {
                    _collidedEnemy.body.velocity.y = _collidedEnemy.speed * -15;
                    _collidedEnemy.dir = Directions.UP;
                }
            }
            else if(_enemy.dir == Directions.DOWN)
            {
                if(_enemy.body.position.y < _collidedEnemy.body.position.y)//Current enemy
                {
                    _enemy.body.velocity.y = _enemy.speed * -15;
                    _enemy.dir = Directions.UP;
                }

                //Collided enemy
                if(_collidedEnemy.dir == Directions.UP)
                {
                    _collidedEnemy.body.velocity.y = _collidedEnemy.speed * 15;
                    _collidedEnemy.dir = Directions.DOWN;
                }
            }
            else if(_enemy.dir == Directions.RIGHT)
            {
                if(_enemy.body.position.x < _collidedEnemy.body.position.x)//Current enemy
                {
                    _enemy.body.velocity.x = _enemy.speed * -15;
                    _enemy.dir = Directions.LEFT;
                }

                //Collided enemy
                
                if(_collidedEnemy.dir == Directions.LEFT)
                {
                    _collidedEnemy.body.velocity.x = _collidedEnemy.speed * 15;
                    _collidedEnemy.dir = Directions.RIGHT;
                }
            }
            else if(_enemy.dir == Directions.LEFT)
            {
                if(_enemy.body.position.x > _collidedEnemy.body.position.x)//Current enemy
                {
                    _enemy.body.velocity.x = _enemy.speed * 15;
                    _enemy.dir = Directions.RIGHT;
                }

                //Collided enemy
                if(_collidedEnemy.dir == Directions.RIGHT)
                {
                    _collidedEnemy.body.velocity.x = _collidedEnemy.speed * -15;
                    _collidedEnemy.dir = Directions.LEFT;
                }
            }

            _collidedEnemy.dirChanged = true;
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