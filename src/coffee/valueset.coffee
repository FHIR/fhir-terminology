# ValueSet model
u = require('./utils')

#TODO
notEmpty = (x)-> x && x.trim() != ''

_check = (pred, [key,er], ers)->
  unless pred
    ers.$error = true
    ers[key] = er

_validate = (entry)->
  # console.log(entry)
  errors = {}
  _check notEmpty(entry.content.identifier),  ['identifier', 'is required'], errors
  _check notEmpty(entry.content.description), ['description', 'is required'], errors
  _check notEmpty(entry.content.name),        ['name', 'is required'], errors
  errors

mkDefine = (attrs)->
  attrs ||= {}
  define = {concept: []}
  methods =
    $addConcept:  (x)->
      define.concept.push(x || {})
    $rmConcept:  (i)->
      define.concept=u.rm(i,define.concept)
  angular.extend(define, attrs, methods)

mkConceptSet = (attrs)->
  attrs ||= {}
  set = {code: []}
  methods =
    $addCode: (x)->
      set.code.push(x || "")
    $rmCode: (x)->
      return if x < 0
      set.code = set.code.splice(x,1)
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

# clear all $attrs
toJsonReplacer = (key, value)->
  val = value
  if typeof key == 'string' && key.charAt(0) == '$'
    val = undefined
  else
    val

copy = (x)->
  angular.fromJson(JSON.stringify(x, toJsonReplacer))

mkValueSet = (attrs)->
  attrs || = {}
  define = mkDefine(attrs.define)
  compose = mkCompose(attrs.compose)
  valueset = {}

  defaults =
    version: '0.0.1'
    status: 'draft'

  methods =
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

  methods.define = define if attrs.define?
  methods.compose = compose if attrs.compose?

  angular.extend(valueset, defaults, attrs, methods)

mkEntry = (attrs)->
  attrs ||= {}
  vs = mkValueSet(attrs.content)
  entry = {}
  angular.extend entry, attrs,
    content: vs
    $toJson: ()-> angular.toJson(entry)
    $validate: ()-> _validate(entry)
    $toObject: ()->
      e = copy(entry)
      e.id = entry.id || u.sha(entry.content.identifier || entry.content.name)
      e.title = e.content.name
      e.summary = e.content.description
      e

exports.mkConceptSet = mkConceptSet
exports.mkDefine = mkDefine
exports.mkCompose = mkCompose
exports.mkValueSet = mkValueSet
exports.mkEntry = mkEntry
