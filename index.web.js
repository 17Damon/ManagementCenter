'use strict';
import {Input, Icon, Button , notification} from 'antd';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
var Publish = require('./app/Publish');

const App = React.createClass({
    getInitialState() {
        return {
            windowWidth: (typeof window !== 'undefined') ? window.innerWidth : undefined,
            windowHeight: (typeof window !== 'undefined') ? window.innerHeight : undefined,
            passwordvalue: '',
            namevalue: '',
            loginflag: false,
            loading: false
        };
    },
    namehandleChange(event) {
        this.setState({
            namevalue: event.target.value
        });
    },
    onLogin(){
        this.setState({
            loginflag: true,
            loading: true
        });
        let name = this.state.namevalue;
        let password = this.state.passwordvalue;
        fetch('http://120.27.124.108/graphql', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "query": `query {
                              checkUser(id:"manager",name:"${name}",password:"${password}") {
                                token
                              }
                            }`
                }
            ),
            headers: {'Content-Type': 'application/json'}
        }).then(function (res) {
                return res.json();
        }).then(function (json) {
            if(json.data.checkUser.token==="PermissionFailed"){
                this.setState({
                    loginflag: false,
                    loading: false
                });
                notification['error']({
                    message: '登陆错误',
                    description: '用户名或者密码错误，请检查后再次登陆'
                })
            }else {
                browserHistory.push({
                    pathname: '/manager/publish/',
                    query: {},
                    state: {publishtoken: json.data.checkUser.token}
                });
            }
        }.bind(this));

    },
    passhandleChange(event) {
        this.setState({
            passwordvalue: event.target.value
        });
    },
    handleResize(e) {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    },
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    render() {
        const width = this.state.windowWidth;
        const height = this.state.windowHeight;
        // const imgUrl = 'http://192.168.0.104:3000/manager/bkimg01_src.jpg';
        const imgUrl = 'http://120.27.124.108/manager/bkimg01_src.jpg';
        return (
            <div style={{
                height:height,
                width:width,
                backgroundImage: 'url(' + imgUrl + ')',
                backgroundSize: 'cover',
                backgroundRepeat:'no-repeat',
                overflow: 'hidden',
                zoom:1,
                flexDirection:'column',
                display:'flex'
            }}>
                <div
                    style={{width:width, height:28,display:'flex',backgroundColor:'#1E1B29',alignItems: 'center',justifyContent: 'space-between',color:'silver'}}>
                    <div style={{color:'#0AE',marginLeft:50,fontSize:14}}>三门峡市社会保险基金管理局</div>
                    <div style={{color:'silver',marginRight:100,fontSize:13}}>
                        <span style={{color:'silver',marginRight:20,fontSize:13}}></span>
                        <span style={{color:'silver',marginRight:20,fontSize:13}}></span>
                        <span style={{color:'silver',marginRight:0,fontSize:13}}>首页</span>
                    </div>
                </div>
                <div
                    style={{width:width, height:0.685*height,display:'flex',alignItems: 'center',justifyContent: 'flex-end'}}>
                    <div
                        style={{width:286, height:290,marginRight:0.15*width,backgroundColor:'rgba(0,0,0,.5)',display:'flex',alignItems: 'center',justifyContent: 'center',flexDirection:'column'}}
                    >
                        <div style={{height:20,color:'white',fontSize:17,marginBottom:10}}>账密登录</div>
                        <hr style={{color:'white',width:284}}/>
                        <div style={{width:220,height:170,marginTop:35}}>
                            <div style={{display:'flex',alignItems: 'center',justifyContent: 'center'}}>
                                <div
                                    style={{width: 40,height:37,textAlign:'center',backgroundColor:'silver'}}>
                                    <Icon type="user" style={{fontSize:25,color:'white',marginTop:7}}/>
                                </div>
                                <div><Input size="large" placeholder="用户名"
                                            value={this.state.namevalue} style={{height:37,width:180}}
                                            onChange={this.namehandleChange}/></div>
                            </div>

                            <div
                                style={{display:'flex',alignItems: 'center',justifyContent: 'center',marginTop:10}}>
                                <div
                                    style={{width: 40,height:37,textAlign:'center',backgroundColor:'silver'}}>
                                    <Icon type="lock" style={{fontSize:25,color:'white',marginTop:7}}/>
                                </div>
                                <div><Input size="large" type='password' placeholder="密码"
                                            value={this.state.passwordvalue} style={{height:37,width:180}}
                                            onChange={this.passhandleChange}/></div>
                            </div>

                            <div style={{marginTop:25}}>
                                <Button style={{width:220,height:37,fontSize:17}} type="primary"
                                        loading={this.state.loading}
                                        disabled={this.state.loading}
                                        onClick={this.onLogin}>登录</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{width:width, marginTop: 0.015*height,height:0.12*height,display:'flex',alignItems: 'center',justifyContent: 'center',color:'#fff'}}>
                        <span style={{fontSize:0.015*height}}>
                            <p>@社会保险</p>
                            <p>Power by EflTech</p>
                        </span>
                </div>
            </div>
        );
    }
});

//正式发布去除'／'挂载路由
ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
        <Route path="/manager/" component={App}/>
        <Route path="/manager/publish" component={Publish}/>
    </Router>
), document.getElementById('root'));

