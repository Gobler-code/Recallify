import { useState } from "react";
import LeftSection from "./components/LeftSection/LeftSection.jsx";
import RightSection from "./components/RightSection/RightSection.jsx";

export default function Workspace() {
  const [submittedText, setSubmittedText] = useState(""); // only updated on submit

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <LeftSection onSubmit={setSubmittedText} />
      <RightSection notesText={submittedText} /> {/* RightSection sees data only on submit */}
    </div>
  );
}
