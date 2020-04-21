import React from 'react'
import { Row, Col, Avatar, Button, Typography } from 'antd'

const { Text } = Typography;

export default class Author extends React.Component {
  render() {
    return (
      <Row type="flex">
        <Col style={{ width: "min-content", paddingRight: '10px' }}>
          <Row style={{ height: '100%' }} type="flex" justify="center" align="middle">
            <Avatar size="large" src={this.props.profilePic} />
          </Row>
        </Col>
        <Col style={{ width: "min-content" }}>
          <Row>
            <Button type="link" style={{ padding: '0' }}><strong>{this.props.name}</strong></Button>
          </Row>
          <Row>
            <Text type="secondary">{this.props.date}</Text>
          </Row>
        </Col>
      </Row>
    )
  }
}
