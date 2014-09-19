// code in this file is used to improve the examples for instance with a code viewer
// but this code is not part of the actual examples


// code by Curran Kelleher
// https://github.com/curran/screencasts/tree/gh-pages/introToAngular/exampleViewer

createFileDirective = function( app ) {
  
  /**
   * The `file` directive loads the content of an 
   * example source code file into a CodeMirror instance
   * for syntax-highlighted presentation.
   */
  app.directive( 'codemirror', function(){
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

}
