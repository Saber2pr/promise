/*
 * @Author: saber2pr
 * @Date: 2019-05-18 21:47:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-18 21:48:49
 */
export interface Microtask extends MutationCallback {}

export function microtask(task: Microtask) {
  if (
    typeof process !== 'undefined' &&
    typeof process.nextTick === 'function'
  ) {
    process.nextTick(task)
  } else {
    const observer = new MutationObserver(task)
    const element = document.createTextNode('')
    observer.observe(element, {
      characterData: true
    })
    element.data = ''
  }
}
