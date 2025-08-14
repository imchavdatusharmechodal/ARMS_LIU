import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

function ValidationReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { applicationId } = useParams();
     const location = useLocation();
    
    // Form state
    const [formData, setFormData] = useState({
        application_id: id || '',
        applicant_name: '',
        father_spouse_name: '',
        current_address: '',
        nearest_police_station: '',
        ever_convicted: '',
        conviction_details: '',
        dp_act_applied: '',
        dp_act_details: '',
        arms_act_applied: '',
        arms_act_details: '',
        has_enemy: '',
        enemy_details: '',
        address_verified: '',
        address_verification_details: '',
        business_verified: '',
        business_verification_details: '',
        complaint_registered: '',
        complaint_details: '',
        involved_in_crime: '',
        crime_details: '',
        ever_arrested: '',
        arrest_details: '',
        bad_character_register: '',
        bad_character_details: '',
        govt_case_registered: '',
        govt_case_details: '',
        life_threat: '',
        life_threat_details: '',
        political_organization_details: '',
        report_date: '',
        police_station_incharge: '',
        police_station_name: '',
        signature_file: null,
        assigned_by: ''
    });

        useEffect(() => {
        // Get assignedBy from query params
        const params = new URLSearchParams(location.search);
        const assignedBy = params.get('assignedBy');
        if (assignedBy) {
            setFormData(prev => ({
                ...prev,
                assigned_by: assignedBy // stamp is your "द्वारा सौंपा गया" field
            }));
        }
    }, [location.search]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };



    const handleRadioChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('ps_token');
            if (!token) {
                setError('Authentication token not found. Please login again.');
                return;
            }

            const formDataToSend = new FormData();
            
            // Add application_id
            // formDataToSend.append('application_id', id);
            
            // Add all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    if (key === 'signature_file' && formData[key]) {
                        formDataToSend.append(key, formData[key]);
                    } else if (key !== 'signature_file') {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            // Add submitted_by
            formDataToSend.append('submitted_by', 'PS');

            const response = await axios.post(
                'https://lampserver.uppolice.co.in/validation-report/submit-ps',
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.status) {
                setSuccess('Validation report submitted successfully!');
                setTimeout(() => {
                    navigate('/Dashboard');
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to submit validation report.');
            }
        } catch (err) {
            console.error('Error submitting validation report:', err);
            setError(err.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    const fetchApplicationDetails = async () => {
         if (!id) return;
        const token = localStorage.getItem('ps_token');
        try {
            const response = await fetch(
                `https://lampserver.uppolice.co.in/arms/get-application?application_id=${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            const data = await response.json();
            if (data.status && Array.isArray(data.data) && data.data.length > 0) {
                const app = data.data[0].application;
                setFormData(prev => ({
                    ...prev,
                    application_id: app.id || '',
                    applicant_name: app.applicant_name || '',
                    father_spouse_name: app.parent_spouse_name || '',
                    applicant_age: app.date_of_birth ? 
                        (new Date().getFullYear() - new Date(app.date_of_birth).getFullYear()).toString() : '',
                    caste: app.caste || '',
                    occupation: app.occupation || '',
                    current_address: app.present_address || '',
                    permanent_address: app.permanent_address || '',
                    current_residence_address: app.present_address || '',
                    residence_since: app.residence_since ? app.residence_since.slice(0,10) : '',
                    nearest_police_station: app.nearest_police_station || '',
                    district: app.district || '',
                    pan_number: app.pan_number || '',
                    // Add more mappings as needed for your form fields
                }));
            }
        } catch (error) {
            console.error('Error fetching application details:', error);
        }
    };
    fetchApplicationDetails();
}, [applicationId]);

    return (
        <div className='container py-4'>
            <div className='row'>
                <div className='col-12'>
                    <div className='pdf-text text-center'>
                        <h3 className="mb-2">पूर्ववर्ती सत्यापन रिपोर्ट</h3>
                        <h4>(पुलिस विभाग द्वारा भरा जाएगा)</h4>
                    </div>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col-12'>
                        <div className='table-responsive mt-table'>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th className='tble-pdf-center' scope="col" colSpan={3}>VALIDATION REPORT</th>
                                    </tr>
                                    <tr>
                                        <th scope="col">Application ID</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="application_id"
                                                value={formData.application_id}
                                                onChange={handleInputChange}
                                                required
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col">1. आवेदक का नाम</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="applicant_name"
                                                value={formData.applicant_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col">2. पिता/पति-पत्नी का नाम</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="father_spouse_name"
                                                value={formData.father_spouse_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>3. वर्तमान पता</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="current_address"
                                                value={formData.current_address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>वर्तमान पता का नजदीक पुलिस थाना</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="nearest_police_station"
                                                value={formData.nearest_police_station}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>4. क्या आवेदक कभी दोषसिद्ध हुआ है ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="ever_convicted" 
                                                    id="ever_convicted_yes"
                                                    value="हाँ"
                                                    checked={formData.ever_convicted === 'हाँ'}
                                                    onChange={() => handleRadioChange('ever_convicted', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="ever_convicted_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="ever_convicted" 
                                                    id="ever_convicted_no"
                                                    value="नहीं"
                                                    checked={formData.ever_convicted === 'नहीं'}
                                                    onChange={() => handleRadioChange('ever_convicted', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="ever_convicted_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>(क) यदि हां, अपराध, दंडादेश और दंडादेश की तारीख</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="conviction_details"
                                                value={formData.conviction_details}
                                                onChange={handleInputChange}
                                                placeholder="अपराध का विवरण"
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="date" 
                                                className="form-control bor-bg"
                                                name="conviction_date"
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>(ख) शांति बनाए रखने या सदाचार के लिए दंड प्रक्रिया संहिता, 1973 (1974 का 2) के अध्याय 7 के अधीन बंध पत्र के निष्पादन का आदेश किया गया है।</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="dp_act_applied" 
                                                    id="dp_act_yes"
                                                    value="हाँ"
                                                    checked={formData.dp_act_applied === 'हाँ'}
                                                    onChange={() => handleRadioChange('dp_act_applied', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="dp_act_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="dp_act_applied" 
                                                    id="dp_act_no"
                                                    value="नहीं"
                                                    checked={formData.dp_act_applied === 'नहीं'}
                                                    onChange={() => handleRadioChange('dp_act_applied', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="dp_act_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, तो कब और उसकी अवधि क्या है ?</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="dp_act_details"
                                                value={formData.dp_act_details}
                                                onChange={handleInputChange}
                                                placeholder="विवरण"
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                placeholder="अवधि"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>(ग) किसी अपराध या गोलाबारूद उसके पास या ले जाने में अर्जन किए जाने से आयुध अधिनियम, 1.959 या किसी अन्य विधि के अधीन निषिद्ध किया गया है।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="arms_act_applied"
                                                value={formData.arms_act_applied}
                                                onChange={handleInputChange}
                                                placeholder="हाँ/नहीं"
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="arms_act_details"
                                                value={formData.arms_act_details}
                                                onChange={handleInputChange}
                                                placeholder="विवरण"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, उसका ब्यौरा क्या है।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="arms_act_details"
                                                value={formData.arms_act_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>5. क्या आवेदक का किसी से शत्रुता या झगड़ा है जिससे शांति भंग होने की संभावना है ? यदि हाँ, ब्यौरा दीजिए।</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="has_enemy" 
                                                    id="has_enemy_yes"
                                                    value="हाँ"
                                                    checked={formData.has_enemy === 'हाँ'}
                                                    onChange={() => handleRadioChange('has_enemy', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="has_enemy_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="has_enemy" 
                                                    id="has_enemy_no"
                                                    value="नहीं"
                                                    checked={formData.has_enemy === 'नहीं'}
                                                    onChange={() => handleRadioChange('has_enemy', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="has_enemy_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, ब्यौरा दीजिए।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="enemy_details"
                                                value={formData.enemy_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>6. क्या आवेदक का पता और जन्म तारीख का सत्यापन किया गया है ? ब्यौरा दीजिए।</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="address_verified" 
                                                    id="address_verified_yes"
                                                    value="हाँ"
                                                    checked={formData.address_verified === 'हाँ'}
                                                    onChange={() => handleRadioChange('address_verified', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="address_verified_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="address_verified" 
                                                    id="address_verified_no"
                                                    value="नहीं"
                                                    checked={formData.address_verified === 'नहीं'}
                                                    onChange={() => handleRadioChange('address_verified', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="address_verified_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>ब्यौरा दीजिए।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="address_verification_details"
                                                value={formData.address_verification_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>7. क्या आवेदक का व्यवसाय/कारबार का सत्यापन किया गया है ? ब्यौरा दीजिए।</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="business_verified" 
                                                    id="business_verified_yes"
                                                    value="हाँ"
                                                    checked={formData.business_verified === 'हाँ'}
                                                    onChange={() => handleRadioChange('business_verified', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="business_verified_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="business_verified" 
                                                    id="business_verified_no"
                                                    value="नहीं"
                                                    checked={formData.business_verified === 'नहीं'}
                                                    onChange={() => handleRadioChange('business_verified', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="business_verified_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>ब्यौरा दीजिए।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="business_verification_details"
                                                value={formData.business_verification_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>8. क्या पुलिस थाने में आवेदक के विरूद्ध कोई शिकायत रजिस्टर्ड है ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="complaint_registered" 
                                                    id="complaint_registered_yes"
                                                    value="हाँ"
                                                    checked={formData.complaint_registered === 'हाँ'}
                                                    onChange={() => handleRadioChange('complaint_registered', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="complaint_registered_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="complaint_registered" 
                                                    id="complaint_registered_no"
                                                    value="नहीं"
                                                    checked={formData.complaint_registered === 'नहीं'}
                                                    onChange={() => handleRadioChange('complaint_registered', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="complaint_registered_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, उसका ब्यौरा क्या है।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="complaint_details"
                                                value={formData.complaint_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>9. क्या आवेदक किसी अपराध में संलिप्त रहा है ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="involved_in_crime" 
                                                    id="involved_in_crime_yes"
                                                    value="हाँ"
                                                    checked={formData.involved_in_crime === 'हाँ'}
                                                    onChange={() => handleRadioChange('involved_in_crime', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="involved_in_crime_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="involved_in_crime" 
                                                    id="involved_in_crime_no"
                                                    value="नहीं"
                                                    checked={formData.involved_in_crime === 'नहीं'}
                                                    onChange={() => handleRadioChange('involved_in_crime', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="involved_in_crime_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, उसका ब्यौरा क्या है।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="crime_details"
                                                value={formData.crime_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>10. क्या आवेदक किसी अपराध में गिरफ्तार हुआ था ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="ever_arrested" 
                                                    id="ever_arrested_yes"
                                                    value="हाँ"
                                                    checked={formData.ever_arrested === 'हाँ'}
                                                    onChange={() => handleRadioChange('ever_arrested', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="ever_arrested_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="ever_arrested" 
                                                    id="ever_arrested_no"
                                                    value="नहीं"
                                                    checked={formData.ever_arrested === 'नहीं'}
                                                    onChange={() => handleRadioChange('ever_arrested', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="ever_arrested_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, उसका ब्यौरा क्या है।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="arrest_details"
                                                value={formData.arrest_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>11. क्या आवेदक का नाम पुलिस थाने के खराब चरित्र रजिस्टर में सूचीबद्ध है ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="bad_character_register" 
                                                    id="bad_character_register_yes"
                                                    value="हाँ"
                                                    checked={formData.bad_character_register === 'हाँ'}
                                                    onChange={() => handleRadioChange('bad_character_register', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="bad_character_register_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="bad_character_register" 
                                                    id="bad_character_register_no"
                                                    value="नहीं"
                                                    checked={formData.bad_character_register === 'नहीं'}
                                                    onChange={() => handleRadioChange('bad_character_register', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="bad_character_register_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, पुलिस थाने के अभिलेख के अनुसार ब्यौरा दीजिए।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="bad_character_details"
                                                value={formData.bad_character_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>12. क्या आवेदक का नाम भारत सरकार के अन्य विभाग जैसे- सीबीआई, स्वापक नियंत्रण ब्योरो, डीआरआई, प्रवर्तन रिदेशालय आदि द्वारा किसी मामले में रजिस्टर्ड किया गया है जिसमें पुलिस थाने के दैनिक डायरी रजिस्टर, समन, वारंट आदि में वर्णित पाया गया है ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="govt_case_registered" 
                                                    id="govt_case_registered_yes"
                                                    value="हाँ"
                                                    checked={formData.govt_case_registered === 'हाँ'}
                                                    onChange={() => handleRadioChange('govt_case_registered', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="govt_case_registered_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="govt_case_registered" 
                                                    id="govt_case_registered_no"
                                                    value="नहीं"
                                                    checked={formData.govt_case_registered === 'नहीं'}
                                                    onChange={() => handleRadioChange('govt_case_registered', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="govt_case_registered_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, ब्यौरा दीजिए।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="govt_case_details"
                                                value={formData.govt_case_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>13. क्या आवेदक ने पुलिस थाने में जान से मारने की धमकी के संबंध में कोई शिकायत रजिस्टर्ड कराई है ?</th>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="life_threat" 
                                                    id="life_threat_yes"
                                                    value="हाँ"
                                                    checked={formData.life_threat === 'हाँ'}
                                                    onChange={() => handleRadioChange('life_threat', 'हाँ')}
                                                />
                                                <label className="form-check-label" htmlFor="life_threat_yes">
                                                    हाँ
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check">
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="life_threat" 
                                                    id="life_threat_no"
                                                    value="नहीं"
                                                    checked={formData.life_threat === 'नहीं'}
                                                    onChange={() => handleRadioChange('life_threat', 'नहीं')}
                                                />
                                                <label className="form-check-label" htmlFor="life_threat_no">
                                                    नहीं
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>यदि हाँ, ब्यौरा दीजिए।</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="life_threat_details"
                                                value={formData.life_threat_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>14. किसी राजनीतिक या साम्प्रदायिक संगठन जिसमें आवेदक सदस्य है का ब्यौरा</th>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="political_organization_details"
                                                value={formData.political_organization_details}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td scope="col">
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="col" colSpan={3}>प्रमाणित किया जाता है कि मैने आवेदक द्वारा जमा किए गए आयुध अनुज्ञप्ति दान करने के लिए आवेदन प्ररूप की विषय-वस्तुओं को चैक कर लिया है।</td>
                                    </tr>
                                    <tr>
                                        <th scope="col">तारीख</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="date" 
                                                className="form-control bor-bg"
                                                name="report_date"
                                                value={formData.report_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col">द्वारा सौंपा गया</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="assigned_by" // <-- use assigned_by
                                                value={formData.assigned_by || ''}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="col">हस्ताक्षर</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="file" 
                                                className="form-control bor-bg"
                                                name="signature_file"
                                                onChange={handleInputChange}
                                                accept="image/*"
                                            />
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <th scope="col">थाना प्रभारी</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="police_station_incharge"
                                                value={formData.police_station_incharge}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr> */}
                                    <tr>
                                        <th scope="col">पुलिस थाना</th>
                                        <td scope="col" colSpan={2}>
                                            <input 
                                                type="text" 
                                                className="form-control bor-bg"
                                                name="police_station_name"
                                                value={formData.police_station_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="col" colSpan={3} className='text-center'>
                                            <button
                                                type="submit"
                                                className="btn btn-login w-25"
                                                disabled={loading}
                                            >
                                                {loading ? 'Submitting...' : 'SUBMIT'}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ValidationReport;