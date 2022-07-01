import { toJSON } from "./GXCssParser";

export interface IGXDataSource {
    getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo;
}

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

export type GXJSONValue =
    | string
    | number
    | boolean
    | any
    | GXJSONObject
    | GXJSONArray
    | null
    | {}

export interface GXJSONObject {
    layers: GXJSONArray;
    [k: string]: GXJSONValue;
}

export interface GXJSONArray extends Array<GXJSONValue> { }

export class GXTemplateInfo {

    static create(layer: string, css: string, data: string): GXTemplateInfo {
        let templateInfo = new GXTemplateInfo();
        templateInfo.layer = JSON.parse(layer);
        templateInfo.data = JSON.parse(data);
        templateInfo.css = toJSON(css);
        return templateInfo;
    }

    layer: GXJSONObject;
    data: GXJSONObject;
    css: GXJSONObject;
}