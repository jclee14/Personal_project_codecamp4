import React from 'react'
import { Row, Col, Divider } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      owner: {},
      postList: []
    }
  }

  componentDidMount() {
    this.setState({
      owner: {
        name: this.props.user.name,
        profilePic: this.props.user.profilePic
      }
    })
  }

  render() {
    return (
      <Row Row style={{ margin: "0 5%" }}>
        <Col>
          <Row id="welcome" type="flex" justify="center" style={{ textAlign: 'center' }}>
            <Col span={24} style={{ backgroundColor: 'white', padding: '20px 0' }}>
              <Row>
                <h1>DINKHAO GROUP.</h1>
              </Row>
              <Row>
                <h1>Worker Wage Calculation System</h1>
              </Row>
            </Col>
          </Row>
          <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          <Row id="instruction-list" span={24} style={{ backgroundColor: 'white', padding: '20px 5%' }}>
            <h2 style={{ color: "#294694" }}>System Instruction</h2>
            <ol>
              <li>Create Project</li>
              <li>Create Worker Data</li>
              <li>Assign worker to any project as a member</li>
              <li>Input workers' attendance in their project field (Input every 15 days)</li>
              <li>(Optional) Assign extra cost to worker, it will be deduct from their salary later.</li>
              <li>Review the accounting based on general and worker</li>
            </ol>
          </Row>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(Home)
