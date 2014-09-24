exports.rm = (x, xs)-> xs.filter (i)-> i != x

#TODO: could be implemented as regex building
# search by combination of prefixes, ie this line is matched with "se b com"
mkPrefixMatch = (str)->
  tokens = str.toLowerCase().split(/\s+/)
  (x)->
    return false unless x
    tokens.every (t)->
      x.toLowerCase().indexOf(t) > -1

exports.mkPrefixMatch = mkPrefixMatch

exports.mkfilter = (flds...)->
  ()->
    (xs, str)->
      return xs unless str?
      match = mkPrefixMatch(str)
      xs.filter (x)->
        flds.some (fld)-> match(x[fld])
