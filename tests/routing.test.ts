import { describe, expect, it } from 'vitest';
import { doctorsForOption, findOption, resolvePrefill } from '@/lib/booking/treatments';
import { content, treatmentGroups } from './fixtures';

const groups = treatmentGroups();
const opt = (id: string) => findOption(groups, id)!.doctors;

describe('treatment → doctor routing map', () => {
  it('gum, cleaning, check-ups and cosmetic go to Dr. Sindhu', () => {
    for (const cat of ['gum-care', 'oral-hygiene', 'general-dentistry', 'cosmetic-dentistry']) {
      const group = groups.find((g) => g.id === `category:${cat}`)!;
      for (const o of group.options) expect(o.doctors).toContain('dr-sindhu');
    }
    expect(opt('problem:bleeding-gums')).toEqual(['dr-sindhu']);
    expect(opt('general')).toEqual(['dr-sindhu']);
  });

  it('extractions, wisdom teeth, oral surgery and implant surgery go to Dr. Preethi', () => {
    for (const o of groups.find((g) => g.id === 'category:oral-surgery')!.options) expect(o.doctors).toEqual(['dr-preethi']);
    expect(opt('problem:wisdom-tooth')).toEqual(['dr-preethi']);
    expect(opt('treatment:dental-implants/bone-grafting')).toEqual(['dr-preethi']);
    expect(opt('treatment:dental-implants/single-implant')).toContain('dr-preethi');
  });

  it('root canal, re-RCT and pulp therapy go to Dr. Naveen Kumar', () => {
    for (const s of ['rct', 're-rct', 'pulp-therapy']) expect(opt(`treatment:root-canal-treatment/${s}`)).toEqual(['dr-naveen-kumar']);
  });

  it('implants (prosthetic), dentures and orthodontics route to Dr. Sindhu and are flagged for confirmation', () => {
    const flagged = content.services.categories.filter((c: { confirmSpecialist: boolean }) => c.confirmSpecialist).map((c: { slug: string }) => c.slug).sort();
    expect(flagged).toEqual(['dental-implants', 'dentures', 'orthodontics']);
    expect(opt('treatment:dental-implants/implant-dentures')).toEqual(['dr-sindhu']);
    for (const o of groups.find((g) => g.id === 'category:dentures')!.options) expect(o.doctors).toEqual(['dr-sindhu']);
    for (const o of groups.find((g) => g.id === 'category:orthodontics')!.options) expect(o.doctors).toEqual(['dr-sindhu']);
  });

  it('every one of the 9 categories and every option has at least one doctor', () => {
    expect(groups.filter((g) => g.id.startsWith('category:'))).toHaveLength(9);
    for (const g of groups) for (const o of g.options) expect(o.doctors.length).toBeGreaterThan(0);
  });

  it('deep links pre-fill the wizard', () => {
    expect(resolvePrefill(groups, { problem: 'toothache' }).treatmentId).toBe('problem:toothache');
    expect(resolvePrefill(groups, { treatment: 'root-canal-treatment' }).treatmentId).toBe('treatment:root-canal-treatment/rct');
    const doc = resolvePrefill(groups, { doctor: 'dr-preethi' });
    expect(findOption(groups, doc.treatmentId)!.doctors).toContain('dr-preethi');
    expect(resolvePrefill(groups, { problem: 'nope' }).treatmentId).toBeNull();
  });

  it('a preferred doctor narrows a multi-doctor option only when they treat it', () => {
    const o = findOption(groups, 'problem:toothache');
    expect(doctorsForOption(o, 'dr-naveen-kumar')).toEqual(['dr-naveen-kumar']);
    expect(doctorsForOption(o, 'dr-preethi')).toEqual(o!.doctors);
  });
});
