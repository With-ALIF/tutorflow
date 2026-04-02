import React from "react";
import { Student } from "../../../types/student";
import { Phone, MapPin, Calendar, CreditCard, CheckCircle2 } from "lucide-react";

export const ProfileCard = ({ student }: { student: Student }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
    <div className="h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />
    </div>
    <div className="px-8 pb-8">
      <div className="-mt-16 mb-6 relative">
        <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl">
          {student.photo ? (
            <img src={student.photo} alt={student.name} className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl font-bold text-slate-400 dark:text-slate-500">
              {student.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{student.name}</h2>
      <div className="flex items-center gap-2 mt-1">
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-widest">Class {student.class}</span>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest">{student.subject || 'No Subject'}</span>
        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-100 dark:border-slate-700 mt-8">
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Phone</p>
            <a 
              href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '').replace(/^0/, '880')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {student.phone}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Address</p>
            <p className="font-bold text-slate-700 dark:text-slate-300">{student.address || 'Not Provided'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 group">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Joined On</p>
            <p className="font-bold text-slate-700 dark:text-slate-300">{new Date(student.join_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Monthly Fee</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">৳{student.monthly_fee}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
