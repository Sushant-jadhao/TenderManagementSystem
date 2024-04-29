import React, { useState } from "react";
import SubmitBidForm from "../components/ContractInteraction/SubmitBidForm";
// import GiveFeedbackForm from "../components/ContractInteraction/GiveFeedbackForm";
// import Feedback from "../components/TenderDetails/TenderFeedback";
import UpdateWorkProgress from "../components/ContractInteraction/UpdateWorkProgress";
import CheckBlacklistStatus from "../components/ContractInteraction/CheckBlackListStatus";
import ContractorWorkProgress from "../components/ContractInteraction/ConstructorWorkProgress";
import GetFeedback from "../components/ContractInteraction/GetFeedback";
import Feedback from "../components/ContractInteraction/TendersComponent";
// import AssignContractForm from "../components/ContractInteraction/AssignContractForm";
import GiveFeedbackForm from "../components/ContractInteraction/FeedBackComponent";
import AssignedContractDetails from "../components/ContractInteraction/AssignedContractDetails";
import "./contractor-profile.css";

const ContractorProfile = () => {
  const [selectedSection, setSelectedSection] = useState("submitBid");

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const renderSelectedSection = () => {
    switch (selectedSection) {
      case "submitBid":
        return <SubmitBidForm />;
      case "giveFeedback":
        return <GiveFeedbackForm />;
      case "feedback":
        return <Feedback />;
      case "checkBlacklistStatus":
        return <CheckBlacklistStatus />;
      case "updateWorkProgress":
        return <UpdateWorkProgress />;
      case "getFeedback":
        return <GetFeedback />;
      case "workProgress":
        return <ContractorWorkProgress />;
      case "AssignedContractDetail":
        return <AssignedContractDetails />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="row">
        <nav className="col-md-12 d-md-block bg-light navbar navbar-expand-lg">
          <div className="container-fluid">
            <ul className="navbar-nav mr-auto d-flex flex-row">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedSection === "feedback" && "active"
                  }`}
                  onClick={() => handleSectionChange("feedback")}
                >
                  Show Tenders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedSection === "submitBid" && "active"
                  }`}
                  onClick={() => handleSectionChange("submitBid")}
                >
                  Submit Bid
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedSection === "AssignedContractDetail" && "active"
                  }`}
                  onClick={() => handleSectionChange("AssignedContractDetail")}
                >
                  Show Assigned Contractor
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedSection === "updateWorkProgress" && "active"
                  }`}
                  onClick={() => handleSectionChange("updateWorkProgress")}
                >
                  Update Work Progress
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedSection === "checkBlacklistStatus" && "active"
                  }`}
                  onClick={() => handleSectionChange("checkBlacklistStatus")}
                >
                  Check Blacklist Status
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    selectedSection === "giveFeedback" && "active"
                  }`}
                  onClick={() => handleSectionChange("giveFeedback")}
                >
                  Show Feedback
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main role="main" className="col-md-12 ml-sm-auto col-lg-10 px-md-4">
          <h1 className="text-center mb-4">Contractor Profile</h1>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-body">{renderSelectedSection()}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContractorProfile;
