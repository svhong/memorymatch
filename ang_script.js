var app = angular.module('angularMemory',[]);
app.controller('cardController', function($timeout){
    var self = this;
    var cardClicked = false;
    self.cardArray = [];
    self.clickedArray = [];
    self.winArray = [];
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
        self.clickedArray.push(card);
        if(self.clickedArray.length <= 2){
            card.cardFlipped = true;
        }
        if(self.clickedArray.length > 1) {
            if (self.clickedArray[0].url === self.clickedArray[1].url) {
                console.log('its a match!');
                $timeout(function(){
                    for (var i = 0; i < self.clickedArray.length; i++){
                        self.clickedArray[i].hideCard = true;
                        self.clickedArray[i].vanishCard = true;
                    }
                    self.totalMatches++;
                    self.winArray.push(self.clickedArray[0],self.clickedArray[1]);
                    self.clickedArray = [];
                }, 500);
                if(self.cardArray == 0){
                    console.log('You Win!')
                }
            } else {
                self.totalAttempts++;
                console.log('they are not the same');
                $timeout(function(){
                    for(var i = 0; i < self.clickedArray.length; i++){
                        self.clickedArray[i].cardFlipped = false;

                    }
                    self.clickedArray = [];
                }, 1500);
            }
            self.getAccuracy();
        }
    };
    self.getAccuracy = function(){
        self.accuracy = Math.floor((self.totalMatches/self.totalAttempts)*100) + '%';
    };
    self.resetGame = function(){
        self.gamesPlayed++;

    }
});
$(document).ready(function(){
    bgm();
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

