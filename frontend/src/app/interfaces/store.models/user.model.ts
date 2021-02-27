export default interface IUserModel {
    id?: string;
    email?: string;
    avatarSrc?: string;
    firstName: string;
    lastName: string;
    status: string;
    gender: string;
    about: string;
    birthDate: string;
    languages: {isoCode: string; level: string}[];
    knownSkills: string[];
    interestedInSkills: string[];
    canTeachSkills: string[];
    interests: string[];
    features: string[];
};
