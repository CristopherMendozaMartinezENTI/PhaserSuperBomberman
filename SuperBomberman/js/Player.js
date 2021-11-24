class Player extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { 
        //Creamos Sprite del player
        super(_scene, _positionX, _positionY, _sprite);
        _scene.physics.add.existing(this);
        _scene.add.existing(this);
        this.setOrigin(.5);

        this.body.setSize(12, 12);
        this.body.setOffset(12/4, 12 / 1.1);

        this.fireDistance = 1;
        this.lives = 3;

        //Set de la posicion inicial
        this.dir = Directions.DOWN;
    }

    update(_direction, _delta)
    {        
        if(_direction == Directions.NONE)
        {
            //Parar animacion
            this.stop();

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
            this.play(_direction, true);
        }

        //Set direccion
        this.dir = _direction;
    }

    resetLives()
    {
        this.lives = 3;
    }

    setLives(_value)
    {
        this.lives += _value;
        if (this.lives <= 0)
            this.lives = 0;
    }
}