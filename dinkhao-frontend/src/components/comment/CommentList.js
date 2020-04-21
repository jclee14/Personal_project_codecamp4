import React from 'react'
import { Row, Comment, Col, Divider } from 'antd'
import CreateComment from './CreateComment'

export default class CommentList extends React.Component {

  renderCommentsList() {
    return this.props.commentList.map(comment => (
      <Row key={comment.id} type="flex" align="middle" justify="start" style={{ marginLeft: '16px', marginRight: '16px' }}>
        <Comment
          author={comment.user.name}
          avatar={comment.user.profilePic}
          content={comment.content}
          datetime={comment.datetime}
        />
      </Row>
    ));
  }

  render() {
    return (
      <Row>
        <Col>
          <Row style={{ paddingBottom: '16px' }}>
            <CreateComment owner={this.props.owner} />
          </Row>
          <Divider dashed style={{ marginTop: '5px', marginBottom: '5px' }} />
          {this.renderCommentsList()}
        </Col>
      </Row>
    )
  }
}
