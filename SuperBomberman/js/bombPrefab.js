class bombPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.add.existing(this);

        this.setOrigin(0.5);

        this.anims.play('bombAnim');
        
        this.liveTime = gamePrefs.BOMB_EXPLOSION_TIME;
    }

    preUpdate(time,delta)
    {
        if(this.liveTime < 0)
        {
            console.log("Explota");
            this.x = -10;
            this.active = false;
        }
        this.liveTime -= delta;
        
        super.preUpdate(time, delta);
    }
}