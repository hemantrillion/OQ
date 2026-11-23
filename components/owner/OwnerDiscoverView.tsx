'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/booking-types';
import { OwnerBlueprintView } from './OwnerBlueprintView';
import { Sparkles, TrendingUp, Zap, Clock, ShieldCheck, Check } from 'lucide-react';

interface Props {
  language: Language;
}

interface RecommendationItem {
  id: string;
  category: string;
  categoryHindi: string;
  title: string;
  titleHindi: string;
  impact: string;
  impactHindi: string;
  description: string;
  descriptionHindi: string;
  actionText: string;
  actionTextHindi: string;
  applied?: boolean;
}

export const OwnerDiscoverView: React.FC<Props> = ({ language }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([
    {
      id: 'rec_1',
      category: 'CAPACITY & SLOTS',
      categoryHindi: 'क्षमता एवं समय स्लॉट',
      title: 'Peak Rush Hour Buffer Strategy',
      titleHindi: 'उच्च मांग समय बफर रणनीति',
      impact: '+24% Throughput',
      impactHindi: '+24% क्षमता सुधार',
      description:
        'Weekend evening slots (4:00 PM – 7:30 PM) exhibit 100% capacity utilization. Add a 10-minute turnaround buffer or activate auxiliary station Chair 3 to prevent queue overflow.',
      descriptionHindi:
        'सप्ताहांत शाम (4:00 PM – 7:30 PM) के स्लॉट 100% भर चुके हैं। कतार रोकने हेतु 10 मिनट का बफर समय जोड़ें या अतिरिक्त कुर्सी 3 चालू करें।',
      actionText: 'Apply Capacity Strategy',
      actionTextHindi: 'रणनीति लागू करें',
    },
    {
      id: 'rec_2',
      category: 'REVENUE OPTIMIZATION',
      categoryHindi: 'आय वृद्धि विश्लेषण',
      title: 'Promote Executive Grooming Combo',
      titleHindi: 'प्रीमियम ग्रूमिंग पैकेज प्रचारित करें',
      impact: '+₹450 Avg Order Value',
      impactHindi: '+₹450 औसत टिकट',
      description:
        'Complete Executive Grooming packages generate 48% higher margin than single haircut bookings. Pin as the primary highlighted recommendation on Customer Portal.',
      descriptionHindi:
        'संपूर्ण ग्रूमिंग पैकेज एकल सेवाओं की तुलना में 48% अधिक मुनाफा देता है। इसे ग्राहक पोर्टल पर शीर्ष स्थान पर दिखाएं।',
      actionText: 'Pin to Customer Portal',
      actionTextHindi: 'पोर्टल पर पिन करें',
    },
    {
      id: 'rec_3',
      category: 'OFF-PEAK OCCUPANCY',
      categoryHindi: 'खाली समय में ग्राहक वृद्धि',
      title: 'Dynamic Morning Slot Incentives',
      titleHindi: 'सुबह के समय स्लॉट हेतु विशेष दरें',
      impact: 'Fill 35% Open Seats',
      impactHindi: '35% खाली सीटें भरें',
      description:
        'Weekday mornings before 11:30 AM have available seating capacity. Implement automated 15% off-peak tariff to balance customer footfall evenly across day.',
      descriptionHindi:
        'सुबह 11:30 बजे से पहले के समय में सीटें खाली रहती हैं। कार्य दिवसों में समान ग्राहक प्रवाह हेतु 15% की छूट दर लागू करें।',
      actionText: 'Activate Off-Peak Pricing',
      actionTextHindi: 'छूट दर सक्रिय करें',
    },
    {
      id: 'rec_4',
      category: 'AUTOMATION & RETENTION',
      categoryHindi: 'स्वचालन एवं ग्राहक संतुष्टि',
      title: 'Instant Cancellation Waitlist Backfill',
      titleHindi: 'रद्दीकरण पर तुरंत सीट आवंटन',
      impact: '0% Waste on Cancellations',
      impactHindi: 'शून्य सीट बर्बादी',
      description:
        'Whenever an appointment is paused or cancelled, automatically alert waitlisted repeat clients in the same geographic radius with 1-click booking links.',
      descriptionHindi:
        'जब भी कोई बुकिंग रद्द हो, उसी क्षेत्र के प्रतीक्षा सूची वाले ग्राहकों को एक-क्लिक बुकिंग लिंक के साथ स्वतः सूचना भेजें।',
      actionText: 'Enable Auto-Backfill',
      actionTextHindi: 'स्वचालित सूचना चालू करें',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'APPLIED'>('ALL');

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, applied: !rec.applied } : rec))
    );
  };

  const filteredRecs = recommendations.filter((r) => {
    if (activeFilter === 'ACTIVE') return !r.applied;
    if (activeFilter === 'APPLIED') return !!r.applied;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-10 max-w-7xl mx-auto w-full select-none text-white">
      {/* 1. DISCOVER TOP BANNER */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {language === 'hi' ? 'ऑपरेटर' : 'Operator'}
            </h1>
          </div>
        </div>

        {/* Filter Pills for Recommendations */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10 shrink-0">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeFilter === 'ALL'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'सभी सुझाव' : 'All Insights'}
          </button>
          <button
            onClick={() => setActiveFilter('ACTIVE')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeFilter === 'ACTIVE'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'सक्रिय' : 'Actionable'}
          </button>
          <button
            onClick={() => setActiveFilter('APPLIED')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeFilter === 'APPLIED'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'लागू किए गए' : 'Implemented'}
          </button>
        </div>
      </section>

      {/* 2. OPERATIONAL RECOMMENDATIONS SUITE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs">
              {language === 'hi' ? 'स्मार्ट व्यावसायिक सुझाव' : 'Operational Recommendations'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {recommendations.filter((r) => r.applied).length} / {recommendations.length}{' '}
            {language === 'hi' ? 'लागू' : 'Implemented'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className={`display-card rounded-3xl p-6 lg:p-7 border flex flex-col justify-between gap-6 transition-all ${
                rec.applied
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/10 hover:border-sky-400/40 bg-white/5'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                    {language === 'hi' ? rec.categoryHindi : rec.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      rec.applied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 text-slate-200 border border-white/10'
                    }`}
                  >
                    {language === 'hi' ? rec.impactHindi : rec.impact}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {language === 'hi' ? rec.titleHindi : rec.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === 'hi' ? rec.descriptionHindi : rec.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{language === 'hi' ? 'वास्तविक समय डेटा से उत्पन्न' : 'Derived from live traffic'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyRecommendation(rec.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                    rec.applied
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                  }`}
                >
                  {rec.applied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{language === 'hi' ? 'सक्रिय है' : 'Active & Applied'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{language === 'hi' ? rec.actionTextHindi : rec.actionText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RELATIONAL ARCHITECTURE GRAPH SECTION */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2 pb-1">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs">
            {language === 'hi' ? 'डेटाबेस संरचना एवं एंटिटी रिलेशनल ग्राफ' : 'Data Architecture & Relational Graph'}
          </h2>
        </div>

        <div className="display-canvas rounded-3xl p-6 lg:p-8 border border-white/10">
          <OwnerBlueprintView language={language} />
        </div>
      </section>
    </div>
  );
};
