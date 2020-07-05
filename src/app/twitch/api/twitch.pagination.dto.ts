export class TwitchPaginationDTO {

    private _cursor: string;

    constructor(cursor: string) {
        this._cursor = cursor;
    }

    get cursor(): string {
        return this._cursor;
    }

    set cursor(value: string) {
        this._cursor = value;
    }
}