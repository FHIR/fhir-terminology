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
    .otherwise
      redirectTo: '/'

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


app.controller 'NewValueSetCtrl', ($scope, $firebase, $location, valuesetRepo) ->
  # hack to fix code mirror
  u.fixCodeMirror($scope)

  # $scope.v.publisher = u.displayName if u?

  $scope.valueset = valuesetRepo.$build()
  $scope.$watch 'valueset', ((x)-> $scope.vjson = x.$toJson()), true


  $scope.save = ()->
    user = $scope.auth.auth.user
    vs = $scope.valueset
    errors = vs.$validate()

    unless user?
      errors.$error = true
      errors.user = "Please login"

    if errors.$error
      $scope.errors = errors
    else
      delete $scope.errors
      entry = vs.$toEntry()
      console.log(entry)
      valuesetRepo.$create(entry, user)
      $location.path("/vs/#{entry.id}")

app.controller 'ShowValueSetCtrl', ($routeParams, $scope, valueset, valuesetRepo, $location) ->
  id = $routeParams.id
  valueset($scope, 'valueset', id)

  valuesetRepo.$bindListItem(id, $scope, 'entry')

  $scope.remove = ()->
    valuesetRepo.$remove(id)
    $location.path("/")

app.controller 'EditValueSetCtrl', ($routeParams, $scope, valueset, valuesetRepo, $location) ->
  id = $routeParams.id
  valueset($scope, 'valuesetOrig', id)
  item = null
  $scope.$watch 'valuesetOrig', (v)->
    return if !v? || inited
    inited = v
    $scope.valueset = valuesetRepo.$build(v.content)
