class Puropen extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite, _enemyType, _health, _scoreEarned)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, _enemyType, _health, _scoreEarned);

        this.dir = Directions.LEFT;
        
        this.anims.play(this.type+Directions.LEFT);
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

    postUpdate()
    {
        this.dirChanged = false;
    }

    updatePuropen()
    {
        if(this.health > 0)
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
}