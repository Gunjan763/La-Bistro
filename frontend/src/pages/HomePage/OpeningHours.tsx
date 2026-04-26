import { useEffect, useState } from 'react';
import { restaurantService } from '../../services/api';
import type { FormattedHours } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const OpeningHours = () => {
  const [hours, setHours] = useState<FormattedHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHours = () => {
    setLoading(true);
    setError(null);
    restaurantService
      .getHours()
      .then(setHours)
      .catch((err) => setError(err.message || 'Failed to load hours'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHours();
  }, []);

  const todayIndex = new Date().getDay();
  // Convert JS day (0=Sun) to our order (0=Mon)
  const todayKey = dayOrder[todayIndex === 0 ? 6 : todayIndex - 1];

  const groupHours = () => {
    if (!hours) return [];
    
    const groups: { days: string[]; label: string; open: string; close: string; isClosed: boolean; isToday: boolean }[] = [];
    let currentGroup: any = null;

    for (const day of dayOrder) {
      const dayHours = hours.hoursJson[day as keyof typeof hours.hoursJson];
      const isClosed = !dayHours;
      const open = dayHours ? formatTime(dayHours.open) : '';
      const close = dayHours ? formatTime(dayHours.close) : '';
      
      if (!currentGroup) {
        currentGroup = { days: [day], open, close, isClosed, isToday: day === todayKey };
      } else {
        if (currentGroup.open === open && currentGroup.close === close && currentGroup.isClosed === isClosed) {
          currentGroup.days.push(day);
          if (day === todayKey) currentGroup.isToday = true;
        } else {
          groups.push(currentGroup);
          currentGroup = { days: [day], open, close, isClosed, isToday: day === todayKey };
        }
      }
    }
    if (currentGroup) groups.push(currentGroup);

    return groups.map(g => {
      let label = '';
      if (g.days.length === 1) {
        label = dayLabels[g.days[0]];
      } else if (g.days.length === 2 && dayOrder.indexOf(g.days[1]) - dayOrder.indexOf(g.days[0]) === 1) {
        label = `${dayLabels[g.days[0]]} & ${dayLabels[g.days[1]]}`;
      } else if (g.days.length > 2) {
        label = `${dayLabels[g.days[0]]} – ${dayLabels[g.days[g.days.length - 1]]}`;
      } else {
         label = g.days.map((d: string) => dayLabels[d]).join(', ');
      }
      return { ...g, label };
    });
  };

  const groupedHours = groupHours();

  return (
    <section id="hours" className="section-padding px-6 md:px-8 bg-bg-secondary relative overflow-hidden">
      {/* Subtle bg accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.015] rounded-full blur-3xl" />

      <div className="container-layout px-6 md:px-8 max-w-4xl mx-auto relative z-10">
        <SectionHeading
          subtitle="Plan Your Visit"
          title="Opening Hours"
        />

        {loading && <LoadingSpinner text="Loading hours..." />}
        {error && <ErrorMessage message={error} onRetry={fetchHours} />}

        {!loading && !error && hours && (
          <div className="animate-fade-in-up mt-12">
            {/* Status badge */}
            <div className="flex justify-center mb-16">
              <div
                className={`inline-flex items-center gap-4 px-8 py-4 rounded-full border shadow-lg ${
                  hours.isOpen
                    ? 'border-emerald-500/40 bg-emerald-500/15'
                    : 'border-red-500/40 bg-red-500/15'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${hours.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <span className={`text-base font-bold tracking-widest uppercase ${hours.isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                  {hours.status}
                </span>
              </div>
            </div>

            {/* Hours Table */}
            <div className="bg-bg-card border border-border rounded-3xl overflow-hidden max-w-3xl mx-auto shadow-[0_8px_40px_rgb(0,0,0,0.5)]">
              {groupedHours.map((group, i) => (
                <div
                  key={group.label}
                  className={`flex items-center justify-between px-8 md:px-12 py-6 md:py-8 transition-colors duration-300 ${
                    group.isToday
                      ? 'bg-gold/[0.08] border-l-4 border-l-gold'
                      : 'border-l-4 border-l-transparent hover:bg-bg-elevated/60'
                  } ${i < groupedHours.length - 1 ? 'border-b border-border/80' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {group.isToday && (
                      <span className="text-xs font-bold tracking-widest uppercase text-gold bg-gold/15 px-3 py-1 rounded-full">
                        Today
                      </span>
                    )}
                    <span
                      className={`text-base md:text-xl font-semibold tracking-wide ${
                        group.isToday ? 'text-gold' : 'text-text-primary'
                      }`}
                    >
                      {group.label}
                    </span>
                  </div>
                  <span
                    className={`text-base md:text-xl font-body tabular-nums tracking-wide ${
                      group.isToday ? 'text-gold font-bold' : 'text-text-secondary font-medium'
                    }`}
                  >
                    {group.isClosed ? 'Closed' : `${group.open} — ${group.close}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Additional info */}
            {hours.isOpen && hours.timeUntilClose && (
              <p className="text-center text-text-muted text-sm md:text-base mt-8 tracking-wider font-medium">
                Closes in approximately {hours.timeUntilClose}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OpeningHours;
