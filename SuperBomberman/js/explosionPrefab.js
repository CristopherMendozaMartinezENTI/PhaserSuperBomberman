class ExplosionPrefab extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { //crea la escena
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        this.setOrigin(0);
        
        var d = new Date();
        this.spawnTime = d.getTime();
    }
}