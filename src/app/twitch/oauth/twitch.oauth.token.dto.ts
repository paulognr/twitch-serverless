export class TwitchOauthTokenDTO {
    accessToken: string;

    constructor(accessToken:string) {
        this.accessToken = accessToken;
    }
}