import React, { Component } from 'react';
import { Button, CardBody, ButtonGroup, CardDeck, CardText, CardTitle, Card, CardImg } from 'reactstrap'

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import { Rate, notification } from 'antd';

import * as courseAction from "../../action/CourseAction"
import * as cartAction from '../../action/cartAction'
import HomeLogo from '../../Logo/hom.jpg';
import path from '../../path'
import "../../styling.css"
class HomePage extends Component {
    state = {
        width: window.innerWidth,
        height: window.innerHeight - 60
    }
    // handleLetsStartButton() {
    //     this.props.history.push('/courseList');
    // }
    componentDidMount() {
        this.props.action.course.getCourse();
        if (this.props.token && this.props.userId) {
            this.props.action.cart.getCartByUser(parseInt(this.props.userId))
            this.props.action.cart.getBoughtCourseByUser(parseInt(this.props.userId));
        }
    }

    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };

    btnExplore(courseId, e) {
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    btnGoCart(e) {
        this.props.history.push('/cart');
    }

    btnAddToCart(courseId, e) {
        let cartData = [];
        let data = {
            userId: parseInt(this.props.userId),
            courseId: courseId
        }
        if (this.props.token) {
            this.props.action.cart.addToCart(data);
        }
        else {
            cartData = JSON.parse(localStorage.getItem("cart"));
            if (cartData === null) {
                cartData = [];
            }
            cartData.push({ courseId: courseId });
            localStorage.setItem("cart", JSON.stringify(cartData));
        }
        this.openNotificationWithIcon('success', "Successfully added to cart");
    }

    renderMedia(course) {
        let addedToCart = true;
        let loginCart = true;
        let bought = false;
        let boughtCourseId = [];
        let userId = parseInt(this.props.userId);

        if (this.props.token) {
            if (this.props.boughtCourse && this.props.boughtCourse.length !== 0) {
                this.props.boughtCourse.map(boughtcourse => {
                    return boughtCourseId.push(boughtcourse.courseId);
                })
            }
            if (userId === course.userId) {
                bought = true;
            }
            else if (boughtCourseId.includes(course.id)) {
                bought = true;
            }
            else if (this.props.getCart && this.props.getCart.length !== 0) {
                this.props.getCart.map(cart => {
                    if (cart.courseId === course.id) {
                        return addedToCart = false;
                    }
                    return null
                })
            }
        }
        else if (localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).length !== 0) {
            let carts = JSON.parse(localStorage.getItem("cart"));
            let cid = [];
            carts.map(c => {
                return cid.push(c.courseId)
            });
            for (let i = 0; i < cid.length; i++) {
                if (cid[i] === course.id) {
                    loginCart = false;
                }
            }
        }
        return (
            <div key={course.id} className="abc1">
                <Card>
                    <CardImg top width="10px" src={path + course.courseImage} alt="Card image cap" />
                    <CardBody>
                        <CardTitle style={{ marginTop: '-10px' }}><h2>{course.coursename}</h2></CardTitle>
                        <CardText>{course.description}</CardText>
                        <Button outline color="info" outline onClick={this.btnExplore.bind(this, course.id)} style={{ marginLeft: '-10px' }} >Learn More</Button>
                        {bought ? "" :
                            ((addedToCart && loginCart) ?
                                <Button outline onClick={this.btnAddToCart.bind(this, course.id)} style={{ marginRight: '-10px', marginLeft: '10px' }}>Add To Cart</Button>
                                : <Button outline onClick={this.btnGoCart.bind(this)} style={{ marginRight: '-10px', marginLeft: '10px' }}>Go to Cart</Button>)
                        }
                    </CardBody>
                </Card>
            </div>
        )
    }
    renderMedia1(course) {
        return (
            <div key={course.id} className="abc1">
                <Card>
                    <CardImg top width="10px" src={path + course.courseImage} alt="Card image cap" />
                    <CardBody>
                        <CardTitle style={{ marginTop: '-10px' }}><h2>{course.coursename}</h2></CardTitle>
                        <CardText>{course.description}</CardText>
                        <Button outline color="info" outline onClick={this.btnExplore.bind(this, course.id)} style={{ marginLeft: '-10px' }} >Learn More</Button>
                    </CardBody>
                </Card>
            </div>
        )
    }
    render() {
        let courseList1 = [];
        if (this.props.course) {
            this.props.course.map(course => {
                return courseList1.push(this.renderMedia1(course))
            })
        }

        let courseList = [];
        if (this.props.course) {
            this.props.course.map(course => {
                return courseList.push(this.renderMedia(course))
            })
        }



        return (
            <div className="hrelative">
                <img src={HomeLogo}
                    style={{
                        width: "100%", height: "100%",
                        backgroundRepeat: "no-repeat", backgroundAttachment: "fixed"
                    }}
                    alt="Home"></img>
                <div className="homediv" style={{ display: 'block', width: '100%', textAlign: 'left' }}>
                    {this.props.token ? (this.props.Role == 2 ? courseList : "") : courseList1}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        course: state.course.course,
        userId: state.auth.userId,
        getCart: state.cart.getCart,
        boughtCourse: state.cart.boughtCourse,
        Role: state.auth.Role
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        course: bindActionCreators(courseAction, dispatch),
        cart: bindActionCreators(cartAction, dispatch),
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);