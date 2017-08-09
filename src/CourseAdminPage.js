/**
 * Created by Christian on 01-08-2017.
 */

import React, {Component, PropTypes} from 'react'
import {Col, Grid, Row} from "react-bootstrap";
import CourseAdminMenu from "./components/CourseAdminMenu";
import Rip from "./rest/Rip";
import CourseAdminMain from "./components/CourseAdminMain";

export default class CourseAdminPage extends Component{
    constructor(props){
        super(props);
        //TODO clean up
        this.getCourses();
        this.state = {
            loading: true,
            courseList: [],
            currentCourse : null
        }

    }

    getCourses() {
        Rip.getJson(this.props.apiUrl + this.props.coursePath, this.courseCallBack, this.courseCatchBack)
    }
    courseCallBack = (json)=> {

        let newCurrentCourse;
        if (this.state.currentCourse == null) {
            this.setState({
                courseList: json,
                currentCourse: json[0]
            })
        } else {
            let currentCourseId = this.state.currentCourse.id;
            newCurrentCourse = this.state.currentCourse;
            json.forEach((course, index) => {
                if (course.id === currentCourseId) {
                    newCurrentCourse=course;
                }
            })
            this.setState({
                courseList: json,
                currentCourse: newCurrentCourse
            });
        }
        this.fetchUserList(this.state.currentCourse.id);

    }

    courseCatchBack = (data) =>{
        this.setState({loading:"failed"})
    }

    courseSelected = (courseId) =>{
        var foundCourses = this.state.courseList.filter((course)=>{
            return course.id===courseId;
        })
        this.fetchUserList(courseId);
        this.setState({
            currentCourse: foundCourses[0]
        });
    };

    fetchUserList = (courseId) =>{
        this.setState({loading:true});
        Rip.getJson(this.props.apiUrl + this.props.coursePath + '/' + courseId +'/users/list',(users)=> {
            this.setState({users:users, loading: 'done'});
        }, null) //TODO: Catchback
    }
    newCourseSelected = () =>{
        this.setState({loading:true})
        Rip.post(this.props.apiUrl + this.props.coursePath,null,
            (json)=>{
                let courseList = this.state.courseList;
                courseList.push(json);
                this.setState({loading:"done", courseList:courseList})
            },
            (errorMsg)=>{
                this.setState({loading:"failed"})
                console.log(errorMsg);
            })
    };





    handleRoleCheck(userId, role, value) {
        Rip.put(this.props.apiUrl + this.props.coursePath + '/' + this.state.currentCourse.id + '/users/' + userId + '/' + role, value,
            (json)=>{
                this.fetchUserList(this.state.currentCourse.id)
            },
            null)
    }
    addUserToCourse(userName, name, email){
        console.log(userName)
        let userUpdate = {userName: userName, name: name, email: email, role: "student"}
        Rip.postForString(this.currentCourseUrl() + '/users/', userUpdate,
            (String)=>{
                this.fetchUserList(this.state.currentCourse.id)
            },
            null)
    }

    currentCourseUrl() {
        return this.props.apiUrl + this.props.coursePath + '/' + this.state.currentCourse.id;
    }

    addUserCSVToCourse(csvString) {
        let usersString = {usersCsv:csvString};
        Rip.postForString(this.currentCourseUrl() + '/users/csv', usersString,
            (String)=>{
                this.fetchUserList(this.state.currentCourse.id);
            })
    }


    updateCourseShortAndName(short, name) {
        let shortAndName = {shortHand:short,courseName: name};
        Rip.postForString(this.currentCourseUrl() + "/name", shortAndName,
            (String)=>{
                this.getCourses()
            })
    }

    updateCourseUsesGoogleSheet = (checked)=> {
        let usesGoogleSheet = {usesGoogleSheet: checked}
        Rip.postForString(this.currentCourseUrl() + '/usesGoogleSheet', usesGoogleSheet,
            (String)=>{
                this.getCourses()
            })
    }

    newGoogleSheetId = (id)=>{
        let googleSheetId = {googleSheetId:id}
        Rip.postForString(this.currentCourseUrl() + '/googleSheetId', googleSheetId,
            (String)=>{
                this.getCourses()
            })
    }
    syncCourseCurrentCoursePlan = ()=> {
        Rip.postForString(this.currentCourseUrl() + '/syncCoursePlan', null,
            ()=>{
                this.getCourses();
            })
    }

    render(){
        return <Grid fluid>
            <Row>
                <Col md={3}>
                    <CourseAdminMenu loading={this.state.loading} courseClicked={this.courseSelected} newCourseClicked={this.newCourseSelected} courseList={this.state.courseList}/>
                </Col>
                <Col md={9}>
                    <CourseAdminMain course={this.state.currentCourse} users={this.state.users}
                                     loading={this.state.loading}
                                     newUserAdded={(userName, name, email)=>this.addUserToCourse(userName, name, email)}
                                     newUserCSVSubmitted={(csvString)=>this.addUserCSVToCourse(csvString)}
                                     newShortAndTitle={(short,name)=>this.updateCourseShortAndName(short,name)}
                                     usesGoogleSheet={(checked)=>this.updateCourseUsesGoogleSheet(checked)}
                                     newGoogleSheetId={(sheetId)=>this.newGoogleSheetId(sheetId)}
                                     roleChecked={(userId,role,value)=>this.handleRoleCheck(userId,role,value)}
                                    syncCoursePlan={()=>this.syncCourseCurrentCoursePlan()}/>
                </Col>
            </Row>
        </Grid>

    }


}

CourseAdminPage.propTypes = {
    apiUrl: PropTypes.string,
    coursePath: PropTypes.string
}

CourseAdminPage.defaultProps = {
    apiUrl: '',
    coursePath: '/courses'
}