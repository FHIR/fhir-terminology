# ValueSet model
u = require('./utils')

#TODO
notEmpty = (x)-> x && x.trim() != ''

_check = (pred, [key,er], ers)->
  unless pred
    ers.$error = true
    ers[key] = er

_validate = (vs)->
  errors = {}
  _check notEmpty(vs.identifier),  ['identifier', 'is required'], errors
  _check notEmpty(vs.description), ['description', 'is required'], errors
  _check notEmpty(vs.name),        ['name', 'is required'], errors
  errors

mkDefine = (attrs)->
  attrs ||= {}
  define = {concept: []}
  methods =
    $addConcept:  ->
      define.concept.push {}
    $rmConcept:  (i)->
      define.concept=u.rm(i,define.concept)
  angular.extend(define, attrs, methods)

mkConceptSet = (attrs)->
  attrs ||= {}
  set = {code: []}
  methods =
    $addCode: ()->
      set.code.push {}
    $rmCode: (x)->
      set.code = u.rm(x,set.code)
  angular.extend(set, attrs, methods)

mkCompose = (attrs)->
  attrs ||= {}
  compose = {}
  colls =
    include: (attrs.include || []).map(mkConceptSet)
    exclude: (attrs.exclude || []).map(mkConceptSet)
  methods =
    $addInclude: ->
      compose.include.push mkConceptSet()
    $addExclude: ->
      compose.exclude.push mkConceptSet()
    $rmInclude: (x)->
      compose.include = u.rm(x,compose.include)
    $rmExclude: (x)->
      compose.exclude = u.rm(x,compose.exclude)

  angular.extend(compose, attrs, colls, methods)

mkValueSet = (attrs)->
  attrs || = {}
  define =mkDefine(attrs.define)
  console.log(define)
  compose = mkCompose(attrs.compose)
  valueset = {}

  defaults =
    name: 'MyName'
    version: '0.0.1'
    status: 'draft'
    identifier: 'myid1'

  methods =
    define: define
    compose: compose
    $statuses: ['draft','active','retired']
    $addDefine: ->
      valueset.define = define
    $rmDefine: ->
      delete valueset.define
    $addCompose: ->
      valueset.compose = compose
    $rmCompose: ->
      delete valueset.compose
    $toJson: ()->
      angular.toJson(valueset, true)
    $validate: ()->
      _validate(valueset)
    $toEntry: ()->
      angular.fromJson(
        angular.toJson(
          id: u.sha(valueset.identifier || valueset.name)
          content: angular.copy(valueset)))

  angular.extend(valueset, defaults, attrs, methods)

exports.mkConceptSet = mkConceptSet
exports.mkDefine = mkDefine
exports.mkCompose = mkCompose
exports.mkValueSet = mkValueSet
