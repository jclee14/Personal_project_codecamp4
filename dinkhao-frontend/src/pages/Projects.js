import React from 'react'
import { Table, Modal, Form, Input, DatePicker } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

var moment = require('moment');
moment().format();

class ProjectsComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      projectList: [],
      projectId: undefined,
      projectName: '',
      projectLocation: '',
      projectStartDate: undefined,
      projectEndDate: undefined,
      editVisible: false
    }
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getProject();
  }

  getProject = () => {
    Axios.get('/projects').then((response) => {
      this.setState({
        projectList: response.data
      })
    })
  }

  editModal = (record) => {
    this.setState({
      projectId: record.id,
      projectName: record.name,
      projectLocation: record.location,
      projectStartDate: record.start_date,
      projectEndDate: record.end_date
    },
      () => {
        this.props.form.setFieldsValue({
          projectName: this.state.projectName,
          projectLocation: this.state.projectLocation,
          projectStartDate: moment(this.state.projectStartDate),
          projectEndDate: moment(this.state.projectEndDate)
        },
          () => { this.setState({ editVisible: true }) }
        )
      });
  }

  handleUpdate = async () => {
    if (!this.state.projectName || !this.state.projectLocation || !this.state.projectStartDate || !this.state.projectEndDate) {
      console.log('form incompleted');
    } else {
      let payload = new FormData();

      payload.append('name', this.state.projectName);
      payload.append('location', this.state.projectLocation);
      payload.append('start_date', this.state.projectStartDate);
      payload.append('end_date', this.state.projectEndDate);

      let updateResult = await Axios.put(`/update-project/${this.state.projectId}`, payload);
      console.log(updateResult);
      this.getProject();
      this.editModelExit();
    }
  }

  editModelExit = () => {
    this.setState({
      projectId: undefined,
      projectName: '',
      projectLocation: '',
      projectStartDate: undefined,
      projectEndDate: undefined,
      editVisible: false
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleDatePick = (name, value) => {
    this.setState({ [name]: value.format('YYYY-MM-DD') });
  }

  handleDelete = async (id) => {
    let delProjectResult = await Axios.delete(`/delete-project/${id}`);
    console.log(delProjectResult);
    this.getProject();
    // let delAdministerResult = await Axios.delete(`/delete-administerByProject/${id}`)
    // console.log(delAdministerResult);
  }

  deleteConfirm = (record) => {
    console.log(record);
    confirm({
      title: 'Do you Want to delete this project?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Name:{'\u00A0'} <span className="project-confirm-data">{record.name}</span></p>
          <p>Location:{'\u00A0'} <span className="project-confirm-data">{record.location}</span></p>
          <p>Start date:{'\u00A0'} <span className="project-confirm-data">{record.start_date}</span></p>
          <p>End date:{'\u00A0'} <span className="project-confirm-data">{record.end_date}</span></p>
        </div>
      ),
      onOk: () => {
        this.handleDelete(record.id);
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  render() {

    const columns = [
      {
        title: 'Project ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
      },
      {
        title: 'End Date',
        dataIndex: 'end_date',
        key: 'end_date',
      },
      {
        title: 'Option',
        dataIndex: 'option',
        render: (_, record) => (
          <span>
            <button onClick={() => this.editModal(record)} style={{ marginRight: 16 }}>Edit</button>
            <button onClick={() => this.deleteConfirm(record)}>Delete</button>
          </span>
        )
      }
    ];

    const { getFieldDecorator } = this.props.form;

    return (
      <>
        <Table dataSource={this.state.projectList} columns={columns} />
        <Modal
          title="Edit Project"
          visible={this.state.editVisible}
          onOk={this.handleUpdate}
          onCancel={this.editModelExit}
        >
          <Form
            name="edit-form"
          >
            <Form.Item label="Project Name">
              {getFieldDecorator('projectName', {
                onChange: this.handleChange,
                rules: [{ required: true, message: 'Please input project name!' }]
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item label="Location">
              {getFieldDecorator('projectLocation', {
                onChange: this.handleChange,
                rules: [{ required: true, message: 'Please input project location!' }],
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item label="Start Date">
              {getFieldDecorator('projectStartDate', {
                rules: [{ required: true, message: 'Please select start date!' }]
              })(
                <DatePicker onChange={(value) => this.handleDatePick("projectStartDate", value)} allowClear={false} />
              )}
            </Form.Item>

            <Form.Item label="End Date">
              {getFieldDecorator('projectEndDate', {
                rules: [{ required: true, message: 'Please select end date!' }],
              })(
                <DatePicker onChange={(value) => this.handleDatePick("projectEndDate", value)} allowClear={false} />
              )}
            </Form.Item>
          </Form>
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

const Projects = Form.create()(ProjectsComp)

export default connect(mapStateToProps, null)(Projects)
