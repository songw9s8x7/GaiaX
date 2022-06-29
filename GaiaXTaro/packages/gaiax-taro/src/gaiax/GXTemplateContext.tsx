import { GXMeasureSize, GXTemplateData, GXTemplateInfo, GXTemplateItem } from "./GXTemplateEngine";

export default class GXTemplateContext {

    gxTemplateItem: GXTemplateItem;
    gxTemplateInfo: GXTemplateInfo;
    gxTemplateData: GXTemplateData;
    gxMeasureSize: GXMeasureSize;
    isNestChildTemplate: boolean;

    constructor(gxTemplateItem: GXTemplateItem, gxTemplateData: GXTemplateData, gxMeasureSize: GXMeasureSize, gxTemplateInfo: GXTemplateInfo) {
        this.gxTemplateItem = gxTemplateItem;
        this.gxTemplateInfo = gxTemplateInfo;
        this.gxTemplateData = gxTemplateData;
        this.gxMeasureSize = gxMeasureSize;
    }
}
