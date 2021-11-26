class bombPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.add.existing(this);

        this.setOrigin(0.5);

        this.anims.play('bombAnim');

        this.exploded = false;
        this.explosionX = _positionX;
        
        this.liveTime = gamePrefs.BOMB_EXPLOSION_TIME;
    }

    preUpdate(time,delta)
    {
        if(this.liveTime < 0)
        {
            console.log("Explota");
            
            this.exploded = true;
            this.x = -100;
            this.active = false;
        }
        this.liveTime -= delta;
        
        super.preUpdate(time, delta);
    }
}