import React from 'react'
import FriendComponent from './FriendComponent'
import { Col, Row } from 'antd'
import Axios from '../../config/api.service'

export default class FriendsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      friendsList: []
    }
  }

  fetchFriendsList = () => {
    Axios.get('/friends-list')
      .then(result => {
        this.setState({
          friendsList: result.data
        })
      })
  }

  componentDidMount() {
    this.fetchFriendsList()
  }

  renderFriendsList() {
    return this.state.friendsList.map(friend => (
      <Col span={12} type="flex" align="center">
        <FriendComponent
          key={friend.id}
          friendInfo={friend}
          fetchFriendsList={this.fetchFriendsList}
          type="friend"
        />
      </Col>
    ))
  }

  render() {
    return (
      <Row gutter={16}>
        {this.renderFriendsList()}
      </Row>
    )
  }
}
