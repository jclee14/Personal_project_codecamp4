import React from 'react'
import { Row, Col, Form, Input, Button, DatePicker, Modal } from 'antd'
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
    let payloadAdminister = new FormData();

    payloadProject.append('name', this.state.projectName);
    payloadProject.append('location', this.state.projectLocation);
    payloadProject.append('start_date', this.state.projectStartDate);
    payloadProject.append('end_date', this.state.projectEndDate);

    let createProjectResult = await Axios.post('/create-project', payloadProject);
    console.log(createProjectResult);

    payloadAdminister.append('projectId', createProjectResult.data.id);
    payloadAdminister.append('userId', this.state.user.id);

    let createAdministerResult = await Axios.post('/create-administer', payloadAdminister);
    console.log(createAdministerResult);

    this.setState({
      projectName: '',
      projectLocation: '',
      projectStartDate: undefined,
      projectEndDate: undefined,
      modelVisible: false,
    });

    this.props.form.resetFields();
  }

  showErrorModal() {
    Modal.error({
      title: 'Form Incompleted',
      content: 'Please fill every form field!',
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
      this.showErrorModal();
    } else {
      this.showConfirm();
    }
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
        <Form
          {...layout}
          name="basic"
        >
          <Form.Item label="Project Name">
            {getFieldDecorator('projectName', {
              onChange: this.handleChange
            })(
              <Input />
            )}
          </Form.Item>

          <Form.Item label="Location">
            {getFieldDecorator('projectLocation', {
              onChange: this.handleChange
            })(
              <Input />
            )}
          </Form.Item>

          <Form.Item label="Start Date">
            {getFieldDecorator('projectStartDate')(
              <DatePicker onChange={(value) => this.handleDatePick("projectStartDate", value)} />
            )}
          </Form.Item>

          <Form.Item label="End Date">
            {getFieldDecorator('projectEndDate')(
              <DatePicker onChange={(value) => this.handleDatePick("projectEndDate", value)} />
            )}
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button onClick={this.formValidation}>
              Submit
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
