import {Context, Callback} from 'aws-lambda';
import {StreamDTO} from "../app/twitch/streams/stream.dto";
import {TwitchStreamsService} from "../app/twitch/streams/twitch.streams.service";
import {DynamoDB} from "aws-sdk";
import {ViewerDTO} from "../app/viewers/api/viewer.dto";
import {ViewersService} from "../app/viewers/service/viewers.service";

exports.handler = async (event: any, context: Context, callback: Callback) => {
    console.log("pullStreams");

    const games = [{id: 460630, name: 'Rainbow Six Siege'},
        {id: 506274, name: 'Assassin’s Creed Odyssey'},
        {id: 497078, name: 'Far Cry 5'}];

    const twitchStreamsService: TwitchStreamsService = new TwitchStreamsService();
    const streams: Array<StreamDTO> = await twitchStreamsService.getStreams(games.map(game => game.id));

    const streamsViewers = new Map<number, ViewerDTO>();
    streams.forEach(stream => {
        if (streamsViewers.has(stream.gameId)) {
            // @ts-ignore
            streamsViewers.get(stream.gameId).viewers += stream.viewerCount;
        } else {
            const viewerDto = new ViewerDTO();
            viewerDto.gameId = stream.gameId;
            // @ts-ignore
            viewerDto.gameName = games.find(game => game.id == stream.gameId).name;
            viewerDto.viewers = stream.viewerCount;
            streamsViewers.set(stream.gameId, viewerDto);
        }
    });

    const viewersDTO = Array.from(streamsViewers.values());
    console.log("streamsViewers: " + JSON.stringify(viewersDTO));

    const viewersService = new ViewersService();
    return await viewersService.saveAll(viewersDTO)
        .then(() => callback(null, "Success"))
        .catch(reason => callback(reason));
}