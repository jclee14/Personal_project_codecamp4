import React from 'react'
import { Row, Col, Form, Input, Button, Modal, Radio, Upload, Icon, Select } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'

const { Option } = Select;

class CreateWorkerForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      fname: '',
      lname: '',
      wage_rate: '',
      gender: '',
      race: '',
      bank_account_id: '',
      phone: '',
      isEmployed: '1',
      fileList: [],
      modelVisible: false
    }
  }

  componentDidMount() {
    this.setState({
      user: {
        id: this.props.user.id,
        name: this.props.user.name
      }
    },
      () => this.props.form.setFieldsValue({
        isEmployed: '1'
      })
    )
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

  handleCreateProject = async () => {
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

    let result = await Axios.post('/create-worker', payload);
    console.log(result);

    this.setState({
      fname: '',
      lname: '',
      wage_rate: '',
      gender: '',
      race: '',
      bank_account_id: '',
      phone: '',
      isEmployed: 1,
      fileList: [],
      modelVisible: false
    });

    this.props.form.resetFields();
  }

  showErrorModal() {
    Modal.error({
      title: 'Form Incompleted',
      content: 'Please fill at least \'First Name\' and \'Wage Rage\' fields!',
    });
  }

  showConfirm = () => {
    this.setState({
      modelVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };

  formValidation = () => {
    if (!this.state.fname || !this.state.wage_rate || !this.state.isEmployed) {
      this.showErrorModal();
    } else {
      this.showConfirm();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

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
      <>
        <Row>
          <Col span={20}>
            <Form
              {...layout}
              name="worker-form"
            >
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

              <Form.Item {...tailLayout}>
                <Button onClick={this.formValidation}>
                  Submit
                </Button>
              </Form.Item>

            </Form>

            <Modal
              title="Create Worker Confirmation"
              visible={this.state.modelVisible}
              onOk={this.handleCreateProject}
              onCancel={this.handleCancel}
            >
              <p>First Name:{'\u00A0'} <span className="project-confirm-data">{this.state.fname}</span></p>
              <p>Last Name:{'\u00A0'} <span className="project-confirm-data">{this.state.lname}</span></p>
              <p>Wage Rate:{'\u00A0'} <span className="project-confirm-data">{this.state.wage_rate}</span></p>
              <p>Gender:{'\u00A0'} <span className="project-confirm-data">{this.state.gender}</span></p>
              <p>Race:{'\u00A0'} <span className="project-confirm-data">{this.state.race}</span></p>
              <p>Bank Account ID:{'\u00A0'} <span className="project-confirm-data">{this.state.bank_account_id}</span></p>
              <p>Phone:{'\u00A0'} <span className="project-confirm-data">{this.state.phone}</span></p>
              <p>Work Status:{'\u00A0'} <span className="project-confirm-data">{this.state.isEmployed === '1' ? 'Employed' : 'Unemployed'}</span></p>
            </Modal>
          </Col>
        </Row>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
          user: state.user
  }
}

const CreateWorker = Form.create()(CreateWorkerForm)

export default connect(mapStateToProps, null)(CreateWorker)
