(function() {
  'use strict';
  var app,
    __slice = [].slice;

  app = angular.module('fhirface', ['ngCookies', 'ngAnimate', 'ngSanitize', 'ngRoute', 'ui.codemirror', 'ng-fhir'], function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: '/src/views/welcome.html',
      controller: 'WelcomeCtrl'
    }).when('/vs/:id', {
      templateUrl: '/src/views/valuesets/show.html',
      controller: 'ShowValueSetCtrl'
    }).when('/new', {
      templateUrl: '/src/views/valuesets/new.html',
      controller: 'NewValueSetCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  });

  app.filter('vsearch', function() {
    return function(xs, str) {
      if (str == null) {
        return xs;
      }
      return xs.filter(function(x) {
        var cnt;
        cnt = x.content;
        return cnt.name.toLowerCase().indexOf(str) > -1 && cnt.description.toLowerCase().indexOf(str) > -1;
      });
    };
  });

  app.provider('menu', function() {
    return {
      $get: function() {
        var menu,
          _this = this;
        menu = {
          items: [],
          build: function() {
            var items, state;
            items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            state = 'path';
            return menu.items = items;
          }
        };
        return menu;
      }
    };
  });

  app.run(function($rootScope, menu, $http) {
    var vs;
    menu.build({
      url: '/',
      label: 'Value Sets'
    }, {
      url: '/new',
      label: 'New',
      icon: 'add'
    });
    $rootScope.menu = menu;
    vs = window.localStorage.getItem('vs');
    if (vs != null) {
      console.log('hit');
      return $rootScope.vs = JSON.parse(vs);
    } else {
      return $http({
        method: 'GET',
        url: '/valuesets/valuesets.json'
      }).success(function(data) {
        window.localStorage.setItem('vs', JSON.stringify(data));
        return $rootScope.vs = data;
      });
    }
  });

  app.controller('WelcomeCtrl', function(menu, $scope, $http) {});

  app.controller('NewValueSetCtrl', function(menu, $scope, $fhir) {});

  app.controller('ShowValueSetCtrl', function(menu, $routeParams, $scope, $rootScope, $sce) {
    var id, v;
    $scope.trusted = function(h) {
      return $sce.trustAsHtml(h);
    };
    id = parseInt($routeParams.id);
    v = $scope.vs.entry[id];
    delete v.content.text;
    return $scope.v = v.content;
  });

}).call(this);

angular.module('fhirface').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/views/valuesets/new.html',
    "<h1> Create Value Set</h1>\n"
  );


  $templateCache.put('/src/views/valuesets/show.html',
    "<h1>{{v.name}}</h1>\n" +
    "<hr/>\n" +
    "<p><b>id:</b> {{v.identifier}}</p>\n" +
    "<p><b>description:</b> {{v.description}}</p>\n" +
    "\n" +
    "<!-- <div ng-bind-html=\"trusted(v.content.text.div)\"></div> -->\n" +
    "\n" +
    "<hr/>\n" +
    "\n" +
    "<table class=\"table\">\n" +
    "  <thead>\n" +
    "    <th>code</th>\n" +
    "    <th>definition</th>\n" +
    "  </thead>\n" +
    "  <tr ng-repeat=\"d in v.define.concept\">\n" +
    "    <th>{{d.code}}</th>\n" +
    "    <td>{{d.definition}}</td>\n" +
    "  </tr>\n" +
    "</table>\n" +
    "\n" +
    "<hr/>\n" +
    "\n" +
    "<h2> Raw JSON</h2>\n" +
    "\n" +
    "<pre>\n" +
    "{{v | json }}\n" +
    "</pre>\n"
  );


  $templateCache.put('/src/views/welcome.html',
    "<input placeholder=\"search\" class=\"srch\" ng-model=\"search\"/>\n" +
    "<div ng-repeat=\"entry in vs.entry | vsearch:search\">\n" +
    "  <a href=\"#/vs/{{$index}}\"><h3>{{entry.content.name}}</h3></a>\n" +
    "  <p>\n" +
    "    {{entry.content.description}}\n" +
    "  </p>\n" +
    "  <hr/>\n" +
    "</div>\n"
  );

}]);
