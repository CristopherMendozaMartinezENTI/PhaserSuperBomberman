class PowerUps extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite, _type)
    {
        super(_scene,_positionX, _positionY, _sprite);
        _scene.add.existing(this);

        this.type = _type;
        this.used = false;

        this.destroyed = false;

        this.anims.play(this.type);

        _scene.physics.add.overlap(this, _scene.player, this.activate, null, this);
        
        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.destroyPowerUp, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.destroyPowerUp, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.destroyPowerUp, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.destroyPowerUp, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.destroyPowerUp, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.destroyPowerUp, null, this);
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);

        if(this.destroyed && !this.anims.isPlaying)
        {
            this.destroy();
        }
    }

    activate(_powerUp, _player, _scene)
    {
        if(_powerUp.type == PowerUpTypes.BOMB_UP)
        {
            _player.bombNum += 1;
        }
        else if(_powerUp.type == PowerUpTypes.FIRE_UP)
        {
            _player.fireDistance += 1;
        }
        else if(_powerUp.type == PowerUpTypes.SPEED_UP)
        {
            _player.playerSpeed *= 1.5;
        }
        else if(_powerUp.type == PowerUpTypes.KICK)
        {

        }
        else if(_powerUp.type == PowerUpTypes.VEST)
        {
            _player.isInvulnerable = true;
        }
        else if(_powerUp.type == PowerUpTypes.TIME)
        {

        }
        else if(_powerUp.type == PowerUpTypes.REMOTE_CONTROL)
        {
            _player.controlBomb = true;
        }

        console.log(_player.fireDistance);

        _powerUp.active = false;
        _powerUp.x = gameOptions.gameWidth + 100;
        _powerUp.used = true;
    }

    destroyPowerUp()
    {
        this.anims.play("enemymExAnim");
        this.destroyed = true;
    }
}