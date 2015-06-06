/* global Immutable */

export default class Section extends Immutable.Record({
  id:        null,
  label:     null,
  color:     null,
  position:  0,
  tasks:     null
}) {
  constructor(attributes) {
    attributes.id = attributes.id || uuid.v1();
    super(attributes);
  }
}
