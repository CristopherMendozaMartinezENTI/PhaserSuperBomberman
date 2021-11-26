class Puropen extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite, _enemyType)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, _enemyType);

        this.health = 1;
        this.scoreEarned = 100;
        this.speed = 2;

        this.dir = Directions.LEFT;
    }

    preUpdate(time,delta)
    {
        if(this.health <= 0)
        {
            console.log("Enemy killed");

            this.x = -10;
            this.active = false;
        }
        
        super.preUpdate(time, delta);
    }

    updatePuropen()
    {
        if(this.dir == Directions.UP)
        {
            this.body.velocity.y = this.speed * -10;
        }
        else if(this.dir == Directions.DOWN)
        {
            this.body.velocity.y = this.speed * 10;
        }
        else if(this.dir == Directions.LEFT)
        {
            this.body.velocity.x = this.speed * -10;
        }
        else if(this.dir == Directions.RIGHT)
        {
            this.body.velocity.x = this.speed * 10;
        }
        else
        {

        }
    }
}