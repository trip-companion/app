export class UserModel {
    public firstName: string;
    public lastName: string;
    public status: string;
    public gender: string;
    public about: string;
    public birthDate: string;
    public languages: {isoCode: string; level: string}[];
    public knownSkills: string[];
    public interestedInSkills: string[];
    public canTeachSkills: string[];
    public interests: string[];
    public features: string[];

    constructor(...arg) {
      Object.assign(this, ...arg);
    };
};
