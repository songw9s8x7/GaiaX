import { ReactNode } from "react";
import { GXMeasureSize, GXTemplateData, GXTemplateInfo, GXTemplateItem } from "./GXDefine";

export default class GXTemplateContext {

    gxTemplateItem: GXTemplateItem;

    gxTemplateInfo: GXTemplateInfo;

    gxTemplateData: GXTemplateData;

    gxMeasureSize: GXMeasureSize;

    isNestChildTemplate: boolean;

    rootView: ReactNode;


    constructor(gxTemplateItem: GXTemplateItem, gxTemplateData: GXTemplateData, gxMeasureSize: GXMeasureSize, gxTemplateInfo: GXTemplateInfo) {
        this.gxTemplateItem = gxTemplateItem;
        this.gxTemplateInfo = gxTemplateInfo;
        this.gxTemplateData = gxTemplateData;
        this.gxMeasureSize = gxMeasureSize;
    }
}
