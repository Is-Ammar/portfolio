import React, { useState } from 'react';
import { m, Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { SKILLS } from '../constants';
import { DURATION, EASE_OUT, fadeInUp } from '../utils/motion';
import { CARD_GLOWS, SKILL_FALLBACK_ICON, SKILL_ICONS } from './skillIcons';

// Mobile-only skill cards with drag to reorder. Loaded as its own chunk, so
// the drag code never reaches desktop visitors.
export default function SkillReorderLists() {
  const [groups, setGroups] = useState(() => SKILLS.map((cat) => ({ ...cat, skills: [...cat.skills] })));

  const handleReorder = (index: number, nextOrder: string[]) => {
    setGroups((prev) => prev.map((cat, i) => (i === index ? { ...cat, skills: nextOrder } : cat)));
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {groups.map((cat, index) => (
        <m.div
          key={cat.name}
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-bg-elev-1/80 p-6 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.04)_inset]"
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute -inset-0.5 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                CARD_GLOWS[index % CARD_GLOWS.length]
              }`}
            />
          </div>
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-2">{cat.name}</h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">{cat.skills.length}</span>
            </div>
            <Reorder.Group
              axis="y"
              values={cat.skills}
              onReorder={(nextOrder) => handleReorder(index, nextOrder)}
              className="list-none space-y-3"
            >
              {cat.skills.map((skill) => (
                <SkillItem key={skill} skill={skill} />
              ))}
            </Reorder.Group>
          </div>
        </m.div>
      ))}
    </div>
  );
}

// Only the grip starts a drag, so touching the rest of the row still scrolls
// the page on phones.
const SkillItem = ({ skill }: { skill: string }) => {
  const controls = useDragControls();
  const Icon = SKILL_ICONS[skill] ?? SKILL_FALLBACK_ICON;

  return (
    <Reorder.Item
      value={skill}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.03, boxShadow: 'var(--glow)' }}
      transition={{ duration: DURATION.xs, ease: EASE_OUT }}
      className="relative flex select-none items-center gap-3 rounded-2xl border border-white/10 bg-bg/70 px-3 py-2 font-mono text-sm text-text-muted"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-bg-elev-2 text-accent">
        <Icon size={16} />
      </span>
      <span>{skill}</span>
      <button
        type="button"
        aria-label={`Drag to reorder ${skill}`}
        onPointerDown={(event) => controls.start(event)}
        className="ml-auto -mr-1 cursor-grab touch-none rounded-lg p-2 text-text-muted/60 active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </button>
    </Reorder.Item>
  );
};
