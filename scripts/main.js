//variables
var hp = maxhp = dhp = 100;
var money = 0;
var exp = 0;
var hpreg = 1.0;


var WORK_hpbase = -10;
var WORK_moneybase = 7;
var WORK_expbase = 7;

var STUDY_hpbase = -10;
var STUDY_moneybase = 0;
var STUDY_expbase = 14;

var SLEEP_hpbase = 10;
var SLEEP_moneybase = 0;
var SLEEP_expbase = -14;

var hpmult = 1.0;
var moneymult = 1.0;
var expmult = 1.0;

var hpsubmult = 1.0;
var moneysubmult = 1.0;
var expsubmult = 1.0;

var clicks = 0;
var auto_clicks = 0; //automatically click once per second
var cost = 1; //the cost of this should increase exponentially
var upgrade_speed = 0; //the level of the speed up upgrade
var click_rate = 1000; //ms between each autoclick
var interval_auto; //storing our interval here so we can update it
var click_increment = 1; //how many clicks per click

function doit(){
    $("#xp-increase-fx").css("display","inline-block");
    $("#xp-bar-fill").css("box-shadow",/*"0px 0px 15px #06f,*/ "-5px 0px 10px #fff inset");
    setTimeout(function(){$("#xp-bar-fill").css("-webkit-transition","all 2s ease");
        $("#xp-bar-fill").css("width","75%");},100);
    setTimeout(function(){$("#xp-increase-fx").fadeOut(500);$("#xp-bar-fill").css({"-webkit-transition":"all 0.5s ease","box-shadow":""});},2000);
    setTimeout(function(){$("#xp-bar-fill").css({"width":"0.1%"});},3000);
}

function flicker(){
    $("#xp-increase-fx-flicker").css("opacity", "1");
    $("#xp-increase-fx-flicker").animate({"opacity":Math.random()}, 100, flicker);
}


var expp = 20.0;
var level = 0;
function _levelFromExp(exp) {
    return Math.floor(Math.pow(1/expp * exp, 1/2));
};


function _expFromLevel(level){
    return Math.pow(level, 2) * expp;
}


//functions
window.onload = function(){
    update_mults();

    function applyHPChange() {
        var a = hp * (100 / maxhp);
        $(".health-bar-text").html(hp + "/" + maxhp);
        $(".health-bar").width(a + "%");
    }

    function update_hp() { //updates the number of clicks
        var e = document.getElementById("hp");
        e.innerHTML = hp + "/" + maxhp;
        applyHPChange();
    }
    function update_exp() { //updates the number of clicks
        level = _levelFromExp(exp);
        var e = document.getElementById("exp");
        e.innerHTML =  level + " : " + exp;
        var am = 100 * (exp - _expFromLevel(level)) / (_expFromLevel(level + 1) - _expFromLevel(level));
        $("#expbar").animate({"value": am}, 100)
    }
    function update_money() { //updates the number of clicks
        var e = document.getElementById("money");
        e.innerHTML = "$" + money;
    }

    function update_mults() {
        $("#work").html( "<b>WORK</b> <i class=\"fas fa-heart\">" + WORK_hpbase * hpsubmult +
            " <i class=\"fas fa-coins\"></i>" + WORK_moneybase * moneymult +
            " <i class=\"fas fa-lightbulb\"></i>" + WORK_expbase * expmult
        );
    }

    var workfunc = function() {
        hp += WORK_hpbase * hpsubmult;
        money += WORK_moneybase * moneymult;
        exp += WORK_expbase * expmult;
        update_hp();
        update_money();
        update_exp();
    };

    var sleepfunc = function() {
        hp += SLEEP_hpbase * hpmult;
        exp += SLEEP_expbase * expsubmult;
        update_hp();
        update_exp();
    };

    var studyfunc = function() {
        hp += STUDY_hpbase * hpsubmult;
        exp += STUDY_expbase * expmult;
        update_hp();
        update_exp();
    };

    document.getElementById("work").onclick = function() {
        workfunc();
    };

    //loop update
    setInterval(function() {

        var diff = dhp - hp;
        dhp -=  diff * 0.1;

        var b = dhp * (100 / maxhp);
        $(".health-bar-red").width(b + "%");

    }, 1000.0 / 60.0);

    setInterval(function() {
        hp += hpreg;
        if (hp > maxhp) {
            hp = maxhp;
        }
        update_hp();
    }, 1000.0);

    //////////////////////////////////////////////////

    function update_total_clicks() { //updates the number of clicks
        var e = document.getElementById("total_clicks");
        e.innerHTML = clicks;
    }

    function buy_something(c, button) {
        if (clicks < c) {
            button.className = 'button fail';
            setTimeout(function() {
                var e = document.getElementsByClassName("btn-danger")[0];
                e.className = 'button success';
            }, 1000);
            return false;
        }
        clicks -= c;
        return true;
    }

    function update_workers() {
        var e2 = document.getElementById("time_period");
        e2.innerHTML = parseFloat(click_rate / 1000.0).toFixed(2);
        clearInterval(interval_auto);
        interval_auto = setInterval(function() {
            clicks += auto_clicks;
            update_total_clicks();
        }, click_rate);
    }
//click events

    document.getElementById("buy_click").onclick = function() {
        if (!buy_something(cost, this)) return;
        auto_clicks++;
        cost = Math.pow(2, auto_clicks); //new cost
        update_total_clicks();
        var e = document.getElementById("clicks_per_second");
        e.innerHTML = auto_clicks;
        var e2 = document.getElementById("buy_click");
        e2.innerHTML = 'Buy for ' + cost;
        var e2 = document.getElementById("autoclicker_level");
        e2.innerHTML = 'lvl  ' + auto_clicks;
    };
    document.getElementById("upgrade_speed").onclick = function() {
        var upgrade_cost = (Math.pow(3, upgrade_speed)) * 100;
        if (!buy_something(upgrade_cost, this)) return;
        upgrade_speed++;
        click_rate = click_rate * 0.90;
        update_workers();
        var e2 = document.getElementById("upgrade_speed");
        e2.innerHTML = 'Buy for ' + ((Math.pow(3, upgrade_speed)) * 100);
        var e2 = document.getElementById("speed_level");
        e2.innerHTML = 'lvl  ' + upgrade_speed;
    };

//Increase Click Increment
    document.getElementById("increase_clicks").onclick = function() {
        var upgrade_cost = (Math.pow(3, click_increment)) * 1;
        if (!buy_something(upgrade_cost, this)) return;
        click_increment++;
        update_workers();
        var e2 = document.getElementById("click_increment");
        e2.innerHTML = 'Buy for ' + ((Math.pow(3, click_increment)) * 100);
    };

//Start Autoclickers
    update_workers();

    function set_cookie(cookie_name, value) {
        expiry = new Date();
        expiry.setTime(new Date().getTime() + (10 * 60 * 1000));
        var c_value = escape(btoa(JSON.stringify(value))) + "; expires=" + expiry.toUTCString();
        document.cookie = cookie_name + "=" + c_value;
    }

    function get_cookie(cookie_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + cookie_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(cookie_name + "=");
        }
        if (c_start == -1) return false;
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = atob(unescape(c_value.substring(c_start, c_end)));
        return JSON.parse(c_value);
    }
};
