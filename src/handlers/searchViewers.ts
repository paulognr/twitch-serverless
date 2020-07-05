import {Callback, Context} from "aws-lambda";
import {ViewersService} from "../app/viewers/service/viewers.service";
import moment = require('moment');

exports.handler = async (event: any, context: Context, callback: Callback) => {
    console.log("searchViewers");

    const gamesId = event.multiValueQueryStringParameters.gamesId.map(gameId => parseInt(gameId));
    const relativeTime:string = event.queryStringParameters.relativeTime || '15m';

    const startTime = {
        '15m': moment().subtract(15, 'm').toDate(),
        '1h': moment().subtract(1, 'h').toDate(),
        '3h': moment().subtract(3, 'h').toDate(),
        '12h': moment().subtract(12, 'h').toDate(),
        '24h': moment().subtract(24, 'h').toDate()
    }

    const viewersService = new ViewersService();
    const viewersDTO = await viewersService.search(gamesId, startTime[relativeTime], moment().toDate());

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(viewersDTO.map(value => removeUnderline(value))),
    };

    return callback(null, response);

    function removeUnderline(json) {
        return Object.keys(json).reduce((s,item) =>
            item.startsWith("_") ? ({...s,[item.substr(1, item.length)]:json[item]}) : ({...s,[item]:json[item]}),{})
    }
}