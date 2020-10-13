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
      stats: {}
    };

  }

  componentDidMount(){
    
    var syncClient = new SyncClient(this.props.manager.user.token);

    this._document = syncClient.document("realtime-stats-bpo");

    this._document.then(function(doc) {

      doc.on("updated",function(data) {

        this.setState({ stats: data.value });

      }.bind(this));

    }.bind(this));

  }

  componentWillUnmount() {
    this._document.close();
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
          <WorkspaceStatsView {...this.props} stats={this.state.stats}/>
        </div>
        <div style={{ marginTop: 48 }}>
          <QueueStatsView {...this.props} stats={this.state.stats} />
        </div>
      </>
    );
  }
}

export default CustomQueueStatsViewContainer;
