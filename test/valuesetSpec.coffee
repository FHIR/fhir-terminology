vs = require('../src/coffee/valueset')


describe 'valueset', ->
  it 'mkConceptSet', ()->
    subj = vs.mkConceptSet()
    expect(subj.code.length).toBe(0)
    subj.$addCode('one')
    expect(subj.code.length).toBe(1)
    subj.$addCode('two')
    expect(subj.code.length).toBe(2)
    subj.$rmCode(0)
    expect(subj.code.length).toBe(1)

  it 'mkConceptSet', ()->
    subj = vs.mkConceptSet(code: ['a','b'])
    expect(subj.code.length).toBe(2)

  it 'mkCompose', ()->
    subj = vs.mkDefine()
    expect(subj.concept.length).toBe(0)
    subj.$addConcept({code: 'ups'})
    expect(subj.concept.length).toBe(1)
    expect(subj.concept).toEqual([{code: 'ups'}])

  it '$validate', ()->
    subj = vs.mkEntry({})
    errors = subj.$validate()
    expect(errors.identifier).toBe('is required')
    expect(errors.name).toBe('is required')
    expect(errors.description).toBe('is required')


