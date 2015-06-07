/* global Immutable */
/* global uuid */

export default class Task extends Immutable.Record({
  id:            null,
  label:         null,
  position:      null,
  completed_at:  null,
  section_id:    null
}) {
  constructor(attributes) {
    attributes.id = attributes.id || uuid.v1();
    super(attributes);
  }
}
