import { compute, Options as ComputeOptions } from './compute'

export interface Options extends ComputeOptions {
  // @TODO specify custom behavior option here
}

export const auto = (target, options: ScrollIntoViewOptions = {}) => {
  const { behavior = 'auto' } = options
  //return target.scrollIntoView(options)
  const instructions = compute(target, options)

  console.log('instructions', instructions)

  if (instructions) {
    instructions.forEach(([el, top, left]) => {
      console.log('el', el, top, left, el.scroll, behavior)
      // browser implements the new Element.prototype.scroll API that supports `behavior`
      if (el.scroll) {
        console.log('using fancy new api')
        el.scroll({ top, left, behavior })
      } else {
        console.log('good old api')
        el.scrollTop = top
        el.scrollLeft = left
      }
    })
  }
}
