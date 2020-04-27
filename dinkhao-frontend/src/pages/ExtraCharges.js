import React from 'react'
import { Row, Col, Table, Modal, Form, Input, DatePicker, Divider, Button } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

var moment = require('moment');
moment().format();

class ExtraChargesComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      extraChargeList: [],
      extraChargeId: undefined,
      newTask: '',
      taskName: '',
      editVisible: false
    }
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getExtraCharges();
  }

  getExtraCharges = () => {
    Axios.get('/extraCharges').then((response) => {
      this.setState({
        extraChargeList: response.data
      })
    })
  }

  formValidation = () => {
    if (!this.state.newTask) {
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
      title: 'Do you want to add this task?',
      icon: <ExclamationCircleOutlined />,
      content: `${this.state.newTask}`,
      onOk: () => {
        this.handleCreateTask();
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  handleCreateTask = async () => {
    let payload = new FormData();

    payload.append('task', this.state.newTask);

    let result = await Axios.post('/create-extracharge', payload);
    console.log(result);

    this.setState({
      newTask: ''
    });

    this.getExtraCharges();
    this.props.form.resetFields();
  }

  editModal = (record) => {
    this.setState({
      extraChargeId: record.id,
      taskName: record.task
    },
      () => {
        this.props.form.setFieldsValue({
          taskName: this.state.taskName
        },
          () => { this.setState({ editVisible: true }) }
        )
      });
  }

  handleUpdate = async () => {
    if (!this.state.taskName) {
      console.log('form incompleted');
    } else {
      let payload = new FormData();

      payload.append('task', this.state.taskName);

      let result = await Axios.put(`/update-extracharge/${this.state.extraChargeId}`, payload);
      console.log(result);
      this.getExtraCharges();
      this.editModelExit();
    }
  }

  editModelExit = () => {
    this.setState({
      extraChargeId: undefined,
      taskName: '',
      editVisible: false
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleDelete = async (id) => {
    let result = await Axios.delete(`/delete-extracharge/${id}`);
    console.log(result);
    this.getExtraCharges();
  }

  deleteConfirm = (record) => {
    console.log(record);
    confirm({
      title: 'Do you Want to delete this task?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p><span className="project-confirm-data">'{record.task}'</span></p>
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
        title: 'Extra Charge ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Task',
        dataIndex: 'task',
        key: 'task',
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
            <h1 className="page-header">Extra Charge Database</h1>
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
                {getFieldDecorator('newTask', {
                  onChange: this.handleChange
                })(
                  <Input placeholder="Add new task here" />
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
            <Table dataSource={this.state.extraChargeList} columns={columns} />
            <Modal
              title="Edit Job"
              visible={this.state.editVisible}
              onOk={this.handleUpdate}
              onCancel={this.editModelExit}
            >
              <Form
                name="edit-form"
              >
                <Form.Item label="Task">
                  {getFieldDecorator('taskName', {
                    onChange: this.handleChange,
                    rules: [{ required: true, message: 'Please input task name!' }]
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

const ExtraCharges = Form.create()(ExtraChargesComp)

export default connect(mapStateToProps, null)(ExtraCharges)
