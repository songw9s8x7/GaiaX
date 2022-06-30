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
        return this.layer['type'] == 'gaia-template'
            && this.layer['sub-type'] == 'custom'
            && this.layer['view-class-android'] == null
            && this.layer['view-class-ios'] == null
    }

    isContainerType(): boolean {
        return this.isScrollType() || this.isGridType() || this.isSliderType();
    }

    isCustomType(): boolean {
        return false
    }

    isTextType(): boolean {
        return this.layer['type'] == 'text'
    }

    isRichTextType(): boolean {
        return this.layer['type'] == 'richtext'
    }

    isIconFontType(): boolean {
        return this.layer['type'] == 'iconfont'
    }

    isLottieType(): boolean {
        return this.layer['type'] == 'lottie'
    }

    isImageType(): boolean {
        return this.layer['type'] == 'image'
    }

    isViewType(): boolean {
        return this.layer['type'] == 'view' || this.layer['type'] == 'gaia-template' && this.layer['sub-type'] != null
    }

    isGaiaTemplate(): boolean {
        return this.layer['type'] == 'gaia-template'
    }

    isGridType(): boolean {
        return this.layer['type'] == 'gaia-template' && this.layer['sub-type'] == 'grid'
    }

    isScrollType(): boolean {
        return this.layer['type'] == 'gaia-template' && this.layer['sub-type'] == 'scroll'
    }

    isSliderType(): boolean {
        return this.layer['type'] == 'gaia-template' && this.layer['sub-type'] == 'slider'
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