class PowerUp extends Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _type)
    {
        super(_scene,_positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);

        this.type = _type;

        this.anims.play(this.type);

        _scene.physics.add.overlap(this, _scene.player, this.activate, null, this);
    }

    activate(_powerUp, _player)
    {
        if(_powerUp.type == PowerUpTypes.BOMB_UP)
        {
            _player.bombNum++;
        }
        else if(_powerUp.type == PowerUpTypes.FIRE_UP)
        {
            _player.fireDistance++;
        }
        else if(_powerUp.type == PowerUpTypes.SPEED_UP)
        {
            _player.playerSpeed++;
        }
        else if(_powerUp.type == PowerUpTypes.KICK)
        {

        }
        else if(_powerUp.type == PowerUpTypes.VEST)
        {

        }
        else if(_powerUp.type == PowerUpTypes.TIME)
        {

        }
        else if(_powerUp.type == PowerUpTypes.REMOTE_CONTROL)
        {

        }
    }
}