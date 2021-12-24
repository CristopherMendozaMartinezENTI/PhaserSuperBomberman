class Nuts_Star extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, EnemyTypes.NUTS_STAR, 1, 200);

        this.dir = Directions.LEFT;
        this.speed = 2;
        this.body.velocity.x = this.speed * -15;
        
        this.anims.play(EnemyTypes.NUTS_STAR + this.dir);
    }

    preUpdate(time,delta)
    {
        if(this.health <= 0)
        {
            console.log(EnemyTypes.NUTS_STAR + " killed");

            this.x = -10;
            this.active = false;
        }
        else if(this.dirChanged)
        {
            this.anims.play(EnemyTypes.NUTS_STAR+this.dir);
            this.dirChanged = false;
        }

        super.preUpdate(time, delta);
    }
}