import { GXTemplateInfo, GXTemplateItem, IGXDataSource } from "./GXDefine";

export default class GXTemplateDataSource implements IGXDataSource {

    private dataSource: IGXDataSource

    registerDataSource(dataSource: IGXDataSource) {
        this.dataSource = dataSource
    }

    getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo {
        return this.dataSource.getTemplateInfo(templateItem);
    }
}
