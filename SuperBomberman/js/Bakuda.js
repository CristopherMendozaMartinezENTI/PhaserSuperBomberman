class Bakuda extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, EnemyTypes.BAKUDA, 1, 800);

        this.dir = Directions.LEFT;
        this.speed = 2;
        this.body.velocity.x = this.speed * -15;
        
        this.anims.play(EnemyTypes.BAKUDA + this.dir);
    }

    preUpdate(time,delta)
    {
        if(this.health <= 0)
        {
            console.log(EnemyTypes.BAKUDA + " killed");

            this.x = -10;
            this.active = false;
        }
        else if(this.dirChanged)
        {
            this.anims.play(EnemyTypes.BAKUDA + this.dir);
            this.dirChanged = false;
        }

        super.preUpdate(time, delta);
    }
}