'use strict'


app = angular.module 'fhirface', [
  'ngCookies',
  'ngAnimate',
  'ngSanitize',
  'ngRoute',
  'ui.codemirror',
  'ng-fhir'
], ($routeProvider) ->
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

app.filter 'vsearch', ()->
  (xs, str)->
    return xs unless str?
    xs.filter (x)->
      cnt = x.content
      cnt.name.toLowerCase().indexOf(str) > -1 && cnt.description.toLowerCase().indexOf(str) > -1


app.provider 'menu', ()->
  $get: ()->
    menu =
      items: []
      build: (items...)=>
        state = 'path'
        menu.items = items
    menu

# todo extract cache
# app.provider 'cache', ()->


app.run ($rootScope, menu, $http)->
  menu.build(
    {url: '/', label: 'Value Sets'}
    {url: '/new', label: 'New', icon: 'add'}
  )

  $rootScope.menu = menu

  vs = window.localStorage.getItem('vs')
  if vs?
    console.log('hit')
    $rootScope.vs = JSON.parse(vs)
  else
    $http(method: 'GET', url: '/valuesets/valuesets.json')
      .success (data)->
        window.localStorage.setItem('vs', JSON.stringify(data))
        $rootScope.vs = data


app.controller 'WelcomeCtrl', (menu, $scope, $http) ->

app.controller 'NewValueSetCtrl', (menu, $scope, $fhir) ->

  cs = [{}]
  $scope.v = {definition: {concept: cs}}
  $scope.addConcept = ()-> cs.push({})


app.controller 'ShowValueSetCtrl', (menu, $routeParams, $scope, $rootScope, $sce) ->
  $scope.trusted = (h)-> $sce.trustAsHtml(h)

  id = parseInt($routeParams.id)
  v = $scope.vs.entry[id]
  delete v.content.text
  $scope.v = v.content


