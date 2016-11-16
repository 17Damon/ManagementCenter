/**
 * Created by zhubg on 2016/10/27.
 */
'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom'
var fetch = require('node-fetch');
var ReactDOMServer = require('react-dom/server');
import {createForm} from 'rc-form';
import {List, Button} from 'antd-mobile';
import {withRouter} from 'react-router'

import $ from 'jquery';

var list = [];


var ItemList = React.createClass({
    getInitialState(){
        return {
            itemlist: []
        }

    },
    componentDidMount () {
        // const frame = ReactDOM.findDOMNode(this.refs.frame);
        // $(frame).html(htmlInput);
        console.log('test');
        console.log(this.state.itemlist.length===0);
        let tmpsection = this.props.location.query.itemlist_name;
        fetch('http://192.168.0.104:3000/graphql', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "query":`query {
                              getItemList(section:"${tmpsection}") {
                                section
                                list{
                                    id
                                    section
                                    postingtime
                                    title
                                    detail
                                }
                              }
                            }`
                }
            ),
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (res) {
                return res.json();
            }).then(function (json) {
            console.log('json');
            this.setState({
                itemlist:json.data.getItemList.list
            });
        }.bind(this));
    },
    componentWillUnmount () {

    },
    getList(){
        let tmpsection = this.props.location.query.itemlist_name;
        console.log('tmpsection: '+tmpsection);
        console.log(`{
                        "tmpsection":${tmpsection}
                        }`);
        fetch('http://120.27.124.108/graphql', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "query":`query($tmpsection: String!) {
                              getItemList(section:$tmpsection) {
                                section
                                list{
                                    id
                                    section
                                    postingtime
                                    title
                                    detail
                                }
                              }
                            }`,
                    "variables":`{
                        "tmpsection":"${tmpsection}"
                        }`
                }
            ),
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (res) {
                return res.json();
            }).then(function (json) {
            console.log('json');
            console.log(JSON.stringify(json));
            // this.setState({
            //     itemlist:json.data.getItemList.list
            // });
        }.bind(this));
    },
    render () {
        return (
            <div>
                <List
                    renderHeader={() => this.props.location.query.itemlist_name}
                    renderFooter={() => '@社会保险'}
                >
                    {this.state.itemlist.length===0?(<List.Item>加载中...</List.Item>):this.state.itemlist.map(function (item) {
                            return (
                                <List.Item
                                    key={item.id}
                                    thumb="http://www.szsi.gov.cn/theme/ico/ico_4.png"
                                    onClick={() => {
                                    this.props.router.push({
                                        pathname: '/itemlist/itemdetail/1',
                                        query: {},
                                        state: {detail:item.detail}
                                    });
                                }}
                                >{item.title}</List.Item>)
                        }.bind(this)
                    )}
                </List>
                <Button type="primary" onClick={this.getList}>primary 按钮</Button>
            </div>
        );
    }
});

ItemList.defaultProps = {};

module.exports = React.createFactory(withRouter(ItemList));


//
// {this.state.projectlist.map(function (project) {
//         console.log('render ProjectExperience!');
//         let id = 1;
//         return (
//
//             <div
//                 key={project.id}
//             />
//
//
//         )
//     }.bind(this)
// )}