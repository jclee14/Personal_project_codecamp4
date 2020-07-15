import React from 'react'
import { Row, Col, Form, Input, Button, DatePicker, Modal, Divider } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

class CreateProjectForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      projectName: '',
      projectLocation: '',
      projectStartDate: undefined,
      projectEndDate: undefined,
      modelVisible: false
    }
  }

  componentDidMount() {
    this.setState({
      user: {
        id: this.props.user.id,
        name: this.props.user.name
      }
    })
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleDatePick = (name, value) => {
    this.setState({ [name]: value.format('YYYY-MM-DD') });
  }

  handleCreateProject = async () => {
    let payloadProject = new FormData();

    payloadProject.append('name', this.state.projectName);
    payloadProject.append('location', this.state.projectLocation);
    payloadProject.append('start_date', this.state.projectStartDate);
    payloadProject.append('end_date', this.state.projectEndDate);

    try {
      let createProjectResult = await Axios.post('/create-project', payloadProject);
      console.log(createProjectResult);
      await this.handleCreateAdmistrater(createProjectResult);
      this.showSuccess();
      this.formReset();
    }
    catch (err) {
      console.log(err.response);
      this.setState({
        modelVisible: false
      });
      this.showErrorModal(err.response.data.topic, err.response.data.message);
    }
  }

  handleCreateAdmistrater = async (createProjectResult) => {
    let payloadAdminister = new FormData();
    payloadAdminister.append('projectId', createProjectResult.data.id);
    payloadAdminister.append('userId', this.state.user.id);

    try {
      let createAdministerResult = await Axios.post('/create-administer', payloadAdminister);
      console.log(createAdministerResult);
    }
    catch (err) {
      console.log(err.response);
      this.setState({
        modelVisible: false
      });
      this.showErrorModal(err.response.data.topic, err.response.data.message);
    }
  }

  showSuccess = () => {
    Modal.success({
      content: 'Project has been registered successfully.',
    });
  }

  showErrorModal(title = "Error", message) {
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

  handleCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };

  formValidation = () => {
    if (!this.state.projectName || !this.state.projectLocation || !this.state.projectStartDate || !this.state.projectEndDate) {
      this.showErrorModal('Form Incompleted', 'Please fill every form field!');
    } else {
      this.showConfirm();
    }
  }

  formReset = () => {
    this.setState({
      projectName: '',
      projectLocation: '',
      projectStartDate: undefined,
      projectEndDate: undefined,
      modelVisible: false,
    });

    this.props.form.resetFields();
  }

  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <>
        <Row style={{ margin: "0 5%" }}>
          <h1 className="page-header">Create New Project</h1>
          <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
        </Row>
        <Row>
          <Col span={20}>
            <Form
              {...layout}
              name="project-create-form"
            >
              <Form.Item label="Project Name">
                {getFieldDecorator('projectName', {
                  rules: [{ required: true, message: 'Please enter project\'s name' }],
                  onChange: this.handleChange
                })(
                  <Input />
                )}
              </Form.Item>

              <Form.Item label="Location">
                {getFieldDecorator('projectLocation', {
                  rules: [{ required: true, message: 'Please enter project\'s location' }],
                  onChange: this.handleChange
                })(
                  <Input />
                )}
              </Form.Item>

              <Form.Item label="Start Date">
                {getFieldDecorator('projectStartDate', {
                  rules: [{ required: true, message: 'Please enter project\'s start date' }],
                })(
                  <DatePicker onChange={(value) => this.handleDatePick("projectStartDate", value)} allowClear={false} />
                )}
              </Form.Item>

              <Form.Item label="End Date">
                {getFieldDecorator('projectEndDate', {
                  rules: [{ required: true, message: 'Please enter project\'s end date' }],
                })(
                  <DatePicker onChange={(value) => this.handleDatePick("projectEndDate", value)} allowClear={false} />
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
              title="Create Project Confirmation"
              visible={this.state.modelVisible}
              onOk={this.handleCreateProject}
              onCancel={this.handleCancel}
            >
              <p>Name:{'\u00A0'} <span className="project-confirm-data">{this.state.projectName}</span></p>
              <p>Location:{'\u00A0'} <span className="project-confirm-data">{this.state.projectLocation}</span></p>
              <p>Start date:{'\u00A0'} <span className="project-confirm-data">{this.state.projectStartDate}</span></p>
              <p>End date:{'\u00A0'} <span className="project-confirm-data">{this.state.projectEndDate}</span></p>
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

const CreateProject = Form.create()(CreateProjectForm)

export default connect(mapStateToProps, null)(CreateProject)
