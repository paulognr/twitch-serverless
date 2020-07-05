import {TwitchOauthService} from "../oauth/twitch.oauth.service";
import {TwitchOauthTokenDTO} from "../oauth/twitch.oauth.token.dto";
import fetch from "node-fetch";
import {StreamDTO} from "./stream.dto";
import {TwitchResponseDTO} from "../api/twitch.response.dto";
import {TwitchPaginationDTO} from "../api/twitch.pagination.dto";

export class TwitchStreamsClient {

    readonly TWITCH_CLIENT_ID = String(process.env["TWITCH_CLIENT_ID"]);

    private twitchOauthService:TwitchOauthService;

    constructor() {
        this.twitchOauthService = new TwitchOauthService();
    }

    async getStreams(streamsIds: Array<number>, cursor: string | null): Promise<TwitchResponseDTO<StreamDTO>> {
        const accessToken:TwitchOauthTokenDTO = await this.twitchOauthService.getAccessToken();

        let url = 'https://api.twitch.tv/helix/streams?first=100';
        streamsIds.forEach(game => url += '&game_id='+game)

        if (cursor) {
            url += '&after=' + cursor;
        }

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': this.TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + accessToken.accessToken
            }
        }

        return fetch(url, options)
            .then(res => res.json())
            .then((twitchResponse) => {
                const twitchResponseDTO = new TwitchResponseDTO<StreamDTO>();
                if (twitchResponse.data) {
                    twitchResponse.data.forEach(stream => twitchResponseDTO.data.push(new StreamDTO(parseInt(stream.game_id), stream.viewer_count)));
                }
                if (twitchResponse.pagination.cursor) {
                    twitchResponseDTO.pagination = new TwitchPaginationDTO(twitchResponse.pagination.cursor);
                }
                return twitchResponseDTO;
            });
    }

}