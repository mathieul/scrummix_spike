import LocationStore from '../stores/location';
import FavoritesStore from '../stores/favorites';
import LocationActions from '../actions/example';
/* global React */
/* global Alt */

let Favorites = React.createClass({
  render() {
    return (
      <ul>
        {this.props.locations.map((location, i) => {
          return <li key={`location-${i}`}>{location.name}</li>;
        })}
      </ul>
    );
  }
});

let AllLocations = React.createClass({
  addFave(event) {
    let locationId = Number(event.target.getAttribute('data-id'));
    let location = LocationStore.getLocation(locationId);
    LocationActions.favoriteLocation(location);
  },

  render() {
    if (this.props.errorMessage) {
      return <div>Something went wrong: {this.props.errorMessage}</div>;
    }

    if (LocationStore.isLoading()) {
      return <div>... loading ...</div>;
    }

    return (
      <ul>
        {this.props.locations.map((location, i) => {
          let faveButton = (
            <button onClick={this.addFave} data-id={location.id}>Favorite</button>
          );

          return (
            <li key={i}>
              {location.name} {location.has_favorite ? '<3' : faveButton}
            </li>
          );
        })}
      </ul>
    );
  }
});

let AltContainer = Alt.addons.AltContainer;

let Locations = React.createClass({
  componentDidMount() {
    LocationStore.fetchLocations();
  },

  render() {
    return (
      <div>
        <h1>Locations</h1>
        <AltContainer store={LocationStore}>
          <AllLocations />
        </AltContainer>

        <h1>Favorites</h1>
        <AltContainer store={FavoritesStore}>
          <Favorites />
        </AltContainer>
      </div>
    );
  }
});

React.render(
  <Locations />,
  document.getElementById('example')
);
