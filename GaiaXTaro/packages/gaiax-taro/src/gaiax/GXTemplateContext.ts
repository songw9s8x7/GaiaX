import { GXTemplateInfo, GXTemplateItem } from "./GXTemplateEngine";

export default class GXTemplateContext {
    templateItem: GXTemplateItem;
    templateInfo: GXTemplateInfo;
    isNestChildTemplate: boolean;

    constructor(templateItem: GXTemplateItem, templateInfo: GXTemplateInfo) {
        this.templateItem = templateItem;
        this.templateInfo = templateInfo;
    }
}
