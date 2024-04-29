import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Overview } from "./pages/Overview";
import { Topology } from "./pages/Topology";
import { Node } from "./pages/Node";
import { Resources } from "./pages/Resources";
import { Event } from "./pages/Event"
const Kanary = () => {

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Overview />} />
          <Route path="/topology" element={<Topology />} />
          <Route path="/node" element={<Node />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/event" element={<Event />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default Kanary;
