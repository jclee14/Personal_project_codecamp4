import React from 'react'
import { Row, Col } from 'antd'
import FriendComponent from './FriendComponent'
import Axios from '../../config/api.service'

export default class FriendsRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      friendsRequest: []
    }
  }

  fetchRequestList = () => {
    Axios.get('/request-list')
      .then(result => {
        this.setState({
          friendsRequest: result.data
        })
      })
  }

  componentDidMount() {
    this.fetchRequestList()
  }

  renderFriendsList() {
    return this.state.friendsRequest.map(friend => (
      <FriendComponent
        friendInfo={friend}
        fetchRequestList={this.fetchRequestList}
        type={"request"}
      />
    ))
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          {this.renderFriendsList()}
        </Col>
      </Row>
    )
  }
}