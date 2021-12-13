const Directions = {
    UP:'up',
    DOWN:'down',
    LEFT:'left',
    RIGHT:'right',
    NONE: 'none'
};

const EnemyTypes={
    PUROPEN: "puropen",
    BAKUDA:"bakuda",
    DENKYUN:"denkyun",
    NUTSSTAR:"nutsStar",
    PAKUPA:"pakupa"
};

const PowerUpTypes={
    BOMB_UP: "bomb_up",
    FIRE_UP:"fire_up",
    SPEED_UP:"speed_up",
    KICK:"kick",
    VEST:"vest",
    TIME:"time",
    REMOTE_CONTROL: "remote_control"
};

const Explosion_Tiles={
    CENTRAL: "central",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    HORIZONTAL_END_LEFT: "horizontal_end_left",
    HORIZONTAL_END_RIGHT: "horizontal_end_right",
    VERTICAL_END_UP: "vertical_end_up",
    VERTICAL_END_DOWN: "vertical_end_down"
};

var gamePrefs=
{
    TILE_SIZE:16,
    INITIAL_HEIGHT: 32,             //HUD height
    speedPlayer:60,
    maxSpeedPlayer:60 * 3,
    BOMB_EXPLOSION_TIME: 3000,
    INVULNERABLE_TIME: 3,
    POWER_UP_SPAWN_RATE: 20
}

var gameOptions = 
{
    gameWidth:272,   
    gameHeight: 240, 
}

//Informacion que nos guardaremos entre escenas
var playerPrefs =
{
    LIVES: 5,
    SCORE: 0,
    //Power ups, pondremos un 0 o un 1 para habilitarlos entre escenas
    BOMB_UP: 0,
    FIRE_UP: 0,
    SPEED_UP: 0,
    KICK: 0,
    REMOTE_CONTROL: 0
}