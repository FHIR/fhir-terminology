app = require('./module')

app.provider 'menu', ()->
  $get: ()->
    menu =
      items: []
      build: (items...)=>
        state = 'path'
        menu.items = items
        menu
    menu
