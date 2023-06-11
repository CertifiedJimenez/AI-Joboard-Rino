import React from 'react';

function Search({ submit }) {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    
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
            <input type="text" className="form-control" id="searchTitle" name="title" placeholder="Enter title" />
          </div>
        </div>
        <div className="form-group col-md-5 ">
          <label htmlFor="searchLocation">Location</label>
          <div className="d-flex align-items-center">
            <input type="text" className="form-control" id="searchLocation" name="location" placeholder="Enter location" />
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
