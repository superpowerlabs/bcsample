import React from "react";
import { isMobile } from "../utils";
// const footers = [
//   {
//     title: "Company",
//     links: [
//       {
//         title: "Team",
//         link: "#",
//       },
//       {
//         title: "History",
//         link: "#",
//       },
//       {
//         title: "Contact Us",
//         link: "#",
//       },
//       {
//         title: "Locations",
//         link: "#",
//       },
//     ],
//   },
//   {
//     title: "Features",
//     links: [
//       {
//         title: "Cool stuff",
//         link: "#",
//       },
//       {
//         title: "Random feature",
//         link: "#",
//       },
//       {
//         title: "Team feature",
//         link: "#",
//       },
//       {
//         title: "Developer stuff",
//         link: "#",
//       },
//       {
//         title: "Another one",
//         link: "#",
//       },
//     ],
//   },
//   {
//     title: "Resources",
//     links: [
//       {
//         title: "Resource",
//         link: "#",
//       },
//       {
//         title: "Resource name",
//         link: "#",
//       },
//       {
//         title: "Another resource",
//         link: "#",
//       },
//       {
//         title: "Final resource",
//         link: "#",
//       },
//     ],
//   },
//   {
//     title: "Legal",
//     links: [
//       {
//         title: "Privacy policy",
//         link: "#",
//       },
//       {
//         title: "Terms of use",
//         link: "#",
//       },
//     ],
//   },
// ];

function Footer(props) {
  return (
    <div className={"footer2 centered mb100"} style={{ width: "100%" }}>
      <img
        alt={"logo"}
        src={"https://s3.mob.land/assets/Mobland_Logo_Stylized300.png"}
        style={{ width: isMobile() ? 66 : "4.5%" }}
      />
      <img
        alt={"separator"}
        src={"https://s3.mob.land/assets/footer-sep.png"}
        style={{ width: "100%", margin: "0 0 18px" }}
      />
      Copyright © 2022 Mobland - All right reserved
    </div>
  );
}

export default Footer;
