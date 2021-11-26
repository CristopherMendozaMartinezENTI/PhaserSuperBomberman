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
    speedPlayer:50,
    BOMB_EXPLOSION_TIME: 3000
}

var gameOptions = {
    gameWidth:272,   
    gameHeight: 240, 
}