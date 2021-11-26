class Enemies extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _enemyType)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.body.setSize(12,12,false);
        this.body.setOffset(12/4, 12 / 1.1);
        this.setOrigin(.5);

        this.anims.play(_enemyType+Directions.DOWN);
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }
}