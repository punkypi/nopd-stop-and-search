import isNil from 'lodash/isNil'
import isObject from 'lodash/isObject'

/**
 * Adds a "hideable" API to the mixin target. Allowing them to be hidden,
 * made visible, or just toggled between the two.
 * @param {Object} props
 * @param {boolean} [props.hidden=false]
 *  if the component should be considered "hidden"
 */
export default (superclass) => class extends superclass {
  constructor(props) {
    super(props)
    const hidden = Boolean(props.hidden)
    if (isNil(this.state)) { this.state = { hidden: hidden } }
    if (isObject(this.state)) { this.state.hidden = hidden }
  }

  /**
   * Since we're managing state, we'll need to update it when the props change.
   * @see {@link https://tinyurl.com/y93edy52}
   * @param {Object} nextProps
   *  new prop values being passed to the mounted component
   */
  componentWillReceiveProps(nextProps) {
    this.hidden = Boolean(nextProps.hidden)
  }

  /**
   * @return {boolean}
   *  if the component is "hidden"
   */
  get hidden() {
    return Boolean(this.state.hidden)
  }

  /**
   * Assigns the given boolean value to {@link #hidden}.
   * @param {boolean} newHidden
   */
   set hidden(newHidden) {
     this.setState({ hidden: newHidden })
   }

  /**
   * Sets {@link #hidden} to true.
   */
  hide() {
    this.hidden = true
  }

  /**
   * Sets {@link #hidden} to false.
   */
  show() {
    this.hidden = false
  }

  /**
   * Sets {@link #hidden} to the opposite of its current value. This will hide
   * visible components and show hidden components.
   */
  toggleVisibilty() {
    this.hidden = !this.hidden
  }

  /**
   * @see #hidden
   * @return {boolean}
   *  if the component is not "hidden"
   */
  get visible() {
    return !this.hidden
  }

  /**
   * Assigns the opposite of the given boolean value to {@link #hidden}.
   * @param {boolean} newVisible
   */
   set visible(newVisible) {
     this.hidden = !newVisible
   }
}
