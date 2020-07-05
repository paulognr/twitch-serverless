import {URLSearchParams} from "url";
import fetch from "node-fetch";
import {TwitchOauthTokenDTO} from "./twitch.oauth.token.dto";

export class TwitchOauthClient {

    readonly TWITCH_CLIENT_ID = String(process.env["TWITCH_CLIENT_ID"]);
    readonly TWITCH_CLIENT_SECRET = String(process.env["TWITCH_CLIENT_SECRET"]);

    private accessToken:string;

    async getAccessToken(): Promise<TwitchOauthTokenDTO> {
        if (this.accessToken) {
            return Promise.resolve(new TwitchOauthTokenDTO(this.accessToken));
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', this.TWITCH_CLIENT_ID);
        params.append('client_secret', this.TWITCH_CLIENT_SECRET);

        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        }

        return fetch('https://id.twitch.tv/oauth2/token', options)
            .then(res => res.json())
            .then((res) => {
                this.accessToken = res.access_token;
                return new TwitchOauthTokenDTO(this.accessToken);
            });
    }
}