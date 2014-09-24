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

	var app;

	app = __webpack_require__(1);

	__webpack_require__(2);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = angular.module('fhirface', ['ngCookies', 'ngAnimate', 'ngSanitize', 'ngRoute', 'ui.codemirror', 'ng-fhir']);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var app, u;

	app = __webpack_require__(1);

	u = __webpack_require__(6);

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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var app, cache,
	  __slice = [].slice;

	app = __webpack_require__(1);

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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var app;

	app = __webpack_require__(1);

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var app, preProcessEntry, u;

	app = __webpack_require__(1);

	u = __webpack_require__(6);

	app.controller('WelcomeCtrl', function(menu, $scope, $http) {});

	app.controller('NewValueSetCtrl', function(menu, $scope, $fhir) {
	  var cmp, cs, wtc, _editor;
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
	  $scope.v = {};
	  cs = {
	    concept: [{}]
	  };
	  $scope.addDefinition = function() {
	    return $scope.v.definition = cs;
	  };
	  $scope.rmDefinition = function() {
	    return $scope.v.definition = null;
	  };
	  $scope.addConcept = function() {
	    return cs.concept.push({});
	  };
	  $scope.rmConcept = function(c) {
	    return cs.concept = u.rm(c, cs.concept);
	  };
	  $scope.statuses = ['draft', 'active', 'retired'];
	  cmp = {
	    include: [
	      {
	        code: []
	      }
	    ]
	  };
	  $scope.addCompose = function() {
	    return $scope.v.compose = cmp;
	  };
	  $scope.rmCompose = function() {
	    return $scope.v.compose = null;
	  };
	  $scope.addCode = function() {
	    return cmp.include[0].code.push({});
	  };
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
/* 6 */
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


/***/ }
/******/ ])
angular.module('fhirface').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/views/valuesets/_compose_form.html',
    "<a ng-if=\"!v.compose\" class=\"btn btn-default\" ng-click=\"addCompose()\">\n" +
    "  Add Compose\n" +
    "</a>\n" +
    "<div ng-if=\"v.compose\">\n" +
    "  <div ng-repeat=\"inc in v.compose.include\">\n" +
    "    <form class=\"form-horizontal\"\n" +
    "      role=\"form\"\n" +
    "      ng-submit=\"addCode()\">\n" +
    "      <h3>\n" +
    "        Definition\n" +
    "        <a class=\"btn btn-danger\" ng-click=\"rmCompose()\">remove</a>\n" +
    "      </h3>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\">system</label>\n" +
    "        <div class=\"col-sm-10\">\n" +
    "          <input type=\"text\" class=\"form-control\"\n" +
    "          ng-model=\"inc.system\" placeholder=\"system\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-2 control-label\">version</label>\n" +
    "        <div class=\"col-sm-10\">\n" +
    "          <input type=\"text\" class=\"form-control\"\n" +
    "          ng-model=\"inc.version\" placeholder=\"version\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <hr/>\n" +
    "      <div class=\"form-group\" ng-repeat=\"i in inc.code\">\n" +
    "        <label class=\"col-sm-2 control-label\">code</label>\n" +
    "        <div class=\"col-sm-2\">\n" +
    "          <input type=\"text\"\n" +
    "          class=\"form-control\"\n" +
    "          placeholder=\"code\"\n" +
    "          ng-model=\"i.code\"/>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-12\">\n" +
    "          <button type=\"submit\" class=\"col-sm-12 btn btn-default\">\n" +
    "            Add Code\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_definition_form.html',
    "<a ng-if=\"!v.definition.concept\" class=\"btn btn-default\" ng-click=\"addDefinition()\">\n" +
    "  Add Definition\n" +
    "</a>\n" +
    "<div ng-if=\"v.definition.concept\">\n" +
    "  <form class=\"form-horizontal\" role=\"form\" ng-submit=\"addConcept()\">\n" +
    "    <h3>\n" +
    "      Definition\n" +
    "      <a class=\"btn btn-danger\" ng-click=\"rmDefinition()\">remove</a>\n" +
    "    </h3>\n" +
    "    <hr/>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">system</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "        ng-model=\"v.definition.system\" placeholder=\"system\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">version</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "        ng-model=\"v.definition.version\" placeholder=\"version\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">version</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <div class=\"col-sm-1 checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"v.definition.caseSensitive\"/>\n" +
    "            Case Sensitive\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <hr/>\n" +
    "    <div class=\"form-group\" ng-repeat=\"i in v.definition.concept\">\n" +
    "      <div class=\"col-sm-1 checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"i.abstract\"/>\n" +
    "          Abstract\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-2\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"code\" ng-model=\"i.code\">\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"definition\" ng-model=\"i.definition\">\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-4\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"display\" ng-model=\"i.display\">\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-1\">\n" +
    "        <a ng-click=\"rmConcept(i)\" class=\"btn btn-danger col-sm-12\"> × </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <button type=\"submit\" class=\"col-sm-12 btn btn-default\">\n" +
    "          Add Concept\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_header.html',
    "<h1>\n" +
    "  {{v.name}}\n" +
    "  <a class=\"btn btn-default\">\n" +
    "    <b>v:</b> {{v.version}}\n" +
    "    <span class=\"badge\">{{v.status}}</span>\n" +
    "    <span ng-if=\"v.experimental\" class=\"badge\">experimental</span>\n" +
    "  </a>\n" +
    "  <small>{{v.date | date}}</small>\n" +
    "  <div class=\"btn-group pull-right\">\n" +
    "    <a class=\"btn btn-default\" switcher=\"vm.state\" swvalue='info' >info</a>\n" +
    "    <a class=\"btn btn-default\" switcher=\"vm.state\" swvalue='json'>json</a>\n" +
    "  </div>\n" +
    "</h1>\n" +
    "<hr/>\n" +
    "<p><b>id:</b> {{v.identifier}}</p>\n" +
    "<p><b>publisher:</b> {{v.publisher}}</p>\n" +
    "\n" +
    "<p ng-repeat=\"tel in v.telecom\">\n" +
    "<b>telecom:</b> {{tel.system}}: {{tel.value}}</p>\n" +
    "</p>\n" +
    "<p>{{v.description}}</p>\n" +
    "\n" +
    "<hr/>\n"
  );


  $templateCache.put('/src/views/valuesets/_info.html',
    "<div class=\"well\">\n" +
    "  <input class=\"form-controll srch\" ng-model=\"searchConcept\"/>\n" +
    "</div>\n" +
    "<div ng-if=\"v.define\">\n" +
    "  <h3>.definition ({{v.define.concept.length}} concepts)</h3>\n" +
    "  <table class=\"table\">\n" +
    "    <thead>\n" +
    "      <th>code</th>\n" +
    "      <th>display</th>\n" +
    "      <th>definition</th>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"d in v.define.concept | csearch:searchConcept | limitTo: 20\">\n" +
    "      <th>{{d.code}}</th>\n" +
    "      <td>{{d.display}}</td>\n" +
    "      <td>{{d.definition}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "  <h3>{{v.define.concept.length - 20}} more</h3>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"v.compose\">\n" +
    "  <div ng-repeat=\"inc in v.compose.include\">\n" +
    "    <h2>Include: {{inc.system}} (v {{inc.version}})</h2>\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"c in inc.code\"> {{c}} </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"v.expansion\">\n" +
    "  <h1>.expansion</h1>\n" +
    "  <pre>{{v.expansion}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_info_form.html',
    "<form class=\"form-horizontal\" role=\"form\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">name</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"v.name\" placeholder=\"name\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">identifier</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"id\" ng-model=\"v.identifier\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">version</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"v.version\" placeholder=\"version\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">publisher</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"v.publisher\" placeholder=\"publisher\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">description</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <textarea type=\"text\" class=\"form-control\" ng-model=\"v.description\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">status</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <select ng-options=\"l as l for l in statuses\" ng-model=\"v.status\" placeholder=\"status\" class=\"form-control\"> </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!-- <telecom><1!-- 0..* Contact Contact information of the publisher § --1></telecom> -->\n" +
    "  <!-- <copyright value=\"[string]\"/><1!-- 0..1 About the value set or its content --1> -->\n" +
    "  <!-- <experimental value=\"[boolean]\"/><1!-- 0..1 If for testing purposes, not real usage § --1> -->\n" +
    "  <!--  <extensible value=\"[boolean]\"/><1!-- 0..1 Whether this is intended to be used with an extensible binding --1> -->\n" +
    "  <!-- <date value=\"[dateTime]\"/><1!-- 0..1 Date for given status § --1> -->\n" +
    "</form>\n"
  );


  $templateCache.put('/src/views/valuesets/new.html',
    "<h2>ValueSet\n" +
    "  <div class=\"btn-group pull-right\">\n" +
    "    <a class=\"btn btn-default\" switcher=\"state\" swvalue=\"form\">form</a>\n" +
    "    <a class=\"btn btn-default\" switcher=\"state\" swvalue=\"json\">json</a>\n" +
    "    <!-- <a class=\"btn btn-default\" switcher=\"state\" swvalue=\"info\">info</a> -->\n" +
    "  </div>\n" +
    "</h2>\n" +
    "<hr/>\n" +
    "\n" +
    "<div ng-show=\"state=='form'\">\n" +
    "  <div ng-include src=\"'/src/views/valuesets/_info_form.html'\"></div>\n" +
    "  <hr/>\n" +
    "  <div ng-include src=\"'/src/views/valuesets/_definition_form.html'\"></div>\n" +
    "  <hr/>\n" +
    "  <div ng-include src=\"'/src/views/valuesets/_compose_form.html'\"></div>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-6\">\n" +
    "      <button type=\"submit\" class=\"col-sm-12 btn btn-success\">\n" +
    "        Save\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-6\">\n" +
    "      <button type=\"submit\" class=\"col-sm-12 btn btn-defalut\">\n" +
    "        Cancel\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"state=='json'\">\n" +
    "  <ui-codemirror\n" +
    "  style=\"min-height: 1000px;\"\n" +
    "  ui-codemirror-opts=\"{mode: 'javascript', lineWrapping: true, lineNumbers: true, json: true, onLoad : codemirror}\"\n" +
    "  ui-refresh=\"state=='json'\"\n" +
    "  ng-model='vjson'>\n" +
    "  </ui-codemirror>\n" +
    "</div>\n" +
    "\n" +
    "<!-- <div ng-show=\"state=='info'\"> -->\n" +
    "<!--   <div class=\"txt\"> -->\n" +
    "<!--     <h3>Scope and Usage</h3> -->\n" +
    "<!--     <p> -->\n" +
    "<!--     Value sets may be constructed in one of two ways: -->\n" +
    "<!--     </p> -->\n" +
    "<!--     <ul> -->\n" +
    "<!--       <li>A value set can <i>define</i> its own codes, and/or</li> -->\n" +
    "<!--       <li>A value set can be <i>composed</i> of codes defined in other code systems, either by listing the codes or by providing a set of selection criteria</li> -->\n" +
    "<!--     </ul> -->\n" +
    "<!--     <p> -->\n" +
    "<!--     A value set can also be \"expanded\", where the value set is turned into a simple collection of enumerated codes. -->\n" +
    "<!--     This operation is performed to produce a collection of codes that are ready to use for data entry or -->\n" +
    "<!--     validation. An expanded value set may also contain the original definition as well. -->\n" +
    "<!--     </p> -->\n" +
    "<!--   </div> -->\n" +
    "<!-- </div> -->\n"
  );


  $templateCache.put('/src/views/valuesets/show.html',
    "<div ng-switch=\"vm.state\" ng-init=\"vm = {state:'info'}\">\n" +
    "  <div ng-include src=\"'/src/views/valuesets/_header.html'\"></div>\n" +
    "  <div ng-switch-when=\"info\">\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_info.html'\"></div>\n" +
    "  </div>\n" +
    "  <div ng-switch-when=\"json\">\n" +
    "    <pre> {{v | json }} </pre>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/welcome.html',
    "<div class=\"well\">\n" +
    "  <input placeholder=\"search by prefixes\" class=\"form-control srch\" ng-model=\"search\"/>\n" +
    "</div>\n" +
    "<a href=\"#/vs/{{$index}}\" class=\"srch-res\" ng-repeat=\"entry in vs.entry | vsearch:search | limitTo:15\">\n" +
    "  <h4>{{entry.content.name}}</h4>\n" +
    "  <p>\n" +
    "    {{entry.content.description}}\n" +
    "  </p>\n" +
    "  <i class=\"fa fa-chevron-right\"></i>\n" +
    "</a>\n" +
    "<h3>{{vs.entry.length}} items</h3>\n"
  );

}]);
