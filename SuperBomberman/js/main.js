var gamePrefs=
{
    speedPlayer:50
}

var config=
{
    type: Phaser.AUTO,
    width:256,
    height:240,
    scene:[gameState], //array con los niveles
    render:{
        pixelArt:true
    },
    physics:{
        default:'arcade',
        arcade:{
            debug:true
        }
    }
}
var juego = new Phaser.Game(config);

