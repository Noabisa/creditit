import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoanForm = () => {
  const { loanId } = useParams(); // this is now the loanOfferId
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loanOffer, setLoanOffer] = useState(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchLoanOffer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/loan-offers/${loanId}`);
        setLoanOffer(res.data.loanOffer);
      } catch (err) {
        alert('Loan offer not found.');
        navigate('/loans');
      }
    };

    fetchLoanOffer();
  }, [loanId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert('Please provide a reason for applying.');

    try {
      await axios.post(
        'http://localhost:5000/api/applications',
        {
          loanOfferId: loanOffer._id,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Application submitted!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (!loanOffer) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300 mt-10">Loading loan offer info...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 sm:p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? 'Loan Details' : 'Reason for Applying'}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step === 1 ? 'w-1/2 bg-blue-500' : 'w-full bg-green-500'
              }`}
            />
          </div>
        </div>

        {/* Step 1: Loan Info */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Apply for: {loanOffer.title}</h2>
            <div className="space-y-3 text-sm sm:text-base">
              <p><span className="font-semibold">Applicant:</span> {user?.name || user?.email}</p>
              <p><span className="font-semibold">Amount:</span> ${loanOffer.amount.toLocaleString()}</p>
              <p><span className="font-semibold">Interest Rate:</span> {loanOffer.interestRate}%</p>
              <p><span className="font-semibold">Duration:</span> {loanOffer.durationMonths} months</p>
              <p><span className="font-semibold">Purpose:</span> {loanOffer.purpose}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2: Reason Input */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium">
              Why are you applying for this loan?
            </label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="Enter your reason here..."
              required
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoanForm;
