u = require('./utils')

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

app.filter 'csearch', u.mkfilter('code', 'display', 'definition')

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
cache = (d, key, missCb)->
  st = window.localStorage
  val = st.getItem(key)
  if val
    d.resolve(JSON.parse(val))
  else
    missCb (newval)->
      st.setItem(key, JSON.stringify(newval))
      p.resolve(newval)
  d.promise

cacheUrl = (d, key, url)->
  cache d, key, (save)->
    $http(method: 'GET', url: url, success: save).success(save)

app.run ($q, $rootScope, menu, $http)->
  menu.build(
    {url: '/', label: 'Value Sets'}
    {url: '/new', label: 'New', icon: 'add'}
  )

  $rootScope.menu = menu

  cacheUrl($q.defer(), 'vs','valuesets/valuesets.json')
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


app.controller 'ShowValueSetCtrl', (menu, $routeParams, $scope, $rootScope, $sce) ->
  $scope.trusted = (h)-> $sce.trustAsHtml(h)

  id = parseInt($routeParams.id)
  v = $scope.vs.entry[id]
  delete v.content.text
  $scope.v = v.content
