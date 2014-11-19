app = require('./module')
u = require('./utils')
vs = require('./valueset')

app.service 'auth', ($rootScope, $firebaseAuth)->
  fbr = new Firebase('https://fhir-terminology.firebaseio.com/')
  fba = $firebaseAuth(fbr)

  auth ={}

  fba.$onAuth (resp)->
    if resp && resp.github
      $rootScope.$apply ()->
        auth.user = resp.github.cachedUserProfile
    else
      delete auth.user

  auth.login =  ()-> fba.$authWithOAuthPopup("github")
  auth.logout = ()-> fba.$unauth()
  auth


app.service 'valueset', ($firebase)->
  ($scope, attr, id)->
    url = "https://fhir-terminology.firebaseio.com/valuesets/#{id}"
    fbr = new Firebase(url)
    vChan = $firebase(fbr)
    valueset = vChan.$asObject()
    valueset.$bindTo($scope, attr)

BASE_URL="https://fhir-terminology.firebaseio.com"

dateKey = ()->
  (new Date()).toISOString().replace(/[-:.]/g,'_')

app.service 'valuesetRepo', ($firebase)->
  mkchan = (url)-> $firebase(new Firebase(url))
  valuesets = mkchan("#{BASE_URL}/valuesets")
  valuesetList = mkchan("#{BASE_URL}/valuesetList")
  audit = mkchan("#{BASE_URL}/audit")
  list = valuesetList.$asArray()

  $build: (attrs)-> vs.mkEntry(attrs)

  $bindListItem: (id, scope, attr)->
    item = mkchan("#{BASE_URL}/valuesetList/#{id}")
    item.$asObject().$bindTo(scope, attr)

  $list: ()-> list

  $batch: ()->
    console.log('batch')

  $remove: (id)->
    for i in list
      list.$remove(i) if i.id == id
    valuesets.$remove(id)

  $save: (entry)->
    data = entry.$toObject()
    valuesets.$set(data.id, data)
    delete data.content
    valuesetList.$set data.id, data
    audit.$set(dateKey(), {action: 'save', data: data})
    data
