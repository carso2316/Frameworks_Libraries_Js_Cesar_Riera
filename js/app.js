let points = moves = btnClicks = 0;

function titleAnimation() {
    $('.main-titulo').animate({
        color: "white"
    }, 500, function () {
        $('.main-titulo').animate({
            color: "#DCFF0E"
        }, 500, titleAnimation());
    })
}
titleAnimation();

$(document).ready(function () {
    function creatingElements(columns, blanks) {
        function getRandomInt() {
            let num = Math.floor((Math.random() * 4) + 1);
            return num;
        }
        for (let i = 0; i < blanks; i++) {
            $(columns).each(function () {
                $(this).prepend("<img src='image/" + getRandomInt() + ".png' class='elemento'/>");
                $('.elemento')
                    .draggable({
                        grid: [108, 95],  
                        revert: "valid", 
                        containment: ".panel-tablero"  
                    })
                    .droppable({
                        accept: '.elemento',
                        drop: function (event, ui) {  
                            let srcFrom = $(this).attr("src");
                            let srcTo = $(ui.draggable).attr("src");
                            $(this).attr("src", srcTo);
                            $(ui.draggable).attr("src", srcFrom);
                            window.setTimeout(endTurn, 500);
                            sumarMovimiento();
                        }
                    });
            })
        }       
    }

    function startGame(btn) {
        btnClicks++
        if (btnClicks === 1) {
            creatingElements($('[class^="col"]'), 7)
            let time = 60 * 2;
            $(btn).text('Reiniciar');
            startTimer(time, $("#timer"));
        } else {
            location.reload();
        }
    }

    $('.btn-reinicio').on("click", function () {
        startGame(this);
    })
    
    function sumarMovimiento() {
        moves++;
        $('#movimientos-text').text(moves);
    }
    
    function checkSrc(element1, element2) {
        if ($(element1).attr("src") == $(element2).attr("src")) {
            return true;
        } else return false;
    }
    
    function scorePoint(elemento1, elemento2, elemento3) {
        points = points + 10;
        $("#score-text").text(points);
        $(elemento1).hide('pulsate', 2000)
        $(elemento2).hide('pulsate', 2000)
        $(elemento3).hide('pulsate', 2000)

    }
    
    function deleteElements() {
        $("img:hidden").each(function (index) {
            $(this).remove()
        })
    }
    
    function fillingAfterTurn() {
        let numeroElementos = numeroFalta = 0;
        for (let i = 1; i <= 7; i++) {
            numeroElementos = $(".col-" + i).find("img").length;
            numeroFalta = 7 - numeroElementos;
            creatingElements($(".col-" + i), numeroFalta)
        }
        window.setTimeout(endTurn, 500)
    }
    
    function checkMatch() {
        let elementoCompare;
        let current;
        let matchLeft = false;
        let matchRight = false;
        let matchBelow = false;
        let matchAbove = false;
        for (let col = 1; col <= 7; col++) {
            for (let row = 0; row < 7; row++) {
                matchAbove = matchBelow = matchRight = matchLeft = false;
                current = $(".col-" + col).find("img")[row]
                //Left Verfication
                if ($(".col-" + (col - 1)).length > 0) { 
                    elementoCompare = $(".col-" + (col - 1)).find("img")[row]
                    if (checkSrc(current, elementoCompare)) {
                        matchLeft = true;
                        if ($(".col-" + (col - 2)).length > 0) { 
                            elementoCompare = $(".col-" + (col - 2)).find("img")[row]
                            if (checkSrc(current, elementoCompare)) {
                                scorePoint(current, $(".col-" + (col - 1)).find("img")[row], elementoCompare)
                            }
                        }
                    }
                }
                //Right Verfication
                if ($(".col-" + (col + 1)).length > 0) { 
                    elementoCompare = $(".col-" + (col + 1)).find("img")[row]
                    if (checkSrc(current, elementoCompare)) {
                        matchRight = true;
                        if ($(".col-" + (col + 2)).length > 0) { 
                            elementoCompare = $(".col-" + (col + 2)).find("img")[row]
                            if (checkSrc(current, elementoCompare)) {
                                scorePoint(current, $(".col-" + (col + 1)).find("img")[row], elementoCompare)
                            }
                        }
                    }
                }

                //Right & Left Verfication
                if (matchLeft == true && matchRight == true) {
                    scorePoint(current, $(".col-" + (col - 1)).find("img")[row], $(".col-" + (col + 1)).find("img")[row])
                }
                //Above Verfication
                if ($(".col-" + col).find("img")[row - 1]) { 
                    elementoCompare = $(".col-" + col).find("img")[row - 1]
                    if (checkSrc(current, elementoCompare)) {
                        matchAbove = true;
                        if ($(".col-" + col).find("img")[row - 2]) { 
                            elementoCompare = $(".col-" + col).find("img")[row - 2]
                            if (checkSrc(current, elementoCompare)) {
                                scorePoint(current, $(".col-" + col).find("img")[row - 1], elementoCompare)
                            }
                        }
                    }
                }
                //Below Verfication
                if ($(".col-" + col).find("img")[row + 1]) { 
                    elementoCompare = $(".col-" + col).find("img")[row + 1]
                    if (checkSrc(current, elementoCompare)) {
                        matchBelow = true;
                        if ($(".col-" + col).find("img")[row + 2]) { 
                            elementoCompare = $(".col-" + col).find("img")[row + 2]
                            if (checkSrc(current, elementoCompare)) {
                                scorePoint(current, $(".col-" + col).find("img")[row + 1], elementoCompare)
                            }
                        }
                    }
                }
                //Above & Below Verfication
                if (matchAbove == true && matchBelow == true) {
                    scorePoint(current, $(".col-" + col).find("img")[row + 1], $(".col-" + col).find("img")[row - 1])
                }
            }
        }
    }
    
    function endTurn() {
        checkMatch();
        window.setTimeout(deleteElements, 2100);
        window.setTimeout(fillingAfterTurn, 2200);

    }
    
    function timeUp() {
        $('.panel-tablero').hide(900);
        $('.panel-score')
            .animate({
                width: '100%'
            }, 1000, function () {
                $(this).prepend("<h2 class='titulo-over'>Juego Terminado</h2>")
            })
        $('.time').hide(500)
        $('#score-text').hide()
        $('.score').append("<span class='data-info' id='score-final'>" + points + "</span>")
    }
    $("body").on('endTime', timeUp);
})