app = require('./module')
u = require('./utils')
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

  $scope.v = {}

  cs ={concept: [{}]}
  $scope.addDefinition = ()->
    $scope.v.definition = cs

  $scope.rmDefinition = ()->
    $scope.v.definition = null

  $scope.addConcept = ()-> cs.concept.push({})
  $scope.rmConcept = (c)-> cs.concept = u.rm(c, cs.concept)

  $scope.statuses = ['draft','active','retired']

  cmp = {include: [{code: []}]}
  $scope.addCompose = ()->
    $scope.v.compose = cmp

  $scope.rmCompose = ()->
    $scope.v.compose = null

  $scope.addCode = ()->
    cmp.include[0].code.push({})

  wtc = ()->
    $scope.vjson = angular.toJson($scope.v, true)
  $scope.$watch 'v', wtc, true


preProcessEntry = (e)->
  delete e.content.text
  e.content

app.controller 'ShowValueSetCtrl', (menu, $routeParams, $scope, $rootScope) ->
  id = parseInt($routeParams.id)
  $scope.v = preProcessEntry($scope.vs.entry[id])
