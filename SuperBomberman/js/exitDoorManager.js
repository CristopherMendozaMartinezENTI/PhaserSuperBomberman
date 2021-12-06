class exitDoorManager extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { 
        super(_scene, _positionX, _positionY, _sprite);
        _scene.add.existing(this);
        this.setOrigin(.5);
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }
}