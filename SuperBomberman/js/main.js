var config=
{
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    scene:[gameState], //array con los niveles
    render:{pixelArt:true},
    physics:{
        default:'arcade',
        arcade:{debug:false}
    }
}
var juego = new Phaser.Game(config);

