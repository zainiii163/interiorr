import {
  ShieldCheck,
  ClipboardList,
  CalendarCheck,
  BadgeDollarSign,
  PencilRuler,
  FileCheck2,
  Hammer,
  Building2,
  Paintbrush,
  Users,
  Shield,
  Award,
  Building,
  Star,
  Sparkles,
} from 'lucide-react';

const ICON_MAP = {
  ShieldCheck,
  ClipboardList,
  CalendarCheck,
  BadgeDollarSign,
  PencilRuler,
  FileCheck2,
  Hammer,
  Building2,
  Paintbrush,
  Users,
  Shield,
  Award,
  Building,
  Star,
  Sparkles,
};

export function getPillarIcon(name) {
  return ICON_MAP[name] || ShieldCheck;
}
