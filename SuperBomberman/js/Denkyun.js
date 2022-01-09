class Denkyun extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, EnemyTypes.DENKYUN, 2, 400);

        this.dir = Directions.LEFT;
        this.speed = 2;
        this.body.velocity.x = this.speed * -15;
        
        _scene.physics.add.collider(this, _scene.bombs, this.changeDirection, null, this);
        
        this.anims.play(EnemyTypes.DENKYUN);
    }

    preUpdate(time,delta)
    {
        if(this.dirChanged)
        {
            this.dirChanged = false;
        }

        if(this.body.speed < this.speed * 15)
        {
            if(this.dir == Directions.UP)
            {
                this.body.velocity.y = this.speed * -15;
            }
            else if(this.dir == Directions.DOWN)
            {
                this.body.velocity.y = this.speed * 15;
            }
            else if(this.dir == Directions.RIGHT)
            {
                this.body.velocity.x = this.speed * 15;
            }
            else if(this.dir == Directions.LEFT)
            {
                this.body.velocity.x = this.speed * -15;
            }
        }

        super.preUpdate(time, delta);
    }
}