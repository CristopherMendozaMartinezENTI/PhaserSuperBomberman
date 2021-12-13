var config=
{
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    scene:[ Stage1_1, Stage1_2 ], //array con los niveles
    render:{pixelArt:true},
    physics:{
        default:'arcade',
        arcade:{debug:false}
    }
}
var juego = new Phaser.Game(config);



