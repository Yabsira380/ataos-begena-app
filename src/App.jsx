import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Home, UserPlus, CheckSquare, CreditCard, Users, CheckCircle, XCircle,
  Camera, User, Sparkles, Send, Loader2, ChevronDown, Clock, Banknote,
  Trash2, AlertTriangle, Info, Printer, X, Copy, Search, BookOpen,
  Church, PhoneCall, FileText, Music, Quote, Award, GraduationCap, Check, UserMinus,
  Calendar, Shield, AlertCircle, Edit, Save, ListMusic, Plus, MessageSquareText, History,
  Package, ShoppingCart, Tag, TrendingUp, Archive, PlusCircle, MinusCircle, Box
} from 'lucide-react';

// --- Supabase Client Initialization ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ethiopianMonths = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];

// --- Ethiopian Real-time Date Calculation Function ---
const getEthiopianDate = (date = new Date()) => {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const isGregLeap = (gYear % 4 === 0 && gYear % 100 !== 0) || (gYear % 400 === 0);
  const gMonthDays = [0, 31, isGregLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  let dayOfYear = gDay;
  for (let i = 1; i < gMonth; i++) dayOfYear += gMonthDays[i];

  const sept11Day = isGregLeap ? 255 : 254;

  let eYear, eMonthIdx, eDay;

  if (dayOfYear >= sept11Day) {
    eYear = gYear - 7;
    const diff = dayOfYear - sept11Day;
    eMonthIdx = Math.floor(diff / 30);
    eDay = (diff % 30) + 1;
  } else {
    eYear = gYear - 8;
    const prevLeap = ((gYear - 1) % 4 === 0 && (gYear - 1) % 100 !== 0) || ((gYear - 1) % 400 === 0);
    const prevYearDays = prevLeap ? 366 : 365;
    const prevSept11 = prevLeap ? 255 : 254;
    const diff = (prevYearDays - prevSept11) + dayOfYear;
    eMonthIdx = Math.floor(diff / 30);
    eDay = (diff % 30) + 1;
  }

  if (eMonthIdx > 12) eMonthIdx = 12;

  return {
    year: String(eYear),
    month: ethiopianMonths[eMonthIdx] || 'መስከረም',
    day: eDay
  };
};

const formatEthDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const eth = getEthiopianDate(d);
  return `${eth.month} ${eth.day}፣ ${eth.year}`;
};

const getTodayString = () => {
  const eatTime = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
  return eatTime.toISOString().split('T')[0];
};

// ---------------- የክፍያ ወር እና የመመዝገቢያ ወር ማወዳደሪያ ----------------
const isEligibleForPaymentPeriod = (regDateStr, selYearStr, selMonthStr) => {
  if (!regDateStr) return true;
  const regDate = new Date(regDateStr);
  if (isNaN(regDate.getTime())) return true;
  const regEth = getEthiopianDate(regDate);
  
  const regYear = parseInt(regEth.year, 10);
  const selYear = parseInt(selYearStr, 10);
  
  if (selYear < regYear) return false;
  if (selYear > regYear) return true;
  
  const regMonthIndex = ethiopianMonths.indexOf(regEth.month);
  const selMonthIndex = ethiopianMonths.indexOf(selMonthStr);
  
  return selMonthIndex >= regMonthIndex;
};

// --- የመሳሪያ ስሞችን ወደ አሬይ (Array) የሚቀይር አጋዥ ፈንክሽን ---
const parseInstruments = (instData) => {
  if (!instData) return ['በገና'];
  if (Array.isArray(instData)) return instData.length > 0 ? instData : ['በገና'];
  return String(instData).split(',').map(s => s.trim()).filter(Boolean);
};

// ---------------- ማዕከላዊ የክፍያ ማሽን ----------------
const todayEthGlobal = getEthiopianDate();

const getDueDayForMonth = (student, cY, cMIdx, inst) => {
    let regYear = 0;
    let regMonthIdx = 0;
    let regDay = 1;

    // ለስሌቱ የመሳሪያውን የጀመረበትን ቀን ይጠቀማል (ከሌለ አጠቃላይ የምዝገባ ቀኑን)
    const instStartDate = student.paymentDetails?.[inst]?.startDate || student.registrationDate;

    if (instStartDate) {
        const eth = getEthiopianDate(new Date(instStartDate));
        regYear = parseInt(eth.year, 10);
        regMonthIdx = ethiopianMonths.indexOf(eth.month);
        regDay = parseInt(eth.day, 10);
    }

    if (cY === regYear && cMIdx === regMonthIdx) {
        return regDay;
    } else {
        const instDate = student.paymentDetails?.[inst]?.date;
        if (instDate && instDate !== '') {
            return parseInt(instDate, 10);
        } else {
            return regDay < 30 ? regDay + 1 : 1;
        }
    }
};

const getPaymentStatus = (student, targetYearStr, targetMonthStr, inst) => {
    const tY = parseInt(todayEthGlobal.year, 10);
    const tMIdx = ethiopianMonths.indexOf(todayEthGlobal.month);
    const tDay = parseInt(todayEthGlobal.day, 10);

    const cY = parseInt(targetYearStr, 10);
    const cMIdx = ethiopianMonths.indexOf(targetMonthStr);

    const instStartDate = student.paymentDetails?.[inst]?.startDate || student.registrationDate;

    // የመሳሪያውን የጀመረበትን ቀን ተጠቅሞ ታሪኩ መታየት እንዳለበት ያረጋግጣል
    if (!isEligibleForPaymentPeriod(instStartDate, targetYearStr, targetMonthStr)) {
        return 'NOT_ELIGIBLE';
    }

    const key = `${targetYearStr}_${targetMonthStr}_${inst}`;
    const legacyKey = `${targetYearStr}_${targetMonthStr}`; 
    
    let isPaid = false;
    if (student.payments) {
        if (student.payments[key] !== undefined) {
            isPaid = student.payments[key];
        } else if (student.payments[legacyKey] !== undefined) {
            isPaid = student.payments[legacyKey];
        }
    }

    if (isPaid) {
        return 'PAID';
    }
    
    if (student.paymentDetails?.[inst]?.isFree || (Number(student.paymentAmount || 0) === 0 && !student.paymentDetails?.[inst])) {
        return 'SCHOLARSHIP';
    }

    const dueDay = getDueDayForMonth(student, cY, cMIdx, inst);

    if (cY > tY || (cY === tY && cMIdx > tMIdx)) {
        return 'FUTURE_NOT_DUE';
    }

    if (cY === tY && cMIdx === tMIdx) {
        if (tDay < dueDay) {
            return 'CURRENT_NOT_DUE';
        } else {
            return 'UNPAID';
        }
    }

    return 'UNPAID';
};

const calculateTotalAmount = (details) => {
  if (!details) return 0;
  return Object.values(details).reduce((sum, item) => sum + (item.isFree ? 0 : Number(item.amount || 0)), 0);
};

const getEarliestDate = (details) => {
  if (!details) return '';
  const dates = Object.values(details).map(item => Number(item.date)).filter(d => !isNaN(d) && d > 0);
  return dates.length > 0 ? Math.min(...dates).toString() : '';
};

const uploadPhotoToStorage = async (dataUrl, identifier) => {
  if (!dataUrl || !dataUrl.startsWith('data:image')) return dataUrl;
  try {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], {type: mime});
    const fileName = `photo_${identifier}_${Date.now()}.jpg`;

    const { data, error } = await supabase.storage.from('student-photos').upload(fileName, blob, { upsert: true });
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from('student-photos').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Photo upload error:", err);
    return '';
  }
};

// --- Custom Spiritual Icons & SVG ---
const EthiopianCross = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 45 10 L 55 10 L 55 35 L 80 35 L 80 45 L 55 45 L 55 55 L 70 55 L 70 65 L 55 65 L 55 85 L 65 85 L 65 95 L 35 95 L 35 85 L 45 85 L 45 65 L 30 65 L 30 55 L 45 55 L 45 45 L 20 45 L 20 35 L 45 35 Z" />
    <circle cx="50" cy="50" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BegenaIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
    <path d="M 30 20 L 70 20 L 63 85 L 37 85 Z" strokeWidth="4" />
    <path d="M 38 20 L 38 85 M 46 20 L 46 85 M 54 20 L 54 85 M 62 20 L 62 85" strokeWidth="1.5" strokeDasharray="1,2" />
    <path d="M 30 32 L 70 32 M 34 75 L 66 75" strokeWidth="2.5" />
  </svg>
);

const AxumObelisk = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 46 90 L 48 15 L 46 15 L 46 10 L 54 10 L 54 15 L 52 15 L 54 90 Z" />
    <rect x="48" y="22" width="4" height="3" fill="none" stroke="background" strokeWidth="1" />
    <rect x="48" y="35" width="4" height="3" fill="none" stroke="background" strokeWidth="1" />
    <rect x="48" y="48" width="4" height="3" fill="none" stroke="background" strokeWidth="1" />
    <rect x="48" y="61" width="4" height="3" fill="none" stroke="background" strokeWidth="1" />
    <rect x="48" y="74" width="4" height="3" fill="none" stroke="background" strokeWidth="1" />
  </svg>
);

const WatermarkBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-center justify-center overflow-hidden z-0">
    <div className="grid grid-cols-2 gap-20 transform rotate-12">
      <EthiopianCross className="w-48 h-48 text-[#8B5A2B]" />
      <BegenaIcon className="w-48 h-48 text-[#8B5A2B]" />
      <AxumObelisk className="w-48 h-48 text-[#8B5A2B]" />
      <EthiopianCross className="w-48 h-48 text-[#8B5A2B]" />
    </div>
  </div>
);

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          width = MAX_WIDTH;
          height = img.height * scaleSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
    };
  });
};

const LoadingSplash = ({ message }) => (
  <div className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <WatermarkBackground />
    <div className="relative flex items-center justify-center mb-6 z-10">
      <div className="absolute w-28 h-28 bg-[#D4AF37]/25 rounded-full animate-ping" />
      <div className="w-24 h-24 bg-gradient-to-br from-[#5C4033] via-[#8B5A2B] to-[#3E2723] rounded-3xl flex items-center justify-center text-[#D4AF37] shadow-2xl border-2 border-[#D4AF37] relative z-10 animate-pulse">
        <EthiopianCross className="w-14 h-14" />
      </div>
    </div>
    <div className="text-center z-10 mb-6">
      <h2 className="text-2xl font-black text-[#3E2723] font-serif mb-1 tracking-wide">
        አታኦስ በገና ማሰልጠኛ
      </h2>
      <p className="text-xs text-[#8B5A2B] font-bold animate-pulse flex items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#8B5A2B]" size={14} />
        <span>{message}</span>
      </p>
    </div>
    <div className="w-52 h-1.5 bg-[#EADDCA] rounded-full overflow-hidden mb-8 shadow-inner z-10 border border-[#D2B48C]/40">
      <div className="h-full bg-gradient-to-r from-[#8B5A2B] via-[#D4AF37] to-[#8B5A2B] w-full animate-pulse" />
    </div>
    <div className="bg-[#FAF3E0]/80 backdrop-blur-sm p-4 rounded-2xl border border-[#D2B48C] max-w-xs text-center shadow-sm z-10">
      <p className="text-[11px] text-[#5C4033] italic font-serif leading-relaxed">
        «በበገናም አመስግኑት፤ አሥር አሦር ባለው በበገና ዘምሩለት»
      </p>
      <span className="block text-[9px] font-extrabold text-[#8B5A2B] mt-1">
        — መዝሙረ ዳዊት 33:2
      </span>
    </div>
  </div>
);

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [academicViewType, setAcademicViewType] = useState('active');

  const ethiopianYears = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'];
  const instrumentsList = ['በገና', 'ክራር', 'ከበሮ', 'ማሲንቆ', 'ዋሽንት'];

  const [selectedYear, setSelectedYear] = useState(todayEthGlobal.year);
  const [selectedMonth, setSelectedMonth] = useState(todayEthGlobal.month);
  const [selectedDay, setSelectedDay] = useState(todayEthGlobal.day);
  const currentPeriodKey = `${selectedYear}_${selectedMonth}`;

  const [attendanceFilter, setAttendanceFilter] = useState('all'); 
  const [paymentFilter, setPaymentFilter] = useState('all'); 

  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [infoSearch, setInfoSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, title: 'የውሳኔ ማረጋገጫ', message: '', onConfirm: () => {} });

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [historyInstTab, setHistoryInstTab] = useState(null);

  const [editStudentNoState, setEditStudentNoState] = useState({ isEditing: false, value: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const [selectedLessonInstrument, setSelectedLessonInstrument] = useState('በገና');
  const [isEditingLesson, setIsEditingLesson] = useState(null);
  const [editLessonForm, setEditLessonForm] = useState({ title: '', content: '' });

  const [tempScores, setTempScores] = useState({});
  const [kignitScores, setKignitScores] = useState({});
  
  const [reportConfig, setReportConfig] = useState({
    show: false,
    type: 'general',
    statusFilter: 'all'
  });

  // Inventory & Sales States
  const [inventory, setInventory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [inventoryFilter, setInventoryFilter] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');
  
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({ name: '', category: 'መሳሪያዎች', quantity: '', price: '' });
  const [editingInventory, setEditingInventory] = useState(null);
  
  const [sellModalData, setSellModalData] = useState(null); 
  const [restockModalData, setRestockModalData] = useState(null);
  const [isSalesHistoryOpen, setIsSalesHistoryOpen] = useState(false);

  const initialStudentState = {
    name: '', christianName: '', phone: '', emergencyContactName: '', emergencyContactPhone: '',
    workStatus: 'ተማሪ', churchService: '', parish: '', 
    instrumentType: ['በገና'], 
    paymentDetails: { 'በገና': { amount: '', date: '', startDate: getTodayString(), isFree: false, status: 'active', duration: '3 ወር' } },
    chosenDay: '', chosenTime: '', photo: '', status: 'active', examResult: '',
    registrationDate: getTodayString()
  };
  const [newStudent, setNewStudent] = useState(initialStudentState);

  const getUnpaidMonthsInfo = (student) => {
    const unpaidDetails = [];
    let totalArrears = 0;
    const insts = parseInstruments(student.instrumentType);
    
    for (const inst of insts) {
        if (student.paymentDetails?.[inst]?.isFree) continue;
        const amt = Number(student.paymentDetails?.[inst]?.amount || student.paymentAmount || 0);
        if (amt <= 0) continue;

        const instStartDate = student.paymentDetails?.[inst]?.startDate || student.registrationDate;
        
        let instUnpaidCount = 0;
        for (const y of ethiopianYears) {
            for (const m of ethiopianMonths) {
                if (!isEligibleForPaymentPeriod(instStartDate, y, m)) continue;

                const status = getPaymentStatus(student, y, m, inst);
                if (status === 'UNPAID') {
                    unpaidDetails.push(`${y}_${m}_${inst}`);
                    instUnpaidCount++;
                }
            }
        }
        totalArrears += (instUnpaidCount * amt);
    }
    return { unpaidKeys: unpaidDetails, totalArrears };
  };

  useEffect(() => {
    let mounted = true;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setAuthLoading(false);
        if (session) {
          fetchStudents();
          fetchLessons();
          fetchInventory();
          fetchSalesHistory();
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN' && session) {
        fetchStudents();
        fetchLessons();
        fetchInventory();
        fetchSalesHistory();
      } else if (event === 'SIGNED_OUT') {
        setStudents([]);
        setLessons([]);
        setInventory([]);
        setSalesHistory([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').select('*').order('id', { ascending: true });
      if (error) throw error;

      const mappedData = data.map(s => ({
        id: s.id,
        studentNo: s.student_no,
        name: s.name,
        christianName: s.christian_name,
        phone: s.phone,
        emergencyContactName: s.emergency_contact_name,
        emergencyContactPhone: s.emergency_contact_phone,
        workStatus: s.work_status,
        churchService: s.church_service,
        parish: s.parish,
        instrumentType: s.instrument_type,
        duration: s.duration, 
        chosenDay: s.chosen_day,
        chosenTime: s.chosen_time,
        paymentAmount: s.payment_amount,
        paymentDate: s.payment_date,
        paymentDetails: s.payment_details || {},
        photo: s.photo,
        status: s.status,
        examResult: s.exam_result,
        registrationDate: s.registration_date,
        payments: s.payments || {},
        attendance: s.attendance || {},
        lesson_progress: s.lesson_progress || {},
        kignit_scores: s.kignit_scores || {} 
      }));
      setStudents(mappedData);

      const initialKignit = {};
      mappedData.forEach(s => {
         if (s.kignit_scores) initialKignit[s.id] = s.kignit_scores;
      });
      setKignitScores(initialKignit);

    } catch (err) {
      showNotification('የተማሪ መረጃዎችን ለማምጣት አልተቻለም!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase.from('lessons').select('*').order('id', { ascending: true });
      if (!error && data) setLessons(data);
    } catch (err) { console.error("Lessons fetch error:", err); }
  };

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase.from('inventory').select('*').order('id', { ascending: true });
      if (!error && data) setInventory(data);
    } catch (err) { console.error("Inventory fetch error:", err); }
  };

  const fetchSalesHistory = async () => {
    try {
      const { data, error } = await supabase.from('sales_history').select('*').order('id', { ascending: false });
      if (!error && data) setSalesHistory(data);
    } catch (err) { console.error("Sales History fetch error:", err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showNotification('እንኳን በደህና መጡ መምህር!', 'success');
    } catch (err) {
      setAuthError('የተሳሳተ ኢሜይል ወይም የይለፍ ቃል አስገብተዋል። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    triggerConfirmation('ከአታኦስ በገና መተግበሪያ መውጣት (Logout) ይፈልጋሉ?', 'የመውጫ ማረጋገጫ', async () => {
        await supabase.auth.signOut();
        setStudents([]);
        showNotification('በተሳካ ሁኔታ ወጥተዋል!', 'success');
    });
  };

  const updateStudentInDb = async (studentId, updatedFields) => {
    try {
      const { error } = await supabase.from('students').update(updatedFields).eq('id', studentId);
      if (error) {
        showNotification(`የዳታቤዝ ስህተት: ${error.message}`, 'error');
        return false;
      }
      await fetchStudents();
      return true;
    } catch (err) {
      showNotification('ማስተካከያው አልተሳካም! ዳታቤዝ ላይ kignit_scores ኮለም መኖሩን ያረጋግጡ።', 'error');
      return false;
    }
  };

  const triggerConfirmation = (message, title, onConfirm) => {
    setConfirmModal({
      show: true, title: title || 'የውሳኔ ማረጋገጫ ሰነድ', message,
      onConfirm: () => { onConfirm(); setConfirmModal(prev => ({ ...prev, show: false })); }
    });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
  };

  const generateNextStudentNo = () => {
    if (!students || students.length === 0) return '001';
    const maxNo = Math.max(...students.map(s => parseInt(s.studentNo || '0', 10)).filter(n => !isNaN(n)));
    return String(maxNo === -Infinity ? 1 : maxNo + 1).padStart(3, '0');
  };

  const startEditingProfile = (student) => {
    const insts = parseInstruments(student.instrumentType);
    const pDetails = student.paymentDetails || {};
    insts.forEach(i => {
       if (!pDetails[i]) pDetails[i] = { amount: '', date: '', startDate: student.registrationDate || getTodayString(), isFree: false, status: 'active', duration: student.duration || '3 ወር' };
    });

    setEditFormData({
      name: student.name,
      christian_name: student.christianName || '',
      phone: student.phone || '',
      emergency_contact_name: student.emergencyContactName || '',
      emergency_contact_phone: student.emergencyContactPhone || '',
      work_status: student.workStatus || 'ተማሪ',
      church_service: student.churchService || '',
      parish: student.parish || '',
      instrument_type: insts,
      paymentDetails: pDetails,
      chosen_day: student.chosenDay || '',
      chosen_time: student.chosenTime || '',
      registration_date: student.registrationDate || ''
    });
    setIsEditingProfile(true);
  };

  const saveProfileChanges = async (studentId) => {
    if (!editFormData.name || !editFormData.phone) {
      showNotification("እባክዎ ሙሉ ስም እና ስልክ ቁጥር መሙላቶን ያረጋግጡ!", "error");
      return;
    }
    triggerConfirmation('የተማሪውን መረጃ በእርግጥ ማስተካከል (Save) ይፈልጋሉ?', 'መረጃ ማስተካከያ', async () => {
      const payload = { 
        name: editFormData.name,
        christian_name: editFormData.christian_name,
        phone: editFormData.phone,
        emergency_contact_name: editFormData.emergency_contact_name,
        emergency_contact_phone: editFormData.emergency_contact_phone,
        work_status: editFormData.work_status,
        church_service: editFormData.church_service,
        parish: editFormData.parish,
        instrument_type: Array.isArray(editFormData.instrument_type) ? editFormData.instrument_type.join(', ') : editFormData.instrument_type,
        chosen_day: editFormData.chosen_day,
        chosen_time: editFormData.chosen_time,
        payment_details: editFormData.paymentDetails,
        payment_amount: calculateTotalAmount(editFormData.paymentDetails),
        payment_date: getEarliestDate(editFormData.paymentDetails),
        registration_date: editFormData.registration_date 
      };
      
      const success = await updateStudentInDb(studentId, payload);
      if (success) {
        showNotification('የተማሪው መረጃ በተሳካ ሁኔታ ተስተካክሏል!', 'success');
        setIsEditingProfile(false);
      }
    });
  };

  const handleStudentNoSave = async (student) => {
    let newNo = editStudentNoState.value.trim();
    if (!newNo) { showNotification("እባክዎ ትክክለኛ መለያ ቁጥር ያስገቡ", "error"); return; }
    if (/^\d+$/.test(newNo)) newNo = String(parseInt(newNo, 10)).padStart(3, '0');
    if (newNo === student.studentNo) { setEditStudentNoState({ isEditing: false, value: '' }); return; }
    triggerConfirmation(`የተማሪውን መለያ ቁጥር ከ #${student.studentNo} ወደ #${newNo} ለመቀየር እርግጠኛ ነዎት?`, 'የመለያ ቁጥር ማስተካከያ', async () => {
        const success = await updateStudentInDb(student.id, { student_no: newNo });
        if (success) {
          setSelectedStudentProfile(prev => prev ? { ...prev, studentNo: newNo } : null);
          showNotification("መለያ ቁጥሩ በተሳካ ሁኔታ ተስተካክሏል!", "success");
          setEditStudentNoState({ isEditing: false, value: '' });
        }
    });
  };

  const handleProfilePhotoChange = async (e, student) => {
    const file = e.target.files[0];
    if (!file) return;
    triggerConfirmation(`የተማሪውን ፎቶ በአዲሱ ፎቶ ለመቀየር (Edit) እርግጠኛ ነዎት?`, 'የፎቶ ማስተካከያ', async () => {
        showNotification('ፎቶ በመጭመቅ እና በመጫን ላይ...', 'success');
        const compressedImage = await compressImage(file);
        const photoUrl = await uploadPhotoToStorage(compressedImage, student.studentNo);
        const success = await updateStudentInDb(student.id, { photo: photoUrl });
        if (success) {
          setSelectedStudentProfile(prev => prev ? { ...prev, photo: photoUrl } : null);
          showNotification("ፎቶው ተቀይሮ ተቀምጧል!", "success");
        }
    });
  };

  const handleProfilePhotoRemove = async (student) => {
    triggerConfirmation(`የተማሪውን ፎቶ ሙሉ በሙሉ ለማጥፋት (Remove) እርግጠኛ ነዎት?`, 'ፎቶ ማጥፊያ', async () => {
        const success = await updateStudentInDb(student.id, { photo: '' });
        if (success) {
          setSelectedStudentProfile(prev => prev ? { ...prev, photo: '' } : null);
          showNotification("ፎቶው በተሳካ ሁኔታ ተሰርዟል! አሁን የአፑ ፍጥነት ይስተካከላል።", "success");
        }
    });
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone) return;

    triggerConfirmation(`አዲስ ተማሪ "${newStudent.name}" ለመመዝገብ መረጃው ትክክል መሆኑን ያረጋግጣሉ?`, 'የተማሪ ምዝገባ ማረጋገጫ', async () => {
        const nextNo = generateNextStudentNo();
        
        let finalPhotoUrl = '';
        if (newStudent.photo && newStudent.photo.startsWith('data:image')) {
            showNotification('ፎቶ ወደ ዳታቤዝ እየተጫነ ነው፣ እባክዎ ይጠብቁ...', 'success');
            finalPhotoUrl = await uploadPhotoToStorage(newStudent.photo, nextNo);
        } else {
            finalPhotoUrl = newStudent.photo;
        }

        const studentToInsert = {
          student_no: nextNo, name: newStudent.name, christian_name: newStudent.christianName, phone: newStudent.phone,
          emergency_contact_name: newStudent.emergencyContactName, emergency_contact_phone: newStudent.emergencyContactPhone,
          work_status: newStudent.workStatus, church_service: newStudent.churchService, parish: newStudent.parish,
          instrument_type: Array.isArray(newStudent.instrumentType) ? newStudent.instrumentType.join(', ') : newStudent.instrumentType,
          chosen_day: newStudent.chosenDay, chosen_time: newStudent.chosenTime,
          payment_details: newStudent.paymentDetails,
          payment_amount: calculateTotalAmount(newStudent.paymentDetails),
          payment_date: getEarliestDate(newStudent.paymentDetails),
          photo: finalPhotoUrl, status: 'active', exam_result: '',
          registration_date: newStudent.registrationDate, payments: {}, attendance: {}, lesson_progress: {}
        };
        const { error } = await supabase.from('students').insert([studentToInsert]);
        if (error) { showNotification('ምዝገባው አልተሳካም! እባክዎ እንደገና ይሞክሩ።', 'error');
        } else {
          showNotification(`ተማሪው በመለያ ቁጥር ${nextNo} በተሳካ ሁኔታ ተመዝግቧል!`, 'success');
          setNewStudent(initialStudentState);
          fetchStudents();
        }
    });
  };

  const askToDeleteStudent = (student) => {
    triggerConfirmation(`ተማሪ "${student.name}" (መ.ቁ: #${student.studentNo}) ከማሰልጠኛ ተቋሙ ሙሉ በሙሉ እንዲሰረዝ ይፈልጋሉ? ይህ ድርጊት ወደኋላ ሊመለስ አይችልም።`, 'የተማሪ ስረዛ ማረጋገጫ', async () => {
        const { error } = await supabase.from('students').delete().eq('id', student.id);
        if (error) { showNotification('ስረዛው አልተሳካም!', 'error');
        } else {
          showNotification(`${student.name} ከዝርዝር ተሰርዟል።`, 'success');
          fetchStudents();
          if (selectedStudentProfile?.id === student.id) {
            setSelectedStudentProfile(null); setEditStudentNoState({ isEditing: false, value: '' }); setIsEditingProfile(false);
          }
        }
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      showNotification('ፎቶ በመጭመቅ ላይ...', 'success');
      const compressedImage = await compressImage(file);
      setNewStudent({ ...newStudent, photo: compressedImage });
    }
  };

  const toggleAttendanceForDay = async (studentId, periodKey, day) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const updatedAttendance = { ...student.attendance };
    const periodAttendance = { ...(updatedAttendance[periodKey] || {}) };
    periodAttendance[day] = !periodAttendance[day];
    updatedAttendance[periodKey] = periodAttendance;

    const success = await updateStudentInDb(studentId, { attendance: updatedAttendance });
    if (success && selectedStudentProfile?.id === studentId) {
      setSelectedStudentProfile(prev => ({ ...prev, attendance: updatedAttendance }));
    }
  };

  const handleToggleAttendanceWithConfirm = (student, periodKey, day) => {
    const isPresent = student.attendance?.[periodKey]?.[day] || false;
    const dateText = `${selectedMonth} ${day} ቀን`;
    const actionText = isPresent ? 'አልተገኘም (Absent)' : 'ተገኝቷል (Present)';
    triggerConfirmation(`የተማሪ "${student.name}" የዕለት መገኘት በ ${dateText} ወደ "${actionText}" እንዲቀየር ይፈልጋሉ?`, 'የመገኘት ማስተካከያ', () => {
        toggleAttendanceForDay(student.id, periodKey, day); showNotification(`የ ${student.name} መገኘት ተስተካክሏል።`, 'success');
    });
  };

  const handleCalendarDayClick = (student, day) => {
    const isPresent = student.attendance?.[currentPeriodKey]?.[day] || false;
    const nextStateAmharic = isPresent ? 'እንዳልመጣ (በማቅረት)' : 'እንደመጣ (በመገኘት)';
    triggerConfirmation(`በ ${selectedMonth} ቀን ${day} ተማሪ "${student.name}" ${nextStateAmharic} እንዲመዘገብ ያረጋግጣሉ?`, 'የቀን መቁጠሪያ አቴንዳንስ ማስተካከያ', () => {
        toggleAttendanceForDay(student.id, currentPeriodKey, day); showNotification(`አቴንዳንሱ ተስተካክሏል።`, 'success');
    });
  };

  const handleTogglePaymentWithConfirm = (student, basePeriodKey, inst) => {
    const key = `${basePeriodKey}_${inst}`;
    const legacyKey = basePeriodKey;
    
    let isPaid = false;
    if (student.payments) {
        if (student.payments[key] !== undefined) {
            isPaid = student.payments[key];
        } else if (student.payments[legacyKey] !== undefined) {
            isPaid = student.payments[legacyKey];
        }
    }
    
    const actionText = isPaid ? 'አልከፈለም' : 'ከፍሏል';
    const updatedPayments = { ...student.payments, [key]: !isPaid };
    
    triggerConfirmation(`የተማሪ "${student.name}" የ ${inst} ክፍያ ሁኔታ ወደ "${actionText}" እንዲቀየር ይፈልጋሉ?`, 'የክፍያ ማረጋገጫ ሰነድ', async () => {
        const success = await updateStudentInDb(student.id, { payments: updatedPayments });
        if (success) { showNotification(`የ ${inst} ክፍያ ሁኔታ ተስተካክሏል።`, 'success'); }
    });
  };

  const setInstrumentStatusWithConfirm = (student, inst, newStatus) => {
    let statusAmharic = '';
    if (newStatus === 'completed') statusAmharic = 'ትምህርቱን ያጠናቀቀ (ምሩቅ)';
    else if (newStatus === 'dropped') statusAmharic = 'ትምህርቱን ያቋረጠ';
    else statusAmharic = 'በመማር ላይ ያለ (Active)';
    
    triggerConfirmation(`የተማሪ "${student.name}" የ ${inst} ትምህርት ሁኔታ ወደ "${statusAmharic}" እንዲለወጥ ይፈልጋሉ?`, 'የትምህርት ደረጃ ለውጥ', async () => {
        const updatedDetails = { ...student.paymentDetails };
        if (!updatedDetails[inst]) updatedDetails[inst] = { amount: '', date: '', startDate: student.registrationDate, isFree: false, duration: '3 ወር' };
        updatedDetails[inst].status = newStatus;

        const allInsts = parseInstruments(student.instrumentType);
        let allCompleted = true;
        let allDropped = true;
        allInsts.forEach(i => {
            const st = updatedDetails[i]?.status || 'active';
            if (st !== 'completed') allCompleted = false;
            if (st !== 'dropped') allDropped = false;
        });
        
        let globalStatus = 'active';
        if (allCompleted) globalStatus = 'completed';
        else if (allDropped) globalStatus = 'dropped';

        const success = await updateStudentInDb(student.id, { payment_details: updatedDetails, status: globalStatus });
        if (success) {
          if (newStatus === 'completed') showNotification(`ተማሪው የ ${inst} ትምህርቱን ማጠናቀቁ ተመዝግቧል!`, 'success');
          else if (newStatus === 'dropped') showNotification(`ተማሪው የ ${inst} ትምህርቱን ማቋረጡ ተመዝግቧል!`, 'success');
          else showNotification(`ተማሪው ወደ ${inst} ትምህርት ገበታ ተመልሷል!`, 'success');
        }
    });
  };

  const handleExamScoreSubmit = (studentId, score, kignitData = null) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    triggerConfirmation(`የተማሪ "${student.name}" የፈተና ውጤት መዝገብ ዳታቤዝ ላይ እንዲቀመጥ ይፈልጋሉ?`, 'የፈተና ውጤት ማረጋገጫ', async () => {
        const payload = { exam_result: score };
        if (kignitData) payload.kignit_scores = kignitData;
        const success = await updateStudentInDb(studentId, payload);
        if (success) showNotification('ውጤቱ በተሳካ ሁኔታ ተመዝግቧል!', 'success');
    });
  };

  const toggleStudentLessonProgress = async (student, lessonId) => {
    const currentProgress = { ...(student.lesson_progress || {}) };
    currentProgress[lessonId] = !currentProgress[lessonId]; 
    const success = await updateStudentInDb(student.id, { lesson_progress: currentProgress });
    if (success && selectedStudentProfile?.id === student.id) {
      setSelectedStudentProfile(prev => ({ ...prev, lesson_progress: currentProgress }));
      showNotification('የትምህርት ደረጃ ተስተካክሏል', 'success');
    }
  };

  const addLesson = async () => {
    const newLesson = { instrument: selectedLessonInstrument, title: 'አዲስ የትምህርት ርዕስ', content: 'ስለ ትምህርቱ አጭር ማብራሪያ እዚህ ይጻፉ...' };
    const { data, error } = await supabase.from('lessons').insert([newLesson]).select();
    if (!error && data) { setLessons([...lessons, ...data]); showNotification('አዲስ ትምህርት ታክሏል!', 'success'); }
  };

  const updateLesson = async (id) => {
    const { error } = await supabase.from('lessons').update(editLessonForm).eq('id', id);
    if (!error) { setIsEditingLesson(null); fetchLessons(); showNotification('ትምህርቱ ተስተካክሏል!', 'success'); }
  };

  const deleteLesson = async (id) => {
    triggerConfirmation('ይህንን ትምህርት ሙሉ በሙሉ ለማጥፋት እርግጠኛ ነዎት?', 'ትምህርት ማጥፊያ', async () => {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (!error) { setLessons(lessons.filter(l => l.id !== id)); showNotification('ትምህርቱ ተሰርዟል!', 'success'); }
    });
  };

  // --- INVENTORY FUNCTIONS ---
  const handleSaveInventory = async (e) => {
    e.preventDefault();
    if (!inventoryForm.name || !inventoryForm.price) {
        showNotification('እባክዎ የዕቃውን ስም እና ዋጋ ያስገቡ!', 'error');
        return;
    }

    triggerConfirmation(editingInventory ? 'ይህን የንብረት መረጃ ማስተካከል ይፈልጋሉ?' : 'ይህን አዲስ ንብረት ወደ ክምችት ማስገባት ይፈልጋሉ?', 'የንብረት ማረጋገጫ', async () => {
        const payload = {
            name: inventoryForm.name,
            category: inventoryForm.category,
            quantity: parseInt(inventoryForm.quantity || 0, 10),
            price: parseFloat(inventoryForm.price || 0)
        };

        try {
            if (editingInventory) {
                const { error } = await supabase.from('inventory').update(payload).eq('id', editingInventory.id);
                if (error) throw error;
                showNotification('የንብረት መረጃው በተሳካ ሁኔታ ተስተካክሏል!', 'success');
            } else {
                const { error } = await supabase.from('inventory').insert([payload]);
                if (error) throw error;
                showNotification('አዲሱ ንብረት በተሳካ ሁኔታ ተመዝግቧል!', 'success');
            }
            setIsAddInventoryOpen(false);
            setEditingInventory(null);
            setInventoryForm({ name: '', category: 'መሳሪያዎች', quantity: '', price: '' });
            fetchInventory();
        } catch (error) {
            showNotification('ይቅርታ፣ ዳታቤዝ ላይ "inventory" ቴብል መኖሩን ያረጋግጡ!', 'error');
        }
    });
  };

  const handleDeleteInventory = (item) => {
    triggerConfirmation(`ዕቃ "${item.name}" ከንብረት መዝገብ ላይ ሙሉ በሙሉ እንዲሰረዝ ይፈልጋሉ?`, 'ንብረት መሰረዣ', async () => {
        try {
            const { error } = await supabase.from('inventory').delete().eq('id', item.id);
            if (error) throw error;
            showNotification('ንብረቱ ከመዝገብ ላይ ተሰርዟል!', 'success');
            fetchInventory();
        } catch (err) {
            showNotification('መሰረዝ አልተቻለም!', 'error');
        }
    });
  };

  const handleSellConfirm = async (e) => {
    e.preventDefault();
    if (!sellModalData || !sellModalData.sellQty) return;
    const sellQty = parseInt(sellModalData.sellQty, 10);
    if (sellQty <= 0) { showNotification("ትክክለኛ ብዛት ያስገቡ!", "error"); return; }
    if (sellQty > sellModalData.item.quantity) {
        showNotification("በክምችት ካለው በላይ መሸጥ አይቻልም!", "error"); return;
    }
    
    const newQty = sellModalData.item.quantity - sellQty;
    const totalPrice = sellQty * sellModalData.item.price;
    
    triggerConfirmation(`በእርግጥ ${sellQty} ${sellModalData.item.name} በ ${totalPrice} ብር ለመሸጥ አረጋግጠዋል?`, 'የሽያጭ ማረጋገጫ', async () => {
        try {
            const { error: invError } = await supabase.from('inventory').update({ quantity: newQty }).eq('id', sellModalData.item.id);
            if (invError) throw invError;
            
            const { error: saleError } = await supabase.from('sales_history').insert([{
                item_name: sellModalData.item.name,
                category: sellModalData.item.category,
                quantity: sellQty,
                total_price: totalPrice,
                date: getTodayString()
            }]);
            if (saleError) throw saleError;
            
            showNotification('ሽያጩ በተሳካ ሁኔታ ተመዝግቧል!', 'success');
            setSellModalData(null);
            fetchInventory();
            fetchSalesHistory();
        } catch (err) {
            showNotification('ሽያጭ መመዝገብ አልተቻለም! የ sales_history ቴብል መኖሩን ያረጋግጡ።', 'error');
        }
    });
  };

  const handleRestockConfirm = async (e) => {
    e.preventDefault();
    if (!restockModalData || !restockModalData.addQty) return;
    const addQty = parseInt(restockModalData.addQty, 10);
    if (addQty <= 0) { showNotification("ትክክለኛ ብዛት ያስገቡ!", "error"); return; }
    
    const newQty = restockModalData.item.quantity + addQty;
    
    triggerConfirmation(`በእርግጥ ${addQty} አዲስ የ ${restockModalData.item.name} ክምችት ገቢ ለማድረግ አረጋግጠዋል?`, 'ክምችት መጨመሪያ', async () => {
        try {
            const { error } = await supabase.from('inventory').update({ quantity: newQty }).eq('id', restockModalData.item.id);
            if (error) throw error;
            showNotification('ክምችቱ በተሳካ ሁኔታ ታክሏል!', 'success');
            setRestockModalData(null);
            fetchInventory();
        } catch (err) {
            showNotification('ክምችት መጨመር አልተቻለም!', 'error');
        }
    });
  };

  const triggerWindowPrint = () => window.print();

  const askAI = async (e) => {
    e?.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true); setAiResponse('');
    const userQuestion = aiQuery; setAiQuery('');
    
    const summarizedStudents = students.map(s => {
      const info = getUnpaidMonthsInfo(s);
      return {
          name: s.name,
          studentNo: s.studentNo,
          status: s.status,
          instruments: s.instrumentType,
          arrearsMonths: info.unpaidKeys.length,
          totalArrears: info.totalArrears
      };
    });

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `አንተ የ 'አታኦስ መንፈሳዊ የዜማ ማሰልጠኛ ተቋም' የበገና እና የዜማ መምህር የሆንክ የላቀ AI ረዳት ነህ። ተማሪዎችን በትህትና እና በመንፈሳዊ ስነ-ምግባር አገልግል። የተማሪዎች አጠቃላይ መረጃ (የተጨመቀ)፦ ${JSON.stringify(summarizedStudents)}`;

    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nየተማሪው ጥያቄ፦ ${userQuestion}` }] }] }) });
      const data = await res.json();
      if (data.error) setAiResponse(`የስህተት መልእክት፦ ${data.error.message}`);
      else setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "ይቅርታ መምህር፣ ጥያቄዎን በሚገባ ማስተዋል አልቻልኩም።");
    } catch (error) { setAiResponse("ይቅርታ መምህር፣ ከበይነመረብ (Internet) ጋር መገናኘት አልተቻለም።"); } finally { setIsAiLoading(false); }
  };

  const copyReportToClipboard = () => showNotification('ሪፖርቱ በፅሁፍ ኮፒ ተደርጓል!', 'success');

  // --- COMPUTATIONS ---
  const activeStudents = students.filter(s => s.status === 'active');
  
  const totalPaidCurrentMonth = activeStudents.filter(s => {
      const insts = parseInstruments(s.instrumentType);
      return insts.every(inst => {
          const status = getPaymentStatus(s, selectedYear, selectedMonth, inst);
          return status === 'PAID' || status === 'SCHOLARSHIP' || status === 'CURRENT_NOT_DUE' || status === 'FUTURE_NOT_DUE';
      });
  }).length;
  
  const totalUnpaidCurrentMonth = activeStudents.filter(s => {
      const insts = parseInstruments(s.instrumentType);
      return insts.some(inst => {
          const status = getPaymentStatus(s, selectedYear, selectedMonth, inst);
          return status === 'UNPAID';
      });
  }).length;
  
  const totalRevenueExpected = activeStudents.reduce((sum, s) => {
      const insts = parseInstruments(s.instrumentType);
      return sum + insts.reduce((instSum, inst) => instSum + (s.paymentDetails?.[inst]?.isFree ? 0 : Number(s.paymentDetails?.[inst]?.amount || s.paymentAmount || 0)), 0);
  }, 0);
  
  const totalRevenueCollected = activeStudents.reduce((sum, s) => {
      const insts = parseInstruments(s.instrumentType);
      return sum + insts.reduce((instSum, inst) => {
          const status = getPaymentStatus(s, selectedYear, selectedMonth, inst);
          if (status === 'PAID') return instSum + Number(s.paymentDetails?.[inst]?.amount || s.paymentAmount || 0);
          return instSum;
      }, 0);
  }, 0);
  
  const overdueList = activeStudents.map(student => {
    const info = getUnpaidMonthsInfo(student);
    if (info.unpaidKeys.length > 0) return { ...student, ...info };
    return null;
  }).filter(Boolean);
  const overdueUnpaidCount = overdueList.length;

  const completedStudentsCount = students.filter(s => s.status === 'completed').length;
  const droppedStudentsCount = students.filter(s => s.status === 'dropped').length;
  const totalActive = activeStudents.length;
  const totalPresentToday = activeStudents.filter(s => s.attendance?.[currentPeriodKey]?.[selectedDay]).length;

  // Inventory Computations
  const totalInventoryStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItemsCount = inventory.filter(item => item.quantity < 5).length;
  const totalSalesRevenue = salesHistory.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0);

  // --- Views Renders ---
  
  const renderPaymentHistoryModal = () => {
    if (!selectedStudentForHistory) return null;
    const student = students.find(s => s.id === selectedStudentForHistory.id) || selectedStudentForHistory;
    const insts = parseInstruments(student.instrumentType);
    const activeInst = historyInstTab && insts.includes(historyInstTab) ? historyInstTab : insts[0];
    const instStartDate = student.paymentDetails?.[activeInst]?.startDate || student.registrationDate;
    
    const historyList = [];
    const tYInt = parseInt(todayEthGlobal.year, 10);
    const tMIdx = ethiopianMonths.indexOf(todayEthGlobal.month);

    for (const y of ethiopianYears) {
      for (const m of ethiopianMonths) {
        if (isEligibleForPaymentPeriod(instStartDate, y, m)) {
          const yInt = parseInt(y, 10);
          const mIdx = ethiopianMonths.indexOf(m);
          
          if (yInt < tYInt || (yInt === tYInt && mIdx <= tMIdx + 1)) {
             const status = getPaymentStatus(student, y, m, activeInst);
             const exactDueDay = getDueDayForMonth(student, yInt, mIdx, activeInst);
             historyList.push({ year: y, month: m, key: `${y}_${m}`, status, exactDueDay });
          }
        }
      }
    }
    historyList.reverse();

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[250] animate-fade-in">
        <div className="bg-[#FAF3E0] rounded-[32px] w-full max-w-md max-h-[85vh] flex flex-col border-2 border-[#D2B48C] shadow-2xl relative overflow-hidden">
          
          <div className="bg-gradient-to-r from-[#3E2723] to-[#5C4033] text-white p-4 flex items-center justify-between border-b-4 border-[#D4AF37] relative z-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-[#D4AF37] p-1.5 rounded-lg"><History size={18} className="text-[#3E2723]" /></div>
              <div>
                <h3 className="font-extrabold text-sm font-serif text-[#FFF8E7]">የክፍያ ታሪክ ማስተካከያ</h3>
                <p className="text-[10px] text-gray-300 font-bold">{student.name} (#{student.studentNo})</p>
              </div>
            </div>
            <button onClick={() => { setSelectedStudentForHistory(null); setHistoryInstTab(null); }} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors"><X size={18} /></button>
          </div>

          <div className="bg-white border-b border-[#EADDCA] p-2 flex gap-2 overflow-x-auto hide-scrollbar flex-shrink-0">
             {insts.map(inst => (
                <button key={inst} onClick={() => setHistoryInstTab(inst)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${activeInst === inst ? 'bg-[#8B5A2B] text-white shadow-sm' : 'bg-gray-100 text-[#5C4033] hover:bg-gray-200'}`}>
                   የ {inst} ታሪክ
                </button>
             ))}
          </div>

          <div className="p-4 bg-amber-50/50 border-b border-[#EADDCA] flex-shrink-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-[#D2B48C] shadow-sm">
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5">የ {activeInst} የጀመረበት ቀን፦</span>
                <span className="font-black text-[#3E2723]">{formatEthDate(instStartDate)}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#D2B48C] shadow-sm">
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5">ወርሃዊ መክፈያ ቀን፦</span>
                <span className="font-black text-[#8B5A2B]">{student.paymentDetails?.[activeInst]?.date ? `በየወሩ ${student.paymentDetails[activeInst].date} ቀን` : `(ያልተሞላ)`}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-[#D2B48C] shadow-sm col-span-2 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold block">ወርሃዊ መዋጮ መጠን፦</span>
                <span className="font-black text-[#3E2723] text-sm">{student.paymentDetails?.[activeInst]?.isFree ? 'ነፃ' : `${student.paymentDetails?.[activeInst]?.amount || student.paymentAmount || 0} ብር`}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {historyList.map((item) => {
              const fullKey = `${item.key}_${activeInst}`;
              const legacyKey = item.key;
              
              let isPaid = false;
              if (student.payments) {
                  if (student.payments[fullKey] !== undefined) {
                      isPaid = student.payments[fullKey];
                  } else if (student.payments[legacyKey] !== undefined) {
                      isPaid = student.payments[legacyKey];
                  }
              }
              
              const statusColor = isPaid ? 'bg-green-100 text-[#2E7D32] border-green-400 hover:bg-green-200' :
                  (item.status === 'CURRENT_NOT_DUE' || item.status === 'FUTURE_NOT_DUE' ? 'bg-yellow-100 text-yellow-700 border-yellow-400 hover:bg-yellow-200' :
                  'bg-red-100 text-red-700 border-red-300 hover:bg-red-200');
                  
              const iconColor = isPaid ? 'bg-green-50 border-green-300 text-green-700' :
                  (item.status === 'CURRENT_NOT_DUE' || item.status === 'FUTURE_NOT_DUE' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                  'bg-red-50 border-red-300 text-red-700');
              
              return (
                <div key={item.key} className="bg-white rounded-2xl p-3 border-2 border-[#EADDCA] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 font-bold text-xs ${iconColor}`}>
                      {item.month.substring(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#3E2723] text-sm">{item.month} {item.year}</h4>
                      <p className="text-[9px] text-gray-500 font-bold mt-0.5">
                        {isPaid ? 'ተከፍሏል' : item.status === 'SCHOLARSHIP' ? 'ነፃ' : (item.status === 'CURRENT_NOT_DUE' || item.status === 'FUTURE_NOT_DUE' ? `ገና አልደረሰም (ቀን ${item.exactDueDay})` : `ዕዳ (ቀን ${item.exactDueDay})`)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                     {item.status === 'SCHOLARSHIP' ? (
                       <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black border border-blue-300">ነፃ</span>
                     ) : (
                       <button 
                         onClick={() => handleTogglePaymentWithConfirm(student, item.key, activeInst)}
                         className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all shadow-sm flex items-center gap-1 border ${statusColor}`}
                       >
                         {isPaid ? <><CheckCircle size={12}/> ከፍሏል</> : <><XCircle size={12}/> አልከፈለም</>}
                       </button>
                     )}
                  </div>
                </div>
              );
            })}
            {historyList.length === 0 && (
              <div className="text-center py-8 text-gray-400 font-bold text-xs">
                <p>የክፍያ ታሪክ የለም።</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLoginScreen = () => {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <WatermarkBackground />
        <div className="w-full max-w-md bg-[#FAF3E0] rounded-3xl p-6 sm:p-8 border-2 border-[#D2B48C] shadow-xl relative z-10 flex flex-col items-center">
          <div className="flex justify-center mb-3 text-[#8B5A2B]">
            <EthiopianCross className="w-14 h-14" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#3E2723] font-serif text-center mb-1">
            አታኦስ በገና ማሰልጠኛ
          </h2>
          <p className="text-xs text-[#8B5A2B] font-bold text-center mb-6">
            የአስተዳደር ክፍል መግቢያ በር
          </p>

          {authError && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-xs font-black text-[#3E2723] mb-1.5 ml-1">ኢሜይል (Email Address)</label>
              <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl border border-[#D2B48C] text-sm font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#3E2723] mb-1.5 ml-1">የይለፍ ቃል (Password)</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white rounded-xl border border-[#D2B48C] text-sm font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" />
            </div>
            <button type="submit" disabled={isSigningIn} className="w-full bg-gradient-to-r from-[#8B5A2B] via-[#4A2E12] to-[#5C4033] text-white font-black py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:border-[#D4AF37] border border-transparent transition-all active:scale-95 flex items-center justify-center gap-2 text-sm font-serif mt-6">
              {isSigningIn ? <><Loader2 size={18} className="animate-spin" /><span>በመግባት ላይ...</span></> : <><Shield size={18} /><span>ግባ (Sign In)</span></>}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderGlobalConfirmationModal = () => {
    if (!confirmModal.show) return null;
    return (
      <div className="fixed inset-0 bg-[#3E2723]/60 backdrop-blur-sm flex items-center justify-center p-4 z-[300] animate-fade-in">
        <div className="bg-[#FAF3E0] rounded-3xl p-6 w-full max-w-sm border-2 border-[#D2B48C] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-1 left-1 opacity-10"><EthiopianCross className="w-12 h-12 text-[#8B5A2B]" /></div>
          <h3 className="text-sm font-black text-[#8B5A2B] font-serif mb-2">{confirmModal.title}</h3>
          <p className="text-xs text-[#3E2723] leading-relaxed mb-6 font-bold">{confirmModal.message}</p>
          <div className="flex space-x-3">
            <button onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} className="flex-1 py-3 bg-white hover:bg-gray-100 text-[#8B5A2B] border-2 border-[#D2B48C] font-bold rounded-xl transition-all active:scale-95 text-xs shadow-sm">እመለሳለሁ (Cancel)</button>
            <button onClick={confirmModal.onConfirm} className="flex-1 py-3 bg-gradient-to-r from-[#8B5A2B] to-[#5C4033] hover:from-[#5C4033] hover:to-[#3E2723] text-white font-black rounded-xl transition-all active:scale-95 text-xs shadow-md">አረጋግጣለሁ (Confirm)</button>
          </div>
        </div>
      </div>
    );
  };

  const renderAiModal = () => {
    if (!isAiOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-[250] animate-fade-in">
        <div className="bg-[#FAF6EE] w-full max-w-md h-[85vh] sm:h-[80vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
          <div className="bg-gradient-to-r from-[#3E2723] to-[#5C4033] p-4 flex justify-between items-center text-white border-b-4 border-[#D4AF37]">
            <div className="flex items-center gap-2"><Sparkles size={20} className="text-[#D4AF37]" /><div><h3 className="font-extrabold text-sm font-serif">የመረጃ መንፈሳዊ ረዳት</h3><p className="text-[10px] text-gray-300">የሰው ሠራሽ አስተውሎት አጋዥ</p></div></div>
            <button onClick={() => setIsAiOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-[#FAF3E0] p-4 rounded-2xl border border-[#D2B48C] shadow-sm">
              <p className="text-xs text-[#5C4033] leading-relaxed font-bold text-center italic">በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን። ሰላም መምህር፣ እኔ ታማኝ የመረጃ ረዳትዎ ነኝ። ስለ ተማሪዎች ክትትል፣ ክፍያ፣ መጋዘን ዕቃዎች ጉዳዮች የፈለጉትን ይጠይቁኝ።</p>
            </div>
            {aiResponse && <div className="bg-white p-4 rounded-2xl border border-[#D2B48C] text-xs leading-relaxed text-[#3E2723] font-medium shadow-inner">{aiResponse}</div>}
            {isAiLoading && <div className="flex items-center justify-center gap-2 py-4"><Loader2 className="animate-spin text-[#8B5A2B]" size={20} /><span className="text-xs text-[#8B5A2B] font-bold">ምላሽ በማዘጋጀት ላይ...</span></div>}
          </div>
          <div className="p-4 bg-white border-t border-[#D2B48C]">
            <form onSubmit={askAI} className="relative">
              <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="ጥያቄዎን ለመጻፍ እዚህ ይንኩ..." className="w-full pl-5 pr-14 py-4 bg-[#FAF6EE] rounded-full border border-[#D2B48C] shadow-inner text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" />
              <button type="submit" disabled={isAiLoading || !aiQuery.trim()} className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-gradient-to-r from-[#8B5A2B] to-[#5C4033] text-white rounded-full flex items-center justify-center hover:scale-105 disabled:opacity-50 shadow-md transition-all"><Send size={14} /></button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderStudentProfileModal = () => {
    if (!selectedStudentProfile) return null;
    const student = selectedStudentProfile;
    const updatedStudentObj = students.find(s => s.id === student.id) || student;
    const daysInMonth = selectedMonth === 'ጳጉሜ' ? 6 : 30;
    const attendanceData = updatedStudentObj.attendance?.[currentPeriodKey] || {};
    const daysPresent = Object.values(attendanceData).filter(Boolean).length;
    
    // የተማሪውን መሳሪያዎች ለይቶ ማውጣት
    const studentInstruments = parseInstruments(updatedStudentObj.instrumentType);
    const studentArrearsInfo = getUnpaidMonthsInfo(updatedStudentObj);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[200] animate-fade-in">
        <div className="bg-[#FAF3E0] rounded-[32px] w-full max-w-md max-h-[85vh] overflow-y-auto border-2 border-[#D2B48C] shadow-2xl relative">
          <div className="sticky top-0 bg-gradient-to-r from-[#3E2723] to-[#5C4033] text-white p-4 flex items-center justify-between border-b-4 border-[#D4AF37] z-10">
            <div className="flex items-center space-x-3 w-full">
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-2xl bg-white/15 overflow-hidden border border-white/20 flex-shrink-0 relative">
                  {updatedStudentObj.photo ? <img src={updatedStudentObj.photo} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[#D4AF37]"><User size={24}/></div>}
                </div>
                {!isEditingProfile && (
                  <div className="flex gap-1">
                     <label className="cursor-pointer text-[#D4AF37] bg-white/10 hover:bg-white/20 p-1 rounded transition-colors" title="ፎቶ ቀይር"><Camera size={12} /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleProfilePhotoChange(e, updatedStudentObj)} /></label>
                     {updatedStudentObj.photo && <button onClick={() => handleProfilePhotoRemove(updatedStudentObj)} className="text-red-400 bg-white/10 hover:bg-white/20 p-1 rounded transition-colors" title="ፎቶ አጥፋ"><Trash2 size={12} /></button>}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-sm sm:text-base font-serif text-[#FFF8E7] truncate">{updatedStudentObj.name}</h3>
                <div className="text-[10px] text-gray-300 font-bold mt-0.5 flex flex-wrap items-center gap-1">
                  <span>ክ.ስ: {updatedStudentObj.christianName || '-'} | መ.ቁ: </span>
                  {editStudentNoState.isEditing ? (
                    <div className="flex items-center gap-1 bg-white/20 p-0.5 rounded">
                      <input type="text" value={editStudentNoState.value} onChange={e => setEditStudentNoState({...editStudentNoState, value: e.target.value})} className="text-[#3E2723] px-1 py-0.5 rounded w-14 text-[10px] font-black focus:outline-none" autoFocus/>
                      <button onClick={() => handleStudentNoSave(updatedStudentObj)} className="bg-green-600 hover:bg-green-500 text-white p-1 rounded transition-colors"><Check size={10}/></button>
                      <button onClick={() => setEditStudentNoState({isEditing: false, value: ''})} className="bg-red-600 hover:bg-red-500 text-white p-1 rounded transition-colors"><X size={10}/></button>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded border border-white/10">#{updatedStudentObj.studentNo} {!isEditingProfile && <button onClick={() => setEditStudentNoState({isEditing: true, value: updatedStudentObj.studentNo})} className="text-[#D4AF37] hover:text-white transition-colors ml-1"><Edit size={10}/></button>}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 self-start ml-2">
              {!isEditingProfile && <button onClick={() => startEditingProfile(updatedStudentObj)} className="p-1.5 bg-[#FAF3E0]/10 hover:bg-white/20 rounded-full text-[#D4AF37]"><Edit size={18} /></button>}
              <button onClick={() => { setSelectedStudentProfile(null); setEditStudentNoState({isEditing: false, value: ''}); setIsEditingProfile(false); }} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white"><X size={18} /></button>
            </div>
          </div>

          {isEditingProfile ? (
            <div className="p-5 bg-[#FAF6EE]">
              <h3 className="font-extrabold text-[#8B5A2B] border-b-2 border-dashed border-[#D2B48C] pb-2 mb-4 text-xs flex items-center"><Edit size={14} className="mr-1.5"/> የተማሪ መረጃ ማስተካከያ </h3>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 pb-2">
                <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">ሙሉ ስም <span className="text-red-500">*</span></label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})}/></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">የክርስትና ስም</label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.christian_name} onChange={e=>setEditFormData({...editFormData, christian_name: e.target.value})}/></div>
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">ስልክ ቁጥር <span className="text-red-500">*</span></label><input type="tel" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.phone} onChange={e=>setEditFormData({...editFormData, phone: e.target.value})}/></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">የቅርብ ተጠሪ ስም</label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.emergency_contact_name} onChange={e=>setEditFormData({...editFormData, emergency_contact_name: e.target.value})}/></div>
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">የቅርብ ተጠሪ ስልክ</label><input type="tel" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.emergency_contact_phone} onChange={e=>setEditFormData({...editFormData, emergency_contact_phone: e.target.value})}/></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">የመጡበት አጥቢያ</label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.parish} onChange={e=>setEditFormData({...editFormData, parish: e.target.value})}/></div>
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">አገልግሎት ክፍል</label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.church_service} onChange={e=>setEditFormData({...editFormData, church_service: e.target.value})}/></div>
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-[#5C4033] block mb-1">የመሳሪያ አይነት (ከአንድ በላይ መምረጥ ይቻላል)</label>
                  <div className="flex flex-wrap gap-2 border border-[#D2B48C] p-2 rounded-lg bg-white">
                    {instrumentsList.map(inst => (
                      <label key={inst} className="flex items-center space-x-1 text-xs font-bold text-[#3E2723] cursor-pointer">
                        <input 
                          type="checkbox" 
                          value={inst} 
                          checked={Array.isArray(editFormData.instrument_type) && editFormData.instrument_type.includes(inst)} 
                          onChange={(e) => {
                            let currentInsts = Array.isArray(editFormData.instrument_type) ? [...editFormData.instrument_type] : [];
                            let currentDetails = { ...editFormData.paymentDetails };

                            if (e.target.checked) {
                                currentInsts.push(inst);
                                if (!currentDetails[inst]) currentDetails[inst] = { amount: '', date: '', startDate: getTodayString(), isFree: false, status: 'active', duration: '3 ወር' };
                            } else {
                                currentInsts = currentInsts.filter(i => i !== inst);
                                delete currentDetails[inst];
                            }
                            if(currentInsts.length === 0) {
                                currentInsts.push('በገና');
                                if (!currentDetails['በገና']) currentDetails['በገና'] = { amount: '', date: '', startDate: getTodayString(), isFree: false, status: 'active', duration: '3 ወር' };
                            }

                            setEditFormData({...editFormData, instrument_type: currentInsts, paymentDetails: currentDetails});
                          }} 
                          className="accent-[#8B5A2B]"
                        />
                        <span>{inst}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">የመረጡት ቀን</label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.chosen_day} onChange={e=>setEditFormData({...editFormData, chosen_day: e.target.value})}/></div>
                  <div><label className="text-[10px] font-black text-[#5C4033] block mb-1">የመረጡት ሰዓት</label><input type="text" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.chosen_time} onChange={e=>setEditFormData({...editFormData, chosen_time: e.target.value})}/></div>
                </div>
                
                <div className="mt-2 border-t border-dashed border-[#D2B48C] pt-2">
                   <p className="text-[10px] font-black text-[#8B5A2B] mb-2">የእያንዳንዱ መሳሪያ ክፍያ መረጃ ማስተካከያ፡</p>
                   {editFormData.instrument_type.map(inst => (
                      <div key={inst} className="mb-2 p-2 bg-[#F9F6F0] rounded-lg border border-[#EADDCA]">
                         <div className="flex justify-between items-center mb-1.5">
                           <label className="text-[10px] font-bold text-[#5C4033]">የ {inst} መዋጮ (ብር)</label>
                           <label className="flex items-center space-x-1 text-[9px] font-black text-blue-700 cursor-pointer bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                             <input type="checkbox" checked={editFormData.paymentDetails?.[inst]?.isFree || false} 
                               onChange={(e) => {
                                 const checked = e.target.checked;
                                 setEditFormData({
                                     ...editFormData,
                                     paymentDetails: { ...editFormData.paymentDetails, [inst]: { ...(editFormData.paymentDetails?.[inst] || {}), isFree: checked, amount: checked ? '0' : '' } }
                                 });
                               }} className="accent-blue-600 w-3 h-3"/>
                             <span>ነፃ</span>
                           </label>
                         </div>
                         <div className="grid grid-cols-2 gap-2 mb-2">
                           {!editFormData.paymentDetails?.[inst]?.isFree ? (
                             <input type="number" placeholder="መጠን" value={editFormData.paymentDetails?.[inst]?.amount || ''} 
                               onChange={(e) => setEditFormData({...editFormData, paymentDetails: {...editFormData.paymentDetails, [inst]: {...editFormData.paymentDetails?.[inst], amount: e.target.value}}})} 
                               className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold focus:outline-none"/>
                           ) : (
                             <div className="w-full border border-gray-200 bg-gray-100 p-2 rounded-lg text-[10px] font-bold text-gray-500 flex items-center justify-center">ነፃ ተማሪ</div>
                           )}
                           <input type="number" min="1" max="30" placeholder="የክፍያ ቀን" value={editFormData.paymentDetails?.[inst]?.date || ''} 
                             onChange={(e) => setEditFormData({...editFormData, paymentDetails: {...editFormData.paymentDetails, [inst]: {...editFormData.paymentDetails?.[inst], date: e.target.value}}})} 
                             disabled={editFormData.paymentDetails?.[inst]?.isFree} 
                             className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold focus:outline-none"/>
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-bold text-[#5C4033] block mb-1">የጀመረበት ቀን</label>
                              <input type="date" value={editFormData.paymentDetails?.[inst]?.startDate || editFormData.registration_date} 
                                 onChange={(e) => setEditFormData({...editFormData, paymentDetails: {...editFormData.paymentDetails, [inst]: {...editFormData.paymentDetails?.[inst], startDate: e.target.value}}})} 
                                 className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold focus:outline-none"/>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-[#5C4033] block mb-1">የቆይታ ጊዜ</label>
                              <select value={editFormData.paymentDetails?.[inst]?.duration || '3 ወር'}
                                 onChange={(e) => setEditFormData({...editFormData, paymentDetails: {...editFormData.paymentDetails, [inst]: {...editFormData.paymentDetails?.[inst], duration: e.target.value}}})}
                                 className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold focus:outline-none bg-white">
                                 {['3 ወር', '6 ወር', '9 ወር'].map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                         </div>
                      </div>
                   ))}
                   <div className="bg-white mt-1 p-2 rounded-lg border border-[#D2B48C] flex justify-between items-center text-[10px]">
                      <span className="font-bold text-[#5C4033]">ጠቅላላ ወርሃዊ ክፍያ፡</span>
                      <span className="font-black text-green-700">{calculateTotalAmount(editFormData.paymentDetails)} ብር</span>
                   </div>
                </div>

                <div className="mt-2">
                   <label className="text-[10px] font-black text-[#5C4033] block mb-1 flex items-center">
                     የተመዘገቡበት ቀን 
                     <span className="text-[#8B5A2B] ml-2 text-[9px]">(በኢትዮጵያ፦ {formatEthDate(editFormData.registration_date)})</span>
                   </label>
                   <input type="date" className="w-full border border-[#D2B48C] p-2 rounded-lg text-xs font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]" value={editFormData.registration_date} onChange={e=>setEditFormData({...editFormData, registration_date: e.target.value})}/>
                </div>

                <div>
                   <label className="text-[10px] font-black text-[#5C4033] block mb-1">የስራ ሁኔታ</label>
                   <div className="flex gap-4">
                     <label className="flex items-center space-x-1.5 text-xs font-bold text-[#3E2723] cursor-pointer"><input type="radio" name="editWorkStatus" value="ተማሪ" checked={editFormData.work_status === 'ተማሪ'} onChange={e=>setEditFormData({...editFormData, work_status: e.target.value})} className="accent-[#8B5A2B]"/><span>ተማሪ</span></label>
                     <label className="flex items-center space-x-1.5 text-xs font-bold text-[#3E2723] cursor-pointer"><input type="radio" name="editWorkStatus" value="ሰራተኛ" checked={editFormData.work_status === 'ሰራተኛ'} onChange={e=>setEditFormData({...editFormData, work_status: e.target.value})} className="accent-[#8B5A2B]"/><span>ሰራተኛ</span></label>
                   </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t-2 border-dashed border-[#D2B48C] mt-2">
                <button onClick={() => saveProfileChanges(updatedStudentObj.id)} className="flex-1 bg-gradient-to-r from-[#8B5A2B] to-[#5C4033] text-white py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"><Save size={14}/> አስቀምጥ</button>
                <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-white text-[#3E2723] py-2.5 rounded-xl text-xs font-bold transition-all border-2 border-[#D2B48C] shadow-sm active:scale-95 flex items-center justify-center gap-1"><X size={14}/> ተወው</button>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className={`p-3 rounded-xl border flex items-center justify-between shadow-sm ${updatedStudentObj.status === 'completed' ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]' : updatedStudentObj.status === 'dropped' ? 'bg-[#FFEBEE] border-[#EF9A9A] text-[#C62828]' : 'bg-[#E3F2FD] border-[#90CAF9] text-[#1565C0]'}`}>
                <span className="font-bold text-xs">
                  {updatedStudentObj.status === 'completed' ? <> ትምህርቱን ያጠናቀቀ </> : updatedStudentObj.status === 'dropped' ? <> ትምህርቱን ያቋረጠ </> : <> በመማር ላይ ያለ (Active)</>}
                </span>
                {updatedStudentObj.examResult && <span className="font-black text-xs"> ውጤት: {updatedStudentObj.examResult}%</span>}
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 border border-[#EADDCA] text-xs flex justify-between items-center text-[#3E2723]">
                <span className="font-bold flex items-center"><Calendar size={14} className="mr-1.5 text-[#8B5A2B]" /> የተመዘገቡበት ቀን፦</span>
                <span className="font-black bg-white px-2.5 py-1 rounded-lg border border-[#EADDCA] shadow-sm">{formatEthDate(updatedStudentObj.registrationDate)}</span>
              </div>
              
              <div className="bg-white rounded-2xl p-4 border-2 border-[#EADDCA] shadow-sm relative">
                <div className="absolute top-1 left-1 opacity-15"><EthiopianCross className="w-5 h-5 text-[#8B5A2B]" /></div>
                <div className="absolute top-1 right-1 opacity-15"><EthiopianCross className="w-5 h-5 text-[#8B5A2B]" /></div>
                <div className="flex justify-between items-center border-b border-[#EADDCA] pb-2 mb-3">
                  <div className="flex flex-col"><h4 className="text-xs font-extrabold text-[#3E2723] flex items-center"><Calendar size={14} className="mr-1 text-[#8B5A2B]"/> የ {selectedMonth} ወር መገኘት</h4><p className="text-[9px] text-[#8B5A2B]/80 italic mt-0.5 font-bold"> ማስተካከያ፦ ቀኑን በመንካት መገኘትን ይለውጡ </p></div>
                  <span className="text-[10px] bg-[#FAF3E0] text-[#8B5A2B] px-2 py-0.5 rounded-full font-bold border border-[#D2B48C]">ድምር: {daysPresent} ቀን</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center pt-1">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const isPresent = attendanceData[day];
                    return (
                      <button key={day} onClick={() => handleCalendarDayClick(updatedStudentObj, day)} className={`flex flex-col items-center justify-center p-1.5 rounded-lg border-2 transition-all active:scale-95 ${isPresent ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32] hover:bg-green-100' : 'bg-[#FCFAF2] border-gray-200 text-gray-400 hover:bg-gray-100'}`}>
                        <span className="text-[10px] font-extrabold leading-none">{day}</span>
                        {isPresent ? <Check size={12} className="mt-1 text-green-700" strokeWidth={3}/> : <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm">
                <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center"><User size={14} className="mr-1"/> የግል እና አድራሻ መረጃ </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div><p className="text-gray-500 mb-0.5"> የራስ ስልክ </p><p className="font-bold text-[#3E2723]">{updatedStudentObj.phone || '-'}</p></div>
                  <div><p className="text-gray-500 mb-0.5"> የስራ ሁኔታ </p><p className="font-bold text-[#3E2723]">{updatedStudentObj.workStatus || '-'}</p></div>
                  <div className="col-span-2 bg-[#F9F6F0] p-2 rounded-lg border border-[#EADDCA]">
                    <p className="text-gray-500 mb-0.5 flex items-center"><PhoneCall size={12} className="mr-1 text-[#8B5A2B]"/> የቅርብ ተጠሪ </p>
                    <p className="font-bold text-[#3E2723]">{updatedStudentObj.emergencyContactName || '-'} <span className="text-[#8B5A2B]">({updatedStudentObj.emergencyContactPhone || '-'})</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm">
                <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center"><Church size={14} className="mr-1"/> መንፈሳዊ ህይወት መረጃ </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div><p className="text-gray-500 mb-0.5"> የመጡበት አጥቢያ </p><p className="font-bold text-[#3E2723]">{updatedStudentObj.parish || '-'}</p></div>
                  <div><p className="text-gray-500 mb-0.5"> አገልግሎት ክፍል </p><p className="font-bold text-[#3E2723]">{updatedStudentObj.churchService || '-'}</p></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm">
                <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center"><BookOpen size={14} className="mr-1"/> የትምህርት እና ክፍያ መረጃ </h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div className="col-span-2 mb-2"><p className="text-gray-500 mb-0.5"> የተመዘገቡባቸው መሳሪያዎች </p><p className="font-bold text-[#3E2723] bg-[#F5E6D3] inline-block px-2 py-0.5 rounded">{studentInstruments.join('፣ ')}</p></div>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-0.5 flex items-center"><Clock size={12} className="mr-1"/> የተመረጠ ቀን እና ሰዓት </p>
                    <p className="font-bold text-[#3E2723]">{updatedStudentObj.chosenDay || '-'} <span className="mx-1">|</span> {updatedStudentObj.chosenTime || '-'}</p>
                  </div>
                  
                  <div className="col-span-2 mt-2 pt-2 border-t border-dashed border-[#EADDCA]">
                    <p className="text-[10px] text-gray-500 mb-1.5 font-bold flex items-center"><Banknote size={12} className="mr-1"/> የክፍያ ዝርዝር መረጃ፡</p>
                    <div className="space-y-1.5">
                      {studentInstruments.map(inst => {
                          const detail = updatedStudentObj.paymentDetails?.[inst] || {};
                          return (
                             <div key={inst} className="flex justify-between items-center bg-gray-50 p-1.5 rounded border border-gray-200 text-[10px]">
                                <div>
                                  <span className="font-bold text-[#3E2723]">የ {inst} ክፍያ</span>
                                  <span className="text-gray-500 text-[9px] block">ጀምሯል፡ {formatEthDate(detail.startDate || updatedStudentObj.registrationDate)} | ቆይታ፡ <span className="text-[#8B5A2B] font-bold">{detail.duration || updatedStudentObj.duration || '3 ወር'}</span></span>
                                </div>
                                {detail.isFree ? (
                                   <span className="text-blue-600 font-black bg-blue-100 px-1 rounded">ነፃ</span>
                                ) : (
                                   <span className="text-[#8B5A2B] font-bold text-right">{detail.amount || updatedStudentObj.paymentAmount || 0} ብር <br/><span className="text-gray-500 text-[9px]">(ቀን {detail.date || '-'})</span></span>
                                )}
                             </div>
                          )
                      })}
                    </div>
                  </div>

                  {updatedStudentObj.status === 'active' && studentArrearsInfo.totalArrears > 0 && (
                     <div className="col-span-2 mt-2 pt-2 border-t border-red-200 flex justify-between items-center bg-red-50 p-2 rounded shadow-inner">
                       <span className="font-black text-red-800 flex items-center gap-1"><AlertCircle size={14}/> ያለበት አጠቃላይ ዕዳ ({studentArrearsInfo.unpaidKeys.length} ወር)፦ </span> 
                       <span className="text-red-700 font-black bg-red-200 px-2 py-1 rounded shadow-sm"> {studentArrearsInfo.totalArrears} ብር </span>
                     </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm mb-4">
                <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center"><ListMusic size={14} className="mr-1"/> የትምህርት ደረጃ ክትትል (Progress)</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                   {studentInstruments.map(inst => {
                       const instLessons = lessons.filter(l => l.instrument === inst).sort((a, b) => a.id - b.id);
                       if (instLessons.length === 0) return null;
                       return (
                          <div key={inst} className="mb-2">
                             <h5 className="text-[10px] font-black text-[#8B5A2B] bg-[#FAF3E0] px-2 py-1 rounded inline-block mb-1.5 border border-[#D2B48C]">የ {inst} ትምህርቶች</h5>
                             <div className="space-y-2">
                                 {instLessons.map((lesson, idx) => {
                                    const isCompleted = updatedStudentObj.lesson_progress?.[lesson.id];
                                    return (
                                      <div key={lesson.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#D2B48C] transition-colors cursor-pointer" onClick={() => toggleStudentLessonProgress(updatedStudentObj, lesson.id)}>
                                        <button className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${isCompleted ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300'}`}>{isCompleted && <Check size={12}/>}</button>
                                        <div><p className={`text-[11px] font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-[#3E2723]'}`}>{idx + 1}. {lesson.title}</p><p className={`text-[9px] mt-0.5 ${isCompleted ? 'text-gray-300 line-through' : 'text-gray-500'}`}>{lesson.content}</p></div>
                                      </div>
                                    )
                                 })}
                             </div>
                          </div>
                       )
                   })}
                   {!lessons.some(l => studentInstruments.includes(l.instrument)) && (
                      <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg border border-gray-100"><p className="text-[10px] font-bold">ለተመዘገቡት የመሳሪያ አይነቶች የተመዘገበ የትምህርት ቅደም ተከተል የለም።</p></div>
                   )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    return (
      <div className="p-5 space-y-6 animate-fade-in pb-12 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-black text-[#3E2723] font-serif flex items-center gap-1.5">
              <EthiopianCross className="w-5 h-5 text-[#8B5A2B]" /> ሰላም መምህር!
            </h2>
            <p className="text-xs text-[#8B5A2B] font-bold mt-1"> የዕለቱ የትምህርት ቤት ማጠቃለያ ሰነድ </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button onClick={() => setReportConfig({show: true, type: 'general', statusFilter: 'all'})} className="bg-[#8B5A2B] hover:bg-[#5C4033] text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1 border border-[#D4AF37]" title="ሪፖርት አውጣ (PDF)"><Printer size={18} /><span className="text-xs font-bold px-1 hidden sm:inline"> አትም </span></button>
            <div className="flex space-x-1">
              <div className="relative"><select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="appearance-none bg-white border border-[#C19A6B] text-[#5C4033] text-xs font-bold py-2 pl-2 pr-6 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]">{ethiopianYears.map(y => <option key={y} value={y}>{y}</option>)}</select><ChevronDown className="absolute right-1 top-2.5 text-[#8B5A2B] pointer-events-none" size={12} /></div>
              <div className="relative"><select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="appearance-none bg-[#F5E6D3] border border-[#C19A6B] text-[#5C4033] text-xs font-bold py-2 pl-2 pr-6 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]">{ethiopianMonths.map(m => <option key={m} value={m}>{m}</option>)}</select><ChevronDown className="absolute right-1 top-2.5 text-[#8B5A2B] pointer-events-none" size={12} /></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center opacity-40 my-1">
          <span className="text-xs text-[#8B5A2B]"> ✥ ✥ ✥ </span>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#8B5A2B] to-transparent flex-1 mx-2" />
          <span className="text-xs text-[#8B5A2B]"> ✥ ✥ ✥ </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div onClick={() => { setActiveTab('academic'); setAcademicViewType('active'); }} className="cursor-pointer bg-white rounded-3xl p-4 text-[#3E2723] shadow-md border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#8B5A2B] transition-all transform hover:-translate-y-1"><div className="absolute -right-2 -bottom-2 opacity-[0.03]"><BookOpen size={64}/></div><BookOpen size={24} className="mb-2 text-[#8B5A2B]" /><span className="text-3xl font-black font-serif">{totalActive}</span><span className="text-[10px] font-bold mt-1 text-gray-500"> በመማር ላይ ያሉ </span></div>
          <div onClick={() => { setActiveTab('academic'); setAcademicViewType('completed'); }} className="cursor-pointer bg-white rounded-3xl p-4 text-[#3E2723] shadow-md border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-green-600 transition-all transform hover:-translate-y-1"><div className="absolute -right-2 -bottom-2 opacity-[0.03]"><Award size={64}/></div><Award size={24} className="mb-2 text-green-700" /><span className="text-3xl font-black font-serif">{completedStudentsCount}</span><span className="text-[10px] font-bold mt-1 text-gray-500"> ያጠናቀቁ (ምሩቃን)</span></div>
          <div onClick={() => { setActiveTab('academic'); setAcademicViewType('dropped'); }} className="cursor-pointer bg-white rounded-3xl p-4 text-[#3E2723] shadow-md border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-red-600 transition-all transform hover:-translate-y-1"><div className="absolute -right-2 -bottom-2 opacity-[0.03]"><UserMinus size={64}/></div><UserMinus size={24} className="mb-2 text-red-700" /><span className="text-3xl font-black font-serif">{droppedStudentsCount}</span><span className="text-[10px] font-bold mt-1 text-gray-500"> ያቋረጡ ተማሪዎች </span></div>
          <div onClick={() => { setActiveTab('attendance'); setAttendanceFilter('present'); }} className="cursor-pointer bg-white rounded-3xl p-4 text-[#3E2723] shadow-md border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-green-600 transition-all transform hover:-translate-y-1"><div className="absolute -right-2 -bottom-2 opacity-[0.03]"><CheckSquare size={64}/></div><CheckSquare size={24} className="mb-2 text-green-700" /><span className="text-3xl font-black font-serif">{totalPresentToday}</span><span className="text-[10px] font-bold mt-1 text-gray-500"> ዛሬ የተገኙ ({selectedMonth} {selectedDay})</span></div>
          <div onClick={() => { setActiveTab('payments'); setPaymentFilter('paid'); }} className="cursor-pointer bg-white rounded-3xl p-4 text-[#3E2723] shadow-md border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-[#D4AF37] transition-all transform hover:-translate-y-1"><div className="absolute -right-2 -bottom-2 opacity-[0.03]"><CreditCard size={64}/></div><CreditCard size={24} className="mb-2 text-[#D4AF37]" /><span className="text-3xl font-black font-serif">{totalPaidCurrentMonth}</span><span className="text-[10px] font-bold mt-1 text-gray-500"> የከፈሉ/ቀን ያልደረሰ ({selectedMonth})</span></div>
          <div onClick={() => { setActiveTab('payments'); setPaymentFilter('unpaid'); }} className="cursor-pointer bg-white rounded-3xl p-4 text-[#3E2723] shadow-md border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-red-600 transition-all transform hover:-translate-y-1"><div className="absolute -right-2 -bottom-2 opacity-[0.03]"><XCircle size={64}/></div><XCircle size={24} className="mb-2 text-red-700" /><span className="text-3xl font-black font-serif">{totalUnpaidCurrentMonth}</span><span className="text-[10px] font-bold mt-1 text-gray-500"> ያልከፈሉ ({selectedMonth})</span></div>
        </div>

        <div className="bg-gradient-to-r from-[#D4AF37] via-[#8B5A2B] to-[#D4AF37] p-[2px] rounded-3xl shadow-lg mt-4">
          <div className="bg-[#FAF3E0] rounded-[22px] p-5 relative overflow-hidden h-full border border-white">
            <div className="absolute -right-4 -top-4 opacity-[0.08] text-[#8B5A2B]"><Sparkles size={100} /></div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-[#8B5A2B] p-1.5 rounded-lg text-white shadow-sm"><Quote size={16}/></div>
              <h3 className="font-bold text-[#3E2723] text-sm font-serif flex items-center gap-1">የ AI ረዳት መዘክር <EthiopianCross className="w-4 h-4 text-[#D4AF37]" /></h3>
            </div>
            <p className="text-xs sm:text-sm text-[#3E2723] leading-relaxed font-medium relative z-10">
              መምህር ሆይ፣ በ <span className="font-bold text-[#8B5A2B]">{selectedYear} ዓ.ም</span> የ <span className="font-bold text-[#8B5A2B]">{selectedMonth}</span> ወር የትምህርት ቤትዎ ሁኔታ ማጠቃለያ እንደሚከተለው ነው፦ በአጠቃላይ <span className="font-bold text-[#8B5A2B]">{totalActive}</span> ተማሪዎች በመማር ላይ ይገኛሉ። ከእነዚህም ውስጥ በ {selectedMonth} ወር ክፍያ የፈጸሙ/ቀናቸው ያልደረሰ <span className="font-bold text-green-700">{totalPaidCurrentMonth}</span> ሲሆኑ፣ የመክፈያ ቀናቸው አልፎ ያልከፈሉ ደግሞ <span className="font-bold text-red-700">{totalUnpaidCurrentMonth}</span> ናቸው። በዛሬው ዕለት (<span className="font-bold text-blue-700">{selectedMonth} {selectedDay} ቀን</span>) ደግሞ <span className="font-bold text-blue-700">{totalPresentToday}</span> ተማሪዎች በትምህርት ገበታቸው ላይ ተገኝተዋል። እግዚአብሔር ለአገልግሎትዎ ኃይልን ይስጥዎት!
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-[#FAF3E0] to-[#F5E6D3] p-6 rounded-3xl shadow-lg border-2 border-[#D4AF37] text-[#3E2723] relative overflow-hidden mt-4">
          <div className="absolute top-0 right-0 opacity-10"><EthiopianCross className="w-32 h-32 text-[#8B5A2B] transform rotate-12 translate-x-4 -translate-y-4" /></div>
          <div className="flex items-center space-x-3 mb-5 border-b border-[#EADDCA] pb-4 relative z-10">
            <div className="bg-[#8B5A2B] p-2 rounded-xl border border-[#D4AF37]"><Banknote size={20} className="text-[#F5E6D3]" /></div>
            <h3 className="font-bold text-lg font-serif tracking-wider text-[#3E2723]">  የማሰልጠኛው የገንዘብ ሰነድ </h3>
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center px-2"><span className="text-[#5C4033] text-sm font-bold flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] mr-2"></div> የሚጠበቅ ጠቅላላ ገቢ </span><span className="text-[#8B5A2B] font-black font-serif text-lg">{totalRevenueExpected} <span className="text-xs font-normal"> ብር </span></span></div>
            <div className="flex justify-between items-center px-2"><span className="text-[#5C4033] text-sm font-bold flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-green-600 mr-2"></div> የተሰበሰበ ገቢ </span><span className="text-green-700 font-black font-serif text-lg">{totalRevenueCollected} <span className="text-xs font-normal"> ብር </span></span></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-red-200 shadow-lg relative overflow-hidden mt-4">
          <div className="absolute -right-4 -bottom-4 text-red-500/5 pointer-events-none"><AlertCircle size={120} /></div>
          <div className="flex items-center space-x-3 border-b border-red-100 pb-3 mb-4">
            <div className="bg-red-500 p-2 rounded-xl text-white shadow-md animate-pulse"><AlertTriangle size={20} /></div>
            <div>
              <h3 className="font-black text-sm text-red-900 font-serif">ያልተከፈለ ዕዳ ያለባቸው ተማሪዎች</h3>
              <p className="text-[10px] text-red-600/80 font-bold">እስከ ዛሬዋ ዕለት ድረስ ክፍያ ያጓተቱ ({overdueUnpaidCount})</p>
            </div>
          </div>
          
          {overdueList.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {overdueList.map(student => (
                <div key={student.id} className="bg-red-50/70 border border-red-100 rounded-2xl p-3 flex justify-between items-center transition-all hover:bg-red-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-800 font-black text-xs">#{student.studentNo}</div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#3E2723]">{student.name}</h4>
                      <p className="text-[9px] text-red-700 font-black mt-0.5">
                        ያለበት ዕዳ፦ የ {student.unpaidKeys.length} ወር (<span className="font-mono text-sm ml-0.5">{student.totalArrears} ብር</span>)
                      </p>
                    </div>
                  </div>
                  <button onClick={() => { setActiveTab('payments'); setPaymentSearch(student.studentNo); }} className="bg-red-700 hover:bg-red-800 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1">
                    <CreditCard size={12} /> ወደ ክፍያ
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-green-50/50 rounded-2xl border border-green-100 text-green-800"><CheckCircle size={24} className="mx-auto mb-2 text-green-600" /><p className="text-xs font-black">ክብር ለእግዚአብሔር ይሁን! እስካሁን ምንም አይነት የቀድሞ ዕዳ ያለበት ተማሪ የለም።</p></div>
          )}
        </div>
      </div>
    );
  };

  const renderInventoryView = () => {
    let filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(inventorySearch.toLowerCase()));
    
    if (inventoryFilter !== 'all') {
      filteredInventory = filteredInventory.filter(item => item.category === inventoryFilter);
    }

    return (
      <div className="p-5 space-y-6 animate-fade-in pb-12 relative z-10">
        <div className="flex justify-between items-center mb-2 border-b border-[#D2B48C] pb-4">
          <div>
            <h2 className="text-xl font-black text-[#3E2723] font-serif flex items-center gap-1.5">
              <Package className="w-5 h-5 text-[#8B5A2B]" /> የንብረት አስተዳደር
            </h2>
            <p className="text-xs text-[#8B5A2B] font-bold mt-1"> የመጋዘን ክምችት እና ሽያጭ </p>
          </div>
          <button onClick={() => setIsSalesHistoryOpen(true)} className="flex items-center gap-1 bg-white text-[#8B5A2B] px-3 py-2 rounded-xl text-[10px] font-black shadow-sm border border-[#D2B48C] hover:bg-[#FAF3E0] transition-colors">
            <History size={14} /> የሽያጭ ታሪክ
          </button>
        </div>

        <button onClick={() => { setEditingInventory(null); setInventoryForm({ name: '', category: 'መሳሪያዎች', quantity: '', price: '' }); setIsAddInventoryOpen(true); }} className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#8B5A2B] rounded-2xl text-white font-black flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
          <Plus size={18}/> አዲስ ዕቃ ወደ መጋዘን አስገባ
        </button>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-[#EADDCA] shadow-sm flex flex-col items-center text-center">
            <Box size={18} className="text-[#8B5A2B] mb-1"/>
            <span className="text-lg font-black text-[#3E2723]">{totalInventoryStock}</span>
            <span className="text-[9px] font-bold text-gray-500 mt-0.5">ጠቅላላ ክምችት</span>
          </div>
          <div className={`p-3 rounded-2xl border shadow-sm flex flex-col items-center text-center ${lowStockItemsCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-[#EADDCA]'}`}>
            <AlertTriangle size={18} className={`${lowStockItemsCount > 0 ? 'text-red-500' : 'text-gray-400'} mb-1`}/>
            <span className={`text-lg font-black ${lowStockItemsCount > 0 ? 'text-red-700' : 'text-[#3E2723]'}`}>{lowStockItemsCount}</span>
            <span className={`text-[9px] font-bold mt-0.5 ${lowStockItemsCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>ሊያልቁ የተቃረቡ</span>
          </div>
          <div className="bg-green-50 p-3 rounded-2xl border border-green-200 shadow-sm flex flex-col items-center text-center">
            <TrendingUp size={18} className="text-green-600 mb-1"/>
            <span className="text-lg font-black text-green-800">{totalSalesRevenue}</span>
            <span className="text-[9px] font-bold text-green-700 mt-0.5">የሽያጭ ገቢ (ብር)</span>
          </div>
        </div>

        <div className="flex bg-[#FAF3E0] p-1.5 rounded-2xl border-2 border-[#D2B48C] gap-1 overflow-x-auto hide-scrollbar">
          <button onClick={() => setInventoryFilter('all')} className={`flex-shrink-0 px-4 py-2 text-[10px] font-black rounded-lg transition-colors ${inventoryFilter === 'all' ? 'bg-[#8B5A2B] text-white shadow-sm' : 'text-[#8B5A2B]/80 hover:bg-white/50'}`}> ሁሉም </button>
          <button onClick={() => setInventoryFilter('መሳሪያዎች')} className={`flex-shrink-0 px-4 py-2 text-[10px] font-black rounded-lg transition-colors ${inventoryFilter === 'መሳሪያዎች' ? 'bg-[#8B5A2B] text-white shadow-sm' : 'text-[#8B5A2B]/80 hover:bg-white/50'}`}> መሳሪያዎች </button>
          <button onClick={() => setInventoryFilter('መለዋወጫዎች')} className={`flex-shrink-0 px-4 py-2 text-[10px] font-black rounded-lg transition-colors ${inventoryFilter === 'መለዋወጫዎች' ? 'bg-[#8B5A2B] text-white shadow-sm' : 'text-[#8B5A2B]/80 hover:bg-white/50'}`}> መለዋወጫዎች </button>
          <button onClick={() => setInventoryFilter('መፃህፍት')} className={`flex-shrink-0 px-4 py-2 text-[10px] font-black rounded-lg transition-colors ${inventoryFilter === 'መፃህፍት' ? 'bg-[#8B5A2B] text-white shadow-sm' : 'text-[#8B5A2B]/80 hover:bg-white/50'}`}> መፃህፍት </button>
        </div>

        <div className="relative mb-2">
          <Search size={18} className="absolute left-3 top-3.5 text-[#8B5A2B]/60" />
          <input type="text" placeholder="የዕቃውን ስም ይፈልጉ..." value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/95 border-2 border-[#EADDCA] rounded-xl text-sm font-bold shadow-sm" />
        </div>

        <div className="space-y-3">
          {filteredInventory.map(item => {
             const isLowStock = item.quantity < 5;
             return (
               <div key={item.id} className={`bg-white rounded-3xl p-4 border-2 shadow-sm ${isLowStock ? 'border-red-300' : 'border-[#EADDCA]'}`}>
                 <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                   <div>
                     <h3 className="font-extrabold text-[#3E2723] text-sm mb-1">{item.name}</h3>
                     <span className="bg-[#FAF3E0] text-[#8B5A2B] border border-[#D2B48C] px-2 py-0.5 rounded text-[9px] font-bold">{item.category}</span>
                   </div>
                   <div className="text-right">
                     <span className="block font-black text-[#8B5A2B] text-sm">{item.price} ብር</span>
                     <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>ክምችት፦ {item.quantity}</span>
                   </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <button onClick={() => setSellModalData({item, sellQty: ''})} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1">
                      <ShoppingCart size={14}/> ሽጥ
                    </button>
                    <button onClick={() => setRestockModalData({item, addQty: ''})} className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1">
                      <PlusCircle size={14}/> ገቢ አድርግ
                    </button>
                    <button onClick={() => {setEditingInventory(item); setInventoryForm({name: item.name, category: item.category, quantity: item.quantity, price: item.price}); setIsAddInventoryOpen(true);}} className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                      <Edit size={16}/>
                    </button>
                    <button onClick={() => handleDeleteInventory(item)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      <Trash2 size={16}/>
                    </button>
                 </div>
               </div>
             )
          })}
          {filteredInventory.length === 0 && <p className="text-center text-[#8B5A2B] text-sm py-8 font-bold bg-white rounded-2xl border border-[#D2B48C]"> በዚህ ማጣሪያ የተገኘ ዕቃ የለም። </p>}
        </div>
      </div>
    );
  };

  const renderInventoryModals = () => {
    return (
      <>
        {isAddInventoryOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[300] animate-fade-in">
            <div className="bg-[#FAF3E0] rounded-3xl w-full max-w-md flex flex-col border-2 border-[#D2B48C] shadow-2xl relative overflow-hidden">
               <div className="bg-gradient-to-r from-[#3E2723] to-[#5C4033] text-white p-4 flex items-center justify-between border-b-4 border-[#D4AF37]">
                 <div className="flex items-center gap-2"><Package size={18} className="text-[#D4AF37]" /><h3 className="font-extrabold text-sm font-serif text-[#FFF8E7]">{editingInventory ? 'ንብረት ማስተካከያ' : 'አዲስ ንብረት መመዝገቢያ'}</h3></div>
                 <button onClick={() => {setIsAddInventoryOpen(false); setEditingInventory(null);}} className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors"><X size={16} /></button>
               </div>
               <form onSubmit={handleSaveInventory} className="p-5 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#5C4033] mb-1">የዕቃው ስም <span className="text-red-500">*</span></label>
                    <input type="text" required value={inventoryForm.name} onChange={e=>setInventoryForm({...inventoryForm, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#D2B48C] rounded-xl text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]" placeholder="ምሳሌ፡ የበገና ክር (10 ፍሬ)"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5C4033] mb-1">ዘርፍ</label>
                    <select value={inventoryForm.category} onChange={e=>setInventoryForm({...inventoryForm, category: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#D2B48C] rounded-xl text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]">
                      <option value="መሳሪያዎች">መሳሪያዎች (እንደ በገና፣ ክራር)</option>
                      <option value="መለዋወጫዎች">መለዋወጫዎች (ክር፣ መቃኛ...)</option>
                      <option value="መፃህፍት">መፃህፍት እና ሞጁሎች</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-[#5C4033] mb-1">የመነሻ ብዛት {editingInventory && '(አሁን ያለው)'}</label>
                      <input type="number" min="0" required value={inventoryForm.quantity} onChange={e=>setInventoryForm({...inventoryForm, quantity: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#D2B48C] rounded-xl text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#5C4033] mb-1">የአንዱ መሸጫ ዋጋ (ብር) <span className="text-red-500">*</span></label>
                      <input type="number" min="0" required value={inventoryForm.price} onChange={e=>setInventoryForm({...inventoryForm, price: e.target.value})} className="w-full px-3 py-2 bg-white border border-[#D2B48C] rounded-xl text-xs font-bold text-[#3E2723] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"/>
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-4 bg-gradient-to-r from-[#8B5A2B] to-[#5C4033] text-white py-3 rounded-xl text-xs font-black shadow-md transition-all active:scale-95"><Save size={14} className="inline mr-1"/> አስቀምጥ</button>
               </form>
            </div>
          </div>
        )}

        {sellModalData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[300] animate-fade-in">
            <div className="bg-[#FAF3E0] rounded-3xl w-full max-w-sm flex flex-col border-2 border-[#D2B48C] shadow-2xl relative overflow-hidden">
               <div className="bg-gradient-to-r from-green-700 to-green-900 text-white p-4 flex items-center justify-between border-b-4 border-green-500">
                 <div className="flex items-center gap-2"><ShoppingCart size={18} className="text-green-200" /><h3 className="font-extrabold text-sm font-serif">የዕቃ ሽያጭ</h3></div>
                 <button onClick={() => setSellModalData(null)} className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors"><X size={16} /></button>
               </div>
               <form onSubmit={handleSellConfirm} className="p-5 space-y-4">
                  <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-center">
                    <p className="text-xs font-black text-[#3E2723]">{sellModalData.item.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">በክምችት ያለው፡ <span className="text-green-700 font-black">{sellModalData.item.quantity} ፍሬ</span> | ዋጋ፡ <span className="text-[#8B5A2B] font-black">{sellModalData.item.price} ብር</span></p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5C4033] mb-1 text-center">የሚሸጠው ብዛት</label>
                    <div className="flex justify-center items-center gap-3">
                       <button type="button" onClick={() => setSellModalData({...sellModalData, sellQty: Math.max(1, (parseInt(sellModalData.sellQty)||0)-1)})} className="p-2 bg-white rounded-full border shadow-sm text-gray-600 hover:bg-gray-50"><MinusCircle size={20}/></button>
                       <input type="number" min="1" max={sellModalData.item.quantity} autoFocus required value={sellModalData.sellQty} onChange={e=>setSellModalData({...sellModalData, sellQty: e.target.value})} className="w-20 px-3 py-2 bg-white border-2 border-[#D2B48C] rounded-xl text-center text-lg font-black text-[#3E2723] focus:outline-none focus:border-green-600"/>
                       <button type="button" onClick={() => setSellModalData({...sellModalData, sellQty: Math.min(sellModalData.item.quantity, (parseInt(sellModalData.sellQty)||0)+1)})} className="p-2 bg-white rounded-full border shadow-sm text-gray-600 hover:bg-gray-50"><PlusCircle size={20}/></button>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-[#D2B48C] pt-3 flex justify-between items-center bg-white p-3 rounded-xl shadow-inner">
                    <span className="text-xs font-bold text-gray-500">ጠቅላላ የሽያጭ ዋጋ፡</span>
                    <span className="text-sm font-black text-green-700">{(parseInt(sellModalData.sellQty)||0) * sellModalData.item.price} ብር</span>
                  </div>
                  <button type="submit" disabled={!sellModalData.sellQty || parseInt(sellModalData.sellQty)<=0} className="w-full mt-2 bg-green-600 text-white py-3 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"><CheckCircle size={14} className="inline mr-1"/> ሸጥኩ (Confirm)</button>
               </form>
            </div>
          </div>
        )}

        {restockModalData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[300] animate-fade-in">
            <div className="bg-[#FAF3E0] rounded-3xl w-full max-w-sm flex flex-col border-2 border-[#D2B48C] shadow-2xl relative overflow-hidden">
               <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 flex items-center justify-between border-b-4 border-blue-400">
                 <div className="flex items-center gap-2"><Archive size={18} className="text-blue-200" /><h3 className="font-extrabold text-sm font-serif">ክምችት መጨመሪያ (Restock)</h3></div>
                 <button onClick={() => setRestockModalData(null)} className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors"><X size={16} /></button>
               </div>
               <form onSubmit={handleRestockConfirm} className="p-5 space-y-4">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                    <p className="text-xs font-black text-[#3E2723]">{restockModalData.item.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">የአሁኑ ክምችት፡ <span className="text-blue-700 font-black">{restockModalData.item.quantity} ፍሬ</span></p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5C4033] mb-1 text-center">አዲስ የሚገባው ብዛት</label>
                    <input type="number" min="1" autoFocus required value={restockModalData.addQty} onChange={e=>setRestockModalData({...restockModalData, addQty: e.target.value})} className="w-full px-3 py-3 bg-white border-2 border-[#D2B48C] rounded-xl text-center text-lg font-black text-[#3E2723] focus:outline-none focus:border-blue-600"/>
                  </div>
                  <div className="border-t border-dashed border-[#D2B48C] pt-3 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500">አዲሱ አጠቃላይ ክምችት፡</span>
                    <span className="text-xs font-black text-blue-800">{restockModalData.item.quantity + (parseInt(restockModalData.addQty)||0)} ፍሬ</span>
                  </div>
                  <button type="submit" disabled={!restockModalData.addQty || parseInt(restockModalData.addQty)<=0} className="w-full mt-2 bg-blue-600 text-white py-3 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"><Plus size={14} className="inline mr-1"/> ክምችት ጨምር</button>
               </form>
            </div>
          </div>
        )}

        {isSalesHistoryOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[250] animate-fade-in">
            <div className="bg-[#FAF3E0] rounded-[32px] w-full max-w-md max-h-[85vh] flex flex-col border-2 border-[#D2B48C] shadow-2xl relative overflow-hidden">
               <div className="bg-gradient-to-r from-[#3E2723] to-[#5C4033] text-white p-4 flex items-center justify-between border-b-4 border-[#D4AF37] relative z-10 flex-shrink-0">
                 <div className="flex items-center gap-2"><History size={18} className="text-[#D4AF37]" /><h3 className="font-extrabold text-sm font-serif">የዕቃዎች ሽያጭ ታሪክ</h3></div>
                 <button onClick={() => setIsSalesHistoryOpen(false)} className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors"><X size={16} /></button>
               </div>
               <div className="bg-green-50 border-b border-[#EADDCA] p-3 text-center flex-shrink-0 flex justify-between items-center">
                  <span className="text-xs font-bold text-[#5C4033]">ጠቅላላ የሽያጭ ገቢ፦</span>
                  <span className="text-base font-black text-green-800">{totalSalesRevenue} ብር</span>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {salesHistory.map((sale) => (
                   <div key={sale.id} className="bg-white rounded-2xl p-3 border border-[#EADDCA] shadow-sm flex items-center justify-between">
                     <div>
                       <h4 className="font-extrabold text-[#3E2723] text-xs">{sale.item_name} <span className="text-gray-400 font-normal text-[9px]">({sale.category})</span></h4>
                       <p className="text-[9px] text-gray-500 font-bold mt-1">የተሸጠው፡ <span className="text-[#8B5A2B]">{sale.quantity} ፍሬ</span> | ቀን፡ {sale.date ? formatEthDate(sale.date) : '-'}</p>
                     </div>
                     <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-[10px] font-black border border-green-200">
                        +{sale.total_price} ብር
                     </div>
                   </div>
                 ))}
                 {salesHistory.length === 0 && <p className="text-center text-gray-400 font-bold text-xs py-8">ምንም የተመዘገበ የሽያጭ ታሪክ የለም።</p>}
               </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (authLoading) {
    return <LoadingSplash message="የደህንነት ማረጋገጫ በመካሄድ ላይ ነው..." />;
  }

  if (!session) {
    return renderLoginScreen();
  }

  if (loading) {
    return <LoadingSplash message="የተማሪዎች መረጃ ከዳታቤዝ በመጫን ላይ ነው..." />;
  }

  return (
    <>
      {renderReportModal()}
      {renderPaymentHistoryModal()}
      {renderAiModal()}
      {renderInventoryModals()}

      <div className="app-ui hide-on-print min-h-screen bg-[#FAF6EE] flex flex-col pb-24 relative overflow-x-hidden">
        <header className="bg-[#3E2723] text-white px-4 py-3 flex justify-between items-center border-b-4 border-[#D4AF37] shadow-md relative z-20">
          <div className="flex items-center space-x-2">
            <EthiopianCross className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-black text-sm sm:text-base font-serif text-[#FFF8E7]">አታኦስ በገና ማሰልጠኛ</span>
          </div>
          <button onClick={handleLogout} className="bg-red-700/80 hover:bg-red-800 text-white px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 shadow-sm border border-red-500/30">
            <UserMinus size={14} /> ውጣ (Logout)
          </button>
        </header>

        <WatermarkBackground />

        <main className="flex-1 max-w-md mx-auto w-full relative z-10">
          {notification.show && (
            <div className={`fixed top-16 left-4 right-4 p-3 rounded-2xl shadow-xl flex items-center space-x-3 border-2 z-[200] animate-fade-in ${notification.type === 'success' ? 'bg-[#E8F5E9] border-green-500 text-[#1B5E20]' : 'bg-[#FFEBEE] border-[#F44336] text-[#B71C1C]'}`}>
              {notification.message}
            </div>
          )}

          {renderGlobalConfirmationModal()}
          {renderStudentProfileModal()}

          {activeTab === 'dashboard' && renderDashboardView()}
          {activeTab === 'students' && renderRegistrationView()}
          {activeTab === 'academic' && renderAcademicView()}
          {activeTab === 'lessons' && renderLessonsView()}
          {activeTab === 'attendance' && renderAttendanceView()}
          {activeTab === 'payments' && renderPaymentsView()}
          {activeTab === 'inventory' && renderInventoryView()}
        </main>

        {!isAiOpen && (
          <button 
            onClick={() => setIsAiOpen(true)}
            className="fixed bottom-24 right-5 bg-gradient-to-r from-[#D4AF37] to-[#8B5A2B] text-white p-4 rounded-full shadow-[0_4px_15px_rgba(139,90,43,0.4)] z-[100] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center animate-bounce-subtle"
          >
            <Sparkles size={24} />
          </button>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-[#FAF3E0]/95 backdrop-blur-md border-t-4 border-[#8B5A2B] px-1 py-2 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] overflow-x-auto hide-scrollbar">
          {[
            { id: 'dashboard', icon: Home, label: 'ዋና' },
            { id: 'students', icon: UserPlus, label: 'መዝግብ' },
            { id: 'academic', icon: BookOpen, label: 'መረጃ' },
            { id: 'lessons', icon: ListMusic, label: 'አታኦስ' },
            { id: 'attendance', icon: CheckSquare, label: 'መገኘት' },
            { id: 'payments', icon: CreditCard, label: 'ክፍያ' },
            { id: 'inventory', icon: Package, label: 'ንብረት' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'attendance') setAttendanceFilter('all');
                if (item.id === 'payments') setPaymentFilter('all');
                if (item.id === 'inventory') setInventoryFilter('all');
              }} 
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[52px] h-12 rounded-2xl transition-all duration-300 relative ${
                activeTab === item.id 
                  ? 'bg-[#8B5A2B]/10 text-[#8B5A2B] transform -translate-y-1' 
                  : 'text-[#8D6E63] hover:bg-[#8B5A2B]/5 hover:text-[#5C4033]'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? "mb-0.5" : ""} />
              <span className={`text-[8px] sm:text-[9px] font-black transition-all ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                 <div className="absolute -bottom-2 w-4 h-1 rounded-full bg-[#8B5A2B]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Ethiopic:wght@400;700;900&display=swap');
        body { font-family: 'Noto Serif Ethiopic', serif; margin: 0; padding: 0; background-color: #FAF6EE; min-height: 100vh; color: #3E2723; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounceSubtle 2s infinite ease-in-out; }
        
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          body, html { 
            background-color: white !important; 
            color: black !important; 
            height: auto !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: visible !important;
          }
          .app-ui, .hide-on-print { 
            display: none !important; 
          }
          .hide-on-print-bg { 
            position: absolute !important; 
            background: white !important; 
            inset: 0 !important;
            overflow: visible !important; 
            z-index: 9999 !important;
          }
          #printable-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
          }
        }
      `}} />
    </>
  );
}
