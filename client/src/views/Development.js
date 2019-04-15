import React, { Component } from "react";
import "./Development.css"
import {
    Button,
    Modal,ModalFooter
  } from "react-bootstrap";
  import iconAdd from "../icons/pencil.svg";
// First we create our class
class Development extends Component {
    constructor(props) {
        super(props);
        
   this.state={
    user:  props.user,
    canEdit:false,
    show2:false,
    text:''
   }
   if (this.state.user) {
    if ( this.state.user.mun_role==="secretary_office" ||  this.state.user.awg_admin==="mun" 
    ) {
      this.state.canEdit = true;
    }
  }
  
  this.handleShow2 = this.handleShow2.bind(this)
  this.handleClose = this.handleClose.bind(this)}
  handleClose() {
    this.setState({ show2: false });
  }
  handleShow2() {
    this.setState({ show2: true });
  }
    
  render() {
    return (
      <div>
        
        <h1>Our Development</h1>
        <br></br>
        <div className="development">
        <p>
          We see ourselves as representatives of the United Nations, and do our
          best to help in development in different fields.{" "}
        </p>
        </div>
        {  this.state.canEdit ? (
              <Button
                variant="warning"
                className="club-create-button"
                onClick={this.handleShow2}
              >
                <img src={iconAdd} alt="Add club" />
              </Button>
            ) : (
              <></>
            )}
        { this.state.show2?(<>
            <Modal
          show={this.state.show2}
          onHide={this.handleClose}
          
        >
        <Modal.Header closeButton>
            <Modal.Title>Edit Development..</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {/* name */}
          <label>Edit text..</label>
            <textarea
              id="text"
              name="Enter text.."
              onChange={e => this.setState({text: e.target.value })}
              value={this.state.text}
            />  
            </Modal.Body>
            <ModalFooter>
            <input
              type="submit"
              onClick={ this.handleClose}
              value="Done"
            />
            </ModalFooter>
            </Modal>
            </>):(<></>)}
            </div>
    );
  }
}

export default Development;