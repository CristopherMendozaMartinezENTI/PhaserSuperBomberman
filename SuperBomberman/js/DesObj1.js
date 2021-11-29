class DesObj1 extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _health, _scoreEarned)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.body.setSize(16,16,false);
    
        this.health = _health;
        this.scoreEarned = _scoreEarned;
        this.speed = 2;

        this.killed = false;

        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.kill, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.kill, null, this);
        
        this.anims.play("desObjAnim");

        this.body.immovable = true;
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
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