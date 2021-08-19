import React from "react";
import "./style.css";
import { IoIosPeople } from "react-icons/io";
import { MdNaturePeople, MdRecentActors } from "react-icons/md";

const LandingPageContent = () => {
  const buttonText = [
    "Built-in notification when resource contract is about to expire",
    "Built-in indication when skills of team members do not match your applications",
    "Built-in indication when resources are insufficient",
    "Built in indication when resources are assigned to multiple initiatives",
  ];

  return (
    <div className="landing-background">
      <div className="lp-big-title">
        A simple and accessible work management tool designed for
      </div>

      <div class="main-timeline">
        <div class="timeline">
          <div class="date-content">
            <div class="date-outer">
              <IoIosPeople className="date" />
            </div>
          </div>
          <div class="timeline-content">
            <div class="lp-small-title">Application Development Teams</div>
            <div class="lp-description">
              Design in order to help application development teams to planning,
              testing, analysis, programming, keep track on the project status,
              and deadline.
            </div>
          </div>
        </div>

        <div class="timeline">
          <div class="date-content">
            <div class="date-outer">
              <MdRecentActors className="date" />
            </div>
          </div>
          <div class="timeline-content">
            <div class="lp-small-title">Portfolio Managers</div>
            <div class="lp-description">
              A system helps them to plan, track, direct and manage better
              financial of the applications, development teams and their
              members.
            </div>
          </div>
        </div>

        <div class="timeline">
          <div class="date-content">
            <div class="date-outer">
              <MdNaturePeople className="date" />
            </div>
          </div>
          <div class="timeline-content">
            <div class="lp-small-title">Product Managers & Product Owner</div>
            <div class="lp-description">
              A better view for product manager and product owner as it show
              details of every application user engagement
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="lp-big-title">
          System also includes administration module to easily manage usage of
          the solution and its configuration.
        </div>

        <div className="lp-button-group d-flex flex-column flex-sm-row flex-md-row flex-lg-row">
          {buttonText.map((text) => (
            <div className="button-text">{text}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPageContent;
