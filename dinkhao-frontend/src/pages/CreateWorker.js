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

  handleSelectEmployed = (e) => {
    this.setState({ isEmployed: e });
  }

  handleCreateWorker = async () => {
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

    try {
      let result = await Axios.post('/create-worker', payload);
      console.log(result);
      this.showSuccess();
      this.formReset();
    }
    catch (err) {
      console.log(err.message);
      this.setState({
        modelVisible: false
      });
      this.showErrorModal('Error', 'This person was already registered.');
    }
  }

  showErrorModal(title, message) {
    Modal.error({
      title: title,
      content: message,
    });
  }

  showConfirm = () => {
    this.setState({
      modelVisible: true,
    });
  };

  showSuccess = () => {
    Modal.success({
      content: 'Worker has been registered successfully.',
    });
  }

  handleCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };

  formValidation = () => {
    if (!this.state.fname || !this.state.wage_rate || !this.state.gender) {
      this.showErrorModal('Form Incompleted', 'Please fill at least \'First Name\', \'Wage Rage\' and \'Gender\' fields!');
    } else {
      this.showConfirm();
    }
  }

  formReset = () => {
    this.setState({
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
    });

    this.props.form.resetFields();
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
                  rules: [{ required: true, message: 'Please select worker\'s gender' }],
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
                  onChange: this.handleSelectEmployed,
                  initialValue: '1'
                })(
                  <Select style={{ width: 120 }}>
                    <Option value="1">Employed</Option>
                    <Option value="0">Unemployed</Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" onClick={this.formValidation} style={{ width: '200px', marginRight: '20px' }}>
                  Submit
                </Button>
                <Button type="danger" onClick={this.formReset} >
                  Reset
                </Button>
              </Form.Item>

            </Form>

            <Modal
              title="Create Worker Confirmation"
              visible={this.state.modelVisible}
              onOk={this.handleCreateWorker}
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
