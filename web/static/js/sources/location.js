import LocationActions from '../actions/example';

let mockData = [
  { id: 0, name: 'Abu Dhabi' },
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bogota' },
  { id: 3, name: 'Buenos Aires' },
  { id: 4, name: 'Cairo' },
  { id: 5, name: 'Chicago' },
  { id: 6, name: 'Lima' },
  { id: 7, name: 'London' },
  { id: 8, name: 'Miami' },
  { id: 9, name: 'Moscow' },
  { id: 10, name: 'Mumbai' },
  { id: 11, name: 'Paris' },
  { id: 12, name: 'San Francisco' }
];

export default {
  fetchLocations() {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            if (true) {
              resolve(mockData);
            } else {
              reject("An error did happen!");
            }
          }, 500);
        });
      },

      local() {
        return false;
      },

      success: LocationActions.updateLocations,
      error:   LocationActions.locationsFailed,
      loading: LocationActions.fetchLocations
    };
  }
};
