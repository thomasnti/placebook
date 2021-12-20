import React from "react";
import ReactDom from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

function SideDrawer(props) {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={300}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick} >{props.children}</aside>
      {/* BAZW TON CLICK LISTENER SE OLO TO SIDEDRAWER KAI OXI STA NAVLINKS KSEXWRISTA */}
    </CSSTransition>
  );

  return ReactDom.createPortal(
    content,
    document.getElementById("drawer-portal")
  );
}

export default SideDrawer;
