class Pakupa extends Enemies
{
    constructor(_scene, _positionX, _positionY, _sprite)
    {
        super(_scene, _positionX, _positionY - 3, _sprite, EnemyTypes.PAKUPA, 3, 400);

        this.dir = Directions.LEFT;
        this.speed = 2;
        this.body.velocity.x = this.speed * -15;

        _scene.physics.add.collider(this, _scene.bombs, this.CollisionBomb, null, this);
        
        this.nextPosition = new Array(2);
        this.nextPosition[0] = new Array(2);
        this.target = new Phaser.Math.Vector2(-10, -10);
        this.targetFound = false;
        
        this.anims.play(EnemyTypes.PAKUPA + this.dir);
    }

    preUpdate(time,delta)
    {
        if(this.targetFound)
        {
            
        }
        else if(this.dirChanged)
        {
            this.anims.play(EnemyTypes.PAKUPA + this.dir);
            this.dirChanged = false;
        }

        super.preUpdate(time, delta);
    }

    GoToNextPosition(_scene)
    {
        this.dir = this.nextPosition[1];
        this.moveEnemy();

        console.log("My next dir is: " + this.nextPosition[1] + 
        ". My target pos is: " + _scene.convertWorldPositionToTile(this.target.x,this.target.y) +
        ". My next pos is: " + _scene.convertWorldPositionToTile(this.nextPosition[0][0],this.nextPosition[0][1]) +
        ". My current pos is: " + _scene.convertWorldPositionToTile(this.x,this.y));

        if(Math.abs(this.x - this.nextPosition[0][0]) <= 12 && Math.abs(this.y - this.nextPosition[0][1]) <= 12) 
        {
            this.PathfindingAlgorithm(_scene);
        }
    }

    CollisionBomb(_enemy, _bomb)
    {
        if(this.targetFound)
        {
            _bomb.exploded = false;
            _bomb.x = -100;
            _bomb.active = false;

            this.targetFound = false;
            this.nextPosition = new Array(2);
            this.target = new Phaser.Math.Vector2(-10, -10);
        }
    }

    CheckBombDistance(_scene)
    {

        var bombs = _scene.bombs.getChildren();
        var nearestBombDistance = 100; 
        var nearestBombPositionX = null;
        var nearestBombPositionY = null;

        //Check the Nearest bomb in range
        bombs.forEach(bomb => {
            if(bomb.active)
            {
                var resultX = (bomb.x - this.x) / 16;
                var resultY = (bomb.y - this.y) / 16;
                if(resultX < 8 && resultY < 8)
                {
                    var distance = Phaser.Math.Distance.Between(bomb.x, bomb.y, this.x, this.y) / 16;
                    if(distance < nearestBombDistance)
                    {
                        nearestBombDistance = distance;
                        nearestBombPositionX = bomb.x;
                        nearestBombPositionY = bomb.y;
                    }
                }
            }
        });
        
        if(nearestBombPositionX == null)
        {
            return;
        }

        if(this.target.x < 0 || (this.target.x != nearestBombPositionX && this.target.y != nearestBombPositionY))
        {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            this.target = new Phaser.Math.Vector2(nearestBombPositionX, nearestBombPositionY);
            this.targetFound = true;

            this.PathfindingAlgorithm(_scene);
        }
    }

    DistanceBetweenPoints(_pos1X, _pos1Y, _pos2X, _pos2Y)
    {
        var dx = _pos2X - _pos1X;
        var dy = _pos2Y - _pos1Y;

        var result = dx + dy;
        
        return result;
    }

    PathfindingAlgorithm(_scene)
    {
        var targetTilePos = new Array(2);
        targetTilePos[0] = (this.target.x - 8) / gamePrefs.TILE_SIZE;
        targetTilePos[1] = ((this.target.y) - gamePrefs.INITIAL_HEIGHT) / gamePrefs.TILE_SIZE;
        var currentPos = _scene.convertWorldPositionToTile(this.x, this.y);
        
        var result = 10000;
        var tmpNextPos = new Array(2);
        tmpNextPos[0] = new Array(2);

        var nextPos = new Array(2);

        //Up position
        nextPos[0] = currentPos[0];
        nextPos[1] = currentPos[1] - 1;

        var tmpResult = 
            _scene.graph[currentPos[0]][currentPos[1] - 1] + 
            this.DistanceBetweenPoints(targetTilePos[0], targetTilePos[1], currentPos[0], currentPos[1] - 1);
            
            console.log("Graph in pos: " + nextPos + " = " + _scene.graph[currentPos[0]][currentPos[1] + 1]);
        if(tmpResult < result)
        {
            result = tmpResult;

            tmpNextPos[0] = _scene.convertTilePositionToWorld(currentPos[0], currentPos[1] - 1);
            tmpNextPos[0][0] += gamePrefs.TILE_SIZE / 2;
            tmpNextPos[0][1] += gamePrefs.TILE_SIZE / 2;

            tmpNextPos[1] = Directions.UP;

            console.log("AAA");
        }

        //Down position
        nextPos[0] = currentPos[0];
        nextPos[1] = currentPos[1] + 1;

        tmpResult = 
            _scene.graph[currentPos[0]][currentPos[1] + 1] + 
            this.DistanceBetweenPoints(targetTilePos[0], targetTilePos[1], currentPos[0], currentPos[1] + 1);

            console.log("Graph in pos: " + nextPos + " = " + _scene.graph[currentPos[0]][currentPos[1] + 1]);
        
        if(tmpResult < result)
        {
            result = tmpResult;

            tmpNextPos[0] = _scene.convertTilePositionToWorld(currentPos[0], currentPos[1] + 1);
            tmpNextPos[0][0] += gamePrefs.TILE_SIZE / 2;
            tmpNextPos[0][1] += gamePrefs.TILE_SIZE / 2;


            tmpNextPos[1] = Directions.DOWN;
            console.log("AAA");
        }

        //Left position
        nextPos[0] = currentPos[0] - 1;
        nextPos[1] = currentPos[1];

        tmpResult = 
            _scene.graph[currentPos[0] - 1][currentPos[1]] + 
            this.DistanceBetweenPoints(targetTilePos[0],targetTilePos[1], currentPos[0] - 1, currentPos[1]);
        
            console.log("Graph in pos: " + nextPos + " = " + _scene.graph[currentPos[0]][currentPos[1] + 1]);
        if(tmpResult < result)
        {
            result = tmpResult;
            
            tmpNextPos[0] = _scene.convertTilePositionToWorld(currentPos[0] - 1, currentPos[1]);
            tmpNextPos[0][0] += gamePrefs.TILE_SIZE / 2;
            tmpNextPos[0][1] += gamePrefs.TILE_SIZE / 2;


            tmpNextPos[1] = Directions.LEFT;
            console.log("AAA");
        }
        
        //Right position
        nextPos[0] = currentPos[0] + 1;
        nextPos[1] = currentPos[1];

        tmpResult = 
            _scene.graph[currentPos[0] + 1][currentPos[1]] + 
            this.DistanceBetweenPoints(targetTilePos[0], targetTilePos[1], currentPos[0] + 1, currentPos[1]);
    
            console.log("Graph in pos: " + nextPos + " = " + _scene.graph[currentPos[0]][currentPos[1] + 1]);
        if(tmpResult < result)
        {
            result = tmpResult;

            tmpNextPos[0] = _scene.convertTilePositionToWorld(currentPos[0] + 1, currentPos[1]);
            tmpNextPos[0][0] += gamePrefs.TILE_SIZE / 2;
            tmpNextPos[0][1] += gamePrefs.TILE_SIZE / 2;


            tmpNextPos[1] = Directions.RIGHT;
            console.log("AAA");
        }

        this.nextPosition[0] = tmpNextPos[0];
        this.nextPosition[1] = tmpNextPos[1];
        
    }
}