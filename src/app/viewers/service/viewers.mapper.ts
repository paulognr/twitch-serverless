import {ViewerEntity} from "../repository/viewer.entity";
import {ViewerDTO} from "../api/viewer.dto";
import {morphism, StrictSchema} from "morphism";

export class ViewersMapper {

    public entityToDTO(entity:ViewerEntity): ViewerDTO {
        return morphism<StrictSchema<ViewerDTO, ViewerEntity>>(this.getEntityToDTOSchema(), entity);
    }

    private getEntityToDTOSchema(): any {
        return {
            _viewers: 'viewers',
            _gameId: 'game_id',
            _gameName: 'game_name',
            _datetime: 'created_at',
        };
    }

}