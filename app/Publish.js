'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import Simditor from 'simditor';
import $ from 'jquery';
import objectAssign from 'object-assign';
import {Select, Input, Button, Modal} from 'antd';
const Option = Select.Option;

const provinceData = ['社保资讯', '政策法规', '办事指南', '互动交流'];
const cityData = {
    社保资讯: ['机构概况', '社保新闻', '通知公告', '业务公示'],
    政策法规: ['养老保险', '医疗保险', '少儿大学生医保', '生育保险', '失业保险', '工商保险', '社保征收', '社保转移', '政策解读'],
    办事指南: ['社保征收', '养老保险', '医疗保险', '少儿大学生医保', '工商保险', '失业保险', '社保转移', '生育保险'],
    互动交流: ['业务知识库', '意见征集', '网上调查', '微信公众号']
};
var htmlInput = `<h1 style='text-align: center;'><span style="color: rgb(65, 140, 175);">关于防范冒用“社保”名义电信诈骗的温馨提示</span></h1><hr><p style="text-align: center;"><b>日期：2016-09-26&nbsp;来源：市社保局</b></p><p>　　近期，电信诈骗案件持续高发，有不法分子冒用“社保”名义实施诈骗，严重危害广大市民财产安全。为让广大市民了解掌握冒用“社保”名义诈骗的手法，增强防范电信诈骗的意识和能力，现梳理了常见的冒用“社保”名义诈骗手法如下：</p><p>　　骗术一：“社保卡消费异常，账户被冻结”</p><p>　　通过电信伪基站发送短信或拨打电话，冒用“社保”名义以社保卡（医保卡）消费异常被盗刷或欠费被冻结为名，要求参保人配合处理，提供个人信息等相关内容，诱骗参保人员转账汇款实施诈骗。</p><p>　　骗术二：“补充登记完善社保个人信息”</p><p>　　通过电脑改号软件伪装成“社保机构”对外公布的联系电话致电参保人，以补充登记完善社保个人信息为名，骗取个人身份信息和银行卡信息进行诈骗 。</p><p>　　骗术三：“发放社保补贴”</p><p>　　以发放“社保补贴”为名发送诈骗短信或拨打电话，骗子在解读“社保政策”获取信任后，诱骗参保人的个人身份信息和银行卡信息，实施诈骗 。</p><p>　　骗术四：“伪造社保虚假公文”</p><p>　　以社保经办机构名义，伪造虚假文件向参保单位及个人发放，以社保基金账户变更为名，要求参保单位和个人预交社保费，直接将资金转入某银行帐户实施诈骗。</p><p>　　骗术五：“代缴社保、补缴社保”</p><p>　　非深圳户籍人员在购房、办理居住证、子女入学等均有参保年限要求，不法分子以代理社保参保为名发送诈骗短信或拨打电话，谎称可挂靠参保或补缴社保，要求转账汇款缴交社保费（另，挂靠参保属违法行为，一经发现将根据规定进行清理并处罚）。</p><p>　　骗术六：“办理社保关系转移”</p><p>　　因工作变换，参保人经常会跨市、跨省办理社保关系转移，不法分子以社保经办机构名义拨打电话，要求参保人转保时将钱转入指定个人账户。</p><p>　　防范要点：</p><p>　　一、不要随便点击或拨打短信里的不明链接和电话。</p><p>　　二、社保重要政策调整或实施我局均会在报纸、广播、电视、官方网站、微信公众号等正规渠道进行公告。</p><p>　　三、社保部门办理社保费征收、社保待遇支付、医疗费报销等业务均使用账户名为“深圳市社会保险基金管理局”的单位账户，不会要求参保人转账汇款到私人账户。</p><p>　　四、凡以社保名义的来信或来电涉及转账汇款的，请拨打全市统一社会保障咨询热线12333或到社保经办机构现场核实，谨防上当受骗。</p><p>　　五、如发现受骗应第一时间拨打110向公安部门报案。深圳市公安局反信息诈骗咨询专线号码：0755-81234567。</p><p><br></p><p style="text-align: right;"><b>　　三门峡市社会保险基金管理局</b></p><p style="text-align: right;"><b>　　2016年9月26日</b></p>`;

const toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'hr', '|', 'indent', 'outdent', 'alignment'];

var Publish = React.createClass({
    getInitialState(){
        return {
            windowWidth: (typeof window !== 'undefined') ? window.innerWidth : undefined,
            windowHeight: (typeof window !== 'undefined') ? window.innerHeight : undefined,
            titlevalue: '',
            publishflag: false,
            loading: false,
            editor: null,
            className: `simpeditor ${this.props.className}`,
            opts: this.props.opts,
            cities: cityData[provinceData[0]],
            secondCity: cityData[provinceData[0]][0]
        }
    },
    handleProvinceChange(value) {
        this.setState({
            cities: cityData[value],
            secondCity: cityData[value][0]
        });
    },
    onPublish(){
        let token = this.props.location.state.publishtoken;
        let section = this.state.secondCity;
        let title = this.state.titlevalue;
        let detail = this.state.editor.getValue().replace(/\"/g, "'");
        if (!token) {
            Modal.error({
                title: '非法操作',
                content: '没有口令，非法操作以及IP已经记录在案'
            });
        } else if (!section||!title||!detail) {
            Modal.warning({
                title: '温馨提示',
                content: '您没有填写全部信息字段'
            });
        } else {
            this.setState({
                publishflag: true,
                loading: true
            });
            // fetch('http://192.168.0.104:3000/graphql', {
            fetch('http://120.27.124.108:80/graphql', {
                method: 'POST',
                body: JSON.stringify(
                    {
                        "query": `mutation {
                              createMessage(
                                    token:"${token}",
                                    input:{
                                        section: "${section}",
                                        title: "${title}",
                                        detail: "${detail}"
                                    }
                              ) {
                                token
                              }
                            }`
                    }
                ),
                headers: {'Content-Type': 'application/json'}
            }).then(function (res) {
                return res.json();
            }).then(function (json) {
                this.setState({
                    publishflag: false,
                    loading: false
                });
                if (json.data.createMessage.token === "ViolationToken") {
                    Modal.error({
                        title: '发布失败',
                        content: '你的口令校验失败，请联系管理员'
                    });
                } else {
                    // browserHistory.push({
                    //     pathname: '/manager/publish/',
                    //     query: {},
                    //     state: {publishtoken: json.data.checkUser.token}
                    // });
                    Modal.success({
                        title: '发布成功',
                        content: '您的文章发布成功，你可以继续发布'
                    });
                }
            }.bind(this));
        }
    },
    onSecondCityChange(value) {
        this.setState({
            secondCity: value
        });
    },
    handleResize(e) {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },
    titlehandleChange(event) {
        this.setState({
            titlevalue: event.target.value
        });
    },
    componentDidMount () {
        window.addEventListener('resize', this.handleResize);
        const textarea = ReactDOM.findDOMNode(this.refs.textarea);
        this.setState({
            editor: new Simditor(objectAssign({}, {
                textarea: $(textarea),
                defaultImage: 'http://simditor.tower.im/assets/images/image.png',
                upload: {
                    url: '/uploader/adminEditorImg',
                    params: {folder: this.props.fileFolder || 'mailbox'},
                    fileKey: 'uploadFile', connectionCount: 3,
                    leaveConfirm: '正在上传文件中，如果离开页面将自动取消。'
                },
                toolbar: toolbar,
                toolbarHidden: false,
                pasteImage: true
            }, this.state.opts))
        });

        if (typeof this.props.children === 'string' && this.props.children) {
            this.setValue(this.props.children);
        }
    },
    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
        this.setState({
            editor: null
        });
    },
    getValue () {
        return this.state.editor.getValue();
    },
    setValue (content) {
        this.state.editor.setValue(content);
    },
    sync () {
        return this.state.editor.sync();
    },
    focus () {
        return this.editor.state.focus();
    },
    blur () {
        return this.editor.state.blur();
    },
    hidePopover () {
        return this.editor.state.hidePopover();
    },
    destroy () {
        this.editor.state.destroy();
    },
    render () {
        const width = this.state.windowWidth;
        const height = this.state.windowHeight;
        const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
        const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);
        const imgUrl = 'http://120.27.124.108/manager/bkimg01_src.jpg';

        return (
            <div style={{
               height:height,
                width:width,
                backgroundImage: 'url(' + imgUrl + ')',
                backgroundSize: 'cover',
                backgroundRepeat:'no-repeat'

            }}>
                <div style={{width:'85%',margin:'auto',paddingTop:20}}>
                    <div
                        style={{height:40,fontSize:15,color:'#0AE',backgroundColor:'white',borderRadius:5,alignItems: 'center',justifyContent: 'center',display:'flex'}}>
                        <div>
                            版块名称
                            <Select defaultValue={provinceData[0]} size='large'
                                    style={{ width: 110 ,fontSize:15,marginLeft:7,marginRight:0.025*width}}
                                    dropdownStyle={{fontSize:15}}
                                    onChange={this.handleProvinceChange}>
                                {provinceOptions}
                            </Select>
                            栏目名称
                            <Select value={this.state.secondCity} size='large'
                                    style={{ width: 110, marginLeft:7,fontSize:15}}
                                    dropdownStyle={{fontSize:15}}
                                    onChange={this.onSecondCityChange}>
                                {cityOptions}
                            </Select>
                        </div>

                    </div>

                    <Input size="large" type='text' placeholder="列表显示标题（请自行添加内容标题，请点击示例按钮）"
                           value={this.state.titlevalue} style={{height:80,borderRadius:5,marginTop:20,fontSize:37}}
                           onChange={this.titlehandleChange}/>


                    <div className={this.state.className}
                         style={{}}>
                        <textarea ref="textarea"/>
                    </div>
                    <div style={{marginTop:20,alignItems: 'center',justifyContent: 'center',display:'flex'}}>
                        <Button style={{width:220,height:37,fontSize:17}} type="primary"
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                onClick={this.onPublish}>
                            发布</Button>
                    </div>
                    <div style={{marginTop:20,alignItems: 'center',justifyContent: 'center',display:'flex'}}>
                        <Button style={{width:220,height:37,fontSize:17}} type="primary"
                                onClick={()=>{
                            console.log(this.state.editor.setValue(htmlInput));
                            }}>插入示例
                        </Button>
                    </div>
                    <div
                        style={{display:'flex',alignItems: 'center',justifyContent: 'center',color:'Gray',marginTop:20}}>
                        <span style={{fontSize:0.015*height}}>
                            <p>@社会保险</p>
                            <p>Power by EflTech</p>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
});

Publish.defaultProps = {
    className: '',
    opts: {}
};

module.exports = React.createFactory(withRouter(Publish));