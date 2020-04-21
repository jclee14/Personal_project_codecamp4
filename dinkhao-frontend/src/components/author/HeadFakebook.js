import React from 'react'
import { Row, Col, Avatar } from 'antd'
import Title from 'antd/lib/typography/Title'

export default class HeadFakebook extends React.Component {
  render() {
    return (
      <Col md={12} sm={16} xs={20} style={{ paddingTop: '20px' }}>
        <Row type="flex">
          <Col md={8} sm={8} xs={8} type="flex" align="end" style={{ paddingRight: '15px' }}>
            <Avatar
              size={128}
              src={this.props.imageSrc}
            />
          </Col>
          <Col md={16} sm={16} xs={16} type="flex" align="start">
            <Row type="flex" style={{ height: '100%' }} align="middle">
              <Title level={1}>{this.props.name}</Title>
            </Row>
          </Col>
        </Row>
      </Col>
    )
  }
}