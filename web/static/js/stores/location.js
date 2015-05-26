import alt from '../util/alt';
import LocationActions from '../actions/example';
import FavoritesStore from './favorites';
import LocationSource from '../sources/location';

class LocationStore {
  constructor() {
    this.locations = [];
    this.errorMessage = null;
    this.bindListeners({
      handleUpdateLocations: LocationActions.UPDATE_LOCATIONS,
      handleFetchLocations:  LocationActions.FETCH_LOCATIONS,
      handleLocationsFailed: LocationActions.LOCATIONS_FAILED,
      setFavorites:          LocationActions.FAVORITE_LOCATION
    });
    this.exportPublicMethods({
      getLocation: this.getLocation
    });
    this.exportAsync(LocationSource);
  }

  handleUpdateLocations(locations) {
    this.locations = locations;
    this.errorMessage = null;
  }

  handleFetchLocations() {
    this.locations = [];
    this.errorMessage = null;
  }

  handleLocationsFailed(message) {
    this.errorMessage = message;
  }

  resetAllFavorites() {
    this.locations = this.locations.map(location => {
      return {id: location.id, name: location.name, has_favorite: false};
    });
  }

  setFavorites(location) {
    this.waitFor(FavoritesStore);

    let favoritedLocations = FavoritesStore.getState().locations;

    this.resetAllFavorites();

    favoritedLocations.forEach(location => {
      for (let i = 0; i < this.locations.length; i += 1) {
        if (this.locations[i].id === location.id) {
          this.locations[i].has_favorite = true;
          break;
        }
      }
    });
  }

  getLocation(id) {
    let {locations} = this.getState();
    for (let i = 0; i < locations.length; i += 1) {
      if (locations[i].id === id) {
        return locations[i];
      }
    }
    return null;
  }
}

export default alt.createStore(LocationStore, 'LocationStore');
