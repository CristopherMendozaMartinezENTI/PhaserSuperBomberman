class DestructibleBlocks extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _health, _scoreEarned, _isAnimated)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.body.setSize(16,16,false);

        //this.setDepth(1);

        this.health = _health;
        this.scoreEarned = _scoreEarned;

        this.killed = false;

        this.isAnimated = _isAnimated;

        this.playerCol = _scene.physics.add.collider(this, _scene.player);
        this.exCollDown = _scene.physics.add.overlap(this, _scene.explosion_down_end, this.kill, null, this);
        this.exCollUp = _scene.physics.add.overlap(this, _scene.explosion_up_end, this.kill, null, this);
        this.exCollLeft = _scene.physics.add.overlap(this, _scene.explosion_left_end, this.kill, null, this);
        this.exCollRight = _scene.physics.add.overlap(this, _scene.explosion_right_end, this.kill, null, this);
        this.exCollHorizontal = _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.kill, null, this);
        this.exCollVertical = _scene.physics.add.overlap(this, _scene.explosion_vertical, this.kill, null, this);
        
        if(this.isAnimated) this.anims.play("desObjAnim");

        this.body.immovable = true;
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }

    kill()
    {
        console.log("Destroyed");
        this.anims.play("desObjAnimEx");
        this.killed = true;
        this.health = -1;
        //Desactivo las colisiones
        //this.playerCol.active = false;
        //this.exCollDown.active = false;
        //this.exCollUp.active = false;
        //this.exCollLeft.active = false;
        //this.exCollRight.active = false;
        //this.exCollHorizontal.active = false;
        //this.exCollVertical.active = false;
        this.x = -30;
        this.active = false;
    }
}