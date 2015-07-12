var debug = false;

var fs = require( "fs" ),
    connect = require( "connect" ),
    serverStatic = require('serve-static'),
    Cookies = require( "cookies" ),
    TableGenerator = require( "tableGen" );

var app = connect();
var receiveListRows = {};

app.use(function(request, response, next) {
    var date = new Date();
    console.log("[" + date.toLocaleString() + "]",
                 request.method, request.url);
    if (debug) {console.log(request.connection.remoteAddress);}
    next();
});

app.use(Cookies.express());

app.use( "/favicon", function(request, response) {
    writeResponsHead(response, "public/pictures/game_icon.png", 'image/png');
});

app.use(function(request, response, next) {
    if (request.cookies.get("client") === undefined) {
        request.cookies.set("client", Date.now().toString(), { httpOnly: false })
        //console.log("cookies set");
    }
    next();
});

opts = {extensions: ['html', 'htm']}
app.use( serverStatic("public", opts) );

app.use( "/getItem", function(request, response) {
    if (request.url.length == 1) {
        receiveListRows[request.cookies.get("client")] = {list: [], getAll: false};

        var tg = new TableGenerator(function(row) {
            if (row === "?!@#*#$%?#@#^^!&$#@") {
                receiveListRows[request.cookies.get("client")].getAll = true;
            }
            else {
                receiveListRows[request.cookies.get("client")].list.push(row);
            }
        });
        tg.generate();
        response.writeHeader(200, {"Content-Type": "text/plain"}); 
        response.end("Request has been accepted");
        responseStatus(request, response);
    }

    else {
        if (request.cookies.get("client") in receiveListRows) {
            var num = request.url.slice(2);

            if (+num === +receiveListRows[request.cookies.get("client")].list.length &&
                receiveListRows[request.cookies.get("client")].getAll === true) {

                response.writeHeader(200, {"Content-Type": "text/plain"}); 
                response.end("listReceived");
                responseStatus(request, response);

                delete receiveListRows[request.cookies.get("client")];
            } else {
                response.writeHeader(200, {"Content-Type": "text/plain"}); 
                response.end( JSON.stringify (receiveListRows[request.cookies.get("client")].list.slice(+num)));
                responseStatus(request, response);
            }
        }
    }
});

app.use(function(request, response){
    response.writeHeader(404, {"Content-Type": "text/plain"});  
    response.write("404 Not Found\n");  
    response.end();
    responseStatus(request, response);
})

function responseStatus(request, response) {
    console.log(response.statusCode + "/" + response.statusMessage);
}

function writeResponsHead(response, responcePath, contentType) {
    response.writeHead(200, {'Content-type':contentType});
    responseFile = fs.readFileSync(responcePath);
    response.end(responseFile);
    responseStatus(request, response);
};

app.listen(80);
console.log('server start');
