app = require('./module')
sha = require('jssha')
mkPrefixMatch = (str)->
  tokens = str.toLowerCase().split(/\s+/)
  (x)->
    return false unless x
    tokens.every (t)->
      x.toLowerCase().indexOf(t) > -1

mkfilter = (flds...)->
  ()->
    (xs, str)->
      return xs unless str?
      match = mkPrefixMatch(str)
      xs.filter (x)->
        flds.some (fld)-> match(x[fld])

app.filter 'vsearch', mkfilter('name','desc')

app.filter 'csearch', mkfilter('code', 'display', 'definition')

app.filter 'sha', ()->
  (x)->
    sha(x,'TEXT').getHash("SHA-1", "HEX")
