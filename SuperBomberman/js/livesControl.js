class livesControl extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { 
        //Creamos Sprite del player
        super(_scene, _positionX, _positionY, _sprite);
        _scene.add.existing(this);
        this.setOrigin(.5);

        this.lives = 3;
    }

    preUpdate(time,delta)
    {
        this.setFrame(this.lives + 1);
        super.preUpdate(time, delta);
    }

    setLives(_value)
    {
        this.lives = _value;
    }

    resetLives()
    {
        this.lives = 3;
    }
}