import React from 'react'
import { Row, Col, Form, Input, Button, DatePicker, Modal, Select, Collapse, Table, Divider } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;
const { Panel } = Collapse;
var moment = require('moment');
moment().format();

class CreatePaybackForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      workerList: [],
      extraChargeList: [],
      paybackList: [],
      displayList: [],
      paybackId: undefined,
      selectWorkerId: undefined,
      selectWorkerName: '',
      extraChargeId: undefined,
      taskName: '',
      amount: '',
      date: undefined,
      modelVisible: false,
      editVisible: false,
      editPaybackId: undefined,
      editExtraChargeId: undefined,
      editWorkerId: undefined,
      editAmount: '',
      editPrice: '',
      editDate: undefined
    }
  }

  componentDidMount() {
    this.getWorker();
  }

  getWorker = () => {
    Axios.get('/workers').then((response) => {
      this.setState({
        workerList: response.data
      },
        () => this.getExtraCharge()
      )
    })
  }

  getExtraCharge = () => {
    Axios.get('/extracharges').then((response) => {
      this.setState({
        extraChargeList: response.data
      },
        () => this.getPayback()
      )
    })
  }

  getPayback = () => {
    Axios.get('/paybacks').then((response) => {
      this.setState({
        paybackList: response.data
      },
        () => this.getDataSource()
      )
    })
  }

  getDataSource = () => {
    let data = this.state.paybackList.map((item) => {
      var workerId = item.workerId;
      var extraChargeId = item.extrachargeId;
      let targetWorker = this.state.workerList.filter(worker => workerId === worker.id);
      let targetTask = this.state.extraChargeList.filter(task => extraChargeId === task.id);
      console.log(targetTask)
      return {
        ...item,
        name: targetWorker[0]['fname'] + ' ' + targetWorker[0]['lname'],
        task: targetTask[0]['task']
      }
    })
    this.setState({ displayList: data });
  }

  handleWorkerSelect = (value) => {
    this.setState({ selectWorkerId: value });
  }

  handleTaskSelect = (value) => {
    this.setState({ extraChargeId: value });
  }

  handleAmountInput = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleDatePick = (name, value) => {
    this.setState({ [name]: value.format('YYYY-MM-DD') });
  }

  handleCreatePayback = async () => {
    let payload = new FormData();

    payload.append('workerId', this.state.selectWorkerId);
    payload.append('extrachargeId', this.state.extraChargeId);
    payload.append('date', this.state.date);
    payload.append('price', this.state.amount);
    try {
      let result = await Axios.post('/create-payback', payload);
      console.log(result);
      this.setState({
        selectWorkerId: undefined,
        selectWorkerName: '',
        extraChargeId: undefined,
        taskName: '',
        amount: '',
        date: undefined,
        modelVisible: false
      },
        () => this.getPayback()
      );

      this.props.form.resetFields();
    }
    catch (err) {
      console.log(err.message);
      this.setState({
        modelVisible: false
      });
      this.showErrorModal('Cannot create duplicated record!');
    }
  }

  showErrorModal(message) {
    Modal.error({
      title: 'Form Incompleted',
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
    if (!this.state.selectWorkerId || !this.state.extraChargeId || !this.state.date || !this.state.amount) {
      this.showErrorModal('Please fill every form field!');
    } else {
      this.searchObj(this.state.workerList, this.state.selectWorkerId, true);
      this.searchObj(this.state.extraChargeList, this.state.extraChargeId, false);
      this.showConfirm();
    }
  }

  searchObj = (obj, id, isWorker) => {
    for (var key in obj) {
      var value = obj[key];
      if (typeof value === 'object') {
        this.searchObj(value, id, isWorker);
      }
      if (value == id) {
        if (isWorker) {
          this.setState({ selectWorkerName: `${obj['fname']} ${obj['lname']}` });
        } else {
          this.setState({ taskName: obj['task'] });
        }
      }
    }
  }

  handleReset = () => {
    this.setState({
      selectWorkerId: undefined,
      selectWorkerName: '',
      extraChargeId: undefined,
      taskName: '',
      amount: '',
      date: undefined,
      modelVisible: false
    });

    this.props.form.resetFields();
  }

  editModal = (record) => {
    this.setState({
      editPaybackId: record.id,
      editWorkerId: record.workerId,
      editExtraChargeId: record.extrachargeId,
      editAmount: record.price,
      editDate: record.date
    },
      () => {
        this.props.form.setFieldsValue({
          name: this.state.editWorkerId,
          task: this.state.editExtraChargeId,
          editAmount: this.state.editAmount,
          editDate: moment(this.state.editDate)
        },
          () => { this.setState({ editVisible: true }) }
        )
      });
  }

  handleEditWorkerSelect = (value) => {
    this.setState({ editWorkerId: value });
  }

  handleEditTaskSelect = (value) => {
    this.setState({ editExtraChargeId: value });
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleUpdate = async () => {
    if (!this.state.editWorkerId || !this.state.editExtraChargeId || !this.state.editDate || !this.state.editAmount) {
      console.log('form incompleted');
    } else {
      try {
        let payload = new FormData();

        payload.append('workerId', this.state.editWorkerId);
        payload.append('extrachargeId', this.state.editExtraChargeId);
        payload.append('date', this.state.editDate);
        payload.append('price', this.state.editAmount);

        let updateResult = await Axios.put(`/update-payback/${this.state.editPaybackId}`, payload);
        console.log(updateResult);
        this.getPayback();
        this.editModelExit();
      }
      catch (err) {
        console.log(err.message);
        this.editModelExit();
        this.showErrorModal('Cannot create duplicated record!');
      }
    }
  }

  editModelExit = () => {
    this.setState({
      editPaybackId: undefined,
      editWorkerId: undefined,
      editExtraChargeId: undefined,
      editAmount: '',
      editDate: undefined,
      editVisible: false
    },
      () => this.props.form.resetFields()
    );
  };

  handleDelete = async (id) => {
    let result = await Axios.delete(`/delete-payback/${id}`);
    console.log(result);
    this.getPayback();
  }

  deleteConfirm = (record) => {
    console.log(record);
    confirm({
      title: 'Do you Want to delete this project?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Worker Name:{'\u00A0'} <span className="project-confirm-data">{record.name}</span></p>
          <p>Task:{'\u00A0'} <span className="project-confirm-data">{record.task}</span></p>
          <p>Amount:{'\u00A0'} <span className="project-confirm-data">{record.price}</span></p>
          <p>Date:{'\u00A0'} <span className="project-confirm-data">{record.date}</span></p>
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
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Worker Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Task',
        dataIndex: 'task',
        key: 'task',
      },
      {
        title: 'Amount',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
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

    return (
      <>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Create new record" key="1">
            <Form
              {...layout}
              name="extraCharge-create-form"
            >
              <Form.Item label="Worker Name">
                {getFieldDecorator('workerName', {
                  onChange: this.handleWorkerSelect
                })(
                  <Select
                    showSearch
                    style={{ width: 200, marginRight: "10px" }}
                    placeholder="Select worker name here"
                    optionFilterProp="children"
                    onSearch={this.handleSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value={undefined}>Select worker name here</Option>
                    {this.state.workerList.map((worker) => (
                      <Option value={worker.id}>{`${worker.fname} ${worker.lname}`}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Task">
                {getFieldDecorator('taskName', {
                  onChange: this.handleTaskSelect
                })(
                  <Select
                    showSearch
                    style={{ width: 200, marginRight: "10px" }}
                    placeholder="Select task name here"
                    optionFilterProp="children"
                    onSearch={this.handleSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value={undefined}>Select task name here</Option>
                    {this.state.extraChargeList.map((charge) => (
                      <Option value={charge.id}>{charge.task}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Price Amount">
                {getFieldDecorator('amount', {
                  onChange: this.handleAmountInput
                })(
                  <Input />
                )}
              </Form.Item>

              <Form.Item label="Date">
                {getFieldDecorator('date')(
                  <DatePicker onChange={(value) => this.handleDatePick("date", value)} />
                )}
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button onClick={this.formValidation} style={{ marginRight: '10px' }}>
                  Submit
            </Button>
                <Button onClick={this.handleReset}>
                  Reset
            </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>

        <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />

        <Table dataSource={this.state.displayList} columns={columns} style={{ marginTop: '20px' }} />

        <Modal
          title="Payback Confirmation"
          visible={this.state.modelVisible}
          onOk={this.handleCreatePayback}
          onCancel={this.handleCancel}
        >
          <p>Worker Name:{'\u00A0'} <span className="project-confirm-data">{this.state.selectWorkerName}</span></p>
          <p>Task:{'\u00A0'} <span className="project-confirm-data">{this.state.taskName}</span></p>
          <p>Amount:{'\u00A0'} <span className="project-confirm-data">{this.state.amount}</span></p>
          <p>Date:{'\u00A0'} <span className="project-confirm-data">{this.state.date}</span></p>
        </Modal>

        <Modal
          title="Edit Payback"
          visible={this.state.editVisible}
          onOk={this.handleUpdate}
          onCancel={this.editModelExit}
        >
          <Form
            name="edit-form"
          >
            <Form.Item label="Worker Name">
              {getFieldDecorator('name', {
                onChange: this.handleEditWorkerSelect,
                rules: [{ required: true, message: 'Please select worker name!' }]
              })(
                <Select
                  showSearch
                  style={{ width: 200, marginRight: "10px" }}
                  placeholder="Select worker name here"
                  optionFilterProp="children"
                  onSearch={this.handleSearch}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.workerList.map((worker) => (
                    <Option value={worker.id}>{`${worker.fname} ${worker.lname}`}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Task">
              {getFieldDecorator('task', {
                onChange: this.handleEditTaskSelect,
                rules: [{ required: true, message: 'Please select task name!' }],
              })(
                <Select
                  showSearch
                  style={{ width: 200, marginRight: "10px" }}
                  placeholder="Select task name here"
                  optionFilterProp="children"
                  onSearch={this.handleSearch}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.extraChargeList.map((charge) => (
                    <Option value={charge.id}>{charge.task}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="Amount">
              {getFieldDecorator('editAmount', {
                onChange: this.handleChange,
                rules: [{ required: true, message: 'Please input amount!' }],
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item label="Date">
              {getFieldDecorator('editDate', {
                rules: [{ required: true, message: 'Please select date!' }],
              })(
                <DatePicker onChange={(value) => this.handleDatePick('editDate', value)} allowClear={false} />
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

const Payback = Form.create()(CreatePaybackForm)

export default connect(mapStateToProps, null)(Payback)
