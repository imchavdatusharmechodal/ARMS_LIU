

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import chack_mark from '../Image/check-mark.png'; 

const UploadSuccess = () => {
 
    return (
        <div>
            <Sidebar />
            <div className="asside">
                <div className="about-first">
                    <div className="row">
                        <div className="col-12 mb-24">
                            <div className="bg-box">
                                <div>
                                    <div className='chack_mark text-center'>
                                        <img src={ chack_mark} alt="User Photo" />
                                    </div>
                                </div>
                                <div className='reference-text text-center'>
                                    <h3>
                                        Your Application has been successfully and your reference Namber is <span>#123456</span>
                                    </h3>
                                    <button className='btn btn-cliked'>Cliked here to download online filled Application</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default UploadSuccess;