// ==UserScript==
// @name          Torn - Slots
// @namespace     https://github.com/ianbrind/torn/raw/master/slots.user.js
// @description   Play 5 tokens at once
// @author        Fitchett
// @include       http://www.torn.com/loader.php?sid=slots
// @include       https://www.torn.com/loader.php?sid=slots
// @require       http://code.jquery.com/jquery-latest.js
// @run-at        document-end
// @version       0.1
// ==/UserScript==
(function()
{
    var player = {
        "casinoTokens": parseInt(document.getElementById("tokens").innerText),
        "totalMoney": parseInt(document.getElementById("moneyAmount").innerText.replace(",", ""))
    };

    var slots = {
        "machine": document.getElementsByClassName("slots-wrap")[0] 
    };

    var domNodes = {
        "btn": document.createElement("button") 
    };

    var io = {
        "betAmt": 10,
        "moneyWon": 0,
        "batch": 2
    };

    var tmp = {
        "totalMoney": 0
    };
    
    slots.machine.parentNode.insertBefore(domNodes.btn, slots.machine.nextSibling);

    if (player.casinoTokens < 1)
    {
        domNodes.btn.innerText = "No tokens";
        return;
    }

    domNodes.btn.innerText = "Play 5 tokens ($10)";

    function play(tokens, rfc)
    {
        $.ajax({
            type: "GET",
            data: {
                sid: "slotsInterface",
                step: "play",
                stake: io.betAmt,
                rfcv: rfc
            },
            success: function (response) {
                o = JSON.parse(response);
                io.moneyWon =+ parseInt(o.moneyWon);

                // last spin
                if (tokens === 1) {
                    var newTotalMoney = tmp.totalMoney + io.moneyWon;
                    var text = "You just " + (newTotalMoney >= player.totalMoney ? "won" : "lost") + "  $";

                    domNodes.btn.innerText = text + parseFloat(Math.abs(newTotalMoney - player.totalMoney));
                }
            }
        });
    }
    
    domNodes.btn.addEventListener("click", function()
    {
        
        if (player.casinoTokens < 1)
        {
            domNodes.btn.innerText = "No tokens";
            return;
        }

        tmp.totalMoney = player.totalMoney - (player.casinoTokens * io.betAmt);
        
        var i, rfc;

        for (i = 0; i < io.batch; i++)
        {
            rfc = getRFC();
            play(i, rfc);
        }

    }, false);
})();
