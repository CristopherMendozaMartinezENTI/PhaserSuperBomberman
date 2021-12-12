class bombPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _immovable)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.add.existing(this);

        this.setOrigin(0.5);

        this.playerKick = _immovable;
        this.anims.play('bombAnim');
        
        _scene.physics.add.collider(this, _scene.blocks, this.collided);
        _scene.physics.add.collider(this, _scene.desObjs, this.collided);
        _scene.physics.add.collider(this, _scene.enemies, this.collided);

        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.explode, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.explode, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.explode, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.explode, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.explode, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.explode, null, this);

        this.exploded = false;
        this.explosionX = _positionX;
        
        this.liveTime = gamePrefs.BOMB_EXPLOSION_TIME;
    }

    preUpdate(time,delta)
    {
        if(this.body.immovable && this.playerKick)
        {
            this.body.immovable = false;
            this.body.setVelocity(0,0);
        }


        if(this.liveTime < 0 && !this.exploded)
        {
            console.log("Explota");
            
            this.explode(this);
        }
        this.liveTime -= delta;
        
        super.preUpdate(time, delta);
    }

    explode(_bomb)
    {
        _bomb.exploded = true;
        _bomb.explosionX = _bomb.x;
        _bomb.x = -100;
        _bomb.active = false;
    }

    collided(_bomb)
    {
        _bomb.body.immovable = true;
    }
}