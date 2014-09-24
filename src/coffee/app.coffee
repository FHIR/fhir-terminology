app = require('./module')
require('./filters')
require('./services')
require('./directives')
require('./controllers')

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
