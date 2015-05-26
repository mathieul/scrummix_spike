import alt from '../util/alt';
import LocationActions from '../actions/example';

class FavoriteStore {
  constructor() {
    this.locations = [];

    this.bindListeners({
      addFavoriteLocation: LocationActions.FAVORITE_LOCATION
    });
  }

  addFavoriteLocation(location) {
    this.locations.push(location);
  }
}

export default alt.createStore(FavoriteStore, 'FavoriteStore');
