import React, {useEffect} from 'react';
import autocomplete from 'autocompleter';


let jobTitles = [
  { label: "Front end Developer", value: "front end developer" },
  { label: "Back end Developer", value: "back end developer" },
  { label: "Full Stack Developer", value: "full stack developer" },
  { label: "JavaScript Developer", value: "javascript developer" },
  { label: "React Developer", value: "react developer" },
  { label: "Angular Developer", value: "angular developer" },
  { label: "Vue.js Developer", value: "vuejs developer" },
  { label: "Node.js Developer", value: "nodejs developer" },
  { label: "Python Developer", value: "python developer" },
  { label: "Ruby Developer", value: "ruby developer" },
  { label: "PHP Developer", value: "php developer" },
  { label: "Java Developer", value: "java developer" },
  { label: "C# Developer", value: "csharp developer" },
  { label: ".NET Developer", value: "dotnet developer" },
  { label: "UI/UX Developer", value: "ui ux developer" },
];


let locations = [
  {"label": "London", "value": "london"},
  {"label": "Birmingham", "value": "birmingham"},
  {"label": "Manchester", "value": "manchester"},
  {"label": "Glasgow", "value": "glasgow"},
  {"label": "Leeds", "value": "leeds"},
  {"label": "Newcastle", "value": "newcastle"},
  {"label": "Sheffield", "value": "sheffield"},
  {"label": "Liverpool", "value": "liverpool"},
  {"label": "Bristol", "value": "bristol"},
  {"label": "Edinburgh", "value": "edinburgh"},
  {"label": "Cardiff", "value": "cardiff"},
  {"label": "Belfast", "value": "belfast"},
  {"label": "Nottingham", "value": "nottingham"},
  {"label": "Southampton", "value": "southampton"},
  {"label": "Leicester", "value": "leicester"},
  {"label": "Bradford", "value": "bradford"},
  {"label": "Coventry", "value": "coventry"},
  {"label": "Hull", "value": "hull"},
  {"label": "Stoke on Trent", "value": "stoke on trent"},
  {"label": "Wolverhampton", "value": "wolverhampton"}
];


function Search({ submit }) {


  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Create a new FormData object from the form
    const formData = new FormData(event.target);
    
    // Convert the form data to a dictionary
    const formValues = {};
    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }
    
    // Execute the callback function passed as a prop, passing the form values
    submit(formValues);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='row align-items-center'>
        <div className="form-group col-md-5">
          <label htmlFor="searchTitle">Role</label>
          <div className="d-flex align-items-center">
            <input type="text" className="form-control" id="searchTitle" name="title" placeholder="Enter title" required/>
          </div>
        </div>
        <div className="form-group col-md-5 ">
          <label htmlFor="searchLocation">Location</label>
          <div className="d-flex align-items-center">
            <input type="text" className="form-control" id="searchLocation" name="location" placeholder="Enter location" required/>
          </div>
        </div>
        <div className="col-md-2 d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary w-100 mt-4">Search</button>
        </div>
      </div>
    </form>
  );
}

export default Search;
