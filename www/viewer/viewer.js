var viewerApp = angular.module( 'viewerApp', [ 'ngRoute' ] );

viewerApp.config( function( $routeProvider ) {
  
  // routes definieren
  $routeProvider.when( '/', {
    templateUrl: 'menu.html',
    controller: 'MenuController'
  }).when( '/:exampleId', {
    templateUrl: 'example.html',
    controller: 'ExampleController'
  });
  
});

// create a service for loading json here ...
viewerApp.factory( 'examples', function( $http ) {
  
  function getData(callback){
    $http({
      method: 'GET',
      url: '../examples.json',
      cache: true
    }).success(callback);
  }

  return {
    list: getData,
    find: function( examplePath, callback ){
      getData( function( data ) {
        for( var i = 0; i < data.length; i++ ) {
          var example = data[ i ];
          if( example.path == examplePath ) {
            callback( example );
          }
        } 
      });
    }
  };
   
});

// ... and use it via dependency injection here
viewerApp.controller('MenuController', function( $scope, $http, examples ) {
  examples.list( function( examples ) {
    $scope.examples = examples;
  });
});

viewerApp.controller('ExampleController', function( $scope, $routeParams, examples ) {
  examples.find( $routeParams.exampleId, function( example ) {
    $scope.example = example;
    $scope.exampleUrl = '../' + example.path;
    $scope.exampleFile = '../' + example.path + "/index.html";
  });
});

/**
 * The `file` directive loads the content of an 
 * example source code file into a CodeMirror instance
 * for syntax-highlighted presentation.
 */
viewerApp.directive( 'codemirror', function(){
  return {
    scope: { file: '=' },
    restrict: 'A',
    controller: function($scope, $http){
      $http.get( $scope.file ).success(function(data) {
        if(typeof(data) === 'object'){
          // un-parse auto-parsed JSON files for presentation as text
          data = JSON.stringify(data, null, 2);
        } else {
          // Remove trailing newlines from code presentation
          data = data.trim();
        }
        $scope.content = data;
      });
    },
    link : function(scope, element, attrs) {
      var textArea = element[0];
      var editor = CodeMirror.fromTextArea(textArea, {
        mode: "text/html",
        lineNumbers: true,
        viewportMargin: Infinity
      });
      scope.$watch('content', function(data){
        if(data) {
          editor.setValue(data);
        }
      });
    }
  };
});
