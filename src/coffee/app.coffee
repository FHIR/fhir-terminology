app = require('./module')
require('./filters')
require('./services')
require('./directives')
require('./controllers')
sha = require('jssha')

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

app.run ($q, $rootScope, menu, cache, $http, $firebase, $firebaseSimpleLogin)->
  $rootScope.menu = menu.build(
    {url: '/', label: 'Value Sets'}
    {url: '/new', label: 'New', icon: 'add'}
  )



  fbr = new Firebase('https://fhir-terminology.firebaseio.com/')
  fba = $firebaseSimpleLogin(fbr)
  $rootScope.firebaseRef = fbr
  $rootScope.auth = fba


  $rootScope.login = ()->
    fba.$login('github')

  $rootScope.logout = ()->
    console.log('logout')
    fba.$logout()

  fbr = new Firebase('https://fhir-terminology.firebaseio.com/valuesetList')
  vsChan = $firebase(fbr)
  valuesets = vsChan.$asArray()
  console.log(valuesets)
  $rootScope.valuesets = valuesets
  # valuesets.$bindTo($rootScope, "valuesets")

  # $rootScope.$watch 'valuesets', (v)->
  #   return unless v
  #   list = for id, e of v when id? and e? and e.content?
  #     {id: id, name: e.content.name, desc: e.content.description}
  #   fbr = new Firebase('https://fhir-terminology.firebaseio.com')
  #   vsChan = $firebase(fbr)
  #   vsChan.$set('valuesetList', list)


