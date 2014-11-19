app = require('./module')

require('file?name=index.html!../index.html')
require('file?name=fhir.json!../fhir.json')
require('../less/app.less')

require('./filters')
require('./directives')
sitemap = require('./sitemap')
require('./data')
u = require('./utils')

app.config ($routeProvider) ->
  $routeProvider
    .when '/',
      templateUrl: '/src/views/valuesets/index.html'
      name: 'root'
      controller: 'WelcomeCtrl'
    .when '/vs/:id',
      templateUrl: '/src/views/valuesets/show.html'
      controller: 'ShowValueSetCtrl'
    .when '/vs/:id/edit',
      templateUrl: '/src/views/valuesets/edit.html'
      controller: 'EditValueSetCtrl'
    .when '/new',
      templateUrl: '/src/views/valuesets/new.html'
      name: 'new'
      controller: 'NewValueSetCtrl'
    .when '/batch',
      templateUrl: '/src/views/batch.html'
      controller: 'BatchCtrl'
    .otherwise
      templateUrl: '/src/view/404.html'

activate = (name)->
  sitemap.main.forEach (x)->
    if x.name == name
      x.active = true
    else
      delete x.active

app.run ($q, $rootScope, auth, valuesetRepo)->
  $rootScope.sitemap = sitemap

  $rootScope.auth = auth
  $rootScope.valuesets = valuesetRepo.$list()
  $rootScope.batch = ()->
    valuesetRepo.$batch()

  $rootScope.$on  "$routeChangeStart", (event, next, current)->
    activate(next.name)

app.controller 'WelcomeCtrl', ($scope, $http, $firebase) ->

mkSave = ($scope, valuesetRepo, cb)->
  ()->
    user = $scope.auth.user
    entry = $scope.entry
    errors = entry.$validate()

    unless user?
      errors.$error = true
      errors.user = "Please login"
    else
      entry.user =
        author: user.name
        avatar: user.avatar_url

    if errors.$error
      $scope.errors = errors
    else
      delete $scope.errors
      entry = valuesetRepo.$save(entry)
      cb(entry)

app.controller 'NewValueSetCtrl', ($scope, $firebase, $location, valuesetRepo) ->
  u.fixCodeMirror($scope)

  $scope.entry = valuesetRepo.$build()

  syncJson = (x)->
    $scope.json = x.content.$toJson()

  $scope.$watch 'entry', syncJson, true

  $scope.save = mkSave $scope, valuesetRepo, (entry)->
    $location.path("/vs/#{entry.id}")

app.controller 'ShowValueSetCtrl', ($routeParams, $scope, valueset, valuesetRepo, $location) ->
  $scope.state = 'info'
  id = $routeParams.id
  u.fixCodeMirror($scope)

  id = $routeParams.id
  valueset($scope, 'valuesetOrig', id)

  inited = null
  $scope.$watch 'valuesetOrig', (v)->
    return if !v? || inited
    inited = true
    $scope.entry = valuesetRepo.$build(v)

  syncJson = (x)->
    if x && x.content
      $scope.json = x.content.$toJson()

  $scope.$watch 'entry', syncJson, true

  $scope.$watch 'json', (x)->
    return unless x?
    entry = angular.copy($scope.entry)
    try
      entry.content = angular.fromJson(x)
      delete $scope.parseError
      $scope.entry = valuesetRepo.$build(entry)
    catch e
      $scope.parseError = e.toString()

  $scope.save = mkSave $scope, valuesetRepo, ()->
    $scope.state = 'info'

  $scope.remove = ()->
    valuesetRepo.$remove(id)
    $location.path("/")


app.controller 'BatchCtrl', ($scope, valuesetRepo, $location) ->
  $scope.batch = valuesetRepo.$batch
