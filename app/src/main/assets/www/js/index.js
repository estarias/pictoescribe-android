$(window).load(function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
	});

angular.module('MyApp',  ['ngMaterial', 'ngDraggable', 'FBAngular'])

.controller('AppCtrl', function($scope, $sce, $window, $timeout, Fullscreen) {
    $scope.cats_name = ITEMS;
    $scope.keys = [];   
    $scope.playbox = document.getElementById('playbox');    
  
    $scope.getCanvas; // global variable
    $scope.isAndroid = /(android)/i.test(navigator.userAgent);
    
    clean_text();
    show_categories();   
    show_play(true);
    //play on mouse over with delay
//    var timer;    
//    $scope.showIt = function (sound) {
//        timer = $timeout(function () {
//           $scope.said(sound);
//        }, 500);
//    };    
//    $scope.hideIt = function () {
//        $timeout.cancel(timer);
//        stop();
//    };

    $scope.goFullscreen = function () {
        if (Fullscreen.isEnabled())
           Fullscreen.cancel();
        else
           Fullscreen.all();
    };
    
    $scope.toggleKey = function(it) {
       play(it.sound);
       if (it.type == "category" || it.type == "subcategory"){
           show_elements(it);
           $scope.category = it;
       }else {
           if (it.name !== "volver") write_key(it);
           show_categories();
       }
    };
    
    $scope.backspace = function() {
       if ($scope.text[$scope.lines].length == 0 && $scope.lines>0){
            $scope.lines--;
        }else{
            $scope.text[$scope.lines].splice($scope.text[$scope.lines].length-1, 1);
        }
    };

    $scope.exit = function() {
        $window.close();
    };
    
    $scope.endline = function() { 
        $scope.lines++;
        $scope.text[$scope.lines] = new Array();
    };
    
    $scope.new = function() { clean_text(); };
    
    $scope.save = function() {
        $('#printable').html2canvas({ 
            onrendered: function (canvas) { 
               var a = document.createElement('a');
               a.href = canvas.toDataURL("image/png;base64;"); 
               a.download = "pisctoescribe.png";
               a.click();
            }
	});     
    };
    
    $scope.said = function(sound) {
        play(sound);
    };
      
    function play(src) {
        $scope.playbox.src = src;
        $scope.playbox.play();
    }
   
    function stop() {
        $scope.playbox.pause();
        $scope.playbox.currentTime = 0;
    }
    
    function isPlaying(audelem) { return !audelem.paused; }
    
    function show_play(playing) {     
        if (playing){
            $scope.play_text = "ESCUCHAR";
            $scope.play_image = "img/toolbar/reproducir.png";
        }else{
            $scope.play_text = "PARAR";
            $scope.play_image = "img/toolbar/cancelar.png";   
        }
    }
    $scope.play_all = function() { 
        if ($scope.text[0].length == 0) return false;  
        if (isPlaying($scope.playbox)){
            stop();
            show_play(true);
        }else{
            show_play(false);
            $scope.sounds = new Array();
            for (l=0; l<$scope.text.length;l++){
                angular.forEach($scope.text[l], function(value, key){
                    if (value != null ){
                        $scope.sounds.push(value.sound);
                    };
                });
            };
            $scope.i = 0;
            playNext($scope.i);
        }
    };
    
    function playNext( index) {
        $scope.playbox.src = $scope.sounds[index];
        $scope.playbox.play(); 
        $scope.playbox.addEventListener('ended', function(){ 
            index++;
            if(index < $scope.sounds.length) playNext( index); 
            if (index == $scope.sounds.length){
                show_play(true);
                $scope.$apply();
            }
        });
     } 
     
    function show_categories(){
        clean_keys();
        for (var i = 0; i < $scope.cats_name.length; i++) {
           cat = angular.fromJson($scope.cats_name[i]);
           var c = new Category(cat, i);
            add_key(c);
       }
    };
    
    function show_elements(it){
        clean_keys();
        if (it.type == "category" && $scope.cats_name[it.index].elementos != undefined){
            //elementos
            for (var x = 0; x < $scope.cats_name[it.index].elementos.length; x++) {
                e = angular.fromJson($scope.cats_name[it.index]);
                element_name = e.elementos[x];
                var element = new Element(element_name, it);
                add_key(element);
            }
        }else{                    
            if (it.type == "subcategory"){
                //eleentos de subcategoria
                for (var x = 0; x < $scope.cats_name[it.category.index].subcategorias[it.index].elementos.length; x++) {
                    e = angular.fromJson($scope.cats_name[it.category.index].subcategorias[it.index]);
                    element_name = e.elementos[x];
                    var element = new Element(element_name, it.category, it);
                    add_key(element);
                }
            }else{
                //subcategorias
                for (var x = 0; x < $scope.cats_name[it.index].subcategorias.length; x++) {
                    subcat = angular.fromJson($scope.cats_name[it.index]);
                    subcat_name = subcat.subcategorias[x];
                    var c = new SubCategory(it, subcat_name, x);
                    add_key(c);
                }
            }
        }
        var no_tengo_la_palabra = new Element("no tengo la palabra");
        no_tengo_la_palabra.icon= "img/keyboard/no_tengo_la_palabra.png";
        no_tengo_la_palabra.sound = "img/keyboard/no_tengo_la_palabra.mp3";
        no_tengo_la_palabra.color = "red";
        add_key(no_tengo_la_palabra);

        var volver = new Element("volver");
        volver.icon= "img/keyboard/volver.png";
        volver.sound = "img/keyboard/volver.mp3";
        volver.color = "red";
        add_key(volver);
    }
    
    function write_key(it){
        if (it != null){
            $scope.text[$scope.lines].push(it);
        }
    }
    
    function add_key(k){
        $scope.keys.push(k);
    }
    
    function clean_keys(){
        $scope.keys = [];
    }
    
    function clean_text(){
        $scope.text = [new Array()];
        $scope.lines = 0;
    }
    
    $scope.centerAnchor = true;
    $scope.toggleCenterAnchor = function () {$scope.centerAnchor = !$scope.centerAnchor}

     $scope.onDropComplete=function(data,evt){
        var index = $scope.text[$scope.lines].indexOf(data);
        if (index == -1){
            write_key(data);
            show_categories();
        }    
    }
    $scope.onDragSuccess=function(data,evt){
        var index = $scope.text[$scope.lines].indexOf(data);
        if (index > -1) {
            $scope.text[$scope.lines].splice(index, 1);
        }
    }

    var inArray = function(array, obj) {
        var index = array.indexOf(obj);
    }
    
    $scope.print = function(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;      

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet prefetch" href="css/angular-material.css">' +
                '<link rel="stylesheet" href="css/style.css"></head>' +
                '<body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
                return '.\n';
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
        } else {
            var popupWin = window.open('', '_blank', 'width=800,height=800');
            popupWin.document.open();
            popupWin.document.write('<html><head> ' +
                '<link rel="stylesheet prefetch" href="css/angular-material.css">' +
                '<link rel="stylesheet" href="css/style.css"></head> ' +
                '<body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
        popupWin.document.close();

        return true;
    } 
    

 


});


