angular.module('fhirface').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/views/valuesets/_compose_form.html',
    "<a ng-if=\"!v.compose\" class=\"btn btn-default\" ng-click=\"addCompose()\">\n" +
    "  Add Compose\n" +
    "</a>\n" +
    "<div ng-if=\"v.compose\">\n" +
    "  <div ng-repeat=\"inc in v.compose.include\">\n" +
    "    <h3>Definition <a class=\"btn btn-danger\" ng-click=\"rmCompose()\">remove</a></h3>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">system</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "        ng-model=\"inc.system\" placeholder=\"system\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">version</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\"\n" +
    "        ng-model=\"inc.version\" placeholder=\"version\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <hr/>\n" +
    "    <div class=\"form-group\" ng-repeat=\"i in inc.code\">\n" +
    "      <label class=\"col-sm-2 control-label\">code</label>\n" +
    "      <div class=\"col-sm-2\">\n" +
    "        <input type=\"text\"\n" +
    "        class=\"form-control\"\n" +
    "        placeholder=\"code\"\n" +
    "        ng-model=\"i.code\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-12\">\n" +
    "        <a ng-click=\"addCode()\" class=\"col-sm-12 btn btn-default\">Add Code</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_definition_form.html',
    "<a ng-if=\"!v.definition.concept\" class=\"btn btn-default\" ng-click=\"addDefinition()\">\n" +
    "  Add Definition\n" +
    "</a>\n" +
    "<div ng-if=\"v.definition.concept\">\n" +
    "  <h3>\n" +
    "    Definition\n" +
    "    <a class=\"btn btn-danger\" ng-click=\"rmDefinition()\">remove</a>\n" +
    "  </h3>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">system</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\"\n" +
    "      ng-model=\"v.definition.system\" placeholder=\"system\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">version</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\"\n" +
    "      ng-model=\"v.definition.version\" placeholder=\"version\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">version</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <div class=\"col-sm-1 checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"v.definition.caseSensitive\"/>\n" +
    "          Case Sensitive\n" +
    "        </label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\" ng-repeat=\"i in v.definition.concept\">\n" +
    "    <div class=\"col-sm-1 checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" ng-model=\"i.abstract\"/>\n" +
    "        Abstract\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-2\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"code\" ng-model=\"i.code\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-4\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"definition\" ng-model=\"i.definition\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-4\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"display\" ng-model=\"i.display\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-1\">\n" +
    "      <a ng-click=\"rmConcept(i)\" class=\"btn btn-danger col-sm-12\"> × </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <a ng-click=\"addConcept()\" class=\"col-sm-12 btn btn-default\">Add Concept</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_header.html',
    "<h1>\n" +
    "  {{valueset.content.name}}\n" +
    "  <a class=\"btn btn-default\">\n" +
    "    <b>v:</b> {{v.version}}\n" +
    "    <span class=\"badge\">{{valueset.content.status}}</span>\n" +
    "    <span ng-if=\"valueset.content.experimental\" class=\"badge\">experimental</span>\n" +
    "  </a>\n" +
    "  <small>{{valueset.content.date | date}}</small>\n" +
    "  <div class=\"btn-group pull-right\">\n" +
    "    <a class=\"btn btn-default\" switcher=\"vm.state\" swvalue='info' >info</a>\n" +
    "    <a class=\"btn btn-default\" switcher=\"vm.state\" swvalue='json'>json</a>\n" +
    "  </div>\n" +
    "</h1>\n" +
    "<hr/>\n" +
    "<p><b>id:</b> {{valueset.content.identifier}}</p>\n" +
    "<p><b>publisher:</b> {{valueset.content.publisher}}</p>\n" +
    "\n" +
    "<p ng-repeat=\"tel in valueset.content.telecom\">\n" +
    "<b>telecom:</b> {{tel.system}}: {{tel.value}}</p>\n" +
    "</p>\n" +
    "<p>{{valueset.content.description}}</p>\n" +
    "\n" +
    "<hr/>\n"
  );


  $templateCache.put('/src/views/valuesets/_info.html',
    "<div class=\"well\">\n" +
    "  <input class=\"form-controll srch\" ng-model=\"searchConcept\"/>\n" +
    "</div>\n" +
    "<div ng-if=\"valueset.content.define\">\n" +
    "  <h3>.definition ({{valueset.content.define.concept.length}} concepts)</h3>\n" +
    "  <table class=\"table\">\n" +
    "    <thead>\n" +
    "      <th>code</th>\n" +
    "      <th>display</th>\n" +
    "      <th>definition</th>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"d in valueset.content.define.concept | csearch:searchConcept | limitTo: 20\">\n" +
    "      <th>{{d.code}}</th>\n" +
    "      <td>{{d.display}}</td>\n" +
    "      <td>{{d.definition}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "  <h3>{{valueset.content.define.concept.length - 20}} more</h3>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"valueset.content.compose\">\n" +
    "  <div ng-repeat=\"inc in valueset.content.compose.include\">\n" +
    "    <h2>Include: {{inc.system}} (valueset.content {{inc.version}})</h2>\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"c in inc.code\"> {{c}} </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"valueset.content.expansion\">\n" +
    "  <h1>.expansion</h1>\n" +
    "  <pre>{{valueset.content.expansion}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_info_form.html',
    "<div>\n" +
    "  <div ng-if=\"errors\" class=\"form-group\">\n" +
    "    <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "      <div class=\"alert alert-danger\">\n" +
    "        <ul>\n" +
    "          <li ng-repeat=\"(f,e) in errors\">\n" +
    "          <b>{{f}}</b> {{e}}\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">name</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input name=\"name\" require type=\"text\" class=\"form-control\" ng-model=\"v.name\" placeholder=\"name\"/>\n" +
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
    "</div>\n"
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
    "  <form class=\"form-horizontal\" role=\"form\" ng-submit=\"save()\">\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_info_form.html'\"></div>\n" +
    "    <hr/>\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_definition_form.html'\"></div>\n" +
    "    <hr/>\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_compose_form.html'\"></div>\n" +
    "    <hr/>\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <button type=\"submit\" class=\"col-sm-12 btn btn-success\">\n" +
    "          Save\n" +
    "        </button>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <a href=\"#/\" class=\"col-sm-12 btn btn-default\">\n" +
    "          Cancel\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"state=='json'\">\n" +
    "  <ui-codemirror\n" +
    "  style=\"min-height: 1000px;\"\n" +
    "  ui-codemirror-opts=\"{mode: 'javascript', lineWrapping: true, lineNumbers: true, json: true, onLoad : codemirror}\"\n" +
    "  ui-refresh=\"state=='json'\"\n" +
    "  ng-model='vjson'>\n" +
    "  </ui-codemirror>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/show.html',
    "<div ng-switch=\"vm.state\" ng-init=\"vm = {state:'info'}\">\n" +
    "  <div ng-include src=\"'/src/views/valuesets/_header.html'\"></div>\n" +
    "  <div ng-switch-when=\"info\">\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_info.html'\"></div>\n" +
    "  </div>\n" +
    "  <div ng-switch-when=\"json\">\n" +
    "    <pre> {{valueset | json }} </pre>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/welcome.html',
    "<div class=\"well\">\n" +
    "  <input placeholder=\"search by prefixes\" class=\"form-control srch\" ng-model=\"search\"/>\n" +
    "</div>\n" +
    "<a href=\"#/vs/{{entry.id}}\" class=\"srch-res\" ng-repeat=\"entry in valuesets | vsearch:search | limitTo:30\">\n" +
    "  <h4>\n" +
    "    <img title=\"{{entry.user.name}}\"\n" +
    "         class=\"avatar\" ng-src=\"{{(entry.user && entry.user.avatar) || 'http://www.hl7.org/implement/standards/fhir/v0.08/flame128.png'}}\"/>\n" +
    "    {{entry.name}}\n" +
    "  </h4>\n" +
    "  <p>\n" +
    "    {{entry.desc}}\n" +
    "  </p>\n" +
    "  <i class=\"fa fa-chevron-right\"></i>\n" +
    "</a>\n"
  );

}]);
