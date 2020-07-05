import {TwitchOauthClient} from "./twitch.oauth.client";
import {TwitchOauthTokenDTO} from "./twitch.oauth.token.dto";

export class TwitchOauthService {

    private twitchOauthClient:TwitchOauthClient

    constructor() {
        this.twitchOauthClient = new TwitchOauthClient();
    }

    async getAccessToken():Promise<TwitchOauthTokenDTO> {
        return this.twitchOauthClient.getAccessToken()
            .catch((error) => {
                console.error(error);
                throw Error("Error access token");
            })
    }
}