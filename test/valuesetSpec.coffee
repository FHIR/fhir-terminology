vs = require('../src/coffee/valueset')


describe 'valueset', ->
  it 'mkConceptSet', ()->
    subj = vs.mkConceptSet()
    expect(subj.code.length).toBe(0)
    subj.$addCode()
    expect(subj.code.length).toBe(1)
    subj.$addCode()
    expect(subj.code.length).toBe(2)
    subj.$rmCode(subj.code[0])
    expect(subj.code.length).toBe(1)

  it 'mkConceptSet', ()->
    subj = vs.mkConceptSet(code: ['a','b'])
    expect(subj.code.length).toBe(2)
