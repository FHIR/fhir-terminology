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

	var app, u;

	app = __webpack_require__(1);

	__webpack_require__(2);

	__webpack_require__(3);

	__webpack_require__(4);

	__webpack_require__(5);

	u = __webpack_require__(6);

	app.config(function($routeProvider) {
	  return $routeProvider.when('/', {
	    templateUrl: '/src/views/valuesets/index.html',
	    controller: 'WelcomeCtrl'
	  }).when('/vs/:id', {
	    templateUrl: '/src/views/valuesets/show.html',
	    controller: 'ShowValueSetCtrl'
	  }).when('/vs/:id/edit', {
	    templateUrl: '/src/views/valuesets/edit.html',
	    controller: 'EditValueSetCtrl'
	  }).when('/new', {
	    templateUrl: '/src/views/valuesets/new.html',
	    controller: 'NewValueSetCtrl'
	  }).otherwise({
	    redirectTo: '/'
	  });
	});

	app.run(function($q, $rootScope, menu, auth, valuesetRepo) {
	  $rootScope.menu = menu.build({
	    url: '/',
	    label: 'Value Sets'
	  }, {
	    url: '/new',
	    label: 'New',
	    icon: 'add'
	  });
	  $rootScope.auth = auth;
	  $rootScope.valuesets = valuesetRepo.$list();
	  return $rootScope.batch = function() {
	    return valuesetRepo.$batch();
	  };
	});

	app.controller('WelcomeCtrl', function($scope, $http, $firebase) {});

	app.controller('NewValueSetCtrl', function($scope, $firebase, $location, valuesetRepo) {
	  u.fixCodeMirror($scope);
	  $scope.valueset = valuesetRepo.$build();
	  $scope.$watch('valueset', (function(x) {
	    return $scope.vjson = x.$toJson();
	  }), true);
	  return $scope.save = function() {
	    var entry, errors, user, vs;
	    user = $scope.auth.auth.user;
	    vs = $scope.valueset;
	    errors = vs.$validate();
	    if (user == null) {
	      errors.$error = true;
	      errors.user = "Please login";
	    }
	    if (errors.$error) {
	      return $scope.errors = errors;
	    } else {
	      delete $scope.errors;
	      entry = vs.$toEntry();
	      console.log(entry);
	      valuesetRepo.$create(entry, user);
	      return $location.path("/vs/" + entry.id);
	    }
	  };
	});

	app.controller('ShowValueSetCtrl', function($routeParams, $scope, valueset, valuesetRepo, $location) {
	  var id;
	  id = $routeParams.id;
	  valueset($scope, 'valueset', id);
	  valuesetRepo.$bindListItem(id, $scope, 'entry');
	  return $scope.remove = function() {
	    valuesetRepo.$remove(id);
	    return $location.path("/");
	  };
	});

	app.controller('EditValueSetCtrl', function($routeParams, $scope, valueset, valuesetRepo, $location) {
	  var id, item;
	  id = $routeParams.id;
	  valueset($scope, 'valuesetOrig', id);
	  item = null;
	  return $scope.$watch('valuesetOrig', function(v) {
	    var inited;
	    if ((v == null) || inited) {
	      return;
	    }
	    inited = v;
	    return $scope.valueset = valuesetRepo.$build(v.content);
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = angular.module('fhirface', ['ngCookies', 'ngAnimate', 'ngSanitize', 'ngRoute', 'ui.codemirror', 'ng-fhir', 'firebase']);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var app, mkPrefixMatch, mkfilter, sha,
	  __slice = [].slice;

	app = __webpack_require__(1);

	sha = __webpack_require__(8);

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

	mkfilter = function() {
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

	app.filter('vsearch', mkfilter('name', 'desc'));

	app.filter('csearch', mkfilter('code', 'display', 'definition'));

	app.filter('sha', function() {
	  return function(x) {
	    return sha(x, 'TEXT').getHash("SHA-1", "HEX");
	  };
	});


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
	      return d.resolve(newval);
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
	            menu.items = items;
	            return menu;
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

	var BASE_URL, app, u, vs;

	app = __webpack_require__(1);

	u = __webpack_require__(6);

	vs = __webpack_require__(7);

	app.service('auth', function($firebaseSimpleLogin) {
	  var fba, fbr;
	  fbr = new Firebase('https://fhir-terminology.firebaseio.com/');
	  fba = $firebaseSimpleLogin(fbr);
	  return {
	    auth: fba,
	    login: function() {
	      return fba.$login('github');
	    },
	    logout: function() {
	      return fba.$logout();
	    }
	  };
	});

	app.service('valueset', function($firebase) {
	  return function($scope, attr, id) {
	    var fbr, url, vChan, valueset;
	    url = "https://fhir-terminology.firebaseio.com/valuesets/" + id;
	    fbr = new Firebase(url);
	    vChan = $firebase(fbr);
	    valueset = vChan.$asObject();
	    return valueset.$bindTo($scope, attr);
	  };
	});

	BASE_URL = "https://fhir-terminology.firebaseio.com";

	app.service('valuesetRepo', function($firebase) {
	  var list, mkchan, valuesetList, valuesets;
	  mkchan = function(url) {
	    return $firebase(new Firebase(url));
	  };
	  valuesets = mkchan("" + BASE_URL + "/valuesets");
	  valuesetList = mkchan("" + BASE_URL + "/valuesetList");
	  list = valuesetList.$asArray();
	  return {
	    $build: function(attrs) {
	      return vs.mkValueSet(attrs);
	    },
	    $bindListItem: function(id, scope, attr) {
	      var item;
	      item = mkchan("" + BASE_URL + "/valuesetList/" + id);
	      return item.$asObject().$bindTo(scope, attr);
	    },
	    $list: function() {
	      return list;
	    },
	    $batch: function() {
	      return console.log('batch');
	    },
	    $remove: function(id) {
	      var i, _i, _len;
	      for (_i = 0, _len = list.length; _i < _len; _i++) {
	        i = list[_i];
	        if (i.id === id) {
	          list.$remove(i);
	        }
	      }
	      return valuesets.$remove(id);
	    },
	    $create: function(v, u) {
	      var user;
	      valuesets.$set(v.id, angular.copy(v));
	      if (u) {
	        user = {
	          author: u.displayName,
	          avatar: u.thirdPartyUserData.avatar_url
	        };
	      }
	      return valuesetList.$set(v.id, {
	        id: v.id,
	        name: v.content.name,
	        desc: v.content.description,
	        user: user
	      });
	    }
	  };
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var sha;

	sha = __webpack_require__(8);

	exports.sha = function(x) {
	  if (x) {
	    return new sha(x, 'TEXT').getHash("SHA-1", "HEX");
	  }
	};

	exports.rm = function(x, xs) {
	  return xs.filter(function(i) {
	    return i !== x;
	  });
	};

	exports.fixCodeMirror = function($scope) {
	  var _editor;
	  _editor = null;
	  $scope.codemirror = function(x) {
	    return _editor = x;
	  };
	  $scope.state = 'form';
	  return $scope.$watch('state', function(st) {
	    if (st === 'json') {
	      return $scope.$evalAsync(function() {
	        _editor.refresh();
	        return _editor.focus();
	      });
	    }
	  });
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var mkCompose, mkConceptSet, mkDefine, notEmpty, u, _check, _validate;

	u = __webpack_require__(6);

	notEmpty = function(x) {
	  return x && x.trim() !== '';
	};

	_check = function(pred, _arg, ers) {
	  var er, key;
	  key = _arg[0], er = _arg[1];
	  if (!pred) {
	    ers.$error = true;
	    return ers[key] = er;
	  }
	};

	_validate = function(vs) {
	  var errors;
	  errors = {};
	  _check(notEmpty(vs.identifier), ['identifier', 'is required'], errors);
	  _check(notEmpty(vs.description), ['description', 'is required'], errors);
	  _check(notEmpty(vs.name), ['name', 'is required'], errors);
	  return errors;
	};

	mkDefine = function(attrs) {
	  var define, methods;
	  attrs || (attrs = {});
	  define = {
	    concept: []
	  };
	  methods = {
	    $addConcept: function() {
	      return define.concept.push({});
	    },
	    $rmConcept: function(i) {
	      return define.concept = u.rm(i, define.concept);
	    }
	  };
	  return angular.extend(define, attrs, methods);
	};

	mkConceptSet = function(attrs) {
	  var methods, set;
	  attrs || (attrs = {});
	  set = {
	    code: []
	  };
	  methods = {
	    $addCode: function() {
	      return set.code.push({});
	    },
	    $rmCode: function(x) {
	      return set.code = u.rm(x, set.code);
	    }
	  };
	  return angular.extend(set, attrs, methods);
	};

	mkCompose = function(attrs) {
	  var colls, compose, methods;
	  attrs || (attrs = {});
	  compose = {};
	  colls = {
	    include: (attrs.include || []).map(mkConceptSet),
	    exclude: (attrs.exclude || []).map(mkConceptSet)
	  };
	  methods = {
	    $addInclude: function() {
	      return compose.include.push(mkConceptSet());
	    },
	    $addExclude: function() {
	      return compose.exclude.push(mkConceptSet());
	    },
	    $rmInclude: function(x) {
	      return compose.include = u.rm(x, compose.include);
	    },
	    $rmExclude: function(x) {
	      return compose.exclude = u.rm(x, compose.exclude);
	    }
	  };
	  return angular.extend(compose, attrs, colls, methods);
	};

	exports.mkValueSet = function(attrs) {
	  var compose, defaults, define, methods, valueset;
	  attrs || (attrs = {});
	  define = mkDefine(attrs.define);
	  console.log(define);
	  compose = mkCompose(attrs.compose);
	  valueset = {};
	  defaults = {
	    name: 'MyName',
	    version: '0.0.1',
	    status: 'draft',
	    identifier: 'myid1'
	  };
	  methods = {
	    define: define,
	    compose: compose,
	    $statuses: ['draft', 'active', 'retired'],
	    $addDefine: function() {
	      return valueset.define = define;
	    },
	    $rmDefine: function() {
	      return delete valueset.define;
	    },
	    $addCompose: function() {
	      return valueset.compose = compose;
	    },
	    $rmCompose: function() {
	      return delete valueset.compose;
	    },
	    $toJson: function() {
	      return angular.toJson(valueset, true);
	    },
	    $validate: function() {
	      return _validate(valueset);
	    },
	    $toEntry: function() {
	      return angular.fromJson(angular.toJson({
	        id: u.sha(valueset.identifier || valueset.name),
	        content: angular.copy(valueset)
	      }));
	    }
	  };
	  return angular.extend(valueset, defaults, attrs, methods);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 A JavaScript implementation of the SHA family of hashes, as
	 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
	 as defined in FIPS PUB 198a

	 Copyright Brian Turek 2008-2013
	 Distributed under the BSD License
	 See http://caligatio.github.com/jsSHA/ for more information

	 Several functions taken from Paul Johnston
	*/
	(function(T){function z(a,c,b){var g=0,f=[0],h="",l=null,h=b||"UTF8";if("UTF8"!==h&&"UTF16"!==h)throw"encoding must be UTF8 or UTF16";if("HEX"===c){if(0!==a.length%2)throw"srcString of HEX type must be in byte increments";l=B(a);g=l.binLen;f=l.value}else if("ASCII"===c||"TEXT"===c)l=J(a,h),g=l.binLen,f=l.value;else if("B64"===c)l=K(a),g=l.binLen,f=l.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";this.getHash=function(a,c,b,h){var l=null,d=f.slice(),n=g,p;3===arguments.length?"number"!==
	typeof b&&(h=b,b=1):2===arguments.length&&(b=1);if(b!==parseInt(b,10)||1>b)throw"numRounds must a integer >= 1";switch(c){case "HEX":l=L;break;case "B64":l=M;break;default:throw"format must be HEX or B64";}if("SHA-1"===a)for(p=0;p<b;p++)d=y(d,n),n=160;else if("SHA-224"===a)for(p=0;p<b;p++)d=v(d,n,a),n=224;else if("SHA-256"===a)for(p=0;p<b;p++)d=v(d,n,a),n=256;else if("SHA-384"===a)for(p=0;p<b;p++)d=v(d,n,a),n=384;else if("SHA-512"===a)for(p=0;p<b;p++)d=v(d,n,a),n=512;else throw"Chosen SHA variant is not supported";
	return l(d,N(h))};this.getHMAC=function(a,b,c,l,s){var d,n,p,m,w=[],x=[];d=null;switch(l){case "HEX":l=L;break;case "B64":l=M;break;default:throw"outputFormat must be HEX or B64";}if("SHA-1"===c)n=64,m=160;else if("SHA-224"===c)n=64,m=224;else if("SHA-256"===c)n=64,m=256;else if("SHA-384"===c)n=128,m=384;else if("SHA-512"===c)n=128,m=512;else throw"Chosen SHA variant is not supported";if("HEX"===b)d=B(a),p=d.binLen,d=d.value;else if("ASCII"===b||"TEXT"===b)d=J(a,h),p=d.binLen,d=d.value;else if("B64"===
	b)d=K(a),p=d.binLen,d=d.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";a=8*n;b=n/4-1;n<p/8?(d="SHA-1"===c?y(d,p):v(d,p,c),d[b]&=4294967040):n>p/8&&(d[b]&=4294967040);for(n=0;n<=b;n+=1)w[n]=d[n]^909522486,x[n]=d[n]^1549556828;c="SHA-1"===c?y(x.concat(y(w.concat(f),a+g)),a+m):v(x.concat(v(w.concat(f),a+g,c)),a+m,c);return l(c,N(s))}}function s(a,c){this.a=a;this.b=c}function J(a,c){var b=[],g,f=[],h=0,l;if("UTF8"===c)for(l=0;l<a.length;l+=1)for(g=a.charCodeAt(l),f=[],2048<g?(f[0]=224|
	(g&61440)>>>12,f[1]=128|(g&4032)>>>6,f[2]=128|g&63):128<g?(f[0]=192|(g&1984)>>>6,f[1]=128|g&63):f[0]=g,g=0;g<f.length;g+=1)b[h>>>2]|=f[g]<<24-h%4*8,h+=1;else if("UTF16"===c)for(l=0;l<a.length;l+=1)b[h>>>2]|=a.charCodeAt(l)<<16-h%4*8,h+=2;return{value:b,binLen:8*h}}function B(a){var c=[],b=a.length,g,f;if(0!==b%2)throw"String of HEX type must be in byte increments";for(g=0;g<b;g+=2){f=parseInt(a.substr(g,2),16);if(isNaN(f))throw"String of HEX type contains invalid characters";c[g>>>3]|=f<<24-g%8*4}return{value:c,
	binLen:4*b}}function K(a){var c=[],b=0,g,f,h,l,r;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";g=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==g&&g<a.length)throw"Invalid '=' found in base-64 string";for(f=0;f<a.length;f+=4){r=a.substr(f,4);for(h=l=0;h<r.length;h+=1)g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(r[h]),l|=g<<18-6*h;for(h=0;h<r.length-1;h+=1)c[b>>2]|=(l>>>16-8*h&255)<<24-b%4*8,b+=1}return{value:c,binLen:8*b}}function L(a,
	c){var b="",g=4*a.length,f,h;for(f=0;f<g;f+=1)h=a[f>>>2]>>>8*(3-f%4),b+="0123456789abcdef".charAt(h>>>4&15)+"0123456789abcdef".charAt(h&15);return c.outputUpper?b.toUpperCase():b}function M(a,c){var b="",g=4*a.length,f,h,l;for(f=0;f<g;f+=3)for(l=(a[f>>>2]>>>8*(3-f%4)&255)<<16|(a[f+1>>>2]>>>8*(3-(f+1)%4)&255)<<8|a[f+2>>>2]>>>8*(3-(f+2)%4)&255,h=0;4>h;h+=1)b=8*f+6*h<=32*a.length?b+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(l>>>6*(3-h)&63):b+c.b64Pad;return b}function N(a){var c=
	{outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad)}catch(b){}if("boolean"!==typeof c.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof c.b64Pad)throw"Invalid b64Pad formatting option";return c}function U(a,c){return a<<c|a>>>32-c}function u(a,c){return a>>>c|a<<32-c}function t(a,c){var b=null,b=new s(a.a,a.b);return b=32>=c?new s(b.a>>>c|b.b<<32-c&4294967295,b.b>>>c|b.a<<32-c&4294967295):
	new s(b.b>>>c-32|b.a<<64-c&4294967295,b.a>>>c-32|b.b<<64-c&4294967295)}function O(a,c){var b=null;return b=32>=c?new s(a.a>>>c,a.b>>>c|a.a<<32-c&4294967295):new s(0,a.a>>>c-32)}function V(a,c,b){return a^c^b}function P(a,c,b){return a&c^~a&b}function W(a,c,b){return new s(a.a&c.a^~a.a&b.a,a.b&c.b^~a.b&b.b)}function Q(a,c,b){return a&c^a&b^c&b}function X(a,c,b){return new s(a.a&c.a^a.a&b.a^c.a&b.a,a.b&c.b^a.b&b.b^c.b&b.b)}function Y(a){return u(a,2)^u(a,13)^u(a,22)}function Z(a){var c=t(a,28),b=t(a,
	34);a=t(a,39);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function $(a){return u(a,6)^u(a,11)^u(a,25)}function aa(a){var c=t(a,14),b=t(a,18);a=t(a,41);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function ba(a){return u(a,7)^u(a,18)^a>>>3}function ca(a){var c=t(a,1),b=t(a,8);a=O(a,7);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function da(a){return u(a,17)^u(a,19)^a>>>10}function ea(a){var c=t(a,19),b=t(a,61);a=O(a,6);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function R(a,c){var b=(a&65535)+(c&65535);return((a>>>16)+(c>>>
	16)+(b>>>16)&65535)<<16|b&65535}function fa(a,c,b,g){var f=(a&65535)+(c&65535)+(b&65535)+(g&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(g>>>16)+(f>>>16)&65535)<<16|f&65535}function S(a,c,b,g,f){var h=(a&65535)+(c&65535)+(b&65535)+(g&65535)+(f&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(g>>>16)+(f>>>16)+(h>>>16)&65535)<<16|h&65535}function ga(a,c){var b,g,f;b=(a.b&65535)+(c.b&65535);g=(a.b>>>16)+(c.b>>>16)+(b>>>16);f=(g&65535)<<16|b&65535;b=(a.a&65535)+(c.a&65535)+(g>>>16);g=(a.a>>>16)+(c.a>>>16)+(b>>>
	16);return new s((g&65535)<<16|b&65535,f)}function ha(a,c,b,g){var f,h,l;f=(a.b&65535)+(c.b&65535)+(b.b&65535)+(g.b&65535);h=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(g.b>>>16)+(f>>>16);l=(h&65535)<<16|f&65535;f=(a.a&65535)+(c.a&65535)+(b.a&65535)+(g.a&65535)+(h>>>16);h=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(g.a>>>16)+(f>>>16);return new s((h&65535)<<16|f&65535,l)}function ia(a,c,b,g,f){var h,l,r;h=(a.b&65535)+(c.b&65535)+(b.b&65535)+(g.b&65535)+(f.b&65535);l=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(g.b>>>16)+(f.b>>>
	16)+(h>>>16);r=(l&65535)<<16|h&65535;h=(a.a&65535)+(c.a&65535)+(b.a&65535)+(g.a&65535)+(f.a&65535)+(l>>>16);l=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(g.a>>>16)+(f.a>>>16)+(h>>>16);return new s((l&65535)<<16|h&65535,r)}function y(a,c){var b=[],g,f,h,l,r,s,u=P,t=V,v=Q,d=U,n=R,p,m,w=S,x,q=[1732584193,4023233417,2562383102,271733878,3285377520];a[c>>>5]|=128<<24-c%32;a[(c+65>>>9<<4)+15]=c;x=a.length;for(p=0;p<x;p+=16){g=q[0];f=q[1];h=q[2];l=q[3];r=q[4];for(m=0;80>m;m+=1)b[m]=16>m?a[m+p]:d(b[m-3]^b[m-8]^b[m-
	14]^b[m-16],1),s=20>m?w(d(g,5),u(f,h,l),r,1518500249,b[m]):40>m?w(d(g,5),t(f,h,l),r,1859775393,b[m]):60>m?w(d(g,5),v(f,h,l),r,2400959708,b[m]):w(d(g,5),t(f,h,l),r,3395469782,b[m]),r=l,l=h,h=d(f,30),f=g,g=s;q[0]=n(g,q[0]);q[1]=n(f,q[1]);q[2]=n(h,q[2]);q[3]=n(l,q[3]);q[4]=n(r,q[4])}return q}function v(a,c,b){var g,f,h,l,r,t,u,v,z,d,n,p,m,w,x,q,y,C,D,E,F,G,H,I,e,A=[],B,k=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,
	1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,
	2361852424,2428436474,2756734187,3204031479,3329325298];d=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];f=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];if("SHA-224"===b||"SHA-256"===b)n=64,g=(c+65>>>9<<4)+15,w=16,x=1,e=Number,q=R,y=fa,C=S,D=ba,E=da,F=Y,G=$,I=Q,H=P,d="SHA-224"===b?d:f;else if("SHA-384"===b||"SHA-512"===b)n=80,g=(c+128>>>10<<5)+31,w=32,x=2,e=s,q=ga,y=ha,C=ia,D=ca,E=ea,F=Z,G=aa,I=X,H=W,k=[new e(k[0],
	3609767458),new e(k[1],602891725),new e(k[2],3964484399),new e(k[3],2173295548),new e(k[4],4081628472),new e(k[5],3053834265),new e(k[6],2937671579),new e(k[7],3664609560),new e(k[8],2734883394),new e(k[9],1164996542),new e(k[10],1323610764),new e(k[11],3590304994),new e(k[12],4068182383),new e(k[13],991336113),new e(k[14],633803317),new e(k[15],3479774868),new e(k[16],2666613458),new e(k[17],944711139),new e(k[18],2341262773),new e(k[19],2007800933),new e(k[20],1495990901),new e(k[21],1856431235),
	new e(k[22],3175218132),new e(k[23],2198950837),new e(k[24],3999719339),new e(k[25],766784016),new e(k[26],2566594879),new e(k[27],3203337956),new e(k[28],1034457026),new e(k[29],2466948901),new e(k[30],3758326383),new e(k[31],168717936),new e(k[32],1188179964),new e(k[33],1546045734),new e(k[34],1522805485),new e(k[35],2643833823),new e(k[36],2343527390),new e(k[37],1014477480),new e(k[38],1206759142),new e(k[39],344077627),new e(k[40],1290863460),new e(k[41],3158454273),new e(k[42],3505952657),
	new e(k[43],106217008),new e(k[44],3606008344),new e(k[45],1432725776),new e(k[46],1467031594),new e(k[47],851169720),new e(k[48],3100823752),new e(k[49],1363258195),new e(k[50],3750685593),new e(k[51],3785050280),new e(k[52],3318307427),new e(k[53],3812723403),new e(k[54],2003034995),new e(k[55],3602036899),new e(k[56],1575990012),new e(k[57],1125592928),new e(k[58],2716904306),new e(k[59],442776044),new e(k[60],593698344),new e(k[61],3733110249),new e(k[62],2999351573),new e(k[63],3815920427),new e(3391569614,
	3928383900),new e(3515267271,566280711),new e(3940187606,3454069534),new e(4118630271,4000239992),new e(116418474,1914138554),new e(174292421,2731055270),new e(289380356,3203993006),new e(460393269,320620315),new e(685471733,587496836),new e(852142971,1086792851),new e(1017036298,365543100),new e(1126000580,2618297676),new e(1288033470,3409855158),new e(1501505948,4234509866),new e(1607167915,987167468),new e(1816402316,1246189591)],d="SHA-384"===b?[new e(3418070365,d[0]),new e(1654270250,d[1]),new e(2438529370,
	d[2]),new e(355462360,d[3]),new e(1731405415,d[4]),new e(41048885895,d[5]),new e(3675008525,d[6]),new e(1203062813,d[7])]:[new e(f[0],4089235720),new e(f[1],2227873595),new e(f[2],4271175723),new e(f[3],1595750129),new e(f[4],2917565137),new e(f[5],725511199),new e(f[6],4215389547),new e(f[7],327033209)];else throw"Unexpected error in SHA-2 implementation";a[c>>>5]|=128<<24-c%32;a[g]=c;B=a.length;for(p=0;p<B;p+=w){c=d[0];g=d[1];f=d[2];h=d[3];l=d[4];r=d[5];t=d[6];u=d[7];for(m=0;m<n;m+=1)A[m]=16>m?
	new e(a[m*x+p],a[m*x+p+1]):y(E(A[m-2]),A[m-7],D(A[m-15]),A[m-16]),v=C(u,G(l),H(l,r,t),k[m],A[m]),z=q(F(c),I(c,g,f)),u=t,t=r,r=l,l=q(h,v),h=f,f=g,g=c,c=q(v,z);d[0]=q(c,d[0]);d[1]=q(g,d[1]);d[2]=q(f,d[2]);d[3]=q(h,d[3]);d[4]=q(l,d[4]);d[5]=q(r,d[5]);d[6]=q(t,d[6]);d[7]=q(u,d[7])}if("SHA-224"===b)a=[d[0],d[1],d[2],d[3],d[4],d[5],d[6]];else if("SHA-256"===b)a=d;else if("SHA-384"===b)a=[d[0].a,d[0].b,d[1].a,d[1].b,d[2].a,d[2].b,d[3].a,d[3].b,d[4].a,d[4].b,d[5].a,d[5].b];else if("SHA-512"===b)a=[d[0].a,
	d[0].b,d[1].a,d[1].b,d[2].a,d[2].b,d[3].a,d[3].b,d[4].a,d[4].b,d[5].a,d[5].b,d[6].a,d[6].b,d[7].a,d[7].b];else throw"Unexpected error in SHA-2 implementation";return a}true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return z}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=z:exports=z:T.jsSHA=z})(this);


/***/ }
/******/ ])