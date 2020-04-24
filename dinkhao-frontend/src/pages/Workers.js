import React from 'react';
import WorkerDetail from '../components/worker/workerDetail';
import { Row, Col, Modal, Input, Form, Radio, Select, Button, List, Avatar, Upload, Icon } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

var moment = require('moment');
moment().format();

class WorkersComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      workerList: [],
      workerId: undefined,
      fname: '',
      lname: '',
      wage_rate: '',
      gender: '',
      race: '',
      bank_account_id: '',
      phone: '',
      isEmployed: '',
      fileList: [],
      editVisible: false
    }
  }

  componentDidMount() {
    this.getWorker();
  }

  getWorker = () => {
    Axios.get('/workers').then((response) => {
      this.setState({
        workerList: response.data
      })
    })
  }

  profilePic = (worker) => {
    const defaultAvatar = <Avatar shape="square" size={150} icon={<UserOutlined />} />;
    const customAvatar = <img className="worker-profile-avatar" alt="profile-image" src={`http://localhost:8080/${worker.image_url}`} />;
    return (
      <Row>
        <Col>
          <Row>
            {worker.image_url ? customAvatar : defaultAvatar}
          </Row>
          <Row>
            <Button onClick={() => this.editModal(worker)} style={{ width: '100%', marginTop: '10px' }}>Edit Profile</Button>
          </Row>
        </Col>
      </Row>
    )
  }

  editModal = (worker) => {
    this.setState({
      workerId: worker.id,
      fname: worker.fname,
      lname: worker.lname,
      wage_rate: worker.wage_rate,
      gender: worker.gender,
      race: worker.race,
      bank_account_id: worker.bank_account_id,
      phone: worker.phone,
      isEmployed: worker.isEmployed
    },
      () => {
        this.props.form.setFieldsValue({
          fname: this.state.fname,
          lname: this.state.lname,
          wage_rate: this.state.wage_rate,
          gender: this.state.gender,
          race: this.state.race,
          bank_account_id: this.state.bank_account_id,
          phone: this.state.phone,
          isEmployed: this.state.isEmployed ? '1' : '0'
        },
          () => { this.setState({ editVisible: true }) }
        )
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleRadio = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSelect = (e) => {
    this.setState({ isEmployed: e });
  }

  handleUpdate = async () => {
    if (!this.state.fname || !this.state.wage_rate) {
      console.log('form incompleted');
    } else {
      let payload = new FormData();

      payload.append('fname', this.state.fname);
      payload.append('lname', this.state.lname);
      payload.append('wage_rate', this.state.wage_rate);
      payload.append('gender', this.state.gender);
      payload.append('race', this.state.race);
      payload.append('bank_account_id', this.state.bank_account_id);
      payload.append('phone', this.state.phone);
      payload.append('isEmployed', this.state.isEmployed);
      payload.append('photoPost', this.state.fileList[0])

      let result = await Axios.put(`/update-worker/${this.state.workerId}`, payload);
      console.log(result);
      this.getWorker();
      this.editModelExit();
    }
  }

  showDelConfirm = () => {
    confirm({
      title: 'Are you sure delete this worker?',
      icon: <ExclamationCircleOutlined />,
      content: `All data of '${this.state.fname} ${this.state.lname}' will be erased!'`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        console.log('Deleted!');
        this.handleDelete();
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  handleDelete = async () => {
    let result = await Axios.delete(`/delete-worker/${this.state.workerId}`);
    console.log(result);
    this.getWorker();
    this.editModelExit();
  }

  editModelExit = () => {
    this.setState({
      workerId: undefined,
      fname: '',
      lname: '',
      wage_rate: '',
      gender: '',
      race: '',
      bank_account_id: '',
      phone: '',
      isEmployed: '',
      fileList: [],
      editVisible: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

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

    //displayNotes = filteredNotes.filter(note => note.title.toLowerCase().search(searchInput) >= 0);

    return (
      <Row>
        <Col>
          <Row style={{ margin: "0 5%" }}>
            <h1 className="page-header">Worker Database</h1>
          </Row>
          <Row style={{ margin: "0 10%" }}>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={this.state.workerList}
              renderItem={worker => (
                <List.Item
                  key={worker.id}
                  extra={this.profilePic(worker)}
                >
                  <List.Item.Meta
                    title={`${worker.fname} ${worker.lname}`}
                  />
                  <WorkerDetail workerData={worker} />
                </List.Item>
              )}
            />
            <Modal
              title="Edit Worker"
              visible={this.state.editVisible}
              onOk={this.handleUpdate}
              onCancel={this.editModelExit}
              width="70%"
              footer={[
                <Button key="delete" type="danger" style={{ float: 'left' }} onClick={this.showDelConfirm}>
                  Delete
                </Button>,
                <Button key="back" onClick={this.editModelExit}>
                  Cancle
                </Button>,
                <Button key="submit" type="primary" onClick={this.handleUpdate}>
                  Update
            </Button>
              ]}
            >
              <Form
                name="edit-form"
              >
                <Row type="flex" justify="space-around">
                  <Col span={11}>
                    <Form.Item label="First Name">
                      {getFieldDecorator('fname', {
                        rules: [{ required: true, message: 'Please enter worker\'s first name' }],
                        onChange: this.handleChange
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item label="Last Name">
                      {getFieldDecorator('lname', {
                        onChange: this.handleChange
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item label="Wage Rate">
                      {getFieldDecorator('wage_rate', {
                        rules: [{ required: true, message: 'Please enter worker\'s wage rate' }],
                        onChange: this.handleChange
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item label="Gender">
                      {getFieldDecorator('gender', {
                        onChange: this.handleRadio
                      })(
                        <Radio.Group name='gender'>
                          <Radio.Button value="male">Male</Radio.Button>
                          <Radio.Button value="female">Female</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>

                    <Form.Item
                      label="Profile Image"
                    >
                      {getFieldDecorator('photoPost', {
                      })(
                        <Upload {...props}>
                          <Button>
                            <Icon type="upload" /> Select File
                        </Button>
                        </Upload>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Race">
                      {getFieldDecorator('race', {
                        onChange: this.handleChange
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item label="Bank Account ID">
                      {getFieldDecorator('bank_account_id', {
                        onChange: this.handleChange
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item label="Phone">
                      {getFieldDecorator('phone', {
                        onChange: this.handleChange
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item label="Work Status">
                      {getFieldDecorator('isEmployed', {
                        onChange: this.handleSelect,
                        initialValue: '1'
                      })(
                        <Select style={{ width: 120 }}>
                          <Option value="1">Employed</Option>
                          <Option value="0">Unemployed</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
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

const Workers = Form.create()(WorkersComp)

export default connect(mapStateToProps, null)(Workers)
