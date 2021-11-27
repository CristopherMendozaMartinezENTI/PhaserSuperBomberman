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
        this.speed = 2;

        this.killed = false;
        
        _scene.physics.add.collider(this, _scene.blocks, this.changeDirection, null, this);
        _scene.physics.add.collider(this, _scene.bombs, this.changeDirection, null, this);

        _scene.physics.add.collider(this, _scene.explosion_down_end, this.kill, null, this);
        _scene.physics.add.collider(this, _scene.explosion_up_end, this.kill, null, this);
        _scene.physics.add.collider(this, _scene.explosion_left_end, this.kill, null, this);
        _scene.physics.add.collider(this, _scene.explosion_right_end, this.kill, null, this);
        _scene.physics.add.collider(this, _scene.explosion_horizontal, this.kill, null, this);
        _scene.physics.add.collider(this, _scene.explosion_vertical, this.kill, null, this);
        
        this.type = _enemyType;
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }

    changeDirection(_enemy)
    {
        //console.log(_enemy.health);
        if(_enemy.health > 0)
        {
            var changed = false;
            var changedDir = Math.random() * 4;
    
            while(changed == false)
            {
                if(changedDir == 0 && _enemy.dir != Directions.UP)
                {
                    changed = true;
                    _enemy.dir = Directions.UP;
                    _enemy.anims.play(_enemy.type+Directions.UP);
                }
                else if(changedDir == 1 && _enemy.dir != Directions.DOWN)
                {
                    changed = true;
                    _enemy.dir = Directions.DOWN;
                    _enemy.anims.play(_enemy.type+Directions.DOWN);
                }
                else if(changedDir == 2 && _enemy.dir != Directions.LEFT)
                {
                    changed = true;
                    _enemy.dir = Directions.LEFT;
                    _enemy.anims.play(_enemy.type+Directions.LEFT);
                }
                else if(changedDir == 3 && _enemy.dir != Directions.RIGHT)
                {
                    changed = true;
                    _enemy.dir = Directions.RIGHT;
                    _enemy.anims.play(_enemy.type+Directions.RIGHT);
                }
                else
                {
                    changedDir = Math.trunc(Math.random() * 4);
                }
            }
        }
    }

    kill(_enemy)
    {
        console.log("Killed");

        _enemy.killed = true;
        _enemy.health = -1;
        _enemy.x = -30;
        _enemy.active = false;
    }
}