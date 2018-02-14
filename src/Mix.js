/**
 * Use to mix in classes/modules into other classes/modules.
 * @see {@link https://tinyurl.com/y9az9hcc}
 * @example
 *  import mix from './Mix'
 *
 *  class Cat extends mix(Animal).with(Mammal, Predator) {
 *   ...
 *  }
 */
class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass)
  }
}

export default (superclass) => new MixinBuilder(superclass)
