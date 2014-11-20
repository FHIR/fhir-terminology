require('../../bower_components/angular/angular.js')
require('../../bower_components/angular-route/angular-route.js')
require('../../bower_components/angular-sanitize/angular-sanitize.js')
require('../../bower_components/angular-animate/angular-animate.js')
require('../../bower_components/angular-cookies/angular-cookies.js')
window.CodeMirror = require('codemirror')
require('../../bower_components/angular-ui-codemirror/ui-codemirror.js')
require('firebase')
require('angularfire')

module.exports = angular.module 'app', [
  'ngCookies',
  'ngAnimate',
  'ngSanitize',
  'ngRoute',
  'ui.codemirror',
  'firebase'
]
