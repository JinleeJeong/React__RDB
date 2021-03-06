import React, { Component, Fragment } from 'react';
import { Layout, Menu, Icon, Table, Button, Input, DatePicker, Popconfirm, message, Spin} from 'antd';
import {Link} from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

// -----------------------Layout
const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;
const {RangePicker} = DatePicker;
// -----------------------Layout

class student extends Component {
    constructor(props) {
      super(props);

      this.state = {
        users : [],
        searchText: '',
        loading : false,
      }
      
      this.onOk = this.onOk.bind(this);
      this.confirmLogout = this.confirmLogout.bind(this);
      this.cancelLogout = this.cancelLogout.bind(this);

      this.columns = [
          {
            title: '학생명',
            dataIndex: 'stName',
            key: 'stName',
            width: '18%',
            editable: true,
            ...this.getColumnSearchProps('stName'),
            sorter: (a,b) => this.compStringReverse(a.stName, b.stName),
            defaultSortOrder: 'descend',
          }, 
          {
            title: '담당 강사',
            dataIndex: 'tcName',
            key: 'tcName',
            width: '18%',
            editable: true,
            ...this.getColumnSearchProps('tcName'),
            sorter: (a,b) => this.compStringReverse(a.tcName, b.tcName),
          },
          {
            title: '앱 이름',
            dataIndex: 'appName',
            width: '18%',
            key: 'appName',
            ...this.getColumnSearchProps('appName'),
            sorter: (a, b) => this.compStringReverse(a.appName, b.appName),
          }, 
          {
              title: '앱 ID',
              dataIndex: 'appId',
              width: '18%',
              key: 'appId',
              ...this.getColumnSearchProps('appId'),
              sorter: (a, b) => this.compStringReverse(a.appId, b.appId),
          },   
          {
            title: '총사용량',
            dataIndex: 'usage',
            width: '36%',
            key: 'usage',
            ...this.getColumnSearchProps('usage'),
            sorter: (a, b) => this.compStringReverse(a.usage, b.usage),
            sortDirections: ['descend', 'ascend'],
        },   
      ];

      
    }
    cancel = () => {
      this.setState({ editingKey: '' });
    };
    componentDidMount(){
  }

// sorting 
    
    onOk = (value) => {
      this.setState({
        loading : true,
      })
      var startChoose = value[0];
      var endChoose = value[1];

      var requestTime = {
        startChoose : new Date(startChoose).toISOString().slice(0, 19),
        endChoose : new Date(endChoose).toISOString().slice(0, 19)
      }
    
      axios.post('http://localhost:8080/api/sp/stusg', requestTime)
      .then((res) => {
        console.log(res.data);

        this.setState({
          users : res.data.stUsages,
          loading : false,
        })
      })

      // var a = new Date(value[0]).getTime();
      // var b = new Date(value[1]).getTime();
      // // getTime Function : Date > milliseconds
      // if(a!== b){
      // const {users} = this.state
      
      // this.setState({
      //   startTime : value[0],
      //   endTime : value[1]
      // }, function() {
      //   var firstDate = moment(this.state.startTime._d, 'YYYY/M/D HH:mm')
      //   var finishDate = moment(this.state.endTime._d, 'YYYY/M/D HH:mm')
      //   firstDate = firstDate.format('YYYY/M/D HH:mm');
      //   finishDate = finishDate.format('YYYY/M/D HH:mm');
      //       // ------------------------------------------------startEndTime setState

      //   var userTimesSet = [];
      //   var sortingNumbers = [];
      //   var sortingNumbersNon = [];
          
      //     for(let i = 0; i < users.length ; i++){
      //       userTimesSet = (users.map(users => users.startTime));
      //     }
      //     this.setState({
      //       userTimes : userTimesSet,
      //     }, () => 
      //             {
      //               for( let i = 0 ;i < users.length ; i++){
                      
      //                 userTimesSet[i] = moment(userTimesSet[i]).format('YYYY/MM/DD HH:mm');
      //                 if(moment(userTimesSet[i]).isSameOrAfter(firstDate)){
      //                   if(moment(userTimesSet[i]).isSameOrBefore(finishDate)){
      //                     sortingNumbers.push(userTimesSet[i]);
      //                   } 
      //                   else{
      //                     sortingNumbersNon.push(userTimesSet[i]);
      //                     console.log('not Before')
      //                   }
      //                 }
      //                 else {
      //                   sortingNumbersNon.push(userTimesSet[i]);
      //                   console.log('not After')
      //                 }
      //               }

      //               this.setState({
      //                 sortingNumbers : sortingNumbers,
      //                 sortingNumbersNon : sortingNumbersNon
      //               }, () => { 
      //                 const { users, sortingNumbers, sortingNumbersNon } = this.state
      //                 console.log('SortingNumbers : ' + sortingNumbers );
      //                 console.log('SortingNumbersNon : ' + sortingNumbersNon );
      //                 function arrFilter(users) {
      //                   for(let i = 0; i < sortingNumbers.length; i++){
      //                     if(users.startTime === sortingNumbers[i]){
      //                       return true;
      //                     }
      //                   }
      //                   return false;
      //                 }

      //                 var sortingDates = users.filter(arrFilter);
      //                 for(let i = 0; i < sortingDates.length; i++) {
      //                   var startHours = moment(sortingDates[i]['startTime'], 'YYYY/M/D HH:mm');
      //                   startHours = startHours.format('YYYY/M/D HH:mm');
      //                   console.log('startHours : ', startHours);
      //                   console.log('Here : ',firstDate, finishDate);
                        
      //                   var diff = moment.duration(moment(startHours).diff(moment(firstDate)));
      //                   var days = parseInt(diff.asDays()); //84

      //                   var hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.

      //                   hours = hours - days*24;  // 23 hours

      //                   var minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.

      //                   minutes = minutes - (days*24*60 + hours*60); //20 minutes.
      //                   console.log(hours , minutes);
      //                 }
      //                 // startHours와 firstDate의 시간 차를 구하고, 그것의 day, hours, minutes를 구한다.


      //                 this.setState({
      //                   users : sortingDates
      //                 })
      //               }
      //             )
      //           })
      //         });
              
      //       }
      // else (
      //   alert('시간을 확인해주세요.')
      // )
}

    // -------------------table
      getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => { this.searchInput = node; }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),

        
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ),
      })
    
      
      // Search Fc
      handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
      }
    
      handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
      }
      // Search Fc

      // -------------------table

      logout = () => {
        console.log("logout");
      }

      confirmLogout = (e) =>{
        var userSession;
        userSession = {
          userName : sessionStorage.getItem('')
        }
          axios.post('http://localhost:8080/api/sp/logout', userSession)
            .then((res) => {
              console.log(res.data)
              message.success('로그아웃 성공했습니다.');
              sessionStorage.removeItem('')
              setTimeout(() => {
                return this.props.history.push('/')
              }, 1000)
          });
      };
      
      cancelLogout = (e) => {
        message.error('로그아웃 취소');
      }
      // ============================= 로그아웃

      onChangePicker = (pagination, filters, sorter) => {
        console.log('params', pagination, filters, sorter);
      }
      
      compStringReverse = (a,b) => {
        if(a > b) return -1;
        if(b > a) return 1;
        return 0;
      }

      render() {
        var content;

        const columns = this.columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
          };
        });

        if(this.state.loading) {

          content = 
          <Fragment>
          <Layout style={{ minHeight: '100vh' }}>
          <Sider>
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['7']} mode="inline" style={{height:"100%"}}>

              <Menu.Item key = "9" style= {{backgroundColor : "#28948D", margin : 0, height : "53px"}}>
              </Menu.Item>
                <Menu.Item key = "1" style= {{marginTop : 0, paddingTop : "12px", height : "57px"}}>
                    <Icon type="pie-chart" /><span style={{fontColor : "white"}}>대시보드</span>
                    <Link to = {`/main`}/>  
                </Menu.Item>  
                <SubMenu
                  key="sub2"
                  style={{marginTop : "13px"}}
                  title={<span><Icon type="setting" /><span style={{fontColor : "white"}}>설정</span></span>}
                >
                  <Menu.Item key="2"><Link to = {`/prohibition`}/>사용금지 목록</Menu.Item>
                  <Menu.Item key="3"><Link to = {`/settingIngang`}/>타 인강 목록</Menu.Item>
                  <Menu.Item key="4"><Link to = {`/update`}/>앱 업데이트</Menu.Item>
                </SubMenu>

                <SubMenu
                  
                  key="sub1"
                  title={<span><Icon type="file-search" /><span>조회</span></span>}
                  style={{marginTop : "13px"}}
                >
                  <Menu.Item key="5"><Link to = {`/app`}/>앱별 사용이력</Menu.Item>
                  <Menu.Item key="6"><Link to = {`/ingang`}/>인강별 사용이력</Menu.Item>
                  <Menu.Item key="7"><Link to = {`/student`}/>학생별 사용이력</Menu.Item>
                </SubMenu>

                <Menu.Item key = "8" onClick={this.logout} style={{position:"relative", top:"71.5%", marginBottom: 0}}>
                    <Icon type="logout"/>
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="확인" cancelText="취소">
                        <span>로그아웃</span> 
                        <Link to = {`/`}/>                  
                    </Popconfirm>

                  </Menu.Item>
              </Menu>
            </Sider>


            <Layout>
              <Header style={{ background: '#28948D', padding: 0, height : "52px" }} >
              </Header>


              <Content style={{  }}>
                <div style={{fontWeight : "600", fontSize : "2.5vh", height : 50, marginTop : 38, marginLeft : 38}}>
                  학생별 사용이력 조회
                </div>

                <div style={{marginTop: "25%", textAlign: "center"}}>
                  <Spin tip="Loading...">
                  </Spin>
                </div>
              </Content>
              
            </Layout>
          </Layout>
        </Fragment>


        }
        else {
          content = <Fragment>
          <Layout style={{ minHeight: '100vh' }}>
          <Sider>
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['7']} mode="inline" style={{height:"100%"}}>

              <Menu.Item key = "9" style= {{backgroundColor : "#28948D", margin : 0, height : "53px"}}>
              </Menu.Item>
                <Menu.Item key = "1" style= {{marginTop : 0, paddingTop : "12px", height : "57px"}}>
                    <Icon type="pie-chart" /><span style={{fontColor : "white"}}>대시보드</span>
                    <Link to = {`/main`}/>  
                </Menu.Item>  
                <SubMenu
                  key="sub2"
                  style={{marginTop : "13px"}}
                  title={<span><Icon type="setting" /><span style={{fontColor : "white"}}>설정</span></span>}
                >
                  <Menu.Item key="2"><Link to = {`/prohibition`}/>사용금지 목록</Menu.Item>
                  <Menu.Item key="3"><Link to = {`/settingIngang`}/>타 인강 목록</Menu.Item>
                  <Menu.Item key="4"><Link to = {`/update`}/>앱 업데이트</Menu.Item>
                </SubMenu>

                <SubMenu
                  
                  key="sub1"
                  title={<span><Icon type="file-search" /><span>조회</span></span>}
                  style={{marginTop : "13px"}}
                >
                  <Menu.Item key="5"><Link to = {`/app`}/>앱별 사용이력</Menu.Item>
                  <Menu.Item key="6"><Link to = {`/ingang`}/>인강별 사용이력</Menu.Item>
                  <Menu.Item key="7"><Link to = {`/student`}/>학생별 사용이력</Menu.Item>
                </SubMenu>

                <Menu.Item key = "8" onClick={this.logout} style={{position:"relative", top:"71.5%", marginBottom: 0}}>
                    <Icon type="logout"/>
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="확인" cancelText="취소">
                        <span>로그아웃</span> 
                        <Link to = {`/`}/>                  
                    </Popconfirm>

                  </Menu.Item>
              </Menu>
            </Sider>


            <Layout>
              <Header style={{ background: '#28948D', padding: 0, height : "52px" }} >
              </Header>


              <Content style={{  }}>
                <div style={{fontWeight : "600", fontSize : "2.5vh", height : 50, marginTop : 38, marginLeft : 38}}>
                  학생별 사용이력 조회
                </div>

                <div style={{margin: '0 38px 0 38px', padding: "35px 48px 48px 48px", background: '#fff', minHeight: 360, clear:'both', marginBottom: '1%'}}>
                
                <div>
                  
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['날짜 선택', '날짜 선택']}
                    onChange={this.onChangePicker}
                    onOk={this.onOk}
                    style={{margin : '0 0 1% 0'}}
                  />
                </div>

                <Table
                    bordered
                    dataSource={this.state.users}
                    columns={columns}
                    pagination={{
                      onChange: this.cancel,
                    }}
                    onChange = {this.onChange}
                     rowkey={record => record.uid}
                  />
                </div>
              </Content>
              
            </Layout>
          </Layout>
        </Fragment>
        }
        return (
          <div>
            {content}
          </div>
        );
      }
    }
    

export default student;
