import { useState, useEffect } from 'react';
import { Save, Store, Clock } from 'lucide-react';
import { restaurantService } from '../../../services/api';
import type { RestaurantInfo, HoursJson, DayHours } from '../../../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const RestaurantSettings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'hours'>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // General Info State
  const [info, setInfo] = useState<Partial<RestaurantInfo>>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
  });

  // Hours State
  const [hours, setHours] = useState<HoursJson>({
    monday: { open: '09:00', close: '22:00' },
    tuesday: { open: '09:00', close: '22:00' },
    wednesday: { open: '09:00', close: '22:00' },
    thursday: { open: '09:00', close: '22:00' },
    friday: { open: '09:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '21:00' },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await restaurantService.getInfo();
        setInfo({
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website || '',
          instagram: data.instagram || '',
        });
        if (data.hoursJson) {
          setHours(data.hoursJson);
        }
      } catch (error) {
        toast.error('Failed to load restaurant settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await restaurantService.updateInfo(info);
      toast.success('Restaurant information updated');
    } catch (error) {
      toast.error('Failed to update information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHoursSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await restaurantService.updateInfo({ hoursJson: hours });
      toast.success('Opening hours updated');
    } catch (error) {
      toast.error('Failed to update hours');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHourChange = (day: string, field: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof HoursJson],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return <div className="animate-pulse bg-bg-card border border-border rounded-xl h-96"></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Restaurant Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage public-facing information and operating hours.</p>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-gold text-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            <Store size={18} /> General Information
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'hours'
                ? 'border-b-2 border-gold text-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
          >
            <Clock size={18} /> Opening Hours
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Restaurant Name"
                  value={info.name || ''}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={info.email || ''}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  value={info.phone || ''}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  required
                />
                <Input
                  label="Website URL (Optional)"
                  type="url"
                  value={info.website || ''}
                  onChange={(e) => setInfo({ ...info, website: e.target.value })}
                />
                <Input
                  label="Instagram Handle (Optional)"
                  value={info.instagram || ''}
                  onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                  placeholder="e.g., @labistro"
                  className="md:col-span-2"
                />
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Address</label>
                  <textarea
                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold resize-none"
                    rows={2}
                    value={info.address || ''}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Description</label>
                  <textarea
                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold resize-none"
                    rows={4}
                    value={info.description || ''}
                    onChange={(e) => setInfo({ ...info, description: e.target.value })}
                    required
                  />
                  <p className="text-xs text-text-muted">This appears in the About section of the homepage.</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-end">
                <Button type="submit" isLoading={isSaving} className="min-w-[140px]">
                  <Save size={18} className="mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'hours' && (
            <form onSubmit={handleHoursSubmit} className="space-y-6 max-w-2xl">
              <p className="text-text-secondary text-sm mb-6">
                Set your regular opening and closing times. If you are closed on a specific day, set both times to exactly "00:00" or leave them blank.
              </p>
              
              <div className="space-y-4">
                {DAYS.map((day) => {
                  const dayData = hours[day as keyof HoursJson] as DayHours;
                  return (
                    <div key={day} className="flex items-center gap-4 p-4 rounded-lg bg-bg-elevated border border-border">
                      <div className="w-32 font-medium capitalize text-text-primary">
                        {day}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <Input
                          type="time"
                          value={dayData?.open || ''}
                          onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                          className="w-full"
                        />
                        <span className="text-text-muted">to</span>
                        <Input
                          type="time"
                          value={dayData?.close || ''}
                          onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <Button type="submit" isLoading={isSaving} className="min-w-[140px]">
                  <Save size={18} className="mr-2" /> Save Hours
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettings;
