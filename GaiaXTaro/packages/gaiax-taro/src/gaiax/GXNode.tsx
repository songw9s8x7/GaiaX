import { GXJSONObject } from "./GXDefine";
import { GXTemplateNode } from "./GXTemplateNode";

export class GXNode {

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