import mongoose from 'mongoose';

const navChildSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const navItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    openInNewTab: { type: Boolean, default: false },
    placement: {
      type: String,
      enum: ['header', 'footer'],
      default: 'header',
    },
    menuType: {
      type: String,
      enum: ['link', 'mega'],
      default: 'link',
    },
    megaMenuSource: {
      type: String,
      enum: ['none', 'services', 'projects', 'design-styles', 'custom'],
      default: 'none',
    },
    megaMenuTitle: { type: String, default: '' },
    megaMenuCtaLabel: { type: String, default: '' },
    megaMenuCtaPath: { type: String, default: '' },
    children: [navChildSchema],
  },
  { timestamps: true }
);

export const NavItem = mongoose.model('NavItem', navItemSchema);
