class CollisionBody extends Phaser.GameObjects.Rectangle
{
    constructor(_scene, _positionX, _positionY, _sizeX, _sizeY)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sizeX, _sizeY);
        _scene.physics.add.existing(this);
        this.setOrigin(0);
        this.body.collideWorldBounds = true;
    }
}