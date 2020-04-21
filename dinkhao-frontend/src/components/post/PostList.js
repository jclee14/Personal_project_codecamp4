import React from 'react'
import Post from './Post'
import { Row } from 'antd'

export default class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postList: this.props.postList
    }
  }

  renderPostList() {
    return this.props.postList.map(post => (
      <Post key={post.id}
        author={post.author}
        message={post.message}
        imgSrc={post.image_url}
        date={post.date}
        commentList={post.commentList}
        owner={this.props.owner}
      />
    ))
  }

  render() {
    return (
      <Row>
        {this.renderPostList()}
      </Row>
    )
  }
}
