import {ViewersService} from "../../../../src/app/viewers/service/viewers.service";
import {ViewerDTO} from "../../../../src/app/viewers/api/viewer.dto";
import {ViewersRepository} from "../../../../src/app/viewers/repository/viewers.repository";

jest.mock('../../../../src/app/viewers/repository/viewers.repository');

describe("saveAll", () => {
    let viewersService: ViewersService = new ViewersService();

    beforeEach(() => {
        ViewersRepository.prototype.saveAll = jest.fn().mockClear();
    });

    it("test", async (done) => {
        const viewerDTO: ViewerDTO = new ViewerDTO();
        await viewersService.saveAll(new Array<ViewerDTO>(viewerDTO));
    })
});