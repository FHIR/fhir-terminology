angular.module('fhirface').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/src/views/404.html',
    "<h1>Page not found</h1>\n"
  );


  $templateCache.put('/src/views/batch.html',
    "<h1>Batch</h1>\n" +
    "\n" +
    "<a ng-click=\"batch()\" class=\"btn btn-default\">Batch</a>\n"
  );


  $templateCache.put('/src/views/valuesets/_form.html',
    "<div ng-if=\"errors\" class=\"form-group\">\n" +
    "  <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "    <div class=\"alert alert-danger\">\n" +
    "      <ul>\n" +
    "        <li ng-repeat=\"(f,e) in errors\">\n" +
    "        <b>{{f}}</b> {{e}}\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-include src=\"'/src/views/valuesets/_form_info.html'\"></div>\n" +
    "<hr/>\n" +
    "<div ng-include src=\"'/src/views/valuesets/_form_definition.html'\"></div>\n" +
    "<hr/>\n" +
    "<div ng-include src=\"'/src/views/valuesets/_form_compose.html'\"></div>\n" +
    "<hr/>\n"
  );


  $templateCache.put('/src/views/valuesets/_form_compose.html',
    "<a ng-if=\"!entry.content.compose\" class=\"btn btn-default\" ng-click=\"entry.content.$addCompose()\">\n" +
    "  Add Compose\n" +
    "</a>\n" +
    "<div ng-if=\"entry.content.compose\">\n" +
    "  <h3>Compose: <a class=\"btn btn-danger\" ng-click=\"entry.content.$rmCompose()\">remove</a></h3>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">import</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"entry.content.compose.import\" placeholder=\"url\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <hr/>\n" +
    "\n" +
    "  <h4>..Includes:\n" +
    "    <a ng-click=\"entry.content.compose.$addInclude()\"\n" +
    "      class=\"btn btn-default\">Add include</a>\n" +
    "  </h4>\n" +
    "  <div class=\"form-group\" ng-repeat=\"conceptSet in entry.content.compose.include\">\n" +
    "    <div class=\"col-sm-11 col-sm-offset-1\">\n" +
    "      <h4>....Include:\n" +
    "        <a class=\"btn btn-danger\" ng-click=\"entry.content.compose.$rmInclude(conceptSet)\">remove</a>\n" +
    "      </h4>\n" +
    "      <div ng-include src=\"'/src/views/valuesets/_form_concept_set.html'\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr/>\n" +
    "  <h4>..Excludes:\n" +
    "    <a ng-click=\"entry.content.compose.$addExclude()\"\n" +
    "      class=\"btn btn-default\">Add exclude</a>\n" +
    "  </h4>\n" +
    "  <div class=\"form-group\" ng-repeat=\"conceptSet in entry.content.compose.exclude\">\n" +
    "    <div class=\"col-sm-11 col-sm-offset-1\">\n" +
    "      <h4>....Exclude:\n" +
    "        <a class=\"btn btn-danger\" ng-click=\"entry.content.compose.$rmExclude(conceptSet)\">remove</a>\n" +
    "      </h4>\n" +
    "      <div ng-include src=\"'/src/views/valuesets/_form_concept_set.html'\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_form_concept_set.html',
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-sm-2 control-label\">system</label>\n" +
    "  <div class=\"col-sm-10\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "    ng-model=\"conceptSet.system\" placeholder=\"system\"/>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-sm-2 control-label\">version</label>\n" +
    "  <div class=\"col-sm-10\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "    ng-model=\"conceptSet.version\" placeholder=\"version\"/>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr/>\n" +
    "<div class=\"form-group\" ng-repeat=\"code in conceptSet.code track by $index\">\n" +
    "  <label class=\"col-sm-2 control-label\">code</label>\n" +
    "  <div class=\"col-sm-5\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "      placeholder=\"code\" ng-model=\"conceptSet.code[$index]\"/>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-1\">\n" +
    "    <a ng-click=\"conceptSet.$rmCode(code)\" class=\"btn btn-danger col-sm-12\"> × </a>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <div class=\"col-sm-10 col-sm-offset-2\">\n" +
    "    <a ng-click=\"conceptSet.$addCode()\" class=\"col-sm-12 btn btn-default\">Add Code</a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_form_definition.html',
    "<a ng-if=\"!entry.content.define\" class=\"btn btn-default\" ng-click=\"entry.content.$addDefine()\">\n" +
    "  Add Definition\n" +
    "</a>\n" +
    "<div ng-if=\"entry.content.define\">\n" +
    "  <h3>\n" +
    "    Definition\n" +
    "    <a class=\"btn btn-danger\" ng-click=\"entry.content.$rmDefine()\">remove</a>\n" +
    "  </h3>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">system</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\"\n" +
    "      ng-model=\"entry.content.define.system\" placeholder=\"system\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">version</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\"\n" +
    "      ng-model=\"entry.content.define.version\" placeholder=\"version\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">caseSensitive</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <div class=\"col-sm-1 checkbox\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"entry.content.define.caseSensitive\"/>\n" +
    "          CaseSensitive\n" +
    "        </label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <hr/>\n" +
    "  <div class=\"form-group\" ng-repeat=\"concept in entry.content.define.concept\">\n" +
    "    <div class=\"col-sm-1 checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" ng-model=\"concept.abstract\"/>\n" +
    "        Abstract\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-2\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"code\" ng-model=\"concept.code\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-4\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"definition\" ng-model=\"concept.definition\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-4\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"display\" ng-model=\"concept.display\">\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-1\">\n" +
    "      <a ng-click=\"entry.content.define.$rmConcept(concept)\" class=\"btn btn-danger col-sm-12\"> × </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <a ng-click=\"entry.content.define.$addConcept()\" class=\"col-sm-12 btn btn-default\">Add Concept</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_form_info.html',
    "<div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">name</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input name=\"name\" require type=\"text\" class=\"form-control\" ng-model=\"entry.content.name\" placeholder=\"name\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">identifier</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" placeholder=\"id\" ng-model=\"entry.content.identifier\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">version</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"entry.content.version\" placeholder=\"version\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">publisher</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input type=\"text\" class=\"form-control\" ng-model=\"entry.content.publisher\" placeholder=\"publisher\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">description</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <textarea type=\"text\" class=\"form-control\" ng-model=\"entry.content.description\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"col-sm-2 control-label\">status</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <select ng-options=\"l as l for l in entry.content.$statuses\" ng-model=\"entry.content.status\" placeholder=\"status\" class=\"form-control\"> </select>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!-- <telecom><1!-- 0..* Contact Contact information of the publisher § --1></telecom> -->\n" +
    "  <!-- <copyright value=\"[string]\"/><1!-- 0..1 About the value set or its content --1> -->\n" +
    "  <!-- <experimental value=\"[boolean]\"/><1!-- 0..1 If for testing purposes, not real usage § --1> -->\n" +
    "  <!--  <extensible value=\"[boolean]\"/><1!-- 0..1 Whether this is intended to be used with an extensible binding --1> -->\n" +
    "  <!-- <date value=\"[dateTime]\"/><1!-- 0..1 Date for given status § --1> -->\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/_header.html',
    "<span>\n" +
    "  <img title=\"{{entry.user.name}}\"\n" +
    "       class=\"avatar\" ng-src=\"{{(entry.user && entry.user.avatar) || 'http://www.hl7.org/implement/standards/fhir/v0.08/flame128.png'}}\"/>\n" +
    "  {{item | json}}\n" +
    "  {{entry.content.name}}\n" +
    "  <a class=\"btn btn-default\">\n" +
    "    <b>v:</b> {{entry.content.version}}\n" +
    "    <span class=\"badge\">{{entry.content.status}}</span>\n" +
    "    <span ng-if=\"entry.content.experimental\" class=\"badge\">experimental</span>\n" +
    "  </a>\n" +
    "  <small>{{entry.content.date | date}}</small>\n" +
    "</span>\n"
  );


  $templateCache.put('/src/views/valuesets/_info.html',
    "<div class=\"well\">\n" +
    "  <input class=\"form-controll srch\" ng-model=\"searchConcept\"/>\n" +
    "</div>\n" +
    "<div ng-if=\"entry.content.define\">\n" +
    "  <h3>.definition ({{entry.content.define.concept.length}} concepts)</h3>\n" +
    "  <table class=\"table\">\n" +
    "    <thead>\n" +
    "      <th>code</th>\n" +
    "      <th>display</th>\n" +
    "      <th>definition</th>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"d in entry.content.define.concept | csearch:searchConcept | limitTo: 20\">\n" +
    "      <th>{{d.code}}</th>\n" +
    "      <td>{{d.display}}</td>\n" +
    "      <td>{{d.definition}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "  <h3>{{entry.content.define.concept | countMore:20 }}</h3>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"entry.content.compose\">\n" +
    "  <div ng-repeat=\"inc in entry.content.compose.include\">\n" +
    "    <h2>Include: {{inc.system}} (entry.content {{inc.version}})</h2>\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"c in inc.code track by $index\"> {{c}} </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"entry.content.expansion\">\n" +
    "  <h1>.expansion</h1>\n" +
    "  <pre>{{entry.content.expansion}}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/index.html',
    "<div class=\"well\">\n" +
    "  <input placeholder=\"search by prefixes\" class=\"form-control srch\" ng-model=\"search\"/>\n" +
    "</div>\n" +
    "<a href=\"#/vs/{{entry.id}}\" class=\"srch-res\" ng-repeat=\"entry in valuesets | vsearch:search | limitTo:30\">\n" +
    "  <h4>\n" +
    "    <img title=\"{{entry.user.name}}\"\n" +
    "         class=\"avatar\" ng-src=\"{{(entry.user && entry.user.avatar) || 'http://www.hl7.org/implement/standards/fhir/v0.08/flame128.png'}}\"/>\n" +
    "    {{entry.title}}\n" +
    "  </h4>\n" +
    "  <p>\n" +
    "    {{entry.summary}}\n" +
    "  </p>\n" +
    "  <i class=\"fa fa-chevron-right\"></i>\n" +
    "</a>\n"
  );


  $templateCache.put('/src/views/valuesets/new.html',
    "<h2 ng-init=\"state='form'\">ValueSet\n" +
    "  <div class=\"btn-group pull-right\">\n" +
    "    <a class=\"btn btn-default\" switcher=\"state\" swvalue=\"form\">form</a>\n" +
    "    <a class=\"btn btn-default\" switcher=\"state\" swvalue=\"json\">json</a>\n" +
    "  </div>\n" +
    "</h2>\n" +
    "\n" +
    "<hr/>\n" +
    "\n" +
    "<div ng-show=\"state=='form'\">\n" +
    "  <form class=\"form-horizontal\" role=\"form\" ng-submit=\"save()\">\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_form.html'\"></div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <button type=\"submit\" class=\"col-sm-12 btn btn-success\"> Save </button>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-6\">\n" +
    "        <a href=\"#/\" class=\"col-sm-12 btn btn-default\"> Cancel </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"state=='json'\">\n" +
    "  <ui-codemirror\n" +
    "    style=\"min-height: 1000px;\"\n" +
    "    ui-codemirror-opts=\"{mode: 'javascript', lineWrapping: true, lineNumbers: true, json: true, onLoad : codemirror}\"\n" +
    "    ui-refresh=\"state=='json'\"\n" +
    "    ng-model='json'>\n" +
    "  </ui-codemirror>\n" +
    "</div>\n"
  );


  $templateCache.put('/src/views/valuesets/show.html',
    "<div ng-init=\"state ='info'\">\n" +
    "  <h1>\n" +
    "    <span ng-include src=\"'/src/views/valuesets/_header.html'\"></span>\n" +
    "    <div class=\"btn-group pull-right\">\n" +
    "      <a class=\"btn btn-default\" switcher=\"state\" swvalue='info' >info</a>\n" +
    "      <a class=\"btn btn-default\" switcher=\"state\" swvalue='form'>edit</a>\n" +
    "      <a class=\"btn btn-default\" switcher=\"state\" swvalue='json'>json</a>\n" +
    "    </div>\n" +
    "  </h1>\n" +
    "  <hr/>\n" +
    "  <div ng-show=\"state=='info'\">\n" +
    "    <p><b>id:</b> {{entry.content.identifier}}</p>\n" +
    "    <p><b>publisher:</b> {{entry.content.publisher}}</p>\n" +
    "\n" +
    "    <p ng-repeat=\"tel in entry.content.telecom\">\n" +
    "    <b>telecom:</b> {{tel.system}}: {{tel.value}}</p>\n" +
    "    </p>\n" +
    "    <p>{{entry.content.description}}</p>\n" +
    "    <div ng-include src=\"'/src/views/valuesets/_info.html'\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"state=='form'\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\" ng-submit=\"save()\">\n" +
    "      <div ng-if=\"errors\" class=\"form-group\">\n" +
    "        <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "          <div class=\"alert alert-danger\">\n" +
    "            <ul>\n" +
    "              <li ng-repeat=\"(f,e) in errors\">\n" +
    "              <b>{{f}}</b> {{e}}\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ng-include src=\"'/src/views/valuesets/_form_info.html'\"></div>\n" +
    "      <hr/>\n" +
    "      <div ng-include src=\"'/src/views/valuesets/_form_definition.html'\"></div>\n" +
    "      <hr/>\n" +
    "      <div ng-include src=\"'/src/views/valuesets/_form_compose.html'\"></div>\n" +
    "      <hr/>\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <button type=\"submit\" class=\"col-sm-12 btn btn-success\"> Save </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <a class=\"col-sm-12 btn btn-danger\" ng-click=\"remove()\">Remove</a>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "          <a href=\"#/\" class=\"col-sm-12 btn btn-default\"> Cancel </a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"state == 'json'\">\n" +
    "    <div ng-if=\"parseError\" class=\"alert alert-danger\">\n" +
    "      {{parseError}}\n" +
    "    </div>\n" +
    "    <ui-codemirror\n" +
    "    style=\"min-height: 1000px;\"\n" +
    "    ui-codemirror-opts=\"{mode: 'javascript', lineWrapping: true, lineNumbers: true, json: true, onLoad : codemirror}\"\n" +
    "    ui-refresh=\"state=='json'\"\n" +
    "    ng-model='json'>\n" +
    "    </ui-codemirror>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
