(function() {
  'use strict';
  var app, _rm,
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

  _rm = function(x, xs) {
    return xs.filter(function(i) {
      return i !== x;
    });
  };

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

  app.controller('NewValueSetCtrl', function(menu, $scope, $fhir) {
    var cs, wtc, _editor;
    _editor = null;
    $scope.codemirror = function(x) {
      return _editor = x;
    };
    $scope.state = 'form';
    $scope.$watch('state', function(st) {
      console.log(_editor);
      if (st === 'json') {
        return $scope.$evalAsync(function() {
          _editor.refresh();
          return _editor.focus();
        });
      }
    });
    cs = {
      concept: [{}]
    };
    $scope.v = {
      definition: cs
    };
    $scope.addConcept = function() {
      return cs.concept.push({});
    };
    $scope.rmConcept = function(c) {
      return cs.concept = _rm(c, cs.concept);
    };
    $scope.statuses = ['draft', 'active', 'retired'];
    wtc = function() {
      return $scope.vjson = angular.toJson($scope.v, true);
    };
    return $scope.$watch('v', wtc, true);
  });

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
