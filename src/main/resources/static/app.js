var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(greeting.body);
            setNurikabe(JSON.parse(greeting.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");

}

function setNurikabe(message) {
    receiveObj = eval(message);

    if (receiveObj.method == 'create' ) {
        createMap(receiveObj.name, receiveObj.x , receiveObj.y);
    } else {
        appendItem(receiveObj.name, receiveObj.x , receiveObj.y, receiveObj.method, receiveObj.number);
    }
}

function createMap(id, width, height) {
    var rectSize = 25;
    var startPoint ={x:25, y:25};

    $("#main-content").append("<canvas id=\"canvas" + id + "\" width='500px' height='500px'></canvas>")

    var c = document.getElementById("canvas" + id);
    var ctx = c.getContext("2d");
    ctx.font="15px Arial";

    for (i = 0 ; i <  width; i++) {
        for (j = 0 ; j <  height; j++) {
            ctx.rect(startPoint.x + (rectSize * i), startPoint.y + (rectSize * j), rectSize, rectSize);
            ctx.stroke();
        }
    }

}

function appendItem(id, x, y, type, number) {
    var rectSize = 25;
    var startPoint ={x:25, y:25};

    var c = document.getElementById("canvas" + id);

    var ctx = c.getContext("2d");
    ctx.font="15px Arial";

    if (type == 'number') {
        ctx.fillText(number,startPoint.x + (rectSize * x)- 16, startPoint.y + (rectSize * y)- 6);
        ctx.stroke();
    } else if (type == 'block') {
        ctx.fillRect(startPoint.x + (rectSize * x), startPoint.y + (rectSize * y), rectSize, rectSize);
        ctx.stroke();
    } else if (type == 'room') {
        ctx.fillText("o",startPoint.x + (rectSize * x)- 16, startPoint.y + (rectSize * y)- 6);
        ctx.stroke();
    }

}


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});