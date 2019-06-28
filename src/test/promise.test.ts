import { Promise } from '..'

describe('promise', () => {
  it('resolve', done => {
    Promise.resolve('micro').then(res => {
      expect(res).toEqual('micro')
      done()
    })
  })

  it('reject', done => {
    Promise.reject('micro').catch(res => {
      expect(res).toEqual('micro')
      done()
    })
  })

  it('resolveStepThen', done => {
    Promise.resolve('micro')
      .then()
      .then(res => {
        expect(res).toEqual('micro')
        done()
      })
  })

  it('rejectStepThen', done => {
    Promise.reject('micro')
      .then()
      .catch(res => {
        expect(res).toEqual('micro')
        done()
      })
  })

  it('constructorResolve', done => {
    new Promise(resolve => resolve('micro')).then(res => {
      expect(res).toEqual('micro')
      done()
    })
  })

  it('constructorReject', done => {
    new Promise((_, reject) => reject('micro')).catch(res => {
      expect(res).toEqual('micro')
      done()
    })
  })

  it('withSetTimeout', done => {
    new Promise(resolve => setTimeout(() => resolve('micro'))).then(res => {
      expect(res).toEqual('micro')
      done()
    })
  })

  it('queueOrderUseResolve', done => {
    const result = []
    const finish = () => {
      expect(result).toEqual([3, 2, 1])
      done()
    }
    setTimeout(() => {
      result.push(1)
      if (result.length === 3) finish()
    })
    Promise.resolve().then(() => {
      result.push(2)
      if (result.length === 3) finish()
    })
    result.push(3)
    if (result.length === 3) finish()
  })

  it('queueOrderUseConstructor', done => {
    const result = []
    const finish = () => {
      expect(result).toEqual([3, 2, 1])
      done()
    }
    setTimeout(() => {
      result.push(1)
      if (result.length === 3) finish()
    })
    new Promise(resolve => resolve()).then(() => {
      result.push(2)
      if (result.length === 3) finish()
    })
    result.push(3)
    if (result.length === 3) finish()
  })

  it('executorRunInSync', () => {
    const result = []
    new Promise(() => result.push('A'))
    expect(result).toEqual(['A'])
  })
})
