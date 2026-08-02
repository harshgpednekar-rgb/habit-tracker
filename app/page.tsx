'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

// 1. We define a strict TypeScript interface so Next.js knows exactly what a "Habit" is
interface Habit {
  id: string;
  name: string;
}

const pieData = [ { name: 'Completed', value: 75 }, { name: 'Remaining', value: 25 } ];
const pieColors = ['#3b82f6', '#e5e7eb'];

const barData = [
  { day: 'Mon', habits: 3 }, { day: 'Tue', habits: 4 }, { day: 'Wed', habits: 2 },
  { day: 'Thu', habits: 5 }, { day: 'Fri', habits: 3 }, { day: 'Sat', habits: 6 }, { day: 'Sun', habits: 4 },
];

export default function Dashboard() {
  // 2. We replace "any" with our specific "Habit" type
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 3. We move the fetch function INSIDE the useEffect to satisfy ESLint
    const fetchHabits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); 
        return;
      }
      
      const { data } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (data) setHabits(data as Habit[]);
    };

    fetchHabits();
  }, [router]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('habits')
      .insert([{ name: newHabitName, user_id: user.id }])
      .select();
    
    if (data) {
      setHabits([...habits, data[0] as Habit]);
      setNewHabitName('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-8">
      
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Habit Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400">Stay consistent, achieve your goals.</p>
        </div>
        <button onClick={handleLogout} className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          Log Out
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col items-center justify-center min-h-[250px]">
          <h3 className="text-lg font-semibold w-full text-left">Goal Completion</h3>
          <div className="w-full h-48 mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-500">75%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow md:col-span-2 min-h-[250px]">
          <h3 className="text-lg font-semibold mb-4">Weekly Momentum</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="habits" fill="#3b82f6" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Daily Habits</h3>
          
          <form onSubmit={handleAddHabit} className="flex gap-2">
            <input 
              type="text" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="E.g., Read 10 pages" 
              className="px-3 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition">
              + Add
            </button>
          </form>
        </div>
        
        <div className="min-w-[600px]">
          <div className="grid grid-cols-8 gap-2 mb-4 text-center text-sm font-medium text-gray-500 border-b pb-2">
            <div className="text-left">Habit Name</div>
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>
          
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No habits yet. Add one above!</p>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="grid grid-cols-8 gap-2 items-center mb-4 py-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition">
                <div className="font-medium text-blue-500 px-2">{habit.name}</div>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={`${habit.id}-${day}`} className="flex justify-center">
                    <input type="checkbox" className="w-5 h-5 accent-blue-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </section>
      
    </div>
  );
}