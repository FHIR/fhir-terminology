app = require('./module')
u = require('./utils')
app.controller 'WelcomeCtrl', ($scope, $http, $firebase) ->

fixCodeMirror = ($scope)->
  _editor = null
  $scope.codemirror = (x)-> _editor = x

  $scope.state = 'form'
  $scope.$watch 'state', (st)->
    if st == 'json'
      $scope.$evalAsync ()->
        _editor.refresh()
        _editor.focus()

#TODO
notEmpty = (x)-> x && x != ''

_validate = (pred, [key,er], ers)->
  unless pred
    ers.$error = true
    ers[key] = er

_validateNewVs = (vs)->
  errors = {}
  _validate notEmpty(vs.identifier), ['identifier', 'is required'], errors
  errors


_prepareVs = (v)->
  id: u.sha(v.identifier || v.name)
  content: v

app.controller 'NewValueSetCtrl', ($scope, $firebase, $location) ->
  # hack to fix code mirror
  fixCodeMirror($scope)

  $scope.statuses = ['draft','active','retired']

  $scope.v = {name: 'MyName', version: '0.0.1', status: 'draft'}

  $scope.$watch 'auth.user', (u)->
    $scope.v.publisher = u.displayName if u?

  wtc = ()-> $scope.vjson = angular.toJson($scope.v, true)

  $scope.$watch 'v', wtc, true

  cs ={concept: [{}]}
  $scope.addDefinition = ()-> $scope.v.definition = cs
  $scope.rmDefinition = ()-> $scope.v.definition = null

  $scope.addConcept = ()-> cs.concept.push({})
  $scope.rmConcept = (c)-> cs.concept = u.rm(c, cs.concept)


  cmp = {include: [{code: []}]}
  $scope.addCompose = ()-> $scope.v.compose = cmp
  $scope.rmCompose = ()-> $scope.v.compose = null
  $scope.addCode = ()-> cmp.include[0].code.push({})

  mkchan = (url)-> $firebase(new Firebase(url))
  valuesets = mkchan("https://fhir-terminology.firebaseio.com/valuesets")
  valuesetList = mkchan("https://fhir-terminology.firebaseio.com/valuesetList")

  _save = (v)->
    u = $scope.auth.user
    if u
      user = {author: u.displayName, avatar: u.thirdPartyUserData.avatar_url}

    valuesets.$set(v.id, v)
    valuesetList.$push
      id: v.id
      name: v.content.name
      desc: v.content.description
      user: user

    $location.path("/vs/#{v.id}")

  $scope.save = ()->
    v = $scope.v
    errors = _validateNewVs(v)
    if errors.$error
      $scope.errors = errors
    else
      $scope.errors = null
      _save(_prepareVs(v))

app.controller 'ShowValueSetCtrl', ($routeParams, $scope, $rootScope, $firebase) ->
  id = $routeParams.id
  url = "https://fhir-terminology.firebaseio.com/valuesets/#{id}"
  fbr = new Firebase(url)
  vChan = $firebase(fbr)
  valueset = vChan.$asObject()
  valueset.$bindTo($scope, "valueset")
