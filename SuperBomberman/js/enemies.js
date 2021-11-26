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
        
        _scene.physics.add.collider(this, _scene.blocks, this.changeDirection, null, this, _scene);
        _scene.physics.add.collider(this, _scene.bombss);

        _scene.physics.add.collider(this, _scene.explosion_down_end, this.kill, null, this, _scene);
        _scene.physics.add.collider(this, _scene.explosion_up_end, this.kill, null, this, _scene);
        _scene.physics.add.collider(this, _scene.explosion_left_end, this.kill, null, this, _scene);
        _scene.physics.add.collider(this, _scene.explosion_right_end, this.kill, null, this, _scene);
        _scene.physics.add.collider(this, _scene.explosion_horizontal, this.kill, null, this, _scene);
        _scene.physics.add.collider(this, _scene.explosion_vertical, this.kill, null, this, _scene);

        this.type = _enemyType;
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }

    
    changeDirection(_puropen)
    {
        var changed = false;
        var changedDir = Math.random() * 4;

        while(changed == false)
        {
            if(changedDir == 0 && _puropen.dir != Directions.UP)
            {
                changed = true;
                _puropen.dir = Directions.UP;
                _puropen.anims.play(_puropen.type+Directions.UP);
            }
            else if(changedDir == 1 && _puropen.dir != Directions.DOWN)
            {
                changed = true;
                _puropen.dir = Directions.DOWN;
                _puropen.anims.play(_puropen.type+Directions.DOWN);
            }
            else if(changedDir == 2 && _puropen.dir != Directions.LEFT)
            {
                changed = true;
                _puropen.dir = Directions.LEFT;
                _puropen.anims.play(_puropen.type+Directions.LEFT);
            }
            else if(changedDir == 3 && _puropen.dir != Directions.RIGHT)
            {
                changed = true;
                _puropen.dir = Directions.RIGHT;
                _puropen.anims.play(_puropen.type+Directions.RIGHT);
            }
            else
            {
                changedDir = Math.trunc(Math.random() * 4);
            }
        }
    }

    kill(_enemy, _gameScene)
    {
        console.log("Killed");

        //_gameScene.scoreUp(_enemy.scoreEarned);
    }
}