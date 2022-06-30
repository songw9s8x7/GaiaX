import { ReactNode } from "react";
import { GXMeasureSize, GXTemplateData, GXTemplateInfo, GXTemplateItem, IGXDataSource } from "./GXDefine";
import GXRender from "./GXRender";
import GXTemplateContext from "./GXTemplateContext";
import GXTemplateDataSource from "./GXTemplateDataSource";


export default class GXTemplateEngine {

    private render = new GXRender()

    private data = new GXTemplateDataSource()

    createView(gxTemplateItem: GXTemplateItem, gxTemplateData: GXTemplateData, gxMeasureSize: GXMeasureSize): ReactNode {

        // 获取数据
        let gxTemplateInfo: GXTemplateInfo = this.data.getTemplateInfo(gxTemplateItem);

        // 构建上下文
        let gxTemplateContext = new GXTemplateContext(gxTemplateItem, gxTemplateData, gxMeasureSize, gxTemplateInfo);

        // 创建视图
        return this.render.createView(gxTemplateContext)
    }

    registerDataSource(dataSource: IGXDataSource) {
        this.data.registerDataSource(dataSource)
    }
}