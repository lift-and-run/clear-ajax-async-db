var listForView = new TheList([]);

var timeoutHandler;

var startRequestRefresh = function () {
    timeoutHandler = setInterval(sendRequestRefresh, 3000);
};

function stopRequestRefresh() {
    clearInterval(timeoutHandler);
    console.log("List received");
};

sendRequest();

function sendRequest() {
    var request = new XMLHttpRequest();
    request.open("GET", "getItem");
    request.setRequestHeader("Content-Type", "text/plain");
    request.send(null);
    
    request.onreadystatechange = function() {
	    if (request.readyState === 4 && request.status === 200) {
            listForView.showHead();
            startRequestRefresh();
	    }
    };
};

function sendRequestRefresh() {
    console.log( "Request refresh send");
    var request = new XMLHttpRequest();

    listForView.listOriginal.length == -1 ?
    request.open("GET", "getItem"+"?"+0):
    request.open("GET", "getItem"+"?"+listForView.listOriginal.length);

    request.setRequestHeader("Content-Type", "text/plain");
    request.send(null);

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            //console.log( "requestRefresh");
            if (request.responseText == "listReceived") {
                stopRequestRefresh();
                var table = document.getElementById("tableList").childNodes[1];
                table.removeChild(table.lastElementChild);
            }
            else {
                var newRow = JSON.parse(request.responseText);

                if (newRow.length > 0) {
                    for (var i = 0; i < newRow.length; i++) {
                        listForView.listOriginal.push(newRow[i]);
                        listForView.listSorting.push(newRow[i]);
                        listForView.showRow(newRow[i]);   
                    }
                }
                else {
                    console.log( "No updates");
                }
            }
        }
        else {
            if (request.status !== 200) {
                stopRequestRefresh();
                document.getElementById("tableList").className = "off";
                document.getElementById("warningText").className = "warning";
            }
        }    
    };
};

