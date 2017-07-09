
"use strict";

//var loadingDialog = null;
/*ons.ready(function() {
    // 読み込み中ダイアログの初期化
    ons.createAlertDialog('loading.html').then(function(alert) {
        loadingDialog = alert;
    });
});
*/
module.factory('Product', function() {
   var Product = function(params) {
       this.name = params.name;
       this.price = params.price;
       this.desc = params.desc;
       this.thumbnailUrl = params.thumbnailUrl;
       this.imageUrl = params.imageUrl;
       this.url = params.url;
   };
   
   return Product;
});

module.controller('AppController', function($scope, Product, $http) {
    $scope.write = function(){
        navi.pushPage("write.html");
    };
    $scope.QRcreate = function(){
        
        var str=$("#QR_content").val();
        
        if(str.length === 0){
            return;
        }
        var list = getMemoList();
        var time = new Date().getTime();
        // Display the month, day, and year. getMonth() returns a 0-based number.
        var month = new Date().getMonth()+1;
        var day = new Date().getDate();
        var year = new Date().getFullYear();
        list.push({id:time, time:year+"/"+month+"/"+day, rg: "Create",text: str});
        saveMemoList(list);
        
        navi.pushPage("create.html",{
            onTransitionEnd: function() { 
                $("#qr").empty();
                //var str=$("#QR_content").val();
                $("#qr").MyQRCode({
                    content:(str),
                    size:"300x300"
                });
            }
        });
        
        function getMemoList(){
            var list = localStorage.getItem("QR_INFO");
            if(list == null){
            return new Array();
            }else{
                return JSON.parse(list);
            }
        }
        function saveMemoList(list){
            try{
                localStorage.setItem("QR_INFO", JSON.stringify(list));
            } catch(e){
                alert('Error saving to storage.');
                throw e;
            }
        }
    };
    
    $scope.scan = function() {
        var onSuccess = function(result) {
            if (!result.cancelled) {
                /*alert("We got a barcode\n" +
                      "Result: " + result.text + "\n" +
                      "Format: " + result.format + "\n" +
                      "Cancelled: " + result.cancelled);*/
                $scope.selectProduct(result);
                
                //loadingDialog.show();
            }
            if(result.cancelled){
                alert("cancel");
            }
        };
        var onFailure = function(error) {
            ons.notification.alert({
                message: error,
                title: 'Failure to scan',
                buttonLabel: 'OK',
                animation: 'default', // もしくは'none'
            });
        };

        // バーコードをスキャンする
        plugins.barcodeScanner.scan(onSuccess, onFailure);
    };
    
    $scope.selectProduct = function(result) {
        $scope.currentProduct = result;
        var list = getMemoList();
        var time = new Date().getTime();
        var month = new Date().getMonth()+1;
        var day = new Date().getDate();
        var year = new Date().getFullYear();
        list.push({id:time, time:year+"/"+month+"/"+day, rg: "Scan",text: result.text});
        saveMemoList(list);
        navi.pushPage('details.html',{
            onTransitionEnd: function() { 
                if(result.text.indexOf("http") === 0){
                    $("#BrowserOpenButton").show();
                }else{
                    $("#BrowserOpenButton").hide();
                }
            }
        });
        function getMemoList(){
            var list = localStorage.getItem("QR_INFO");
            if(list == null){
            return new Array();
            }else{
                return JSON.parse(list);
            }
        }
        function saveMemoList(list){
            try{
                localStorage.setItem("QR_INFO", JSON.stringify(list));
            } catch(e){
                alert('Error saving to storage.');
                throw e;
            }
        }
    };

    $scope.openWithBrowser = function(url) {
        // 外部ブラウザで開く
        window.open(url, '_system');
    };
    
    
    $scope.saveHistory = function() {
        
        window.localStorage.setItem('QR_INFO', JSON.stringify($scope.history));
    };
    
    $scope.clearHistory = function() {
        if (!confirm("Are you sure to delete?")){
            return;
        }
        $scope.history = [];
        $scope.saveHistory();
    };
    $scope.confHistory = function(){
        try {
            $scope.history = JSON.parse(window.localStorage.getItem('QR_INFO'));
            if (!angular.isArray($scope.history)) {
                $scope.history = [];
            }
        } catch (e) {
            $scope.history = [];
        }    
    };
    $scope.pageselect = function(product){
        if(product.rg === "Scan"){
            $scope.currentProduct = product;
            navi.pushPage('details.html',{
                onTransitionEnd: function() { 
                    if(product.text.indexOf("http") === 0){
                        $("#BrowserOpenButton").show();
                    }else{
                        $("#BrowserOpenButton").hide();
                    }
                }
            });
        }else if(product.rg === "Create"){
            navi.pushPage("create.html",{
                onTransitionEnd: function() {
                    $("#qr").empty();
                    $scope.currentProduct = product;
                    //var str=$("#QR_content").val();
                    $("#qr").MyQRCode({
                        content:(product.text),
                        size:"300x300"
                    });
                }
            });    
        }else{
            return;
        }
    };
    
});