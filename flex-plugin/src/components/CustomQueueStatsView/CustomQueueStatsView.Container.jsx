import React from 'react';
import QueueStatsView from './QueuesStatsView/QueuesStatsView';
import SyncClient from "twilio-sync";
import WorkspaceStatsView from './WorkspaceStatsView/WorkspaceStatsView';
import { getBPO } from '../../helpers';

class CustomQueueStatsViewContainer extends React.Component {

  _document = null;

  constructor(props) {

    super(props);

    this.state = {
      statsTasks: {},
      statsWorkers: {}
    };

  }

  componentDidMount(){
    
    var syncClient = new SyncClient(this.props.manager.user.token);

    syncClient.document("realtime-stats-bpo").then(function(doc) {

      doc.on("updated",function(data) {

        this.setState({ statsTasks: data.value });

      }.bind(this));

    }.bind(this));

    syncClient.document("realtime-stats-bpo-workers").then(function(doc) {

      doc.on("updated",function(data) {

        this.setState({ statsWorkers: data.value });

      }.bind(this));

    }.bind(this));

  }

  render() {

    const { REACT_APP_COMPANY_NAME } = process.env;

    const bpo = getBPO(this.props.manager);

    const names = {
      rest: `${REACT_APP_COMPANY_NAME} (viewing company agents)`,
      all: `${REACT_APP_COMPANY_NAME} (viewing all data)`,
    }

    return (
      <>
        <div style={{ margin: "0 0 10px 16px" }}>
          Company: <span style={{ fontWeight: "bold" }}>{names[bpo] || bpo}</span>
        </div>
        <div>
          <WorkspaceStatsView {...this.props} statsTasks={this.state.statsTasks} statsWorkers={this.state.statsWorkers}/>
        </div>
        <div style={{ marginTop: 48 }}>
          <QueueStatsView {...this.props} statsTasks={this.state.statsTasks} statsWorkers={this.state.statsWorkers}/>
        </div>
      </>
    );
  }
}

export default CustomQueueStatsViewContainer;
