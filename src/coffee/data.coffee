app = require('./module')
u = require('./utils')
vs = require('./valueset')

app.service 'auth', ($firebaseSimpleLogin)->
  fbr = new Firebase('https://fhir-terminology.firebaseio.com/')
  fba = $firebaseSimpleLogin(fbr)
  auth: fba
  login:  ()-> fba.$login('github')
  logout: ()-> fba.$logout()


app.service 'valueset', ($firebase)->
  ($scope, attr, id)->
    url = "https://fhir-terminology.firebaseio.com/valuesets/#{id}"
    fbr = new Firebase(url)
    vChan = $firebase(fbr)
    valueset = vChan.$asObject()
    valueset.$bindTo($scope, attr)

BASE_URL="https://fhir-terminology.firebaseio.com"

app.service 'valuesetRepo', ($firebase)->
  mkchan = (url)-> $firebase(new Firebase(url))
  valuesets = mkchan("#{BASE_URL}/valuesets")
  valuesetList = mkchan("#{BASE_URL}/valuesetList")
  list = valuesetList.$asArray()

  $build: (attrs)-> vs.mkValueSet(attrs)

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

  $create: (v, u)->
    valuesets.$set(v.id, angular.copy(v))
    if u
      user =
        author: u.displayName
        avatar: u.thirdPartyUserData.avatar_url

    valuesetList.$set v.id,
      id:   v.id
      name: v.content.name
      desc: v.content.description
      user: user
