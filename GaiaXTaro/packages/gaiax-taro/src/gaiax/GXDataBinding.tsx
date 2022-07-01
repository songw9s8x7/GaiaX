
import GXExpression from "./GXExpression";
import { GXJSONObject } from "./GXJson";

export default class GXDataBinding {

    static getExtend(data?: GXJSONObject, gxTemplateData?: GXJSONObject): GXJSONObject {
        if (data != null && data.extend != null) {
            return GXExpression.desireData(data.extend, gxTemplateData) as GXJSONObject
        }
        return null;
    }

    static getData(data?: GXJSONObject, gxTemplateData?: GXJSONObject): GXJSONObject {
        if (data != null && data.value != null) {
            return GXExpression.desireData(data.value, gxTemplateData) as GXJSONObject
        }
        return {} as GXJSONObject;
    }

}