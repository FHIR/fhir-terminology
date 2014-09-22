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
