/**
 * Created by Christian on 14-08-2017.
 */
import React, {Component,PropTypes} from 'react'
import {Col, Glyphicon, Grid, ListGroupItem, Row} from "react-bootstrap";
import ContentEditable from "react-contenteditable";
import CheckboxComp from "./CheckboxComp";
import ProgrammingBox from "./ProgrammingBox";

export default class ProgrammingSubElement extends Component{
    handleChange =  (e)=>{
        this.props.onChange(e.target.value, this.props.textBoxId)
    };
    constructor(props){
        super(props)

    }

    render(){
        return (
            <ListGroupItem>
                <h4 className="list-group-item-heading">
                    <CheckboxComp id={this.props.checkBoxId} checked={this.props.checked} onCheck={this.props.onCheck}/>
                    {this.props.header}
                </h4>

                <Grid fluid>
                    <Row>
                        <Col sm={8}>
                            <ProgrammingBox code={this.props.code} compileUrl={this.props.compileUrl}/>

                        </Col>
                        <Col sm={4}>
                            <h5><Glyphicon glyph="pencil"/><b>Noter</b></h5>
                            <ContentEditable style={{borderWidth:1, borderStyle:"solid", borderColor:"lightgrey"}} html={this.props.notes} onChange={this.handleChange}/>

                        </Col>
                    </Row>
                </Grid>
            </ListGroupItem>
        )
    }
}

ProgrammingSubElement.propTypes={
    header: PropTypes.string,
    checkBoxId:PropTypes.string,
    onCheck:PropTypes.func,
    textBoxId: PropTypes.string,
    notes: PropTypes.string,
    onChange: PropTypes.func,
    compileUrl: PropTypes.string
}