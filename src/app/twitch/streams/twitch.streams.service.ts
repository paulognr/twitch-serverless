import {TwitchStreamsClient} from "./twitch.streams.client";
import {TwitchResponseDTO} from "../api/twitch.response.dto";
import {StreamDTO} from "./stream.dto";

export class TwitchStreamsService {

    private twitchStreamsClient:TwitchStreamsClient;

    constructor() {
        this.twitchStreamsClient = new TwitchStreamsClient();
    }

    async getStreams(streamsId:Array<number>): Promise<Array<StreamDTO>> {
        let streams:Array<StreamDTO> = new Array<StreamDTO>();
        let twitchResponseDTO:TwitchResponseDTO<StreamDTO> = await this.twitchStreamsClient.getStreams(streamsId, null);
        do {
            if (twitchResponseDTO.data.length) {
                streams = streams.concat(twitchResponseDTO.data);
            }

            if (twitchResponseDTO.pagination) {
                twitchResponseDTO = await this.twitchStreamsClient.getStreams(streamsId, twitchResponseDTO.pagination.cursor);
            }
        } while (twitchResponseDTO.data.length)

        return Promise.resolve(streams);
    }
}