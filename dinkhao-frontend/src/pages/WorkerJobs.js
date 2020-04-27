import React from 'react'
import { Row, Col, Table, Modal, Form, Input, DatePicker, Divider, Button } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

var moment = require('moment');
moment().format();

class WorkerJobsComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      jobList: [],
      jobId: undefined,
      newJob: '',
      jobName: '',
      editVisible: false
    }
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getJob();
  }

  getJob = () => {
    Axios.get('/workerJobs').then((response) => {
      this.setState({
        jobList: response.data
      })
    })
  }

  formValidation = () => {
    if (!this.state.newJob) {
      this.showErrorModal();
    } else {
      this.showCreateConfirm();
    }
  }

  showErrorModal() {
    Modal.error({
      title: 'Form Incompleted',
      content: 'Please fill the form for adding!',
    });
  }

  showCreateConfirm = () => {
    confirm({
      title: 'Do you want to add this job?',
      icon: <ExclamationCircleOutlined />,
      content: `${this.state.newJob}`,
      onOk: () => {
        this.handleCreateJob();
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  handleCreateJob = async () => {
    let payload = new FormData();

    payload.append('name', this.state.newJob);

    let result = await Axios.post('/create-workerjob', payload);
    console.log(result);

    this.setState({
      newJob: ''
    });

    this.getJob();
    this.props.form.resetFields();
  }

  editModal = (record) => {
    this.setState({
      jobId: record.id,
      jobName: record.name
    },
      () => {
        this.props.form.setFieldsValue({
          jobName: this.state.jobName
        },
          () => { this.setState({ editVisible: true }) }
        )
      });
  }

  handleUpdate = async () => {
    if (!this.state.jobName) {
      console.log('form incompleted');
    } else {
      let payload = new FormData();

      payload.append('name', this.state.jobName);

      let result = await Axios.put(`/update-workerJob/${this.state.jobId}`, payload);
      console.log(result);
      this.getJob();
      this.editModelExit();
    }
  }

  editModelExit = () => {
    this.setState({
      jobId: undefined,
      jobName: '',
      editVisible: false
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleDelete = async (id) => {
    let result = await Axios.delete(`/delete-workerJob/${id}`);
    console.log(result);
    this.getJob();
  }

  deleteConfirm = (record) => {
    console.log(record);
    confirm({
      title: 'Do you Want to delete this job?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p><span className="project-confirm-data">'{record.name}'</span></p>
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
        title: 'Job ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
    const layout = {
      layout: "inline"
    };

    return (
      <Row>
        <Col>
          <Row style={{ margin: "0 5%" }}>
            <h1 className="page-header">Worker's Jobs Database</h1>
            {/* <Search
              placeholder="Search name here"
              onChange={this.handleSearch}
              style={{ width: 300 }}
            /> */}
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
          </Row>
          <Row style={{ margin: "0 10%" }}>
            <Form
              {...layout}
              name="job-create-form"
            >
              <Form.Item>
                {getFieldDecorator('newJob', {
                  onChange: this.handleChange
                })(
                  <Input placeholder="Add new job here" />
                )}
              </Form.Item>
              <Form.Item>
                <Button onClick={this.formValidation}>
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Row>
          <Row style={{ margin: "20px 10% 0" }}>
            <Table dataSource={this.state.jobList} columns={columns} />
            <Modal
              title="Edit Job"
              visible={this.state.editVisible}
              onOk={this.handleUpdate}
              onCancel={this.editModelExit}
            >
              <Form
                name="edit-form"
              >
                <Form.Item label="Job Name">
                  {getFieldDecorator('jobName', {
                    onChange: this.handleChange,
                    rules: [{ required: true, message: 'Please input job name!' }]
                  })(
                    <Input />
                  )}
                </Form.Item>
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

const WorkerJobs = Form.create()(WorkerJobsComp)

export default connect(mapStateToProps, null)(WorkerJobs)
