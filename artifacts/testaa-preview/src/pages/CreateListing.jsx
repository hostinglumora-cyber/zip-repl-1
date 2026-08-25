import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import { localDb } from '@/lib/localDb';

const TYPES = [
  { id: 'Single', label: 'Single Asset', desc: 'One livery, uniform, or ELS pack' },
  { id: 'Bundle', label: 'Bundle', desc: 'Multiple assets sold together' },
  { id: 'Free', label: 'Free Release', desc: 'A completely free community drop' },
  { id: 'Code', label: 'Digital Code', desc: 'A redeemable access code' },
];

const CATEGORIES = ['Liveries', 'Uniforms', 'ELS', 'Map Templates', 'Bundles', 'Other Assets'];
const DEPTS = ['Police', 'Fire', 'Sheriff', 'DOT'];
const STEPS = ['Format', 'Details', 'Media', 'Delivery', 'Review'];

const S = {
  page: { minHeight: '100vh', background: '#050505' },
  wrap: { maxWidth: 680, margin: '0 auto', padding: '48px 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#6b7280', marginBottom: 32, textDecoration: 'none' },
  h1: { fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 4 },
  sub: { fontSize: '0.875rem', color: '#6b7280', marginBottom: 40 },
  stepper: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 },
  stepCircle: (active, done) => ({
    height: 28, width: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.6875rem', fontWeight: 700, transition: 'all 0.2s',
    background: done ? '#10b981' : active ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
    color: done ? 'black' : active ? '#10b981' : '#4b5563',
    border: active ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
  }),
  stepLine: (done) => ({ flex: 1, height: 1, background: done ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.06)', transition: 'background 0.2s' }),
  err: { display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.07)', padding: '12px 16px', marginBottom: 24 },
  sectionTitle: { fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: 4 },
  sectionSub: { fontSize: '0.75rem', color: '#6b7280', marginBottom: 16 },
  cardBtn: (sel) => ({ textAlign: 'left', borderRadius: 12, border: sel ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.07)', background: sel ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', padding: 16, cursor: 'pointer', transition: 'all 0.15s', width: '100%' }),
  pillBtn: (sel) => ({ borderRadius: 8, border: sel ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.07)', background: sel ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 500, color: sel ? '#10b981' : '#9ca3af', cursor: 'pointer', transition: 'all 0.15s' }),
  input: { width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', padding: '12px 16px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'white', marginBottom: 8 },
  navRow: { display: 'flex', justifyContent: 'space-between', marginTop: 40 },
  backBtn: (dis) => ({ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', fontSize: '0.75rem', fontWeight: 500, color: '#9ca3af', cursor: dis ? 'not-allowed' : 'pointer', opacity: dis ? 0.3 : 1, transition: 'all 0.15s' }),
  nextBtn: (dis) => ({ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, background: '#10b981', padding: '10px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'black', cursor: dis ? 'not-allowed' : 'pointer', border: 'none', opacity: dis ? 0.6 : 1, transition: 'opacity 0.15s' }),
};

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    listing_type: '', category: '', departments: [],
    title: '', description: '', price_type: 'Robux', price: '',
    images: [], codes: [''],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDept = (d) => set('departments', form.departments.includes(d) ? form.departments.filter(x => x !== d) : [...form.departments, d]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) { setErr('Images must be 4 MB or smaller.'); return; }
    set('images', [...form.images, URL.createObjectURL(file)]);
  };

  const canNext = () => {
    if (step === 0) return !!form.listing_type && !!form.category;
    if (step === 1) return form.title.trim().length > 3 && form.description.trim().length > 10;
    return true;
  };

  const submit = async () => {
    setBusy(true); setErr('');
    try {
      const saved = window.localStorage.getItem('discord_user');
      const user = saved ? JSON.parse(saved) : null;
      const payload = {
        ...form, price: parseFloat(form.price) || 0, status: 'active',
        seller_name: user?.username || user?.name || 'Creator',
        seller_id: user?.id || 'guest',
        codes: form.codes.filter(c => c.trim()),
      };
      const rec = await localDb.entities.Listing.create(payload);
      if (!rec?.id) throw new Error('Save failed — no ID returned');
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (e) {
      setErr(e.message || 'Could not publish. Please try again.');
    } finally { setBusy(false); }
  };

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <CheckCircle2 style={{ height: 64, width: 64, margin: '0 auto 16px', color: '#10b981' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>Listing Published!</h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Redirecting to your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <SiteNav />
      <div style={S.wrap}>
        <Link to="/marketplace" style={S.back}><ArrowLeft style={{ height: 14, width: 14 }} /> Back to Marketplace</Link>
        <h1 style={S.h1}>Publish an ER:LC Asset</h1>
        <p style={S.sub}>Upload your liveries, uniform sets, ELS profiles, or map templates.</p>

        {/* Stepper */}
        <div style={S.stepper}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={S.stepCircle(i === step, i < step)}>{i < step ? '✓' : i + 1}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: i === step ? 'white' : '#6b7280' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={S.stepLine(i < step)} />}
            </React.Fragment>
          ))}
        </div>

        {/* Error */}
        {err && (
          <div style={S.err}>
            <AlertCircle style={{ height: 16, width: 16, color: '#f87171', flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: '#fca5a5', flex: 1 }}>{err}</p>
            <button onClick={() => setErr('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ height: 16, width: 16, color: '#f87171' }} /></button>
          </div>
        )}

        {/* ── STEP 0: Format ── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <p style={S.sectionTitle}>Listing Format</p>
              <p style={S.sectionSub}>What type of product are you releasing?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => set('listing_type', t.id)} style={S.cardBtn(form.listing_type === t.id)}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: form.listing_type === t.id ? '#10b981' : 'white', marginBottom: 4 }}>{t.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ ...S.sectionTitle, marginBottom: 12 }}>Asset Category</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map(c => <button key={c} onClick={() => set('category', c)} style={S.pillBtn(form.category === c)}>{c}</button>)}
              </div>
            </div>
            <div>
              <p style={{ ...S.sectionTitle, marginBottom: 12 }}>Departments</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DEPTS.map(d => <button key={d} onClick={() => toggleDept(d)} style={S.pillBtn(form.departments.includes(d))}>{d}</button>)}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Details ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={S.label}>Listing Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. River City Police Ghost Fleet Pack" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5} placeholder="Describe your asset — vehicle models, livery details, what's included..." style={{ ...S.input, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={S.label}>Price Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Free', 'Robux'].map(pt => (
                    <button key={pt} onClick={() => set('price_type', pt)} style={{ flex: 1, borderRadius: 12, border: form.price_type === pt ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.07)', background: form.price_type === pt ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', padding: 10, fontSize: '0.75rem', fontWeight: 600, color: form.price_type === pt ? '#10b981' : '#9ca3af', cursor: 'pointer', transition: 'all 0.15s' }}>{pt}</button>
                  ))}
                </div>
              </div>
              {form.price_type === 'Robux' && (
                <div>
                  <label style={S.label}>Price (R$)</label>
                  <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="150" style={S.input} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Media ── */}
        {step === 2 && (
          <div>
            <p style={S.sectionTitle}>Preview Images</p>
            <p style={S.sectionSub}>Upload screenshots of your asset. Max 4 MB per image.</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); e.target.value = ''; }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {form.images.map((src, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => set('images', form.images.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 6, right: 6, height: 20, width: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.75)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X style={{ height: 12, width: 12, color: 'white' }} />
                  </button>
                </div>
              ))}
              {form.images.length < 6 && (
                <button onClick={() => fileRef.current && fileRef.current.click()} style={{ aspectRatio: '16/9', borderRadius: 12, border: '2px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#6b7280', transition: 'all 0.15s' }}>
                  <ImageIcon style={{ height: 24, width: 24 }} />
                  <span style={{ fontSize: '0.7rem' }}>Add image</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Codes ── */}
        {step === 3 && (
          <div>
            <p style={S.sectionTitle}>Delivery Codes</p>
            <p style={S.sectionSub}>Enter Roblox Asset ID, Pastebin URL, or Drive link. Vault-locked until purchase.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.codes.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input value={c} onChange={e => { const nc = [...form.codes]; nc[i] = e.target.value; set('codes', nc); }} placeholder={`Code ${i + 1} — rbxassetid://12345678 or URL`} style={{ ...S.input, flex: 1 }} />
                  {form.codes.length > 1 && (
                    <button onClick={() => set('codes', form.codes.filter((_, j) => j !== i))} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', cursor: 'pointer' }}>
                      <X style={{ height: 16, width: 16, color: '#6b7280' }} />
                    </button>
                  )}
                </div>
              ))}
              {form.codes.length < 10 && (
                <button onClick={() => set('codes', [...form.codes, ''])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, color: '#10b981', textAlign: 'left', marginTop: 4 }}>+ Add another code</button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 4: Review ── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ ...S.sectionTitle, marginBottom: 8 }}>Review & Publish</p>
            {[
              ['Format', form.listing_type], ['Category', form.category],
              ['Departments', form.departments.join(', ') || 'None'],
              ['Title', form.title],
              ['Price', form.price_type === 'Free' ? 'Free' : `R$${form.price}`],
              ['Images', `${form.images.length} uploaded`],
              ['Codes', `${form.codes.filter(c => c.trim()).length} entered`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '12px 16px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>{val || '—'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <div style={S.navRow}>
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} style={S.backBtn(step === 0)}>
            <ArrowLeft style={{ height: 14, width: 14 }} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => { if (canNext()) { setErr(''); setStep(step + 1); } else setErr('Please complete all required fields first.'); }} style={S.nextBtn(false)}>
              Next Step <ArrowRight style={{ height: 14, width: 14 }} />
            </button>
          ) : (
            <button onClick={submit} disabled={busy} style={S.nextBtn(busy)}>
              {busy ? 'Publishing…' : 'Publish Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
