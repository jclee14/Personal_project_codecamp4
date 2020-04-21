import React from 'react'
import Author from '../author/Author'
import { Row, Col, Card, Divider } from 'antd'
import MessageContent from './MessageContent'
import CommentList from '../comment/CommentList'

export default class Post extends React.Component {
  render() {
    return (
      <Card style={{ marginTop: '10px' }} bodyStyle={{ padding: '0' }}>
        <Row>
          <Col>
            <Row style={{ paddingLeft: '10px', paddingTop: '10px' }}>
              <Author profilePic={this.props.author.profilePic} name={this.props.author.name} date={this.props.date} />
            </Row>
            <Row >
              <MessageContent message={this.props.message} picture={this.props.imgSrc} />
            </Row>
            <Divider style={{ marginBottom: '5px', marginTop: '5px' }} />
            <Row>
              <CommentList owner={this.props.owner}
                commentList={this.props.commentList}
              />
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }
}
