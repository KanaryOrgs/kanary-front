import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Overview } from "./pages/Overview/Overview";
import { Topology } from "./pages/Topology/Topology";
import { Node } from "./pages/Node/Node";
import { Resources } from "./pages/Resources/Resources";
import { Volume } from "./pages/Resources/Volume";
import { Service } from "./pages/Resources/Service";
import { Daemonset } from "./pages/Resources/Daemonset";
import { Event } from "./pages/Event";

const Kanary = () => {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Overview />} />
          <Route path="/topology" element={<Topology />} />
          <Route path="/node" element={<Node />} />
          <Route path="/resources/pods" element={<Resources />} />
          <Route path="/resources/volume" element={<Volume />} />
          <Route path="/resources/service" element={<Service />} />
          <Route path="/resources/daemonset" element={<Daemonset />} />
          <Route path="/event" element={<Event />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default Kanary;
