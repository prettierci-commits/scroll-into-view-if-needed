/**
 * v2 rewrite
 * 1. first identify all scrolling boxes all the way up to outermost, take boundary into account if specified.
 * 2. boundary should be null by default so that we can scroll parent frames.
 * 3. calculate required scrolling by looping scrolling boxes from innermost to outermost.
 * 4. each calculation should be an array of [scrollingbox: Element, block: number, inline: number]
 * 5. Default implementation: calculations.forEach(([el, scrollTop, scrollLeft]) => {
 *     el.scrollTop = scrollTop
 *     el.scrollLeft = scrollLeft
 *  })
 * 6. ponyfill applies it as an animation, if using default smooth scroll behavior without ponyfill we can see if it's possible to use Element.scroll(),
 * do a simple check for it up top so that if it does not exist and somebody tries to use "smooth" outside ponyfill we can throw a warning
 */

export interface Offset {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface ScrollCoordinates {
  scrollLeft: number
  scrollTop: number
}
export type handleScrollCallback = (
  parent: HTMLElement,
  coordinates: ScrollCoordinates,
  config: CalculateOptions
) => void

export interface CalculateOptions {
  // A handler that handles scrolling the view to the new coordinates
  handleScroll?: handleScrollCallback
  boundary?: Element
  centerIfNeeded?: boolean
  offset?: Offset
}

const handleScroll: handleScrollCallback = (
  parent: HTMLElement,
  { scrollLeft, scrollTop }
) => {
  parent.scrollLeft = scrollLeft
  parent.scrollTop = scrollTop
}

const isElement = el => el != null && typeof el == 'object' && el.nodeType === 1

export const calculate = (maybeElement: any, options: CalculateOptions) => {
  if (!isElement(maybeElement)) {
    throw new Error('Element is required in scrollIntoViewIfNeeded')
  }
  let target = maybeElement as HTMLElement
  console.log(target)

  const config = { handleScroll, ...options }
  const defaultOffset = { top: 0, right: 0, bottom: 0, left: 0 }
  config.offset = config.offset
    ? { ...defaultOffset, ...config.offset }
    : defaultOffset

  function withinBounds(value, min, max, extent) {
    if (
      config.centerIfNeeded === false ||
      (max <= value + extent && value <= min + extent)
    ) {
      return Math.min(max, Math.max(min, value))
    } else {
      return (min + max) / 2
    }
  }

  const { offset } = config
  const offsetTop = offset.top
  const offsetLeft = offset.left
  const offsetBottom = offset.bottom
  const offsetRight = offset.right

  function makeArea(left, top, width, height) {
    return {
      left: left + offsetLeft,
      top: top + offsetTop,
      width: width,
      height: height,
      right: left + offsetLeft + width + offsetRight,
      bottom: top + offsetTop + height + offsetBottom,
      translate: function(x, y) {
        return makeArea(
          x + left + offsetLeft,
          y + top + offsetTop,
          width,
          height
        )
      },
      relativeFromTo: function(lhs, rhs) {
        let newLeft = left + offsetLeft,
          newTop = top + offsetTop
        lhs = lhs.offsetParent
        rhs = rhs.offsetParent
        if (lhs === rhs) {
          return area
        }
        for (; lhs; lhs = lhs.offsetParent) {
          newLeft += lhs.offsetLeft + lhs.clientLeft
          newTop += lhs.offsetTop + lhs.clientTop
        }
        for (; rhs; rhs = rhs.offsetParent) {
          newLeft -= rhs.offsetLeft + rhs.clientLeft
          newTop -= rhs.offsetTop + rhs.clientTop
        }
        return makeArea(newLeft, newTop, width, height)
      },
    }
  }

  let parent,
    area = makeArea(
      target.offsetLeft,
      target.offsetTop,
      target.offsetWidth,
      target.offsetHeight
    )
  while (
    isElement((parent = target.parentNode)) &&
    target !== config.boundary
  ) {
    const clientLeft = parent.offsetLeft + parent.clientLeft
    const clientTop = parent.offsetTop + parent.clientTop

    // Make area relative to parent's client area.
    area = area
      .relativeFromTo(target, parent)
      .translate(-clientLeft, -clientTop)

    const scrollLeft = withinBounds(
      parent.scrollLeft,
      area.right - parent.clientWidth,
      area.left,
      parent.clientWidth
    )
    const scrollTop = withinBounds(
      parent.scrollTop,
      area.bottom - parent.clientHeight,
      area.top,
      parent.clientHeight
    )
    // Pass the new coordinates to the handleScroll callback
    config.handleScroll(parent, { scrollLeft, scrollTop }, config)

    // Determine actual scroll amount by reading back scroll properties.
    area = area.translate(
      clientLeft - parent.scrollLeft,
      clientTop - parent.scrollTop
    )
    target = parent
  }
}
