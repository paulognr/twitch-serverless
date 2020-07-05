import {Callback, Context} from "aws-lambda";
import {WebsocketClient} from "../app/websockets/websocket.client";
import {ViewerDTO} from "../app/viewers/api/viewer.dto";

exports.handler = async (event: any, context: Context, callback: Callback) => {
    console.log("broadcast");

    const viewers = new Array<ViewerDTO>();
    event.Records.forEach(record => {
        const viewerDTO = new ViewerDTO();
        viewerDTO.gameId = record.dynamodb.NewImage.game_id.N;
        viewerDTO.gameName = record.dynamodb.NewImage.game_name.S;
        viewerDTO.viewers = record.dynamodb.NewImage.viewers.N;
        viewerDTO.datetime = record.dynamodb.NewImage.created_at.N;
        viewers.push(viewerDTO);
    });

    console.dir(JSON.stringify(viewers));

    const ws = new WebsocketClient();
    await ws.broadcast(JSON.stringify(viewers));
    callback(null, "success");
}