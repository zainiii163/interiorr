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
  Receipt,
  Package,
  HardHat,
  Palette,
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
  Receipt,
  Package,
  HardHat,
  Palette,
};

export function getPillarIcon(name) {
  return ICON_MAP[name] || ShieldCheck;
}
