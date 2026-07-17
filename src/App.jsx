import React, { useState, useRef, useEffect } from 'react'
import {
  Home,
  UserPlus,
  CheckSquare,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  Camera,
  User,
  Sparkles,
  Send,
  Loader2,
  ChevronDown,
  Clock,
  Banknote,
  Trash2,
  AlertTriangle,
  Info,
  Printer,
  X,
  Copy,
  Search,
  BookOpen,
  Church,
  PhoneCall,
  FileText,
  Music,
  Quote,
  Award,
  GraduationCap,
  Check,
  UserMinus,
  Calendar,
  Shield,
  AlertCircle,
} from 'lucide-react'

// --- መንፈሳዊ የክርስቲያን መስቀል ምስል (Ethiopian Cross Icon) ---
const EthiopianCross = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 45 10 L 55 10 L 55 35 L 80 35 L 80 45 L 55 45 L 55 55 L 70 55 L 75 50 L 85 60 L 75 70 L 70 65 L 55 65 L 55 90 L 45 90 L 45 65 L 30 65 L 25 70 L 15 60 L 25 50 L 30 55 L 45 55 L 45 45 L 20 45 L 20 35 L 45 35 Z" />
    <path
      d="M 35 35 L 45 25 L 55 25 L 65 35 L 55 45 L 45 45 Z"
      opacity="0.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
  </svg>
)

// --- ብጁ የበገና ምስል (Custom Begena SVG Icon) ---
const BegenaIcon = ({ className }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 85 L 80 85 L 90 115 L 10 115 Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    <rect x="23" y="20" width="8" height="70" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <rect x="69" y="20" width="8" height="70" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    <rect x="15" y="15" width="70" height="12" fill="currentColor" rx="2" stroke="currentColor" strokeWidth="1" />
    <line x1="33" y1="27" x2="33" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="37" y1="27" x2="37" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="41" y1="27" x2="41" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="45" y1="27" x2="45" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="49" y1="27" x2="49" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="53" y1="27" x2="53" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="57" y1="27" x2="57" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="61" y1="27" x2="61" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="65" y1="27" x2="65" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
    <line x1="69" y1="27" x2="69" y2="85" stroke="#FFD700" strokeWidth="1.5" opacity="0.9" />
  </svg>
)

// --- የአክሱም ሐውልት ምስል (Axum Obelisk Watermark SVG) ---
const AxumObelisk = ({ className }) => (
  <svg viewBox="0 0 100 300" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 30 280 L 70 280 L 60 60 L 40 60 Z" />
    <path d="M 40 60 Q 50 35 60 60 Z" />
    <rect x="43" y="240" width="14" height="40" fill="#FAF4E8" />
    <line x1="38" y1="220" x2="62" y2="220" stroke="#FAF4E8" strokeWidth="2" />
    <line x1="39" y1="180" x2="61" y2="180" stroke="#FAF4E8" strokeWidth="2" />
    <line x1="41" y1="140" x2="59" y2="140" stroke="#FAF4E8" strokeWidth="2" />
    <line x1="42" y1="100" x2="58" y2="100" stroke="#FAF4E8" strokeWidth="2" />
    <circle cx="50" cy="50" r="4" fill="#FAF4E8" />
  </svg>
)

// --- Background Watermark Component ---
const WatermarkBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.035] text-[#5C4033] hide-on-print">
    <BegenaIcon className="absolute -top-16 -left-16 w-80 h-80 transform -rotate-12" />
    <AxumObelisk className="absolute top-1/4 -right-12 w-96 h-96 transform rotate-6" />
    <EthiopianCross className="absolute bottom-1/4 -left-20 w-80 h-80 transform -rotate-12" />
    <BegenaIcon className="absolute -bottom-24 right-4 w-72 h-72 transform rotate-12" />
    <EthiopianCross className="absolute top-10 right-20 w-32 h-32 transform rotate-12" />
  </div>
)

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('dashboard')
  const [academicViewType, setAcademicViewType] = useState('active')

  const ethiopianYears = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028']
  const ethiopianMonths = [
    'መስከረም',
    'ጥቅምት',
    'ኅዳር',
    'ታኅሣሥ',
    'ጥር',
    'የካቲት',
    'መጋቢት',
    'ሚያዝያ',
    'ግንቦት',
    'ሰኔ',
    'ሐምሌ',
    'ነሐሴ',
    'ጳጉሜ',
  ]
  const instrumentsList = ['በገና', 'ክራር', 'ከበሮ', 'ማሲንቆ', 'ዋሽንት']

  const [selectedYear, setSelectedYear] = useState('2018')
  const [selectedMonth, setSelectedMonth] = useState('ሐምሌ')
  const [selectedDay, setSelectedDay] = useState(1)
  const currentPeriodKey = `${selectedYear}_${selectedMonth}`
  const [attendanceSearch, setAttendanceSearch] = useState('')
  const [paymentSearch, setPaymentSearch] = useState('')
  const [infoSearch, setInfoSearch] = useState('')

  // default registration dates for mock data
  const [students, setStudents] = useState([
    {
      id: 1,
      studentNo: '001',
      name: 'ዳዊት አበበ',
      christianName: 'ገብረ ሚካኤል',
      phone: '0911223344',
      emergencyContactName: 'አበበ ተሰማ',
      emergencyContactPhone: '0911000000',
      workStatus: 'ሰራተኛ',
      churchService: 'ሰንበት ትምህርት ቤት',
      parish: 'ደብረ ብርሃን ስላሴ',
      instrumentType: 'በገና',
      duration: '3 ወር',
      chosenDay: 'ቅዳሜ',
      chosenTime: 'ጠዋት 2፡00',
      paymentAmount: 500,
      photo: '',
      status: 'active',
      examResult: '85',
      registrationDate: '2026-05-10',
      payments: { '2018_ሰኔ': true, '2018_ሐምሌ': true },
      attendance: {
        '2018_ሐምሌ': { 1: true, 2: true, 3: false, 4: true, 8: true, 9: true, 15: true },
        '2018_ሰኔ': { 1: true, 2: true, 3: true, 4: true, 5: true },
      },
    },
    {
      id: 2,
      studentNo: '002',
      name: 'ማህሌት ተስፋዬ',
      christianName: 'ወለተ ማርያም',
      phone: '0922334455',
      emergencyContactName: 'ተስፋዬ ደመቀ',
      emergencyContactPhone: '0922000000',
      workStatus: 'ተማሪ',
      churchService: 'መዘምራን',
      parish: 'ኡራኤል',
      instrumentType: 'ማሲንቆ',
      duration: '6 ወር',
      chosenDay: 'እሁድ',
      chosenTime: 'ከአዝ 8፡00',
      paymentAmount: 650,
      photo: '',
      status: 'active',
      examResult: '',
      registrationDate: '2026-06-01',
      payments: { '2018_ሰኔ': true, '2018_ሐምሌ': false },
      attendance: {
        '2018_ሐምሌ': { 1: true, 2: false, 7: true },
        '2018_ሰኔ': { 1: true, 2: true },
      },
    },
    {
      id: 3,
      studentNo: '003',
      name: 'ዮናስ ከበደ',
      christianName: 'ሀብተ ማርያም',
      phone: '0933445566',
      emergencyContactName: 'ከበደ ተሰማ',
      emergencyContactPhone: '0933000000',
      workStatus: 'ሰራተኛ',
      churchService: 'ምዕመን',
      parish: 'ቦሌ መድኃኔዓለም',
      instrumentType: 'ክራር',
      duration: '3 ወር',
      chosenDay: 'ቅዳሜ',
      chosenTime: 'ከአዝ 9፡00',
      paymentAmount: 600,
      photo: '',
      status: 'completed',
      examResult: '92',
      registrationDate: '2026-02-15',
      payments: { '2018_ግንቦት': true, '2018_ሰኔ': true },
      attendance: {
        '2018_ሰኔ': { 1: true, 2: true, 3: true },
      },
    },
  ])

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: 'የውሳኔ ማረጋገጫ',
    message: '',
    onConfirm: () => {},
  })
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const chatEndRef = useRef(null)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null)
  const [tempScores, setTempScores] = useState({})

  const [reportConfig, setReportConfig] = useState({
    show: false,
    type: 'general',
    statusFilter: 'all',
  })

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  const initialStudentState = {
    name: '',
    christianName: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    workStatus: 'ተማሪ',
    churchService: '',
    parish: '',
    instrumentType: 'በገና',
    duration: '3 ወር',
    chosenDay: '',
    chosenTime: '',
    paymentAmount: '',
    photo: '',
    status: 'active',
    examResult: '',
    registrationDate: getTodayString(),
  }
  const [newStudent, setNewStudent] = useState(initialStudentState)

  const getDaysSinceRegistration = regDateStr => {
    if (!regDateStr) return 0
    const regDate = new Date(regDateStr)
    const today = new Date()
    const diffTime = today - regDate
    if (diffTime < 0) return 0
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const getOverdueStudents = () => {
    return students.filter(student => {
      if (student.status !== 'active') return false
      const days = getDaysSinceRegistration(student.registrationDate)
      const isUnpaid = !student.payments[currentPeriodKey]
      return days >= 30 && isUnpaid
    })
  }

  const triggerConfirmation = (message, title, onConfirm) => {
    setConfirmModal({
      show: true,
      title: title || 'የውሳኔ ማረጋገጫ ሰነድ',
      message,
      onConfirm: () => {
        onConfirm()
        setConfirmModal(prev => ({ ...prev, show: false }))
      },
    })
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  const generateNextStudentNo = () => {
    if (students.length === 0) return '001'
    const maxNo = Math.max(...students.map(s => parseInt(s.studentNo || '0')))
    return String(maxNo + 1).padStart(3, '0')
  }

  const handleAddStudentSubmit = e => {
    e.preventDefault()
    if (!newStudent.name || !newStudent.phone) return

    triggerConfirmation(
      `አዲስ ተማሪ "${newStudent.name}" በመለያ ቁጥር ${generateNextStudentNo()} ለመመዝገብ መረጃው ትክክል መሆኑን ያረጋግጣሉ?`,
      'የተማሪ ምዝገባ ማረጋገጫ',
      () => {
        const nextNo = generateNextStudentNo()
        const student = { ...newStudent, id: Date.now(), studentNo: nextNo, payments: {}, attendance: {} }
        setStudents([...students, student])
        setNewStudent(initialStudentState)
        showNotification(`ተማሪው በመለያ ቁጥር ${nextNo} በተሳካ ሁኔታ ተመዝግቧል!`, 'success')
      }
    )
  }

  const askToDeleteStudent = student => {
    triggerConfirmation(
      `ተማሪ "${student.name}" (መ.ቁ: #${student.studentNo}) ከማሰልጠኛ ተቋሙ ሙሉ በሙሉ እንዲሰረዝ ይፈልጋሉ? ይህ ድርጊት ወደኋላ ሊመለስ አይችልም።`,
      'የተማሪ ስረዛ ማረጋገጫ',
      () => {
        setStudents(prev => prev.filter(s => s.id !== student.id))
        showNotification(`${student.name} ከዝርዝር ተሰርዟል።`, 'success')
        if (selectedStudentProfile?.id === student.id) {
          setSelectedStudentProfile(null)
        }
      }
    )
  }

  const handlePhotoUpload = e => {
    const file = e.target.files[0]
    if (file) {
      setNewStudent({ ...newStudent, photo: URL.createObjectURL(file) })
    }
  }

  const toggleAttendanceForDay = (studentId, periodKey, day) => {
    setStudents(prev =>
      prev.map(student => {
        if (student.id === studentId) {
          const studentAttendance = student.attendance || {}
          const periodAttendance = studentAttendance[periodKey] || {}
          const currentVal = periodAttendance[day] || false
          return {
            ...student,
            attendance: {
              ...studentAttendance,
              [periodKey]: {
                ...periodAttendance,
                [day]: !currentVal,
              },
            },
          }
        }
        return student
      })
    )
  }

  const handleToggleAttendanceWithConfirm = (student, periodKey, day) => {
    const isPresent = student.attendance?.[periodKey]?.[day] || false
    const dateText = `${selectedMonth} ${day} ቀን`
    const actionText = isPresent ? 'አልተገኘም (Absent)' : 'ተገኝቷል (Present)'

    triggerConfirmation(
      `የተማሪ "${student.name}" የዕለት መገኘት በ ${dateText} ወደ "${actionText}" እንዲቀየር ይፈልጋሉ?`,
      'የመገኘት ማስተካከያ',
      () => {
        toggleAttendanceForDay(student.id, periodKey, day)
        showNotification(`የ ${student.name} መገኘት ተስተካክሏል።`, 'success')
      }
    )
  }

  const handleCalendarDayClick = (student, day) => {
    const isPresent = student.attendance?.[currentPeriodKey]?.[day] || false
    const nextStateAmharic = isPresent ? 'እንዳልመጣ (በማቅረት)' : 'እንደመጣ (በመገኘት)'

    triggerConfirmation(
      `በ ${selectedMonth} ቀን ${day} ተማሪ "${student.name}" ${nextStateAmharic} እንዲመዘገብ ያረጋግጣሉ?`,
      'የቀን መቁጠሪያ አቴንዳንስ ማስተካከያ',
      () => {
        toggleAttendanceForDay(student.id, currentPeriodKey, day)
        setSelectedStudentProfile(prev => {
          if (!prev) return null
          const currentAtt = prev.attendance || {}
          const monthAtt = currentAtt[currentPeriodKey] || {}
          return {
            ...prev,
            attendance: {
              ...currentAtt,
              [currentPeriodKey]: {
                ...monthAtt,
                [day]: !isPresent,
              },
            },
          }
        })
        showNotification(`አቴንዳንሱ ተስተካክሏል።`, 'success')
      }
    )
  }

  const handleTogglePaymentWithConfirm = (student, periodKey) => {
    const isPaid = student.payments[periodKey] || false
    const actionText = isPaid ? 'አልከፈለም' : 'ከፍሏል'

    triggerConfirmation(
      `የተማሪ "${student.name}" የ ${selectedMonth} ክፍያ ወደ "${actionText}" እንዲቀየር ይፈልጋሉ?`,
      'የክፍያ ማረጋገጫ ሰነድ',
      () => {
        setStudents(prev =>
          prev.map(s => {
            if (s.id === student.id) {
              return {
                ...s,
                payments: {
                  ...s.payments,
                  [periodKey]: !isPaid,
                },
              }
            }
            return s
          })
        )
        showNotification(`የክፍያ ሁኔታ ተስተካክሏል።`, 'success')
      }
    )
  }

  const setStudentStatusWithConfirm = (student, newStatus) => {
    let statusAmharic = ''
    if (newStatus === 'completed') statusAmharic = 'ትምህርቱን ያጠናቀቀ (ምሩቅ)'
    else if (newStatus === 'dropped') statusAmharic = 'ትምህርቱን ያቋረጠ'
    else statusAmharic = 'በመማር ላይ ያለ (Active)'
    triggerConfirmation(
      `የተማሪ "${student.name}" የትምህርት ሁኔታ ወደ "${statusAmharic}" እንዲለወጥ ይፈልጋሉ?`,
      'የተማሪ የትምህርት ደረጃ ለውጥ',
      () => {
        setStudents(prev => prev.map(s => (s.id === student.id ? { ...s, status: newStatus } : s)))
        setSelectedStudentProfile(prev => (prev && prev.id === student.id ? { ...prev, status: newStatus } : prev))

        if (newStatus === 'completed') {
          showNotification('ተማሪው ትምህርቱን ማጠናቀቁ ተመዝግቧል!', 'success')
        } else if (newStatus === 'dropped') {
          showNotification('ተማሪው ትምህርቱን ማቋረጡ ተመዝግቧል!', 'success')
        } else {
          showNotification('ተማሪው ወደ ትምህርት ገበታ ተመልሷል!', 'success')
        }
      }
    )
  }

  const handleExamScoreSubmit = (studentId, score) => {
    const student = students.find(s => s.id === studentId)
    if (!student) return
    triggerConfirmation(`የተማሪ "${student.name}" የፈተና ውጤት ወደ ${score}% እንዲቀየር ይፈልጋሉ?`, 'የፈተና ውጤት ማረጋገጫ', () => {
      setStudents(prev => prev.map(s => (s.id === studentId ? { ...s, examResult: score } : s)))
      showNotification('ውጤቱ በተሳካ ሁኔታ ተመዝግቧል!', 'success')
    })
  }

  const triggerWindowPrint = () => window.print()

  const askAI = async e => {
    e?.preventDefault()
    if (!aiQuery.trim()) return
    setIsAiLoading(true)
    setAiResponse('')
    const userQuestion = aiQuery
    setAiQuery('')
    const apiKey = ''
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`

    const systemPrompt = `
       አንተ የ 'አታኦስ መንፈሳዊ የዜማ ማሰልጠኛ ተቋም' የበገና እና የዜማ መምህር የግል AI ረዳት ነህ።
       መምህሩን በከፍተኛ አክብሮት፣ ትህትና እና በመንፈሳዊ ስነ-ምግባር አገልግል።
       የተማሪዎች መረጃ: ${JSON.stringify(students)}. አሁን የተመረጠው ዓ.ም: ${selectedYear} እና ወር: ${selectedMonth}።
    `
    const payload = {
      contents: [{ parts: [{ text: userQuestion }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || 'ይቅርታ መምህር፣ ጥያቄዎን በሚገባ ማስተዋል አልቻልኩም።')
    } catch (error) {
      setAiResponse('ይቅርታ መምህር፣ ከበይነመረብ (Internet) ጋር መገናኘት አልተቻለም።')
    }
    setIsAiLoading(false)
  }

  const copyReportToClipboard = () => showNotification('ሪፖርቱ በፅሁፍ ኮፒ ተደርጓል!', 'success')

  const activeStudents = students.filter(s => s.status === 'active')
  const completedStudentsCount = students.filter(s => s.status === 'completed').length
  const droppedStudentsCount = students.filter(s => s.status === 'dropped').length
  const totalActive = activeStudents.length
  const totalPresentToday = activeStudents.filter(s => s.attendance?.[currentPeriodKey]?.[selectedDay]).length
  const totalPaidCurrentMonth = activeStudents.filter(s => s.payments[currentPeriodKey]).length
  const totalUnpaidCurrentMonth = totalActive - totalPaidCurrentMonth
  const totalRevenueExpected = activeStudents.reduce((sum, s) => sum + Number(s.paymentAmount || 0), 0)
  const totalRevenueCollected = activeStudents
    .filter(s => s.payments[currentPeriodKey])
    .reduce((sum, s) => sum + Number(s.paymentAmount || 0), 0)
  const overdueUnpaidCount = getOverdueStudents().length

  const renderGlobalConfirmationModal = () => {
    if (!confirmModal.show) return null
    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-[#FAF3E0] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border-4 border-[#8B5A2B] relative flex flex-col">
          <div className="h-4 bg-gradient-to-r from-[#D4AF37] via-[#8B5A2B] to-[#D4AF37] w-full" />
          <div className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#F5E6D3] rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#8B5A2B] shadow-inner">
              <EthiopianCross className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-[#3E2723] font-serif tracking-wide border-b-2 border-dashed border-[#D2B48C] pb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm font-medium text-[#4A3219] leading-relaxed py-2 px-1">{confirmModal.message}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-[#8B5A2B] border-2 border-[#D2B48C] font-bold rounded-xl transition-all active:scale-95 text-xs shadow-sm"
              >
                እመለሳለሁ (Cancel)
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 py-3 bg-[#8B5A2B] hover:bg-[#5C4033] text-white font-extrabold rounded-xl transition-all active:scale-95 text-xs shadow-md border border-[#D4AF37]"
              >
                አረጋግጣለሁ (Confirm)
              </button>
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-[#8B5A2B] via-[#D4AF37] to-[#8B5A2B] w-full" />
        </div>
      </div>
    )
  }

  const renderStudentProfileModal = () => {
    if (!selectedStudentProfile) return null
    const student = selectedStudentProfile
    const updatedStudentObj = students.find(s => s.id === student.id) || student
    const daysInMonth = selectedMonth === 'ጳጉሜ' ? 6 : 30
    const attendanceData = updatedStudentObj.attendance?.[currentPeriodKey] || {}
    const daysPresent = Object.values(attendanceData).filter(Boolean).length
    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in hide-on-print-bg">
        <div className="bg-[#FCF8F0] rounded-3xl w-full max-w-md shadow-2xl border-4 border-[#8B5A2B] max-h-[95vh] overflow-y-auto flex flex-col relative">
          <div className="bg-gradient-to-r from-[#2E1A05] via-[#4A2E12] to-[#2E1A05] p-5 rounded-t-[22px] flex justify-between items-start text-white sticky top-0 z-10 shadow-md border-b-4 border-[#D4AF37]">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {updatedStudentObj.photo ? (
                  <img
                    src={updatedStudentObj.photo}
                    alt={updatedStudentObj.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#D4AF37]"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#F5E6D3] rounded-xl flex items-center justify-center border-2 border-[#D4AF37] text-[#8B5A2B]">
                    <User size={32} />
                  </div>
                )}
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#2E1A05] p-0.5 rounded-full border border-white">
                  <EthiopianCross className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black font-serif leading-tight text-[#FFF8E7]">{updatedStudentObj.name}</h3>
                <p className="text-xs text-[#D4AF37] font-bold mt-0.5">
                  {' '}
                  ክ.ስ: {updatedStudentObj.christianName || '-'}
                </p>
                <p className="text-[10px] bg-black/40 inline-block px-2 py-0.5 rounded mt-1">
                  {' '}
                  መ.ቁ: #{updatedStudentObj.studentNo}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStudentProfile(null)}
              className="p-1.5 bg-[#FAF3E0]/10 hover:bg-white/20 rounded-full text-[#D4AF37]"
            >
              <X size={20} />
            </button>
          </div>
          <div className="bg-gradient-to-r from-[#D4AF37] via-[#8B5A2B] to-[#D4AF37] h-1.5" />
          <div className="p-5 space-y-4">
            <div
              className={`p-3 rounded-xl border flex items-center justify-between shadow-sm ${
                updatedStudentObj.status === 'completed'
                  ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                  : updatedStudentObj.status === 'dropped'
                  ? 'bg-[#FFEBEE] border-[#EF9A9A] text-[#C62828]'
                  : 'bg-[#E3F2FD] border-[#90CAF9] text-[#1565C0]'
              }`}
            >
              <span className="font-bold text-xs flex items-center">
                {updatedStudentObj.status === 'completed' ? (
                  <>
                    <Award size={18} className="mr-2" /> ትምህርቱን ያጠናቀቀ{' '}
                  </>
                ) : updatedStudentObj.status === 'dropped' ? (
                  <>
                    <UserMinus size={18} className="mr-2" /> ትምህርቱን ያቋረጠ{' '}
                  </>
                ) : (
                  <>
                    <BookOpen size={18} className="mr-2" /> በመማር ላይ ያለ (Active)
                  </>
                )}
              </span>
              {updatedStudentObj.examResult && (
                <span className="text-xs font-black bg-white px-2 py-1 rounded shadow-sm text-gray-700">
                  {' '}
                  ውጤት: {updatedStudentObj.examResult}%
                </span>
              )}
            </div>

            <div className="bg-amber-50 rounded-2xl p-3 border border-[#EADDCA] text-xs flex justify-between items-center text-[#5C4033]">
              <span className="font-bold flex items-center">
                <Calendar size={14} className="mr-1.5 text-[#8B5A2B]" /> የተመዘገቡበት ቀን፦
              </span>
              <span className="font-mono font-black bg-white px-2.5 py-1 rounded-lg border border-[#EADDCA] shadow-sm">
                {updatedStudentObj.registrationDate || 'ያልተጠቀሰ'}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-[#EADDCA] shadow-sm relative">
              <div className="absolute top-1 left-1 opacity-15">
                <EthiopianCross className="w-5 h-5 text-[#8B5A2B]" />
              </div>
              <div className="absolute top-1 right-1 opacity-15">
                <EthiopianCross className="w-5 h-5 text-[#8B5A2B]" />
              </div>
              <div className="flex justify-between items-center border-b border-[#EADDCA] pb-2 mb-3">
                <div className="flex flex-col">
                  <h4 className="text-xs font-extrabold text-[#5C4033] flex items-center">
                    <Calendar size={14} className="mr-1 text-[#8B5A2B]" /> የ {selectedMonth} ወር መገኘት
                  </h4>
                  <p className="text-[9px] text-[#8B5A2B]/80 italic mt-0.5 font-bold"> ማስተካከያ፦ ቀኑን በመንካት መገኘትን ይለውጡ </p>
                </div>
                <span className="text-[10px] bg-[#FAF3E0] text-[#8B5A2B] px-2 py-0.5 rounded-full font-bold border border-[#D2B48C]">
                  ድምር: {daysPresent} ቀን
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center pt-1">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const isPresent = attendanceData[day]
                  return (
                    <button
                      key={day}
                      onClick={() => handleCalendarDayClick(updatedStudentObj, day)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border-2 transition-all active:scale-95 ${
                        isPresent
                          ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32] hover:bg-green-100'
                          : 'bg-[#FCFAF2] border-gray-200 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-[10px] font-extrabold leading-none">{day}</span>
                      {isPresent ? (
                        <Check size={12} className="mt-1 text-green-700" strokeWidth={3} />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm">
              <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center">
                <User size={14} className="mr-1" /> የግል እና አድራሻ መረጃ{' '}
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5"> የራስ ስልክ </p>
                  <p className="font-bold text-[#3E2723]">{updatedStudentObj.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5"> የስራ ሁኔታ </p>
                  <p className="font-bold text-[#3E2723]">{updatedStudentObj.workStatus || '-'}</p>
                </div>
                <div className="col-span-2 bg-[#F9F6F0] p-2 rounded-lg border border-[#EADDCA]">
                  <p className="text-gray-500 mb-0.5 flex items-center">
                    <PhoneCall size={12} className="mr-1 text-[#8B5A2B]" /> የቅርብ ተጠሪ{' '}
                  </p>
                  <p className="font-bold text-[#3E2723]">
                    {updatedStudentObj.emergencyContactName || '-'}{' '}
                    <span className="text-[#8B5A2B]">({updatedStudentObj.emergencyContactPhone || '-'})</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm">
              <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center">
                <Church size={14} className="mr-1" /> መንፈሳዊ ህይወት መረጃ{' '}
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5"> የመጡበት አጥቢያ </p>
                  <p className="font-bold text-[#3E2723]">{updatedStudentObj.parish || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5"> አገልግሎት ክፍል </p>
                  <p className="font-bold text-[#3E2723]">{updatedStudentObj.churchService || '-'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#EADDCA] shadow-sm">
              <h4 className="text-xs font-black text-[#8B5A2B] border-b border-[#EADDCA] pb-2 mb-3 flex items-center">
                <BookOpen size={14} className="mr-1" /> የትምህርት እና ክፍያ መረጃ{' '}
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <div>
                  <p className="text-gray-500 mb-0.5"> የመሳሪያ አይነት </p>
                  <p className="font-bold text-[#3E2723] bg-[#F5E6D3] inline-block px-2 py-0.5 rounded">
                    {updatedStudentObj.instrumentType || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5"> የጊዜ ርቀት </p>
                  <p className="font-bold text-[#3E2723]">{updatedStudentObj.duration || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-0.5 flex items-center">
                    <Clock size={12} className="mr-1" /> የተመረጠ ቀን እና ሰዓት{' '}
                  </p>
                  <p className="font-bold text-[#3E2723]">
                    {updatedStudentObj.chosenDay || '-'} <span className="mx-1">|</span>{' '}
                    {updatedStudentObj.chosenTime || '-'}
                  </p>
                </div>
                {updatedStudentObj.status === 'active' && (
                  <div className="col-span-2 mt-2 pt-2 border-t border-dashed border-[#EADDCA] flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="font-bold text-gray-600">
                      {' '}
                      የ {selectedMonth} ክፍያ ({updatedStudentObj.paymentAmount || 0} ብር)፦{' '}
                    </span>
                    {updatedStudentObj.payments[currentPeriodKey] ? (
                      <span className="text-green-700 font-black bg-green-100 px-2 py-1 rounded"> ከፍሏል ✓</span>
                    ) : (
                      <span className="text-red-700 font-black bg-red-100 px-2 py-1 rounded"> አልከፈለም ✗ </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderReportModal = () => {
    if (!reportConfig.show) return null

    let displayedStudentsForReport = [...students]
    if (reportConfig.statusFilter !== 'all') {
      displayedStudentsForReport = students.filter(s => s.status === reportConfig.statusFilter)
    }

    const filterTitles = {
      all: 'የሁሉም ተማሪዎች',
      active: 'በትምህርት ገበታ ላይ ያሉ (Active) ተማሪዎች',
      completed: 'ትምህርታቸውን ያጠናቀቁ (ምሩቃን)',
      dropped: 'ትምህርት ያቋረጡ (የቆረጡ)',
    }

    return (
      <div className="fixed inset-0 bg-white z-[150] overflow-y-auto hide-on-print-bg">
        <div className="sticky top-0 bg-[#3E2723] text-white p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shadow-md hide-on-print z-50 border-b-4 border-[#D4AF37]">
          <div className="flex items-center space-x-2">
            <BegenaIcon className="w-6 h-6 text-[#D4AF37]" />
            <span className="font-bold font-serif text-[#FFF8E7] text-sm sm:text-base">የክፍል ሪፖርት ማመንጫ ማሽን</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#D4AF37] font-bold">ሪፖርት ለይቶ ማውጫ፦</span>
            <div className="bg-[#FAF3E0]/15 p-1 rounded-lg flex gap-1 border border-white/20">
              <button
                onClick={() => setReportConfig(prev => ({ ...prev, statusFilter: 'all' }))}
                className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                  reportConfig.statusFilter === 'all' ? 'bg-[#8B5A2B] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                ሁሉንም
              </button>
              <button
                onClick={() => setReportConfig(prev => ({ ...prev, statusFilter: 'active' }))}
                className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                  reportConfig.statusFilter === 'active' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                በመማር ላይ (Active)
              </button>
              <button
                onClick={() => setReportConfig(prev => ({ ...prev, statusFilter: 'dropped' }))}
                className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                  reportConfig.statusFilter === 'dropped' ? 'bg-red-700 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                የቆረጡ (Dropped)
              </button>
              <button
                onClick={() => setReportConfig(prev => ({ ...prev, statusFilter: 'completed' }))}
                className={`px-2 py-1 rounded text-[10px] font-black transition-colors ${
                  reportConfig.statusFilter === 'completed'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ምሩቃን
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={copyReportToClipboard}
              className="bg-[#8B5A2B] hover:bg-[#5C4033] px-3 py-2 rounded-lg text-xs font-bold flex items-center"
            >
              <Copy size={14} className="mr-1" /> ኮፒ{' '}
            </button>
            <button
              onClick={triggerWindowPrint}
              className="bg-[#006400] hover:bg-green-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center"
            >
              <Printer size={16} className="mr-1" /> አትም{' '}
            </button>
            <button
              onClick={() => setReportConfig({ show: false, type: 'general', statusFilter: 'all' })}
              className="bg-red-600 px-3 py-2 rounded-lg ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div id="printable-area" className="max-w-4xl mx-auto bg-white text-black p-8 font-serif">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
            <div className="flex justify-center mb-2">
              <EthiopianCross className="w-10 h-10 text-[#8B5A2B]" />
            </div>
            <h2 className="text-2xl font-black mb-1"> አታኦስ መንፈሳዊ የዜማ ማሰልጠኛ ተቋም </h2>
            <h3 className="text-lg font-bold text-[#8B5A2B]">
              {filterTitles[reportConfig.statusFilter]} -{' '}
              {reportConfig.type === 'general'
                ? 'አጠቃላይ ሪፖርት'
                : reportConfig.type === 'attendance'
                ? 'የመገኘት ሪፖርት'
                : reportConfig.type === 'payment'
                ? 'የክፍያ ሪፖርት'
                : 'ሁኔታና ውጤት ሪፖርት'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {' '}
              ዓ.ም: {selectedYear} | ወር: {selectedMonth} | ቀን: {new Date().toLocaleDateString('am-ET')}
            </p>
          </div>
          {reportConfig.type === 'general' && (
            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-base font-black border-b border-gray-300 mb-3 pb-1"> ማጠቃለያ </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <span className="font-bold"> በዚህ ሪፖርት ላይ ያሉ ተማሪዎች ድምር:</span> {displayedStudentsForReport.length}{' '}
                    ተማሪ
                  </p>
                  <p>
                    <span className="font-bold"> በመማር ላይ ያሉ ድምር:</span>{' '}
                    {displayedStudentsForReport.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-bold"> ክፍያ የፈጸሙ:</span>{' '}
                    {
                      displayedStudentsForReport.filter(s => s.status === 'active' && s.payments[currentPeriodKey])
                        .length
                    }
                  </p>
                  <p>
                    <span className="font-bold"> ትምህርት ያቋረጡ (የቆረጡ):</span>{' '}
                    {displayedStudentsForReport.filter(s => s.status === 'dropped').length}
                  </p>
                </div>
              </div>
            </div>
          )}
          <table className="w-full border-collapse border border-gray-300 text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 p-2"> መ.ቁ </th>
                <th className="border border-gray-300 p-2"> ሙሉ ስም </th>
                <th className="border border-gray-300 p-2"> ስልክ </th>
                <th className="border border-gray-300 p-2"> የተመዘገቡበት ቀን </th>
                <th className="border border-gray-300 p-2"> መሳሪያ </th>
                {reportConfig.type !== 'academic' && (
                  <>
                    {(reportConfig.type === 'general' || reportConfig.type === 'payment') && (
                      <th className="border border-gray-300 p-2"> የ {selectedMonth} ክፍያ </th>
                    )}
                    {(reportConfig.type === 'general' || reportConfig.type === 'attendance') && (
                      <th className="border border-gray-300 p-2 text-center"> መገኘት (ቀናት)</th>
                    )}
                  </>
                )}
                {reportConfig.type === 'academic' && (
                  <>
                    <th className="border border-gray-300 p-2 text-center"> ሁኔታ </th>
                    <th className="border border-gray-300 p-2 text-center"> ውጤት </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedStudentsForReport.map((s, idx) => {
                const monthAttendanceCount = s.attendance?.[currentPeriodKey]
                  ? Object.values(s.attendance[currentPeriodKey]).filter(Boolean).length
                  : 0
                return (
                  <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-2 font-bold">{s.studentNo}</td>
                    <td className="border border-gray-300 p-2 font-bold">{s.name}</td>
                    <td className="border border-gray-300 p-2">{s.phone}</td>
                    <td className="border border-gray-300 p-2 font-mono text-[11px]">{s.registrationDate || '-'}</td>
                    <td className="border border-gray-300 p-2">{s.instrumentType || '-'}</td>
                    {reportConfig.type !== 'academic' && (
                      <>
                        {(reportConfig.type === 'general' || reportConfig.type === 'payment') && (
                          <td className="border border-gray-300 p-2 font-black">
                            {s.status === 'active' ? (
                              s.payments[currentPeriodKey] ? (
                                <span className="text-green-700"> ከፍሏል </span>
                              ) : (
                                <span className="text-red-700"> አልከፈለም </span>
                              )
                            ) : (
                              <span className="text-gray-400 italic">አይመለከትም</span>
                            )}
                          </td>
                        )}
                        {(reportConfig.type === 'general' || reportConfig.type === 'attendance') && (
                          <td className="border border-gray-300 p-2 font-bold text-center">{monthAttendanceCount}</td>
                        )}
                      </>
                    )}
                    {reportConfig.type === 'academic' && (
                      <>
                        <td className="border border-gray-300 p-2 text-center font-bold">
                          {s.status === 'completed' ? (
                            <span className="text-green-700"> ያጠናቀቀ </span>
                          ) : s.status === 'dropped' ? (
                            <span className="text-red-700"> ያቋረጠ </span>
                          ) : (
                            <span className="text-blue-700"> በመማር ላይ </span>
                          )}
                        </td>
                        <td className="border border-gray-300 p-2 text-center font-bold">
                          {s.examResult ? `${s.examResult}%` : '-'}
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
              {displayedStudentsForReport.length === 0 && (
                <tr>
                  <td colSpan="8" className="border border-gray-300 p-6 text-center text-gray-400 italic">
                    የተመረጠውን ማጣሪያ የሚያሟላ የተማሪ መረጃ አልተገኘም።
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-16 flex justify-between items-center text-sm font-bold border-t-2 border-black pt-4">
            <p> አታኦስ በገና አስተዳደር </p>
            <p> ፊርማ: __________________</p>
          </div>
        </div>
      </div>
    )
  }

  const renderDashboardView = () => {
    const overdueList = getOverdueStudents()

    return (
      <div className="p-5 space-y-6 animate-fade-in pb-12 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-black text-[#2E1A05] font-serif flex items-center gap-1.5">
              <EthiopianCross className="w-5 h-5 text-[#8B5A2B]" /> ሰላም መምህር!
            </h2>
            <p className="text-xs text-[#8B5A2B] font-bold mt-1"> የዕለቱ የትምህርት ቤት ማጠቃለያ ሰነድ </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => setReportConfig({ show: true, type: 'general', statusFilter: 'all' })}
              className="bg-[#8B5A2B] hover:bg-[#5C4033] text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1 border border-[#D4AF37]"
              title="ሪፖርት አውጣ (PDF)"
            >
              <Printer size={18} />
              <span className="text-xs font-bold px-1 hidden sm:inline"> አትም </span>
            </button>
            <div className="flex space-x-1">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="appearance-none bg-white border border-[#C19A6B] text-[#5C4033] text-xs font-bold py-2 pl-2 pr-6 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                >
                  {ethiopianYears.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1 top-2.5 text-[#8B5A2B] pointer-events-none" size={12} />
              </div>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-[#F5E6D3] border border-[#C19A6B] text-[#5C4033] text-xs font-bold py-2 pl-2 pr-6 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                >
                  {ethiopianMonths.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1 top-2.5 text-[#8B5A2B] pointer-events-none" size={12} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center opacity-40 my-1">
          <span className="text-xs text-[#8B5A2B]"> ✥ ✥ ✥ </span>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#8B5A2B] to-transparent flex-1 mx-2" />
          <span className="text-xs text-[#8B5A2B]"> ✥ ✥ ✥ </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div
            onClick={() => {
              setActiveTab('academic')
              setAcademicViewType('active')
            }}
            className="cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl p-4 text-[#2E1A05] shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#8B5A2B] transition-colors transform hover:-translate-y-1"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03]">
              <BookOpen size={64} />
            </div>
            <BookOpen size={24} className="mb-2 text-[#8B5A2B]" />
            <span className="text-3xl font-black font-serif">{totalActive}</span>
            <span className="text-[10px] font-bold mt-1 text-gray-500"> በመማር ላይ ያሉ </span>
          </div>
          <div
            onClick={() => {
              setActiveTab('academic')
              setAcademicViewType('completed')
            }}
            className="cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl p-4 text-[#2E1A05] shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-green-600 transition-colors transform hover:-translate-y-1"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03]">
              <Award size={64} />
            </div>
            <Award size={24} className="mb-2 text-green-700" />
            <span className="text-3xl font-black font-serif">{completedStudentsCount}</span>
            <span className="text-[10px] font-bold mt-1 text-gray-500"> ያጠናቀቁ (ምሩቃን)</span>
          </div>
          <div
            onClick={() => {
              setActiveTab('academic')
              setAcademicViewType('dropped')
            }}
            className="cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl p-4 text-[#2E1A05] shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-red-600 transition-colors transform hover:-translate-y-1"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03]">
              <UserMinus size={64} />
            </div>
            <UserMinus size={24} className="mb-2 text-red-700" />
            <span className="text-3xl font-black font-serif">{droppedStudentsCount}</span>
            <span className="text-[10px] font-bold mt-1 text-gray-500"> ያቋረጡ ተማሪዎች </span>
          </div>
          <div
            onClick={() => setActiveTab('attendance')}
            className="cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl p-4 text-[#2E1A05] shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-green-600 transition-colors transform hover:-translate-y-1"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03]">
              <CheckSquare size={64} />
            </div>
            <CheckSquare size={24} className="mb-2 text-green-700" />
            <span className="text-3xl font-black font-serif">{totalPresentToday}</span>
            <span className="text-[10px] font-bold mt-1 text-gray-500"> ዛሬ የተገኙ </span>
          </div>
          <div
            onClick={() => setActiveTab('payments')}
            className="cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl p-4 text-[#2E1A05] shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-[#D4AF37] transition-colors transform hover:-translate-y-1"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03]">
              <CreditCard size={64} />
            </div>
            <CreditCard size={24} className="mb-2 text-[#D4AF37]" />
            <span className="text-3xl font-black font-serif">{totalPaidCurrentMonth}</span>
            <span className="text-[10px] font-bold mt-1 text-gray-500"> የከፈሉ ({selectedMonth})</span>
          </div>
          <div
            onClick={() => setActiveTab('payments')}
            className="cursor-pointer bg-white/95 backdrop-blur-sm rounded-3xl p-4 text-[#2E1A05] shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center relative overflow-hidden hover:border-red-600 transition-colors transform hover:-translate-y-1"
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03]">
              <XCircle size={64} />
            </div>
            <XCircle size={24} className="mb-2 text-red-700" />
            <span className="text-3xl font-black font-serif">{totalUnpaidCurrentMonth}</span>
            <span className="text-[10px] font-bold mt-1 text-gray-500"> ያልከፈሉ ({selectedMonth})</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#D4AF37] via-[#8B5A2B] to-[#D4AF37] p-[2px] rounded-3xl shadow-lg mt-4">
          <div className="bg-[#FAF3E0] rounded-[22px] p-5 relative overflow-hidden h-full border border-white">
            <div className="absolute -right-4 -top-4 opacity-[0.08] text-[#8B5A2B]">
              <Sparkles size={100} />
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-[#8B5A2B] p-1.5 rounded-lg text-white shadow-sm">
                <Quote size={16} />
              </div>
              <h3 className="font-bold text-[#5C4033] text-sm font-serif flex items-center gap-1">
                የ AI ረዳት መዘክር <EthiopianCross className="w-4 h-4 text-[#D4AF37]" />
              </h3>
            </div>
            <p className="text-sm text-[#3E2723] leading-relaxed font-medium relative z-10">
              መምህር ሆይ፣ በዚህ ዓመተ ምሕረት (<span className="font-bold text-[#8B5A2B]">{selectedYear}</span>) እና በ{' '}
              <span className="font-bold text-[#8B5A2B]">{selectedMonth}</span> ወር በአጠቃላይ
              <span className="font-bold text-[#8B5A2B]"> {totalActive} </span> ተማሪዎችን በዜማ ማሰልጠኛዎ እያስተማሩ ይገኛሉ። ከነዚህም ውስጥ{' '}
              <span className="font-bold text-red-700">{totalUnpaidCurrentMonth}</span> ተማሪዎች የዚህን ወር ክፍያ ገና አላጠናቀቁም። ዛሬ{' '}
              <span className="font-bold text-green-700">{totalPresentToday}</span> ተማሪዎች በትምህርት ገበታቸው ላይ ተገኝተዋል።
              እግዚአብሔር ያበርታዎት!
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#3E2723] to-[#2E1A05] p-6 rounded-3xl shadow-lg border-2 border-[#D4AF37] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <EthiopianCross className="w-32 h-32 text-[#D4AF37] transform rotate-12 translate-x-4 -translate-y-4" />
          </div>
          <div className="flex items-center space-x-3 mb-5 border-b border-[#5C4033] pb-4 relative z-10">
            <div className="bg-[#8B5A2B] p-2 rounded-xl border border-[#D4AF37]">
              <Banknote size={20} className="text-[#F5E6D3]" />
            </div>
            <h3 className="font-bold text-lg font-serif tracking-wider text-[#FFF8E7]"> የማሰልጠኛው የገንዘብ ሰነድ </h3>
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center px-2">
              <span className="text-[#D7CCC8] text-sm font-bold flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] mr-2"></div> የሚጠበቅ ጠቅላላ ገቢ{' '}
              </span>
              <span className="text-[#FFD700] font-black font-serif text-lg">
                {totalRevenueExpected} <span className="text-xs font-normal"> ብር </span>
              </span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[#D7CCC8] text-sm font-bold flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div> የተሰበሰበ ገቢ{' '}
              </span>
              <span className="text-green-400 font-black font-serif text-lg">
                {totalRevenueCollected} <span className="text-xs font-normal"> ብር </span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border-2 border-red-200 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-red-500/5 pointer-events-none">
            <AlertCircle size={120} />
          </div>
          <div className="flex items-center space-x-3 border-b border-red-100 pb-3 mb-4">
            <div className="bg-red-500 p-2 rounded-xl text-white shadow-md animate-pulse">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm text-red-900 font-serif">የክፍያ ጊዜያቸው ያለፈባቸው ተማሪዎች ማስታወቂያ</h3>
              <p className="text-[10px] text-red-600/80 font-bold">
                ከተመዘገቡ ወይም ከከፈሉ ወር የሞላቸውና ክፍያ ያልፈጸሙ ({overdueUnpaidCount})
              </p>
            </div>
          </div>

          {overdueList.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {overdueList.map(student => {
                const days = getDaysSinceRegistration(student.registrationDate)
                return (
                  <div
                    key={student.id}
                    className="bg-red-50/70 border border-red-100 rounded-2xl p-3 flex justify-between items-center transition-all hover:bg-red-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-800 font-black text-xs">
                        #{student.studentNo}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#3E2723]">{student.name}</h4>
                        <p className="text-[9px] text-red-700 font-bold mt-0.5">
                          ከተመዘገቡ፦ <span className="font-mono">{days}</span> ቀናት አልፈዋል (ክፍያ የለም)
                        </p>
                        <p className="text-[9px] text-gray-500">ስልክ፦ {student.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTogglePaymentWithConfirm(student, currentPeriodKey)}
                      className="bg-red-700 hover:bg-red-800 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1"
                    >
                      <CreditCard size={12} /> ክፍያ መዝግብ
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 bg-green-50/50 rounded-2xl border border-green-100 text-green-800">
              <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
              <p className="text-xs font-black">ክብር ለእግዚአብሔር ይሁን! በዚህ ወር የክፍያ ጊዜው ያለፈበት ተማሪ የለም።</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderRegistrationView = () => (
    <div className="p-5 animate-fade-in pb-12 relative z-10">
      <h2 className="text-2xl font-black text-[#2E1A05] font-serif mb-1 flex items-center gap-2">
        <EthiopianCross className="w-6 h-6 text-[#8B5A2B]" /> የመመዝገቢያ ቃል ኪዳን
      </h2>
      <p className="text-xs text-[#8B5A2B] font-bold mb-5 pl-8"> አታኦስ መንፈሳዊ የዜማ እና የበገና ማሰልጠኛ ተቋም </p>
      <form onSubmit={handleAddStudentSubmit} className="space-y-5">
        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-3xl shadow-sm border-2 border-[#EADDCA] flex flex-col items-center justify-center">
          <label className="relative cursor-pointer w-24 h-24 bg-[#F5E6D3] rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-[#C19A6B] hover:border-[#8B5A2B] transition-all mb-2">
            {newStudent.photo ? (
              <img src={newStudent.photo} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#8B5A2B]">
                <Camera size={24} className="mb-1" />
                <span className="text-[10px] font-bold"> ፎቶ ያክሉ </span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
        <div className="bg-[#FAF3E0]/95 backdrop-blur-sm p-5 rounded-3xl shadow-sm border-2 border-[#D2B48C]">
          <h3 className="font-extrabold text-[#3E2723] border-b-2 border-dashed border-[#D2B48C] pb-2 mb-4 text-sm flex items-center">
            <User size={16} className="mr-2 text-[#8B5A2B]" /> የተመዝጋቢው የግል መረጃ{' '}
          </h3>
          <div className="space-y-4">
            <div className="bg-amber-50/60 p-3 rounded-2xl border border-[#D2B48C] mb-2">
              <label className="block text-xs font-black text-[#5C4033] mb-1.5 ml-1 flex items-center">
                <Calendar size={14} className="mr-1.5 text-[#8B5A2B]" /> የተመዘገቡበትን ቀን ይምረጡ{' '}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-[#D2B48C] text-xs font-bold text-[#3E2723] focus:ring-1 focus:ring-[#8B5A2B] focus:outline-none"
                value={newStudent.registrationDate}
                onChange={e => setNewStudent({ ...newStudent, registrationDate: e.target.value })}
              />
              <p className="text-[10px] text-gray-500 mt-1 pl-1">ይህ ቀን የተማሪውን የወር ክፍያ ማሳሰቢያ ዑደት ለማስላት በቁልፍነት ያገለግላል።</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1">
                {' '}
                ሙሉ ስም <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm font-bold text-[#3E2723]"
                value={newStudent.name}
                onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> የክርስትና ስም </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm font-bold text-[#3E2723]"
                value={newStudent.christianName}
                onChange={e => setNewStudent({ ...newStudent, christianName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1">
                {' '}
                ስልክ ቁጥር <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm font-bold text-[#3E2723]"
                value={newStudent.phone}
                onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> የቅርብ ተጠሪ ስም </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm"
                  value={newStudent.emergencyContactName}
                  onChange={e => setNewStudent({ ...newStudent, emergencyContactName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> የቅርብ ተጠሪ ስልክ </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm"
                  value={newStudent.emergencyContactPhone}
                  onChange={e => setNewStudent({ ...newStudent, emergencyContactPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#5C4033] mb-2 ml-1"> የስራ ሁኔታ </label>
              <div className="flex space-x-6 px-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-[#3E2723] cursor-pointer">
                  <input
                    type="radio"
                    name="workStatus"
                    value="ተማሪ"
                    checked={newStudent.workStatus === 'ተማሪ'}
                    onChange={e => setNewStudent({ ...newStudent, workStatus: e.target.value })}
                    className="accent-[#8B5A2B] w-4 h-4"
                  />
                  <span> ተማሪ </span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-bold text-[#3E2723] cursor-pointer">
                  <input
                    type="radio"
                    name="workStatus"
                    value="ሰራተኛ"
                    checked={newStudent.workStatus === 'ሰራተኛ'}
                    onChange={e => setNewStudent({ ...newStudent, workStatus: e.target.value })}
                    className="accent-[#8B5A2B] w-4 h-4"
                  />
                  <span> ሰራተኛ </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FAF3E0]/95 backdrop-blur-sm p-5 rounded-3xl shadow-sm border-2 border-[#D2B48C]">
          <h3 className="font-extrabold text-[#3E2723] border-b-2 border-dashed border-[#D2B48C] pb-2 mb-4 text-sm flex items-center">
            <Church size={16} className="mr-2 text-[#8B5A2B]" /> መንፈሳዊ ህይወት መረጃ{' '}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> አገልግሎት ክፍል (ካለዎት)</label>
              <input
                type="text"
                placeholder="ምሳሌ፦ መዘምራን፣ ሰንበት ተማሪ"
                className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm text-[#3E2723]"
                value={newStudent.churchService}
                onChange={e => setNewStudent({ ...newStudent, churchService: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> የመጡበት አጥቢያ ደብር </label>
              <input
                type="text"
                placeholder="ምሳሌ፦ ቅድስት ማርያም"
                className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm text-[#3E2723]"
                value={newStudent.parish}
                onChange={e => setNewStudent({ ...newStudent, parish: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="bg-[#FAF3E0]/95 backdrop-blur-sm p-5 rounded-3xl shadow-sm border-2 border-[#D2B48C]">
          <h3 className="font-extrabold text-[#3E2723] border-b-2 border-dashed border-[#D2B48C] pb-2 mb-4 text-sm flex items-center">
            <BookOpen size={16} className="mr-2 text-[#8B5A2B]" /> የዜማ ትምህርት ምርጫ{' '}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1 flex items-center">
                <Music size={12} className="mr-1" /> የዜማ መሳሪያ አይነት{' '}
              </label>
              <div className="relative">
                <select
                  value={newStudent.instrumentType}
                  onChange={e => setNewStudent({ ...newStudent, instrumentType: e.target.value })}
                  className="appearance-none w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                >
                  {instrumentsList.map(inst => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-[#8B5A2B] pointer-events-none" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C4033] mb-2 ml-1 mt-2"> የትምህርት ቆይታ ርቀት </label>
              <div className="flex flex-wrap gap-4 px-2">
                {['3 ወር', '6 ወር', '9 ወር'].map(dur => (
                  <label
                    key={dur}
                    className="flex items-center space-x-1.5 text-sm font-bold text-[#3E2723] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={dur}
                      checked={newStudent.duration === dur}
                      onChange={e => setNewStudent({ ...newStudent, duration: e.target.value })}
                      className="accent-[#8B5A2B] w-4 h-4"
                    />
                    <span>{dur}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> የመረጡት የትምህርት እለት </label>
                <input
                  type="text"
                  placeholder="ምሳሌ፦ ቅዳሜ"
                  className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm text-[#3E2723] font-bold"
                  value={newStudent.chosenDay}
                  onChange={e => setNewStudent({ ...newStudent, chosenDay: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> የመረጡት ሰዓት </label>
                <input
                  type="text"
                  placeholder="ምሳሌ፦ ጠዋት 2፡00"
                  className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm text-[#3E2723] font-bold"
                  value={newStudent.chosenTime}
                  onChange={e => setNewStudent({ ...newStudent, chosenTime: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-2 border-t-2 border-dashed border-[#D2B48C] mt-4">
              <label className="block text-xs font-bold text-[#5C4033] mb-1.5 ml-1"> ወርሃዊ መዋጮ (ብር)</label>
              <input
                type="number"
                required
                placeholder="500"
                className="w-full px-4 py-3 bg-white/90 rounded-xl border border-[#D2B48C] text-sm font-bold text-[#2E1A05]"
                value={newStudent.paymentAmount}
                onChange={e => setNewStudent({ ...newStudent, paymentAmount: e.target.value })}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#8B5A2B] via-[#4A2E12] to-[#5C4033] text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl hover:border-[#D4AF37] border border-transparent transition-all active:scale-95 mt-4 text-sm font-serif tracking-widest relative z-10"
        >
          የተማሪውን ሰነድ መዝግብ
        </button>
      </form>
    </div>
  )

  const renderAcademicView = () => {
    const filteredInfoStudents = students.filter(
      s =>
        s.status === academicViewType &&
        (s.name.toLowerCase().includes(infoSearch.toLowerCase()) || (s.studentNo && s.studentNo.includes(infoSearch)))
    )
    return (
      <div className="p-5 animate-fade-in pb-12 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-[#2E1A05] font-serif leading-tight">
            {' '}
            የተማሪዎች ሁኔታ መዝገብ <br />
            <span className="text-xs text-[#8B5A2B] font-bold"> የፈተና ውጤት እና ድርጊቶች </span>
          </h2>
          <button
            onClick={() => setReportConfig({ show: true, type: 'academic', statusFilter: 'all' })}
            className="flex items-center gap-1 bg-[#8B5A2B] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-[#5C4033] border border-[#D4AF37] transition-colors"
          >
            <FileText size={14} /> ሪፖርት
          </button>
        </div>
        <div className="flex p-1 bg-[#F5E6D3]/90 backdrop-blur-sm rounded-xl mb-5 border-2 border-[#D2B48C] overflow-x-auto">
          <button
            onClick={() => setAcademicViewType('active')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center min-w-[90px] ${
              academicViewType === 'active'
                ? 'bg-[#8B5A2B] text-white shadow-sm'
                : 'text-[#8B5A2B]/80 hover:bg-white/50'
            }`}
          >
            <BookOpen size={14} className="mr-1" /> በመማር ላይ
          </button>
          <button
            onClick={() => setAcademicViewType('completed')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center min-w-[90px] ${
              academicViewType === 'completed'
                ? 'bg-green-700 text-white shadow-sm'
                : 'text-[#8B5A2B]/80 hover:bg-white/50'
            }`}
          >
            <Award size={14} className="mr-1" /> ያጠናቀቁ
          </button>
          <button
            onClick={() => setAcademicViewType('dropped')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center min-w-[90px] ${
              academicViewType === 'dropped' ? 'bg-red-700 text-white shadow-sm' : 'text-[#8B5A2B]/80 hover:bg-white/50'
            }`}
          >
            <UserMinus size={14} className="mr-1" /> ያቋረጡ
          </button>
        </div>
        <div className="relative mb-5">
          <Search size={18} className="absolute left-3 top-3.5 text-[#8B5A2B]/60" />
          <input
            type="text"
            placeholder="በስም ወይም በመለያ ቁጥር ይፈልጉ..."
            value={infoSearch}
            onChange={e => setInfoSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/95 border-2 border-[#EADDCA] rounded-xl text-sm font-bold shadow-sm"
          />
        </div>
        <div className="space-y-4">
          {filteredInfoStudents.map(student => (
            <div
              key={student.id}
              className="p-4 bg-[#FAF8F2]/95 backdrop-blur-sm rounded-3xl shadow-sm border-2 border-[#EADDCA] relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 opacity-[0.04] pointer-events-none">
                <EthiopianCross className="w-24 h-24 text-[#8B5A2B]" />
              </div>
              <div
                onClick={() => setSelectedStudentProfile(student)}
                className="flex items-center space-x-3 cursor-pointer mb-3 pb-3 border-b border-gray-200 relative z-10"
              >
                <div className="relative">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D2B48C]"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#F5E6D3] rounded-full flex items-center justify-center border-2 border-[#D2B48C]">
                      <User size={20} className="text-[#8B5A2B]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-[#2E1A05] text-sm">
                    {student.name} <span className="text-[10px] text-gray-500 font-normal">#{student.studentNo}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-[9px] text-[#8B5A2B] font-bold bg-[#F5E6D3] px-2 py-0.5 rounded">
                      {student.instrumentType}
                    </span>
                    <span className="text-[9px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-mono">
                      መዝገብ፦ {student.registrationDate || '-'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    askToDeleteStudent(student)
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2 relative z-10">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1"> የፈተና ውጤት (%)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="ውጤት"
                      value={tempScores[student.id] !== undefined ? tempScores[student.id] : student.examResult || ''}
                      onChange={e => setTempScores({ ...tempScores, [student.id]: e.target.value })}
                      className="w-2/3 px-2 py-1.5 bg-white border border-[#D2B48C] rounded-lg text-sm font-bold text-center focus:ring-1 focus:ring-[#8B5A2B]"
                    />
                    <button
                      onClick={() => {
                        const enteredScore = tempScores[student.id] || student.examResult
                        if (enteredScore !== undefined && enteredScore !== '') {
                          handleExamScoreSubmit(student.id, enteredScore)
                        }
                      }}
                      className="p-2 bg-[#8B5A2B] hover:bg-[#5C4033] text-white rounded-lg transition-all"
                      title="ውጤት መዝግብ"
                    >
                      <Shield size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-[1.5] flex flex-col justify-end">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 opacity-0"> ድርጊት </label>
                  {student.status === 'active' ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setStudentStatusWithConfirm(student, 'completed')}
                        className="flex-1 bg-[#E8F5E9] hover:bg-green-100 text-[#2E7D32] border border-[#A5D6A7] py-2 rounded-lg text-[10px] sm:text-xs font-extrabold transition-colors flex items-center justify-center"
                      >
                        <GraduationCap size={14} className="mr-1 hidden sm:block" /> ምረቅ
                      </button>
                      <button
                        onClick={() => setStudentStatusWithConfirm(student, 'dropped')}
                        className="flex-1 bg-[#FFEBEE] hover:bg-red-100 text-[#C62828] border border-[#EF9A9A] py-2 rounded-lg text-[10px] sm:text-xs font-extrabold transition-colors flex items-center justify-center"
                      >
                        <UserMinus size={14} className="mr-1 hidden sm:block" /> አቋርጧል
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setStudentStatusWithConfirm(student, 'active')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                    >
                      <Check size={16} className="mr-1" /> ወደ ትምህርት መልስ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredInfoStudents.length === 0 && (
            <p className="text-center text-[#8B5A2B] text-sm py-8 font-bold"> በዚህ ክፍል የተመዘገበ ተማሪ የለም። </p>
          )}
        </div>
      </div>
    )
  }

  const renderAttendanceView = () => {
    const filteredStudents = activeStudents.filter(
      s =>
        s.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
        (s.studentNo && s.studentNo.includes(attendanceSearch))
    )
    return (
      <div className="p-5 animate-fade-in pb-12 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-[#2E1A05] font-serif flex items-center gap-1">
            <EthiopianCross className="w-5 h-5 text-[#8B5A2B]" /> መገኘት መቆጣጠሪያ
          </h2>
          <button
            onClick={() => setReportConfig({ show: true, type: 'attendance', statusFilter: 'all' })}
            className="flex items-center gap-1 bg-[#8B5A2B] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-[#5C4033] border border-[#D4AF37] transition-colors"
          >
            <FileText size={14} /> ሪፖርት (PDF)
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-[#F5E6D3]/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-sm border-2 border-[#D2B48C] mb-5">
          <div>
            <span className="text-[10px] font-black text-[#5C4033] block mb-1"> ዓመተ ምሕረት፦ </span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-[#D2B48C] text-[#5C4033] font-bold py-2 px-1 rounded-xl text-xs focus:ring-1 focus:ring-[#8B5A2B]"
            >
              {ethiopianYears.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-[10px] font-black text-[#5C4033] block mb-1"> የዕለት ወር፦ </span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full bg-white border border-[#D2B48C] text-[#5C4033] font-bold py-2 px-1 rounded-xl text-xs focus:ring-1 focus:ring-[#8B5A2B]"
            >
              {ethiopianMonths.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-[10px] font-black text-[#5C4033] block mb-1"> ዕለት ቀን፦ </span>
            <select
              value={selectedDay}
              onChange={e => setSelectedDay(Number(e.target.value))}
              className="w-full bg-white border border-[#D2B48C] text-[#5C4033] font-bold py-2 px-1 rounded-xl text-xs focus:ring-1 focus:ring-[#8B5A2B]"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative mb-5">
          <Search size={18} className="absolute left-3 top-3.5 text-[#8B5A2B]/60" />
          <input
            type="text"
            placeholder="በስም ወይም በመለያ ቁጥር ይፈልጉ..."
            value={attendanceSearch}
            onChange={e => setAttendanceSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/95 border-2 border-[#EADDCA] rounded-xl text-sm font-bold shadow-sm"
          />
        </div>

        <div className="space-y-3">
          {filteredStudents.map(student => {
            const isPresent = student.attendance?.[currentPeriodKey]?.[selectedDay] || false
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border-2 border-[#EADDCA]"
              >
                <div
                  onClick={() => setSelectedStudentProfile(student)}
                  className="flex items-center space-x-4 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#F5E6D3] rounded-2xl flex items-center justify-center border-2 border-[#D2B48C] overflow-hidden">
                      {student.photo ? (
                        <img src={student.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-[#8B5A2B]" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-2 bg-[#2E1A05] border border-[#D4AF37] text-[#FAF3E0] text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      #{student.studentNo}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#2E1A05] text-sm">{student.name}</h3>
                    <p className="text-[10px] text-gray-500 font-bold">
                      {student.chosenDay} | {student.chosenTime}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleAttendanceWithConfirm(student, currentPeriodKey, selectedDay)}
                  className={`flex items-center justify-center w-11 h-11 rounded-full transition-all ${
                    isPresent
                      ? 'bg-green-100 text-[#2E7D32] border-2 border-green-400'
                      : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {isPresent ? (
                    <CheckCircle size={26} />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </button>
              </div>
            )
          })}
          {filteredStudents.length === 0 && (
            <p className="text-center text-[#8B5A2B] text-sm py-4 font-bold"> በመማር ላይ ያለ ተማሪ አልተገኘም። </p>
          )}
        </div>
      </div>
    )
  }

  const renderPaymentsView = () => {
    const filteredPaymentStudents = activeStudents.filter(
      s =>
        s.name.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        (s.studentNo && s.studentNo.includes(paymentSearch))
    )
    return (
      <div className="p-5 animate-fade-in pb-12 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-[#2E1A05] font-serif flex items-center gap-1">
            <EthiopianCross className="w-5 h-5 text-[#8B5A2B]" /> የክፍያ ቁጥጥር መዝገብ
          </h2>
          <button
            onClick={() => setReportConfig({ show: true, type: 'payment', statusFilter: 'all' })}
            className="flex items-center gap-1 bg-[#D4AF37] hover:bg-[#B8860B] text-[#2E1A05] px-3 py-2 rounded-lg text-xs font-black shadow-md border border-[#8B5A2B] transition-colors"
          >
            <FileText size={14} /> ሪፖርት (PDF)
          </button>
        </div>
        <div className="bg-[#F5E6D3]/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-sm border-2 border-[#D2B48C] grid grid-cols-2 gap-2 mb-5">
          <div>
            <span className="text-[10px] font-black text-[#5C4033] block mb-1"> ዓመተ ምሕረት፦ </span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-[#D2B48C] text-[#5C4033] font-bold py-2 px-3 rounded-xl text-xs focus:ring-1 focus:ring-[#8B5A2B]"
            >
              {ethiopianYears.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-[10px] font-black text-[#5C4033] block mb-1"> የዕለት ወር፦ </span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full bg-white border border-[#D2B48C] text-[#5C4033] font-bold py-2 px-3 rounded-xl text-xs focus:ring-1 focus:ring-[#8B5A2B]"
            >
              {ethiopianMonths.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative mb-5">
          <Search size={18} className="absolute left-3 top-3.5 text-[#8B5A2B]/60" />
          <input
            type="text"
            placeholder="በስም ወይም በመለያ ቁጥር ይፈልጉ..."
            value={paymentSearch}
            onChange={e => setPaymentSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/95 border-2 border-[#EADDCA] rounded-xl text-sm font-bold shadow-sm"
          />
        </div>

        <div className="space-y-4">
          {filteredPaymentStudents.map(student => {
            const isPaidForMonth = student.payments[currentPeriodKey] || false
            return (
              <div
                key={student.id}
                className="flex flex-col p-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-sm border-2 border-[#EADDCA]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                        isPaidForMonth ? 'bg-[#E8F5E9] border-green-400' : 'bg-[#FFEBEE] border-red-300'
                      }`}
                    >
                      <CreditCard size={20} className={isPaidForMonth ? 'text-[#2E7D32]' : 'text-[#C62828]'} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#2E1A05] text-sm">
                        {student.name}{' '}
                        <span className="text-[9px] bg-[#FAF3E0] px-1.5 rounded-full text-gray-600 font-bold">
                          #{student.studentNo}
                        </span>
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-bold">
                        {student.instrumentType} | {student.paymentAmount} ብር{' '}
                      </p>
                      <p className="text-[9px] text-gray-400">መዝገብ፦ {student.registrationDate || '-'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePaymentWithConfirm(student, currentPeriodKey)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                      isPaidForMonth
                        ? 'bg-green-100 text-[#2E7D32] border border-green-400'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                  >
                    {isPaidForMonth ? 'ከፍሏል (Paid)' : 'አልከፈለም (Unpaid)'}
                  </button>
                </div>
              </div>
            )
          })}
          {filteredPaymentStudents.length === 0 && (
            <p className="text-center text-[#8B5A2B] text-sm py-4 font-bold"> በመማር ላይ ያለ ተማሪ አልተገኘም። </p>
          )}
        </div>
      </div>
    )
  }

  const renderAiAssistantView = () => (
    <div className="p-5 animate-fade-in h-full flex flex-col pb-12 relative z-10">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8B5A2B] flex items-center justify-center shadow-lg border-2 border-[#FAF3E0]">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#2E1A05] font-serif"> የመረጃ መንፈሳዊ ረዳት </h2>
          <p className="text-xs text-[#8B5A2B] font-bold"> የሰው ሠራሽ አስተውሎት አጋዥ </p>
        </div>
      </div>
      <div className="flex-1 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-[#EADDCA] shadow-inner p-4 mb-4 overflow-y-auto min-h-[300px] flex flex-col relative">
        <div className="bg-[#FAF3E0] text-[#5C4033] p-4 rounded-2xl rounded-tl-none mb-4 max-w-[85%] text-sm shadow-sm border-2 border-[#D2B48C]">
          በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን። ሰላም መምህር፣ እኔ ታማኝ የመረጃ ረዳትዎ ነኝ። ስለ ተማሪዎች ክትትል፣ ክፍያ ወይም ስለትምህርት አሰጣጥ ጉዳዮች
          የፈለጉትን ይጠይቁኝ።
        </div>
        {aiResponse && (
          <div className="bg-[#5C4033] text-[#F5E6D3] p-4 rounded-2xl rounded-tr-none mb-4 max-w-[90%] self-end text-sm shadow-md whitespace-pre-wrap leading-relaxed font-semibold border border-[#D4AF37]">
            {aiResponse}
          </div>
        )}
        {isAiLoading && (
          <div className="flex items-center space-x-2 text-[#8B5A2B] self-end mb-4">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm font-bold"> ምላሽ በማዘጋጀት ላይ...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={askAI} className="relative mt-auto">
        <input
          type="text"
          value={aiQuery}
          onChange={e => setAiQuery(e.target.value)}
          placeholder="ጥያቄዎን ለመጻፍ እዚህ ይንኩ..."
          className="w-full pl-5 pr-14 py-4 bg-white/95 rounded-full border-2 border-[#D2B48C] shadow-lg text-sm font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
        />
        <button
          type="submit"
          disabled={isAiLoading || !aiQuery.trim()}
          className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-[#8B5A2B] text-white rounded-full flex items-center justify-center hover:bg-[#5C4033] disabled:opacity-50 shadow-md"
        >
          <Send size={18} className="ml-1" />
        </button>
      </form>
    </div>
  )

  return (
    <>
      <div className="app-ui h-screen bg-[#FAF4E8] font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col selection:bg-[#EADDCA]">
        {/* The Watermark Layer */}
        <WatermarkBackground />
        <header className="bg-gradient-to-r from-[#2E1A05] via-[#4A2E12] to-[#2E1A05] py-4 px-6 sticky top-0 z-20 shadow-xl border-b-4 border-[#D4AF37]">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-[#D4AF37]">
              <BegenaIcon className="w-8 h-8 drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-black text-center tracking-wide text-[#FFF8E7] font-serif drop-shadow-lg mt-0.5 flex items-center gap-1">
              አታኦስ በገና <EthiopianCross className="w-5 h-5 text-[#D4AF37]" />
            </h1>
          </div>
        </header>
        <div className="h-1 bg-gradient-to-r from-[#8B5A2B] via-[#D4AF37] to-[#8B5A2B] w-full relative z-20" />
        {notification.show && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[150] w-11/12 max-w-sm animate-fade-in hide-on-print">
            <div
              className={`p-3 rounded-2xl shadow-xl flex items-center space-x-3 border-2 ${
                notification.type === 'success'
                  ? 'bg-[#E8F5E9] border-green-500 text-[#1B5E20]'
                  : 'bg-[#FFEBEE] border-[#F44336] text-[#B71C1C]'
              }`}
            >
              <Info size={20} />
              <span className="font-extrabold text-xs">{notification.message}</span>
            </div>
          </div>
        )}
        {renderGlobalConfirmationModal()}
        {renderStudentProfileModal()}
        {renderReportModal()}
        <main className="flex-1 overflow-y-auto relative pb-24 scroll-smooth hide-on-print bg-transparent">
          {activeTab === 'dashboard' && renderDashboardView()}
          {activeTab === 'students' && renderRegistrationView()}
          {activeTab === 'academic' && renderAcademicView()}
          {activeTab === 'attendance' && renderAttendanceView()}
          {activeTab === 'payments' && renderPaymentsView()}
          {activeTab === 'ai' && renderAiAssistantView()}
        </main>
        <nav className="absolute bottom-4 left-3 right-3 bg-white/95 backdrop-blur-md border-2 border-[#D2B48C] rounded-full shadow-[0_8px_30px_rgba(139,90,43,0.3)] z-50 hide-on-print">
          <div className="flex justify-between items-center p-1.5 px-2 sm:px-4">
            {[
              { id: 'dashboard', icon: Home, label: 'ዋና ገጽ' },
              { id: 'students', icon: UserPlus, label: 'መዝግብ' },
              { id: 'academic', icon: BookOpen, label: 'መረጃ' },
              { id: 'ai', icon: Sparkles, label: 'ረዳት', special: true },
              { id: 'attendance', icon: CheckSquare, label: 'መገኘት' },
              { id: 'payments', icon: CreditCard, label: 'ክፍያ' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 relative ${
                  activeTab === item.id
                    ? item.special
                      ? 'bg-gradient-to-b from-[#D4AF37] to-[#8B5A2B] text-white shadow-lg border-2 border-[#FAF3E0] transform -translate-y-2'
                      : 'text-[#8B5A2B]'
                    : 'text-[#BCAAA4] hover:text-[#8D6E63]'
                }`}
              >
                {activeTab === item.id && !item.special && (
                  <span className="absolute inset-0 bg-[#FAF3E0] border border-[#D2B48C] rounded-full scale-110 -z-10" />
                )}
                <item.icon size={item.special ? 20 : 18} />
                {activeTab === item.id && !item.special && (
                  <span className="text-[8px] sm:text-[9px] font-black mt-0.5 absolute -bottom-3 text-[#5C4033]">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Ethiopic:wght@400;700;900&display=swap');
        body { font-family: 'Noto Serif Ethiopic', serif; margin: 0; padding: 0; background-color: #120A02; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        
        @media print {
          body, html { background-color: white !important; color: black !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
          .app-ui, .hide-on-print { display: none !important; }
          .hide-on-print-bg { background: transparent !important; position: static !important; inset: auto !important; }
          
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
          }
        }
      `,
        }}
      />
    </>
  )
}
