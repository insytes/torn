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
    // these could be user assigned at some point
    var betAmt = 10,
        moneyWon = 0,
        tokenBatch = 5,
        tmpTotalMoney = 0,
        slotUrl = "loader.php",
        btn = document.createElement("button"),
        slots = document.getElementsByClassName("slots-wrap")[0],
        casinoTokens = parseInt(document.getElementById("tokens").innerText),
        totalMoney = parseInt(document.getElementById("moneyAmount").innerText.replace(",", ""));
    
    slots.parentNode.insertBefore(btn, slots.nextSibling);

    if (casinoTokens == 0)
    {
        btn.innerText = "No tokens";
        return;
    }

    btn.innerText = "Play 5 tokens ($10)";

    function play(tokens, rfc)
    {
        $.ajax({
            type: "GET",
            data: {
                sid: "slotsInterface",
                step: "play",
                stake: betAmt,
                rfcv: rfc
            },
            success: function (response) {
                o = JSON.parse(response);
                var moneyWon =+ parseInt(o.moneyWon);

                // last spin
                if (tokens === 1) {
                    var newTotalMoney = tmpTotalMoney + moneyWon;
                    var text = "You just " + (newTotalMoney >= totalMoney ? "won" : "lost") + "  $";

                    btn.innerText = text + parseFloat(Math.abs(newTotalMoney - totalMoney));
                }
            }
        });
    }
    
    btn.addEventListener("click", function()
    {
        
        if (casinoTokens < 1)
        {
            btn.innerText = "No tokens";
            return;
        }

        tmpTotalMoney = totalMoney - (casinoTokens * betAmt);
        
        var i, rfc;

        for (i = 0; i < tokenBatch; i++)
        {
            rfc = getRFC();
            play(i, rfc);
        }

    }, false);
})();
