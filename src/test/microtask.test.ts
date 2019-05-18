import { microtask } from '..'

describe('microtask', () => {
  it('queueOrder', done => {
    const result = []
    const finish = () => {
      expect(result).toEqual([3, 2, 1])
      done()
    }
    setTimeout(() => {
      result.push(1)
      if (result.length === 3) finish()
    })
    microtask(() => {
      result.push(2)
      if (result.length === 3) finish()
    })
    result.push(3)
    if (result.length === 3) finish()
  })
})
