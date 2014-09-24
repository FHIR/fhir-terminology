var fhirface =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var app, preProcessEntry, u;

	u = __webpack_require__(1);

	app = __webpack_require__(2);

	__webpack_require__(3);

	__webpack_require__(4);

	__webpack_require__(5);

	app.config(function($routeProvider) {
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

	app.run(function($q, $rootScope, menu, cache, $http) {
	  menu.build({
	    url: '/',
	    label: 'Value Sets'
	  }, {
	    url: '/new',
	    label: 'New',
	    icon: 'add'
	  });
	  $rootScope.menu = menu;
	  return cache('vs', 'valuesets/valuesets.json').then(function(v) {
	    return $rootScope.vs = v;
	  });
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
	    return cs.concept = u.rm(c, cs.concept);
	  };
	  $scope.statuses = ['draft', 'active', 'retired'];
	  wtc = function() {
	    return $scope.vjson = angular.toJson($scope.v, true);
	  };
	  return $scope.$watch('v', wtc, true);
	});

	preProcessEntry = function(e) {
	  delete e.content.text;
	  return e.content;
	};

	app.controller('ShowValueSetCtrl', function(menu, $routeParams, $scope, $rootScope) {
	  var id;
	  id = parseInt($routeParams.id);
	  return $scope.v = preProcessEntry($scope.vs.entry[id]);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var mkPrefixMatch,
	  __slice = [].slice;

	exports.rm = function(x, xs) {
	  return xs.filter(function(i) {
	    return i !== x;
	  });
	};

	mkPrefixMatch = function(str) {
	  var tokens;
	  tokens = str.toLowerCase().split(/\s+/);
	  return function(x) {
	    if (!x) {
	      return false;
	    }
	    return tokens.every(function(t) {
	      return x.toLowerCase().indexOf(t) > -1;
	    });
	  };
	};

	exports.mkPrefixMatch = mkPrefixMatch;

	exports.mkfilter = function() {
	  var flds;
	  flds = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  return function() {
	    return function(xs, str) {
	      var match;
	      if (str == null) {
	        return xs;
	      }
	      match = mkPrefixMatch(str);
	      return xs.filter(function(x) {
	        return flds.some(function(fld) {
	          return match(x[fld]);
	        });
	      });
	    };
	  };
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = angular.module('fhirface', ['ngCookies', 'ngAnimate', 'ngSanitize', 'ngRoute', 'ui.codemirror', 'ng-fhir']);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var app, u;

	app = __webpack_require__(2);

	u = __webpack_require__(1);

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

	app.filter('csearch', u.mkfilter('code', 'display', 'definition'));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var app, cache,
	  __slice = [].slice;

	app = __webpack_require__(2);

	cache = function(d, key, missCb) {
	  var st, val;
	  st = window.localStorage;
	  val = st.getItem(key);
	  if (val) {
	    console.log('cache.match');
	    d.resolve(JSON.parse(val));
	  } else {
	    console.log('cache.missmatch');
	    missCb(function(newval) {
	      st.setItem(key, JSON.stringify(newval));
	      return p.resolve(newval);
	    });
	  }
	  return d.promise;
	};

	app.service('cache', function($http, $q) {
	  return function(key, url) {
	    return cache($q.defer(), key, function(save) {
	      return $http({
	        method: 'GET',
	        url: url,
	        success: save
	      }).success(save);
	    });
	  };
	});

	app.provider('menu', function() {
	  return {
	    $get: function() {
	      var menu;
	      menu = {
	        items: [],
	        build: (function(_this) {
	          return function() {
	            var items, state;
	            items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	            state = 'path';
	            return menu.items = items;
	          };
	        })(this)
	      };
	      return menu;
	    }
	  };
	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var app;

	app = __webpack_require__(2);

	app.directive('switcher', function() {
	  return {
	    restrict: 'A',
	    scope: {
	      switcher: '='
	    },
	    link: function(scope, element, attrs) {
	      var swcls, swvalue;
	      swvalue = attrs.swvalue;
	      swcls = attrs.swclass || 'btn-primary active';
	      scope.$watch('switcher', function(v) {
	        if (v === swvalue) {
	          return element.addClass(swcls);
	        } else {
	          return element.removeClass(swcls);
	        }
	      });
	      return element.click(function() {
	        return scope.$apply(function() {
	          return scope.switcher = swvalue;
	        });
	      });
	    }
	  };
	});


/***/ }
/******/ ])