app = require('./module')

app.directive 'switcher', ()->
  restrict: 'A'
  scope:
    switcher: '='
  link: (scope, element, attrs) ->
    swvalue = attrs.swvalue
    swcls = attrs.swclass || 'btn-primary active'
    scope.$watch 'switcher', (v)->
      if v == swvalue
        element.addClass(swcls)
      else
        element.removeClass(swcls)

    element.click ()->
      scope.$apply ()->
        scope.switcher = swvalue

