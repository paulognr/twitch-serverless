export class StreamDTO {

    private _gameId: number;
    private _viewerCount: number;

    constructor(gameId: number, viewerCount: number) {
        this._gameId = gameId;
        this._viewerCount = viewerCount;
    }

    get gameId(): number {
        return this._gameId;
    }

    set gameId(value: number) {
        this._gameId = value;
    }

    get viewerCount(): number {
        return this._viewerCount;
    }

    set viewerCount(value: number) {
        this._viewerCount = value;
    }
}