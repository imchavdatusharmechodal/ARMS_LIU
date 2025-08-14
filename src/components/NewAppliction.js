import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';

const NewApplication = () => {
  // State for dropdowns
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [licensingAuthority, setLicensingAuthority] = useState('');
  const [service, setService] = useState('');
  const [formError, setFormError] = useState('');

  // Navigation hook
  const navigate = useNavigate();

  // Sample data for dropdowns (replace with actual data from API or backend)
  const categories = ['Individual', 'Business', 'Organization'];
  const states = ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka'];
  const districts = {
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Delhi: ['Central Delhi', 'South Delhi', 'North Delhi'],
    Karnataka: ['Bangalore', 'Mysore', 'Mangalore'],
  };
  const licensingAuthorities = ['District Magistrate', 'Police Commissioner', 'State Licensing Board'];
  const services = ['New License', 'Renewal', 'Transfer', 'Modification'];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !state || !district || !licensingAuthority || !service) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    // Proceed with form submission (e.g., API call)
    console.log({
      category,
      state,
      district,
      licensingAuthority,
      service,
    });
    // Redirect to homepage
    navigate('/apply-now');
  };

  return (
    <div>
      <Sidebar />
      <div className="asside">
        <div className="about-first">
          <div className="row">
            <div className="col-12 mb-24">
              <div className="bg-box text-center application-header">
                <h1>Apply Online For Arms Licence</h1>
              </div>
            </div>
            <div className="col-12 mb-24">
              <div className="bg-box">
                <form onSubmit={handleSubmit}>
                  {/* Category Dropdown */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-control"
                      id="category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setDistrict(''); // Reset district when state changes
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="category">Category</label>
                  </div>

                  {/* State Dropdown */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-control"
                      id="state"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setDistrict(''); // Reset district when state changes
                      }}
                    >
                      <option value="">Select State</option>
                      {states.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="state">State</label>
                  </div>

                  {/* District Dropdown */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-control"
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!state} // Disable if no state is selected
                    >
                      <option value="">Select District</option>
                      {state &&
                        districts[state]?.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                    </select>
                    <label htmlFor="district">District</label>
                  </div>

                  {/* Licensing Authority Dropdown */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-control"
                      id="licensingAuthority"
                      value={licensingAuthority}
                      onChange={(e) => setLicensingAuthority(e.target.value)}
                    >
                      <option value="">Select Licensing Authority</option>
                      {licensingAuthorities.map((auth) => (
                        <option key={auth} value={auth}>
                          {auth}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="licensingAuthority">Name of Licensing Authority</label>
                  </div>

                  {/* Service Dropdown */}
                  <div className="form-floating mb-4">
                    <select
                      className="form-control"
                      id="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      <option value="">Select Service</option>
                      {services.map((serv) => (
                        <option key={serv} value={serv}>
                          {serv}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="service">Service</label>
                  </div>

                  {/* Error Message */}
                  {formError && (
                    <div style={{ color: 'red', fontSize: '0.9em', marginBottom: '10px' }}>
                      {formError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-verify">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default NewApplication;