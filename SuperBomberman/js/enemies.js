class Enemies extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _enemyType, _health, _scoreEarned)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.body.setSize(16,16,false);
        this.body.setOffset(0, 16/ 2);
        this.setOrigin(.5);

        this.health = _health;
        this.scoreEarned = _scoreEarned;

        this.dirChanged = false;
        this.killed = false;
        
        _scene.physics.add.collider(this, _scene.blocks, this.changeDirection, null, this);
        _scene.physics.add.collider(this, _scene.bombs, this.changeDirection, null, this);
        _scene.physics.add.collider(this, _scene.desObjs, this.changeDirection, null, this);

        _scene.physics.add.collider(this, _scene.enemies, this.turnBack, null, this);

        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.kill, null, this);
        
        this.type = _enemyType;
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
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
        //console.log(_enemy.health);
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

    kill(_enemy)
    {
        console.log("Killed");
        _enemy.killed = true;
    }
}