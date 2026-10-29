export const PROJECTS = [
  {line1: 'Today Royal', line2: 'I Land 27'},
  {line1: 'NMS', line2: 'One 27'},
  {line1: 'Satyam', line2: 'Skydeck'},
];

// kind 'big': large value + small unit line. kind 'text': body copy.
// win: index of the project that is best in this row (bold in the source table).
export type Row = {
  label: string;
  kind: 'big' | 'text';
  values: string[];
  unit?: string;
  win?: number;
  badge?: string;
};

export const ROWS: Row[] = [
  {label: '2 BHK Carpet Area', kind: 'big', values: ['663–808', '584–766', '827–839'], unit: 'Sq Ft', win: 2, badge: 'Largest'},
  {label: 'Price', kind: 'big', values: ['₹1.30–1.74', '₹1.58–1.74', '₹1.41–1.45'], unit: 'Crore', win: 0, badge: 'Lowest'},
  {label: 'Key Feature', kind: 'text', values: ['Aqua Gym & Creek Views', 'Kharghar Hills & Waterfall Views', '1-Min Walk To Central Park & Metro']},
  {label: 'Construction Status', kind: 'text', values: ['Slab Work Ongoing For 3rd Floor', 'Near Structural Completion', 'Excavation Has Started']},
  {label: 'Builder', kind: 'text', values: ['Today Royal Group & Shreeji Group', 'NMS Group', 'Satyam Builders']},
  {label: 'Possession', kind: 'big', values: ['Dec 2030', 'Dec 2027', 'Dec 2030'], win: 1, badge: 'Earliest'},
];
