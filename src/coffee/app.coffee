u = require('./utils')

app = require('./module')
require('./filters')
require('./services')
require('./directives')

app.config ($routeProvider) ->
  $routeProvider
    .when '/',
      templateUrl: '/src/views/welcome.html'
      controller: 'WelcomeCtrl'
    .when '/vs/:id',
      templateUrl: '/src/views/valuesets/show.html'
      controller: 'ShowValueSetCtrl'
    .when '/new',
      templateUrl: '/src/views/valuesets/new.html'
      controller: 'NewValueSetCtrl'
    .otherwise
      redirectTo: '/'

app.run ($q, $rootScope, menu, cache, $http)->
  menu.build(
    {url: '/', label: 'Value Sets'}
    {url: '/new', label: 'New', icon: 'add'}
  )

  $rootScope.menu = menu

  cache('vs','valuesets/valuesets.json')
    .then (v)-> $rootScope.vs = v

app.controller 'WelcomeCtrl', (menu, $scope, $http) ->

app.controller 'NewValueSetCtrl', (menu, $scope, $fhir) ->
  # hack to fix code mirror
  _editor = null
  $scope.codemirror = (x)-> _editor = x

  $scope.state = 'form'
  $scope.$watch 'state', (st)->
    if st == 'json'
      $scope.$evalAsync ()->
        _editor.refresh()
        _editor.focus()

  cs ={concept: [{}]}
  $scope.v = {definition: cs}
  $scope.addConcept = ()-> cs.concept.push({})
  $scope.rmConcept = (c)-> cs.concept = u.rm(c, cs.concept)

  $scope.statuses = ['draft','active','retired']

  wtc = ()->
    $scope.vjson = angular.toJson($scope.v, true)
  $scope.$watch 'v', wtc, true


preProcessEntry = (e)->
  delete e.content.text
  e.content

app.controller 'ShowValueSetCtrl', (menu, $routeParams, $scope, $rootScope) ->
  id = parseInt($routeParams.id)
  $scope.v = preProcessEntry($scope.vs.entry[id])
