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

        const gxRootView = this.createView(gxTemplateContext, gxTemplateData, gxTemplateInfo, gxLayer, gxParentNode, gxVisualTemplateNode)

        return <View style={gxRootStyle}>{gxRootView}</View>;
    }

    private createView(
        gxTemplateContext: GXTemplateContext,
        gxTemplateData: GXJSONObject,
        gxTemplateInfo: GXTemplateInfo,
        gxLayer: GXJSONObject,
        gxParentNode?: GXNode,
        gxVisualTemplateNode?: GXTemplateNode
    ): ReactNode {

        const gxNode = GXNode.create();

        gxNode.setIdPath(gxLayer, gxParentNode)

        gxNode.gxTemplateNode = GXTemplateNode.create(gxLayer, gxTemplateInfo, gxVisualTemplateNode);

        gxParentNode?.gxChildren?.push(gxNode);

        if (gxNode.gxTemplateNode.isNestChildTemplateType()) {

            const gxChildTemplateInfo = gxTemplateInfo.getChildTemplate(gxLayer.id);

            if (gxChildTemplateInfo != null && gxChildTemplateInfo != undefined) {

                const gxChildVisualTemplateNode = GXTemplateNode.create(gxLayer.id, gxTemplateInfo, null);

                const gxChildLayer = gxChildTemplateInfo.layer;

                // 容器模板下的子模板
                if (gxNode.gxTemplateNode.isContainerType()) {
                }
                // 普通模板嵌套的子模板根节点，可能是普通模板也可能是容器模板
                else {

                    const gxChildTemplateData = gxChildVisualTemplateNode.getData(gxTemplateData);

                    return this.createView(
                        gxTemplateContext,
                        gxChildTemplateData,
                        gxChildTemplateInfo,
                        gxChildLayer,
                        gxNode,
                        gxChildVisualTemplateNode
                    );
                }
            } else {
                return <View style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} />;
            }

        } else if (gxNode.gxTemplateNode.isContainerType()) {

            // case 'grid':
            // return <View style={finalNodeStyle} key={gxLayer.id} />;
            // case 'scroll':
            // return <View style={finalNodeStyle} key={gxLayer.id} />;
        } else if (gxNode.gxTemplateNode.isViewType() || gxNode.gxTemplateNode.isGaiaTemplate()) {

            gxNode.gxTemplateNode.initFinal(gxTemplateContext, gxTemplateData, null, gxNode);

            const childArray: ReactNode[] = [];
            const layers = gxLayer['layers'] as GXJSONArray;
            if (layers != null) {
                for (const target of layers) {
                    const childLayer = target as GXJSONObject;
                    const childView = this.createView(
                        gxTemplateContext,
                        gxTemplateData,
                        gxTemplateInfo,
                        childLayer,
                        gxNode,
                        null
                    );
                    childArray.push(childView);
                }
            }
            return <View style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} >
                {childArray}
            </View>;
        } else if (gxNode.gxTemplateNode.isTextType()) {
            const data = gxNode.gxTemplateNode.getData(gxTemplateData);
            return <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {data.value} </Text>;
        } else if (gxNode.gxTemplateNode.isRichTextType()) {
            return <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {'GaiaX'} </Text>;
        } else if (gxNode.gxTemplateNode.isIconFontType()) {
            return <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {'GaiaX'} </Text>;
        } else if (gxNode.gxTemplateNode.isImageType()) {
            return <Image style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} src={'GaiaX'} />;
        } else {
            return < View style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} />
        }

        // switch (gxLayer.type) {
        //     case 'gaia-template':
        //         if (gxLayer['sub-type'] == 'custom') {
        //             const nestTemplateItem = new GXTemplateItem();
        //             nestTemplateItem.templateBiz = gxTemplateContext.gxTemplateItem.templateBiz;
        //             nestTemplateItem.templateId = gxLayer.id;
        //             const nestTemplateInfo = this.dataSource.getTemplateInfo(nestTemplateItem);
        //             const measureSize = new GXMeasureSize();
        //             const nestTemplateData = new GXTemplateData();
        //             if (nestTemplateInfo != null && nestTemplateInfo != undefined) {
        //                 let gxTemplateContext = new GXTemplateContext(nestTemplateItem, nestTemplateData, measureSize, nestTemplateInfo);
        //                 gxTemplateContext.isNestChildTemplate = true;
        //                 gxNode.finalNodeStyle = gxParentNode.finalNodeStyle;
        //                 gxNode.nodeCss = gxParentNode.nodeCss;
        //                 const gxTemplateNode = new GXTemplateNode();
        //                 gxTemplateNode.finalNodeCss = finalNodeCss;
        //                 gxTemplateNode.finalNodeStyle = finalNodeStyle;
        //                 return this.createView(gxTemplateContext, nestTemplateInfo.layer, gxNode, gxTemplateNode);
        //             } else {
        //                 return <View style={finalNodeStyle} key={gxLayer.id} />;
        //             }
        //         } else {
        //             // 普通层级
        //             if (gxLayer.layers != null && gxLayer.layers != undefined) {
        //                 const childArray: ReactNode[] = [];
        //                 for (var i = 0; i < gxLayer.layers.length; i++) {
        //                     const childLayer = gxLayer.layers[i] as GXJSONObject;
        //                     gxNode.finalNodeStyle = finalNodeStyle;
        //                     childArray.push(this.createView(gxTemplateContext, childLayer, gxNode, null))
        //                 }
        //                 return <View style={finalNodeStyle} key={gxLayer.id} >
        //                     {childArray}
        //                 </View>;
        //             } else {
        //                 return <View style={finalNodeStyle} key={gxLayer.id} />;
        //             }
        //         }
        //     default:
        //         // 不会走到
        //         return <View style={finalNodeStyle} key={gxLayer.id} />;
        // }
    }
}