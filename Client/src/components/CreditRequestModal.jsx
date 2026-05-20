import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { X, CreditCard, Wallet, Smartphone, ShieldCheck } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function CreditRequestModal({ isOpen, onClose }) {
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [step, setStep] = useState(1); // 1: Amount Selection, 2: Payment, 3: Success
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayNow = () => {
    const finalAmount = amount === 'custom' ? parseInt(customAmount) : amount;
    
    if (!finalAmount || finalAmount <= 0) {
      toast.error('Please enter a valid credit amount.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate fake payment delay
    setTimeout(async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.post('/api/credits/request', { amount: finalAmount, message }, config);
        
        setIsProcessing(false);
        setStep(3); // Go to success step
      } catch (err) {
        setIsProcessing(false);
        toast.error('Failed to submit credit request.');
      }
    }, 2500); // 2.5s fake delay
  };

  const handleClose = () => {
    // Reset state on close
    setTimeout(() => {
      setStep(1);
      setAmount(10);
      setCustomAmount('');
      setMessage('');
      setPaymentMethod('upi');
    }, 300);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isProcessing ? handleClose : null}></div>
      
      <div className="relative bg-card border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-heading font-bold flex items-center gap-2">
            {step === 1 && '⚡ Request Credits'}
            {step === 2 && '💳 Secure Payment'}
            {step === 3 && '✅ Success'}
          </h2>
          {!isProcessing && step !== 3 && (
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* STEP 1: AMOUNT SELECTION */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Select Credit Pack</label>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 10, 20].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`p-4 rounded-xl border font-bold text-lg transition-all ${
                        amount === val
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                          : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {val} <span className="text-sm font-normal">Credits</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount('custom')}
                    className={`p-4 rounded-xl border font-bold text-lg transition-all ${
                      amount === 'custom'
                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                        : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {amount === 'custom' && (
                <div className="animate-fadeIn">
                  <label className="block text-sm text-gray-400 mb-2">Custom Amount</label>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="E.g. 50"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message/Reason (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="E.g. I need credits for testing AI generations..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none h-24"
                ></textarea>
              </div>

              <button
                onClick={() => {
                  if (amount === 'custom' && (!customAmount || customAmount <= 0)) {
                    toast.error("Please enter a valid custom amount");
                    return;
                  }
                  setStep(2);
                }}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-colors shadow-[0_0_20px_rgba(124,58,237,0.4)]"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT FLOW */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-black/40 rounded-xl p-4 flex justify-between items-center border border-white/5">
                <span className="text-gray-400">Total Credits Requesting:</span>
                <span className="text-2xl font-bold text-cyan-400">⚡ {amount === 'custom' ? customAmount : amount}</span>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Select Payment Method</label>
                <div className="space-y-3">
                  <button onClick={() => setPaymentMethod('upi')} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === 'upi' ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}`}>
                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="font-medium flex-1 text-left">UPI / Google Pay</span>
                  </button>
                  <button onClick={() => setPaymentMethod('card')} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}`}>
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="font-medium flex-1 text-left">Credit / Debit Card</span>
                  </button>
                  <button onClick={() => setPaymentMethod('wallet')} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === 'wallet' ? 'bg-primary/10 border-primary text-white' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}`}>
                    <Wallet className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="font-medium flex-1 text-left">Wallet / PayPal</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)} 
                  disabled={isProcessing}
                  className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-white font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" /> Processing Payment...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" /> Pay Now
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-8 animate-fadeIn space-y-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <ShieldCheck className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
              <p className="text-gray-400 max-w-xs mx-auto">
                Your request has been sent to the admin. You will receive a notification once the credits are approved and added to your account.
              </p>
              <div className="pt-6">
                <button onClick={handleClose} className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                  Close & Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
