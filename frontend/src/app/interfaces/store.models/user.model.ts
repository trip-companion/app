export default interface IUserModel {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    avatarSrc: string;
    permissions?: string;
    language?: string;
};
