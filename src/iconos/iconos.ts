import {
  Home,
  Users,
  Wrench,
  CreditCard,
  Droplet,
  Book,
  Bell,
  Map,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronDown,
  // Nuevos íconos usados en la BD:
  BarChart,
  AlertTriangle,
  ClipboardList,
  Activity,
  DollarSign,
  FileText,
  BookOpen,
  BarChart2,
  Edit3,
  MapPin,
  Archive,
  CheckSquare,
} from "lucide-react"

const iconMap = {
  Home,
  Users,
  Wrench,
  CreditCard,
  Droplet,
  Map,
  Book,
  Bell,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronDown,

  // Nuevos
  BarChart,
  AlertTriangle,
  ClipboardList,
  Activity,
  DollarSign,
  FileText,
  BookOpen,
  BarChart2,
  Edit3,
  MapPin,
  Archive,
  CheckSquare,
} as const

export type IconName = keyof typeof iconMap
export default iconMap
