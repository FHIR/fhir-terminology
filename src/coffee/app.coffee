app = require('./module')
require('./filters')
require('./services')
require('./directives')
require('./data')
u = require('./utils')

app.config ($routeProvider) ->
  $routeProvider
    .when '/',
      templateUrl: '/src/views/valuesets/index.html'
      controller: 'WelcomeCtrl'
    .when '/vs/:id',
      templateUrl: '/src/views/valuesets/show.html'
      controller: 'ShowValueSetCtrl'
    .when '/vs/:id/edit',
      templateUrl: '/src/views/valuesets/edit.html'
      controller: 'EditValueSetCtrl'
    .when '/new',
      templateUrl: '/src/views/valuesets/new.html'
      controller: 'NewValueSetCtrl'
    .when '/batch',
      templateUrl: '/src/views/batch.html'
      controller: 'BatchCtrl'
    .otherwise
      templateUrl: '/src/view/404.html'

app.run ($q, $rootScope, menu, auth, valuesetRepo)->
  $rootScope.menu = menu.build(
    {url: '/', label: 'Value Sets'}
    {url: '/new', label: 'New', icon: 'add'}
  )

  $rootScope.auth = auth
  $rootScope.valuesets = valuesetRepo.$list()
  $rootScope.batch = ()->
    valuesetRepo.$batch()

app.controller 'WelcomeCtrl', ($scope, $http, $firebase) ->

mkSave = ($scope, valuesetRepo, $location)->
  ()->
    user = $scope.auth.auth.user
    entry = $scope.entry
    errors = entry.$validate()

    unless user?
      errors.$error = true
      errors.user = "Please login"
    else
      entry.user =
        author: user.displayName
        avatar: user.thirdPartyUserData.avatar_url

    if errors.$error
      $scope.errors = errors
    else
      delete $scope.errors
      entry = valuesetRepo.$save(entry)
      $location.path("/vs/#{entry.id}")

app.controller 'NewValueSetCtrl', ($scope, $firebase, $location, valuesetRepo) ->
  u.fixCodeMirror($scope)

  $scope.entry = valuesetRepo.$build()

  syncJson = (x)->
    $scope.json = x.content.$toJson()

  $scope.$watch 'entry', syncJson, true

  $scope.save = mkSave($scope, valuesetRepo, $location)

app.controller 'ShowValueSetCtrl', ($routeParams, $scope, valueset, valuesetRepo, $location) ->
  id = $routeParams.id
  valueset($scope, 'entry', id)

  $scope.remove = ()->
    valuesetRepo.$remove(id)
    $location.path("/")

app.controller 'EditValueSetCtrl', ($routeParams, $scope, valueset, valuesetRepo, $location) ->
  u.fixCodeMirror($scope)

  id = $routeParams.id
  valueset($scope, 'valuesetOrig', id)

  inited = null
  $scope.$watch 'valuesetOrig', (v)->
    return if !v? || inited
    inited = true
    $scope.entry = valuesetRepo.$build(v)

  syncJson = (x)->
    $scope.json = x.content.$toJson()

  $scope.$watch 'entry', syncJson, true

  $scope.save = mkSave($scope, valuesetRepo, $location)

app.controller 'BatchCtrl', ($scope, valuesetRepo, $location) ->
  $scope.batch = valuesetRepo.$batch
