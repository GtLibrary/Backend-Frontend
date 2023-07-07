import React, { useState } from "react";
import "./accordion.scss";

const Accordion = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { title, content, preIcon } = props;

  return (
    <div className="accordion">
      <div
        className={`accordion-title ${isOpen ? "content-open" : ""}`}
        onClick={() => setIsOpen((state) => !state)}
      >
        <div className="icon-title">
          {preIcon}
          {title}
        </div>
        <i className={`fa ${isOpen ? "fa-angle-up" : "fa-angle-down"}`} />
      </div>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default Accordion;
