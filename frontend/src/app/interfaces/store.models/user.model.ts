export default interface IUserModel {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    permissions?: string;
    language?: string;
}