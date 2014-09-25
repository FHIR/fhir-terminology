sha = require('jssha')

exports.sha = (x)->
  new sha(x,'TEXT').getHash("SHA-1", "HEX") if x

exports.rm = (x, xs)-> xs.filter (i)-> i != x
