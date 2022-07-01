import { View, Text, Image } from "@tarojs/components";
import React, { ReactNode } from "react";
import GXExpression from "./GXExpression";
import GXTemplateContext from "./GXTemplateContext";
import PropTypes, { InferProps } from 'prop-types'
import { GXMeasureSize, GXTemplateData, GXTemplateItem, IGXDataSource, GXJSONObject, GXJSONValue, GXTemplateNode, GXNode, GXJSONArray } from "./GXDefine";
import { logDOM } from "@testing-library/react";

export default class GXViewTreeCreator {

    private dataSource: IGXDataSource;

    setDataSource(dataSource: IGXDataSource) {
        this.dataSource = dataSource;
    }

    build(gxTemplateContext: GXTemplateContext): ReactNode {

        const gxRootStyle = this.createRootStyle(gxTemplateContext.gxMeasureSize)

        const gxTemplateInfo = gxTemplateContext.gxTemplateInfo;

        const gxVisualTemplateNode = gxTemplateContext.gxVisualTemplateNode;

        const gxRootView = this.createView(gxTemplateContext, gxTemplateInfo.layer, null, gxVisualTemplateNode)

        return <View style={gxRootStyle}>{gxRootView}</View>;
    }

    private createView(
        gxTemplateContext: GXTemplateContext,
        gxLayer: GXJSONObject,
        gxParentNode?: GXNode,
        gxVisualTemplateNode?: GXTemplateNode
    ): ReactNode {

        const gxTemplateInfo = gxTemplateContext.gxTemplateInfo;

        const gxNode = GXNode.create();

        gxNode.setIdPath(gxLayer, gxParentNode)

        gxNode.gxTemplateNode = GXTemplateNode.create(gxLayer, gxTemplateInfo);

        gxParentNode?.gxChildren?.push(gxNode);

        let nodeExtendRawCss = {};
        let dataResult = '';
        if (typeof gxNode.gxTemplateNode.data == 'object') {

            // 获取数据绑定结果
            const nodeValueData = gxNode.gxTemplateNode.data.value
            if (nodeValueData != undefined) {
                const nodeValueResult = GXExpression.desireData(nodeValueData, gxTemplateContext.gxTemplateData.templateData)
                if (nodeValueResult != null) {
                    dataResult = nodeValueResult;
                }
            }

            // 获取样式绑定的结果
            const nodeExtendData = gxNode.gxTemplateNode.data.extend
            if (nodeExtendData != undefined) {
                const nodeExtendResult = GXExpression.desireData(nodeExtendData, gxTemplateContext.gxTemplateData.templateData)
                if (nodeExtendResult != null) {
                    nodeExtendRawCss = nodeExtendResult;
                }
            }
        } else if (typeof gxNode.gxTemplateNode.data == 'string') {
            dataResult = gxNode.gxTemplateNode.data;
        }

        const finalNodeCss = Object.assign({}, gxNode.gxTemplateNode.css, nodeExtendRawCss, gxVisualTemplateNode?.finalNodeCss || {});

        // 获取转换后的节点样式
        gxNode.finalNodeStyle = this.createViewStyleByCss(gxTemplateContext, gxLayer, finalNodeCss, gxParentNode);

        console.log(`node type=${gxNode.gxTemplateNode.type()}`);

        if (gxNode.gxTemplateNode.isNestChildTemplateType()) {


        } else if (gxNode.gxTemplateNode.isContainerType()) {

            // case 'grid':
            // return <View style={finalNodeStyle} key={gxLayer.id} />;
            // case 'scroll':
            // return <View style={finalNodeStyle} key={gxLayer.id} />;
        } else if (gxNode.gxTemplateNode.isViewType() || gxNode.gxTemplateNode.isGaiaTemplate()) {
            const childArray: ReactNode[] = [];
            const layers = gxLayer['layers'] as GXJSONArray;
            if (layers != null) {
                for (const target of layers) {
                    const childLayer = target as GXJSONObject;
                    console.log(childLayer);
                    // 不需要传递虚拟节点
                    const childView = this.createView(gxTemplateContext, childLayer, gxNode, null);
                    childArray.push(childView);
                }
            }
            return <View style={gxNode.finalNodeStyle} key={gxNode.id} >
                {childArray}
            </View>;
        } else if (gxNode.gxTemplateNode.isTextType()) {
            return <Text style={gxNode.finalNodeStyle} key={gxNode.id} > {dataResult} </Text>;
        } else if (gxNode.gxTemplateNode.isRichTextType()) {
            return <Text style={gxNode.finalNodeStyle} key={gxNode.id} > {dataResult} </Text>;
        } else if (gxNode.gxTemplateNode.isIconFontType()) {
            return <Text style={gxNode.finalNodeStyle} key={gxNode.id} > {dataResult} </Text>;
        } else if (gxNode.gxTemplateNode.isImageType()) {
            return <Image style={gxNode.finalNodeStyle} key={gxNode.id} src={dataResult} />;
        } else {
            return < View style={gxNode.finalNodeStyle} key={gxNode.id} />
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

    private updateViewStyleByCss(context: GXTemplateContext, nodeStyle: any, layer: any, nodeCss: any, gxParentNode?: GXNode) {

        // Layout

        let display = nodeCss['display'];
        if (display != undefined) {
            nodeStyle.display = display;
        }

        let direction = nodeCss['direction'];
        if (direction != undefined) {
            nodeStyle.direction = direction;
        }

        let flexDirection = nodeCss['flex-direction'];
        if (flexDirection != undefined) {
            nodeStyle.flexDirection = flexDirection;
        }

        let flexWrap = nodeCss['flex-wrap'];
        if (flexWrap != undefined) {
            nodeStyle.flexWrap = flexWrap;
        }

        let overflow = nodeCss['overflow'];
        if (overflow != undefined) {
            nodeStyle.overflow = overflow;
        }

        let alignItems = nodeCss['align-items'];
        if (alignItems != undefined) {
            nodeStyle.alignItems = alignItems;
        }

        let alignSelf = nodeCss['align-self'];
        if (alignSelf != undefined) {
            nodeStyle.alignSelf = alignSelf;
        }

        let alignContent = nodeCss['align-content'];
        if (alignContent != undefined) {
            nodeStyle.alignContent = alignContent;
        }

        let justifyContent = nodeCss['justify-content'];
        if (justifyContent != undefined) {
            nodeStyle.justifyContent = justifyContent;
        }

        let flexGrow = nodeCss['flex-grow'];
        if (flexGrow != undefined) {
            nodeStyle.flexGrow = flexGrow;
        }

        let flexShrink = nodeCss['flex-shrink'];

        if (flexShrink != undefined) {
            nodeStyle.flexShrink = flexShrink;
        }

        let flexBasis = nodeCss['flex-basis'];
        if (flexBasis != undefined) {
            nodeStyle.flexBasis = flexBasis;
        }

        let position = nodeCss['position'];
        if (position != undefined) {
            nodeStyle.position = position;
        }

        let left = nodeCss['left'];
        if (left != undefined) {
            nodeStyle.left = left;
        }

        let right = nodeCss['right'];
        if (right != undefined) {
            nodeStyle.right = right;
        }

        let top = nodeCss['top'];
        if (top != undefined) {
            nodeStyle.top = top;
        }

        let bottom = nodeCss['bottom'];
        if (bottom != undefined) {
            nodeStyle.bottom = bottom;
        }

        let marginLeft = nodeCss['margin-left'];
        if (marginLeft != undefined) {
            nodeStyle.marginLeft = marginLeft;
        }

        let marginTop = nodeCss['margin-top'];
        if (marginTop != undefined) {
            nodeStyle.marginTop = marginTop;
        }

        let marginRight = nodeCss['margin-right'];
        if (marginRight != undefined) {
            nodeStyle.marginRight = marginRight;
        }

        let marginBottom = nodeCss['margin-bottom'];
        if (marginBottom != undefined) {
            nodeStyle.marginBottom = marginBottom;
        }

        let paddingLeft = nodeCss['padding-left'];
        if (paddingLeft != undefined) {
            nodeStyle.paddingLeft = paddingLeft;
        }

        let paddingTop = nodeCss['padding-top'];
        if (paddingTop != undefined) {
            nodeStyle.paddingTop = paddingTop;
        }

        let paddingRight = nodeCss['padding-right'];
        if (paddingRight != undefined) {
            nodeStyle.paddingRight = paddingRight;
        }

        let paddingBottom = nodeCss['padding-bottom'];
        if (paddingBottom != undefined) {
            nodeStyle.paddingBottom = paddingBottom;
        }

        let width = nodeCss['width'];
        if (width != undefined) {
            nodeStyle.width = width;
        }

        let height = nodeCss['height'];
        if (height != undefined) {
            nodeStyle.height = height;
        }

        let minWidth = nodeCss['min-width'];
        if (minWidth != undefined) {
            nodeStyle.minWidth = minWidth;
        }

        let minHeight = nodeCss['min-height'];
        if (minHeight != undefined) {
            nodeStyle.minHeight = minHeight;
        }

        let maxWidth = nodeCss['max-width'];
        if (maxWidth != undefined) {
            nodeStyle.maxWidth = maxWidth;
        }

        let maxHeight = nodeCss['max-height'];
        if (maxHeight != undefined) {
            nodeStyle.maxHeight = maxHeight;
        }

        // 特殊处理：图片不允许被压缩
        if (layer.type == 'image') {
            nodeStyle.flexShrink = '0';
        }

        // 特殊处理：在微信小程序上不生效;在H5上生效
        // 小程序不支持
        let aspectRatio = nodeCss['aspect-ratio'];
        if (aspectRatio != undefined) {
            nodeStyle.aspectRatio = aspectRatio;
        }

        // 特殊处理：如果横向，文字是固定宽度，那么不能被压缩
        if (gxParentNode != null && gxParentNode.finalNodeStyle.flexDirection == 'row' && width != undefined) {
            nodeStyle.flexShrink = '0';
        }

        // 特殊处理：如果竖向, 文字是固定高度，那么不能被压缩
        if (gxParentNode != null && gxParentNode.finalNodeStyle.flexDirection == 'column' && height != undefined) {
            nodeStyle.flexShrink = '0';
        }

        // 特殊处理：对文字自适应的处理
        let fitContent = nodeCss['fit-content'];
        // 如果宽度是auto并且设置的自增长，那么fitcontent之后，需要按照实际的宽度设置
        if ((width == 'auto' || width == undefined) && flexGrow == '1' && (fitContent == 'true' || fitContent == true)) {
            nodeStyle.flexGrow = '0';
        }
        // 特殊处理：如果宽度是具体的像素值，并且设置了fitcontent，那么需要宽度auto
        else if (width != undefined && width.endsWith('px') && (fitContent == 'true' || fitContent == true)) {
            nodeStyle.width = 'auto';
        }

        // Style 

        switch (layer.type) {
            case 'gaia-template':
                // 如果是嵌套模板的根节点，并且宽度100%，有左右padding信息，那么需要可以被压缩
                if (context.isNestChildTemplate && layer['sub-type'] == undefined) {
                    if (width == '100%' && (paddingLeft != undefined || paddingRight != undefined)) {
                        nodeStyle.flexShrink = '1';
                        // 若还是垂直布局，那么宽度需要auto
                        if (gxParentNode != null && gxParentNode.finalNodeStyle.flexDirection == 'column') {
                            nodeStyle.width = 'auto';
                        }
                    }
                }
                break;
            case 'view': break;
            case 'text':
            case 'richtext':
            case 'iconfont':
                let fontSize = nodeCss['font-size'];
                if (fontSize != undefined) {
                    nodeStyle.fontSize = fontSize;
                }

                let fontFamily = nodeCss['font-family'];
                if (fontFamily != undefined) {
                    nodeStyle.fontFamily = fontFamily;
                }

                let fontWeight = nodeCss['font-weight'];
                if (fontWeight != undefined) {
                    nodeStyle.fontWeight = fontWeight;
                }

                let color = nodeCss['color'];
                if (color != undefined) {
                    nodeStyle.color = color;
                }

                let textOverflow = nodeCss['text-overflow'];
                nodeStyle.textOverflow = "ellipsis"
                if (textOverflow != undefined) {
                    nodeStyle.textOverflow = textOverflow;
                }

                let textAlign = nodeCss['text-align'];
                if (textAlign != undefined) {
                    nodeStyle.textAlign = textAlign;
                }

                let lineHeight = nodeCss['line-height'];
                if (lineHeight != undefined) {
                    nodeStyle.lineHeight = lineHeight;
                }

                // 特殊处理：文字默认居中
                if (height != undefined && height.endsWith('px')) {
                    nodeStyle.lineHeight = height;
                }

                let textDecoration = nodeCss['text-decoration'];
                if (textDecoration != undefined) {
                    nodeStyle.textDecoration = textDecoration;
                }

                // 特殊处理：处理多行文字...逻辑
                let maxLines = nodeCss['lines'];
                if (maxLines != undefined && maxLines > 1) {
                    nodeStyle['-webkit-box-orient'] = 'vertical';
                    nodeStyle['-webkit-line-clamp'] = maxLines;
                    nodeStyle.display = '-webkit-box';

                    // 如果不是fitcontent=true，并且多行，那么需要手动计算一下高度，并且赋值
                    if (nodeStyle.height != undefined) {
                        let tmpHeight = nodeStyle.height;
                        if (tmpHeight.endsWith('px')) {
                            nodeStyle.height = parseInt(tmpHeight.substring(0, tmpHeight.indexOf('px'))) * maxLines + 'px';
                        }
                        // 如果不符合后缀逻辑，那么直接设置auto
                        else {
                            nodeStyle.height = 'auto';
                        }
                    }
                    // 自适应，那么高度设置成auto
                    else if (fitContent == 'true' || fitContent == true) {
                        nodeStyle.height = 'auto';
                    }

                }
                // 特殊处理：处理单行文字...逻辑
                else if (nodeStyle.textOverflow == "ellipsis") {
                    nodeStyle.minWidth = '0px';
                    nodeStyle.whiteSpace = 'nowrap';
                    nodeStyle.display = '';
                }

                break;
            case 'grid': break;
            case 'scroll': break;
            case 'image':
                let mode = nodeCss['mode'];
                if (mode != undefined) {
                    nodeStyle.mode = mode;
                }
                break;
        }

        let backgroundColor = nodeCss['background-color'];
        if (backgroundColor != undefined) {
            nodeStyle.backgroundColor = backgroundColor;
        }

        let backgroundImage = nodeCss['background-image'];
        if (backgroundImage != undefined) {
            nodeStyle.backgroundImage = backgroundImage;
        }

        let borderColor = nodeCss['border-color'];
        if (borderColor != undefined) {
            nodeStyle.borderColor = borderColor;
        }

        let borderWidth = nodeCss['border-width'];
        if (borderWidth != undefined) {
            nodeStyle.borderWidth = borderWidth;
        }

        let borderTopLeftRadius = nodeCss['border-top-left-radius'];
        if (borderTopLeftRadius != undefined) {
            nodeStyle.borderTopLeftRadius = borderTopLeftRadius;
        }

        let borderTopRightRadius = nodeCss['border-top-right-radius'];
        if (borderTopRightRadius != undefined) {
            nodeStyle.borderTopRightRadius = borderTopRightRadius;
        }

        let borderBottomLeftRadius = nodeCss['border-bottom-left-radius'];
        if (borderBottomLeftRadius != undefined) {
            nodeStyle.borderBottomLeftRadius = borderBottomLeftRadius;
        }

        let borderBottomRightRadius = nodeCss['border-bottom-right-radius'];
        if (borderBottomRightRadius != undefined) {
            nodeStyle.borderBottomRightRadius = borderBottomRightRadius;
        }

        let borderRadius = nodeCss['border-radius'];
        if (borderRadius != undefined) {
            nodeStyle.borderRadius = borderRadius;
        }
    }

    private createRootStyle(gxMeasureSize: GXMeasureSize): React.CSSProperties {
        const rootStyle = {
            display: 'flex',
            position: 'relative',
            direction: 'inherit',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            overflow: 'hidden',
            alignItems: 'stretch',
            alignSelf: 'auto',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            flexShrink: '0',
            flexGrow: '0',
            width: '100%',
            height: 'auto',
            minWidth: 'auto',
            minHeight: 'auto',
            maxWidth: 'auto',
            maxHeight: 'auto'
        };

        // 处理外部期望的宽度
        if (gxMeasureSize.templateWidth != undefined && gxMeasureSize.templateWidth != null) {
            rootStyle.width = gxMeasureSize.templateWidth + 'px';
        }

        // 处理外部期望的高度
        if (gxMeasureSize.templateHeight != undefined && gxMeasureSize.templateHeight != null) {
            rootStyle.height = gxMeasureSize.templateHeight + 'px';
        }

        return rootStyle as React.CSSProperties;
    }

    private createViewStyleByCss(gxTemplateContext: GXTemplateContext, layer: any, nodeCss: any, gxParentNode?: GXNode): React.CSSProperties {
        let nodeStyle = {
            display: 'flex',
            position: "relative",
            direction: 'inherit',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            overflow: 'hidden',
            alignItems: 'stretch',
            alignSelf: 'auto',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            flexShrink: '1',
            flexGrow: '0',
            // flexBasis: 'auto',
            // paddingLeft: '0px',
            // paddingTop: '0px',
            // paddingRight: '0px',
            // paddingBottom: '0px',
            // marginLeft: '0px',
            // marginTop: '0px',
            // marginRight: '0px',
            // marginBottom: '0px',
            // left: '0px',
            // top: '0px',
            // right: '0px',
            // bottom: '0px',
            width: 'auto',
            height: 'auto',
            minWidth: 'auto',
            minHeight: 'auto',
            maxWidth: 'auto',
            maxHeight: 'auto',
            // // 无法使用
            // aspectRatio: '',
            // // 
            // backgroundColor: '',
            // fontSize: '',
            // fontFamily: 'unset',
            // color: '',
            // fontWeight: 'unset',
            // backgroundImage: 'unset',
            // maxLines: 'unset',
            // textOverflow: 'unset',
            // textAlign: 'unset',
            // borderColor: 'unset',
            // borderWidth: '0px',
            // borderTopLeftRadius: '0px',
            // borderTopRightRadius: '0px',
            // borderBottomLeftRadius: '0px',
            // borderBottomRightRadius: '0px',
            // lineHeight: '',
            // textDecoration: '',
            // mode: '',
        };
        this.updateViewStyleByCss(gxTemplateContext, nodeStyle, layer, nodeCss, gxParentNode);
        return nodeStyle as React.CSSProperties;
    }

}