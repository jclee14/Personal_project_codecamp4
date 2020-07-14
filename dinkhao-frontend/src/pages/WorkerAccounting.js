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
let presentYear = moment().year();

class WorkerAccountingComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      selectDateRange: 'fullMonth',
      selectMonth: undefined,
      selectYear: undefined,
      isLeapYear: false,
      extraDate: 0,
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
      displayYear: '',
      displayWorker: []
    }
  }

  componentDidMount() {
    this.getProject();
    this.getWorker();

    this.setState({
      selectYear: `${presentYear}`, displayYear: `${presentYear}`
    },
      () => this.leapYearCalculation(),
      () => this.genWorkByTime()
    );
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

  genWorkByTime = async () => {
    let { selectYear, selectMonth, selectDateRange } = this.state;
    const myMethod = () => {
      this.getExpenseSummary();
      this.getWorkerId();
    }

    if (selectYear) {
      if (selectMonth && selectDateRange) {
        try {
          //let time = selectMonth.split("-");
          let response = await Axios.get(`/works`);
          let monthFilter = response.data.filter(record => record.date.split("-")[0] === selectYear && record.date.split("-")[1] === selectMonth);
          if (selectDateRange === 'fullMonth') {
            this.setState({
              workList: monthFilter
            },
              myMethod
            );
          } else {
            let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);
            this.setState({
              workList: dateFilter
            },
              myMethod
            );
          }
        }
        catch (err) {
          console.log(err)
        }
      } else {
        try {
          let response = await Axios.get(`/works`);
          let yearFilter = response.data.filter(record => record.date.split("-")[0] === selectYear);
          this.setState({
            workList: yearFilter
          },
            myMethod
          );
        }
        catch (err) {
          console.log(err);
        }
      }
    } else {
      console.log('data incompleted!');
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
    let { selectYear, selectMonth, selectDateRange, earnedWorkerId } = this.state;
    if (selectYear) {
      if (selectMonth && selectDateRange) {
        try {
          //let time = selectMonth.split("-");
          let response = await Axios.get(`/paybacks`);
          let monthFilter = response.data.filter(record => record.date.split("-")[0] === selectYear && record.date.split("-")[1] === selectMonth);
          if (selectDateRange === 'fullMonth') {
            let trueDebt = []
            for (let id of earnedWorkerId) {
              let [result] = monthFilter.filter(record => record.workerId === id);
              if (result) {
                trueDebt.push(result);
              }
            }
            this.setState({
              trueDebtList: trueDebt,
              debtList: monthFilter
            },
              myMethod
            );
          } else {
            let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);
            let trueDebt = []
            for (let id of earnedWorkerId) {
              let [result] = dateFilter.filter(record => record.workerId === id);
              if (result) {
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
        }
        catch (err) {
          console.log(err)
        }
      } else {
        try {
          //let time = selectMonth.split("-");
          let response = await Axios.get(`/paybacks`);
          let yearFilter = response.data.filter(record => record.date.split("-")[0] === selectYear);
          //let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);

          let trueDebt = []

          for (let id of earnedWorkerId) {
            let [result] = yearFilter.filter(record => record.workerId === id);
            if (result) {
              trueDebt.push(result);
            }
          }

          this.setState({
            trueDebtList: trueDebt,
            debtList: yearFilter
          },
            myMethod
          );
        }
        catch (err) {
          console.log(err)
        }
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
    //let month = this.state.selectMonth.split("-");
    const { selectMonth } = this.state;
    let extraD = 0;
    if (selectMonth === '01' || selectMonth === '03' || selectMonth === '05' || selectMonth === '07' || selectMonth === '08' || selectMonth === '10' || selectMonth === '12') {
      extraD = 1;
    } else if (selectMonth === '02') {
      extraD = -2;
    } else {
      extraD = 0;
    }

    this.setState({
      selectDateRange: value,
      extraDate: extraD,
    },
      () => this.genWorkByTime()
    );
  }

  handleMonthPick = async (month) => {
    let extraD = 0;

    if (month) {
      if (month === '01' || month === '03' || month === '05' || month === '07' || month === '08' || month === '10' || month === '12') {
        extraD = 1;
      } else if (month === '02') {
        if (this.state.isLeapYear) {
          extraD = -1;
        } else {
          extraD = -2;
        }
      } else {
        extraD = 0;
      }

      let displayMonth = this.state.monthList[parseInt(month) - 1];
      await this.setState({
        selectMonth: month,
        displayMonth: displayMonth,
        extraDate: extraD,
      },
        () => this.genWorkByTime()
      );
    } else {
      await this.setState({
        selectMonth: undefined,
        displayMonth: '',
        selectDateRange: 'fullMonth',
        displayWorker: [],
        totalExpense: 0,
        totalDebt: 0,
        projectList: [],
        extraDate: 0,
      },
        () => this.genWorkByTime()
      );
    }
  }

  handleYearSelect = (value) => {
    const myMethod = async () => {
      await this.leapYearCalculation();
      await this.genWorkByTime();
    }
    if (value) {
      this.setState({
        selectYear: value,
        displayYear: value
      },
        myMethod
      );
    } else {
      this.setState({
        selectYear: undefined,
        displayYear: '',
        extraDate: 0
      },
        () => this.genWorkByTime()
      );
    }
  }

  leapYearCalculation = () => {
    const { selectYear, selectMonth } = this.state;
    const myMethod = () => {
      if (selectMonth === '02') {
        this.setState({ extraDate: this.state.isLeapYear ? -1 : -2 });
      }
    }
    if (parseInt(selectYear) % 4 === 0) {
      if (parseInt(selectYear) % 100 === 0) {
        if (parseInt(selectYear) % 400 === 0) {
          this.setState({ isLeapYear: true }, myMethod);
        } else {
          this.setState({ isLeapYear: false }, myMethod);
        }
      } else {
        this.setState({ isLeapYear: true }, myMethod);
      }
    } else {
      this.setState({ isLeapYear: false }, myMethod);
    }
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

    let { selectDateRange, displayMonth, displayYear, extraDate, monthList } = this.state;

    let monthRangeSelect = (
      <Select
        style={{ width: 150, marginRight: '10px' }}
        placeholder={"Select month"}
        onChange={this.handleMonthPick}
        allowClear
      >
        {getMonthRange(monthList)}
      </Select>
    );

    function getMonthRange(monthList) {
      let monthJSX = [];
      monthList.forEach((month, index) => {
        let monthSeq = '';
        if (index < 10) {
          monthSeq += '0' + (index + 1);
        } else {
          monthSeq += (index + 1);
        }

        monthJSX.push(<Option value={monthSeq}>{month}</Option>)
      });
      return monthJSX;
    }

    let yearRangeSelect = (
      <Select
        style={{ width: 150 }}
        placeholder={"Select year first"}
        onChange={this.handleYearSelect}
        defaultValue={presentYear}
      >
        {getYearRange(presentYear)}
      </Select>
    );

    function getYearRange(presentYear) {
      //let presentYear = moment().year();
      let yearJSX = [];
      for (let y = 2015; y <= presentYear + 5; y++) {
        yearJSX.push(<Option value={y.toString()}>{y}</Option>);
      }
      return yearJSX;
    }

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
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder={"Select date range"}
                  optionFilterProp="children"
                  onChange={this.handleDateRangeSelect}
                  disabled={this.state.selectMonth ? false : true}
                  value={selectDateRange}
                >
                  <Option value={'firstHalf'}>1st - 15th</Option>
                  <Option value={'secondHalf'}>16th - {30 + extraDate}{extraDate === 1 ? 'st' : 'th'}</Option>
                  <Option value={'fullMonth'}>Full Month</Option>
                </Select>
                {/* <MonthPicker placeholder="Select month first" onChange={this.handleMonthPick} /> */}
                {monthRangeSelect}
                {yearRangeSelect}
              </Row>
              <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }} />
            </Col>
          </Row>
          <Row style={{ backgroundColor: "white", paddingTop: '15px' }}>
            <Col>
              <Row type="flex" justify="center">
                <Col>
                  <h2 className="accounting-date-display">{displayMonth ? selectDateRange ? selectDateRange === "firstHalf" ? "1st - 15th" : selectDateRange === "secondHalf" ? `16th - ${30 + extraDate}${extraDate === 1 ? 'st' : 'th'}` : `1st - ${30 + extraDate}${extraDate === 1 ? 'st' : 'th'}` : null : null} {displayMonth ? displayMonth : null} {displayYear ? displayYear : null}</h2>
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
