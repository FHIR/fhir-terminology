sha = require('jssha')

exports.sha = (x)->
  new sha(x,'TEXT').getHash("SHA-1", "HEX") if x

exports.rm = (x, xs)-> xs.filter (i)-> i != x

exports.fixCodeMirror = ($scope)->
  _editor = null
  $scope.codemirror = (x)->
    _editor = x

  $scope.state = 'form'
  $scope.$watch 'state', (st)->
    if st == 'json'
      $scope.updateCM = false
      $scope.$evalAsync ()->
        $scope.updateCM = true
        _editor.refresh()
        _editor.focus()
