class scorePrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { 
        //Creamos Sprite del player
        super(_scene, _positionX, _positionY, _sprite);
        _scene.add.existing(this);
        this.setOrigin(.5);

        this.numValue = 0;
    }

    preUpdate(time,delta)
    {
        this.setFrame(this.numValue);
        super.preUpdate(time, delta);
    }

    setScore(_value)
    {
        this.numValue = _value + 1;
    }
}