class ExplosionPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _explosionTile)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.add.existing(this);
        this.setOrigin(.5);

        //this.setDepth(0);

        this.anims.play(_explosionTile);
    }

    preUpdate(time,delta)
    {
        if(!this.anims.isPlaying)
        {
            console.log("Explota");

            this.x = -10;
            this.active = false;
        }
        
        super.preUpdate(time, delta);
    }
}