import { GXJSONObject } from "./GXDefine";
import GXExpression from "./GXExpression";

export default class GXDataBinding {
    static getExtend(extend?: GXJSONObject, gxTemplateData?: GXJSONObject): GXJSONObject {
        if (extend != null) {
            return GXExpression.desireData(extend, gxTemplateData) as GXJSONObject
        }
    }

}