import React from 'react'
import { Row, Col, Select, Table, Modal, Form, Input, DatePicker, Divider, Card } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined, UserOutlined, FilePptOutlined, PoundOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;
const { MonthPicker } = DatePicker;

var moment = require('moment');
moment().format();

class GeneralAccountingComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      selectDateRange: undefined,
      selectMonth: undefined,
      workList: [],
      totalExpense: '',
      totalProject: [],
      totalWorker: [],
      projectList: [],
      projectMonthly: [],
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

  getDataSource = () => {
    let { totalProject, projectList, workList } = this.state;

    let targetProject = totalProject.map(id => {
      let [projectResult] = projectList.filter(data => data.id === id);
      let projectWork = workList.filter(data => data.projectId === id);
      let totalExpense = 0;
      let workerArr = [];
      for (let record of projectWork) {
        totalExpense += record['wage_earning'];
        workerArr.push(record['workerId']);
      }
      let totalWorker = workerArr.filter((item, index) => workerArr.indexOf(item) === index);

      return {
        ...projectResult,
        projectExpense: totalExpense,
        workerAmount: totalWorker.length
      };
    })
    //console.log(targetProject);
    this.setState({ displayList: targetProject });
  }

  genWorkMonthly = async () => {
    let { selectMonth, selectDateRange } = this.state;
    if (selectMonth && selectDateRange) {
      try {
        let time = selectMonth.split("-");
        let response = await Axios.get(`/works`);
        let monthFilter = response.data.filter(record => record.date.split("-")[0] === time[0] && record.date.split("-")[1] === time[1]);
        let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);
        this.setState({
          workList: dateFilter
        },
          () => this.getSummary()
        );
      }
      catch (err) {
        console.log(err)
      }
    } else {
      console.log('data incompleted!')
    }
  }

  getSummary = () => {
    let { workList } = this.state;
    let projectArr = [];
    let workerArr = [];
    let totalExpense = 0;
    for (let record of workList) {
      totalExpense += record['wage_earning'];
      projectArr.push(record['projectId']);
      workerArr.push(record['workerId']);
    }
    let totalProject = projectArr.filter((item, index) => projectArr.indexOf(item) === index);
    let totalWorker = workerArr.filter((item, index) => workerArr.indexOf(item) === index);
    console.log(totalProject);
    this.setState({
      totalExpense: totalExpense,
      totalProject: totalProject,
      totalWorker: totalWorker
    },
      () => this.getDataSource()
    );
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

  handleDateRangeSelect = (value) => {
    let month = this.state.selectMonth.split("-");
    let extraD = 0;

    if (value === 'secondHalf') {
      if (month[1] === '01' || month[1] === '03' || month[1] === '05' || month[1] === '07' || month[1] === '08' || month[1] === '10' || month[1] === '12') {
        extraD = 1;
      } else if (month[1] === '02') {
        extraD = -1;
      } else {
        extraD = 0;
      }
    } else {
      extraD = 0;
    }

    this.setState({
      selectDateRange: value,
      hrValue: {},
      extraDate: extraD,
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    },
      () => this.genWorkMonthly()
    );
  }

  handleMonthPick = async (date, dateString) => {
    let extraD = 0;
    let month;

    if (dateString) {
      month = dateString.split("-");
    }

    if (this.state.selectDateRange === 'secondHalf') {
      if (month[1] === '01' || month[1] === '03' || month[1] === '05' || month[1] === '07' || month[1] === '08' || month[1] === '10' || month[1] === '12') {
        extraD = 1;
      } else if (month[1] === '02') {
        extraD = -1;
      } else {
        extraD = 0;
      }
    } else {
      extraD = 0;
    }

    await this.setState({
      selectMonth: dateString,
      hrValue: {},
      extraDate: extraD,
      totalHr: { ot_early: '0', normal_morning: '0', ot_noon: '0', normal_afternoon: '0', ot_evening: '0', ot_night: '0' }
    },
      () => this.genWorkMonthly()
    );
  }

  render() {

    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Worker Amount',
        dataIndex: 'workerAmount',
        key: 'workerAmount',
      },
      {
        title: 'Monthly Expense',
        dataIndex: 'projectExpense',
        key: 'projectExpense',
      }
    ];

    const { getFieldDecorator } = this.props.form;

    return (
      <Row style={{ margin: "0 5%" }}>
        <Col>
          <Row>
            <Col>
              <Row>
                <h1 className="page-header">General Accounting</h1>
              </Row>
              <Row type="flex" align-items="left" align="middle" >
                <Select
                  showSearch
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder={"Select date range"}
                  optionFilterProp="children"
                  onChange={this.handleDateRangeSelect}
                  disabled={this.state.selectMonth ? false : true}
                >
                  <Option value={'firstHalf'}>1st - 15th</Option>
                  <Option value={'secondHalf'}>16th - 30th/31st</Option>
                </Select>
                <MonthPicker placeholder="Select month first" onChange={this.handleMonthPick} />
              </Row>
              <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
            </Col>
          </Row>
          <Row style={{ backgroundColor: "white", paddingTop: '15px' }}>
            <Col>
              <Row type="flex" justify="center">
                <Col>
                  <h2 className="accounting-date-display">1-15 April 2020</h2>
                </Col>
              </Row>
              <Row>
                <Col span={8} style={{ padding: "20px" }}>
                  <Row type="flex" justify="center">
                    <h2>Total Projects <FilePptOutlined style={{ marginLeft: "5px" }} /></h2>
                  </Row>
                  <Row type="flex" justify="center">
                    <p className="accounting-summary-result">{this.state.totalProject ? this.state.totalProject.length : 0}</p>
                  </Row>
                </Col>
                <Col span={8} style={{ padding: "20px" }}>
                  <Row type="flex" justify="center">
                    <h2>Total Expense <PoundOutlined style={{ marginLeft: "5px" }} /></h2>
                  </Row>
                  <Row type="flex" justify="center">
                    <p className="accounting-summary-result">{this.state.totalExpense ? this.state.totalExpense : 0} Baht</p>
                  </Row>
                </Col>
                <Col span={8} style={{ padding: "20px" }}>
                  <Row type="flex" justify="center">
                    <h2>Total Workers <UserOutlined style={{ marginLeft: "5px" }} /></h2>
                  </Row>
                  <Row type="flex" justify="center">
                    <p className="accounting-summary-result">{this.state.totalWorker ? this.state.totalWorker.length : 0}</p>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
            <Table dataSource={this.state.displayList} columns={columns} />
            {/* <Modal
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
            </Modal> */}
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

const GeneralAccounting = Form.create()(GeneralAccountingComp)

export default connect(mapStateToProps, null)(GeneralAccounting)
