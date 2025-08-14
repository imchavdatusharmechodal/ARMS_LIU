import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pdf_img from '../Image/pdf-img.png';
import Signature_img from '../Image/Signature.jpg';
import { Link } from 'react-router-dom';

function FilledPdf() {

    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
     const [documents, setDocuments] = useState([]);

     useEffect(() => {
        const fetchApplication = async () => {
            const token = localStorage.getItem('ps_token'); // ✅ Fixed: Use correct token key
            if (!token || !id) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(
                    `https://lampserver.uppolice.co.in/arms/get-application?application_id=${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const data = await response.json();
                console.log('API response:', data);
                if (data.status && Array.isArray(data.data) && data.data.length > 0) {
                    setApplication(data.data[0].application);
                    setDocuments(data.data[0].documents || []);
                } else {
                    setApplication(null);
                    setDocuments([]);
                }
            } catch (error) {
                console.error('Error fetching application:', error);
                setApplication(null);
                setDocuments([]);
            }
            setLoading(false);
        };
        fetchApplication();
    }, [id]);

    if (loading) {
        return <div className='container-fluid py-5 text-center'>Loading...</div>;
    }
    if (!application) {
        return <div className='container-fluid py-5 text-center'>No application found.</div>;
    }

    function yearToWords(yearNum) {
    // Handles years like 2025 => "Two Thousand Twenty Five"
    if (yearNum >= 2000) {
        const thousands = "Two Thousand";
        const remainder = yearNum % 2000;
        if (remainder === 0) return thousands;
        return thousands + " " + numberToWords(remainder);
    } else if (yearNum >= 1900) {
        const thousands = "Nineteen Hundred";
        const remainder = yearNum % 1900;
        if (remainder === 0) return thousands;
        return "Nineteen " + numberToWords(remainder);
    }
    return numberToWords(yearNum);
}

function numberToWords(num) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    return num.toString();
}

function dateToWords(dateStr) {
    if (!dateStr) return '';
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const ordinals = [
        'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
        'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth', 'Twentieth',
        'Twenty First', 'Twenty Second', 'Twenty Third', 'Twenty Fourth', 'Twenty Fifth', 'Twenty Sixth', 'Twenty Seventh', 'Twenty Eighth', 'Twenty Ninth', 'Thirtieth', 'Thirty First'
    ];
    const [year, month, day] = dateStr.split('-');
    const dayWord = ordinals[parseInt(day, 10) - 1] || '';
    const monthWord = months[parseInt(month, 10) - 1] || '';
    const yearNum = parseInt(year, 10);
    const yearWord = yearToWords(yearNum);
    return `${dayWord} ${monthWord} ${yearWord}`.trim();
}

    return (
        <div className='container-fluid'>
            <div className='row py-4'>
                <div className='col-12 mb-4 text-end'>
                    <button className='btn btn-verify no-print' onClick={() => window.print()}>
                        Print PDF
                    </button>
                </div>
                <div className='col-3'></div>
                <div className='col-6'>
                    <div className='pdf-text text-center'>
                        <h3>Application Forms</h3>
                        <h3>Form A-1</h3>
                        <h4>(for individuals)</h4>
                        <h3>Form of application for an arms licence
                            in Form II, III and IV</h3>
                        <h5>(See rule 11)</h5>
                    </div>
                </div>
                <div className='col-3'>
                    <div className='pdf-img text-end'>
                        {application.photo_path && (
                            <img
                                src={`https://lampserver.uppolice.co.in${application.photo_path}`}
                                alt="Applicant Photo"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <div className='table-responsive mt-table'>
                        <table className="table table-bordered mb-0">
                            <tbody>
                                <tr>
                                    <th className='tble-pdf-center' scope="col" colSpan={2}>IDENTITY OF THE APPLICANT</th>
                                </tr>
                                <tr>
                                    <th scope="col">1. Name/Spouse Name</th>
                                    <td scope="col">{application.applicant_name} </td>
                                </tr>
                                <tr>
                                    <th scope="col">2. Sex</th>
                                    <td scope="col">{application.gender}</td>
                                </tr>
                                <tr>
                                    <th>3. Place of birth (Nativity)</th>
                                    <td>{application.birth_place}</td>
                                </tr>
                                {/* <tr>
                                    <th className='w-50'>4. Date of birth in Christian era</th>
                                    <td className='w-50'></td>
                                </tr> */}
                                <tr>
                                    <th className='w-50'>   in figures</th>
                                    <td className='w-50'>{application.date_of_birth ? application.date_of_birth.substring(0, 10) : ''}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>   in words</th>
                                     <td className='w-50'>{dateToWords(application.date_of_birth ? application.date_of_birth.substring(0, 10) : '')}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>5. Permanent Account No. (PAN)</th>
                                    <td className='w-50'>{application.pan_number}</td>
                                </tr>
                                {/* <tr>
                                    <th className='w-50'>6. Aadhaar Card Number</th>
                                    <td className='w-50'>XXXX-XXXX-1234</td>
                                </tr> */}
                                <tr>
                                    <th className='w-50'>6. Present address</th>
                                    <td className='w-50'>{application.present_address}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>   (a) Since when residing at the present address</th>
                                    <td className='w-50'>{application.residence_since ? application.residence_since.substring(0, 10) : ''}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>   (b) Telephone Number</th>
                                    <td className='w-50'>{application.office_phone}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>   (c) Mobile Number</th>
                                    <td className='w-50'>{application.mobile_number}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>   (d) "Nearest Police Station</th>
                                    <td className='w-50'>{application.nearest_police_station}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>8. Permanent Address</th>
                                    <td className='w-50'>{application.permanent_address}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>   (a) "Nearest Police Station</th>
                                    <td className='w-50'>{application.nearest_police_station}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>9. Occupation</th>
                                    <td className='w-50'>{application.occupation}</td>
                                </tr>
                                <tr>
                                    <th className='w-50'>10. Office/business address</th>
                                    <td className='w-50'>{application.office_address_1}</td>
                                </tr>
                                <tr>
                                    <td scope="col" colSpan={3}>*Note – Nearest Police Station means the police station under whose jurisdiction the place given in the address comes</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-bordered mb-0">
                            <tbody>
                                <tr>
                                    <th className='tble-pdf-center' scope="col" colSpan={3}>OTHER PARTICULARS OF THE APPLICANT</th>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        Additional particulars if the licence is required for crop protection under rule 35
                                    </th>
                                    <td scope="col">{application.village_location}</td>
                                    <td scope="col">{application.land_area}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Convicted</th>
                                    <td scope="col">{application.convicted ? "Yes" : "No"}</td>
                                    <td scope="col">{application.conviction_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Ordered to execute a bond under Chapter VIII of Code of Criminal Procedure, 1973</th>
                                    <td scope="col">{application.bond_ordered ? "Yes" : "No"}</td>
                                    <td scope="col">{application.bond_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Prohibited under the Arms Act, 1959, or any other law from having the arms or ammunition</th>
                                    <td scope="col">{application.prohibited_under_arms_act ? "Yes" : "No"}</td>
                                    <td scope="col">{application.prohibition_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Previously applied for a licence</th>
                                    <td scope="col">{application.previously_applied ? "Yes" : "No"}</td>
                                    <td scope="col">{application.previous_application_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Licence ever suspended or cancelled/revoked</th>
                                    <td scope="col">{application.suspended_or_revoked ? "Yes" : "No"}</td>
                                    <td scope="col">{application.suspension_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Any other member of the applicant’s family is in possession of any arms licence</th>
                                    <td scope="col">{application.family_licence_holder ? "Yes" : "No"}</td>
                                    <td scope="col">{application.family_licence_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Safe place to keep the arms and ammunition</th>
                                    <td scope="col">{application.has_safe_place_and_training ? "Yes" : "No"}</td>
                                    <td scope="col">{application.training_details}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-bordered mb-0">
                            <tbody>
                                <tr>
                                    <th className='tble-pdf-center' scope="col" colSpan={3}>Particulars of licence being applied for</th>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        Need for licence (see note 1 below)
                                    </th>
                                    <td scope="col">{application.need_for_license}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Description of arms for which licence is being sought</th>
                                    <td scope="col">{application.weapon_type}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Description of ammunition or ingredients of ammunition for which licence is being sought</th>
                                    <td scope="col">{application.arms_ammunition_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Area within which applicant wishes to carry arms</th>
                                    <td scope="col">{application.area_validity}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Claims for special consideration for obtaining the licence, if any</th>
                                    <td scope="col">{application.special_consideration_claims}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-bordered mb-0 ">
                            <tbody>
                                <tr>
                                    <th className='tble-pdf-center' scope="col" colSpan={3}>Additional Information</th>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        Additional Particulars if the licence is required for crop protection under rule 33
                                    </th>
                                    <td scope="col">{application.village_location}</td>
                                    <td scope="col">{application.land_area}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        Whether the applicant has been convicted
                                    </th>
                                    <td scope="col">{application.convicted ? "Yes" : "No"}</td>
                                    <td scope="col">{application.conviction_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        Whether the applicant has been ordered to execute a bond under Chapter VIII of Code of Criminal Procedure 1973 (2 of 1974) for keeping the peace or for good behavior
                                    </th>
                                    <td scope="col">{application.bond_ordered ? "Yes" : "No"}</td>
                                    <td scope="col">{application.bond_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        Whether the applicant has been prohibited under the Arms Act 1959 or any other law from having the arms or ammunition
                                    </th>
                                    <td scope="col">{application.prohibited_under_arms_act ? "Yes" : "No"}</td>
                                    <td scope="col">{application.prohibition_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        The applicant applied for a licence before - if so when to whom and with what result
                                    </th>
                                    <td scope="col">{application.previously_applied ? "Yes" : "No"}</td>
                                    <td scope="col">{application.previous_application_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">The applicant licence was ever suspended or cancelled/revoked</th>
                                    <td scope="col">{application.suspended_or_revoked ? "Yes" : "No"}</td>
                                    <td scope="col">{application.suspension_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">Any other member of the applicant's family is in possession of any licence, if so, particulars thereof</th>
                                    <td scope="col">{application.family_licence_holder ? "Yes" : "No"}</td>
                                    <td scope="col">{application.family_licence_details}</td>
                                </tr>
                                <tr>
                                    <th className='w-50' scope="col">
                                        The applicant has a safe place to keep the arms and ammunition and has undergone prescribed training as specified under rule 10
                                    </th>
                                    <td scope="col">{application.has_safe_place_and_training ? "Yes" : "No"}</td>
                                    <td scope="col">{application.training_details}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th className='tble-pdf-center' scope="col" colSpan={3}>Documents Of The Application</th>
                                </tr>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={3}>No documents uploaded.</td>
                                    </tr>
                                ) : (
                                    documents.map(doc => (
                                        <tr key={doc.id}>
                                            <th className='w-50' scope="col">
                                                {doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </th>
                                           <td scope="col">
                                            <a
                                                href={`https://lampserver.uppolice.co.in${doc.document_url}`}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Download Document
                                            </a>
                                        </td>
                                            <td scope="col">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='declaration-text'>
                        <h2>
                            Declaration:
                        </h2>
                        <p>
                            I hereby declare that the above particulars given in the application are true, complete
                            and correct to the best of my knowledge and belief. I understand that in the event of any
                            information being found false or incorrect at any stage, I am liable to be proceeded
                            against and action taken under the relevant provisions of the Arms Act, 1959, the Arms
                            Rules, 2016, and other central enactments or the law for the time being in force.
                        </p>
                    </div>
                </div>
            </div>
            <div className='row mt-5 mb-5'>
                <div className='col-6'>
                    <div className='signature-text'>
                        <p>
                            Place : <span>{application.permanent_address || ""}</span>
                        </p>
                        <p>
                            Date :<span> {application.created_at ? application.created_at.substring(0, 10) : ""}</span>
                        </p>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='signature-img text-end'>
                        {application.signature_path ? (
                            <img
                                src={`https://lampserver.uppolice.co.in${application.signature_path}`}
                                alt="Signature"
                                className='signature-img'
                            />
                        ) : (
                            <img src={Signature_img} alt="Signature" className='signature-img' />
                        )}
                    </div>
                </div>
            </div>
            <div className='row'>
  <div className='col-12'>
  <h3 className='mt-5 mb-3'>Documents Of The Application</h3>
  {documents.length === 0 ? (
  <div>No documents uploaded.</div>
) : (
  documents.map(doc => (
    <div key={doc.id} style={{ marginBottom: '30px' }}>
      <h5>
        {doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h5>
      <a
        href={`https://lampserver.uppolice.co.in${doc.document_url}`}
        download
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Document
      </a>
      {doc.document_url.endsWith('.pdf') ? (
        <iframe
          src={`https://lampserver.uppolice.co.in${doc.document_url}`}
          width="100%"
          height="800"
          style={{ border: '1px solid #ccc', marginTop: '10px' }}
          title={doc.document_type}
          onError={(e) => {
            e.target.outerHTML = "<div style='color:red'>Unable to load PDF. Please check the file.</div>";
          }}
        />
      ) : (
        <img
          src={`https://lampserver.uppolice.co.in${doc.document_url}`}
          alt={doc.document_type}
          width="400"
          style={{ display: 'block', marginTop: '10px' }}
        />
      )}
    </div>
  ))
)}
</div>
</div>
        </div>
                    )
                }

export default FilledPdf