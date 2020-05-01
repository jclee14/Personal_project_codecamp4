import React from 'react'
import { Row, Col, Select, Table, Modal, Form, Input, DatePicker, Divider, Card } from 'antd'
import Axios from '../config/api.service'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined, UserOutlined, FilePptOutlined, PoundOutlined, FileExcelOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;
const { MonthPicker } = DatePicker;

var moment = require('moment');
moment().format();

class WorkerAccountingComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      selectDateRange: undefined,
      selectMonth: undefined,
      workList: [],
      debtList: [],
      trueDebtList: [],
      workerList: [],
      earnedWorkerId: [],
      totalExpense: 0,
      totalDebt: 0,
      projectList: [],
      projectMonthly: [],
      monthList: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      displayMonth: '',
      displayWorker: []
    }
  }

  componentDidMount() {
    this.getProject();
    this.getWorker();
  }

  getProject = () => {
    Axios.get('/projects').then((response) => {
      this.setState({
        projectList: response.data
      })
    })
  }

  getWorker = () => {
    Axios.get('/workers').then((response) => {
      this.setState({
        workerList: response.data
      })
    })
  }

  getDataSource = () => {
    let { workerList, workList, debtList } = this.state;

    let targetWorker = workerList.map(worker => {
      let workAttend = workList.filter(data => data.workerId === worker.id);
      let debtRecord = debtList.filter(data => data.workerId === worker.id);
      let totalEarn = 0;
      let totalDebt = 0;

      for (let record of workAttend) {
        totalEarn += parseFloat(record['wage_earning']);
      }
      for (let record of debtRecord) {
        totalDebt += parseFloat(record['price']);
      }

      let netEarn = totalEarn - totalDebt;
      let fullname = `${worker.fname} ${worker.lname}`;

      return {
        ...worker,
        name: fullname,
        workerExpense: totalEarn,
        workerDebt: totalDebt,
        workerNetExpense: netEarn
      }
    })

    this.setState({ displayWorker: targetWorker });
  }

  genWorkMonthly = async () => {
    let { selectMonth, selectDateRange } = this.state;
    const myMethod = () => {
      this.getExpenseSummary();
      this.getWorkerId();
    }
    if (selectMonth && selectDateRange) {
      try {

        let time = selectMonth.split("-");
        let response = await Axios.get(`/works`);
        let monthFilter = response.data.filter(record => record.date.split("-")[0] === time[0] && record.date.split("-")[1] === time[1]);
        let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);
        this.setState({
          workList: dateFilter
        },
          myMethod
        );
      }
      catch (err) {
        console.log(err)
      }
    } else {
      console.log('data incompleted!')
    }
  }

  getExpenseSummary = () => {
    let { workList } = this.state;
    let totalExpense = 0;
    for (let record of workList) {
      totalExpense += record['wage_earning'];
    }
    this.setState({
      totalExpense: totalExpense
    });
  }
  
  getWorkerId = () => {
    /*Get id from worker who earn money this month*/
    let { workList } = this.state;
    let workerArr = [];
    for (let record of workList) {
      workerArr.push(record['workerId']);
    }
    let workerFiltered = workerArr.filter((item, index) => workerArr.indexOf(item) === index);
    console.log(workerFiltered);
    this.setState({
      earnedWorkerId: workerFiltered
    },
      () => this.genDebtMonthly()
    );
  }

  genDebtMonthly = async () => {
    const myMethod = () => {
      this.getDebtSummary();
      this.getDataSource();
    }
    let { selectMonth, selectDateRange, earnedWorkerId } = this.state;
    if (selectMonth && selectDateRange) {
      try {
        let time = selectMonth.split("-");
        let response = await Axios.get(`/paybacks`);
        console.log(response);
        let monthFilter = response.data.filter(record => record.date.split("-")[0] === time[0] && record.date.split("-")[1] === time[1]);
        let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);

        let trueDebt = []
        
        for( let id of earnedWorkerId) {
          let [result] = dateFilter.filter(record => record.workerId === id);
          if(result) {
            trueDebt.push(result);
          }
        }
        
        this.setState({
          trueDebtList: trueDebt,
          debtList: dateFilter
        },
          myMethod
        );
      }
      catch (err) {
        console.log(err)
      }
    } else {
      console.log('data incompleted!')
    }
  }

  getDebtSummary = () => {
    let { debtList } = this.state;
    let totalDebt = 0;
    for (let record of debtList) {
      totalDebt += parseFloat(record['price']);
    }
    this.setState({
      totalDebt: totalDebt
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

    let displayMonth = this.state.monthList[parseInt(month[1]) - 1] + ' ' + month[0];

    await this.setState({
      selectMonth: dateString,
      displayMonth: displayMonth,
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
        title: 'ชื่อ-นามสกุล',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'ค่าแรง',
        dataIndex: 'wage_rate',
        key: 'wage_rate',
      },
      {
        title: 'บัญชีธนาคาร',
        dataIndex: 'bank_account_id',
        key: 'bank_account_id',
      },
      {
        title: 'รายได้รวม',
        dataIndex: 'workerExpense',
        key: 'workerExpense',
      },
      {
        title: 'ยอดรายการหัก',
        dataIndex: 'workerDebt',
        key: 'workerDebt',
      },
      {
        title: 'รายได้สุทธิ',
        dataIndex: 'workerNetExpense',
        key: 'workerNetExpense',
      }
    ];

    return (
      <Row style={{ margin: "0 5%" }}>
        <Col>
          <Row>
            <Col>
              <Row>
                <h1 className="page-header">Worker Accounting</h1>
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
                  {this.state.displayMonth ? <h2 className="accounting-date-display">{this.state.selectDateRange ? this.state.selectDateRange === 'firstHalf' ? '1-15' : `16-${30 + this.state.extraDate}` : null} {this.state.displayMonth}</h2> : null}
                </Col>
              </Row>
              <Row>
                <Col span={8} style={{ padding: "20px" }}>
                  <Row type="flex" justify="center">
                    <h2>รายจ่ายรวม <PoundOutlined style={{ marginLeft: "5px" }} /></h2>
                  </Row>
                  <Row type="flex" justify="center">
                    <p className="accounting-summary-result">{this.state.totalExpense ? this.state.totalExpense : 0} Baht</p>
                  </Row>
                </Col>
                <Col span={8} style={{ padding: "20px" }}>
                  <Row type="flex" justify="center">
                    <h2>รายการหักรวม <FileExcelOutlined style={{ marginLeft: "5px" }} /></h2>
                  </Row>
                  <Row type="flex" justify="center">
                    <p className="accounting-summary-result">{this.state.totalDebt ? this.state.totalDebt : 0} Baht</p>
                  </Row>
                </Col>
                <Col span={8} style={{ padding: "20px" }}>
                  <Row type="flex" justify="center">
                    <h2>รายจ่ายสุทธิ <UserOutlined style={{ marginLeft: "5px" }} /></h2>
                  </Row>
                  <Row type="flex" justify="center">
                    <p className="accounting-summary-result">{this.state.totalExpense - this.state.totalDebt}</p>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
            <Table dataSource={this.state.displayWorker} columns={columns} />
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

const WorkerAccounting = Form.create()(WorkerAccountingComp)

export default connect(mapStateToProps, null)(WorkerAccounting)
