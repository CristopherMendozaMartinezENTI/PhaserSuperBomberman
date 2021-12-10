class Player extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { 
        //Creamos Sprite del player
        super(_scene, _positionX, _positionY - 3, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);
        this.setOrigin(.5);

        this.body.setSize(12, 12);
        this.body.setOffset(12/4, 12 / 1.1);

        this.fireDistance = 1;
        this.lives = 5;

        this.killed = false;
        
        this.isInvulnerable = false;
        this.invulnerableTime = gamePrefs.INVULNERABLE_TIME;
        this.bombNum = 1;

        this.depth = 2;

        this.initPosX = _positionX;
        this.initPosY = _positionY - 3;

        _scene.physics.add.overlap(this, _scene.explosion_central, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_down_end, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_up_end, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_left_end, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_right_end, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_horizontal, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.explosion_vertical, this.hit, null, this);
        _scene.physics.add.overlap(this, _scene.enemies, this.hit, null, this);


        //Set de la posicion inicial
        this.dir = Directions.DOWN;
    }

    preUpdate(time,delta)
    {
        if(this.killed && !this.anims.isPlaying)
        {
            if (this.lives <= 0)
                this.lives = 0;
            this.isInvulnerable = true;
            this.resetPos();
            this.killed = false;
        }
        super.preUpdate(time, delta);
    }

    update(_direction, _delta)
    {        
        if(this.isInvulnerable)
        {
            this.invulnerableTime -= _delta;
            //console.log("Invulnerable");
            if (this.invulnerableTime <= 0)
            {
                this.isInvulnerable = false;
                this.invulnerableTime = gamePrefs.INVULNERABLE_TIME;
            }
        }
        if(_direction == Directions.NONE)
        {
            //Parar animacion
            this.anims.stop();

            //Set Frame de animacion con respecto a la ultima direccion
            if(this.dir == Directions.UP)
                this.setFrame(1);
            else if(this.dir == Directions.DOWN)
                this.setFrame(4);
            else if(this.dir == Directions.LEFT)
                this.setFrame(7);
            else if(this.dir == Directions.RIGHT)
                this.setFrame(10);

            //Anular velocidad del rigidbody
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        
        }
        else
        {
            //Set velocidad rigidbody
            if (_direction == Directions.UP)
            {
                this.body.velocity.y = gamePrefs.speedPlayer * -1;
                this.body.velocity.x = 0;
                
            }
            else if (_direction == Directions.DOWN)
            {
                this.body.velocity.y = gamePrefs.speedPlayer;
                this.body.velocity.x = 0;
            }
            else if (_direction == Directions.LEFT)
            {
                this.body.velocity.x = gamePrefs.speedPlayer * -1;
                this.body.velocity.y = 0;
            }
            else if (_direction == Directions.RIGHT)
            {
                this.body.velocity.x = gamePrefs.speedPlayer;
                this.body.velocity.y = 0;
            }

            //Activar animacion respecto la direccion
            this.anims.play(_direction, true);
        }

        //Set direccion
        this.dir = _direction;
    }

    changeBombNum(_value)
    {
        this.bombNum = _value;
    }   

    resetPos()
    {
        this.x = this.initPosX;
        this.y = this.initPosY;
        this.anims.play(Directions.DOWN, true);
        this.setFrame(4);
    }
   
    hit(_hero)
    {
        if (!_hero.isInvulnerable)
        {
            _hero.lives -= 1;
            _hero.killed = true;
            _hero.anims.play('playerDeathAnim');
            console.log("animacion: ", _hero.anims.isPlaying);
            /*if (_hero.lives <= 0)
                _hero.lives = 0;
            _hero.isInvulnerable = true;
            _hero.resetPos(_hero);*/
        }
    }

    
}