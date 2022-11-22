import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useConnection } from './connection/connection_provider';

import Navbar from "./components/navbar/NavigationBar";
import GovernancePage from "./components/pages/proposal_page/ProposalPage";
import CreateProposal from "./components/pages/create_proposal_page/CreateProposal";
import ProposalPage from "./components/pages/voting_page/VotingPage";

function App() {

  const { connectionState } = useConnection();

  const { error } = connectionState;

  if (error) {
    return <div className="backdrop"><p>{error}</p></div>
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/proposal/create_proposal" element={<CreateProposal />} />
          <Route path="/proposal/proposal/:index" element={<ProposalPage />} />
          <Route path="/proposal" element={<GovernancePage />} />
          <Route path="/" element={<GovernancePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
