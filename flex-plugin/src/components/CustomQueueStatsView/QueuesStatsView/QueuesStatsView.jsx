import React from 'react';

import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead
} from '@material-ui/core';

import { QueueTableRow } from './QueuesStatsView.Styles';

import { get } from 'lodash';
import { QueueAgents } from './QueuesStatsView.Components';
import { numbersPerChannel, showNumbersPerChannel, channels, getBPO } from '../../../helpers';
import { supervisors } from "../../../config/supervisors.json";


class QueueStatsView extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      queuesList: [],
      workersByQueue: [],
      fullAccess: false
    };

  }

  componentDidMount(){
    
    const { email } = this.props.manager.workerClient.attributes;

    const supervisor = supervisors.find(
      supervisor => supervisor.email === email
    ) || {};

    this.setState({ queuesList : supervisor.queues || [], fullAccess: supervisor.full_access || false });

  }

  render() {

    console.log(this.state.stats);

    if (this.state.queuesList.length === 0) {
      return <div/>
    }

    const bpo = getBPO(this.props.manager);

    return (
      <Table style={{ tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ maxWidth: '200px', marginLeft: 18 }}>
              Queue
            </TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Waiting</TableCell>
            <TableCell style={{ maxWidth: '20px', paddingRight: '5px' }}>
              Agents
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.queuesList.map(queue => {

            const queueStats = this.props.stats[queue];

            let active = {};
            let waiting = {};

            const isSyncLoaded = Object.keys(this.props.stats).length > 0;

            numbersPerChannel(bpo, active, waiting, queueStats, isSyncLoaded);

            return (
              <QueueTableRow key={queue}>
                <TableCell
                  className='queue-table-cell'
                  style={{ maxWidth: '200px', paddingLeft: 18 }}
                >
                  {queue}
                </TableCell>
                <TableCell className='queue-table-cell'>
                  {showNumbersPerChannel(active, true, false)}
                </TableCell>
                <TableCell className='queue-table-cell'>
                  {showNumbersPerChannel(waiting, false, false)}
                </TableCell>
                <TableCell className='queue-table-cell agents-stats'>
                  {channels.map(channel => 
                    <div style={{ margin: '2px 0 2px 0' }}>
                        <QueueAgents
                        availableAgents={
                          get(queueStats, `${bpo}.workers.available.${channel}`, 0) 
                        }
                        unavailableAgents={
                          get(queueStats, `${bpo}.workers.unavailable.${channel}`, 0) 
                        }
                        offlineAgents={
                          get(queueStats, `${bpo}.workers.offline.${channel}`, 0) 
                        }
                      />
                    </div>
                  )}
                  
                </TableCell>
              </QueueTableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

}

export default QueueStatsView;
