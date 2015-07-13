// concat() есть ли альтернатива
var logLevel = 0;

function TheList(putList) {
    this.listOriginal = putList;
    this.listSorting = putList.concat();
    //decorate
    this.sortDirect = this.redrawList(this.sortDirect);
    this.sortReverse = this.redrawList(this.sortReverse);
    this.sortOriginal = this.redrawList(this.sortOriginal);
}
    
TheList.prototype = {
    constructor: TheList, 

    showHead: function () {
        var showText = '<caption>Команды-участники сезона 1999 года</caption><tr><th>Название команды</th></tr><tr><td><img src="pictures/loading.gif" alt=""></td></tr>',
            tableList = document.getElementById("tableList"); 
        tableList.innerHTML = showText;
    },

    showRow: function (rowText) {
        var tr = document.createElement('tr'),
            td = document.createElement('td'); 
        var table = document.getElementById("tableList").childNodes[1];
        td.innerHTML = rowText;
        table.insertBefore(tr, table.lastElementChild).appendChild(td);
    },

    redrawList: function(callable){
        return function(){
            callable.bind(this)();
            this.showList();
        }
    },

    sortDirect: function() {
        this.listSorting.sort(function(a,b) {
            if (a > b) return 1;
            if (a < b) return -1;
        });
        return this.listSorting;
    },

    sortReverse: function() {        
        this.listSorting.sort(function(a,b) {
            if (a < b) return 1;
            if (a > b) return -1;
        });
        return this.listSorting;
    },

    sortOriginal: function() {
        this.listSorting = this.listOriginal.concat(); 
        return this.listSorting;        
        }
};




/* ____Search_________________*/
function dichotomicSearch(arrayForSearchTo, subStringIndex, searchQueryString) {
    var resalt;
    arrayMidleIndex = Math.round((arrayForSearchTo.length-1)/2);

    if ((searchQueryString.length == 0) || (subStringIndex > searchQueryString.length)) {
        var result = "Not found.";
        return result;
    }
    
    else if (arrayForSearchTo[arrayMidleIndex] == searchQueryString) {
        return arrayForSearchTo[arrayMidleIndex];
    }

    else if (arrayForSearchTo[arrayMidleIndex].toString().substring(0, subStringIndex) == searchQueryString.substring(0, subStringIndex)) {
        var subStringIndex_Local =(Number(subStringIndex)+1);
        return dichotomicSearch (arrayForSearchTo, subStringIndex_Local.toString(), searchQueryString);        
    }
       
    else if (arrayForSearchTo[arrayMidleIndex].toString().substring(0, subStringIndex) > searchQueryString.substring(0,subStringIndex)) {
        var arrayForSearchTo_Local = arrayForSearchTo.slice(0,arrayMidleIndex);
        return dichotomicSearch (arrayForSearchTo_Local, subStringIndex, searchQueryString);
    }
    
    else if (arrayForSearchTo[arrayMidleIndex].toString().substring(0, subStringIndex) < searchQueryString.substring(0,subStringIndex)) {
        var arrayForSearchTo_Local = arrayForSearchTo.slice(Number(arrayMidleIndex) + 1);
        return dichotomicSearch (arrayForSearchTo_Local, subStringIndex, searchQueryString);
    }   
}

function viewSearch() {
    var searchQueryString = document.getElementById("search").value,
        resultSearch = document.getElementById("resultSearch"),
        arrayResult;
        
    var arrayForSearchTo = team.sortDirect().concat();      
        arrayResult = dichotomicSearch (arrayForSearchTo, 1, searchQueryString); 
        
    resultSearch.innerHTML = arrayResult;
}
