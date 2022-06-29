import { ReactNode } from "react";
import { toJSON } from "./GXCssParser";
import GXTemplateContext from "./GXTemplateContext";
import GXTemplateDataSource from "./GXTemplateDataSource";
import GXViewTreeCreator from "./GXViewTreeCreator";

export class GXMeasureSize {
    templateWidth: number;
    templateHeight: number;
}

export class GXTemplateData {
    templateData: any;
}

export class GXTemplateItem {
    templateBiz: string;
    templateId: string;
}

export class GXTemplateInfo {

    static create(layer: string, css: string, data: string): GXTemplateInfo {
        let templateInfo = new GXTemplateInfo();
        templateInfo.layer = JSON.parse(layer);
        templateInfo.data = JSON.parse(data);
        templateInfo.css = toJSON(css);
        return templateInfo;
    }

    layer: any;
    data: any;
    css: any;
}

export interface IGXDataSource {
    getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo;
}


export class GXTemplateEngine {

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