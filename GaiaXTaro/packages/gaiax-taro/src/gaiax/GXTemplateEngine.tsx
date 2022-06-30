import { ReactNode } from "react";
import { GXMeasureSize, GXTemplateData, GXTemplateInfo, GXTemplateItem, IGXDataSource } from "./GXDefine";
import GXTemplateContext from "./GXTemplateContext";
import GXTemplateDataSource from "./GXTemplateDataSource";
import GXViewTreeCreator from "./GXViewTreeCreator";


export default class GXTemplateEngine {

    private viewTreeCreator = new GXViewTreeCreator()

    private dataSource = new GXTemplateDataSource()

    constructor() {
        this.viewTreeCreator.setDataSource(this.dataSource)
    }

    createView(gxTemplateItem: GXTemplateItem, gxTemplateData: GXTemplateData, gxMeasureSize: GXMeasureSize): ReactNode {

        // 获取数据
        let gxTemplateInfo = this.getTemplateInfo(gxTemplateItem)

        // 构建上下文
        let gxTemplateContext = new GXTemplateContext(gxTemplateItem, gxTemplateData, gxMeasureSize, gxTemplateInfo);

        // 创建视图
        return this.viewTreeCreator.build(gxTemplateContext)
    }

    private getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo {
        return this.dataSource.getTemplateInfo(templateItem);
    }

    registerDataSource(dataSource: IGXDataSource) {
        this.dataSource.registerDataSource(dataSource)
    }
}