import { View, Text, Image } from "@tarojs/components";
import React, { ReactNode } from "react";
import GXExpression from "./GXExpression";
import GXTemplateContext from "./GXTemplateContext";
import { GXMeasureSize, GXTemplateData, GXTemplateItem, IGXDataSource, GXJSONObject, GXJSONValue, GXJSONArray } from "./GXDefine";
import { GXNode } from "./GXNode";
import { GXTemplateNode } from "./GXTemplateNode";
import GXCssConvertStyle from "./GXCssConvertStyle";

export default class GXViewTreeCreator {

    private dataSource: IGXDataSource;

    setDataSource(dataSource: IGXDataSource) {
        this.dataSource = dataSource;
    }

    build(gxTemplateContext: GXTemplateContext): ReactNode {

        const gxRootStyle = GXCssConvertStyle.createRootStyle(gxTemplateContext.gxMeasureSize)

        const gxTemplateData = gxTemplateContext.gxTemplateData.templateData as GXJSONObject;

        const gxTemplateInfo = gxTemplateContext.gxTemplateInfo;

        const gxVisualTemplateNode = gxTemplateContext.gxVisualTemplateNode;

        const gxRootView = this.createView(gxTemplateContext, gxTemplateData, gxTemplateInfo.layer, null, gxVisualTemplateNode)

        return <View style={gxRootStyle}>{gxRootView}</View>;
    }

    private createView(
        gxTemplateContext: GXTemplateContext,
        gxTemplateData: GXJSONObject,
        gxLayer: GXJSONObject,
        gxParentNode?: GXNode,
        gxVisualTemplateNode?: GXTemplateNode
    ): ReactNode {

        const gxTemplateInfo = gxTemplateContext.gxTemplateInfo;

        const gxNode = GXNode.create();

        gxNode.setIdPath(gxLayer, gxParentNode)

        gxNode.gxTemplateNode = GXTemplateNode.create(gxLayer, gxTemplateInfo);

        gxParentNode?.gxChildren?.push(gxNode);

        const dataResult = '';

        console.log(`node type=${gxNode.gxTemplateNode.type()}`);

        if (gxNode.gxTemplateNode.isNestChildTemplateType()) {


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
                    console.log(childLayer);
                    // 不需要传递虚拟节点
                    const childView = this.createView(gxTemplateContext, gxTemplateData, childLayer, gxNode, null);
                    childArray.push(childView);
                }
            }
            return <View style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} >
                {childArray}
            </View>;
        } else if (gxNode.gxTemplateNode.isTextType()) {
            return <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {dataResult} </Text>;
        } else if (gxNode.gxTemplateNode.isRichTextType()) {
            return <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {dataResult} </Text>;
        } else if (gxNode.gxTemplateNode.isIconFontType()) {
            return <Text style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} > {dataResult} </Text>;
        } else if (gxNode.gxTemplateNode.isImageType()) {
            return <Image style={gxNode.gxTemplateNode.finalStyle} key={gxNode.id} src={dataResult} />;
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