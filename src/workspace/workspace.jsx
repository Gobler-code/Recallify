import { useState } from "react";
import LeftSection from "./components/LeftSection/LeftSection.jsx";
import RightSection from "./components/RightSection/RightSection.jsx";

export default function Workspace() {
  const [submittedText, setSubmittedText] = useState(""); // only updated on submit
  const [vocabList, setVocabList] = useState([]); // for collecting words in the modal
  const [sentVocabBatch , setSentVocabBatch] = useState([])// NEW: The batch sent to RightSection
 

  
//new vocab function
  const addToVocab = (word)=>{
           const trimmedWord = word.trim().toLowerCase();
           if(trimmedWord.length === 0){
            return 
           }
           if(vocabList.includes(trimmedWord)){
             return
           }
           if(vocabList.length>=10){
            alert("Maximum 10 words are allowed")
            return
           }
           
            setVocabList([...vocabList, trimmedWord]);
          }
  const removeFromVocab = (wordToRemove) =>{
       const newList = vocabList.filter((word)=> word !== wordToRemove);
       setVocabList(newList);
  }

  const clearVocabList = ()=>{
    setVocabList([])
  }
 
  const handleSendVocabBatch = (batch) => {
    setSentVocabBatch(batch);
    setVocabList([]);
  }
 

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <LeftSection
       onSubmit={setSubmittedText}
       vocabList = {vocabList}
       onAddToVocab ={addToVocab}
       onRemoveFromVocab = {removeFromVocab}
       onClearVocabList = {clearVocabList}
       onSendVocabBatchToRightSection={handleSendVocabBatch} />
      <RightSection 
       notesText={submittedText} /* RightSection sees data only on submit */
       vocabBatch = {sentVocabBatch}
        onClearSentVocabBatch={() => setSentVocabBatch([])} // Function to clear it after processing in RightSection
             /> 
    </div>
  );
}
