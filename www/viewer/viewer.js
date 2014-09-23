var viewerApp = angular.module( 'viewerApp', [ 'ngRoute' ] );

viewerApp.config( function( $routeProvider ) {
  
  // routes definieren
  $routeProvider.when( '/', {
    templateUrl: 'menu.html',
    controller: 'MenuController'
  }).when( '/:exampleId', {
    templateUrl: 'example.html',
    controller: 'ExampleController',
    resolve: {
      example: function( examples, $route ) {
        return examples.find2( $route.current.params.exampleId );
      }
    }
  });
  
});

// create a service for loading json here ...
viewerApp.factory( 'examples', function( $http ) {
  
  function getPromise() {
    return $http({
      method: 'GET',
      url: '../examples.json',
      cache: true
    });
  };
  
  function getData(callback){
    getPromise().success(callback);
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
    },
    // this returns a promise
    find2: function( examplePath ) {
      return getPromise().then(function( response ) {
        var data = response.data;
        for( var i = 0; i < data.length; i++ ) {
          var example = data[ i ];
          if( example.path == examplePath ) {
            return example;
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

viewerApp.controller('ExampleController', [ '$scope', 'example', function( $scope, example ) {
  $scope.example = example;
  $scope.exampleFile = '../' + example.path + "/index.html";
  $scope.exampleUrl = '../' + example.path;
  /*
  examples.find( $routeParams.., function( example ) {
    $scope.exampleFile = '../' + example.path + "/index.html";
    $scope.example = example;
    $scope.exampleUrl = '../' + example.path;
  });
  */
}]);

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
