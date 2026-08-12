import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';
import ProgressBar from './ProgressBar';

export default function SkillsSection({ settings = {} }) {
  const skills = settings.skills || [];
  if (!skills.length && !settings.skillsTitle) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Our Skills</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mt-2 mb-4">
              {settings.skillsTitle || 'Skills That Shape Your Dream Home'}
            </h2>
            {settings.skillsBody && (
              <p className="text-stone-600 leading-relaxed mb-8">{settings.skillsBody}</p>
            )}
            <Link to="/consultation" className="btn-terracotta inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm">
              Book a Free Design Visit <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <div className="space-y-8">
            {skills.map((skill, i) => (
              <ProgressBar key={skill.label} label={skill.label} value={skill.value} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
