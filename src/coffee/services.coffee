app = require('./module')

# todo extract cache
# app.provider 'cache', ()->
cache = (d, key, missCb)->
  st = window.localStorage
  val = st.getItem(key)
  if val
    console.log('cache.match')
    d.resolve(JSON.parse(val))
  else
    console.log('cache.missmatch')
    missCb (newval)->
      st.setItem(key, JSON.stringify(newval))
      p.resolve(newval)
  d.promise

app.service 'cache', ($http, $q)->
  (key, url)->
    cache $q.defer(), key, (save)->
      $http(method: 'GET', url: url, success: save).success(save)

app.provider 'menu', ()->
  $get: ()->
    menu =
      items: []
      build: (items...)=>
        state = 'path'
        menu.items = items
    menu
