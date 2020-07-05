import {ViewerDTO} from "../api/viewer.dto";
import {ViewersRepository} from "../repository/viewers.repository";
import {ViewersValidate} from "./viewers.validate";
import {ViewerEntity} from "../repository/viewer.entity";
import {ViewersMapper} from "./viewers.mapper";

export class ViewersService {

    private viewersRepository: ViewersRepository;
    private viewersMapper: ViewersMapper;

    constructor() {
        this.viewersRepository = new ViewersRepository();
        this.viewersMapper = new ViewersMapper();
    }

    public async saveAll(viewerDTOS: Array<ViewerDTO>): Promise<Array<ViewerDTO>> {
        const viewers = viewerDTOS
            .map((viewerDTO) => {
                this.validateViewer(viewerDTO);
                const viewer = new ViewerEntity();
                viewer.game_id = viewerDTO.gameId;
                viewer.game_name = viewerDTO.gameName;
                viewer.viewers = viewerDTO.viewers;
                return viewer;
            })

        return this.viewersRepository.saveAll(viewers).then(() => viewerDTOS);
    }

    public async search(gamesId:Array<number>, startDate:Date, endDate:Date): Promise<Array<ViewerDTO>> {
        const promises = new Array<Promise<Array<ViewerEntity>>>();
        gamesId.forEach(gameId => promises.push(this.viewersRepository.search(gameId, startDate, endDate)))

        let viewersDTO = Array<ViewerDTO>();
        await Promise.all(promises).then(promises => {
            promises.forEach(viewersEntity => {
                viewersDTO = viewersDTO.concat(
                    viewersEntity.map(viewerEntity => this.viewersMapper.entityToDTO(viewerEntity))
                );
            })
        });
        return Promise.resolve(viewersDTO);
    }

    private async validateViewer(viewerDTO: ViewerDTO) {
        await ViewersValidate.getValidator().validateAsync(viewerDTO);
    }
}