import React, { useState } from "react";
import AddContractorForm from "../components/ContractInteraction/AddContractorForm";
import CreateTenderForm from "../components/ContractInteraction/CreateTenderForm";
// import TenderBids from "../components/TenderDetails/TenderBids";
// import TenderFeedback from "../components/TenderDetails/TenderFeedback";
import TenderDetails from "../components/TenderDetails/TenderDetails";
import GovernmentOfficials from "../components/ContractInteraction/AddGovernmentOfficialsForm";
import ContractorDetails from "../components/ContractInteraction/ContractorDetails";
import CloseTender from "../components/ContractInteraction/CloseTender";
import CheckBlacklistStatus from "../components/ContractInteraction/CheckBlackListStatus";
import BlacklistContractor from "../components/ContractInteraction/BlackListContractor";
import ContractorWorkProgress from "../components/ContractInteraction/ConstructorWorkProgress";
import AwardTender from "../components/ContractInteraction/AwardTender";
// import FeedbackComponent from "../components/ContractInteraction/FeedBackComponent";
import GiveFeedbackForm from "../components/ContractInteraction/GiveFeedbackForm";
import BidsComponent from "../components/ContractInteraction/BidsComponents";
import AssignContractor from "../components/ContractInteraction/AssignContractForm";
import "./tender-list.css";

const sections = [
  {
    id: "governmentOfficials",
    label: "Add Organization",
    component: <GovernmentOfficials />,
  },
  {
    id: "addContractor",
    label: "Add Contractor",
    component: <AddContractorForm />,
  },
  {
    id: "contractorDetails",
    label: "Contractor Details",
    component: <ContractorDetails />,
  },
  {
    id: "createTender",
    label: "Create Tender",
    component: <CreateTenderForm />,
  },

  // { id: "tenderBids", label: "Tender Bids", component: <TenderBids /> },
  // {
  //   id: "tenderFeedback",
  //   label: "Tender Feedback",
  //   component: <TenderFeedback />,
  // },
  {
    id: "tenderDetails",
    label: "Tender Details",
    component: <TenderDetails />,
  },
  {
    id: "bidsComponent",
    label: "Bids Component",
    component: <BidsComponent />,
  },
  {
    id: "assigncontract",
    label: "Assign Contract",
    component: <AssignContractor />,
  },
  {
    id: "contractorWorkProgress",
    label: "Contractor Work Progress",
    component: <ContractorWorkProgress />,
  },

  { id: "closeTender", label: "Close Tender", component: <CloseTender /> },
  {
    id: "blacklistContractor",
    label: "Blacklist Contractor",
    component: <BlacklistContractor />,
  },
  {
    id: "checkBlacklistStatus",
    label: "Check Blacklist Status",
    component: <CheckBlacklistStatus />,
  },

  { id: "awardTender", label: "Pay Tender", component: <AwardTender /> },

  {
    id: "feedback",
    label: "Give Feedback",
    component: <GiveFeedbackForm />,
  },
];

const TenderList = () => {
  const [selectedSection, setSelectedSection] = useState(sections[0].id);

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
              {sections.map((section) => (
                <li className="nav-item" key={section.id}>
                  <button
                    className={`nav-link ${
                      selectedSection === section.id && "active"
                    }`}
                    onClick={() => handleSectionChange(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <h1 className="text-center mb-4">Organization Profile</h1>
          <div className="card mb-4">
            <div className="card-body">
              {
                sections.find((section) => section.id === selectedSection)
                  ?.component
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderList;
