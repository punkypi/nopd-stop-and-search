// taken from:
// http://www.justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
// Use to mix in classes/modules into other classes/modules.
//
// @example
//  import mix from './Mix'
//
//  class Cat mix(Animal).with(Mammal, Predator) {
//    ...
//  }
class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass)
  }
}

export default mix = (superclass) => new MixinBuilder(superclass)
