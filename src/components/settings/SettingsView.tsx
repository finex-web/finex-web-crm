import React, { useState } from 'react';
import { db } from '../../lib/db';
import { Logo } from '../common/Logo';
import {
  Building2,
  CreditCard,
  MessageSquare,
  Database,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Lock,
  Server,
  Layers,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SupabaseManager } from './SupabaseManager';

export const SettingsView: React.FC = () => {
  const settings = db.getSettings();

  const [activeSection, setActiveSection] = useState<'general' | 'supabase'>('supabase');

  const [agencyName, setAgencyName] = useState(settings.agency_name || 'FINEX WEB');
  const [tagline, setTagline] = useState(settings.tagline || 'Private Agency Operating System');
  const [phone, setPhone] = useState(settings.phone || '+91 98765 43210');
  const [email, setEmail] = useState(settings.email || 'admin@finexweb.com');
  const [address, setAddress] = useState(settings.address || 'Tech Park Avenue, Phase 2, Pune, Maharashtra');
  const [currency, setCurrency] = useState(settings.currency || 'INR');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol || '₹');

  // Bank & UPI details
  const [bankName, setBankName] = useState(settings.bank_details?.bank_name || 'HDFC Bank');
  const [accountName, setAccountName] = useState(settings.bank_details?.account_name || 'FINEX WEB');
  const [accountNumber, setAccountNumber] = useState(settings.bank_details?.account_number || '9876543210123');
  const [ifsc, setIfsc] = useState(settings.bank_details?.ifsc || 'HDFC0001234');
  const [upiId, setUpiId] = useState(settings.bank_details?.upi_id || 'pay@finexweb');

  // WhatsApp templates
  const [tplGreeting, setTplGreeting] = useState(
    settings.whatsapp_templates?.lead_greeting ||
      'Hello! Thank you for contacting FINEX WEB. We specialize in high-conversion web engineering.'
  );
  const [tplQuote, setTplQuote] = useState(
    settings.whatsapp_templates?.quote_proposal ||
      'Hello! We have prepared your official website project quotation from FINEX WEB.'
  );
  const [tplPayment, setTplPayment] = useState(
    settings.whatsapp_templates?.payment_reminder ||
      'Hello! This is a gentle reminder regarding the outstanding project balance for FINEX WEB.'
  );
  const [tplMaintenance, setTplMaintenance] = useState(
    settings.whatsapp_templates?.maintenance_reminder ||
      'Hello! Your monthly website maintenance and server SLA renewal is upcoming.'
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings({
      agency_name: agencyName,
      tagline,
      phone,
      email,
      address,
      currency,
      currency_symbol: currencySymbol,
      bank_details: {
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        ifsc,
        upi_id: upiId,
      },
      whatsapp_templates: {
        lead_greeting: tplGreeting,
        quote_proposal: tplQuote,
        payment_reminder: tplPayment,
        maintenance_reminder: tplMaintenance,
      },
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset demo data back to the clean agency defaults? This will overwrite local changes.'
      )
    ) {
      db.resetToInitialData();
      alert('Reset complete.');
      window.location.reload();
    }
  };

  const hasSupabase = isSupabaseConfigured();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Agency Configuration & Settings</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Configure Supabase PostgreSQL cloud database, banking remittance details, and messaging templates.
          </p>
        </div>

        {/* Section Navigation Switcher */}
        <div className="flex items-center gap-1 bg-[#121316] p-1 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setActiveSection('supabase')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeSection === 'supabase'
                ? 'bg-[#E52D27] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Cloud Database</span>
            {hasSupabase && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('general')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeSection === 'general'
                ? 'bg-[#E52D27] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Agency & Bank Details</span>
          </button>
        </div>
      </div>

      {/* View 1: Supabase Manager */}
      {activeSection === 'supabase' && <SupabaseManager />}

      {/* View 2: Agency & Bank Details */}
      {activeSection === 'general' && (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs">
          {saveSuccess && (
            <div className="px-3 py-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Agency identity and commercial remittance settings saved successfully.</span>
            </div>
          )}

          {/* Section 1: Agency Brand & Profile */}
          <div className="bg-[#121316] border border-white/[0.08] p-5 rounded-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
              <Building2 className="w-4 h-4 text-[#E52D27]" />
              <h3 className="text-sm font-bold text-white">Agency Identity & Contact</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 mb-1">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Tagline / Mission</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-300 mb-1">Official Support Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Administrative Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Currency Code & Symbol</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-16 h-8 px-2 bg-[#18191c] border border-white/10 rounded text-white font-mono"
                  />
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-12 h-8 px-2 bg-[#18191c] border border-white/10 rounded text-white text-center font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1">Office Registered Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white"
              />
            </div>
          </div>

          {/* Section 2: Bank Remittance & Invoicing details */}
          <div className="bg-[#121316] border border-white/[0.08] p-5 rounded-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Commercial Bank Remittance Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Official UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full h-8 px-2.5 bg-[#18191c] border border-white/10 rounded text-white font-mono text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: WhatsApp Automation Templates */}
          <div className="bg-[#121316] border border-white/[0.08] p-5 rounded-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Client WhatsApp Message Templates</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1">Lead Initial Greeting</label>
                <textarea
                  rows={2}
                  value={tplGreeting}
                  onChange={(e) => setTplGreeting(e.target.value)}
                  className="w-full p-2 bg-[#18191c] border border-white/10 rounded text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Quote Proposal Dispatch</label>
                <textarea
                  rows={2}
                  value={tplQuote}
                  onChange={(e) => setTplQuote(e.target.value)}
                  className="w-full p-2 bg-[#18191c] border border-white/10 rounded text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Payment Balance Reminder</label>
                <textarea
                  rows={2}
                  value={tplPayment}
                  onChange={(e) => setTplPayment(e.target.value)}
                  className="w-full p-2 bg-[#18191c] border border-white/10 rounded text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Monthly Maintenance Renewal Notice</label>
                <textarea
                  rows={2}
                  value={tplMaintenance}
                  onChange={(e) => setTplMaintenance(e.target.value)}
                  className="w-full p-2 bg-[#18191c] border border-white/10 rounded text-white font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-1.5 bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:bg-rose-900/40 rounded text-xs transition-colors"
            >
              Reset to Factory Seed Data
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded bg-[#E52D27] hover:bg-[#c92520] text-white font-semibold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save All Agency Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

