import React from 'react';
import { Row, Col, Select, Table, Modal, Form, Input, DatePicker, Divider, Card } from 'antd';
import 'antd/dist/antd.css';
import Axios from '../config/api.service';
import { connect } from 'react-redux';
import { ExclamationCircleOutlined, UserOutlined, FilePptOutlined, PoundOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;
const { MonthPicker } = DatePicker;

var moment = require('moment');
moment().format();
let presentYear = moment().year();

class GeneralAccountingComp extends React.Component {
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
      totalExpense: '',
      totalProject: [],
      totalWorker: [],
      projectList: [],
      projectMonthly: [],
      monthList: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      displayMonth: '',
      displayYear: '',
      projectId: undefined,
    }
  }

  componentDidMount() {
    this.getProject();
    const myMethod = async () => {
      await this.leapYearCalculation();
      await this.genWorkByTime();
    }
    this.setState({
      selectYear: `${presentYear}`, displayYear: `${presentYear}`
    },
      myMethod
    );
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

  genWorkByTime = async () => {
    let { selectYear, selectMonth, selectDateRange } = this.state;
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
              () => this.getSummary()
            );
          } else {
            let dateFilter = monthFilter.filter(record => selectDateRange === 'firstHalf' ? record.date.split("-")[2] <= 15 : record.date.split("-")[2] > 15);
            this.setState({
              workList: dateFilter
            },
              () => this.getSummary()
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
            () => this.getSummary()
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

  handleDateRangeSelect = (value) => {
    const { selectMonth } = this.state;
    let extraD = 0;
    if (selectMonth === '01' || selectMonth === '03' || selectMonth === '05' || selectMonth === '07' || selectMonth === '08' || selectMonth === '10' || selectMonth === '12') {
      extraD = 1;
    } else if (selectMonth === '02') {
      if (this.state.isLeapYear) {
        extraD = -1;
      } else {
        extraD = -2;
      }
    } else {
      extraD = 0;
    }

    this.setState({
      selectDateRange: value,
      extraDate: extraD
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
        extraDate: extraD
      },
        () => this.genWorkByTime()
      );
    } else {
      await this.setState({
        selectMonth: undefined,
        displayMonth: '',
        selectDateRange: 'fullMonth',
        extraDate: 0
      },
        () => this.genWorkByTime()
      );
    }
  }

  // handleMonthPick = async (date, dateString) => {
  //   let extraD = 0;
  //   let month;

  //   if (dateString) {
  //     month = dateString.split("-");
  //     if (this.state.selectDateRange === 'secondHalf' || this.state.selectDateRange === 'fullMonth') {
  //       if (month[1] === '01' || month[1] === '03' || month[1] === '05' || month[1] === '07' || month[1] === '08' || month[1] === '10' || month[1] === '12') {
  //         extraD = 1;
  //       } else if (month[1] === '02') {
  //         extraD = -1;
  //       } else {
  //         extraD = 0;
  //       }
  //     } else {
  //       extraD = 0;
  //     }

  //     let displayMonth = this.state.monthList[parseInt(month[1]) - 1] + ' ' + month[0];

  //     await this.setState({
  //       selectMonth: dateString,
  //       displayMonth: displayMonth,
  //       extraDate: extraD,
  //     },
  //       () => this.genWorkByTime()
  //     );
  //   } else {
  //     await this.setState({
  //       selectMonth: undefined,
  //       displayMonth: '',
  //       extraDate: 0,
  //     },
  //       () => this.genWorkByTime()
  //     );
  //   }
  // }

  handleYearSelect = (value) => {
    const myMethod = async () => {
      await this.leapYearCalculation();
      await this.genWorkByTime();
    }
    const { selectMonth, isLeapYear } = this.state;
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
        extraDate: 0,
        isLeapYear: false
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
        title: 'Expense',
        dataIndex: 'projectExpense',
        key: 'projectExpense',
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
                <h1 className="page-header">General Accounting</h1>
              </Row>
              <Row type="flex" align-items="left" align="middle" >
                <Select
                  style={{ width: 200, marginRight: '10px' }}
                  placeholder={"Select date range"}
                  optionFilterProp="children"
                  onChange={this.handleDateRangeSelect}
                  disabled={this.state.selectMonth ? false : true}
                  value={this.state.selectDateRange}
                >
                  <Option value={'firstHalf'}>1st - 15th</Option>
                  <Option value={'secondHalf'}>16th - {30 + extraDate}{extraDate === 1 ? 'st' : 'th'}</Option>
                  <Option value={'fullMonth'}>Full Month</Option>
                </Select>
                {/* <MonthPicker placeholder="Select month" onChange={this.handleMonthPick} style={{ marginRight: '10px' }} /> */}
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
