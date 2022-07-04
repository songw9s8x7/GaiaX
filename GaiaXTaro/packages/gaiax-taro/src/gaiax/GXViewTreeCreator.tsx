import { View, Text, Image } from "@tarojs/components";
import React, { ReactNode } from "react";
import GXTemplateContext from "./GXTemplateContext";
import { GXNode } from "./GXNode";
import GXTemplateNode from "./GXTemplateNode";
import GXCssConvertStyle from "./GXCssConvertStyle";
import GXTemplateInfo from "./GXTemplateInfo";
import { GXJSONArray, GXJSONObject } from "./GXJson";
import GXDataBinding from "./GXDatabinding";

export default class GXViewTreeCreator {

    build(gxTemplateContext: GXTemplateContext): ReactNode {

        const gxRootStyle = GXCssConvertStyle.createRootStyle(gxTemplateContext.gxMeasureSize)

        const gxTemplateData = gxTemplateContext.gxTemplateData.templateData as GXJSONObject;

        const gxTemplateInfo = gxTemplateContext.gxTemplateInfo;

        const gxLayer = gxTemplateInfo.layer;

        const gxParentNode = null;

        const gxVisualTemplateNode = gxTemplateContext.gxVisualTemplateNode;

        const gxRootNode = this.createNode(gxTemplateContext, gxTemplateData, gxTemplateInfo, gxLayer, gxParentNode, gxVisualTemplateNode)

        return <View style={gxRootStyle}>{gxRootNode.gxView}</View>;
    }

    private createNode(
        gxTemplateContext: GXTemplateContext,
        gxTemplateData: GXJSONObject,
        gxTemplateInfo: GXTemplateInfo,
        gxLayer: GXJSONObject,
        gxParentNode?: GXNode,
        gxVisualTemplateNode?: GXTemplateNode
    ): GXNode {

        const gxNode = GXNode.create();

        gxNode.setIdPath(gxLayer, gxParentNode)

        gxNode.gxTemplateNode = GXTemplateNode.create(gxLayer, gxTemplateInfo, gxVisualTemplateNode);

        if (gxNode.gxTemplateNode.isContainerType()) {

            // case 'grid':
            // return <View style={finalNodeStyle} key={gxLayer.id} />;
            // case 'scroll':
            // return <View style={finalNodeStyle} key={gxLayer.id} />;
        } else if (gxNode.gxTemplateNode.isViewType() || gxNode.gxTemplateNode.isGaiaTemplate()) {

            gxNode.gxTemplateNode.initFinal(gxTemplateContext, gxTemplateData, null, gxNode);

            const childArray: ReactNode[] = [];
            const layers = gxLayer['layers'] as GXJSONArray;

            if (layers != null) {

                if (gxNode != null && gxNode.gxChildren == null) {
                    gxNode.gxChildren = new Array<GXNode>();
                }

                for (const target of layers) {

                    const childLayer = target as GXJSONObject;

                    if (GXTemplateNode.isNestChildTemplateType(childLayer)) {

                        const gxChildTemplateInfo = gxTemplateInfo.getChildTemplate(childLayer.id);

                        const gxChildVisualTemplateNode = GXTemplateNode.create(childLayer, gxTemplateInfo, null);

                        const gxChildLayer = gxChildTemplateInfo.layer;

                        // 容器模板下的子模板
                        if (gxNode.gxTemplateNode.isContainerType()) {
                        }
                        // 普通模板嵌套的子模板根节点，可能是普通模板也可能是容器模板
                        else {

                            const gxChildTemplateData = gxChildVisualTemplateNode.getData(gxTemplateData);

                            const childNode = this.createNode(
                                gxTemplateContext,
                                gxChildTemplateData,
                                gxChildTemplateInfo,
                                gxChildLayer,
                                gxNode,
                                gxChildVisualTemplateNode
                            );
    
                            gxNode?.gxChildren?.push(childNode);
    
                            childArray.push(childNode.gxView);
                        }
                    } else {
                        const childNode = this.createNode(
                            gxTemplateContext,
                            gxTemplateData,
                            gxTemplateInfo,
                            childLayer,
                            gxNode,
                            null
                        );

                        gxNode?.gxChildren?.push(childNode);

                        childArray.push(childNode.gxView);
                    }
                }
            }

            gxNode.gxView = <View style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} >
                {childArray}
            </View>;
        } else if (gxNode.gxTemplateNode.isTextType()) {
            const data = gxNode.gxTemplateNode.getData(gxTemplateData);
            gxNode.gxView = <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {data.value} </Text>;
        } else if (gxNode.gxTemplateNode.isRichTextType()) {
            gxNode.gxView = <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {'GaiaX'} </Text>;
        } else if (gxNode.gxTemplateNode.isIconFontType()) {
            gxNode.gxView = <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {'GaiaX'} </Text>;
        } else if (gxNode.gxTemplateNode.isImageType()) {
            gxNode.gxView = <Image style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} src={'GaiaX'} />;
        } else {
            gxNode.gxView = < View style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} />
        }

        return gxNode;
    }
}