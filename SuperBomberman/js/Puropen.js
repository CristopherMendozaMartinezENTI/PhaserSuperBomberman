class Puropen extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, EnemyTypes.PUROPEN, 1, 100);

        this.dir = Directions.LEFT;
        this.speed = 2;
        this.body.velocity.x = this.speed * -15;
        
        this.anims.play(EnemyTypes.PUROPEN+this.dir);
    }

    preUpdate(time,delta)
    {
        if(this.dirChanged)
        {
            this.anims.play(EnemyTypes.PUROPEN+this.dir);
            this.dirChanged = false;
        }

        if(this.health <= 0)
        {
            console.log(EnemyTypes.PUROPEN + " killed");

            this.x = -10;
            this.active = false;
        }

        super.preUpdate(time, delta);
    }
}