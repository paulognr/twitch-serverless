import {TwitchPaginationDTO} from "./twitch.pagination.dto";

export class TwitchResponseDTO<T> {
    private _data: Array<T>;
    private _pagination: TwitchPaginationDTO;

    constructor() {
        this._data = new Array<T>();
    }

    get data(): Array<T> {
        return this._data;
    }

    set data(value: Array<T>) {
        this._data = value;
    }

    get pagination(): TwitchPaginationDTO {
        return this._pagination;
    }

    set pagination(value: TwitchPaginationDTO) {
        this._pagination = value;
    }
}