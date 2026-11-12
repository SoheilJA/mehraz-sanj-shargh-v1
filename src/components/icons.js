import { createIcons } from 'lucide'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Landmark,
  Layers,
  Link,
  Mail,
  Map,
  MapPin,
  PenLine,
  Phone,
  Plus,
  Search,
  Send,
  X,
} from 'lucide'

/** Only the icons actually used across the site — keeps the bundle small. */
const icons = {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Landmark,
  Layers,
  Link,
  Mail,
  Map,
  MapPin,
  PenLine,
  Phone,
  Plus,
  Search,
  Send,
  X,
}

/** Initialize all lucide icons present in the current DOM. */
export function initIcons() {
  try {
    createIcons({ icons })
  } catch (err) {
    console.warn('lucide icons failed:', err)
  }
}
