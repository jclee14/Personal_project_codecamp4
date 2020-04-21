import React from 'react'
import { TOKEN } from '../../config/constants'
import Axios from '../../config/api.service'
import { Row, Card, Col, Divider, Avatar, Input, Icon, Button, Upload } from 'antd'

const { TextArea } = Input

export default class CreatePost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      postStatus: "",
      fileList: [],
    }
  }

  handleCreatePost = () => {
    let payload = new FormData()

    payload.append('photoPost', this.state.fileList[0])
    payload.append('message', this.state.postStatus)

    Axios.post('/create-post', payload)
      .then(result => {
        console.log(result)
      })
  }

  render() {
    const { fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    }

    return (
      <Row type="flex" justify="center" style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <Card type="inner" title="Create post">
            <Row>
              <Col span={4} style={{ paddingRight: '5px' }}>
                <Row type="flex" justify="center">
                  <Avatar src={this.props.avatarSrc} />
                </Row>
              </Col>
              <Col span={20}>
                <Row>
                  <TextArea
                    onChange={(e) => this.setState({ postStatus: e.target.value })}
                    placeholder="เขียนอะไรบางอย่างสิ"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </Row>
                <Row type='flex' justify='end'>
                  <Button onClick={() => this.handleCreatePost()}>
                    Post
                </Button>
                </Row>
              </Col>
            </Row>
            <Divider style={{ marginBottom: '15px', marginTop: '15px' }} />
            <Row>
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> Select File
              </Button>
              </Upload>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}
