class DestructibleBlocks extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _health, _scoreEarned, _isAnimated)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.body.setSize(16,16,false);

        //this.setDepth(1);

        this.exitDoor = false;

        this.health = _health;
        this.scoreEarned = _scoreEarned;

        this.killed = false;
        this.destroyed = false;

        this.isAnimated = _isAnimated;

        this.playerCol = _scene.physics.add.collider(this, _scene.player);
        this.exCollCentral = _scene.physics.add.collider(this, _scene.explosion_central, this.kill, null, this);
        this.exCollDown = _scene.physics.add.collider(this, _scene.explosion_down_end, this.kill, null, this);
        this.exCollUp = _scene.physics.add.collider(this, _scene.explosion_up_end, this.kill, null, this);
        this.exCollLeft = _scene.physics.add.collider(this, _scene.explosion_left_end, this.kill, null, this);
        this.exCollRight = _scene.physics.add.collider(this, _scene.explosion_right_end, this.kill, null, this);
        this.exCollHorizontal = _scene.physics.add.collider(this, _scene.explosion_horizontal, this.kill, null, this);
        this.exCollVertical = _scene.physics.add.collider(this, _scene.explosion_vertical, this.kill, null, this);
        
        
        if(this.isAnimated) this.anims.play("desObjAnim");


        this.body.immovable = true;
    }

    preUpdate(time,delta)
    {
        if(this.destroyed && !this.anims.isPlaying)
        {
            this.killed = true;
            //console.log("Obj destroyed");
        }
        
        if (this.playerColLeftUp)
        console.log("ola k ase");

        super.preUpdate(time, delta);
    }

    kill(_obj, _explosion)
    {
        var distance = Math.sqrt( Math.pow(_obj.x - _explosion.x, 2) + Math.pow(_obj.y - _explosion.y, 2));
        if(distance <= gamePrefs.TILE_SIZE)
        {
            if(this.isAnimated)
                _obj.anims.play("desObjAnimEx");
            else
                _obj.anims.play("desObj2AnimEx");
            _obj.destroyed = true;
        }
    }
}