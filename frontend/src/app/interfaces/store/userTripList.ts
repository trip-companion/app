export interface IUserTrip {
    id: string;
    userId: string;
    status: boolean;
    statusDate: string;
    travelCategiries: Array<string>;
    travelDescription: string;
    destination: string;
    startTrip: string;
    endTrip: string;
    peopleCount: number;
};
