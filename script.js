var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;
/*global variable (flag variable) set to clicked to check to enable/disable user clicks*/
var clicked = false;

/*----------------------need to set document ready for pictures on load as well--------------------------*/

$(document).ready(function () {
    $('.card').on('click', card_clicked);
    games_played = 0;
    display_stats();
    $('.reset').on('click', reset_stats);
    $('.gameOver').hide();
});
function card_clicked() {
    /*---------------CARD WAS CLICKED----------------*/
    if (clicked == true){
        return;
    }
    /*---------------CHECK CARD MATCH----------------*/
    if (first_card_clicked == null) {
        $(this).find('.back').hide();
        first_card_clicked = $(this);
        return;
        /*EXIT THE FUNCTION GOTO NEXT CODE*/
    } else {
        $(this).find('.back').hide();
        second_card_clicked = $(this);
        clicked = true;
        attempts++;
        display_stats();
        /*CHECK TO SEE IF CARD 1 MATCHES CARD 2*/
        if (first_card_clicked.find('.front img').attr('src') == second_card_clicked.find('.front img').attr('src')) {
            match_counter++;
            matches++;
            first_card_clicked = null;
            second_card_clicked = null;
            clicked = false;
            display_stats();
            if (match_counter == total_possible_matches) {
                $('.gameOver').show();
            } else {
                return;
            }
        } else {
            setTimeout(function() {
                clicked = false;
                $(first_card_clicked).find('.back').show();
                $(second_card_clicked).find('.back').show();
                first_card_clicked = null;
                second_card_clicked = null;
            },1200);
            display_stats();
        }

    }
}
function display_stats(){
    $('.matches .value').text(matches);
    $('.games-played .value').text(games_played);
    $('.attempts .value').text(attempts);
    accuracy = (matches / attempts) * 100;
    if (matches == 0 && attempts == 0){
        accuracy = 0
    }
    $('.accuracy .value').text(accuracy.toFixed(2) + '%');

    return;
}
/*------------RESET FUNCTION THAT RESETS ALL STATS----------------------*/
function reset_stats(){
    first_card_clicked = null;
    second_card_clicked = null;
    clicked = false;
    match_counter = 0;
    accuracy = 0;
    matches = 0;
    attempts = 0;
    games_played++;
    $('.card').find('.back').show();
    $('.gameOver').hide();
    display_stats();
}








