import {DynamoDBClient} from "../../aws/client/dynamodb.client";
import {ViewerEntity} from "./viewer.entity";
import moment = require("moment");

export class ViewersRepository {

    readonly TABLE_NAME = String(process.env.STREAMS_VIEWERS_TABLE);

    private dynamoDBClient: DynamoDBClient;

    constructor() {
        this.dynamoDBClient = new DynamoDBClient();
    }

    public async saveAll(items:Array<ViewerEntity>): Promise<Array<ViewerEntity>> {
        const createdAt = new Date().getTime();
        const ttl = moment().add(1, 'd').toDate().getTime() / 1000 | 0;
        items.forEach((viewer) =>  {
            viewer.created_at = createdAt;
            viewer.ttl = ttl;
        });
        return this.dynamoDBClient.saveAll(items, this.TABLE_NAME)
            .then(response => {
                return items;
            });
    }

    public async search(gameId:number, startDate:Date, endDate:Date): Promise<Array<ViewerEntity>> {
        const params = {
            TableName : this.TABLE_NAME,
            KeyConditionExpression: "game_id = :gameId and created_at between :startDate and :endDate",
            ExpressionAttributeValues: {
                ":gameId": gameId,
                ":startDate": startDate.getTime(),
                ":endDate": endDate.getTime()
            }
        };

        return this.dynamoDBClient.query(params)
            .then((response) => {
                const viewers = new Array<ViewerEntity>();
                if (response && response.Items) {
                    response.Items.forEach(item => {
                        const viewer = new ViewerEntity();
                        viewer.game_id = item.game_id;
                        viewer.game_name = item.game_name;
                        viewer.viewers = item.viewers;
                        viewer.created_at = item.created_at;
                        viewers.push(viewer);
                    });
                }
                return viewers;
            });
    }
}