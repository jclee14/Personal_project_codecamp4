import React from 'react'
import { Row, Col } from 'antd'
import PostList from '../components/post/PostList'
import CreatePost from '../components/post/CreatePost'
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
      <Row type="flex" justify="center" style={{ textAlign: 'center' }}>
        <Col>
          <Row>
            <h1>DINKHAO GROUP.</h1>
          </Row>
          <Row>
            <h1>Worker Wage Calculation System</h1>
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
