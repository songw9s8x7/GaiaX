import { ReactNode } from "react";
import { toJSON } from "./GXCssParser";
import GXTemplateContext from "./GXTemplateContext";
import GXTemplateDataSource from "./GXTemplateDataSource";
import GXViewTreeCreator from "./GXViewTreeCreator";

export class GXTemplateItem {
    templateWidth: number;
    templateHeight: number;
    templateBiz: string;
    templateId: string;
    templateData: {};
}

export class GXTemplateInfo {

    static create(layer: string, css: string, data: string): GXTemplateInfo {
        let templateInfo = new GXTemplateInfo();
        templateInfo.layer = JSON.parse(layer);
        templateInfo.data = JSON.parse(data);
        templateInfo.css = toJSON(css);
        return templateInfo;
    }

    layer: {};
    data: {};
    css: {};
}

export interface IGXDataSource {
    getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo;
}


export interface GXTemplateProps {
    templateItem: GXTemplateItem
}

export class GXTemplateEngine {

    private viewTreeCreator = new GXViewTreeCreator()

    private dataSource = new GXTemplateDataSource()

    createView(templateItem: GXTemplateItem): ReactNode {

        this.viewTreeCreator.setDataSource(this.dataSource)

        // 获取数据
        let templateInfo = this.getTemplateInfo(templateItem)
        // 构建上下文
        let templateContext = new GXTemplateContext(templateItem, templateInfo);
        // 创建视图
        return this.viewTreeCreator.build(templateContext)
    }

    private getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo {
        return this.dataSource.getTemplateInfo(templateItem);
    }

    registerDataSource(dataSource: IGXDataSource) {
        this.dataSource.registerDataSource(dataSource)
    }
}

export const GXEngineInstance = new GXTemplateEngine()