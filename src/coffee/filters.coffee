app = require('./module')
u = require('./utils')
app.filter 'vsearch', ()->
  (xs, str)->
    return xs unless str?
    xs.filter (x)->
      cnt = x.content
      cnt.name.toLowerCase().indexOf(str) > -1 && cnt.description.toLowerCase().indexOf(str) > -1

app.filter 'csearch', u.mkfilter('code', 'display', 'definition')
