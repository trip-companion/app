import * as Actions from '../actions/accountTripList.action';
import { IUserTrip } from '@app/interfaces/store/userTripList';
import { UserTripModel } from '@app/models/trip-user.model';

export interface State {
  trips: IUserTrip[];
  loading: boolean;
}

const initialState: State = {
  trips: [
    {
      id: '1',
      userId: '60768b773539be11fd4eb05f',
      status: true,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3'
      ],
      travelDescription: `kdsakdsksdkdsa kdskdskds, dsdskdskdsk  ksdkdskdsm,
      dkdskdskds, kdkdkdssdkk!!!!! kkdkdk!llala llalaln.
      skskd. !!!!!!!!!!!  ddkdkdkdk!,  ddssd llll! Lorem 030303030
      flalal ne!!!!  woto govorit dadata! data1
      `,
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '2',
      userId: '60768b773539be11fd4eb05f',
      status: true,
      statusDate: '2021-04-11',
      travelCategiries: [
        '2',
        '4'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '3',
      userId: '60768b773539be11fd4eb05f',
      status: false,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '4',
      userId: '60768b773539be11fd4eb05f',
      status: false,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '5',
      userId: '60768b773539be11fd4eb05f',
      status: true,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3'
      ],
      travelDescription: `kdsakdsksdkdsa kdskdskds, dsdskdskdsk  ksdkdskdsm,
      dkdskdskds, kdkdkdssdkk!!!!! kkdkdk!llala llalaln.
      skskd. !!!!!!!!!!!  ddkdkdkdk!,  ddssd llll! Lorem 030303030
      flalal ne!!!!  woto govorit dadata! data1
      `,
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '6',
      userId: '60768b773539be11fd4eb05f',
      status: true,
      statusDate: '2021-04-11',
      travelCategiries: [
        '2',
        '4'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '7',
      userId: '60768b773539be11fd4eb05f',
      status: false,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '8',
      userId: '60768b773539be11fd4eb05f',
      status: false,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '9',
      userId: '60768b773539be11fd4eb05f',
      status: false,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3',
        '4'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '10',
      userId: '60768b773539be11fd4eb05f',
      status: false,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3',
        '4'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 22
    },
    {
      id: '11',
      userId: '60768b773539be11fd4eb05f',
      status: true,
      statusDate: '2021-04-11',
      travelCategiries: [
        '1',
        '3',
        '4'
      ],
      travelDescription: 'text test',
      destination: 'Kiev',
      startTrip: '2021-06-01',
      endTrip: '2021-08-30',
      peopleCount: 1
    },
  ],
  loading: false,
};

export const accountUserAboutReducer = (state = initialState, action: Actions.UserTripsActions): State => {

  switch (action.type) {
    case Actions.USER_TRIP_ACTION.GET_USER_TRIP_LIST:
      return {
        ...state,
        trips: null,
        loading: true,
      };
    case Actions.USER_TRIP_ACTION.ADD_USER_TRIP:
      return {
        ...state,
        loading: true,
      };
    case Actions.USER_TRIP_ACTION.EDIT_USER_TRIP:
      return {
        ...state,
        loading: true,
      };
    case Actions.USER_TRIP_ACTION.SET_USER_TRIP_LIST:
      return {
        ...state,
        trips: action.payload,
        loading: false,
      };
    case Actions.USER_TRIP_ACTION.CHANGE_STATUS_USER_TRIP:
      return {
        ...state,
        trips: [
          ...state.trips.map(trip => trip.id === action.payload.id
            ?{...trip, status: action.payload.status}
            :trip
          )
        ],
        loading: false
      };
    case Actions.USER_TRIP_ACTION.SET_USER_TRIP:
      return {
        ...state,
        trips: [...state.trips, action.payload],
        loading: false,
      };
    case Actions.USER_TRIP_ACTION.UPDATE_USER_TRIP:
      return {
        ...state,
        trips: [...state.trips.map(trip => trip.id === action.payload.id?trip=action.payload:trip)],
        loading: false,
      };

    default:
      return state;
  }
};

export const tripList = (state: State) => state.trips.map(trip => new UserTripModel(trip));
export const tripById = (state: State, props: any) => state.trips.find(trip => trip.id === props.id);
