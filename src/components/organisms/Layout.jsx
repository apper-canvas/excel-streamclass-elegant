import React from "react";
import Header from "@/components/organisms/Header";

const Layout = ({ children, webinar, participantCount }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header webinar={webinar} participantCount={participantCount} />
      <main>{children}</main>
    </div>
  );
};
export default Layout;