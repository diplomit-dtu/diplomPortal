/**
 * Created by Christian on 05-08-2017.
 */
import React,{Component, PropTypes} from 'react'
import {Glyphicon} from "react-bootstrap";

export default class EditableHeadLine extends Component{
    handleGlyphClick(event){
        let editmode = !this.state.editmode
        this.setState({editmode:editmode, courseName:this.props.courseName, shortHand: this.props.shortHand})
    };

    handleGlyphOkClick(event){
        this.props.newInput(this.state.shortHand, this.state.courseName)
        this.setState({editmode:false})
    }
    constructor(props){
        super(props);
        this.state = {
            editmode:false,
            courseName: '',
            shortHand: ''
        }
    }

    handleShortHandChange(e) {
        this.setState({
            shortHand: e.target.value
        })
    }


    handleCourseNameChage(e) {
        this.setState({
            courseName: e.target.value
        })
    }

    render(){
        if(this.state.editmode){
            return <h3>
                <input type="text" value={this.state.shortHand} onChange={(e)=>this.handleShortHandChange(e)}/> -
                <input type="text" value={this.state.courseName} onChange={(e)=>this.handleCourseNameChage(e)}/>
                <a onClick={(e)=>{this.handleGlyphOkClick(e)}}><Glyphicon glyph="ok" /></a>
                <a onClick={(e)=>{this.handleGlyphClick(e)}}><Glyphicon glyph="remove"/></a>
            </h3>
        } else {
            return <h3><span>{this.props.shortHand}</span> - <span>{this.props.courseName} </span><a onClick={(e)=>{this.handleGlyphClick(e)}}><Glyphicon glyph="pencil"/></a></h3>
                }

    }


}

EditableHeadLine.propTypes = {
    shortHand: PropTypes.string,
    courseName: PropTypes.string,
    newInput: PropTypes.func
}