


import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


class PomClock extends React.Component {

    render(){

        return(
            <div className="main text-center">

                <h1>POMIDORO CLOCK</h1>

                <Timer/>

            </div>
        );
    }

}



class TimeInput extends React.Component{
    constructor(props){
        super(props);
        this.onChangeHandlerTime = this.onChangeHandlerTime.bind(this);
        this.onChangeHandlerBreak = this.onChangeHandlerBreak.bind(this);

    }

    onChangeHandlerTime(e){
        this.props.onTimeLengthChange(e.target.value * 60);
    }
    onChangeHandlerBreak(e){
        this.props.onBreakLengthChange(e.target.value * 60);
    }

    deIncrementHandler(sName, e){

        this.props.onDeIncrement(e.target.value, sName);
    }



    render(){

        let timeValue = this.props.time/60;
        let breakValue = this.props.break/60;
        return(

            <form className="form-inline form-container">

                  <div className="inputs">
                        <label id="session-label" htmlFor="session-length">TIME</label>

                        <input id="session-length" type="number" min="1" max="60" onChange={this.onChangeHandlerTime} value={timeValue} className="form-control time-input" ref="time"/>
                       <br/>

                      <input type="button" id="session-increment" className = "form-control" onClick ={this.deIncrementHandler.bind(this, 'timeLength')} value = "+"/>
                <input type="button" id="session-decrement" className = "form-control" onClick ={this.deIncrementHandler.bind(this, 'timeLength')} value = "-"/>




                    </div>

                    <div className="inputs">
                        <label id="break-label" htmlFor="break-length">BREAK</label>

                        <input id="break-length" type="number" min="1" max="60" onChange = {this.onChangeHandlerBreak} value = {breakValue} className="form-control time-input" />

                        <br/>

                        <input type="button" id="break-increment" className="form-control" onClick ={this.deIncrementHandler.bind(this, 'breakLength')} value = "+"/>
                <input type="button" id="break-decrement" className="form-control" onClick={this.deIncrementHandler.bind(this, 'breakLength')} value="-"/>


                      </div>


                </form>
        );
    }
}

class Timer extends React.Component {
    constructor(props){
        super(props);

        this.state = {timeLength: 1500, name: "timer", breakLength: 300, timer: 1500, switch: false, firstStart: true};

        this.onChangeHandlerTime = this.onChangeHandlerTime.bind(this);
        this.onChangeHandlerBreak = this.onChangeHandlerBreak.bind(this);
        this.startPauseTimer = this.startPauseTimer.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
       this.deIncrementHandler = this.deIncrementHandler.bind(this);
        this.firstStartHandler = this.firstStartHandler.bind(this);


    }


     onChangeHandlerTime(timeInput){
        this.setState({timeLength: timeInput});
    }
    onChangeHandlerBreak(breakInput){
        this.setState({breakLength: breakInput});
    }


    deIncrementHandler(operator, sessionName){


        if(operator === "-" && this.state[sessionName] > 60){
            this.setState((prevState) => ({[sessionName]: prevState[sessionName] - 60}));
        }else if(operator === "+" && this.state[sessionName] < 3600){
                this.setState((prevState) => ({[sessionName]: prevState[sessionName] + 60}));
            }

    }


//    componentDidMount(){
//
//        this.timerID = setInterval(
//            () => this.tick(), 1000
//        );
//    }
    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    firstStartHandler(){
        if(this.state.firstStart){
            this.setState({timer: this.state.timeLength, firstStart:false});
        }
    }

    startPauseTimer(){

        this.firstStartHandler();

        if(this.state.switch){
            clearInterval(this.timerID);
            if(this.alarm){
            this.alarm.pause();
            this.alarm.currentTime = 0;
            };
            this.setState({switch: !this.state.switch});

        }else{
           this.timerID = setInterval(
            () => this.tick(), 1000
        );
           this.setState({switch: true});

        }
    }

    resetHandler(){

        clearInterval(this.timerID);
        this.setState({timeLength:1500, breakLength:300, timer: 1500, name: "timer", switch: false, firstStart: true});

        if(this.alarm){
            this.alarm.pause();
            this.alarm.currentTime = 0;
        }


    }



    tick(){

        this.alarm = document.querySelector('audio');
        let name = this.state.name;
        var test = this;
        if (this.state.timer === 0){
            console.log(test);
            if (name === "timer"){
              this.setState({timer: this.state.breakLength, name: "break"});
                if(this.alarm.paused) {this.alarm.play();}
            }else{
               this.setState({timer: this.state.timeLength, name: "timer"});
            }

        }else{
            this.setState((prevState) => ({timer: prevState.timer - 1}));
        }

    }

    render(){
        let timerTime = this.state.timer;

        let s = timerTime % 60;
        let m = Math.floor(timerTime / 60);

        function nullPlus(numb){
             return numb < 10 ? "0" + numb : numb;
         }
        s = nullPlus(s);
        m = nullPlus (m);



        return(
            <div className = "container-fluid">


                <TimeInput
                    time = {this.state.timeLength}
                    break = {this.state.breakLength}
                    onTimeLengthChange = {this.onChangeHandlerTime}
                    onBreakLengthChange = {this.onChangeHandlerBreak}
                    onDeIncrement = {this.deIncrementHandler}
                    />

                <audio id ="beep" loop = "true">
                    <source src = "http://www.orangefreesounds.com/wp-content/uploads/2017/10/Twin-bell-alarm-clock-ringing-short.mp3?_=1"/>

                </audio>


                <div id="start_stop" className = {"timerClass container-fluid " + (this.state.switch ? "red" : "green")}  onClick = {this.startPauseTimer}>
                    <div id="timer-label" className = "timerName">{this.state.name.toUpperCase()}</div>
                <p id="time-left" className = "clock">{m  + ":" + s }</p>
                </div>


                <button type = "button" id="reset" className = "btn btn-danger reset-button" onClick = {this.resetHandler}>Reset</button>






            </div>

        );
    }
}


ReactDOM.render(<PomClock />, document.getElementById('root'));



