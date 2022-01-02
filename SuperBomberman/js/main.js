var config=
{
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    scene:[ Stage1_1, Stage1_2, Stage1_3, Stage1_4, Stage1_5, Stage_BossArena ], //array con los niveles
    render:{pixelArt:true},
    physics:{
        default:'arcade',
        arcade:{debug:false}
    }
}
var juego = new Phaser.Game(config);



