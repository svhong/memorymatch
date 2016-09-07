var app = angular.module('angularMemory',[]);
app.controller('cardController', function($timeout){
    var self = this;
    self.cardArray = [];
    self.clickedArray = [];
    self.winArray = [];
    self.modalFlash = false;
    self.blindUser = false;
    self.gamesPlayed = 1;
    self.totalMatches = 0;
    self.totalAttempts = 0;
    self.accuracy = '0%';
    self.cardList = ['images/biff.jpg','images/delorean.jpg','images/emmettbrown.jpg','images/fluxcapacitor.png','images/george.jpg','images/greatscott.jpg','images/lorraine.jpg','images/marty.jpg','images/timecircuit.jpg','images/delorean2.jpg','images/bttf2.jpg','images/bttf3.jpg'];
    self.cardList = self.cardList.concat(self.cardList);
    self.createRandomBoard = function(){
        self.mixedArray = randomize(self.cardList);
        for(var i = 0; i < self.mixedArray.length; i++){
            var obj = {};
            obj.url = self.mixedArray[i];
            obj.back = 'images/cardback.jpg';
            obj.cardFlipped = false;
            obj.hideCard = false;
            obj.vanishCard = false;
            self.cardArray.push(obj);
        }
    };
    self.createRandomBoard();
    self.cardClicked = function(card){
        if(self.clickedArray.length == 2){
            return;
        }
        if(card.cardFlipped){
            return;
        }
        self.clickedArray.push(card); //does this kind of function
        if(self.clickedArray.length <= 2){
            card.cardFlipped = true;
        }
        if(self.clickedArray.length > 1) {
            if (self.clickedArray[0].url === self.clickedArray[1].url) {
                $timeout(function(){
                    for (var i = 0; i < self.clickedArray.length; i++){
                        self.clickedArray[i].hideCard = true;
                        self.clickedArray[i].vanishCard = true;
                    }
                    self.totalMatches++;
                    self.winArray.push(self.clickedArray[0],self.clickedArray[1]);
                    self.clickedArray = [];
                    if(self.winArray.length === 2){
                        // self.cardArray.length
                        $('#winModal').modal('show');
                        launch();
                        resetGif();
                        self.blindUser = true;
                        self.modalFlash = true;
                        self.cardArray = [];
                        $timeout(function(){
                           closeModal();
                           self.resetGame();
                        },3900);
                    }
                }, 700);
            } else {
                self.totalAttempts++;
                $timeout(function(){
                    for(var i = 0; i < self.clickedArray.length; i++){
                        self.clickedArray[i].cardFlipped = false;
                    }
                    self.clickedArray = [];
                }, 1000);
            }
            self.getAccuracy();
        }
    };
    self.getAccuracy = function(){
        self.accuracy = Math.floor((self.totalMatches/self.totalAttempts)*100) + '%';
    };
    self.resetGame = function(){
        self.hideModal = true;
        self.gamesPlayed++;
        self.cardArray = [];
        self.createRandomBoard();
        self.clickedArray = [];
        self.winArray = [];
        self.totalAttempts = 0;
        self.totalMatches = 0;
        self.blindUser = false;
        self.modalFlash = false;
    }
});
$(document).ready(function(){
    bgm();
    audioClick();
});

function randomize(me){
    var temp = null;
    var i = 0;
    var x = 0;
    for (i = me.length - 1; i > 0 - 1; i--){
        x = Math.floor((Math.random()*me.length));
        temp = me[i];
        me[i] = me[x];
        me[x] =  temp;
    }
    return me;
}
function bgm(){
    $('#bgm')[0].play();
}
function launch(){
    $('#launch2')[0].play();
}
function audioClick(){
    $('.audioDiv').on('click', '#mute',function(){
        var $this = $(this);
        $this.attr('id', 'unmute').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
        $('#bgm')[0].muted = true;
    }).on('click', '#unmute', function(){
        var $this = $(this);
        $this.attr('id', 'mute').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
        $('#bgm')[0].muted = false;
    });
}
function resetGif(){
    $('#launch').attr('src', '');
    $('#launch').attr('src', 'images/launch.gif');
}

function closeModal(){
    $('#winModal').modal('hide');
}