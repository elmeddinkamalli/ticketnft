import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleSwitchSidebar } from "../../redux/features/web3Slice";
class SwitchNetwork extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="f-modal-alert" onClick={this.props.toggleSwitchSidebar}>
        <span className="alert-text">Switch network</span>
        <div className="f-modal-icon f-modal-warning scaleWarning">
          <span className="f-modal-body pulseWarningIns"></span>
          <span className="f-modal-dot pulseWarningIns"></span>
        </div>
      </div>
    );
  }
}

const mapDipatchToProps = (dispatch) => {
  return {
    toggleSwitchSidebar: () => dispatch(toggleSwitchSidebar()),
  };
};

export default connect(null, mapDipatchToProps)(SwitchNetwork);
