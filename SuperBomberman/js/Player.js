class Player extends Phaser.GameObjects.Sprite
{
    constructor(_scene, _positionX, _positionY, _sprite)
    { //crea la escena
        super(_scene, _positionX, _positionY, _sprite);
        _scene.add.existing(this);
        this.setOrigin(0);
        this.collider = new CollisionBody(_scene, _positionX, _positionY, 16, 16);

        this.dir = Directions.DOWN;
    }

    update(_direction)
    {        
        if(_direction == Directions.NONE)
        {
            this.stop();

            if(this.dir == Directions.UP)
                this.setFrame(1);
            else if(this.dir == Directions.DOWN)
                this.setFrame(4);
            else if(this.dir == Directions.LEFT)
                this.setFrame(7);
            else if(this.dir == Directions.RIGHT)
                this.setFrame(10);

            this.collider.body.velocity.x = 0;
            this.collider.body.velocity.y = 0;
        }
        else
        {
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
            this.play(_direction, true);
        }

        this.dir = _direction;

        this.x = this.collider.body.position.x;
        this.y = this.collider.body.position.y - this.collider.body.halfHeight;
    }
}