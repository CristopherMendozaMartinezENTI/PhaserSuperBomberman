class Bakuda extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, EnemyTypes.BAKUDA, 1, 800);

        this.dir = Directions.LEFT;
        this.lastDir = Directions.LEFT;
        this.speed = 2;

        this.attackTimeDown = 1500;

        this.spawnBomb = false;
        this.attackMode = false;
        this.currentTimeDown = gamePrefs.BOMB_EXPLOSION_TIME + 1000;

        this.tmpX = _positionX;
        this.spawnBombPositionX = _positionX;
        
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
        else if(this.attackMode && !this.anims.isPlaying)
        {
            if(!this.spawnBomb && this.x < 500)
            {
                this.spawnBombPositionX = this.body.position.x;
                this.tmpX = this.x;
                this.x = 100000;
                
                this.spawnBomb = true;
            }
            this.timeDown(delta);
        }
        else if(this.dirChanged)
        {
            this.anims.play(EnemyTypes.BAKUDA + this.dir);
            this.dirChanged = false;
        }

        super.preUpdate(time, delta);

        //Activate attack mode
        this.attackTimeDown -= delta;
        if(this.attackTimeDown < 0 && !this.attackMode)
        {
            console.log("Explota");
            this.attackMode = true;

            this.lastDir = this.dir;
            this.dir = Directions.NONE;

            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            this.anims.play("bakudaAttack");
        }

        console.log(this.spawnBombPositionX);
    }

    timeDown(delta)
    {
        this.currentTimeDown -= delta;
        if(this.currentTimeDown <= 0)
        {
            this.invulnerability = false;
            this.currentTimeDown = gamePrefs.BOMB_EXPLOSION_TIME + 1000;

            this.attackTimeDown = 10000;

            this.dir = this.lastDir;

            this.x = this.tmpX;
            this.spawnBombPositionX = this.x;

            this.anims.play(EnemyTypes.BAKUDA + this.dir);
            this.attackMode = false;
            console.log(this.tmpX);
            console.log("deja de explotar");
        }
        else if(this.currentTimeDown <= 500)
        {
            this.invulnerability = true;
        }
        console.log("Invulnerability: " + this.invulnerability);
    }
}