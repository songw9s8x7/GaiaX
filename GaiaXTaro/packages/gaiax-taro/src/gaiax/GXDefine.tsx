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

/**
 * 节点的原始样式
 */
export class GXTemplateNode {

    finalNodeStyle: React.CSSProperties;
    finalNodeCss: any;

    layer: GXJSONObject;
    css: GXJSONObject;
    data: GXJSONObject;
    event: GXJSONObject;
    animation: GXJSONObject;

    isNestChildTemplateType(): boolean {
        return GXTemplateNode.isNestChildTemplateType(this.layer);
    }

    isContainerType(): boolean {
        return GXTemplateNode.isContainerType(this.layer);
    }

    isCustomType(): boolean {
        return GXTemplateNode.isCustomType(this.layer);
    }

    isTextType(): boolean {
        return GXTemplateNode.isTextType(this.layer);
    }

    isRichTextType(): boolean {
        return GXTemplateNode.isRichTextType(this.layer);
    }

    isIconFontType(): boolean {
        return GXTemplateNode.isIconFontType(this.layer);
    }

    isLottieType(): boolean {
        return GXTemplateNode.isLottieType(this.layer);
    }

    isImageType(): boolean {
        return GXTemplateNode.isImageType(this.layer);
    }

    isViewType(): boolean {
        return GXTemplateNode.isViewType(this.layer);
    }

    isGaiaTemplate(): boolean {
        return GXTemplateNode.isGaiaTemplate(this.layer);
    }

    isGridType(): boolean {
        return GXTemplateNode.isGridType(this.layer);
    }

    isScrollType(): boolean {
        return GXTemplateNode.isScrollType(this.layer);
    }

    isSliderType(): boolean {
        return GXTemplateNode.isSliderType(this.layer);
    }

    static isNestChildTemplateType(layer: GXJSONObject): boolean {
        return layer != null &&
            layer['type'] == 'gaia-template'
            && layer['sub-type'] == 'custom'
            && layer['view-class-android'] == null
            && layer['view-class-ios'] == null
    }

    static isContainerType(layer: GXJSONObject): boolean {
        return layer != null && GXTemplateNode.isScrollType(layer) || GXTemplateNode.isGridType(layer) || GXTemplateNode.isSliderType(layer);
    }

    static isCustomType(layer: GXJSONObject): boolean {
        return false
    }

    static isTextType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'text'
    }

    static isRichTextType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'richtext'
    }

    static isIconFontType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'iconfont'
    }

    static isLottieType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'lottie'
    }

    static isImageType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'image'
    }

    static isViewType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'view' || layer['type'] == 'gaia-template' && layer['sub-type'] != null
    }

    static isGaiaTemplate(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'gaia-template'
    }

    static isGridType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'gaia-template' && layer['sub-type'] == 'grid'
    }

    static isScrollType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'gaia-template' && layer['sub-type'] == 'scroll'
    }

    static isSliderType(layer: GXJSONObject): boolean {
        return layer != null && layer['type'] == 'gaia-template' && layer['sub-type'] == 'slider'
    }

    static create(gxLayer: GXJSONObject, gxTemplateInfo: GXTemplateInfo): GXTemplateNode {
        const gxTemplateNode = new GXTemplateNode()
        // 获取原始节点的层级
        gxTemplateNode.layer = gxLayer
        // 获取原始节点的样式
        gxTemplateNode.css = gxTemplateInfo.css['#' + gxLayer['id']] || gxTemplateInfo.css['.' + gxLayer['id']]
        // 获取原始节点的数据
        gxTemplateNode.data = gxTemplateInfo.data['data']?.[gxLayer['id']];
        // 获取原始节点的事件
        gxTemplateNode.event = gxTemplateInfo.data['event'];
        // 获取原始节点的动画
        gxTemplateNode.animation = gxTemplateInfo.data['animation'];
        return gxTemplateNode;
    }
}

export class GXNode {

    isContainerType(): boolean {
        return this.gxTemplateNode.isContainerType();
    }

    isNestChildTemplateType(): boolean {
        return this.gxTemplateNode.isNestChildTemplateType();
    }

    finalNodeStyle: React.CSSProperties;
    nodeCss: any;

    gxTemplateNode: GXTemplateNode;

    id: string = '';
    idPath: string = '';
    gxChildren: Array<GXNode>;

    setIdPath(gxLayer: GXJSONObject, gxParentNode?: GXNode) {
        this.id = gxLayer['id'];
        if (gxParentNode != null) {
            if (this.idPath.length != 0) {
                this.idPath = `${gxParentNode.idPath}@${this.idPath}@${this.id}`
            } else {
                this.idPath = `${gxParentNode.idPath}@${this.id}`
            }
        } else {
            if (this.idPath.length != 0) {
                this.idPath = `${this.idPath}@${this.id}`
            } else {
                this.idPath = this.id
            }
        }
    }
    static create(): GXNode {
        return new GXNode();
    }
}

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