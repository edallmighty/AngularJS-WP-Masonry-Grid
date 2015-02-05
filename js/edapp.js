var edApp = angular.module('edApp', ['ngRoute', 'ngAnimate', 'ngResource', 'ngSanitize'])

/**
 *
 *	Metadata controller
 *
 */
.controller('siteInfo', function($scope, $http){
    /**
     *  Get the blog metadata from the API
     */
    $http.get('/wordpress/wp-json')
    .success(function(data){
        
        $scope.blog = data;
        //scopt.info = data.content;
        
        //window.alert(data);

        
    })
    .error(function(data, status, headers, config){
        window.alert("Unable to connect to Wordpress");
    })

})
/**
 *
 *	About controller
 *
 */
.controller('aboutPage', function($scope, $http){
    /**
     *  Get about page from from the API
     */
    $http.get('/wordpress/wp-json/pages/about')
    .success(function(data){
        
        $scope.about = data;
        
    })
    .error(function(data, status, headers, config){
        window.alert("Unable to connect to Wordpress");
    })

})
/**
 *
 *	Portfolio controller
 *
 */
.controller('portfolioItems', function($scope, $http){
    /**
     *  Get posts from the portfolio category from the API
     */
    $http.get('/wordpress/wp-json/posts?category=portfolio')
    .success(function(data){
        
        $scope.posts = data;
        //scopt.info = data.content;
        
        //$scope.title = posts.title;
        //window.alert(data);

        // Inject the title into the rootScope
        //$rootScope.title = data.post.title;
        //$rootScope.post = data;
        //$rootScope.image = data.post.attachments;

        
    })
    .error(function(data, status, headers, config){
        window.alert("Unable to connect to Wordpress");
    })

})

/**
 *
 *	Masonry grid 
 *
 */
.directive("masonry", function () {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);
            
            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";
            
            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));
                
                // try to infer model from ngRepeat
                if (!options.model) { 
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }
                
                // initial animation
                element.addClass('masonry');
                
                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);
                    
                    element.on("$destroy", function () {
                        element.masonry('destroy')
                    });
                    
                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;
                                
                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                });
            };
        }
    };
})