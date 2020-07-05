export class ViewerDTO {

    private _viewers:number;
    private _gameId:number;
    private _gameName:string;
    private _datetime:number;

    get viewers(): number {
        return this._viewers;
    }

    set viewers(value: number) {
        this._viewers = value;
    }

    get gameId(): number {
        return this._gameId;
    }

    set gameId(value: number) {
        this._gameId = value;
    }

    get gameName(): string {
        return this._gameName;
    }

    set gameName(value: string) {
        this._gameName = value;
    }

    get datetime(): number {
        return this._datetime;
    }

    set datetime(value: number) {
        this._datetime = value;
    }
}