import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import "./Event.css";
export const Event = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data based on the backend structure
  const events = [
    {
      created: '2024-05-01T15:30:00Z',
      event_level: 'Server',
      name: 'nginx',
      status: 'disconnected',
      message: 'pod "nginx" was disconnected at xx:xx : some reason',
      type: 'Error'
    },
    {
      created: '2024-05-01T16:00:00Z',
      event_level: 'Server',
      name: 'kube-system',
      status: 'memory low',
      message: 'pod "kube-system" is running low on memory',
      type: 'Error'
    },
    {
      created: '2024-05-01T17:00:00Z',
      event_level: 'Warning',
      name: 'Nginx-pod',
      status: 'restarted',
      message: 'Pod "Nginx-pod" restarted at xx:xx : Out of Memory',
      type: 'Warning'
    }
  ];

  const filteredEvents = events.filter(alert => alert.message.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="d-flex E">
      <div><Sidebar/></div>
      <div style={{flex:"1 1 auto", display:"flex", flexFlow:"column", height:"100vh", overflowY:"hidden"}}>
        <Navbar/>
      <div className="event-content">
            <div className="event-header">
              <div>
                <h2>Events</h2>
                <p>Kubernetes Cluster Events</p>
              </div>
            <input
              className="event-search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="event-events-container">
            {filteredEvents.map((alert, index) => (
              <div key={index} className="event-alert">
                <FontAwesomeIcon icon={alert.type === 'Error' ? faTimesCircle : faExclamationTriangle} className="event-alert-icon" style={{ color: alert.type === 'Error' ? 'red' : 'goldenrod' }} />
                <span>[{alert.event_level}] {alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
