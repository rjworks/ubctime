import React from 'react';
import 'antd/dist/antd.css';
import {Component} from "react/cjs/react.production.min"; // or 'antd/dist/antd.less'

export default class CalendarUpload extends Component {
    constructor(props) {
        super();
        this.state = {
            file: null
        }
    }

    render() {
        return (
            <div>
                <form action="/action_page.php">
                    <input type="file" name="upload" accept={"text/calendar"} max={1} multiple={false}
                           onChange={(e) => {
                               this.setState({file: e.target.files[0]})
                               this.setState({name: "nerd"})
                           }}/>
                    <input type="submit" disabled={this.state.file === null}/>
                </form>
            </div>
        );
    }
}
