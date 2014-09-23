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

angular.module('fhirface').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/views/valuesets/new.html',
    "<h2>ValueSet\n" +
    "  <div class=\"btn-group pull-right\">\n" +
    "    <a class=\"btn btn-default\" ng-click=\"state='form'\">form</a>\n" +
    "    <a class=\"btn btn-default\" ng-click=\"state='json'\" >json</a>\n" +
    "    <a class=\"btn btn-default\" ng-click=\"state='info'\" >info</a>\n" +
    "  </div>\n" +
    "</h2>\n" +
    "<hr/>\n" +
    "\n" +
    "<div ng-show=\"state=='form'\">\n" +
    "  <form class=\"form-horizontal\" role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">name</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"v.name\" placeholder=\"name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">identifier</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"id\" ng-model=\"v.identifier\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">version</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"v.version\" placeholder=\"version\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">publisher</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"v.publisher\" placeholder=\"publisher\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">description</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <textarea type=\"text\" class=\"form-control\" ng-model=\"v.description\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">status</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <select ng-options=\"l as l for l in statuses\" ng-model=\"v.status\" placeholder=\"status\" class=\"form-control\"> </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <!-- <telecom><1!-- 0..* Contact Contact information of the publisher § --1></telecom> -->\n" +
    "    <!-- <copyright value=\"[string]\"/><1!-- 0..1 About the value set or its content --1> -->\n" +
    "    <!-- <experimental value=\"[boolean]\"/><1!-- 0..1 If for testing purposes, not real usage § --1> -->\n" +
    "    <!--  <extensible value=\"[boolean]\"/><1!-- 0..1 Whether this is intended to be used with an extensible binding --1> -->\n" +
    "    <!-- <date value=\"[dateTime]\"/><1!-- 0..1 Date for given status § --1> -->\n" +
    "  </form>\n" +
    "\n" +
    "  <form ng-show=\"state=='form'\" class=\"form-horizontal\" role=\"form\" ng-submit=\"addConcept()\">\n" +
    "    <h3>definition.concept</h3>\n" +
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
    "\n" +
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
    "<div ng-show=\"state=='info'\">\n" +
    "  <div class=\"txt\">\n" +
    "    <h3>Scope and Usage</h3>\n" +
    "    <p>\n" +
    "    Value sets may be constructed in one of two ways:\n" +
    "    </p>\n" +
    "    <ul>\n" +
    "      <li>A value set can <i>define</i> its own codes, and/or</li>\n" +
    "      <li>A value set can be <i>composed</i> of codes defined in other code systems, either by listing the codes or by providing a set of selection criteria</li>\n" +
    "    </ul>\n" +
    "    <p>\n" +
    "    A value set can also be \"expanded\", where the value set is turned into a simple collection of enumerated codes.\n" +
    "    This operation is performed to produce a collection of codes that are ready to use for data entry or\n" +
    "    validation. An expanded value set may also contain the original definition as well.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <ng-include src=\"src/views/valuesets/uml.html\" />\n" +
    "</div>\n"
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


  $templateCache.put('/src/views/valuesets/uml.html',
    "<div>\n" +
    "<svg height=\"472.0\" width=\"1030.0\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">  <defs>\n" +
    "    <filter id=\"shadow\" height=\"200%\" width=\"200%\" y=\"0\" x=\"0\">\n" +
    "      <feOffset result=\"offOut\" dx=\"3\" dy=\"3\" in=\"SourceGraphic\"></feOffset>\n" +
    "      <feColorMatrix result=\"matrixOut\" values=\"0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0\" type=\"matrix\" in=\"offOut\"></feColorMatrix>\n" +
    "      <feGaussianBlur result=\"blurOut\" stdDeviation=\"2\" in=\"matrixOut\"></feGaussianBlur>\n" +
    "      <feBlend in2=\"blurOut\" in=\"SourceGraphic\" mode=\"normal\"></feBlend>\n" +
    "    </filter>\n" +
    "  </defs><rect height=\"190.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"156.0\" y=\"0.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"0.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"28.0\" y2=\"28.0\" x2=\"156.0\" x1=\"0.0\"></line><text fill=\"black\" class=\"diagram-class-title  diagram-class-resource\" y=\"20.0\" x=\"78.0\">ValueSet<tspan class=\"diagram-class-title-link\"> (<a class=\"diagram-class-reference\" xlink:href=\"resources.html\">Resource</a>)</tspan></text><text fill=\"black\" class=\"diagram-class-detail\" y=\"42.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.identifier\"><title>The identifier that is used to identify this value set when it is referenced in a specification, model, design or an instance (should be globally unique OID, UUID, or URI)</title>identifier</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"56.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.version\"><title>The identifier that is used to identify this version of the value set when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the profile author manually and the value should be a timestamp</title>version</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"70.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.name\"><title>A free text natural language name describing the value set</title>name</a> : <a xlink:href=\"datatypes.html#string\">string</a> 1..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"84.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.publisher\"><title>The name of the individual or organization that published the value set</title>publisher</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"98.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.telecom\"><title>Contacts of the publisher to assist a user in finding and communicating with the publisher</title>telecom</a> : <a xlink:href=\"datatypes.html#Contact\">Contact</a> 0..*</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"112.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.description\"><title>A free text natural language description of the use of the value set - reason for definition, conditions of use, etc</title>description</a> : <a xlink:href=\"datatypes.html#string\">string</a> 1..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"126.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.copyright\"><title>A copyright statement relating to the value set and/or its contents</title>copyright</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"140.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.status\"><title>The status of the value set (this element modifies the meaning of other elements)</title>status</a> : <a xlink:href=\"datatypes.html#code\">code</a> 1..1 &lt;&lt;<a xlink:href=\"valueset-status.html\"><title>The lifecycle status of a Value Set or Concept Map</title>ValueSetStatus</a>&gt;&gt;</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"154.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.experimental\"><title>This valueset was authored for testing purposes (or education/evaluation/marketing), and is not intended to be used for genuine usage</title>experimental</a> : <a xlink:href=\"datatypes.html#boolean\">boolean</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"168.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.extensible\"><title>Whether this is intended to be used with an extensible binding or not</title>extensible</a> : <a xlink:href=\"datatypes.html#boolean\">boolean</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"182.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.date\"><title>The date that the value set status was last changed</title>date</a> : <a xlink:href=\"datatypes.html#dateTime\">dateTime</a> 0..1</text><rect height=\"78.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"120.0\" y=\"230.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"0.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"258.0\" y2=\"258.0\" x2=\"120.0\" x1=\"0.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"250.0\" x=\"60.0\">Define</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"272.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.system\"><title>URI to identify the code system</title>system</a> : <a xlink:href=\"datatypes.html#uri\">uri</a> 1..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"286.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.version\"><title>The version of this code system that defines the codes. Note that the version is optional because a well maintained code system does not suffer from versioning, and therefore the version does not need to be maintained. However many code systems are not well maintained, and the version needs to be defined and tracked</title>version</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"300.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.caseSensitive\"><title>If code comparison is case sensitive when codes within this system are compared to each other</title>caseSensitive</a> : <a xlink:href=\"datatypes.html#boolean\">boolean</a> 0..1</text><rect height=\"92.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"104.0\" y=\"350.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"0.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"378.0\" y2=\"378.0\" x2=\"104.0\" x1=\"0.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"370.0\" x=\"52.0\">Concept</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"392.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.concept.code\"><title>Code that identifies concept</title>code</a> : <a xlink:href=\"datatypes.html#code\">code</a> 1..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"406.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.concept.abstract\"><title>If this code is not for use as a real concept</title>abstract</a> : <a xlink:href=\"datatypes.html#boolean\">boolean</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"420.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.concept.display\"><title>Text to Display to the user</title>display</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"434.0\" x=\"6.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.concept.definition\"><title>The formal definition of the concept. Formal definitions are not required, because of the prevalence of legacy systems without them, but they are highly recommended, as without them there is no formal meaning associated with the concept</title>definition</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><rect height=\"50.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"76.0\" y=\"40.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"490.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"68.0\" y2=\"68.0\" x2=\"566.0\" x1=\"490.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"60.0\" x=\"528.0\">Compose</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"82.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.import\"><title>Includes the contents of the referenced value set as a part of the contents of this value set</title>import</a> : <a xlink:href=\"datatypes.html#uri\">uri</a> 0..*</text><rect height=\"78.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"92.0\" y=\"170.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"490.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"198.0\" y2=\"198.0\" x2=\"582.0\" x1=\"490.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"190.0\" x=\"536.0\">ConceptSet</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"212.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.system\"><title>The code system from which the selected codes come from</title>system</a> : <a xlink:href=\"datatypes.html#uri\">uri</a> 1..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"226.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.version\"><title>The version of the code system that the codes are selected from</title>version</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"240.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.code\"><title>Specifies a code or concept to be included or excluded. The list of codes is considered ordered, though the order may not have any particular significance</title>code</a> : <a xlink:href=\"datatypes.html#code\">code</a> 0..*</text><rect height=\"78.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"140.0\" y=\"310.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"490.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"338.0\" y2=\"338.0\" x2=\"630.0\" x1=\"490.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"330.0\" x=\"560.0\">Filter</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"352.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.filter.property\"><title>A code that identifies a property defined in the code system</title>property</a> : <a xlink:href=\"datatypes.html#code\">code</a> 1..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"366.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.filter.op\"><title>The kind of operation to perform as a part of the filter criteria</title>op</a> : <a xlink:href=\"datatypes.html#code\">code</a> 1..1 &lt;&lt;<a xlink:href=\"filter-operator.html\"><title>The kind of operation to perform as a part of a property based filter</title>FilterOperator</a>&gt;&gt;</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"380.0\" x=\"496.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.filter.value\"><title>The match value may be either a code defined by the system, or a string value which is used a regex match on the literal string of the property value</title>value</a> : <a xlink:href=\"datatypes.html#code\">code</a> 1..1</text><rect height=\"64.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"120.0\" y=\"210.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"260.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"238.0\" y2=\"238.0\" x2=\"380.0\" x1=\"260.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"230.0\" x=\"320.0\">Expansion</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"252.0\" x=\"266.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.identifier\"><title>An identifier that uniquely identifies this expansion of the valueset. Systems may re-use the same identifier as long as the expansion and the definition remain the same, but are not required to do so</title>identifier</a> : <a xlink:href=\"datatypes.html#Identifier\">Identifier</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"266.0\" x=\"266.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.timestamp\"><title>Time valueset expansion happened</title>timestamp</a> : <a xlink:href=\"datatypes.html#instant\">instant</a> 1..1</text><rect height=\"78.0\" style=\"fill:#f0f8ff;stroke:black;stroke-width:1\" width=\"92.0\" y=\"310.0\" rx=\"4\" filter=\"url(#shadow)\" x=\"260.0\" ry=\"4\"></rect><line style=\"stroke:dimgrey;stroke-width:1\" y1=\"338.0\" y2=\"338.0\" x2=\"352.0\" x1=\"260.0\"></line><text fill=\"black\" class=\"diagram-class-title\" y=\"330.0\" x=\"306.0\">Contains</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"352.0\" x=\"266.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.contains.system\"><title>System value for the code</title>system</a> : <a xlink:href=\"datatypes.html#uri\">uri</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"366.0\" x=\"266.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.contains.code\"><title>Code - if blank, this is not a choosable code</title>code</a> : <a xlink:href=\"datatypes.html#code\">code</a> 0..1</text><text fill=\"black\" class=\"diagram-class-detail\" y=\"380.0\" x=\"266.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.contains.display\"><title>User display for the concept</title>display</a> : <a xlink:href=\"datatypes.html#string\">string</a> 0..1</text><line style=\"stroke:navy;stroke-width:1\" y1=\"371.0\" y2=\"371.0\" x2=\"164.0\" x1=\"104.0\"></line><line style=\"stroke:navy;stroke-width:1\" y1=\"371.0\" y2=\"421.0\" x2=\"164.0\" x1=\"164.0\"></line><line style=\"stroke:navy;stroke-width:1\" y1=\"421.0\" y2=\"421.0\" x2=\"104.0\" x1=\"164.0\"></line><polygon transform=\"rotate(0.0 104.0 371.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"104.0,371.0 110.0,375.0 116.0,371.0 110.0,367.0 104.0,371.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"28.0\" y=\"389.0\" x=\"150.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"399.0\" x=\"164.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.concept.concept\"><title>Child Concepts (is-a / contains)</title>concept</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"417.0\" x=\"119.0\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"308.0\" y2=\"350.0\" x2=\"54.89763779527559\" x1=\"57.54330708661417\"></line><polygon transform=\"rotate(93.60442053917572 57.54330708661417 308.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"57.54330708661417,308.0 63.54330708661417,312.0 69.54330708661416,308.0 63.54330708661417,304.0 57.54330708661417,308.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"28.0\" y=\"322.0\" x=\"42.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"332.0\" x=\"56.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define.concept\"><title>Concepts in the code system</title>concept</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"346.0\" x=\"54.89763779527559\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"189.9999999999999\" y2=\"230.0\" x2=\"64.0344827586207\" x1=\"68.17241379310346\"></line><polygon transform=\"rotate(95.9061411137705 68.17241379310346 189.9999999999999)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"68.17241379310346,189.9999999999999 74.17241379310346,193.9999999999999 80.17241379310346,189.9999999999999 74.17241379310346,185.9999999999999 68.17241379310346,189.9999999999999\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"24.0\" y=\"202.0\" x=\"54.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"212.0\" x=\"66.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.define\"><title>When value set defines its own codes</title>define</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"226.0\" x=\"64.0344827586207\">0..1</text><line style=\"stroke:navy;stroke-width:1\" y1=\"248.0\" y2=\"310.0\" x2=\"553.3142857142857\" x1=\"542.6857142857143\"></line><polygon transform=\"rotate(80.27242144859845 542.6857142857143 248.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"542.6857142857143,248.0 548.6857142857143,252.0 554.6857142857143,248.0 548.6857142857143,244.0 542.6857142857143,248.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"24.0\" y=\"272.0\" x=\"536.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"282.0\" x=\"548.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include.filter\"><title>Select concepts by specify a matching criteria based on the properties (including relationships) defined by the system. If multiple filters are specified, they SHALL all be true</title>filter</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"306.0\" x=\"553.3142857142857\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"90.0\" y2=\"170.0\" x2=\"508.83333333333337\" x1=\"504.3888888888889\"></line><polygon transform=\"rotate(86.82016988013577 504.3888888888889 90.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"504.3888888888889,90.0 510.3888888888889,94.0 516.3888888888889,90.0 510.3888888888889,86.0 504.3888888888889,90.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"28.0\" y=\"123.0\" x=\"492.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"133.0\" x=\"506.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.include\"><title>Include one or more codes from a code system</title>include</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"166.0\" x=\"508.83333333333337\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"90.0\" y2=\"170.0\" x2=\"558.8333333333334\" x1=\"554.3888888888889\"></line><polygon transform=\"rotate(86.82016988013577 554.3888888888889 90.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"554.3888888888889,90.0 560.3888888888889,94.0 566.3888888888889,90.0 560.3888888888889,86.0 554.3888888888889,90.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"28.0\" y=\"137.0\" x=\"542.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"147.0\" x=\"556.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose.exclude\"><title>Exclude one or more codes from the value set</title>exclude</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"166.0\" x=\"558.8333333333334\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"89.8\" y2=\"67.53333333333333\" x2=\"490.0\" x1=\"156.0\"></line><polygon transform=\"rotate(-3.8140748342903548 156.0 89.8)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"156.0,89.8 162.0,93.8 168.0,89.8 162.0,85.8 156.0,89.8\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"28.0\" y=\"71.0\" x=\"309.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"81.0\" x=\"323.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.compose\"><title>When value set includes codes from elsewhere</title>compose</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"63.53333333333333\" x=\"470.0\">0..1</text><line style=\"stroke:navy;stroke-width:1\" y1=\"324.0\" y2=\"324.0\" x2=\"412.0\" x1=\"352.0\"></line><line style=\"stroke:navy;stroke-width:1\" y1=\"324.0\" y2=\"374.0\" x2=\"412.0\" x1=\"412.0\"></line><line style=\"stroke:navy;stroke-width:1\" y1=\"374.0\" y2=\"374.0\" x2=\"352.0\" x1=\"412.0\"></line><polygon transform=\"rotate(0.0 352.0 324.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"352.0,324.0 358.0,328.0 364.0,324.0 358.0,320.0 352.0,324.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"32.0\" y=\"342.0\" x=\"396.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"352.0\" x=\"412.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.contains.contains\"><title>Codes contained in this concept</title>contains</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"370.0\" x=\"367.0\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"274.0\" y2=\"310.0\" x2=\"311.10280373831773\" x1=\"315.8130841121495\"></line><polygon transform=\"rotate(97.45429881274848 315.8130841121495 274.0)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"315.8130841121495,274.0 321.8130841121495,278.0 327.8130841121495,274.0 321.8130841121495,270.0 315.8130841121495,274.0\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"32.0\" y=\"285.0\" x=\"297.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"295.0\" x=\"313.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion.contains\"><title>Codes in the value set</title>contains</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"306.0\" x=\"311.10280373831773\">0..*</text><line style=\"stroke:navy;stroke-width:1\" y1=\"142.38016528925618\" y2=\"210.0\" x2=\"267.31972789115645\" x1=\"156.0\"></line><polygon transform=\"rotate(31.27608657925615 156.0 142.38016528925618)\" style=\"fill:navy;stroke:navy;stroke-width:1\" points=\"156.0,142.38016528925618 162.0,146.38016528925618 168.0,142.38016528925618 162.0,138.38016528925618 156.0,142.38016528925618\"></polygon><rect height=\"18.0\" style=\"fill:white;stroke:black;stroke-width:0\" width=\"36.0\" y=\"169.0\" x=\"193.0\"></rect><text fill=\"black\" class=\"diagram-class-linkage\" y=\"179.0\" x=\"211.0\"><a xlink:href=\"valueset-definitions.html#ValueSet.expansion\"><title>When value set is an expansion</title>expansion</a></text><text fill=\"black\" class=\"diagram-class-linkage\" y=\"206.0\" x=\"267.31972789115645\">0..1</text>\n" +
    "</svg>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/welcome.html',
    "<div class=\"well\">\n" +
    "  <input placeholder=\"search\" class=\"form-control srch\" ng-model=\"search\"/>\n" +
    "</div>\n" +
    "<a href=\"#/vs/{{$index}}\" class=\"srch-res\" ng-repeat=\"entry in vs.entry | vsearch:search\">\n" +
    "  <h4>{{entry.content.name}}</h4>\n" +
    "  <p>\n" +
    "    {{entry.content.description}}\n" +
    "  </p>\n" +
    "  <i class=\"fa fa-chevron-right\"></i>\n" +
    "</a>\n"
  );

}]);
