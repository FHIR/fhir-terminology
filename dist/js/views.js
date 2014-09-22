angular.module('fhirface').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/views/valuesets/new.html',
    "<form class=\"form-horizontal\" role=\"form\">\n" +
    "  <h3>ValueSet</h3>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">name</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"v.name\" placeholder=\"name\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">identifier</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"id\" ng-model=\"v.identifier\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <h3>definition.concept</h3>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\" ng-repeat=\"i in v.definition.concept\">\n" +
    "    <div class=\"col-sm-2\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"code\" ng-model=\"i.code\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"description\" ng-model=\"i.description\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\">\n" +
    "    <button type=\"submit\" ng-click=\"addConcept(i)\" class=\"btn btn-default pull-right\">Add</button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "<pre>\n" +
    "{{v | json}}\n" +
    "</pre>\n" +
    "\n" +
    "\n"
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
