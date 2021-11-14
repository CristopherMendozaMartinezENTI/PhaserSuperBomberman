class Player extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { 
        //Creamos Sprite del player
        super(_scene, _positionX, _positionY, _sprite);
        _scene.add.existing(this);
        this.setOrigin(0);

        //Creamos Rigidbody del player
        this.collider = new CollisionBody(_scene, _positionX, _positionY, 12, 12);
        
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
            this.collider.body.velocity.x = 0;
            this.collider.body.velocity.y = 0;
        }
        else
        {
            //Set velocidad rigidbody
            if (_direction == Directions.UP)
            {
                this.collider.body.velocity.y = gamePrefs.speedPlayer * -1;
                this.collider.body.velocity.x = 0;
            }
            else if (_direction == Directions.DOWN)
            {
                this.collider.body.velocity.y = gamePrefs.speedPlayer;
                this.collider.body.velocity.x = 0;
            }
            else if (_direction == Directions.LEFT)
            {
                this.collider.body.velocity.x = gamePrefs.speedPlayer * -1;
                this.collider.body.velocity.y = 0;
            }
            else if (_direction == Directions.RIGHT)
            {
                this.collider.body.velocity.x = gamePrefs.speedPlayer;
                this.collider.body.velocity.y = 0;
            }

            //Activar animacion respecto la direccion
            this.play(_direction, true);
        }

        //Set direccion
        this.dir = _direction;

        //Update position player
        this.x = this.collider.body.x - 3;
        this.y = this.collider.body.y - 12;
    }
}