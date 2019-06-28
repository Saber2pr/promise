/*
 * @Author: saber2pr
 * @Date: 2019-05-18 21:48:02
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-06-28 21:31:36
 */
import { microtask } from './microtask'

export type Resolve<T> = (value?: T) => any
export type Reject<T> = (reason?: T) => any

export type Executor<T> = (resolve: Resolve<T>, reject: Reject<T>) => void
export type Catch<T> = (onRejected: Reject<T>) => any

export type Then<T> = (
  onfulfilled?: Resolve<T>,
  onrejected?: Reject<T>
) => Promise<T>

export type Status = 'pending' | 'resolved' | 'rejected'

export class Promise<T> {
  public constructor(executor: Executor<T>) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  private status: Status = 'pending'
  private data = undefined
  private onResolvedCallback: Array<Resolve<T>> = []
  private onRejectedCallback: Array<Reject<T>> = []

  private resolve: Resolve<T> = value => microtask(() => {
    if (this.status === 'pending') {
      this.status = 'resolved'
      this.data = value
      this.onResolvedCallback.forEach(resolve => resolve(value))
    }
  })

  private reject: Reject<T> = reason => microtask(() => {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.data = reason
      this.onRejectedCallback.forEach(reject => reject(reason))
    }
  })

  public then: Then<T> = (
    onfulfilled = value => value,
    onrejected = reason => {
      throw reason
    }
  ) => {
    return new Promise((resolve, reject) => {
      if (this.status === 'resolved') {
        try {
          const p = onfulfilled(this.data)
          if (p instanceof Promise) {
            p.then(resolve, reject)
          } else {
            resolve(p)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (this.status === 'rejected') {
        try {
          const p = onrejected(this.data)
          if (p instanceof Promise) {
            p.then(resolve, reject)
          } else {
            reject(this.data)
          }
        } catch (error) {
          reject(error)
        }
      }

      if (this.status === 'pending') {
        this.onResolvedCallback.push(() => {
          try {
            const p = onfulfilled(this.data)
            if (p instanceof Promise) {
              p.then(resolve, reject)
            } else {
              resolve(p)
            }
          } catch (error) {
            reject(error)
          }
        })

        this.onRejectedCallback.push(() => {
          try {
            const p = onrejected(this.data)
            if (p instanceof Promise) {
              p.then(resolve, reject)
            } else {
              reject(this.data)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
    })
  }

  public catch = (onRejected: Reject<T>) => {
    return this.then(null, onRejected)
  }
}

export namespace Promise {
  export function resolve<T>(value?: T) {
    return new Promise<T>(resolve => resolve(value))
  }

  export function reject<T>(reason?: T) {
    return new Promise<T>((_, reject) => reject(reason))
  }
}
