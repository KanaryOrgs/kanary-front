import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

export const Topology = () => {

	return (
		<div className="d-flex E">
			<div>
      	<Sidebar/>
			</div>
      <div style={{flex:"1 1 auto", display:"flex", flexFlow:"column", height:"100vh", overflowY:"hidden"}}>
      	<Navbar/>
      	<div style={{height:"100%"}}>
					Topology
				</div>
			</div>
		</div>

	);
}