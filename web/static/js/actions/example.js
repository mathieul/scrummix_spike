import alt from '../util/alt';

class LocationActions {
  updateLocations(locations) {
    this.dispatch(locations);
  }

  fetchLocations() {
    this.dispatch();
  }

  locationsFailed(message) {
    this.dispatch(message);
  }

  favoriteLocation(location) {
    this.dispatch(location);
  }
}

export default alt.createActions(LocationActions);
