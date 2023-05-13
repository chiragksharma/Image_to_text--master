
import { useState,useRef,useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';
import { MDBBtn } from 'mdb-react-ui-kit';
import {Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPEN_AI_Key,
});
const openai = new OpenAIApi(configuration);


function App() {
  const [isLoading,setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [progress, setProgress ] = useState(0);
  const [result, setResult] = useState("")
  const [showTextArea, setShowTextArea] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }, []);


  const handleFileInput = (e) => {
    //(e)=> setImage(URL.createObjectURL(e.target.files[0]))
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (file.type.startsWith('image/')) {
        setImage(reader.result);
        
        
      } else {
        setImage(reader.result);
      }
    };
  }


  
  const handleClick = () =>{
    setIsLoading(true);
    Tesseract.recognize(
      image,
      'eng',
      { logger: (m) => {console.log(m);
      if(m.status === "recognizing text"){
        setProgress(parseInt(m.progress * 100))
      }}, }
    ).then(({ data: { text } }) => {
      setText(text);
      setIsLoading(false);
    });
  }
  const doStuff = async () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});

    let object = {
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      
    };
    

    //const response = await openai.createCompletion(object);
    //console.log(response.data.choices[0].text);
    //setResult(response.data.choices[0].text);
    setResult('Hi i am chirag and i am testing this feature')
    setShowTextArea(true);
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }
  const handleBack = () => {
    window.location.reload(true)
  }
  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };
  return (
    <div className="container" style ={{height: "100vh"}}>
      <div className='row h-100'>
        <div className='col-md-5 mx-auto d-flex flex-column align-items-center'>
          {!isLoading && <h1 className='mt-5 mb-4'>Image to Text: assignment helper</h1>}
          
          {/* form */}
          {
            !isLoading && !text && (
              <>
                 <input type="file" className='form-control mt-5 ' onChange={handleFileInput} />
                 <input type="button" className='form-control btn btn-primary mt-4' value = "Convert" onClick={handleClick}/>
              
              </>
            )
          }

          {/* progress bar */}
          {
            isLoading && (
              <>
              <p className='text-center mt-5'>Converting :- {progress}%</p>
              </>
            )
          }

          {/* Text area */}
          {
            !isLoading && text && (
              <>
              <textarea className='form-control' rows="13" value={text} onChange={(e) => setText(e.target.value)}></textarea>
              {/* <input type="button" className='form-control btn btn-primary mt-4' value = "Back" onClick={handleBack}/>
              <input type="button" className='form-control btn btn-primary mt-4' value = "AI Solutions" onClick={doStuff}/> */}
              <div style={{display: 'flex', flexDirection: 'row'}}>
              <MDBBtn color='info' className='me-1 mt-4 mx-2' onClick={handleBack}> Back </MDBBtn>
              <MDBBtn color='info' className='me-1 mt-4 mx-2' onClick={doStuff}> AI Solutions </MDBBtn>
              </div>
              {showTextArea && (
                <div ref={ref}>
               <textarea rows="15" cols="50" className="mt-5 mx-2" value={result} onChange={handleTextAreaChange}>
                </textarea>
                </div>
              )}

              </>
            )
          }
        </div>

      </div>
     
    </div>
  );
}

export default App;
