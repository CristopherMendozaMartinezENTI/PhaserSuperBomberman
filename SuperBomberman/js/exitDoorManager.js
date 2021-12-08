class exitDoorManager extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _randEnemy)
    { 
        super(_scene, -100, _positionY, _sprite);
        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.setOrigin(.5);

        this.changeScene = false;

        this.posX = _positionX;

        this.randomEnemy = _randEnemy;
        
        this.playerColl = _scene.physics.add.overlap(this, _scene.player, this.goToNextLevel, null, this);
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }

    goToNextLevel()
    {
        console.log("Les goooo nuevo nivel pium pium");
        this.changeScene = true;
    }

    resetSpawn()
    {
        this.x = this.posX;
    }

}